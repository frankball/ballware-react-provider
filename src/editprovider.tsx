/**
 * @license
 * Copyright 2021 Frank Ballmeyer
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect, PropsWithChildren } from 'react';
import { EditModes, EditContext, EditContextState } from '@ballware/react-contexts';
import { CrudItem, ValueType, EditLayout } from '@ballware/meta-interface';

/**
 * Edit provider properties
 */
export interface EditProviderProps {

    /**
     * Edit layout used for edit operation
     */
    editLayout: EditLayout | undefined;

    /**
     * Item to be edited
     */
    item: CrudItem | Array<CrudItem> | ValueType;

    /**
     * Edit mode for edit operation
     */
    mode: EditModes;

    /**
     * Custom edit function identifier if custom edit operation
     */
    functionIdentifier?: string;
}

/**
 * Provides edit container for editing single item or collection of items
 */
export const EditProvider = ({
    item,
    mode,
    functionIdentifier,
    editLayout,
    children,
}: PropsWithChildren<EditProviderProps>): JSX.Element => {
    const [changedItem, setChangedItem] = useState(item);
    const [value, setValue] = useState({
        mode: mode,
        functionIdentifier: functionIdentifier,
        editLayout: editLayout,
    } as EditContextState);

    useEffect(() => {
        if (item) {
            setValue((previousValue) => {
                return {
                    ...previousValue,
                    item: item,
                    mode: mode,
                    setItem: (item) => setChangedItem(item),
                };
            });
        } else {
            setValue((previousValue) => {
                return {
                    ...previousValue,
                    item: undefined,
                    mode: mode,
                    setItem: (item) => setChangedItem(item),
                };
            });
        }
    }, [mode, item]);

    useEffect(() => {
        setValue((previousValue) => {
            return {
                ...previousValue,
                item: changedItem,
            };
        });
    }, [changedItem]);

    return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};
