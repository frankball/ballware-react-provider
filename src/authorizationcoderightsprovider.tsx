/**
 * @license
 * Copyright 2021 Frank Ballmeyer
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */

import React, {
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
  useCallback,
} from 'react';

import moment from 'moment';

import { RightsContext, RightsContextState } from '@ballware/react-contexts';

import { SettingsContext, NotificationContext } from '@ballware/react-contexts';

import { Route, useHistory } from 'react-router-dom';

import {
  SessionWithUserInfo,
  UserInfoMappingFunc,
} from '@ballware/identity-interface';

import { UserManager, WebStorageStateStore } from 'oidc-client';

/**
 * Property set for authorization code flow rights provider
 */
export interface AuthorizationCodeRightsProviderProps {
  /**
   * Url of authentication provider
   */
  authority: string;

  /**
   * Client application identifier
   */
  client: string;

  /**
   * Optional client secret needed for client application
   */
  secret?: string;

  /**
   * Url in application called for result of login
   */
  redirect_uri: string;

  /**
   * Url in application called after user has logged out
   */
  post_logout_redirect_uri: string;

  /**
   * Response type returned to application from authentication provider
   */
  response_type?: string;

  /**
   * Authentication scopes needed by application
   */
  scope: string;

  /**
   * Optional uri for redirect to account management portal for authenticated user
   */
  account_management_uri?: string;

  /**
   * Mapping function to map additional content of userinfo endpoint to user rights instance
   */
  userinfoMapper: UserInfoMappingFunc;
}

/**
 * Callback component for accepting result of authentication provider
 */
const OidcAuthCallback = ({
  redirectCallback,
}: {
  redirectCallback: () => void;
}) => {
  useEffect(() => {
    if (redirectCallback) {
      redirectCallback();
    }
  }, [redirectCallback]);

  return <React.Fragment>Login successful</React.Fragment>;
};

/**
 * Provides authentication functionality via authorization code flow
 */
