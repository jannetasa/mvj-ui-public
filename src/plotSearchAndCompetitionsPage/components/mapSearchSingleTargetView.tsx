import React, { ReactNode } from 'react';
import { Button, IconAngleLeft } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';

import { PlanUnit } from '../../plotSearch/types';
import { ApiAttributeChoice, ApiAttributes } from '../../api/types';
import { SelectedTarget } from '../plotSearchAndCompetitionsPage';
import { RootState } from '../../root/rootReducer';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

interface State {
  plotSearchAttributes: ApiAttributes;
}

interface Props {
  plotSearchAttributes: ApiAttributes;
  selectedTarget: SelectedTarget;
  setSelectedTarget: (target: SelectedTarget) => void;
}

const MapSearchSingleTargetView = ({
  plotSearchAttributes,
  selectedTarget,
  setSelectedTarget,
}: Props) => {
  const { t, i18n } = useTranslation();

  const LeftColumn = ({ children }: { children: ReactNode }): JSX.Element => (
    <Col xs={6} component="dt">
      {children}
    </Col>
  );
  const RightColumn = ({ children }: { children: ReactNode }): JSX.Element => (
    <Col xs={6} component="dd">
      {children}
    </Col>
  );

  const getPlanUnitOptionTitle = (field: keyof PlanUnit): string => {
    return (
      plotSearchAttributes.plot_search_targets?.child?.children?.plan_unit?.children?.[
        field
      ]?.choices?.find(
        (choice: ApiAttributeChoice) => choice.value === target.plan_unit[field]
      )?.display_name || '???'
    );
  };

  if (!selectedTarget) {
    return null;
  }
  const { target, plotSearch } = selectedTarget;
  const currentLanguageInfoLinks = target.info_links.filter(
    (link) => link.language === i18n.language
  );

  return (
    <div className="MapSearchSingleTargetView">
      <Button
        onClick={() => setSelectedTarget(null)}
        variant="secondary"
        size="small"
        iconLeft={<IconAngleLeft />}
      >
        {t(
          'plotSearchAndCompetitions.mapView.sidebar.singleTarget.returnToList',
          'Return to list'
        )}
      </Button>

      <Breadcrumbs
        items={[
          { label: plotSearch.type.name },
          { label: plotSearch.subtype.name },
        ]}
      />

      <h2>{plotSearch.name}</h2>
      <dl>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.applyByDate',
              'Apply by'
            )}
          </LeftColumn>
          <RightColumn>
            {plotSearch.end_at
              ? new Date(plotSearch.end_at).toLocaleString('fi', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : '???'}
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.plotNumber',
              'Plot'
            )}
          </LeftColumn>
          <RightColumn>{target.plan_unit.plot_division_identifier}</RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.address',
              'Address'
            )}
          </LeftColumn>
          <RightColumn>{target.lease_address.address}</RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.detailedPlanIdentifier',
              'Detailed plan identifier'
            )}
          </LeftColumn>
          <RightColumn>{target.plan_unit.detailed_plan_identifier}</RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.detailedPlanState',
              'Detailed plan state'
            )}
          </LeftColumn>
          <RightColumn>{getPlanUnitOptionTitle('plan_unit_state')}</RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.intendedUse',
              'Intended use'
            )}
          </LeftColumn>
          <RightColumn>
            {getPlanUnitOptionTitle('plan_unit_intended_use')}
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.permittedBuildArea',
              'Permitted build floor area (floor-m²)'
            )}
          </LeftColumn>
          <RightColumn>
            {/* {target.plan_unit.permitted_build_floor_area_commercial?.toLocaleString(i18n.language) || '???'} */}
            ???
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.permittedBuildAreaResidential',
              'Permitted build residential floor area (floor-m²)'
            )}
          </LeftColumn>
          <RightColumn>
            {/* {target.plan_unit.permitted_build_floor_area_residential?.toLocaleString(i18n.language) || '???'} */}
            ???
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.permittedBuildAreaCommercial',
              'Permitted build commercial floor area (floor-m²)'
            )}
          </LeftColumn>
          <RightColumn>
            {/* {target.plan_unit.permitted_build_floor_area_commercial?.toLocaleString(i18n.language) || '???'} */}
            ???
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.area',
              'Area (m²)'
            )}
          </LeftColumn>
          <RightColumn>
            {target.plan_unit.area?.toLocaleString(i18n.language) || '???'}
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.firstSuitableConstructionYear',
              'First suitable construction year'
            )}
          </LeftColumn>
          <RightColumn>
            {/* {target.plan_unit.first_suitable_construction_year} */}
            ???
          </RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.hitas',
              'HITAS'
            )}
          </LeftColumn>
          <RightColumn>{target.lease_hitas || '???'}</RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.financingMethod',
              'Financing method'
            )}
          </LeftColumn>
          <RightColumn>{target.lease_financing || '???'}</RightColumn>
        </Row>
        <Row>
          <LeftColumn>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.management',
              'Management method'
            )}
          </LeftColumn>
          <RightColumn>{target.lease_management || '???'}</RightColumn>
        </Row>
      </dl>

      {currentLanguageInfoLinks.length > 0 && (
        <>
          <h3>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.infoLinks',
              'Details'
            )}
          </h3>
          <ul className="MapSearchSingleTargetView__info-links">
            {currentLanguageInfoLinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.description}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <Button className="MapSearchSingleTargetView__next-button">
        {t(
          'plotSearchAndCompetitions.mapView.sidebar.singleTarget.applyButton',
          'Apply for this plot'
        )}
      </Button>
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    plotSearchAttributes: state.plotSearch.plotSearchAttributes,
  })
)(MapSearchSingleTargetView);