import Web3 from 'web3';
import { Transaction, TransactionTransferOptions } from './transaction';
export declare class TransactionLoopring extends Transaction {
    private static accounts;
    private web3;
    constructor(chainId: number, web3: Web3);
    /**
     * @param fromAddress
     */
    private checkLoopringAccountKey;
    /**
     * @param options
     */
    transfer(options: TransactionTransferOptions): Promise<import("@loopring-web/loopring-sdk").RESULT_INFO | import("@loopring-web/loopring-sdk").TX_HASH_RESULT<import("@loopring-web/loopring-sdk").TX_HASH_API>>;
}
