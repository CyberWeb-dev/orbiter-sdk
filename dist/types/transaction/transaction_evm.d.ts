import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Transaction, TransactionTransferOptions } from './transaction';
export declare class TransactionEvm extends Transaction {
    /**
     * @param estimator
     * @param defaultGasLimit
     * @returns
     */
    private getTransferGasLimit;
    private getTransGasPrice;
    /**
     * @param options
     */
    private transferCrossAddress;
    /**
     *
     * @param options
     * @returns
     */
    transfer(options: TransactionTransferOptions): Promise<TransactionResponse>;
}
