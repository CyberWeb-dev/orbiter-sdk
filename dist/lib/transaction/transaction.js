"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(chainId, signer) {
        this.chainId = chainId;
        this.signer = signer;
        this.provider = signer && signer.provider;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map