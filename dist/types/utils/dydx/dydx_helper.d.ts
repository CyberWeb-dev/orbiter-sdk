import { AccountResponseObject, ApiKeyCredentials, DydxClient, SigningMethod, TransferResponseObject } from '@dydxprotocol/v3-client';
import { ethers } from 'ethers';
import Web3 from 'web3';
export declare class DydxHelper {
    private chainId;
    private networkId;
    private host;
    private web3?;
    private signingMethod?;
    /**
     * @param chainId
     * @param web3
     * @param signingMethod TypedData | MetaMask
     */
    constructor(chainId: number, web3?: Web3, signingMethod?: SigningMethod);
    /**
     * @param ethereumAddress
     * @param alwaysNew
     * @param alwaysDeriveStarkKey
     * @returns
     */
    getDydxClient(ethereumAddress?: string, alwaysNew?: boolean, alwaysDeriveStarkKey?: boolean): Promise<DydxClient>;
    /**
     * @param ethereumAddress
     * @param ensureUser
     * @returns
     */
    getBalanceUsdc(ethereumAddress: string, ensureUser?: boolean): Promise<ethers.BigNumber>;
    /**
     * @param ethereumAddress
     * @param alwaysNew
     * @returns
     */
    getAccount(ethereumAddress: string, alwaysNew?: boolean): Promise<AccountResponseObject>;
    /**
     * @param ethereumAddress
     * @returns
     */
    getAccountId(ethereumAddress: string): string;
    /**
     * @param ethereumAddress
     * @returns
     */
    getMakerInfo(ethereumAddress: string): {
        starkKey: string;
        positionId: string;
    };
    /**
     * @param starkKey ex: 0x0367e161e41f692fc96ee22a8ab313d71bbd310617df4a02675bcfc87a3b708f
     * @param positionId ex: 58011
     * @returns 0x...
     */
    conactStarkKeyPositionId(starkKey: string, positionId: string): string;
    /**
     * @param data 0x...
     * @returns
     */
    splitStarkKeyPositionId(data: string): {
        starkKey: string;
        positionId: string;
    };
    /**
     * @param ethereumAddress 0x...
     * @returns
     */
    generateClientId(ethereumAddress: string): string;
    /**
     * @param clientId base64 string
     * @returns 0x...
     */
    getEthereumAddressFromClientId(clientId: string): string;
    /**
     * @param ethereumAddress
     * @param apiKeyCredentials
     */
    static setApiKeyCredentials(ethereumAddress: string, apiKeyCredentials: ApiKeyCredentials): void;
    /**
     * @param ethereumAddress
     * @returns
     */
    static getApiKeyCredentials(ethereumAddress: string): ApiKeyCredentials | undefined;
    /**
     * DYDX transfer => Eth transaction
     * @param transfer dYdX transfer
     * @param ethereumAddress 0x...
     * @returns
     */
    static toTransaction(transfer: TransferResponseObject, ethereumAddress: string): {
        timeStamp: number;
        hash: string;
        nonce: string;
        blockHash: string;
        transactionIndex: number;
        from: string;
        to: string;
        value: string;
        txreceipt_status: string;
        contractAddress: string;
        confirmations: number;
    };
    /**
     * The api does not return the nonce value, timestamp(ms) last three number is the nonce
     *  (warnning: there is a possibility of conflict)
     * @param  timestamp ms
     * @returns
     */
    static timestampToNonce(timestamp: number | string): string;
}
