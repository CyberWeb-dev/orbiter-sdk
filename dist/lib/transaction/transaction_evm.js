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
exports.TransactionEvm = void 0;
const ethers_1 = require("ethers");
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const cross_address_1 = require("../utils/cross_address");
const transaction_1 = require("./transaction");
class TransactionEvm extends transaction_1.Transaction {
    /**
     * @param estimator
     * @param defaultGasLimit
     * @returns
     */
    getTransferGasLimit(estimator, defaultGasLimit = 55000) {
        return __awaiter(this, void 0, void 0, function* () {
            let gasLimit = ethers_1.ethers.BigNumber.from(defaultGasLimit);
            try {
                gasLimit = yield estimator();
            }
            catch (err) {
                console.error('getTransferGasLimit error: ', err);
            }
            return gasLimit;
        });
    }
    getTransGasPrice(estimator, defaultGasPrice = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let gasPrice = defaultGasPrice;
            try {
                gasPrice = yield estimator();
            }
            catch (err) {
                console.error('getTransGasPrice error: ', err);
            }
            return gasPrice;
        });
    }
    /**
     * @param options
     */
    transferCrossAddress(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const crossAddress = new cross_address_1.CrossAddress(this.signer, this.chainId);
            if ((0, utils_1.isEthTokenAddress)(options.tokenAddress)) {
                return yield crossAddress.transfer(options.toAddress, options.amount, options.crossAddressExt);
            }
            else {
                return yield crossAddress.transferERC20(options.tokenAddress, options.toAddress, options.amount, options.crossAddressExt);
            }
        });
    }
    /**
     *
     * @param options
     * @returns
     */
    transfer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const amountHex = ethers_1.ethers.BigNumber.from(options.amount).toHexString();
            // Cross address transfer
            if (options.crossAddressExt) {
                return yield this.transferCrossAddress(options);
            }
            if ((0, utils_1.isEthTokenAddress)(options.tokenAddress)) {
                // When tokenAddress is eth
                const gasPrice = yield this.getTransGasPrice(() => {
                    return this.signer.getGasPrice();
                });
                const params = {
                    to: options.toAddress,
                    value: amountHex,
                    gasPrice: ethers_1.ethers.utils.hexlify(gasPrice)
                };
                const gasLimit = yield this.getTransferGasLimit(() => {
                    return this.signer.estimateGas(params);
                }, options.defaultGasLimit);
                return yield this.signer.sendTransaction(Object.assign(Object.assign({}, params), { gasLimit: gasLimit }));
            }
            else {
                // When tokenAddress is erc20
                const contract = new ethers_1.ethers.Contract(options.tokenAddress, config_1.default.abis.erc20, this.signer);
                if (!contract) {
                    throw new Error('Failed to obtain contract information, please refresh and try again');
                }
                const gasLimit = yield this.getTransferGasLimit(() => {
                    return contract.estimateGas.transfer(options.toAddress, amountHex);
                }, options.defaultGasLimit);
                return yield contract.transfer(options.toAddress, amountHex, {
                    gasLimit: gasLimit,
                });
            }
        });
    }
}
exports.TransactionEvm = TransactionEvm;
//# sourceMappingURL=transaction_evm.js.map