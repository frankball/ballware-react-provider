import React, { useState, useEffect, useCallback } from 'react';
import {
    NotificationContext,
    NotificationContextState,
    NotificationDisplayContext,
    NotificationDisplayContextState,
} from '@ballware/react-contexts';

export interface NotificationProviderProps {
    children: JSX.Element | Array<JSX.Element>;
}

export const NotificationProvider = ({ children }: NotificationProviderProps): JSX.Element => {
    const [value, setValue] = useState<NotificationContextState>({});
    const [displayValue, setDisplayValue] = useState<NotificationDisplayContextState>({});
    const [message, setMessage] = useState<{ type: 'error' | 'info' | 'warning'; text: string } | undefined>();

    const showInfo = useCallback((message) => {
        if (message) {
            setMessage({ type: 'info', text: message.toString() });
            console.info(message);
        }
    }, []);

    const showWarning = useCallback((message) => {
        if (message) {
            setMessage({ type: 'warning', text: message.toString() });
            console.warn(message);
        }
    }, []);

    const showError = useCallback((message) => {
        if (message) {
            setMessage({ type: 'error', text: message.toString() });
            console.error(message);
        }
    }, []);

    const hide = useCallback(() => {
        setMessage(undefined);
    }, []);

    useEffect(() => {
        setValue({
            showInfo,
            showWarning,
            showError,
            hide,
        } as NotificationContextState);
    }, []);

    useEffect(() => {
        setDisplayValue((previousValue) => {
            return {
                ...previousValue,
                message,
            } as NotificationDisplayContextState;
        });
    }, [message]);

    return (
        <NotificationContext.Provider value={value}>
            <NotificationDisplayContext.Provider value={displayValue}>
                <React.Fragment>{children}</React.Fragment>
            </NotificationDisplayContext.Provider>
        </NotificationContext.Provider>
    );
};
