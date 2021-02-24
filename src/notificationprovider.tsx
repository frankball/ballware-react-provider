/**
 * @license
 * Copyright 2021 Frank Ballmeyer
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */

import React, {
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from 'react';
import {
  NotificationContext,
  NotificationContextState,
  NotificationDisplayContext,
  NotificationDisplayContextState,
} from '@ballware/react-contexts';

/**
 * Properties for notification provider
 */
export interface NotificationProviderProps {}

/**
 * Provides functionality for triggering and displaying user notifications
 */
export const NotificationProvider = ({
  children,
}: PropsWithChildren<NotificationProviderProps>): JSX.Element => {
  const [value, setValue] = useState<NotificationContextState>({});
  const [displayValue, setDisplayValue] = useState<
    NotificationDisplayContextState
  >({});
  const [message, setMessage] = useState<
    { type: 'error' | 'info' | 'warning'; text: string } | undefined
  >();

  const showInfo = useCallback(message => {
    if (message) {
      setMessage({ type: 'info', text: message.toString() });
      console.info(message);
    }
  }, []);

  const showWarning = useCallback(message => {
    if (message) {
      setMessage({ type: 'warning', text: message.toString() });
      console.warn(message);
    }
  }, []);

  const showError = useCallback(message => {
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
  }, [hide, showError, showInfo, showWarning]);

  useEffect(() => {
    setDisplayValue(previousValue => {
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
