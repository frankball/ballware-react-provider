import React, { useState, useEffect } from 'react';

import { ProviderFactoryContext, ProviderFactoryContextState } from '@ballware/react-contexts';
import { LookupProvider } from './lookupprovider';
import { PageProvider } from './pageprovider';
import { MetaProvider } from './metaprovider';
import { CrudProvider } from './crudprovider';
import { NotificationProvider } from './notificationprovider';
import { TenantProvider } from './tenantprovider';
import { RightsProvider } from './rightsprovider';
import { StatisticProvider } from './statisticprovider';
import { EditProvider } from './editprovider';

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
