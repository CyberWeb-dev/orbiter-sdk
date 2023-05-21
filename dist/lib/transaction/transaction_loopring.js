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
exports.TransactionLoopring = void 0;
const providers_1 = require("@ethersproject/providers");
const loopring_sdk_1 = require("@loopring-web/loopring-sdk");
const validator_1 = require("../utils/validator");
const transaction_1 = require("./transaction");
class TransactionLoopring extends transaction_1.Transaction {
    constructor(chainId, web3) {
        const signer = new providers_1.Web3Provider(web3.currentProvider).getSigner();
        super(chainId, signer);
        this.web3 = web3;
    }
    /**
     * @param fromAddress
     */
    checkLoopringAccountKey(fromAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkId = validator_1.ChainValidator.loopring(this.chainId) == validator_1.ChainValidatorTypes.Mainnet ? 1 : 5;
            const exchangeApi = new loopring_sdk_1.ExchangeAPI({ chainId: networkId });
            const userApi = new loopring_sdk_1.UserAPI({ chainId: networkId });
            if (!TransactionLoopring.accounts[fromAddress]) {
                TransactionLoopring.accounts[fromAddress] = {};
            }
            const account = TransactionLoopring.accounts[fromAddress];
            // Init accountInfo
            if (!account.accountInfo) {
                let accountResult = yield exchangeApi.getAccount({ owner: fromAddress });
                if (!accountResult.accInfo || !accountResult.raw_data) {
                    throw Error('Loopring account unlocked!');
                }
                account.accountInfo = accountResult.accInfo;
            }
            if (!account.apiKey) {
                const { exchangeInfo } = yield exchangeApi.getExchangeInfo();
                const { accountInfo } = account;
                const options = {
                    web3: this.web3,
                    address: fromAddress,
                    keySeed: accountInfo.keySeed && accountInfo.keySeed !== ''
                        ? accountInfo.keySeed
                        : loopring_sdk_1.GlobalAPI.KEY_MESSAGE.replace('${exchangeAddress}', exchangeInfo.exchangeAddress).replace('${nonce}', (accountInfo.nonce - 1).toString()),
                    walletType: loopring_sdk_1.ConnectorNames.WalletLink,
                    chainId: validator_1.ChainValidator.loopring(this.chainId) == validator_1.ChainValidatorTypes.Mainnet
                        ? loopring_sdk_1.ChainId.MAINNET
                        : loopring_sdk_1.ChainId.GOERLI,
                };
                const eddsaKey = yield (0, loopring_sdk_1.generateKeyPair)(options);
                const { apiKey } = yield userApi.getUserApiKey({
                    accountId: account.accountInfo.accountId,
                }, eddsaKey.sk);
                if (!apiKey) {
                    throw Error('Get Loopring ApiKey Error');
                }
                account.apiKey = apiKey;
                account.eddsaKey = eddsaKey;
            }
        });
    }
    /**
     * @param options
     */
    transfer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const networkId = validator_1.ChainValidator.loopring(this.chainId) == validator_1.ChainValidatorTypes.Mainnet ? 1 : 5;
            const exchangeApi = new loopring_sdk_1.ExchangeAPI({ chainId: networkId });
            const userApi = new loopring_sdk_1.UserAPI({ chainId: networkId });
            const { exchangeInfo } = yield exchangeApi.getExchangeInfo();
            // Check & get loopring's account
            yield this.checkLoopringAccountKey(options.fromAddress);
            const { accountInfo, apiKey, eddsaKey } = TransactionLoopring.accounts[options.fromAddress];
            // Get storageId
            const GetNextStorageIdRequest = {
                accountId: accountInfo.accountId,
                sellTokenId: 0, // Now only eth
            };
            const storageId = yield userApi.getNextStorageId(GetNextStorageIdRequest, apiKey);
            // Transfer
            const OriginTransferRequestV3 = {
                exchange: exchangeInfo.exchangeAddress,
                payerAddr: options.fromAddress,
                payerId: accountInfo.accountId,
                payeeAddr: options.toAddress,
                payeeId: 0,
                storageId: storageId.offchainId,
                token: {
                    tokenId: 0,
                    volume: options.amount + '',
                },
                maxFee: {
                    tokenId: 0,
                    volume: '940000000000000',
                },
                validUntil: loopring_sdk_1.VALID_UNTIL,
                memo: options.memo,
            };
            return yield userApi.submitInternalTransfer({
                request: OriginTransferRequestV3,
                web3: this.web3,
                chainId: validator_1.ChainValidator.loopring(this.chainId) == validator_1.ChainValidatorTypes.Mainnet
                    ? loopring_sdk_1.ChainId.MAINNET
                    : loopring_sdk_1.ChainId.GOERLI,
                walletType: loopring_sdk_1.ConnectorNames.WalletLink,
                eddsaKey: eddsaKey.sk,
                apiKey: apiKey,
                isHWAddr: false,
            });
        });
    }
}
exports.TransactionLoopring = TransactionLoopring;
TransactionLoopring.accounts = {};
//# sourceMappingURL=transaction_loopring.js.map