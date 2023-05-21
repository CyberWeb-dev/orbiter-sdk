import { Signer } from 'ethers';
import { Transaction, TransactionTransferOptions } from './transaction';
export declare class TranscationZKspace extends Transaction {
    private zkSpaceUrl;
    constructor(chainId: number, signer: Signer);
    private getTokenInfo;
    /**
     * @param options
     */
    transfer(Options: TransactionTransferOptions): Promise<import("axios").AxiosResponse<any, any>>;
}
