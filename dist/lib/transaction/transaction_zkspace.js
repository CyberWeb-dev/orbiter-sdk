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
exports.TranscationZKspace = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const zksync = __importStar(require("zksync"));
const transaction_1 = require("./transaction");
const config_1 = __importDefault(require("../config"));
const zkspace_helper_1 = require("../utils/zkspace/zkspace_helper");
class TranscationZKspace extends transaction_1.Transaction {
    constructor(chainId, signer) {
        super(chainId, signer);
        this.zkSpaceUrl = (0, zkspace_helper_1.GetZKSpaceUrl)(this.chainId);
    }
    getTokenInfo(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const allTokenInfo = yield (0, zkspace_helper_1.getAllZksTokenList)(this.chainId);
            for (let token of allTokenInfo.tokenList) {
                if (token.address === tokenAddress) {
                    return token;
                }
            }
            return undefined;
        });
    }
    /**
     * @param options
     */
    transfer(Options) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokenInfo = yield this.getTokenInfo(Options.tokenAddress);
            let feeTokenId = 0; // ETH
            let fromAddress = yield this.signer.getAddress();
            let zkAccountInfo = yield (0, zkspace_helper_1.getZKSAccountInfo)(this.chainId, fromAddress);
            let privateKey = yield (0, zkspace_helper_1.getPrivateKey)(this.signer);
            let fee = (yield (0, zkspace_helper_1.getZKSpaceTransferGasFee)(this.chainId, fromAddress));
            let transferFee = zksync.utils.closestPackableTransactionFee(ethers_1.utils.parseUnits(fee.toString(), 18));
            let zksChainId = Number(config_1.default.orbiterChainIdToNetworkId[this.chainId]);
            let l2SignatureTwo = yield (0, zkspace_helper_1.getL2SigTwoAndPK)(this.signer, zkAccountInfo, Options.toAddress, Options.amount, fee, Number(config_1.default.orbiterChainIdToNetworkId[this.chainId]), tokenInfo);
            let l2SignatureOne = (0, zkspace_helper_1.getL2SigOneAndPK)(privateKey, zkAccountInfo, fromAddress, Options.toAddress, tokenInfo.id, ethers_1.BigNumber.from(Options.amount), feeTokenId, transferFee, zksChainId);
            const transferReqData = {
                type: 'Transfer',
                accountId: zkAccountInfo.id,
                from: fromAddress,
                to: Options.toAddress,
                token: tokenInfo.id,
                amount: Options.amount.toString(),
                feeToken: tokenInfo.id,
                fee: transferFee.toString(),
                chainId: zksChainId,
                nonce: zkAccountInfo.nonce,
                // nonce: 10,
                signature: {
                    pubKey: l2SignatureOne.pubKey,
                    signature: l2SignatureOne.l2SignatureOne,
                }
            };
            const req = {
                signature: {
                    type: 'EthereumSignature',
                    signature: l2SignatureTwo,
                },
                fastProcessing: false,
                tx: transferReqData
            };
            const url = this.zkSpaceUrl + '/tx';
            let response = yield axios_1.default.post(url, {
                signature: req.signature,
                fastProcessing: req.fastProcessing,
                tx: req.tx,
            });
            return response;
        });
    }
}
exports.TranscationZKspace = TranscationZKspace;
//# sourceMappingURL=transaction_zkspace.js.map