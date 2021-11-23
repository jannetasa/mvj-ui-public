import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../root/rootReducer';
// import { Tabs, TabPanel, TabList, Tab } from 'hds-react';
import Tabs from '../tabs/tabs';
import TabPane from '../tabs/tabPane';
import TabContent from '../tabs/tabContent';
import MapSearchComponent from './components/mapSearchComponent';
import MapComponent from '../map/mapComponent';
import { fetchPlotSearches } from '../plotSearch/actions';

import { Language } from '../language/types';
import translations from './translations';

interface State {
  currentLanguage: Language;
}

interface Props {
  currentLanguage: string;
  fetchPlotSearches: () => void;
}

const PlotSearchAndCompetitionsPage = (props: Props): JSX.Element => {
  const { currentLanguage, fetchPlotSearches } = props;
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();
  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');
  const tabId: number = tab !== null ? parseInt(tab) : 0;

  useEffect(() => {
    fetchPlotSearches();
  }, []);

  if (tabId != activeTab) {
    setActiveTab(tabId);
  }

  const handleTabClick = (
    tabId: number,
    setActiveTab: (tab: number) => void
  ): void => {
    setActiveTab(tabId);
    navigate({
      pathname: location.pathname,
      search: `?tab=${tabId}`,
    });
  };

  return (
    <div className={'container'}>
      <Tabs
        active={activeTab}
        tabs={[
          {
            label: translations[currentLanguage].MAP_SEARCH,
          },
          {
            label: translations[currentLanguage].LIST,
          },
        ]}
        onTabClick={(id) => handleTabClick(id, setActiveTab)}
      />
      <TabContent active={activeTab}>
        <TabPane>
          <Fragment>
            <MapSearchComponent />
            <MapComponent />
          </Fragment>
        </TabPane>
        <TabPane>
          <div>...</div>
        </TabPane>
      </TabContent>
    </div>
  );
};

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default connect(mapStateToProps, {
  fetchPlotSearches,
})(PlotSearchAndCompetitionsPage);
