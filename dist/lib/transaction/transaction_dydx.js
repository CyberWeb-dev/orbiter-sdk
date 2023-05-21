"use strict";
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
exports.TransactionDydx = void 0;
const v3_client_1 = require("@dydxprotocol/v3-client");
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const dydx_helper_1 = require("../utils/dydx/dydx_helper");
const transaction_1 = require("./transaction");
class TransactionDydx extends transaction_1.Transaction {
    constructor(chainId, web3) {
        const signer = new providers_1.Web3Provider(web3.currentProvider).getSigner();
        super(chainId, signer);
        this.web3 = web3;
    }
    /**
     * @param options
     */
    transfer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const dydxHelper = new dydx_helper_1.DydxHelper(this.chainId, this.web3, v3_client_1.SigningMethod.MetaMask);
            const dydxClient = yield dydxHelper.getDydxClient(options.fromAddress, false, true);
            const dydxAccount = yield dydxHelper.getAccount(options.fromAddress);
            // Default: clientIdAddress is options.toAddress
            if (!options.clientIdAddress) {
                options.clientIdAddress = options.toAddress;
            }
            const params = {
                clientId: dydxHelper.generateClientId(options.clientIdAddress),
                amount: ethers_1.ethers.BigNumber.from(options.amount).toNumber() / Math.pow(10, 6) + '',
                expiration: new Date(new Date().getTime() + 86400000 * 30).toISOString(),
                receiverAccountId: dydxHelper.getAccountId(options.toAddress),
                receiverPublicKey: options.receiverPublicKey,
                receiverPositionId: options.receiverPositionId,
            };
            return yield dydxClient.private.createTransfer(params, dydxAccount.positionId);
        });
    }
}
exports.TransactionDydx = TransactionDydx;
//# sourceMappingURL=transaction_dydx.js.map