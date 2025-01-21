export type JSONPrimitive = number | string | null | boolean;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export function callAppsScript<T = string>(
    method: string,
    args: JSONValue[],
    callback: (data: T) => void,
    errorCallback?: (error: Error) => void
): void {
    let globals = (window as any);

    if (!errorCallback) {
        errorCallback = (error: Error) => {
            console.error(
                `Erreur lors de l'appel à Apps Script: ${method} `,
                error
            );
        };
    }
    try {
        globals.google.script.run
            .withSuccessHandler((data: any) => {
                callback(data);
            })
            .withFailureHandler((error: any) => {
                errorCallback(error)
            })
        [method](...args);
    } catch (error: any) {
        errorCallback(error);
    }
}

export function getQueryParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function mapNotNull<T, U>(list: T[], callback: (value: T, index: number, array: T[]) => U | undefined | null, thisArg?: any): U[] {
    return list.map(callback, thisArg).filter(a => a) as U[];
}

export function keepFocus(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    let elt = document.activeElement;
    if (elt instanceof HTMLElement) setTimeout(() => {
        elt.focus();
    })
}

export function countDecimals(v: any) {
    if (Math.floor(v.valueOf()) === v.valueOf()) return 0;
    return v.toString().split(".")[1].length || 0;
}

export function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
}

export function getPrimaryKeysValue(source: any, primaryKeys: string[] | undefined): any {
    let keys = primaryKeys ?? [];
    let value: any;
    if (typeof source === 'object' && keys.length > 0) {
        value = keys.map(k => source[k]).join("-");
    } else value = source;
    if (typeof value === 'object') value = JSON.stringify(value);
    return value;
}

export function getPrimaryKeyValue(source: any, primaryKey: string | undefined): any {
    let value: any;
    if (typeof source === 'object' && primaryKey) {
        value = source[primaryKey];
    } else value = source;
    if (typeof value === 'object') value = JSON.stringify(value);
    return value;
}

const lastIds: Map<string, number> = new Map();

export function getUniqueId(prefix: string = "id"): string {
    prefix = validDomPrefix(prefix);
    let thisId = (lastIds.get(prefix) ?? 0) + 1;
    lastIds.set(prefix, thisId);
    return `${prefix}${thisId}`;
}

export function getUniqueIdNumber(prefix: string = "id"): number {
    prefix = validDomPrefix(prefix);
    let thisId = (lastIds.get(prefix) ?? 0) + 1;
    lastIds.set(prefix, thisId);
    return thisId;
}

function validDomPrefix(prefix: string): string {
    // we use long id to make the browser propose valid values
    return prefix
        .trim() // Remove leading and trailing whitespace
        .replace(/ /g, '_') // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9_-]/g, '') // Remove invalid characters (only letters, numbers, underscores, and dashes are allowed)
        .replace(/^([^a-zA-Z_])/, '_$1') // Add an underscore if the first character is not a letter or underscore
        .replace(/([0-9])$/, '$1_') // Add an underscore if the last character is a number
        .replace(/__+/g, '_'); // Replace multiple consecutive underscores with a single underscore
}

