import React, { useState, useEffect, useContext } from 'react';
import { CompiledEntityMetadata, EntityRights, CrudItem, hasRight } from '@ballware/meta-interface';
import {
    RightsContext,
    MetaContext,
    MetaContextState,
    SettingsContext,
    LookupContext,
    NotificationContext,
    LookupRequest,
} from '@ballware/react-contexts';
import { createUtil } from './scriptutil';
import { useHistory } from 'react-router-dom';

export interface MetaProviderProps {
    children: JSX.Element | Array<JSX.Element>;
    entity: string;
    readOnly: boolean;
    headParams?: Record<string, unknown>;
    initialCustomParam: Record<string, unknown>;
}

export const MetaProvider = ({
    entity,
    readOnly,
    headParams,
    initialCustomParam,
    children,
}: MetaProviderProps): JSX.Element => {
    const [value, setValue] = useState({} as MetaContextState);
    const [metaData, setMetaData] = useState<CompiledEntityMetadata | undefined>();
    const [customParam, setCustomParam] = useState<Record<string, unknown> | undefined>();
    const [documents, setDocuments] = useState<Array<{ id: string; text: string }> | undefined>();

    const { metaEntityApiFactory, metaAttachmentApiFactory, metaGenericEntityApiFactory } = useContext(SettingsContext);
    const { token, rights } = useContext(RightsContext);
    const { lookups, lookupsComplete, createLookups } = useContext(LookupContext);
    const { showError } = useContext(NotificationContext);

    const history = useHistory();

    useEffect(() => {
        const headAllowed = (right: string) => {
            return (
                metaData &&
                customParam &&
                rights &&
                !readOnly &&
                hasRight(
                    rights,
                    metaData.application,
                    metaData.entity,
                    right,
                    metaData.compiledCustomScripts?.extendedRightsCheck,
                    metaData.compiledCustomScripts?.rightsParamForHead
                        ? metaData.compiledCustomScripts.rightsParamForHead(customParam) 
                        : undefined,
                )
            );
        };

        const itemAllowed = (item: CrudItem, right: string) => {
            return (
                metaData &&
                customParam &&
                rights &&
                (!readOnly || right === EntityRights.RIGHT_VIEW || right === EntityRights.RIGHT_PRINT) &&
                hasRight(
                    rights,
                    metaData.application,
                    metaData.entity,
                    right,
                    metaData.compiledCustomScripts?.extendedRightsCheck,
                    metaData.compiledCustomScripts?.rightsParamForItem
                        ? metaData.compiledCustomScripts.rightsParamForItem(item, customParam)
                        : undefined,
                )
            );
        };

        const print = (doc: string, ids: Array<string>) => {
            history.push(`/print?docId=${doc}${ids.map((u) => `&id=${u}`).join('')}`);
        };

        if (metaData && customParam && rights && documents) {
            setValue((previousValue) => {
                return {
                    ...previousValue,
                    print: print,
                    addAllowed: () => headAllowed(EntityRights.RIGHT_ADD),
                    viewAllowed: (item) => itemAllowed(item, EntityRights.RIGHT_VIEW),
                    editAllowed: (item) => itemAllowed(item, EntityRights.RIGHT_EDIT),
                    deleteAllowed: (item) => itemAllowed(item, EntityRights.RIGHT_DELETE),
                    printAllowed: (item) => documents?.length > 0 && itemAllowed(item, EntityRights.RIGHT_PRINT),
                    customFunctionAllowed: (item, customFunction) =>
                        item ? itemAllowed(item, customFunction.id) : headAllowed(customFunction.id),
                } as MetaContextState;
            });
        }
    }, [metaData, customParam, rights, documents]);

    useEffect(() => {
        let fetchingCanceled = false;

        if (showError && entity && token && metaEntityApiFactory) {
            const api = metaEntityApiFactory();

            api.metadataForEntity(token, entity)
                .then((result) => {
                    if (!fetchingCanceled) {
                        setMetaData(result);
                    }
                })
                .catch((reason) => {
                    showError(reason);

                    if (!fetchingCanceled) {
                        setMetaData(undefined);
                    }
                });

            api.documentsForEntity(token, entity)
                .then((result) => {
                    if (!fetchingCanceled) {
                        setDocuments(
                            result.map((r) => {
                                const printMenuEntry = {} as { id: string; text: string };

                                printMenuEntry.id = r.Id;
                                printMenuEntry.text = r.Name;

                                return printMenuEntry;
                            }),
                        );
                    }
                })
                .catch((reason) => showError(reason));
        }

        return () => {
            fetchingCanceled = true;
        };
    }, [showError, entity, token, metaEntityApiFactory]);

    useEffect(() => {
        setValue((previousValue) => {
            return {
                ...previousValue,
                metaData: metaData,
            } as MetaContextState;
        });
    }, [metaData]);

    useEffect(() => {
        if (createLookups && metaData) {
            const lookups = [] as Array<LookupRequest>;

            if (metaData.lookups) {
                lookups.push(
                    ...metaData.lookups.map((l) => {
                        if (l.type === 1) {
                            if (l.hasParam) {
                                return {
                                    type: 'autocompletewithparam',
                                    identifier: l.identifier,
                                    lookupId: l.id,
                                } as LookupRequest;
                            } else {
                                return {
                                    type: 'autocomplete',
                                    identifier: l.identifier,
                                    lookupId: l.id,
                                } as LookupRequest;
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
                    }),
                );
            }

            if (metaData.picklists) {
                lookups.push(
                    ...metaData.picklists.map((p) => {
                        return {
                            type: 'pickvalue',
                            identifier: p.identifier,
                            entity: p.entity,
                            field: p.field,
                        } as LookupRequest;
                    }),
                );
            }

            if (metaData.stateColumn) {
                lookups.push(
                    ...[
                        { type: 'state', identifier: 'stateLookup', entity: metaData.entity } as LookupRequest,
                        {
                            type: 'stateallowed',
                            identifier: 'allowedStateLookup',
                            entity: metaData.entity,
                        } as LookupRequest,
                    ],
                );
            }

            createLookups(lookups);
        }
    }, [createLookups, metaData]);

    useEffect(() => {
        setValue((previousValue) => {
            return {
                ...previousValue,
                customParam: customParam,
            } as MetaContextState;
        });
    }, [customParam]);

    useEffect(() => {
        setValue((previousValue) => {
            return {
                ...previousValue,
                headParams: headParams,
            } as MetaContextState;
        });
    }, [headParams]);

    useEffect(() => {
        setValue((previousValue) => {
            return {
                ...previousValue,
                documents: documents,
            } as MetaContextState;
        });
    }, [documents]);

    useEffect(() => {
        let fetchingCanceled = false;

        if (lookupsComplete && metaData) {
            if (metaData.compiledCustomScripts?.prepareCustomParam) {
                metaData.compiledCustomScripts.prepareCustomParam(lookups ?? {}, createUtil(token as string), (p) => {
                    if (!fetchingCanceled) {
                        setCustomParam(p);
                    }
                });
            } else {
                if (!fetchingCanceled) {
                    setCustomParam(initialCustomParam ?? {});
                }
            }
        }

        return () => {
            fetchingCanceled = true;
        };
    }, [lookupsComplete, metaData]);

    useEffect(() => {
        if (
            token &&
            metaData &&
            customParam &&
            lookupsComplete &&
            metaGenericEntityApiFactory &&
            metaAttachmentApiFactory
        ) {
            const entityApi = metaGenericEntityApiFactory(metaData.baseUrl);
            const attachmentApi = metaAttachmentApiFactory();

            setValue((previousValue) => {
                return {
                    ...previousValue,
                    displayName: metaData.displayName ?? metaData.entity,
                    customFunctions: metaData.customFunctions ?? [],
                    getGridLayout: (identifier) => metaData.gridLayouts?.find((l) => l.identifier === identifier),
                    getEditLayout: (identifier) => metaData.editLayouts?.find((l) => l.identifier === identifier),
                    mapIncomingItem: (item) =>
                        metaData.itemMappingScript
                            ? metaData.itemMappingScript(item, customParam, createUtil(token))
                            : item,
                    mapOutgoingItem: (item) =>
                        metaData.itemReverseMappingScript
                            ? metaData.itemReverseMappingScript(item, customParam, createUtil(token))
                            : item,
                    itemQueryFunc: (query, params) => entityApi.entityQuery(token, query, params),
                    itemByIdFunc: (id) => entityApi.entityById(token, id),
                    itemNewFunc: (params) => entityApi.entityNew(token, params),
                    itemSaveFunc: (item) => entityApi.entitySave(token, item),
                    itemSaveBatchFunc: (items) => entityApi.entitySaveBatch(token, items),
                    itemRemoveFunc: (id) => entityApi.entityRemove(token, id),
                    attachmentFetchFunc: (id) => attachmentApi.attachmentFetch(token, id),
                    attachmentUploadFunc: (id, file) => attachmentApi.attachmentUpload(token, id, file),
                    attachmentOpenFunc: (id, fileName) => attachmentApi.attachmentOpen(token, id, fileName),
                    attachmentDeleteFunc: (id, fileName) => attachmentApi.attachmentDelete(token, id, fileName),

                    prepareCustomFunction: (identifier, selection, execute, message) => {
                        if (metaData.compiledCustomScripts?.prepareCustomFunction) {
                            metaData.compiledCustomScripts.prepareCustomFunction(
                                identifier,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                                execute,
                                message,
                                selection as CrudItem[],
                            );
                        } else {
                            selection?.forEach((s) => execute(s));
                        }
                    },
                    evaluateCustomFunction: (identifier, param, save, message) => {
                        if (metaData.compiledCustomScripts?.evaluateCustomFunction) {
                            metaData.compiledCustomScripts.evaluateCustomFunction(
                                identifier,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                                param,
                                save,
                                message,
                            );
                        } else {
                            save(param);
                        }
                    },
                    prepareGridLayout: (gridLayout) => {
                        if (metaData.compiledCustomScripts?.prepareGridLayout) {
                            metaData.compiledCustomScripts.prepareGridLayout(
                                (lookups as Record<string, unknown>) ?? {},
                                customParam,
                                createUtil(token),
                                gridLayout,
                            );
                        }
                    },
                    prepareEditLayout: (mode, editLayout) => {
                        if (metaData.compiledCustomScripts?.prepareEditLayout) {
                            metaData.compiledCustomScripts.prepareEditLayout(
                                mode,
                                (lookups as Record<string, unknown>) ?? {},
                                customParam,
                                createUtil(token),
                                editLayout,
                            );
                        }
                    },
                    editorPreparing: (mode, item, layoutItem, identifier) => {
                        if (metaData.compiledCustomScripts?.editorPreparing) {
                            metaData.compiledCustomScripts.editorPreparing(
                                mode,
                                item,
                                layoutItem,
                                identifier,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                            );
                        }
                    },
                    editorInitialized: (mode, item, editUtil, identifier) => {
                        if (metaData.compiledCustomScripts?.editorInitialized) {
                            metaData.compiledCustomScripts.editorInitialized(
                                mode,
                                item,
                                editUtil,
                                identifier,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                            );
                        }
                    },
                    editorEntered: (mode, item, editUtil, identifier) => {
                        if (metaData.compiledCustomScripts?.editorEntered) {
                            metaData.compiledCustomScripts.editorEntered(
                                mode,
                                item,
                                editUtil,
                                identifier,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                            );
                        }
                    },
                    editorValueChanged: (_mode, item, editUtil, identifier, value) => {
                        if (metaData.compiledCustomScripts?.editorValueChanged) {
                            metaData.compiledCustomScripts.editorValueChanged(
                                item,
                                editUtil,
                                identifier,
                                value,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                            );
                        }
                    },
                    editorValidating: (_mode, item, editUtil, identifier, value, validation) => {
                        if (metaData.compiledCustomScripts?.editorValidating) {
                            return metaData.compiledCustomScripts.editorValidating(
                                item,
                                editUtil,
                                identifier,
                                value,
                                validation,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                            );
                        } else {
                            return true;
                        }
                    },
                    editorEvent: (_mode, item, editUtil, identifier, event) => {
                        if (metaData.compiledCustomScripts?.editorEvent) {
                            metaData.compiledCustomScripts.editorEvent(
                                item,
                                editUtil,
                                identifier,
                                event,
                                (lookups as Record<string, unknown>) ?? {},
                                createUtil(token),
                            );
                        }
                    },
                    detailGridCellPreparing: (mode, item, detailItem, identifier, options) => {
                        if (metaData.compiledCustomScripts?.detailGridCellPreparing) {
                            metaData.compiledCustomScripts.detailGridCellPreparing(
                                mode,
                                item as CrudItem,
                                detailItem,
                                identifier,
                                options,
                                createUtil(token),
                            );
                        }
                    },
                    detailGridRowValidating: (mode, item, detailItem, identifier) => {
                        if (metaData.compiledCustomScripts?.detailGridRowValidating) {
                            return metaData.compiledCustomScripts.detailGridRowValidating(
                                mode,
                                item as CrudItem,
                                detailItem,
                                identifier,
                                createUtil(token),
                            );
                        }

                        return undefined;
                    },
                    initNewDetailItem: (dataMember, item, detailItem) => {
                        if (metaData.compiledCustomScripts?.initNewDetailItem) {
                            metaData.compiledCustomScripts.initNewDetailItem(
                                dataMember,
                                item as CrudItem,
                                detailItem,
                                createUtil(token),
                            );
                        }
                    },
                } as MetaContextState;
            });
        }
    }, [token, metaData, lookups, lookupsComplete, customParam, metaGenericEntityApiFactory, metaAttachmentApiFactory]);

    return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
};
