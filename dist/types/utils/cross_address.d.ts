import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber, ethers, Signer } from 'ethers';
export type CrossAddressExt = {
    type: string;
    value: string;
};
export declare const CrossAddressExtTypes: {
    '0x01': string;
    '0x02': string;
};
export declare class CrossAddress {
    private contractAddress;
    private provider;
    private signer;
    private networkId;
    private providerNetworkId;
    /**
     * @param signer
     * @param orbiterChainId
     */
    constructor(signer: Signer, orbiterChainId?: number);
    checkNetworkId(): Promise<boolean>;
    /**
     *
     * @param tokenAddress 0x...
     * @param amount
     */
    approveERC20(tokenAddress: string, amount?: BigNumber): Promise<void>;
    /**
     * @param to
     * @param amount
     * @param ext
     * @return
     */
    transfer(to: string, amount: ethers.BigNumberish, ext?: CrossAddressExt | undefined): Promise<TransactionResponse>;
    /**
     *
     * @param tokenAddress 0x...
     * @param to
     * @param amount
     * @param ext
     * @return
     */
    transferERC20(tokenAddress: string, to: string, amount: ethers.BigNumberish, ext?: CrossAddressExt | undefined): Promise<TransactionResponse>;
    /**
     *
     * @param ext
     * @returns hex
     */
    static encodeExt(ext: CrossAddressExt | undefined): string;
    /**
     *
     * @param hex
     * @returns
     */
    static decodeExt(hex: string): CrossAddressExt | undefined;
    /**
     * @param input 0x...
     */
    static parseTransferInput(input: string): {
        to: string;
        ext: CrossAddressExt | undefined;
    };
    /**
     * @param input 0x...
     */
    static parseTransferERC20Input(input: string): {
        token: string;
        to: string;
        amount: ethers.BigNumber;
        ext: CrossAddressExt | undefined;
    };
}
