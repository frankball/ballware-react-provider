import React, { useState, useEffect } from 'react';

import { ProviderFactoryContext, ProviderFactoryContextState } from '@ballware/react-contexts';
import {
    LookupProvider,
    PageProvider,
    MetaProvider,
    CrudProvider,
    NotificationProvider,
    TenantProvider,
    RightsProvider,
    StatisticProvider,
    EditProvider,
} from '.';

export interface ProviderFactoryProps {
    children: JSX.Element | Array<JSX.Element>;
}

export const ProviderFactory = ({ children }: ProviderFactoryProps): JSX.Element => {
    const [value, setValue] = useState({} as ProviderFactoryContextState);

    useEffect(() => {
        setValue({
            PageProvider,
            MetaProvider,
            CrudProvider,
            LookupProvider,
            NotificationProvider,
            TenantProvider,
            RightsProvider,
            EditProvider,
            StatisticProvider,
        } as ProviderFactoryContextState);
    }, []);

    return <ProviderFactoryContext.Provider value={value}>{children}</ProviderFactoryContext.Provider>;
};
