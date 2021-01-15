import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { CompiledPageData, ScriptActions, EditUtil, ValueType } from '@ballware/meta-interface';
import {
    PageContext,
    PageContextState,
    RightsContext,
    SettingsContext,
    NotificationContext,
    LookupContext,
    LookupRequest,
} from '@ballware/react-contexts';
import { createUtil } from './scriptutil';

export interface PageProviderProps {
    children: JSX.Element | Array<JSX.Element>;
    identifier: string;
}

export const PageProvider = ({ identifier, children }: PageProviderProps): JSX.Element => {
    const [documentationEntity, setDocumentationEntity] = useState<string | undefined>();
    const [pageData, setPageData] = useState<CompiledPageData | undefined>();
    const [pageParam, setPageParam] = useState<Record<string, unknown> | undefined>();
    const [customParam, setCustomParam] = useState<unknown | undefined>();
    const [value, setValue] = useState({} as PageContextState);

    const { metaPageApiFactory, metaDocumentationApiFactory } = useContext(SettingsContext);
    const { showInfo, showError } = useContext(NotificationContext);
    const { token } = useContext(RightsContext);
    const { createLookups, lookups, lookupsComplete } = useContext(LookupContext);

    const loadDocumentation = (entity: string) => setDocumentationEntity(entity);

    useEffect(() => {
        if (showError && showInfo && metaDocumentationApiFactory && token && documentationEntity) {
            const api = metaDocumentationApiFactory();

            api.loadDocumentationForEntity(token, documentationEntity)
                .then((result) => {
                    if (result) {
                        setValue((previousValue) => {
                            return {
                                ...previousValue,
                                documentation: result,
                            } as PageContextState;
                        });
                    } else {
                        setDocumentationEntity(undefined);
                        showInfo('Keine Dokumentation hinterlegt');
                    }
                })
                .catch((reason) => showError(reason));
        } else {
            setValue((previousValue) => {
                return {
                    ...previousValue,
                    documentation: undefined,
                } as PageContextState;
            });
        }
    }, [showError, showInfo, metaDocumentationApiFactory, token, documentationEntity]);

    const resetDocumentation = useCallback(() => {
        setDocumentationEntity(undefined);
        setValue((previousValue) => {
            return {
                ...previousValue,
                documentation: undefined,
            } as PageContextState;
        });
    }, []);

    const scriptActions = useMemo(() => {
        return {
            loadData: (params) => {
                setPageParam(params);
            }
        } as ScriptActions;
    }, []);

    useEffect(() => {
        setValue({
            loadDocumentation,
            resetDocumentation,
        } as PageContextState);
    }, []);

    useEffect(() => {
        if (showError && metaPageApiFactory && identifier && token) {
            const api = metaPageApiFactory();

            api.pageDataForIdentifier(token, identifier)
                .then((result) => {
                    setPageData(result);
                })
                .catch((reason) => showError(reason));
        }
    }, [showError, metaPageApiFactory, identifier, token]);

    useEffect(() => {
        if (token && pageData && lookups && lookupsComplete) {
            if (pageData.compiledCustomScripts?.prepareCustomParam) {
                pageData.compiledCustomScripts.prepareCustomParam(lookups, createUtil(token), (p) => {
                    setCustomParam(p);
                });
            } else {
                setCustomParam({});
            }

            const paramsInitialized = (hidden: boolean) => {
                if (pageData.compiledCustomScripts?.paramsInitialized) {
                    pageData.compiledCustomScripts?.paramsInitialized(hidden, lookups, createUtil(token), scriptActions);
                }
            };

            const paramEditorInitialized = (name: string, editUtil: EditUtil) => {
                if (pageData.compiledCustomScripts?.paramEditorInitialized) {
                    pageData.compiledCustomScripts?.paramEditorInitialized(
                        name,
                        editUtil,
                        lookups,
                        createUtil(token),
                        scriptActions,
                    );
                }
            };

            const paramEditorValueChanged = (
                name: string,
                value: ValueType,
                editUtil: EditUtil,
            ) => {
                if (pageData.compiledCustomScripts?.paramEditorValueChanged) {
                    pageData.compiledCustomScripts?.paramEditorValueChanged(
                        name,
                        value,
                        editUtil,
                        lookups,
                        createUtil(token),
                        scriptActions,
                    );
                }
            };

            const paramEditorEvent = (
                name: string,
                event: string,
                editUtil: EditUtil,
                param?: Record<string, unknown>,
            ) => {
                if (pageData.compiledCustomScripts?.paramEditorEvent) {
                    pageData.compiledCustomScripts?.paramEditorEvent(
                        name,
                        event,
                        editUtil,
                        lookups,
                        createUtil(token),
                        scriptActions,
                        param,
                    );
                }
            };

            setValue((previousValue) => {
                return {
                    ...previousValue,
                    layout: pageData.layout,
                    paramsInitialized,
                    paramEditorInitialized,
                    paramEditorValueChanged,
                    paramEditorEvent,
                } as PageContextState;
            });
        }
    }, [token, pageData, lookups, lookupsComplete]);

    useEffect(() => {
        if (createLookups && pageData) {
            const lookupRequests = pageData.lookups?.map((l) => {
                if (l.type === 1) {
                    if (l.hasParam) {
                        return {
                            type: 'autocompletewithparam',
                            identifier: l.identifier,
                            lookupId: l.id,
                        } as LookupRequest;
                    } else {
                        return { type: 'autocomplete', identifier: l.identifier, lookupId: l.id } as LookupRequest;
                    }
                } else {
                    if (l.hasParam) {
                        return {
                            type: 'lookupwithparam',
                            identifier: l.identifier,
                            lookupId: l.id,
                            valueMember: l.valueMember,
                            displayMember: l.displayMember,
                        } as LookupRequest;
                    } else {
                        return {
                            type: 'lookup',
                            identifier: l.identifier,
                            lookupId: l.id,
                            valueMember: l.valueMember,
                            displayMember: l.displayMember,
                        } as LookupRequest;
                    }
                }
            });

            createLookups(lookupRequests);
        }
    }, [createLookups, pageData]);

    useEffect(() => {
        if (pageData && customParam) {
            setValue((previousValue) => {
                return {
                    ...previousValue,
                    pageData: pageData,
                    customParam: customParam,
                } as PageContextState;
            });
        }
    }, [pageData, customParam]);

    useEffect(() => {

        setValue((previousValue) => {
            return {
                ...previousValue,
                pageParam: pageParam
            } as PageContextState;
        });

    }, [pageParam])

    return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
