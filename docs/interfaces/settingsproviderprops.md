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

• `Optional` **appversion**: *undefined* \| *string*

Current app version for display

Defined in: [src/settingsprovider.tsx:39](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L39)

___

### googlekey

• `Optional` **googlekey**: *undefined* \| *string*

Google API key used by maps implementation

Defined in: [src/settingsprovider.tsx:44](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L44)

___

### identityAuthApiFactory

• `Optional` **identityAuthApiFactory**: *undefined* \| () => ResourceOwnerAuthApi

API factory for resource owner authentication functions

Defined in: [src/settingsprovider.tsx:49](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L49)

___

### identityRoleApiFactory

• `Optional` **identityRoleApiFactory**: *undefined* \| () => IdentityRoleApi

API factory for access to role list

Defined in: [src/settingsprovider.tsx:59](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L59)

___

### identityUserApiFactory

• `Optional` **identityUserApiFactory**: *undefined* \| () => IdentityUserApi

API factory for access to user list

Defined in: [src/settingsprovider.tsx:54](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L54)

___

### metaAttachmentApiFactory

• `Optional` **metaAttachmentApiFactory**: *undefined* \| () => MetaAttachmentApi

API factory to access attachments

Defined in: [src/settingsprovider.tsx:74](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L74)

___

### metaDocumentApiFactory

• `Optional` **metaDocumentApiFactory**: *undefined* \| () => MetaDocumentApi

API factory to access print document lists

Defined in: [src/settingsprovider.tsx:99](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L99)

___

### metaDocumentationApiFactory

• `Optional` **metaDocumentationApiFactory**: *undefined* \| () => MetaDocumentationApi

API factory to access documentation

Defined in: [src/settingsprovider.tsx:104](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L104)

___

### metaEntityApiFactory

• `Optional` **metaEntityApiFactory**: *undefined* \| () => MetaEntityApi

API factory to access generic entity metadata

Defined in: [src/settingsprovider.tsx:64](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L64)

___

### metaGenericEntityApiFactory

• `Optional` **metaGenericEntityApiFactory**: *undefined* \| (`baseUrl`: *string*) => MetaGenericEntityApi

API factory to access generic entity crud operations

Defined in: [src/settingsprovider.tsx:114](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L114)

___

### metaLookupApiFactory

• `Optional` **metaLookupApiFactory**: *undefined* \| () => MetaLookupApi

API factory to access lookup data

Defined in: [src/settingsprovider.tsx:84](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L84)

___

### metaPageApiFactory

• `Optional` **metaPageApiFactory**: *undefined* \| () => MetaPageApi

API factory to access page metadata

Defined in: [src/settingsprovider.tsx:109](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L109)

___

### metaPickvalueApiFactory

• `Optional` **metaPickvalueApiFactory**: *undefined* \| () => MetaPickvalueApi

API factory to access pickvalue data

Defined in: [src/settingsprovider.tsx:94](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L94)

___

### metaProcessingstateApiFactory

• `Optional` **metaProcessingstateApiFactory**: *undefined* \| () => MetaProcessingstateApi

API factory to access processing state functionality

Defined in: [src/settingsprovider.tsx:89](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L89)

___

### metaStatisticApiFactory

• `Optional` **metaStatisticApiFactory**: *undefined* \| () => MetaStatisticApi

API factory to access statistic metadata and data

Defined in: [src/settingsprovider.tsx:79](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L79)

___

### metaTenantApiFactory

• `Optional` **metaTenantApiFactory**: *undefined* \| () => MetaTenantApi

API factory to access tenant metadata

Defined in: [src/settingsprovider.tsx:69](https://github.com/frankball/ballware-react-provider/blob/5745264/src/settingsprovider.tsx#L69)
