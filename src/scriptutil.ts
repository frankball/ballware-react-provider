import { v4 as uuid } from 'uuid';
import JSON5 from 'json5';
import moment from 'moment';
import axios from 'axios';

import { ScriptUtil } from '@ballware/meta-interface';
import { LookupDescriptor, LookupStoreDescriptor } from '@ballware/react-contexts';
import { geocodeAddress, geocodeLocation } from './geocoder';

export const nameof = <T>(name: keyof T): keyof T => name;
export const nameofFactory = <T>() => (name: keyof T): keyof T => name;

export function arrayToMap<T>(array: Array<T>, key: (obj: T) => string): { [key: string]: T } {
    const result: { [key: string]: T } = {};

    array?.forEach((v) => (result[key(v)] = v));

    return result;
}

export function mapToArray<T>(map: { [key: string]: T }): Array<T> {
    const result: Array<T> = [];

    Object.keys(map ?? {}).forEach((k) => result.push(map[k]));

    return result;
}

export function beginOfYear(): Date {
    const m = moment().startOf('year').utc();

    return moment(m).add(m.utcOffset(), 'm').toDate();
}

export function endOfYear(): Date {
    const m = moment().endOf('year').utc();

    return moment(m).add(m.utcOffset(), 'm').toDate();
}

export function beginOfLastYear(): Date {
    const m = moment().startOf('year').utc();

    return moment(m).add(m.utcOffset(), 'm').subtract(1, 'year').toDate();
}

export function endOfLastYear(): Date {
    const m = moment().endOf('year').utc();

    return moment(m).add(m.utcOffset(), 'm').subtract(1, 'year').toDate();
}

export function dateToLocalDate(date: Date): Date | null {
    if (date) return moment(date).toDate();

    return null;
}

export function localDateToDate(date: Date): Date | null {
    if (date) return moment(date).add(moment(date).utcOffset(), 'm').toDate();

    return null;
}

export const createUtil = (token: string): ScriptUtil => {
    return {
        token: () => token,
        uuid: () => uuid(),
        parse: (json) => JSON5.parse(json),
        stringify: (json) => JSON5.stringify(json),
        dateToLocalDate: (date) => dateToLocalDate(date),
        localDateToDate: (date) => localDateToDate(date),
        beginOfYear: () => beginOfYear(),
        endOfYear: () => endOfYear(),
        beginOfLastYear: () => beginOfLastYear(),
        endOfLastYear: () => endOfLastYear(),
        withLookupList: (lookup: unknown, callback: (items: Array<Record<string, unknown>>) => void) => {
            ((lookup as LookupDescriptor).store as LookupStoreDescriptor)
                .listFunc()
                .then((result) => {
                    callback(result);
                })
                .catch((reason) => console.error(reason));
        },
        withLookupById: (lookup: unknown, id: string, callback: (item?: Record<string, unknown>) => void) => {
            ((lookup as LookupDescriptor).store as LookupStoreDescriptor)
                .byIdFunc(id)
                .then((result) => {
                    callback(result);
                })
                .catch((reason) => console.error(reason));
        },
        withAutocompleteList: (autocomplete: unknown, callback: (items: Array<unknown>) => void) => {
            (autocomplete as LookupDescriptor).store
                .listFunc()
                .then((result) => {
                    callback(result);
                })
                .catch((reason) => console.error(reason));
        },
        getJson: (url, success, failure) => {
            axios
                .get<unknown>(url, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    success(response.data);
                })
                .catch((reason) => failure(reason));
        },
        getText: (url, success, failure) => {
            axios
                .get<string>(url, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    success(response.data);
                })
                .catch((reason) => failure(reason));
        },
        geocodeAddress: (address, callback) => {
            geocodeAddress(address, callback);
        },
        geocodeLocation: (location, callback) => {
            geocodeLocation(location, callback);
        },
    } as ScriptUtil;
};