export const AuthorizationCodeRightsProvider = ({
  authority,
  client,
  secret,
  redirect_uri,
  post_logout_redirect_uri,
  response_type,
  scope,
  userinfoMapper,
  account_management_uri,
  children,
}: PropsWithChildren<AuthorizationCodeRightsProviderProps>): JSX.Element => {
  const [userManager, setUserManager] = useState<UserManager>();

  const [value, setValue] = useState<RightsContextState>({});

  const { version } = useContext(SettingsContext);
  const { showInfo, showError } = useContext(NotificationContext);
  const { push, replace, location } = useHistory();

  useEffect(() => {
    if (
      push &&
      authority &&
      client &&
      redirect_uri &&
      post_logout_redirect_uri &&
      response_type &&
      scope &&
      userinfoMapper &&
      location
    ) {
      if (!userManager && !location.pathname?.startsWith('/signin-oidc')) {
        const newUserManager = new UserManager({
          authority,
          client_id: client,
          client_secret: secret,
          redirect_uri,
          post_logout_redirect_uri,
          response_type,
          scope,
          userStore: new WebStorageStateStore({ store: window.localStorage }),
        });

        newUserManager.getUser().then(user => {
          if (user) {
            const session = {
              access_token: user.access_token,
              expires_in: user.expires_in,
              identifier: user.profile.sub,
              email: user.profile.preferred_username,
              issued: new Date(),
            } as SessionWithUserInfo;

            const mappedSession = userinfoMapper(session, user.profile);

            setUserManager(newUserManager);

            setValue(previousValue => {
              return {
                ...previousValue,
                token: mappedSession.access_token,
                refresh_token: mappedSession.refresh_token,
                expires_in: mappedSession.expires_in,
                issued: new Date(),
                rights: mappedSession.rights,
                timeout_in: mappedSession.expires_in
                  ? moment(new Date())
                      .add(mappedSession.expires_in, 'seconds')
                      .toDate()
                  : undefined,
              };
            });
          } else {
            console.log('No user authenticated, switch to sign in');
            newUserManager.signinRedirect();
          }

          setUserManager(newUserManager);
        });
      }
    }
  }, [
    push,
    location,
    authority,
    client,
    secret,
    redirect_uri,
    post_logout_redirect_uri,
    response_type,
    scope,
    userManager,
    userinfoMapper,
  ]);

  useEffect(() => {
    if (push && replace && version && showInfo && showError && userManager) {
      setValue(previousValue => {
        return {
          ...previousValue,
          version: version,
          login: (_username, _password, redirect) => {
            userManager.signinRedirect(redirect);
          },
          logout: () => {
            setValue(previousValue => {
              return {
                ...previousValue,
                rights: undefined,
                issued: undefined,
                timeout_in: undefined,
                token: undefined,
                refresh_token: undefined,
                expires_in: undefined,
                error: undefined,
              };
            });

            showInfo('rights.notifications.logoutsuccess');

            userManager.signoutRedirect();
          },
          refresh: () => {
            userManager.signinSilent().then(user => {
              if (user) {
                const session = {
                  access_token: user.access_token,
                  expires_in: user.expires_in,
                  identifier: user.profile.sub,
                  email: user.profile.preferred_username,
                  issued: new Date(),
                } as SessionWithUserInfo;

                const mappedSession = userinfoMapper(session, user.profile);

                setValue(previousValue => {
                  return {
                    ...previousValue,
                    token: mappedSession.access_token,
                    refresh_token: mappedSession.refresh_token,
                    expires_in: mappedSession.expires_in,
                    issued: new Date(),
                    rights: mappedSession.rights,
                    timeout_in: mappedSession.expires_in
                      ? moment(new Date())
                          .add(mappedSession.expires_in, 'seconds')
                          .toDate()
                      : undefined,
                  };
                });
              }
            });
          },
        };
      });
    }
  }, [
    push,
    replace,
    version,
    showInfo,
    showError,
    authority,
    client,
    userinfoMapper,
    userManager,
  ]);

  const loginRedirectCallback = useCallback(() => {
    if (
      authority &&
      client &&
      secret &&
      redirect_uri &&
      post_logout_redirect_uri &&
      response_type &&
      scope &&
      push &&
      showInfo &&
      showError
    ) {
      const newUserManager = new UserManager({
        response_mode: 'query',
        authority,
        client_id: client,
        client_secret: secret,
        redirect_uri,
        post_logout_redirect_uri,
        response_type,
        scope,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
      });

      newUserManager
        .signinRedirectCallback()
        .then(user => {
          if (user) {
            const session = {
              access_token: user.access_token,
              expires_in: user.expires_in,
              identifier: user.profile.sub,
              email: user.profile.preferred_username,
              issued: new Date(),
            } as SessionWithUserInfo;

            const mappedSession = userinfoMapper(session, user.profile);

            setUserManager(newUserManager);

            setValue(previousValue => {
              return {
                ...previousValue,
                token: mappedSession.access_token,
                refresh_token: mappedSession.refresh_token,
                expires_in: mappedSession.expires_in,
                issued: new Date(),
                rights: mappedSession.rights,
                timeout_in: mappedSession.expires_in
                  ? moment(new Date())
                      .add(mappedSession.expires_in, 'seconds')
                      .toDate()
                  : undefined,
              };
            });

            push('/');

            showInfo('rights.notifications.loginsuccess');
          }
        })
        .catch(reason => showError(reason));
    }
  }, [
    authority,
    client,
    secret,
    redirect_uri,
    post_logout_redirect_uri,
    response_type,
    scope,
    push,
    showInfo,
    showError,
    userinfoMapper,
  ]);

  useEffect(() => {
    if (account_management_uri && push) {
      setValue(previousValue => {
        return {
          ...previousValue,
          manageAccount: () => {
            push(account_management_uri);
          },
        };
      });
    }
  }, [account_management_uri, push]);

  return (
    <RightsContext.Provider value={value}>
      <Route
        path="/signin-oidc"
        render={() => (
          <OidcAuthCallback redirectCallback={loginRedirectCallback} />
        )}
      />
      <React.Fragment>{children}</React.Fragment>
    </RightsContext.Provider>
  );
};
