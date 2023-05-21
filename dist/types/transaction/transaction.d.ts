import { Provider } from '@ethersproject/abstract-provider';
import ethers, { BigNumberish, Signer } from 'ethers';
import { CrossAddressExt } from '../utils/cross_address';
export type TransactionTransferOptions = {
    amount: ethers.BigNumberish;
    tokenAddress: string;
    toAddress: string;
    defaultGasLimit?: BigNumberish;
    fromAddress?: string;
    decimals?: number;
    symbol?: string;
    memo?: string;
    receiverPublicKey?: string;
    receiverPositionId?: string;
    clientIdAddress?: string;
    nonce?: number;
    maxFee?: BigNumberish;
    crossAddressExt?: CrossAddressExt;
};
export declare abstract class Transaction {
    protected chainId: number;
    protected signer: Signer;
    protected provider?: Provider;
    constructor(chainId: number, signer: Signer);
    /**
     * @param options
     */
    abstract transfer(options: TransactionTransferOptions): Promise<any>;
}
