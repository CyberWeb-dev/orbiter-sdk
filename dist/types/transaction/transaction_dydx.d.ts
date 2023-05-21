import Web3 from 'web3';
import { Transaction, TransactionTransferOptions } from './transaction';
export declare class TransactionDydx extends Transaction {
    private web3;
    constructor(chainId: number, web3: Web3);
    /**
     * @param options
     */
    transfer(options: TransactionTransferOptions): Promise<{
        transfer: import("@dydxprotocol/v3-client").TransferResponseObject;
    }>;
}
