import React, { useState, useEffect, useContext, useCallback } from 'react';
import { CompiledTenant, NavigationLayoutItem } from '@ballware/meta-interface';
import {
    TenantContext,
    TenantContextState,
    RightsContext,
    SettingsContext,
    NotificationContext,
} from '@ballware/react-contexts';

export interface TenantProviderProps {
    children: JSX.Element | Array<JSX.Element>;
}

const findPages = (items: Array<NavigationLayoutItem>) => {
    const foundPages = [] as Array<NavigationLayoutItem>;

    items?.forEach((item) => {
        if (item.type === 'page') {
            foundPages.push(item);
        } else if (item.items) {
            foundPages.push(...findPages(item.items));
        }
    });

    return foundPages;
};

export const TenantProvider = ({ children }: TenantProviderProps): JSX.Element => {
    const [tenant, setTenant] = useState<CompiledTenant>();
    const [pages, setPages] = useState<Array<NavigationLayoutItem>>();
    const [value, setValue] = useState({} as TenantContextState);

    const { metaTenantApiFactory } = useContext(SettingsContext);
    const { rights, token } = useContext(RightsContext);
    const { showError } = useContext(NotificationContext);

    const pageAllowed = useCallback(
        (page: string) => {
            if (tenant && rights) {
                if (tenant.pageVisible) {
                    return tenant.pageVisible(rights, page);
                }

                return true;
            }

            return false;
        },
        [tenant, rights],
    );

    useEffect(() => {
        if (showError && metaTenantApiFactory && token && rights && rights.TenantId) {
            const api = metaTenantApiFactory();

            api.metadataForTenant(token, rights.TenantId)
                .then((result) => setTenant(result))
                .catch((reason) => showError(reason));
        } else {
            setTenant(undefined);
            setPages(undefined);
        }
    }, [showError, metaTenantApiFactory, token, rights]);

    useEffect(() => {
        if (tenant && rights) {
            if (tenant.navigation?.items) {
                setPages(findPages(tenant.navigation.items));
            } else {
                setPages([]);
            }
        }
    }, [tenant, rights]);

    useEffect(() => {
        setValue({
            name: tenant?.name,
            navigation: tenant?.navigation,
            pages,
            pageAllowed,
        } as TenantContextState);
    }, [tenant, pages, pageAllowed]);

    return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
