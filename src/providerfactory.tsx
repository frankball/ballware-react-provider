/**
 * @license
 * Copyright 2021 Frank Ballmeyer
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect, PropsWithChildren } from 'react';

import {
  ProviderFactoryContext,
  ProviderFactoryContextState,
} from '@ballware/react-contexts';
import { LookupProvider } from './lookupprovider';
import { PageProvider } from './pageprovider';
import { MetaProvider } from './metaprovider';
import { AttachmentProvider } from './attachmentprovider';
import { CrudProvider } from './crudprovider';
import { NotificationProvider } from './notificationprovider';
import { TenantProvider } from './tenantprovider';
import { StatisticProvider } from './statisticprovider';
import { EditProvider } from './editprovider';

/**
 * Provider factory properties
 */
export interface ProviderFactoryProps {}

/**
 * Provides functional provider factory components
 */
export const ProviderFactory = ({
  children,
}: PropsWithChildren<ProviderFactoryProps>): JSX.Element => {
  const [value, setValue] = useState({} as ProviderFactoryContextState);

  useEffect(() => {
    setValue({
      PageProvider,
      MetaProvider,
      AttachmentProvider,
      CrudProvider,
      LookupProvider,
      NotificationProvider,
      TenantProvider,
      EditProvider,
      StatisticProvider,
    } as ProviderFactoryContextState);
  }, []);

  return (
    <ProviderFactoryContext.Provider value={value}>
      {children}
    </ProviderFactoryContext.Provider>
  );
};
