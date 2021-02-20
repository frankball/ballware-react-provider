[@ballware/react-provider](../README.md) / [Exports](../modules.md) / SettingsProviderProps

# Interface: SettingsProviderProps

Properties for settings provider

## Hierarchy

* **SettingsProviderProps**

## Table of contents

### Properties

- [appversion](settingsproviderprops.md#appversion)
- [googlekey](settingsproviderprops.md#googlekey)
- [identityAuthApiFactory](settingsproviderprops.md#identityauthapifactory)
- [identityRoleApiFactory](settingsproviderprops.md#identityroleapifactory)
- [identityUserApiFactory](settingsproviderprops.md#identityuserapifactory)
- [metaAttachmentApiFactory](settingsproviderprops.md#metaattachmentapifactory)
- [metaDocumentApiFactory](settingsproviderprops.md#metadocumentapifactory)
- [metaDocumentationApiFactory](settingsproviderprops.md#metadocumentationapifactory)
- [metaEntityApiFactory](settingsproviderprops.md#metaentityapifactory)
- [metaGenericEntityApiFactory](settingsproviderprops.md#metagenericentityapifactory)
- [metaLookupApiFactory](settingsproviderprops.md#metalookupapifactory)
- [metaPageApiFactory](settingsproviderprops.md#metapageapifactory)
- [metaPickvalueApiFactory](settingsproviderprops.md#metapickvalueapifactory)
- [metaProcessingstateApiFactory](settingsproviderprops.md#metaprocessingstateapifactory)
- [metaStatisticApiFactory](settingsproviderprops.md#metastatisticapifactory)
- [metaTenantApiFactory](settingsproviderprops.md#metatenantapifactory)

## Properties

### appversion

• **appversion**: *string*

Current app version for display

Defined in: [src/settingsprovider.tsx:32](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L32)

___

### googlekey

• `Optional` **googlekey**: *undefined* \| *string*

Google API key used by maps implementation

Defined in: [src/settingsprovider.tsx:37](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L37)

___

### identityAuthApiFactory

• **identityAuthApiFactory**: () => ResourceOwnerAuthApi

API factory for resource owner authentication functions

Defined in: [src/settingsprovider.tsx:42](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L42)

___

### identityRoleApiFactory

• **identityRoleApiFactory**: () => IdentityRoleApi

API factory for access to role list

Defined in: [src/settingsprovider.tsx:52](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L52)

___

### identityUserApiFactory

• **identityUserApiFactory**: () => IdentityUserApi

API factory for access to user list

Defined in: [src/settingsprovider.tsx:47](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L47)

___

### metaAttachmentApiFactory

• **metaAttachmentApiFactory**: () => MetaAttachmentApi

API factory to access attachments

Defined in: [src/settingsprovider.tsx:67](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L67)

___

### metaDocumentApiFactory

• **metaDocumentApiFactory**: () => MetaDocumentApi

API factory to access print document lists

Defined in: [src/settingsprovider.tsx:92](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L92)

___

### metaDocumentationApiFactory

• **metaDocumentationApiFactory**: () => MetaDocumentationApi

API factory to access documentation

Defined in: [src/settingsprovider.tsx:97](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L97)

___

### metaEntityApiFactory

• **metaEntityApiFactory**: () => MetaEntityApi

API factory to access generic entity metadata

Defined in: [src/settingsprovider.tsx:57](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L57)

___

### metaGenericEntityApiFactory

• **metaGenericEntityApiFactory**: (`baseUrl`: *string*) => MetaGenericEntityApi

API factory to access generic entity crud operations

Defined in: [src/settingsprovider.tsx:107](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L107)

___

### metaLookupApiFactory

• **metaLookupApiFactory**: () => MetaLookupApi

API factory to access lookup data

Defined in: [src/settingsprovider.tsx:77](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L77)

___

### metaPageApiFactory

• **metaPageApiFactory**: () => MetaPageApi

API factory to access page metadata

Defined in: [src/settingsprovider.tsx:102](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L102)

___

### metaPickvalueApiFactory

• **metaPickvalueApiFactory**: () => MetaPickvalueApi

API factory to access pickvalue data

Defined in: [src/settingsprovider.tsx:87](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L87)

___

### metaProcessingstateApiFactory

• **metaProcessingstateApiFactory**: () => MetaProcessingstateApi

API factory to access processing state functionality

Defined in: [src/settingsprovider.tsx:82](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L82)

___

### metaStatisticApiFactory

• **metaStatisticApiFactory**: () => MetaStatisticApi

API factory to access statistic metadata and data

Defined in: [src/settingsprovider.tsx:72](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L72)

___

### metaTenantApiFactory

• **metaTenantApiFactory**: () => MetaTenantApi

API factory to access tenant metadata

Defined in: [src/settingsprovider.tsx:62](https://github.com/frankball/ballware-react-provider/blob/1c8774d/src/settingsprovider.tsx#L62)
