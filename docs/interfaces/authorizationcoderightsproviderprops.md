[@ballware/react-provider](../README.md) / [Exports](../modules.md) / AuthorizationCodeRightsProviderProps

# Interface: AuthorizationCodeRightsProviderProps

Property set for authorization code flow rights provider

## Hierarchy

* **AuthorizationCodeRightsProviderProps**

## Table of contents

### Properties

- [account\_management\_uri](authorizationcoderightsproviderprops.md#account_management_uri)
- [authority](authorizationcoderightsproviderprops.md#authority)
- [client](authorizationcoderightsproviderprops.md#client)
- [post\_logout\_redirect\_uri](authorizationcoderightsproviderprops.md#post_logout_redirect_uri)
- [redirect\_uri](authorizationcoderightsproviderprops.md#redirect_uri)
- [response\_type](authorizationcoderightsproviderprops.md#response_type)
- [scope](authorizationcoderightsproviderprops.md#scope)
- [secret](authorizationcoderightsproviderprops.md#secret)
- [userinfoMapper](authorizationcoderightsproviderprops.md#userinfomapper)

## Properties

### account\_management\_uri

• `Optional` **account\_management\_uri**: *undefined* \| *string*

Optional uri for redirect to account management portal for authenticated user

Defined in: src/authorizationcoderightsprovider.tsx:73

___

### authority

• **authority**: *string*

Url of authentication provider

Defined in: src/authorizationcoderightsprovider.tsx:38

___

### client

• **client**: *string*

Client application identifier

Defined in: src/authorizationcoderightsprovider.tsx:43

___

### post\_logout\_redirect\_uri

• **post\_logout\_redirect\_uri**: *string*

Url in application called after user has logged out

Defined in: src/authorizationcoderightsprovider.tsx:58

___

### redirect\_uri

• **redirect\_uri**: *string*

Url in application called for result of login

Defined in: src/authorizationcoderightsprovider.tsx:53

___

### response\_type

• `Optional` **response\_type**: *undefined* \| *string*

Response type returned to application from authentication provider

Defined in: src/authorizationcoderightsprovider.tsx:63

___

### scope

• **scope**: *string*

Authentication scopes needed by application

Defined in: src/authorizationcoderightsprovider.tsx:68

___

### secret

• `Optional` **secret**: *undefined* \| *string*

Optional client secret needed for client application

Defined in: src/authorizationcoderightsprovider.tsx:48

___

### userinfoMapper

• **userinfoMapper**: UserInfoMappingFunc

Mapping function to map additional content of userinfo endpoint to user rights instance

Defined in: src/authorizationcoderightsprovider.tsx:78
