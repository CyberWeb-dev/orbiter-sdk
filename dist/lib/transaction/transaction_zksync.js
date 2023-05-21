"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionZksync = void 0;
const zksync = __importStar(require("zksync"));
const transaction_1 = require("./transaction");
const validator_1 = require("../utils/validator");
class TransactionZksync extends transaction_1.Transaction {
    /**
     * @param options
     */
    transfer(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const zksyncProvider = validator_1.ChainValidator.zksync(this.chainId) == validator_1.ChainValidatorTypes.Mainnet
                ? yield zksync.getDefaultProvider('mainnet')
                : yield zksync.getDefaultProvider('rinkeby');
            const zksyncWallet = yield zksync.Wallet.fromEthSigner(this.signer, zksyncProvider);
            if (!zksyncWallet.signer) {
                throw new Error('Obiter initialization zksync.Wallet.signer failed.');
            }
            const amount = zksync.utils.closestPackableTransactionAmount(options.amount);
            const transferFee = yield zksyncProvider.getTransactionFee('Transfer', zksyncWallet.address() || '', options.tokenAddress);
            let transaction;
            if (!(yield zksyncWallet.isSigningKeySet())) {
                const nonce = yield zksyncWallet.getNonce('committed');
                const batchBuilder = zksyncWallet.batchBuilder(nonce);
                if (((_a = zksyncWallet.ethSignerType) === null || _a === void 0 ? void 0 : _a.verificationMethod) === 'ERC-1271') {
                    const isOnchainAuthSigningKeySet = yield zksyncWallet.isOnchainAuthSigningKeySet();
                    if (!isOnchainAuthSigningKeySet) {
                        const onchainAuthTransaction = yield zksyncWallet.onchainAuthSigningKey();
                        yield (onchainAuthTransaction === null || onchainAuthTransaction === void 0 ? void 0 : onchainAuthTransaction.wait());
                    }
                }
                const newPubKeyHash = yield zksyncWallet.signer.pubKeyHash();
                const accountID = yield zksyncWallet.getAccountId();
                if (typeof accountID !== 'number') {
                    throw new TypeError('It is required to have a history of balances on the account to activate it.');
                }
                const changePubKeyMessage = zksync.utils.getChangePubkeyLegacyMessage(newPubKeyHash, nonce, accountID);
                const ethSignature = (yield zksyncWallet.ethMessageSigner().getEthMessageSignature(changePubKeyMessage)).signature;
                const keyFee = yield zksyncProvider.getTransactionFee({
                    ChangePubKey: { onchainPubkeyAuth: false },
                }, zksyncWallet.address() || '', options.tokenAddress);
                const changePubKeyTx = yield zksyncWallet.signer.signSyncChangePubKey({
                    accountId: accountID,
                    account: zksyncWallet.address(),
                    newPkHash: newPubKeyHash,
                    nonce: nonce,
                    ethSignature: ethSignature,
                    validFrom: 0,
                    validUntil: zksync.utils.MAX_TIMESTAMP,
                    fee: keyFee.totalFee,
                    feeTokenId: zksyncWallet.provider.tokenSet.resolveTokenId(options.tokenAddress),
                });
                batchBuilder.addChangePubKey({
                    tx: changePubKeyTx,
                    // @ts-ignore
                    alreadySigned: true,
                });
                batchBuilder.addTransfer({
                    to: options.toAddress,
                    token: options.tokenAddress,
                    amount: amount,
                    fee: transferFee.totalFee,
                });
                const batchTransactionData = yield batchBuilder.build();
                const transactions = yield zksync.submitSignedTransactionsBatch(zksyncWallet.provider, batchTransactionData.txs, batchTransactionData.signature ? [batchTransactionData.signature] : undefined);
                for (const tx of transactions) {
                    if (tx.txData.tx.type !== 'ChangePubKey') {
                        transaction = tx;
                        break;
                    }
                }
            }
            else {
                transaction = yield zksyncWallet.syncTransfer({
                    to: options.toAddress,
                    token: options.tokenAddress,
                    amount: amount,
                });
            }
            return transaction;
        });
    }
}
exports.TransactionZksync = TransactionZksync;
//# sourceMappingURL=transaction_zksync.js.map