import { ethers, Signer, BigNumber as EtherBigNumber } from 'ethers';
export type ZKspaceAccountInfo = {
    id: number;
    nonce: number;
    pub_key_hash: string;
    seq_id: number;
};
export type ZKspaceTokenInfo = {
    id: number;
    address: string;
    decimals: number;
    symbol: string;
    icon: string;
    approved: boolean;
};
export type ZKspaceAllTokenInfo = {
    chainID: string;
    tokenList: Array<ZKspaceTokenInfo>;
};
export type ZKspaceTransferData = {
    type: string;
    accountId: number;
    from: string;
    to: string;
    token: number;
    amount: string;
    feeToken: number;
    fee: string;
    chainId: number;
    nonce: number;
    signature: {
        pubKey: string;
        signature: string;
    };
};
export declare function getPrivateKey(signer: Signer): Promise<Uint8Array>;
export declare function getPublicKeyHash(privateKey: Uint8Array): string;
export declare function getSignMessage(privateKey: Uint8Array, msgBytes: Uint8Array): {
    pubKey: string;
    signature: string;
};
export declare function changePubKey(localChainId: number, accountInfo: ZKspaceAccountInfo, privateKey: Uint8Array, walletAccount: string, signer: ethers.Signer): Promise<import("axios").AxiosResponse<any, any>>;
export declare function GetZKSpaceUrl(localChainId: number): string;
export declare function ZksSignMessage(privateKey: Uint8Array, msgBytes: Uint8Array): {
    pubKey: string;
    signature: string;
};
export declare function getZKSTokenInfo(localChainID: number, tokenAddress: string): Promise<ZKspaceTokenInfo>;
export declare function getAllZksTokenList(localChainID: any): Promise<ZKspaceAllTokenInfo>;
export declare function getZKSAccountInfo(localChainID: number, walletAccount: string): Promise<ZKspaceAccountInfo>;
export declare function getZKSpaceTransferGasFee(localChainID: number, walletAccount: string): Promise<number>;
export declare function cacheExchangeRates(currency?: string): Promise<any>;
export declare function getExchangeRates(currency?: string): Promise<{
    [key: string]: string;
}>;
export declare function getL2SigOneAndPK(privateKey: Uint8Array, accountInfo: ZKspaceAccountInfo, fromAddress: string, toAddress: string, tokenId: number, transferValue: EtherBigNumber, feeTokenId: number, transferFee: EtherBigNumber, zksChainID: number): {
    pubKey: string;
    l2SignatureOne: string;
};
export declare function getL2SigTwoAndPK(signer: Signer, accountInfo: ZKspaceAccountInfo, toAddress: string, transferValue: ethers.BigNumberish, fee: number, zksChainID: number, tokenInfo: ZKspaceTokenInfo): Promise<string>;
export declare function getL1SigAndPriVateKey(signer: ethers.Wallet): Promise<Uint8Array>;
export declare function getAccountInfo(chainId: number, privateKey: Uint8Array, signer: ethers.providers.JsonRpcSigner, walletAccount: string): Promise<ZKspaceAccountInfo>;
export declare function registerAccount(accountInfo: ZKspaceAccountInfo, privateKey: Uint8Array, fromChainID: number, signer: Signer, walletAccount: string): Promise<any>;
export declare function toHex(num: number, length: number): string;
