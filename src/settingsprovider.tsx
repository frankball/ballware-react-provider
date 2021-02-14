/**
 * @license
 * Copyright 2021 Frank Ballmeyer
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */

import React, { PropsWithChildren, useState } from 'react';
import { ResourceOwnerAuthApi, IdentityUserApi, IdentityRoleApi } from '@ballware/identity-interface';
import {
    MetaEntityApi,
    MetaTenantApi,
    MetaAttachmentApi,
    MetaStatisticApi,
    MetaLookupApi,
    MetaProcessingstateApi,
    MetaPickvalueApi,
    MetaDocumentApi,
    MetaDocumentationApi,
    MetaPageApi,
    MetaGenericEntityApi,
} from '@ballware/meta-interface';
import { SettingsContext, SettingsContextState } from '@ballware/react-contexts';

/**
 * Properties for settings provider
 */
export interface SettingsProviderProps {
    /**
     * Current app version for display
     */
    appversion: string;

    /**
     * Google API key used by maps implementation
     */
    googlekey?: string;

    /**
     * API factory for resource owner authentication functions
     */
    identityAuthApiFactory: () => ResourceOwnerAuthApi;

    /**
     * API factory for access to user list
     */
    identityUserApiFactory: () => IdentityUserApi;

    /**
     * API factory for access to role list
     */
    identityRoleApiFactory: () => IdentityRoleApi;

    /**
     * API factory to access generic entity metadata
     */
    metaEntityApiFactory: () => MetaEntityApi;

    /**
     * API factory to access tenant metadata
     */
    metaTenantApiFactory: () => MetaTenantApi;

    /**
     * API factory to access attachments
     */
    metaAttachmentApiFactory: () => MetaAttachmentApi;

    /**
     * API factory to access statistic metadata and data
     */
    metaStatisticApiFactory: () => MetaStatisticApi;

    /**
     * API factory to access lookup data
     */
    metaLookupApiFactory: () => MetaLookupApi;

    /**
     * API factory to access processing state functionality
     */
    metaProcessingstateApiFactory: () => MetaProcessingstateApi;

    /**
     * API factory to access pickvalue data
     */
    metaPickvalueApiFactory: () => MetaPickvalueApi;

    /**
     * API factory to access print document lists
     */
    metaDocumentApiFactory: () => MetaDocumentApi;

    /**
     * API factory to access documentation
     */
    metaDocumentationApiFactory: () => MetaDocumentationApi;

    /**
     * API factory to access page metadata
     */
    metaPageApiFactory: () => MetaPageApi;

    /**
     * API factory to access generic entity crud operations
     */
    metaGenericEntityApiFactory: (baseUrl: string) => MetaGenericEntityApi;    
}

/**
 * Provides environment dependent settings and data access
 */
export const SettingsProvider = ({
    appversion,
    googlekey,
    identityAuthApiFactory,
    identityUserApiFactory,
    identityRoleApiFactory,
    metaEntityApiFactory,
    metaTenantApiFactory,
    metaAttachmentApiFactory,
    metaStatisticApiFactory,
    metaLookupApiFactory,
    metaProcessingstateApiFactory,
    metaPickvalueApiFactory,
    metaDocumentApiFactory,
    metaDocumentationApiFactory,
    metaPageApiFactory,
    metaGenericEntityApiFactory,
    children,
}: PropsWithChildren<SettingsProviderProps>): JSX.Element => {
    const [value] = useState({
        version: appversion,
        googlekey,
        identityAuthApiFactory,
        identityUserApiFactory,
        identityRoleApiFactory,
        metaEntityApiFactory,
        metaTenantApiFactory,
        metaAttachmentApiFactory,
        metaStatisticApiFactory,
        metaLookupApiFactory,
        metaProcessingstateApiFactory,
        metaPickvalueApiFactory,
        metaDocumentApiFactory,
        metaDocumentationApiFactory,
        metaPageApiFactory,
        metaGenericEntityApiFactory,
    } as SettingsContextState);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
