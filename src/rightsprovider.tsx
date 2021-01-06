import React, { useState, useEffect, useContext } from 'react';
import { SessionWithUserInfo } from '@ballware/identity-interface';
import { Rights } from '@ballware/meta-interface';
import { RightsContext, RightsContextState, PersistedRightsState } from '@ballware/react-contexts';
import { SettingsContext, NotificationContext } from '@ballware/react-contexts';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

export interface RightsProviderProps {
    client: string;
    secret: string;
    children: JSX.Element | Array<JSX.Element>;
}

interface MappedSessionWithUserInfo extends SessionWithUserInfo {
    person?: string;
    tenant: string;
    rights: Array<string>;
}

function loadInitialRightsState(): PersistedRightsState {
    const storeRights = localStorage.getItem('state.rights');

    if (storeRights) {
        const rights = JSON.parse(storeRights) as PersistedRightsState;

        if (rights && rights.timeout_in && new Date(rights.timeout_in) <= new Date()) {
            return {} as PersistedRightsState;
        } else {
            return rights;
        }
    }

    return {} as PersistedRightsState;
}

function storeRightsState(state: PersistedRightsState): void {
    localStorage.setItem('state.rights', JSON.stringify(state));
}

export const RightsProvider = ({ client, secret, children }: RightsProviderProps): JSX.Element => {
    const [value, setValue] = useState(loadInitialRightsState() as RightsContextState);

    const { identityAuthApiFactory, version } = useContext(SettingsContext);
    const { showInfo, showError } = useContext(NotificationContext);
    const { push, replace } = useHistory();

    useEffect(() => {
        if (push && replace && identityAuthApiFactory && version && showInfo && showError) {
            setValue((previousValue) => {
                const api = identityAuthApiFactory();

                const userinfoMapper = (
                    session: SessionWithUserInfo,
                    userinfo: Record<string, unknown>,
                ): MappedSessionWithUserInfo => {
                    const mappedSession = { ...session } as MappedSessionWithUserInfo;

                    mappedSession.person = userinfo.person as string;
                    mappedSession.tenant = userinfo.tenant as string;
                    mappedSession.rights = userinfo.right as Array<string>;

                    return mappedSession;
                };

                return {
                    ...previousValue,
                    version: version,
                    login: (username, password, redirect) => {
                        api.login<MappedSessionWithUserInfo>(username, password, client, secret, userinfoMapper)
                            .then((session) => {
                                const rights = {
                                    BenutzerId: session.identifier,
                                    Email: session.email,
                                    PersonId: session.person,
                                    TenantId: session.tenant,
                                    Claims: session.rights,
                                } as Rights;

                                setValue((previousValue) => {
                                    return {
                                        ...previousValue,
                                        token: session.access_token,
                                        refresh_token: session.refresh_token,
                                        expires_in: session.expires_in,
                                        issued: new Date(),
                                        rights: rights,
                                        timeout_in: session.expires_in
                                            ? moment(new Date()).add(session.expires_in, 'seconds').toDate()
                                            : undefined,
                                    };
                                });

                                showInfo('Anmeldung erfolgreich');
                                replace(redirect);
                            })
                            .catch((reason) => {
                                showError(reason === 'invalid_grant' ? 'Benutzername oder Passwort ungültig' : reason);
                            });
                    },
                    logout: () => {
                        api.logout(value.token as string, client, secret)
                            .then(() => {
                                setValue((previousValue) => {
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
                                showInfo('Abmeldung erfolgreich');
                            })
                            .catch((reason) => showError(reason));
                    },
                    register: (username, displayname, password) => {
                        api.register(username, password, displayname)
                            .then(() => {
                                showInfo(
                                    'Registrierung erfolgreich. Vom Administrator müssen erst Rechte vergeben werden, um die Anwendung nutzen zu können.',
                                );
                                push('/login');
                            })
                            .catch((reason) => showError(reason));
                    },
                    forgotPassword: (email) => {
                        api.forgotPassword(email)
                            .then(() => {
                                showInfo(
                                    'Sie erhalten eine Mail mit Anweisungen, wie das Passwort neu vergeben werden kann.',
                                );
                                push('/resetpassword');
                            })
                            .catch((reason) => showError(reason));
                    },
                    resetPassword: (email, code, newPassword) => {
                        api.resetPassword(email, code, newPassword)
                            .then(() => {
                                showInfo('Das Passwort wurde erfolgreich zurückgesetzt.');
                                push('/login');
                            })
                            .catch((reason) => showError(reason));
                    },
                    changePassword: (oldPassword, newPassword) => {
                        api.changePassword(value.token as string, oldPassword, newPassword)
                            .then(() => {
                                showInfo('Das Passwort wurde erfolgreich geändert.');
                            })
                            .catch((reason) => showError(reason));
                    },
                    refresh: () => {
                        api.refreshToken(value.refresh_token as string, client, secret)
                            .then((session) => {
                                setValue((previousValue) => {
                                    return {
                                        ...previousValue,
                                        token: session.access_token,
                                        refresh_token: session.refresh_token,
                                        expires_in: session.expires_in,
                                        issued: new Date(),
                                        timeout_in: session.expires_in
                                            ? moment(new Date()).add(session.expires_in, 'seconds').toDate()
                                            : undefined,
                                    };
                                });
                            })
                            .catch((reason) => showError(reason));
                    },
                };
            });
        }
    }, [push, replace, identityAuthApiFactory, version, showInfo, showError]);

    useEffect(() => {
        if (push && value) {
            storeRightsState({
                ...(value as PersistedRightsState),
            });

            if (!value.rights) {
                push('/login');
            }
        }
    }, [push, value]);

    return <RightsContext.Provider value={value}>{children}</RightsContext.Provider>;
};
