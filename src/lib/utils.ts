/**
 * TODO: MOVE TO LIB
 */



export function parseBoolean(str?: string): boolean {
    switch (str?.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true;
        case 'false':
        case 'no':
        case '0':
        case null:
            return false;
        default:
            throw new Error('Invalid input string');
    }
}

/**
 * executes a arbitrary lambda and measures the time it took
 * @param a a string literal point out what the function does
 * @param b a string literal emitted by the function itself (a verbosity sidedish on the execution)
 * @returns T
 */
export function execute<T>(a: string, b: () => [T, string]): T {
    const start = performance.now();
    const [x, c] = b();
    const end = performance.now();
    const z = end - start;
    console.debug(`${a}...${c} took (ms) ${z}`);
    return x;
}

export async function executeAsync<T>(a: string, b: () => Promise<[T, string]>): Promise<T> {
    const start = performance.now();
    const [x, c] = await b();
    const end = performance.now();
    const z = end - start;
    console.debug(`${a}...${c} took (ms) ${z}`);
    return x;
}

export function isNotEmpty(x: any) {
    return x !== undefined && x !== null && x !== "";
}

export function isNullOrUndef(data: any): boolean {
    return data === null || data === undefined
}

/**
 * creates a unique Id from alphanumerical values with length n || 10
 */
export function makeId(n: number = 10) {
    var xs = ["id"];
    var def = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)
        xs.push(def.charAt(Math.floor(Math.random() * def.length)));

    return xs.join("");
}

export function makeJSSafe(obj: { [key: string]: any }) {
    if (!obj) {
        return obj;
    }
    Object.keys(obj).map(key => {
        if (obj[key] && Object.getPrototypeOf(obj[key]).toStringTag == '[object Decimal]') obj[key] = obj[key].toNumber();
    });
    return obj;
}

export function makeJSSafeRecursively(obj: { [key: string]: any }) {
    // Iterate over object keys
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (Array.isArray(value)) { // Check if the value is an array
            obj[key] = value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return makeJSSafeRecursively(item); // Recursively normalize each object in the array
                }
                return item; // Return non-object items directly
            });
        } else if (value && Object.getPrototypeOf(obj[key]).toStringTag == '[object Decimal]') {
            obj[key] = obj[key].toNumber();
        } else if (typeof value === 'object' && value !== null) {
            obj[key] = makeJSSafeRecursively(value); // Recursively normalize nested objects
        }
    }

    return obj;
}

export function decorateWithTimestamp(obj: { [key: string]: any }) {
    obj["_ts"] = new Date().toISOString();

    return obj;
}



// Function to pick a subset of properties from Object A
export function pick<T, K extends keyof T>(obj: T, ...props: K[]): Pick<T, K> {
    const result: any = {};
    props.forEach(prop => {
        result[prop] = obj[prop];
    });
    return result;
}

/**
 * Outputs the date in the browser's locale format
 * @param date 
 * @returns 
 */
export function formatDate(date: Date, defaultLocale: string = 'en-US'): string {
    // Check if the navigator object is available
    const locale = typeof navigator !== 'undefined' ? navigator.language : defaultLocale;
    return new Intl.DateTimeFormat(locale).format(date);
}

export function formatDateYYYMMdd(date: Date) {
    const formattedDate = date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0');
    return formattedDate;
}

/**
 * 
 * @param timestamp a timestamp with timezone information, might represent the timestamp an object has been created server-side
 */
export function formatIsoTimestampForLocalTimezone(timestamp: Date) {
    if (timestamp) {
        const date = timestamp;

        const formattedDate = new Intl.DateTimeFormat('default', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',

            //timeZoneName: 'short'
        }).format(date);

        return formattedDate
    } else {
        return undefined
    }
}

/**
 * Function to format the date into HH:MM or HH:MM:SS
 * @param date 
 * @returns 
 */
export function formatTime(date: Date) {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    // Uncomment the next line if you need seconds precision
    // const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    // Return in HH:MM format
    return `${hours}:${minutes}`;
    // Uncomment the next line and comment out the previous return statement for HH:MM:SS format
    // return `${hours}:${minutes}:${seconds}`;
}



