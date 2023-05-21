import * as zksync from 'zksync';
import { Transaction, TransactionTransferOptions } from './transaction';
export declare class TransactionZksync extends Transaction {
    /**
     * @param options
     */
    transfer(options: TransactionTransferOptions): Promise<zksync.Transaction>;
}
