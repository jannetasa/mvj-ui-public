import React, { ChangeEvent, Fragment, ReactNode } from 'react';
import classNames from 'classnames';
import {
  Checkbox,
  IconAngleDown,
  IconAngleUp,
  IconArrowRight,
  Notification,
  useAccordion,
} from 'hds-react';
import { Row, Col, Container } from 'react-grid-system';

import SidePanel from '../../panel/sidePanel';
import MapSymbol from './mapSymbol';
import {
  CategoryOptions,
  CategoryVisibilities,
  SelectedTarget,
} from '../plotSearchAndCompetitionsPage';
import { PlotSearch, PlotSearchTarget } from '../../plotSearch/types';
import IconButton from '../../button/iconButton';
import { useTranslation } from 'react-i18next';
import MapSearchSingleTargetView from './mapSearchSingleTargetView';
import { AddTargetPayload, Favourite } from '../../favourites/types';
import { defaultLanguage } from '../../i18n';
import { renderDateTime } from '../../i18n/utils';
import { connect } from 'react-redux';
import {
  addFavouriteTarget,
  removeFavouriteTarget,
} from '../../favourites/actions';

interface MapSearchComponentAccordionProps {
  isHidden: boolean;
  initiallyOpen?: boolean;
  children?: ReactNode;
  heading: ReactNode;
  symbol?: string;
  colorIndex?: number;
  onToggleVisibility?: (isVisible: boolean) => void;
  isVisible: boolean;
}

const SIDEBAR_GUTTER_WIDTH = 5; // px

const MapSearchComponentAccordion = ({
  isHidden,
  initiallyOpen = false,
  isVisible,
  onToggleVisibility,
  children,
  heading,
  symbol,
  colorIndex = 0,
}: MapSearchComponentAccordionProps): JSX.Element | null => {
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen });

  const onVisibilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onToggleVisibility) {
      onToggleVisibility(e.target.checked);
    }
  };

  const Icon = isOpen ? IconAngleUp : IconAngleDown;

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={classNames('MapSearchComponent__accordion', {
        'MapSearchComponent__accordion--expanded': isOpen,
      })}
    >
      <Container className="MapSearchComponent__accordion-heading">
        <Row gutterWidth={SIDEBAR_GUTTER_WIDTH}>
          <Col xs={2}>
            <Checkbox
              checked={isVisible}
              id={symbol || ''}
              onChange={onVisibilityChange}
            />
            {symbol && <MapSymbol symbol={symbol} colorIndex={colorIndex} />}
          </Col>
          <Col
            className="MapSearchComponent__accordion-heading-toggler"
            xs={10}
            role="button"
            {...buttonProps}
          >
            <span>{heading}</span>
            <Icon size="s" aria-hidden="true" />
          </Col>
        </Row>
      </Container>
      <div className="MapSearchComponent__accordion-body" {...contentProps}>
        {children}
      </div>
    </div>
  );
};

interface MapSearchComponentProps {
  categoryOptions: CategoryOptions;
  categoryVisibilities: CategoryVisibilities;
  onToggleVisibility: (id: number, isVisible: boolean) => void;
  plotSearches: Array<PlotSearch>;
  setSelectedTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  addFavouriteTarget: (payLoad: AddTargetPayload) => void;
  removeFavouriteTarget: (id: number) => void;
  isOpen: boolean;
  toggle: (newValue: boolean) => void;
  favourite: Favourite;
}

