import React, { useState } from 'react';
import { IdentityAuthApi, IdentityUserApi, IdentityRoleApi } from '@ballware/identity-interface';
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

export interface SettingsProviderProps {
    appversion: string;
    identityAuthApiFactory: () => IdentityAuthApi;
    identityUserApiFactory: () => IdentityUserApi;
    identityRoleApiFactory: () => IdentityRoleApi;
    metaEntityApiFactory: () => MetaEntityApi;
    metaTenantApiFactory: () => MetaTenantApi;
    metaAttachmentApiFactory: () => MetaAttachmentApi;
    metaStatisticApiFactory: () => MetaStatisticApi;
    metaLookupApiFactory: () => MetaLookupApi;
    metaProcessingstateApiFactory: () => MetaProcessingstateApi;
    metaPickvalueApiFactory: () => MetaPickvalueApi;
    metaDocumentApiFactory: () => MetaDocumentApi;
    metaDocumentationApiFactory: () => MetaDocumentationApi;
    metaPageApiFactory: () => MetaPageApi;
    metaGenericEntityApiFactory: (baseUrl: string) => MetaGenericEntityApi;
    children: JSX.Element | Array<JSX.Element>;
}

export const SettingsProvider = ({
    appversion,
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
}: SettingsProviderProps): JSX.Element => {
    const [value] = useState({
        version: appversion,
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
