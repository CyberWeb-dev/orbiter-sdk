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
exports.CrossAddress = exports.CrossAddressExtTypes = void 0;
const ethers_1 = require("ethers");
const config_1 = __importDefault(require("../config"));
exports.CrossAddressExtTypes = {
    '0x01': 'Cross Ethereum Address',
    '0x02': 'Cross Stark Address',
};
class CrossAddress {
    /**
     * @param signer
     * @param orbiterChainId
     */
    constructor(signer, orbiterChainId = 5) {
        this.contractAddress = config_1.default.contracts.crossAddress[orbiterChainId];
        if (!this.contractAddress) {
            throw new Error('Orbiter cross address constructor failed: miss param [contractAddress]');
        }
        this.signer = signer;
        this.provider = signer.provider;
        this.networkId = config_1.default.orbiterChainIdToNetworkId[orbiterChainId];
    }
    checkNetworkId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.provider.provider.isMetaMask) {
                return true;
            }
            if (!this.providerNetworkId) {
                this.providerNetworkId = (yield this.provider.getNetwork()).chainId;
            }
            if (this.providerNetworkId != this.networkId) {
                throw new Error(`Sorry, currentNetworkId: ${this.providerNetworkId} no equal networkId: ${this.networkId}`);
            }
            return true;
        });
    }
    /**
     *
     * @param tokenAddress 0x...
     * @param amount
     */
    approveERC20(tokenAddress, amount = ethers_1.ethers.constants.MaxUint256) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkNetworkId();
            const contract = new ethers_1.ethers.Contract(tokenAddress, config_1.default.abis.erc20, this.signer);
            yield contract.approve(this.contractAddress, amount);
        });
    }
    /**
     * @param to
     * @param amount
     * @param ext
     * @return
     */
    transfer(to, amount, ext = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkNetworkId();
            if (ext && !exports.CrossAddressExtTypes[ext.type]) {
                throw new Error(`Invalid crossAddressType : ${ext.type}`);
            }
            // Sure amount is bignumber
            if (!(amount instanceof ethers_1.BigNumber)) {
                amount = ethers_1.BigNumber.from(amount);
            }
            const contract = new ethers_1.ethers.Contract(this.contractAddress, config_1.default.abis.crossAddress, this.signer);
            const extHex = CrossAddress.encodeExt(ext);
            const options = { value: amount.toHexString() };
            return yield contract.transfer(to, extHex, options);
        });
    }
    /**
     *
     * @param tokenAddress 0x...
     * @param to
     * @param amount
     * @param ext
     * @return
     */
    transferERC20(tokenAddress, to, amount, ext = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkNetworkId();
            if (ext && !exports.CrossAddressExtTypes[ext.type]) {
                throw new Error(`Invalid crossAddressType : ${ext.type}`);
            }
            // Sure amount is bignumber
            if (!(amount instanceof ethers_1.BigNumber)) {
                amount = ethers_1.BigNumber.from(amount);
            }
            // Check and approve erc20 amount
            const contractErc20 = new ethers_1.ethers.Contract(tokenAddress, config_1.default.abis.erc20, this.provider);
            const ownerAddress = yield this.signer.getAddress();
            const allowance = yield contractErc20.allowance(ownerAddress, this.contractAddress);
            if (amount.gt(allowance)) {
                yield this.approveERC20(tokenAddress);
            }
            const contract = new ethers_1.ethers.Contract(this.contractAddress, config_1.default.abis.crossAddress, this.signer);
            const extHex = CrossAddress.encodeExt(ext);
            return (yield contract.transferERC20(tokenAddress, to, amount.toHexString(), extHex));
        });
    }
    /**
     *
     * @param ext
     * @returns hex
     */
    static encodeExt(ext) {
        if (!ext || !ethers_1.utils.isHexString(ext.type)) {
            return '0x';
        }
        if (!ext.value) {
            return ext.type;
        }
        return ethers_1.utils.hexConcat([ext.type, ext.value]);
    }
    /**
     *
     * @param hex
     * @returns
     */
    static decodeExt(hex) {
        if (!ethers_1.utils.isHexString(hex)) {
            return undefined;
        }
        const type = ethers_1.utils.hexDataSlice(hex, 0, 1);
        const value = ethers_1.utils.hexDataSlice(hex, 1);
        return { type, value };
    }
    /**
     * @param input 0x...
     */
    static parseTransferInput(input) {
        const [to, ext] = ethers_1.utils.defaultAbiCoder.decode(['address', 'bytes'], ethers_1.utils.hexDataSlice(input, 4));
        return { to, ext: CrossAddress.decodeExt(ext) };
    }
    /**
     * @param input 0x...
     */
    static parseTransferERC20Input(input) {
        const [token, to, amount, ext] = ethers_1.utils.defaultAbiCoder.decode(['address', 'address', 'uint256', 'bytes'], ethers_1.utils.hexDataSlice(input, 4));
        return { token, to, amount, ext: CrossAddress.decodeExt(ext) };
    }
}
exports.CrossAddress = CrossAddress;
//# sourceMappingURL=cross_address.js.map