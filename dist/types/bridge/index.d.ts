import { ethers, Signer } from 'ethers';
export type BridgeToken = {
    chainId: number;
    name: string;
    address: string;
    precision: number;
    makerAddress: string;
    icon?: string;
};
export type BridgeChain = {
    id: number;
    name: string;
    networkId: number | string;
    icon?: string;
};
export type BridgeNetwork = 'Mainnet' | 'Testnet';
export declare class Bridge {
    private network;
    private makerList;
    constructor(network: BridgeNetwork);
    /**
     * @param makerListItem
     * @returns
     */
    private expandMakerInfo;
    /**
     * @param accountAddress
     * @param signer
     * @param fromChain
     * @param toChain
     */
    private ensureStarkAccount;
    /**
     * @returns
     */
    getNetwork(): BridgeNetwork;
    /**
     * @returns
     */
    getMakerList(): Promise<{
        makerAddress: string;
        c1ID: number;
        c2ID: number;
        c1Name: string;
        c2Name: string;
        t1Address: string;
        t2Address: string;
        tName: string;
        c1MinPrice: number;
        c1MaxPrice: number;
        c2MinPrice: number;
        c2MaxPrice: number;
        precision: number;
        c1AvalibleDeposit: number;
        c2AvalibleDeposit: number;
        c1TradingFee: number;
        c2TradingFee: number;
        c1GasFee: number;
        c2GasFee: number;
        c1AvalibleTimes: {
            startTime: number;
            endTime: number;
        }[];
        c2AvalibleTimes: {
            startTime: number;
            endTime: number;
        }[];
    }[]>;
    /**
     * @param fromChain
     * @param toChain
     */
    supports(fromChain?: BridgeChain, toChain?: BridgeChain): Promise<{
        tokens: BridgeToken[];
        fromChains: BridgeChain[];
        toChains: BridgeChain[];
    }>;
    /**
     * @param token
     * @param fromChain
     * @param toChain
     * @returns
     */
    getTargetMakerInfo(token: BridgeToken, fromChain: BridgeChain, toChain: BridgeChain): Promise<{
        makerAddress: string;
        fromChainId: number;
        toChainId: number;
        fromChainName: string;
        toChainName: string;
        fromTokenAddress: string;
        toTokenAddress: string;
        tokenName: string;
        minPrice: number;
        maxPrice: number;
        precision: number;
        avalibleDeposit: number;
        tradingFee: number;
        gasFee: number;
        avalibleTimes: {
            startTime: number;
            endTime: number;
        }[] | {
            startTime: number;
            endTime: number;
        }[] | {
            startTime: number;
            endTime: number;
        }[];
    }>;
    /**
     * @param token
     * @param fromChain
     * @param toChain
     * @param amountHm Human readable amount
     */
    getAmounts(token: BridgeToken, fromChain: BridgeChain, toChain: BridgeChain, amountHm: string | number): Promise<{
        payText: string;
        payAmount: ethers.BigNumber;
        payAmountHm: string;
        receiveAmountHm: string;
    }>;
    /**
     * @param signer
     * @param token
     * @param fromChain
     * @param toChain
     * @param amountHm
     */
    transfer(signer: Signer, token: BridgeToken, fromChain: BridgeChain, toChain: BridgeChain, amountHm: string | number): Promise<ethers.providers.TransactionResponse | import("@loopring-web/loopring-sdk").RESULT_INFO | import("@loopring-web/loopring-sdk").TX_HASH_RESULT<import("@loopring-web/loopring-sdk").TX_HASH_API>>;
}
