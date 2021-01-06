import React, { useState, useEffect } from 'react';
import { EditModes, EditContext, EditContextState } from '@ballware/react-contexts';
import { CrudItem, ValueType, EditLayout } from '@ballware/meta-interface';

export interface EditProviderProps {
    children: JSX.Element | Array<JSX.Element>;
    editLayout: EditLayout | undefined;
    item: CrudItem | Array<CrudItem> | ValueType;
    mode: EditModes;
    functionIdentifier?: string;
}

export const EditProvider = ({
    item,
    mode,
    functionIdentifier,
    editLayout,
    children,
}: EditProviderProps): JSX.Element => {
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