export function isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.valueOf());
}
/*
type HourlyDifferenceMessageMap = {
    [key: string]: (hoursDiff: number) => boolean;
};*/

7/**
function getMessageForDateDiff(date: Date, messageMap: HourlyDifferenceMessageMap): string {
    const now = new Date();
    const hoursDiff = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    for (const message in messageMap) {
        if (messageMap[message](hoursDiff)) {
            return message;
        }
    }

    return "Keine passende Nachricht gefunden";
}
 */

// Example usage

type DaysDifferenceMessageMap = {
    [key: string]: (daysDiff: number) => boolean;
};

export function getDayDifference(fromDate: Date, toDate: Date): number {
    // Set the time to 00:00:00 for both dates to ignore time components
    const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffInMs = to.getTime() - from.getTime();

    const daysDelta = Math.round(diffInMs / msPerDay);
    return daysDelta;
}

/**
 * calculates the day-difference ignoring the time difference
 * @param date 
 * @param messageMap 
 * @returns 
 */
export function getMessageForDayDiff(date: Date, messageMap: DaysDifferenceMessageMap): string | undefined {
    const today = new Date();
    const daysDiff = getDayDifference(today, date);

    for (const message in messageMap) {
        if (messageMap[message](daysDiff)) {
            return message;
        }
    }

    return undefined;
}

// Example usage
export const messageMapForDayDiff: DaysDifferenceMessageMap = {
    "Due today": x => x === 0,
    "Overdue since yesterday": x => x === -1,
    "Overdue since the day before yesterday": x => x < -1,
    "Due tomorrow": x => x === 1,
    "Due in two days": x => x === 2,
    "Due in three days": x => x === 3,
    "Due in four days": x => x === 4,
    "Due in five days": x => x === 5
};

//console.log(getMessageForDayDiff(givenDate, messageMapForDayDiff));

// https://github.com/hughsk/remove-element/blob/master/index.js
export function remove(element: HTMLElement) {
    if (element && element.parentNode) element.parentNode.removeChild(element);

    return element;
}

export type variableArgumentLambda = (...args: any[]) => any;
export function throttle(fn: variableArgumentLambda, threshhold: number = 250): variableArgumentLambda {
    let last: any, deferTimer: any;
    return function (this: any) {
        const now = +new Date(),
            args = arguments as unknown as any[],
            ctx = this;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(ctx, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(ctx, args);
        }
    };
}


export function coerceAnyOrNullToAnyOrUndef<T>(x: T | null): T | undefined {
    return x === null ? undefined : x;
}

export function prefixed(prefix?: string): (x: string) => string {
    const xs: string[] = []
    if (isNotEmpty(prefix)) {
        xs.push(prefix!)

    }

    return (x: string) => {
        return [...xs, x].join("/");
    }
}


