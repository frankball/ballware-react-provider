/**
 * @license
 * Copyright 2021 Frank Ballmeyer
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect, useContext, PropsWithChildren } from 'react';
import {
    ResourceOwnerRightsContext,
    SettingsContext,
    AttachmentContextState,
    AttachmentContext,    
} from '@ballware/react-contexts';


/**
 * Properties for attachment provider
 */
export interface AttachmentProviderProps {
}

/**
 * Provides attachment operations for files attached to records with unique owner id
 */
export const AttachmentProvider = ({    
    children,
}: PropsWithChildren<AttachmentProviderProps>): JSX.Element => {
    const [value, setValue] = useState({} as AttachmentContextState);
    
    const { metaAttachmentApiFactory } = useContext(SettingsContext);
    const { token } = useContext(ResourceOwnerRightsContext);

    useEffect(() => {
        if (
            token &&            
            metaAttachmentApiFactory
        ) {
            const attachmentApi = metaAttachmentApiFactory();

            setValue((previousValue) => {
                return {
                    ...previousValue,            
                    fetch: (id) => attachmentApi.queryByOwner(token, id),
                    upload: (id, file) => attachmentApi.upload(token, id, file),
                    open: (id, fileName) => attachmentApi.open(token, id, fileName),
                    drop: (id, fileName) => attachmentApi.remove(token, id, fileName),
                } as AttachmentContextState;
            });
        }
    }, [token, metaAttachmentApiFactory]);

    return <AttachmentContext.Provider value={value}>{children}</AttachmentContext.Provider>;
};
