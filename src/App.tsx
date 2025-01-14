import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Oidc, { User } from 'oidc-client';
import { setConfiguration as setGridSystemConfiguration } from 'react-grid-system';

import TopNavigation from './topNavigation/topNavigation';
import Footer from './footer/footer';
import LoginModal from './login/loginModal';
import { RootState } from './root/rootReducer';
import { getIsFetchingApiToken, getUser } from './auth/selectors';
import { fetchApiToken, receiveApiToken } from './auth/actions';
import { fetchFavourite } from './favourites/actions';
import GlobalNotificationContainer from './globalNotification/globalNotificationContainer';
import { getIsFetchingFavourite } from './favourites/selectors';

// https://hds.hel.fi/design-tokens/breakpoints
// (container widths adjusted with gutters included)
// TODO: gutter width should be 12/16 in smaller sizes, but isn't configurable on a size class basis
setGridSystemConfiguration({
  breakpoints: [320, 576, 768, 992, 1248],
  containerWidths: [312, 568, 744, 968, 1224],
  gutterWidth: 24,
});

import './main.scss';

interface Props {
  children?: JSX.Element;
  user: User | null;
  fetchApiToken: (accessToken: string) => void;
  fetchFavourite: () => void;
  isFetchingFavourite: boolean;
  receiveApiToken: (token: string) => void;
  isFetchingToken: boolean;
}

Oidc.Log.logger = console;

const App = ({
  children,
  user,
  fetchApiToken,
  fetchFavourite,
  isFetchingFavourite,
  receiveApiToken,
  isFetchingToken,
}: Props): JSX.Element => {
  const [tokenOutdated, setTokenOutdated] = useState<boolean>(true);
  const [tokenRefreshTimeout, setTokenRefreshTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (user) {
      if (tokenOutdated && !isFetchingToken) {
        fetchApiToken(user.access_token);
        setTokenOutdated(false);

        setTokenRefreshTimeout(
          setTimeout(() => {
            setTokenOutdated(true);
          }, 1000 * 60 * 10)
        );
      }
      if (!isFetchingFavourite) {
        fetchFavourite();
      }
    } else {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
        setTokenRefreshTimeout(null);
        setTokenOutdated(true);
        receiveApiToken('');
      }
    }
  }, [user, tokenOutdated, isFetchingToken]);

  return (
    <div className="App">
      <LoginModal />
      <TopNavigation />
      <GlobalNotificationContainer />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default connect(
  (state: RootState) => ({
    user: getUser(state),
    isFetchingToken: getIsFetchingApiToken(state),
    isFetchingFavourite: getIsFetchingFavourite(state),
  }),
  { fetchApiToken, receiveApiToken, fetchFavourite }
)(App);
