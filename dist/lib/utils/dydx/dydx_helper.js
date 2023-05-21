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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DydxHelper = void 0;
const v3_client_1 = require("@dydxprotocol/v3-client");
const db_1 = require("@dydxprotocol/v3-client/build/src/lib/db");
const ethers_1 = require("ethers");
const __1 = require("..");
const chains_api_1 = __importDefault(require("../../config/chains_api"));
const DYDX_MAKERS = {
    // Testnet
    '0x694434EC84b7A8Ad8eFc57327ddD0A428e23f8D5': {
        starkKey: '04e69175389829db733f41ae75e7ba59ea2b2849690c734fcd291c94d6ec6017',
        positionId: '60620',
    },
    // Mainnet
    '0x41d3D33156aE7c62c094AAe2995003aE63f587B3': {
        starkKey: '',
        positionId: '',
    },
};
const DYDX_CLIENTS = {};
const DYDX_ACCOUNTS = {};
const DYDX_API_KEY_CREDENTIALS = {};
class DydxHelper {
    /**
     * @param chainId
     * @param web3
     * @param signingMethod TypedData | MetaMask
     */
    constructor(chainId, web3, signingMethod = v3_client_1.SigningMethod.TypedData) {
        this.web3 = undefined;
        if (chainId == 11) {
            this.networkId = 1;
            this.host = chains_api_1.default.dydx.Mainnet;
        }
        if (chainId == 511) {
            this.networkId = 3;
            this.host = chains_api_1.default.dydx.Testnet;
        }
        this.chainId = chainId;
        this.web3 = web3;
        this.signingMethod = signingMethod;
    }
    /**
     * @param ethereumAddress
     * @param alwaysNew
     * @param alwaysDeriveStarkKey
     * @returns
     */
    getDydxClient(ethereumAddress = '', alwaysNew = false, alwaysDeriveStarkKey = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const dydxClientKey = String(ethereumAddress);
            const clientOld = DYDX_CLIENTS[dydxClientKey];
            if (clientOld && !alwaysNew) {
                if (alwaysDeriveStarkKey && ethereumAddress) {
                    // Reset DyDxClient.private, It will new when use
                    clientOld._private = null;
                    clientOld.starkPrivateKey = yield clientOld.onboarding.deriveStarkKey(ethereumAddress, this.signingMethod);
                }
                return clientOld;
            }
            if (!this.host) {
                throw new Error('Sorry, miss param [host]');
            }
            const client = new v3_client_1.DydxClient(this.host, {
                networkId: this.networkId,
                web3: this.web3,
            });
            if (ethereumAddress && this.web3) {
                // Ensure network
                if (this.web3.givenProvider.isMetaMask === true) {
                    yield (0, __1.ensureMetamaskNetwork)(this.chainId, this.web3.givenProvider);
                }
                const userExists = yield client.public.doesUserExistWithAddress(ethereumAddress);
                if (userExists.exists) {
                    if (alwaysDeriveStarkKey) {
                        client.starkPrivateKey = yield client.onboarding.deriveStarkKey(ethereumAddress, this.signingMethod);
                    }
                    const apiCredentials = yield client.onboarding.recoverDefaultApiCredentials(ethereumAddress, this.signingMethod);
                    client.apiKeyCredentials = apiCredentials;
                }
                else {
                    const keyPair = yield client.onboarding.deriveStarkKey(ethereumAddress, this.signingMethod);
                    client.starkPrivateKey = keyPair;
                    const user = yield client.onboarding.createUser({
                        starkKey: keyPair.publicKey,
                        starkKeyYCoordinate: keyPair.publicKeyYCoordinate,
                    }, ethereumAddress, undefined, this.signingMethod);
                    client.apiKeyCredentials = user.apiKey;
                }
            }
            return (DYDX_CLIENTS[dydxClientKey] = client);
        });
    }
    /**
     * @param ethereumAddress
     * @param ensureUser
     * @returns
     */
    getBalanceUsdc(ethereumAddress, ensureUser = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ethereumAddress) {
                throw new Error('Sorry, miss param [user]');
            }
            let balance = ethers_1.ethers.BigNumber.from(0);
            try {
                let dydxClient = DYDX_CLIENTS[ethereumAddress];
                if (ensureUser && !dydxClient) {
                    dydxClient = yield this.getDydxClient(ethereumAddress);
                }
                if (dydxClient) {
                    const { account } = yield dydxClient.private.getAccount(ethereumAddress);
                    const usdc = parseInt((account.freeCollateral || 0) * Math.pow(10, 6) + '');
                    balance = balance.add(usdc);
                }
            }
            catch (err) {
                console.warn('GetBalanceUsdc failed: ' + err.message);
            }
            return balance;
        });
    }
    /**
     * @param ethereumAddress
     * @param alwaysNew
     * @returns
     */
    getAccount(ethereumAddress, alwaysNew = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const dydxAccountKey = String(ethereumAddress);
            if (DYDX_ACCOUNTS[dydxAccountKey] && !alwaysNew) {
                return DYDX_ACCOUNTS[dydxAccountKey];
            }
            const dydxClient = yield this.getDydxClient(ethereumAddress);
            const { account } = yield dydxClient.private.getAccount(ethereumAddress);
            return (DYDX_ACCOUNTS[dydxAccountKey] = account);
        });
    }
    /**
     * @param ethereumAddress
     * @returns
     */
    getAccountId(ethereumAddress) {
        return (0, db_1.getAccountId)({ address: ethereumAddress });
    }
    /**
     * @param ethereumAddress
     * @returns
     */
    getMakerInfo(ethereumAddress) {
        const info = DYDX_MAKERS[ethereumAddress];
        if (!info) {
            throw new Error(`Sorry, miss DYDX_MAKERS: ${ethereumAddress}`);
        }
        return info;
    }
    /**
     * @param starkKey ex: 0x0367e161e41f692fc96ee22a8ab313d71bbd310617df4a02675bcfc87a3b708f
     * @param positionId ex: 58011
     * @returns 0x...
     */
    conactStarkKeyPositionId(starkKey, positionId) {
        let positionIdStr = Number(positionId).toString(16);
        if (positionIdStr.length % 2 !== 0) {
            positionIdStr = `0${positionIdStr}`;
        }
        return `${starkKey}${positionIdStr}`;
    }
    /**
     * @param data 0x...
     * @returns
     */
    splitStarkKeyPositionId(data) {
        const starkKey = ethers_1.utils.hexDataSlice(data, 0, 32);
        const positionId = parseInt(ethers_1.utils.hexDataSlice(data, 32), 16);
        return { starkKey, positionId: String(positionId) };
    }
    /**
     * @param ethereumAddress 0x...
     * @returns
     */
    generateClientId(ethereumAddress) {
        const time = new Date().getTime();
        const rand = parseInt(Math.random() * 899 + 100 + '');
        let sourceStr = `${ethereumAddress}${time}${rand}`;
        if (sourceStr.length % 2 != 0) {
            sourceStr += '0';
        }
        sourceStr = sourceStr.replace(/^0x/i, '');
        return Buffer.from(sourceStr, 'hex').toString('base64');
    }
    /**
     * @param clientId base64 string
     * @returns 0x...
     */
    getEthereumAddressFromClientId(clientId) {
        const sourceStr = Buffer.from(clientId, 'base64').toString('hex');
        return ethers_1.utils.hexDataSlice('0x' + sourceStr, 0, 20);
    }
    /**
     * @param ethereumAddress
     * @param apiKeyCredentials
     */
    static setApiKeyCredentials(ethereumAddress, apiKeyCredentials) {
        DYDX_API_KEY_CREDENTIALS[ethereumAddress] = apiKeyCredentials;
    }
    /**
     * @param ethereumAddress
     * @returns
     */
    static getApiKeyCredentials(ethereumAddress) {
        return DYDX_API_KEY_CREDENTIALS[ethereumAddress];
    }
    /**
     * DYDX transfer => Eth transaction
     * @param transfer dYdX transfer
     * @param ethereumAddress 0x...
     * @returns
     */
    static toTransaction(transfer, ethereumAddress) {
        const timeStampMs = new Date(transfer.createdAt).getTime();
        const nonce = DydxHelper.timestampToNonce(timeStampMs);
        const isTransferIn = (0, __1.equalsIgnoreCase)('TRANSFER_IN', transfer.type);
        const isTransferOut = (0, __1.equalsIgnoreCase)('TRANSFER_OUT', transfer.type);
        const transaction = {
            timeStamp: parseInt(timeStampMs / 1000 + ''),
            hash: transfer.id,
            nonce,
            blockHash: '',
            transactionIndex: 0,
            from: '',
            to: '',
            value: ethers_1.ethers.utils
                .parseUnits(isTransferIn ? transfer.creditAmount : transfer.debitAmount, 6)
                .toString(),
            txreceipt_status: transfer.status,
            contractAddress: '',
            confirmations: 0,
        };
        if (isTransferIn) {
            transaction.to = ethereumAddress;
        }
        if (isTransferOut) {
            transaction.from = ethereumAddress;
        }
        return transaction;
    }
    /**
     * The api does not return the nonce value, timestamp(ms) last three number is the nonce
     *  (warnning: there is a possibility of conflict)
     * @param  timestamp ms
     * @returns
     */
    static timestampToNonce(timestamp) {
        let nonce = 0;
        if (timestamp) {
            timestamp = String(timestamp);
            const match = timestamp.match(/(\d{3})$/i);
            if (match && match.length > 1) {
                nonce = Number(match[1]) || 0;
            }
            if (nonce > 900) {
                nonce = nonce - 100;
            }
        }
        return nonce + '';
    }
}
exports.DydxHelper = DydxHelper;
//# sourceMappingURL=dydx_helper.js.map