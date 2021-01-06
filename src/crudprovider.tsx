import React, { useState, useEffect, useContext } from 'react';
import { CrudItem } from '@ballware/meta-interface';
import { CrudContext, CrudContextState, MetaContext, NotificationContext } from '@ballware/react-contexts';

export interface CrudProviderProps {
    query: string | undefined;
    initialFetchParams: Record<string, unknown> | undefined;
    children: JSX.Element | Array<JSX.Element>;
}

export const CrudProvider = ({ query, initialFetchParams, children }: CrudProviderProps): JSX.Element => {
    const [value, setValue] = useState({} as CrudContextState);
    const [refreshing, setRefreshing] = useState(false);
    const [fetchParams, setFetchParams] = useState(initialFetchParams ?? {});

    const { showInfo, showError } = useContext(NotificationContext);
    const {
        prepareCustomFunction,
        mapIncomingItem,
        mapOutgoingItem,
        headParams,
        itemQueryFunc,
        itemNewFunc,
        itemByIdFunc,
        itemSaveFunc,
        itemSaveBatchFunc,
        itemRemoveFunc,
    } = useContext(MetaContext);

    useEffect(() => {
        if (
            showError &&
            showInfo &&
            prepareCustomFunction &&
            mapIncomingItem &&
            mapOutgoingItem &&
            itemQueryFunc &&
            itemNewFunc &&
            itemByIdFunc &&
            itemSaveFunc &&
            itemSaveBatchFunc &&
            itemRemoveFunc &&
            fetchParams
        ) {
            setValue({
                fetchParams: fetchParams,
                load: (params) => {
                    if (query) {
                        setValue((previousValue) => {
                            return {
                                ...previousValue,
                                isLoading: true,
                            };
                        });

                        itemQueryFunc(query, params)
                            .then((result: Array<CrudItem>) => {
                                setValue((previousValue) => {
                                    return {
                                        ...previousValue,
                                        isLoading: false,
                                        fetchedItems: result.map((item) => mapIncomingItem(item)),
                                    };
                                });
                            })
                            .catch((reason) => {
                                showError(reason);
                                setValue((previousValue) => {
                                    return {
                                        ...previousValue,
                                        isLoading: false,
                                        fetchedItems: [],
                                    };
                                });
                            });
                    }
                },
                add: (editLayout) => {
                    itemNewFunc(headParams)
                        .then((result) => {
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    adding: true,
                                    editLayout: editLayout,
                                    item: mapIncomingItem(result),
                                };
                            });
                        })
                        .catch((reason) => showError(reason));
                },
                view: (id, editLayout) => {
                    itemByIdFunc(id)
                        .then((result) => {
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    viewing: true,
                                    editLayout: editLayout,
                                    item: mapIncomingItem(result),
                                };
                            });
                        })
                        .catch((reason) => showError(reason));
                },
                edit: (id, editLayout) => {
                    itemByIdFunc(id)
                        .then((result) => {
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    editing: true,
                                    editLayout: editLayout,
                                    item: mapIncomingItem(result),
                                };
                            });
                        })
                        .catch((reason) => showError(reason));
                },
                close: () => {
                    setValue((previousValue) => {
                        return {
                            ...previousValue,
                            adding: false,
                            viewing: false,
                            editing: false,
                            deleteing: false,
                            customEditing: false,
                            editLayout: undefined,
                            item: undefined,
                            customEditFunction: undefined,
                            customEditParam: null,
                        };
                    });
                },
                remove: (id) => {
                    itemByIdFunc(id)
                        .then((result) => {
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    deleteing: true,
                                    item: mapIncomingItem(result),
                                };
                            });
                        })
                        .catch((reason) => showError(reason));
                },
                save: (item) => {
                    const saveItem = { ...item };

                    itemSaveFunc(mapOutgoingItem(saveItem))
                        .then(() => {
                            showInfo('Speichern erfolgreich');
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    adding: false,
                                    viewing: false,
                                    editing: false,
                                    deleteing: false,
                                    customEditing: false,
                                    item: undefined,
                                    customEditFunction: undefined,
                                    customEditParam: null,
                                };
                            });

                            setRefreshing(true);
                        })
                        .catch((reason) => {
                            showError(reason.toString());
                        });
                },
                saveBatch: (items) => {
                    const mappedItems = items.map((i) => mapOutgoingItem(i));

                    itemSaveBatchFunc(mappedItems)
                        .then(() => {
                            showInfo('Speichern erfolgreich');
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    adding: false,
                                    viewing: false,
                                    editing: false,
                                    deleteing: false,
                                    customEditing: false,
                                    item: undefined,
                                    customEditFunction: undefined,
                                    customEditParam: null,
                                };
                            });

                            setRefreshing(true);
                        })
                        .catch((reason) => showError(reason));
                },
                drop: (id) => {
                    itemRemoveFunc(id)
                        .then(() => {
                            showInfo('Löschen erfolgreich');
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    adding: false,
                                    viewing: false,
                                    editing: false,
                                    deleteing: false,
                                    customEditing: false,
                                    item: undefined,
                                    customEditFunction: undefined,
                                    customEditParam: null,
                                };
                            });

                            setRefreshing(true);
                        })
                        .catch((reason) => showError(reason));
                },
                customEdit: (customFunction, items) => {
                    prepareCustomFunction(
                        customFunction.id,
                        items,
                        (param) => {
                            setValue((previousValue) => {
                                return {
                                    ...previousValue,
                                    customEditing: true,
                                    customEditFunction: customFunction,
                                    customEditParam: param,
                                };
                            });
                        },
                        (message) => {
                            showInfo(message);
                        },
                    );
                },
            } as CrudContextState);
        }
    }, [
        showError,
        showInfo,
        prepareCustomFunction,
        mapIncomingItem,
        mapOutgoingItem,
        itemQueryFunc,
        itemNewFunc,
        itemByIdFunc,
        itemSaveFunc,
        itemSaveBatchFunc,
        itemRemoveFunc,
        headParams,
        query,
    ]);

    useEffect(() => {
        if (refreshing && value?.load) {
            value.load(fetchParams);
            setRefreshing(false);
        }
    }, [refreshing, value]);

    useEffect(() => {
        setFetchParams(initialFetchParams ?? {});
    }, [initialFetchParams]);

    useEffect(() => {
        setValue((previousValue) => {
            return {
                ...previousValue,
                fetchParams: fetchParams,
            };
        });
    }, [fetchParams]);

    return <CrudContext.Provider value={value}>{children}</CrudContext.Provider>;
};
