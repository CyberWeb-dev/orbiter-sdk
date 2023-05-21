import dayjs from 'dayjs';
/**
 * @param ms
 * @returns
 */
export declare function sleep(ms: number): Promise<unknown>;
/**
 * Normal format date: (YYYY-MM-DD HH:mm:ss)
 * @param date Date
 * @returns
 */
export declare function dateFormatNormal(date: string | number | Date | dayjs.Dayjs | null | undefined): string;
/**
 * String equals ignore case
 * @param value1
 * @param value2
 * @returns
 */
export declare function equalsIgnoreCase(value1: string, value2: string): boolean;
/**
 *
 * @param tokenAddress when tokenAddress=/^0x0+$/i
 * @returns
 */
export declare function isEthTokenAddress(tokenAddress: string): boolean;
/**
 * @param networkId MetaMask's networkId
 * @returns
 */
export declare function getChainInfo(networkId: number | string): {
    name: string;
    chainId: number;
    shortName: string;
    networkId: number;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpc: string[];
    faucets: string[];
    explorers: any[];
    infoURL: string;
};
/**
 * @param chainId Orbiter's chainId
 * @param ethereum window.ethereum
 */
export declare function ensureMetamaskNetwork(chainId: number, ethereum: any): Promise<void>;
