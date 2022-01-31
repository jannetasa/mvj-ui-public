import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from '../App';
import FrontPage from '../frontPage/frontPage';
import ErrorPage from '../errorPage/errorPage';
import PlotSearchAndCompetitionsPage from '../plotSearchAndCompetitionsPage/plotSearchAndCompetitionsPage';
import FavouritesPage from '../favouritesPage/favouritesPage';
import FinalizeLogin from '../auth/components/finalizeLogin';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import ApplicationPage from '../application/applicationPage';

export const AppRoutes = {
  HOME: 'home',
  ERROR: 'error',
  PLOT_SEARCH_AND_COMPETITIONS: 'plot-search-and-competitions',
  PLOT_SEARCH_AND_COMPETITIONS_TARGET: 'plot-search-and-competitions-target',
  OTHER_COMPETITIONS_AND_SEARCHES: 'other-competitions-and-searches',
  AREA_SEARCH: 'area-search',
  LEASES: 'leases',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
  FAVOURITES: 'favourites',
  OIDC_CALLBACK: 'oidc-callback',
  APPLICATION_FORM: 'application-form',
  APPLICATION_PREVIEW: 'application-preview',
  APPLICATION_SUBMIT: 'application-submit',
};

/**
 * Get route by id
 * @param {string} id
 * @returns {string}
 */
export const getRouteById = (id: string): string => {
  const routes = {
    [AppRoutes.HOME]: '/',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS]: '/tonttihaut-ja-kilpailut',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET]:
      '/tonttihaut-ja-kilpailut/kohteet/',
    [AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES]: '/muut-kilpailut-ja-haut',
    [AppRoutes.AREA_SEARCH]: '/aluehaku',
    [AppRoutes.LEASES]: '/vuokraukset',
    [AppRoutes.APPLICATIONS]: '/hakemukset',
    [AppRoutes.MESSAGES]: '/viestit',
    [AppRoutes.FAVOURITES]: '/suosikit',
    [AppRoutes.OIDC_CALLBACK]: '/oidc/callback',
    [AppRoutes.APPLICATION_FORM]: '/tee-hakemus/tietojen-taytto',
    [AppRoutes.APPLICATION_PREVIEW]: '/tee-hakemus/tietojen-tarkistus',
    [AppRoutes.APPLICATION_SUBMIT]: '/tee-hakemus/lahetys',
  };

  return routes[id] ? routes[id] : '';
};

const SiteRoutes = (): JSX.Element => {
  const RouteWithLoader = ({
    children,
  }: {
    children: JSX.Element | null;
  }): JSX.Element | null => (
    <AuthDependentContent>
      {(loading, loggedIn) => {
        if (!loggedIn || !loading) {
          return children || null;
        }

        return <BlockLoader />;
      }}
    </AuthDependentContent>
  );

  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route
            path={getRouteById(AppRoutes.OIDC_CALLBACK)}
            element={<FinalizeLogin />}
          />
          <Route
            path="/"
            element={
              <RouteWithLoader>
                <FrontPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}
            element={
              <RouteWithLoader>
                <PlotSearchAndCompetitionsPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={
              getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET) +
              ':id'
            }
            element={
              <RouteWithLoader>
                <PlotSearchAndCompetitionsPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}
            element={
              <RouteWithLoader>
                <div>Muut kilpailut ja haut</div>
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.AREA_SEARCH)}
            element={
              <RouteWithLoader>
                <div>Aluehakusivu</div>
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.FAVOURITES)}
            element={
              <RouteWithLoader>
                <FavouritesPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.APPLICATION_FORM)}
            element={<ApplicationPage />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </App>
    </BrowserRouter>
  );
};

export default SiteRoutes;