export function classs(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Iterating through the keys of the input object, prefixing each key with the given prefix, and constructing a new object with these prefixed keys
 * @param obj 
 * @param prefix 
 * @returns 
 */
export function prefixObjectKeys<T extends { [key: string]: any }>(obj: T, prefix: string): { [key: string]: T[keyof T] } {
    const result: { [key: string]: T[keyof T] } = {};

    Object.keys(obj).forEach(key => {
        result[`${prefix}/${key}`] = obj[key];
    });
    console.log("result", JSON.stringify(result))
    return result;
}

export function updateObjectKeys(obj: { [key: string]: any }, prefix: string): void {

    Object.keys(obj).forEach(key => {
        obj[`${prefix}/${key}`] = obj[key];
        delete obj[key];
    });
}

const dateFields = ['return_date', 'delivery_date']
const timeFields = ['return_time', 'delivery_time']
export function normalizeDateAndTimeFields(obj: { [key: string]: any }): void {
    Object.entries(obj).map(([key, value]) => {
        if (value) {
            if (dateFields.find(x => key.endsWith(x))) {
                if (value instanceof Date) {
                    obj[key] = formatDateYYYMMdd(value);
                }
            } else if (timeFields.find(x => key.endsWith(x))) {
                if (value instanceof Date) {
                    obj[key] = formatTime(value);
                }
            }

        }
    });

}

/**
 * tweak date and time fields in order to allow to go easy on malli side
 * @param key 
 * @param value 
 * @returns 
 */
export function dateFormatReplacer(key: string, value: any): any {
    if (value instanceof Date) {
        if (dateFields.find(x => key.endsWith(x))) {
            return formatDateYYYMMdd(value);
        } else if (timeFields.find(x => key.endsWith(x))) {
            return formatTime(value);
        }
    }
    return value; // Return the value unchanged if it's not a Date
}

export function deepClone(key: string | undefined, obj: any): any {
    if (key && obj instanceof Date) {
        if (dateFields.find(x => key.endsWith(x))) {
            return formatDateYYYMMdd(obj);
        } else if (timeFields.find(x => key.endsWith(x))) {
            return formatTime(obj);
        }
    } else if (Array.isArray(obj)) {
        // If it's an array, transform each element
        return obj.map(x => deepClone(undefined, x));
    } else if (obj !== null && typeof obj === 'object') {
        // If it's an object, transform each value
        const transformed = {} as { [key: string]: any };
        for (const [key, value] of Object.entries(obj)) {
            transformed[key] = deepClone(key, value);
        }
        return transformed;
    }
    // If it's not an object, array, or Date, return it unchanged
    return obj;
}

export function getPrefixedUnwrappedState(prefix: string, state: { [key: string]: any }, decorator?: (obj: any) => any) {
    // we don't do JSON.stringify anymore, since the problem is with dates and times. Actually there is a key/value replacer which unfortunatelly works top-down, which cannot be used when working with SolidJS
    let unwrapped = deepClone(undefined, state);  //JSON.parse(JSON.stringify(state, dateFormatReplacer));
    if (decorator) {
        unwrapped = decorator(unwrapped)
    }
    Object.entries(unwrapped).map(([key, value]) => {
        delete unwrapped[key];
        unwrapped[`${prefix}/${key}`] = value;
    })
    return unwrapped
}


export function formatNumberForStats(x?: number) {
    if (x) {
        if (x < 1000) {
            return x;
        } else if (x < 1000000) {
            return (Math.floor(x / 100) / 10) + "K";
        } else {
            return (Math.floor(x / 10000) / 100) + "M";
        }
    } else {
        return "n/a"
    }
}

export type Prefix<K extends string, T extends string> = `${K}.${T}`;
export type Prefixer<K, T extends string> = {
    [P in keyof K as Prefix<T, string & P>]: K[P];
};

/**
 * Implements a chain of responsibility pattern in TypeScript where a series of functions each returning a Promise<string|undefined> are executed sequentially until a non-null value is returned
 */
type AsyncSupplier<T> = () => Promise<T | undefined>;

export async function chainOfResponsibility<T>(functions: AsyncSupplier<T>[]): Promise<T | undefined> {
    for (const func of functions) {
        const result = await func();
        if (result !== undefined && result !== null) {
            return result as T;
        }
    }
    return undefined; // or any default value if all functions return undefined
}

export async function executeAsyncFunctions(functions: (() => Promise<any>)[]) {
    let result: any;
    for (const func of functions) {
        result = await func()
            .catch(e => {
                throw e;
            })
    }

    return result;

}

export function takeWhile<T>(array: T[], predicate: (element: T) => boolean): T[] {
    const result: T[] = [];
    for (const element of array) {
        if (!predicate(element)) {
            break;
        }
        result.push(element);
    }
    return result;
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

export function convertMarkdownLinks(text: string): string {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    return text.replace(linkRegex, '<a href="$2" target="_blank">$1</a>');
}


export function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// Example usage
// const hash1 = simpleHash("hello");
// const hash2 = simpleHash("world");
// console.log(hash1, hash2); // Different hashes for different strings
