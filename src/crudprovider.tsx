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
} from 'react';
import { CrudItem, QueryParams } from '@ballware/meta-interface';
import {
  CrudContext,
  CrudContextState,
  MetaContext,
  NotificationContext,
} from '@ballware/react-contexts';

/**
 * Properties for crud provider component
 */
export interface CrudProviderProps {
  /**
   * Query identifier used for querying item list
   */
  query: string | undefined;

  /**
   * Fetch params prepared in parent container (page, parent entity)
   */
  initialFetchParams?: QueryParams;
}

/**
 * Provides crud operations for parent generic metadata context
 */
export const CrudProvider = ({
  query: queryIdentifier,
  initialFetchParams,
  children,
}: PropsWithChildren<CrudProviderProps>): JSX.Element => {
  const [value, setValue] = useState({} as CrudContextState);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchParams, setFetchParams] = useState(initialFetchParams ?? {});

  const { showInfo, showError } = useContext(NotificationContext);
  const {
    prepareCustomFunction,
    mapIncomingItem,
    mapOutgoingItem,
    headParams,
    query,
    create,
    byId,
    save,
    saveBatch,
    drop,
  } = useContext(MetaContext);

  useEffect(() => {
    if (
      showError &&
      showInfo &&
      prepareCustomFunction &&
      mapIncomingItem &&
      mapOutgoingItem &&
      query &&
      create &&
      byId &&
      save &&
      saveBatch &&
      drop &&
      fetchParams
    ) {
      setValue({
        fetchParams: fetchParams,
        load: queryIdentifier
          ? params => {
              if (query) {
                setValue(previousValue => {
                  return {
                    ...previousValue,
                    isLoading: true,
                  };
                });

                query(queryIdentifier, params)
                  .then((result: Array<CrudItem>) => {
                    setValue(previousValue => {
                      return {
                        ...previousValue,
                        isLoading: false,
                        fetchedItems: result.map(item => mapIncomingItem(item)),
                      };
                    });
                  })
                  .catch(reason => {
                    showError(reason);
                    setValue(previousValue => {
                      return {
                        ...previousValue,
                        isLoading: false,
                        fetchedItems: [],
                      };
                    });
                  });
              }
            }
          : undefined,
        add: editLayout => {
          create(headParams)
            .then(result => {
              setValue(previousValue => {
                return {
                  ...previousValue,
                  adding: true,
                  editLayout: editLayout,
                  item: mapIncomingItem(result),
                };
              });
            })
            .catch(reason => showError(reason));
        },
        view: (id, editLayout) => {
          byId(id)
            .then(result => {
              setValue(previousValue => {
                return {
                  ...previousValue,
                  viewing: true,
                  editLayout: editLayout,
                  item: mapIncomingItem(result),
                };
              });
            })
            .catch(reason => showError(reason));
        },
        edit: (id, editLayout) => {
          byId(id)
            .then(result => {
              setValue(previousValue => {
                return {
                  ...previousValue,
                  editing: true,
                  editLayout: editLayout,
                  item: mapIncomingItem(result),
                };
              });
            })
            .catch(reason => showError(reason));
        },
        close: () => {
          setValue(previousValue => {
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
        remove: id => {
          byId(id)
            .then(result => {
              setValue(previousValue => {
                return {
                  ...previousValue,
                  deleteing: true,
                  item: mapIncomingItem(result),
                };
              });
            })
            .catch(reason => showError(reason));
        },
        save: item => {
          const saveItem = { ...item };

          save(mapOutgoingItem(saveItem))
            .then(() => {
              showInfo('editing.notifications.saved');
              setValue(previousValue => {
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
            .catch(reason => {
              showError(reason.toString());
            });
        },
        saveBatch: items => {
          const mappedItems = items.map(i => mapOutgoingItem(i));

          saveBatch(mappedItems)
            .then(() => {
              showInfo('editing.notifications.saved');
              setValue(previousValue => {
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
            .catch(reason => showError(reason));
        },
        drop: id => {
          drop(id)
            .then(() => {
              showInfo('editing.notifications.removed');
              setValue(previousValue => {
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
            .catch(reason => showError(reason));
        },
        customEdit: (customFunction, items) => {
          prepareCustomFunction(
            customFunction.id,
            items,
            param => {
              setValue(previousValue => {
                return {
                  ...previousValue,
                  customEditing: true,
                  customEditFunction: customFunction,
                  customEditParam: param,
                };
              });
            },
            message => {
              showInfo(message);
            }
          );
        },
      } as CrudContextState);
    }
  }, [
    fetchParams,
    queryIdentifier,
    showError,
    showInfo,
    prepareCustomFunction,
    mapIncomingItem,
    mapOutgoingItem,
    query,
    create,
    byId,
    save,
    saveBatch,
    drop,
    headParams,
  ]);

  useEffect(() => {
    if (refreshing && value?.load) {
      value.load(fetchParams);
      setRefreshing(false);
    }
  }, [refreshing, value, fetchParams]);

  useEffect(() => {
    setFetchParams(initialFetchParams ?? {});
  }, [initialFetchParams]);

  useEffect(() => {
    setValue(previousValue => {
      return {
        ...previousValue,
        fetchParams: fetchParams,
      };
    });
  }, [fetchParams]);

  return <CrudContext.Provider value={value}>{children}</CrudContext.Provider>;
};
