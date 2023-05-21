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
exports.toHex = exports.registerAccount = exports.getAccountInfo = exports.getL1SigAndPriVateKey = exports.getL2SigTwoAndPK = exports.getL2SigOneAndPK = exports.getExchangeRates = exports.cacheExchangeRates = exports.getZKSpaceTransferGasFee = exports.getZKSAccountInfo = exports.getAllZksTokenList = exports.getZKSTokenInfo = exports.ZksSignMessage = exports.GetZKSpaceUrl = exports.changePubKey = exports.getSignMessage = exports.getPublicKeyHash = exports.getPrivateKey = void 0;
const axios_1 = __importDefault(require("axios"));
const bignumber_js_1 = require("bignumber.js");
const zksync = __importStar(require("zksync"));
const zksync_crypto_1 = require("zksync-crypto");
const ethers_1 = require("ethers");
const chains_api_1 = __importDefault(require("../../config/chains_api"));
const index_1 = require("../index");
const validator_1 = require("../../utils/validator");
let exchangeRates;
function getPrivateKey(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const msg = 'Access ZKSwap account.\n\nOnly sign this message for a trusted client!';
            const signature = yield signer.signMessage(msg);
            const seed = ethers_1.ethers.utils.arrayify(signature);
            const privateKey = yield zksync.crypto.privateKeyFromSeed(seed);
            return privateKey;
        }
        catch (error) {
            throw new Error(`getL1SigAndPriVateKey error ${error.message}`);
        }
    });
}
exports.getPrivateKey = getPrivateKey;
function getPublicKeyHash(privateKey) {
    const pubKeyHash = `sync:${ethers_1.utils.hexlify((0, zksync_crypto_1.private_key_to_pubkey_hash)(privateKey)).substr(2)}`;
    return pubKeyHash;
}
exports.getPublicKeyHash = getPublicKeyHash;
function getSignMessage(privateKey, msgBytes) {
    // https://en.wiki.zks.org/interact-with-zkswap/make-transaction#signature
    const signaturePacked = (0, zksync_crypto_1.sign_musig)(privateKey, msgBytes);
    const pubKey = ethers_1.utils.hexlify(signaturePacked.slice(0, 32)).substr(2);
    const signature = ethers_1.utils.hexlify(signaturePacked.slice(32)).substr(2);
    return {
        pubKey,
        signature
    };
}
exports.getSignMessage = getSignMessage;
function changePubKey(localChainId, accountInfo, privateKey, walletAccount, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const pubKeyHash = ethers_1.ethers.utils.hexlify((0, zksync_crypto_1.private_key_to_pubkey_hash)(privateKey)).substr(2);
        // const hexlifiedAccountId = ethers.utils.hexlify(accountInfo.id)
        // const hexlifiedNonce = ethers.utils.hexlify(accountInfo.nonce)
        const hexlifiedAccountId = toHex(accountInfo.id, 4);
        const hexlifiedNonce = toHex(accountInfo.nonce, 4);
        let resgiterMsg = `Register ZKSwap pubkey:

${pubKeyHash}
nonce: ${hexlifiedNonce}
account id: ${hexlifiedAccountId}

Only sign this message for a trusted client!`;
        const registerSignature = yield signer.signMessage(resgiterMsg);
        const url = GetZKSpaceUrl(localChainId) + '/tx';
        let transferResult = yield axios_1.default.post(url, {
            signature: null,
            fastProcessing: null,
            extraParams: null,
            tx: {
                account: walletAccount,
                accountId: accountInfo.id,
                ethSignature: registerSignature,
                newPkHash: `sync:` + pubKeyHash,
                nonce: 0,
                type: 'ChangePubKey',
            },
        }, {
            headers: {
                'zk-account': walletAccount,
            },
        });
        return transferResult;
    });
}
exports.changePubKey = changePubKey;
function GetZKSpaceUrl(localChainId) {
    if (validator_1.ChainValidator.zkspace(localChainId) == validator_1.ChainValidatorTypes.Testnet) {
        return chains_api_1.default.zkspace.Testnet;
    }
    else if (validator_1.ChainValidator.zkspace(localChainId) == validator_1.ChainValidatorTypes.Mainnet) {
        return chains_api_1.default.zkspace.Mainnet;
    }
    else {
        throw new Error(`${localChainId} not support yet`);
    }
}
exports.GetZKSpaceUrl = GetZKSpaceUrl;
function ZksSignMessage(privateKey, msgBytes) {
    const signaturePacked = (0, zksync_crypto_1.sign_musig)(privateKey, msgBytes);
    const pubKey = ethers_1.utils.hexlify(signaturePacked.slice(0, 32)).substr(2);
    const signature = ethers_1.utils.hexlify(signaturePacked.slice(32)).substr(2);
    return {
        pubKey,
        signature
    };
}
exports.ZksSignMessage = ZksSignMessage;
function getZKSTokenInfo(localChainID, tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const allTokenInfo = yield getAllZksTokenList(localChainID);
        for (let token of allTokenInfo.tokenList) {
            if (token.address === tokenAddress) {
                return token;
            }
        }
        throw new Error(`cant get ${tokenAddress} token info`);
    });
}
exports.getZKSTokenInfo = getZKSTokenInfo;
function getAllZksTokenList(localChainID) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let isContiue = true;
            let startID = 0;
            let zksTokenAllList = [];
            try {
                while (isContiue) {
                    var zksTokenListReq = {
                        from: startID,
                        limit: 100,
                        direction: 'newer',
                        localChainID: localChainID,
                    };
                    let zksList = yield getZKSTokenList(zksTokenListReq);
                    if (zksList.length !== 100) {
                        isContiue = false;
                    }
                    else {
                        startID = zksList[99].id + 1;
                    }
                    zksTokenAllList = zksTokenAllList.concat(zksList);
                }
                let zksTokenResult = {
                    chainID: localChainID,
                    tokenList: zksTokenAllList,
                };
                resolve(zksTokenResult);
            }
            catch (error) {
                console.log('zk_TokenListGetError =', error);
                reject(error);
            }
        }));
    });
}
exports.getAllZksTokenList = getAllZksTokenList;
function getZKSTokenList(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${req.localChainID === 512 ? chains_api_1.default.zkspace.Testnet : chains_api_1.default.zkspace.Mainnet}/tokens?from=${req.from}&limit=${req.limit}&direction=${req.direction}`;
        try {
            const response = yield axios_1.default.get(url);
            if (response.status === 200) {
                var respData = response.data;
                if (respData.success) {
                    return respData.data;
                }
                else {
                    throw new Error(`respData.status not success`);
                }
            }
            else {
                throw new Error(`getZKSTokenList NetWorkError`);
            }
        }
        catch (error) {
            console.error('getZKSTokenList error =', error);
            throw new Error(`getZKSTokenList error = ${error.message}`);
        }
    });
}
function getZKSAccountInfo(localChainID, walletAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            if (localChainID !== 12 && localChainID !== 512) {
                reject({
                    errorCode: 1,
                    errMsg: 'getZKSpaceAccountInfoError_wrongChainID',
                });
            }
            const url = GetZKSpaceUrl(localChainID) + '/account/' + walletAccount + '/' + 'info';
            axios_1.default.get(url).then(function (response) {
                if (response.status === 200 && response.statusText == 'OK') {
                    var respData = response.data;
                    if (respData.success == true) {
                        resolve(respData.data);
                    }
                    else {
                        reject(respData.data);
                    }
                }
                else {
                    reject({
                        errorCode: 1,
                        errMsg: 'NetWorkError',
                    });
                }
            })
                .catch(function (error) {
                reject({
                    errorCode: 2,
                    errMsg: error,
                });
            });
        });
    });
}
exports.getZKSAccountInfo = getZKSAccountInfo;
function getZKSpaceTransferGasFee(localChainID, walletAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        //get usd to eth rat
        const usdRates = yield getExchangeRates();
        let ethPrice = usdRates && usdRates['ETH'] ? 1 / usdRates['ETH'] : 2000;
        //get gasfee width eth
        const url = `${GetZKSpaceUrl(localChainID)}/account/${walletAccount}/fee`;
        const response = yield axios_1.default.get(url);
        if (response.status === 200 && response.statusText == 'OK') {
            var respData = response.data;
            if (respData.success == true) {
                const gasFee = new bignumber_js_1.BigNumber(respData.data.transfer).dividedBy(new bignumber_js_1.BigNumber(ethPrice));
                let gasFee_fix = gasFee.decimalPlaces(6, bignumber_js_1.BigNumber.ROUND_UP);
                return Number(gasFee_fix);
            }
            else {
                throw new Error(respData.data);
            }
        }
        else {
            throw new Error('getZKSTransferGasFee NetWorkError');
        }
    });
}
exports.getZKSpaceTransferGasFee = getZKSpaceTransferGasFee;
function cacheExchangeRates(currency = 'USD') {
    return __awaiter(this, void 0, void 0, function* () {
        // cache
        let exchangeRates = yield getRates(currency);
        if (exchangeRates) {
            let metisExchangeRates = yield getRates('metis');
            if (metisExchangeRates && metisExchangeRates["USD"]) {
                let usdToMetis = 1 / Number(metisExchangeRates["USD"]);
                exchangeRates["METIS"] = String(usdToMetis);
            }
            return exchangeRates;
        }
        else {
            return undefined;
        }
    });
}
exports.cacheExchangeRates = cacheExchangeRates;
function getRates(currency) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield axios_1.default.get(`https://api.coinbase.com/v2/exchange-rates?currency=${currency}`);
        const data = (_a = resp.data) === null || _a === void 0 ? void 0 : _a.data;
        // check
        if (!data || !(0, index_1.equalsIgnoreCase)(data.currency, currency) || !data.rates) {
            return undefined;
        }
        return data.rates;
    });
}
function getExchangeRates(currency = 'USD') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!exchangeRates) {
                exchangeRates = yield cacheExchangeRates(currency);
            }
        }
        catch (error) {
            console.log("err", error);
        }
        return exchangeRates;
    });
}
exports.getExchangeRates = getExchangeRates;
function getL2SigOneAndPK(privateKey, accountInfo, fromAddress, toAddress, tokenId, transferValue, feeTokenId, transferFee, zksChainID) {
    const msgBytes = ethers_1.ethers.utils.concat([
        '0x05',
        zksync.utils.numberToBytesBE(accountInfo.id, 4),
        fromAddress,
        toAddress,
        zksync.utils.numberToBytesBE(tokenId, 2),
        zksync.utils.packAmountChecked(transferValue),
        zksync.utils.numberToBytesBE(feeTokenId, 1),
        zksync.utils.packFeeChecked(transferFee),
        zksync.utils.numberToBytesBE(zksChainID, 1),
        zksync.utils.numberToBytesBE(accountInfo.nonce, 4),
    ]);
    const signaturePacked = (0, zksync_crypto_1.sign_musig)(privateKey, msgBytes);
    const pubKey = ethers_1.ethers.utils.hexlify(signaturePacked.slice(0, 32)).substr(2);
    const l2SignatureOne = ethers_1.ethers.utils
        .hexlify(signaturePacked.slice(32))
        .substr(2);
    return { pubKey, l2SignatureOne };
}
exports.getL2SigOneAndPK = getL2SigOneAndPK;
function getL2SigTwoAndPK(signer, accountInfo, toAddress, transferValue, fee, zksChainID, tokenInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const l2MsgParams = {
                accountId: accountInfo.id,
                to: toAddress,
                tokenSymbol: tokenInfo ? tokenInfo.symbol : 'ETH',
                tokenAmount: ethers_1.ethers.utils.formatUnits(transferValue, tokenInfo.decimals),
                feeSymbol: 'ETH',
                fee: fee.toString(),
                zksChainID,
                nonce: accountInfo.nonce,
            };
            const l2Msg = `Transfer ${l2MsgParams.tokenAmount} ${l2MsgParams.tokenSymbol}\n` +
                `To: ${l2MsgParams.to.toLowerCase()}\n` +
                `Chain Id: ${l2MsgParams.zksChainID}\n` +
                `Nonce: ${l2MsgParams.nonce}\n` +
                `Fee: ${l2MsgParams.fee} ${l2MsgParams.feeSymbol}\n` +
                // `Fee: 0.0 ${l2MsgParams.feeSymbol}\n` +
                `Account Id: ${l2MsgParams.accountId}`;
            const l2SignatureTwo = yield signer.signMessage(l2Msg);
            return l2SignatureTwo;
        }
        catch (error) {
            throw new Error(`getL2SigTwoAndPK error ${error.message}`);
        }
    });
}
exports.getL2SigTwoAndPK = getL2SigTwoAndPK;
function getL1SigAndPriVateKey(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const msg = 'Access ZKSwap account.\n\nOnly sign this message for a trusted client!';
            const signature = yield signer.signMessage(msg);
            const seed = ethers_1.ethers.utils.arrayify(signature);
            const privateKey = yield zksync.crypto.privateKeyFromSeed(seed);
            return privateKey;
        }
        catch (error) {
            throw new Error(`getL1SigAndPriVateKey error ${error.message}`);
        }
    });
}
exports.getL1SigAndPriVateKey = getL1SigAndPriVateKey;
function getAccountInfo(chainId, privateKey, signer, walletAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // i am confused by how to declare the type of field "accountInfo"
            const accountInfo = yield getZKSAccountInfo(chainId, walletAccount);
            if (accountInfo.pub_key_hash ==
                'sync:0000000000000000000000000000000000000000') {
                const new_pub_key_hash = yield registerAccount(accountInfo, privateKey, chainId, signer, walletAccount);
                accountInfo.pub_key_hash = new_pub_key_hash;
                accountInfo.nonce = accountInfo.nonce + 1;
            }
            return accountInfo;
        }
        catch (error) {
            throw new Error(`getAccountInfo error ${error.message}`);
        }
    });
}
exports.getAccountInfo = getAccountInfo;
function registerAccount(accountInfo, privateKey, fromChainID, signer, walletAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pubKeyHash = ethers_1.ethers.utils
                .hexlify((0, zksync_crypto_1.private_key_to_pubkey_hash)(privateKey))
                .substr(2);
            const hexlifiedAccountId = toHex(accountInfo.id, 4);
            const hexlifiedNonce = toHex(accountInfo.nonce, 4);
            let resgiterMsg = `Register ZKSwap pubkey: ${pubKeyHash} nonce: ${hexlifiedNonce} account id: ${hexlifiedAccountId} Only sign this message for a trusted client!`;
            const registerSignature = yield signer.signMessage(resgiterMsg);
            const url = `${fromChainID == 512 ? "https://api.zks.app/v3/4" : "https://api.zks.app/v3/1"}/tx`;
            let transferResult = yield axios_1.default.post(url, {
                signature: null,
                fastProcessing: null,
                extraParams: null,
                tx: {
                    account: walletAccount,
                    accountId: accountInfo.id,
                    ethSignature: registerSignature,
                    newPkHash: `sync:` + pubKeyHash,
                    nonce: 0,
                    type: 'ChangePubKey',
                },
            }, {
                headers: {
                    'zk-account': walletAccount,
                },
            });
            if (transferResult.status == 200 && transferResult.data.success) {
                return transferResult.data;
            }
            else {
                throw new Error('registerAccount fail');
            }
        }
        catch (error) {
            throw new Error(`registerAccount error ${error.message}`);
        }
    });
}
exports.registerAccount = registerAccount;
function toHex(num, length) {
    var charArray = ['a', 'b', 'c', 'd', 'e', 'f'];
    let strArr = Array(length * 2).fill('0');
    var i = length * 2 - 1;
    while (num > 15) {
        var yushu = num % 16;
        if (yushu >= 10) {
            let index = yushu % 10;
            strArr[i--] = charArray[index];
        }
        else {
            strArr[i--] = yushu.toString();
        }
        num = Math.floor(num / 16);
    }
    if (num != 0) {
        if (num >= 10) {
            let index = num % 10;
            strArr[i--] = charArray[index];
        }
        else {
            strArr[i--] = num.toString();
        }
    }
    strArr.unshift('0x');
    var hex = strArr.join('');
    return hex;
}
exports.toHex = toHex;
//# sourceMappingURL=zkspace_helper.js.map