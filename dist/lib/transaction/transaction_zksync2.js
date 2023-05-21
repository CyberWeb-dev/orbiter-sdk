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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionZksync2 = void 0;
const zksync2 = __importStar(require("zksync-web3"));
const transaction_1 = require("./transaction");
const validator_1 = require("../utils/validator");
const chains_api_1 = __importDefault(require("../config/chains_api"));
class TransactionZksync2 extends transaction_1.Transaction {
    constructor(chainId, zksync2wallet) {
        const signer = zksync2wallet.provider.getSigner();
        super(chainId, signer);
        this.zksync2wallet = zksync2wallet;
    }
    /**
     * @param options
     */
    transfer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let zksync2Provider;
            if (validator_1.ChainValidator.zksync2(this.chainId) == validator_1.ChainValidatorTypes.Testnet) {
                zksync2Provider = new zksync2.Provider(chains_api_1.default.zkSync2.Testnet);
            }
            else {
                throw new Error(`not support yet`);
            }
            const tokenAddress = options.tokenAddress;
            // if (!await zksync2Provider.isTokenLiquid(tokenAddress)) {
            //   throw new Error("the token can not be used for fee")
            // }
            return yield this.zksync2wallet.transfer({
                to: options.toAddress,
                token: tokenAddress,
                amount: options.amount.toString(),
                overrides: { customData: { feeToken: tokenAddress } },
            });
        });
    }
}
exports.TransactionZksync2 = TransactionZksync2;
//# sourceMappingURL=transaction_zksync2.js.map