const MapSearchComponent = ({
  categoryVisibilities,
  categoryOptions,
  onToggleVisibility,
  plotSearches,
  setSelectedTarget,
  selectedTarget,
  addFavouriteTarget,
  removeFavouriteTarget,
  favourite,
  isOpen,
  toggle,
}: MapSearchComponentProps): JSX.Element => {
  const { t } = useTranslation();

  const plotSearchesByCategory = categoryOptions.map((category) => ({
    category,
    plotSearches: plotSearches?.filter((plotSearch) => {
      if (plotSearch.type?.id === category.id) {
        if (favourite.targets.length <= 0) {
          return true;
        }
        return favourite.targets[0].plot_search === plotSearch.id;
      }
    }),
  }));

  const checkHidden = (plotSearches: PlotSearch[]): boolean => {
    if (favourite.targets.length <= 0) {
      return false;
    }

    return !plotSearches.some((s) => s.id === favourite.targets[0].plot_search);
  };

  return (
    <SidePanel className="MapSearchComponent" isOpen={isOpen} toggle={toggle}>
      {selectedTarget && (
        <MapSearchSingleTargetView
          addFavouriteTarget={addFavouriteTarget}
          selectedTarget={selectedTarget}
          setSelectedTarget={setSelectedTarget}
          favourite={favourite}
          removeFavouriteTarget={removeFavouriteTarget}
        />
      )}
      <div className="MapSearchComponent__list-view">
        <Row
          gutterWidth={SIDEBAR_GUTTER_WIDTH}
          className="MapSearchComponent__list-headings"
        >
          <Col xs={2}>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.typeHeadings.showThisType',
              'Show'
            )}
          </Col>
          <Col xs={10}>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.typeHeadings.type',
              'Type'
            )}
          </Col>
        </Row>
        {plotSearchesByCategory.map((item, index) => {
          return (
            <MapSearchComponentAccordion
              isHidden={checkHidden(item.plotSearches)}
              heading={`${item.category.name} (${item.plotSearches.length})`}
              symbol={item.category.symbol}
              colorIndex={index}
              key={index}
              isVisible={categoryVisibilities[item.category.id] || false}
              onToggleVisibility={(isVisible: boolean) =>
                onToggleVisibility(item.category.id, isVisible)
              }
            >
              {item.category.subtypes.map((subtype) => {
                const matchingPlotSearches = item.plotSearches.filter(
                  (plotSearch) => plotSearch.subtype.id === subtype.id
                );

                if (matchingPlotSearches.length === 0) {
                  return null;
                }

                type SectionSlice = {
                  heading: string;
                  headingExtra?: {
                    endDate?: string;
                  };
                  key: string | number;
                  targets: Array<{
                    relatedPlotSearch: PlotSearch;
                    data: PlotSearchTarget;
                  }>;
                };
                let sections: Array<SectionSlice>;

                if (subtype.show_district) {
                  const districts = matchingPlotSearches.reduce((acc, next) => {
                    next.plot_search_targets.forEach((target) => {
                      if (!acc[target.district]) {
                        acc[target.district] = {
                          heading: target.district,
                          key: target.district,
                          targets: [],
                        };
                      }

                      acc[target.district].targets.push({
                        relatedPlotSearch: next,
                        data: target,
                      });
                    });

                    return acc;
                  }, {} as Record<string, SectionSlice>);

                  const districtNames = Object.keys(districts);
                  districtNames.sort((a, b) => (a > b ? 1 : -1));

                  sections = districtNames.map(
                    (district) => districts[district]
                  );
                } else {
                  sections = matchingPlotSearches.map((plotSearch) => ({
                    heading: plotSearch.name,
                    headingExtra: {
                      endDate: plotSearch.end_at,
                    },
                    key: plotSearch.id,
                    targets: plotSearch.plot_search_targets.map((target) => ({
                      relatedPlotSearch: plotSearch,
                      data: target,
                    })),
                  }));
                }

                return (
                  <Fragment key={subtype.id}>
                    <h3 className="MapSearchComponent__plot-search-subtype-heading">
                      {subtype.name}
                    </h3>
                    <Row
                      gutterWidth={SIDEBAR_GUTTER_WIDTH}
                      className="MapSearchComponent__list-headings"
                    >
                      <Col xs={2}>
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.plotNumber',
                          'Plot'
                        )}
                      </Col>
                      <Col xs={3}>
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.address',
                          'Address'
                        )}
                      </Col>
                      <Col xs={2} style={{ hyphens: 'auto' }}>
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.intendedUse',
                          'Intended use'
                        )}
                      </Col>
                      <Col xs={2} style={{ hyphens: 'auto' }}>
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.permittedBuildArea',
                          'Permitted build floor area (m²)'
                        )}
                      </Col>
                      <Col xs={2}>
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.area',
                          'Area (m²)'
                        )}
                      </Col>
                      <Col xs={1} />
                    </Row>
                    <div role="list">
                      {sections.map((section) => (
                        <div key={section.key} role="listitem">
                          <div className="MapSearchComponent__plot-search-heading">
                            <h4>{section.heading}</h4>
                            {section.headingExtra?.endDate && (
                              <span>
                                {t(
                                  'plotSearchAndCompetitions.mapView.sidebar.sectionApplyBy',
                                  'Apply by {{date}}',
                                  {
                                    date: renderDateTime(
                                      new Date(section.headingExtra.endDate)
                                    ),
                                  }
                                )}
                              </span>
                            )}
                          </div>
                          <div role="list">
                            {section.targets.map((target) => (
                              <Row
                                className={classNames(
                                  'MapSearchComponent__target',
                                  {
                                    'MapSearchComponent__target--favourited':
                                      favourite.targets.some(
                                        (t) =>
                                          t.plot_search_target.id ===
                                          target.data.id
                                      ),
                                  }
                                )}
                                key={target.data.id}
                                role="listitem"
                                gutterWidth={SIDEBAR_GUTTER_WIDTH}
                                align="center"
                              >
                                <Col xs={2}>
                                  {
                                    target.data.plan_unit
                                      .plot_division_identifier
                                  }
                                </Col>
                                <Col
                                  xs={3}
                                  className="MapSearchComponent__target-address"
                                >
                                  {target.data.lease_address.address}
                                </Col>
                                <Col xs={2}>
                                  {/* TODO: actual short code instead of numeric ID */}
                                  {target.data.plan_unit
                                    .plan_unit_intended_use || '?'}
                                </Col>
                                <Col xs={2}>?</Col>
                                <Col xs={2}>
                                  {target.data.plan_unit.area?.toLocaleString(
                                    defaultLanguage
                                  ) || '?'}
                                </Col>
                                <Col xs={1}>
                                  <IconButton
                                    onClick={() =>
                                      setSelectedTarget({
                                        target: target.data,
                                        plotSearch: target.relatedPlotSearch,
                                      })
                                    }
                                  >
                                    <IconArrowRight size="s" />
                                  </IconButton>
                                </Col>
                              </Row>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Fragment>
                );
              })}
            </MapSearchComponentAccordion>
          );
        })}
      </div>
      {favourite.targets.length > 0 && (
        <div className="MapSearchComponent__notification">
          <Notification
            type="alert"
            label={
              t(
                'plotSearchAndCompetitions.mapView.sidebar.notification.title',
                'Attention!'
              ) as string
            }
          >
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.notification.body',
              'You can attend only in one plot search per application. \n\n ' +
                'If one plot search contains multiple searchable targets, you can add ' +
                'those in the same application.\n\n' +
                'If you want to attend other plot search, you need to fill new application ' +
                'for every plot search.'
            )}
          </Notification>
        </div>
      )}
    </SidePanel>
  );
};

export default connect(null, { addFavouriteTarget, removeFavouriteTarget })(
  MapSearchComponent
);
