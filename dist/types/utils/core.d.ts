import { BigNumber } from 'bignumber.js';
export declare const CHAIN_INDEX: {
    1: string;
    2: string;
    22: string;
    3: string;
    33: string;
    4: string;
    44: string;
    5: string;
    6: string;
    66: string;
    7: string;
    77: string;
    8: string;
    88: string;
    9: string;
    99: string;
    10: string;
    510: string;
    11: string;
    511: string;
    12: string;
    512: string;
    13: string;
    513: string;
    14: string;
    514: string;
    15: string;
    515: string;
    16: string;
    516: string;
    17: string;
    517: string;
};
export declare const SIZE_OP: {
    P_NUMBER: number;
};
export declare function isLimitNumber(chain: string | number): boolean;
export declare function isAmountValid(chain: any, amount: any): {
    state: boolean;
    error: string;
} | {
    state: boolean;
    error?: undefined;
};
export declare function getToAmountFromUserAmount(userAmount: any, selectMakerInfo: any, isWei: any): 0 | BigNumber;
export declare function getTAmountFromRAmount(chain: any, amount: any, pText: any): {
    state: boolean;
    error: string;
    tAmount?: undefined;
} | {
    state: boolean;
    tAmount: any;
    error?: undefined;
};
export declare function getPTextFromTAmount(chain: any, amount: any): {
    state: boolean;
    error: string;
    pText?: undefined;
} | {
    state: boolean;
    pText: any;
    error?: undefined;
};
export declare function getRAmountFromTAmount(chain: any, amount: any): {
    state: boolean;
    error: string;
    rAmount?: undefined;
} | {
    state: boolean;
    rAmount: string;
    error?: undefined;
};
export declare function pTextFormatZero(num: any): any;
export declare function transferTimeStampToTime(timestamp: any): any;
