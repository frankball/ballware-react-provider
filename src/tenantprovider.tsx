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
  useCallback,
  PropsWithChildren,
} from 'react';
import { CompiledTenant, NavigationLayoutItem } from '@ballware/meta-interface';
import {
  TenantContext,
  TenantContextState,
  ResourceOwnerRightsContext,
  SettingsContext,
  NotificationContext,
} from '@ballware/react-contexts';

/**
 * Properties for tenant provider
 */
export interface TenantProviderProps {}

/**
 * Find pages in navigation tree
 * @param items navigation tree
 * @returns List of pages found in tree
 */
const findPages = (items: Array<NavigationLayoutItem>) => {
  const foundPages = [] as Array<NavigationLayoutItem>;

  items?.forEach(item => {
    if (item.type === 'page') {
      foundPages.push(item);
    } else if (item.items) {
      foundPages.push(...findPages(item.items));
    }
  });

  return foundPages;
};

/**
 * Provides tenant specific operations
 */
export const TenantProvider = ({
  children,
}: PropsWithChildren<TenantProviderProps>): JSX.Element => {
  const [tenant, setTenant] = useState<CompiledTenant>();
  const [pages, setPages] = useState<Array<NavigationLayoutItem>>();
  const [value, setValue] = useState({} as TenantContextState);

  const { metaTenantApiFactory } = useContext(SettingsContext);
  const { rights, token } = useContext(ResourceOwnerRightsContext);
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
    [tenant, rights]
  );

  useEffect(() => {
    if (
      showError &&
      metaTenantApiFactory &&
      token &&
      rights &&
      rights.TenantId
    ) {
      const api = metaTenantApiFactory();

      api
        .metadataForTenant(token, rights.TenantId)
        .then(result => setTenant(result))
        .catch(reason => showError(reason));
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

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};
