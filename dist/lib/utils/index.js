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
exports.ensureMetamaskNetwork = exports.getChainInfo = exports.isEthTokenAddress = exports.equalsIgnoreCase = exports.dateFormatNormal = exports.sleep = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const ethers_1 = require("ethers");
const config_1 = __importDefault(require("../config"));
/**
 * @param ms
 * @returns
 */
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, ms);
        });
    });
}
exports.sleep = sleep;
/**
 * Normal format date: (YYYY-MM-DD HH:mm:ss)
 * @param date Date
 * @returns
 */
function dateFormatNormal(date) {
    return (0, dayjs_1.default)(date).format('YYYY-MM-DD HH:mm:ss');
}
exports.dateFormatNormal = dateFormatNormal;
/**
 * String equals ignore case
 * @param value1
 * @param value2
 * @returns
 */
function equalsIgnoreCase(value1, value2) {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
        return false;
    }
    if (value1 == value2) {
        return true;
    }
    if (value1.toUpperCase() == value2.toUpperCase()) {
        return true;
    }
    return false;
}
exports.equalsIgnoreCase = equalsIgnoreCase;
/**
 *
 * @param tokenAddress when tokenAddress=/^0x0+$/i
 * @returns
 */
function isEthTokenAddress(tokenAddress) {
    if (tokenAddress === "0x0000000000000000000000000000000000001010") {
        // polygon matic token
        return true;
    }
    return /^0x0+$/i.test(tokenAddress);
}
exports.isEthTokenAddress = isEthTokenAddress;
/**
 * @param networkId MetaMask's networkId
 * @returns
 */
function getChainInfo(networkId) {
    const chainInfo = config_1.default.chains.find((chain) => chain.chainId.toString() === String(networkId));
    return chainInfo;
}
exports.getChainInfo = getChainInfo;
/**
 * @param chainId Orbiter's chainId
 * @param ethereum window.ethereum
 */
function ensureMetamaskNetwork(chainId, ethereum) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!ethereum) {
            throw new Error('Please install MetaMask or other wallets that support web3 first!');
        }
        const chain = getChainInfo(config_1.default.orbiterChainIdToNetworkId[chainId]);
        if (!chain) {
            throw new Error(`Orbiter not support this chain: ${chainId}`);
        }
        const switchParams = {
            chainId: ethers_1.utils.hexStripZeros(ethers_1.utils.hexlify(chain.chainId)),
        };
        try {
            yield ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [switchParams],
            });
        }
        catch (error) {
            if (error.code === 4902) {
                // Add network
                const params = Object.assign(Object.assign({}, switchParams), { chainName: chain.name, nativeCurrency: {
                        name: chain.nativeCurrency.name,
                        symbol: chain.nativeCurrency.symbol,
                        decimals: chain.nativeCurrency.decimals,
                    }, rpcUrls: chain.rpc, blockExplorerUrls: [((_a = chain.explorers[0]) === null || _a === void 0 ? void 0 : _a['url']) || chain.infoURL] });
                yield ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [params],
                });
            }
            else {
                throw error;
            }
        }
    });
}
exports.ensureMetamaskNetwork = ensureMetamaskNetwork;
//# sourceMappingURL=index.js.map