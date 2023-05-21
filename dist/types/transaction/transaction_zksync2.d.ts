import * as zksync2 from 'zksync-web3';
import { TransactionResponse } from "zksync-web3/src/types";
import { Transaction, TransactionTransferOptions } from './transaction';
export declare class TransactionZksync2 extends Transaction {
    private zksync2wallet;
    constructor(chainId: number, zksync2wallet: zksync2.Wallet);
    /**
     * @param options
     */
    transfer(options: TransactionTransferOptions): Promise<TransactionResponse>;
}
