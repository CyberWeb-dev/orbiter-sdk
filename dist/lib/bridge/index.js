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
exports.Bridge = void 0;
const v3_client_1 = require("@dydxprotocol/v3-client");
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const config_1 = __importDefault(require("../config"));
const orbiter_sdk_1 = require("../orbiter-sdk");
const transaction_1 = require("../transaction");
const utils_1 = require("../utils");
const validator_1 = require("../utils/validator");
const maker_list_mainnet_1 = require("./maker_list.mainnet");
const maker_list_testnet_1 = require("./maker_list.testnet");
class Bridge {
    constructor(network) {
        this.network = 'Testnet';
        this.network = network;
    }
    /**
     * @param makerListItem
     * @returns
     */
    expandMakerInfo(makerListItem) {
        return [
            {
                makerAddress: makerListItem.makerAddress,
                fromChainId: makerListItem.c1ID,
                toChainId: makerListItem.c2ID,
                fromChainName: makerListItem.c1Name,
                toChainName: makerListItem.c2Name,
                fromTokenAddress: makerListItem.t1Address,
                toTokenAddress: makerListItem.t2Address,
                tokenName: makerListItem.tName,
                minPrice: makerListItem.c1MinPrice,
                maxPrice: makerListItem.c1MaxPrice,
                precision: makerListItem.precision,
                avalibleDeposit: makerListItem.c1AvalibleDeposit,
                tradingFee: makerListItem.c1TradingFee,
                gasFee: makerListItem.c1GasFee,
                avalibleTimes: makerListItem.c1AvalibleTimes,
            },
            {
                makerAddress: makerListItem.makerAddress,
                fromChainId: makerListItem.c2ID,
                toChainId: makerListItem.c1ID,
                fromChainName: makerListItem.c2Name,
                toChainName: makerListItem.c1Name,
                fromTokenAddress: makerListItem.t2Address,
                toTokenAddress: makerListItem.t1Address,
                tokenName: makerListItem.tName,
                minPrice: makerListItem.c2MinPrice,
                maxPrice: makerListItem.c2MaxPrice,
                precision: makerListItem.precision,
                avalibleDeposit: makerListItem.c2AvalibleDeposit,
                tradingFee: makerListItem.c2TradingFee,
                gasFee: makerListItem.c2GasFee,
                avalibleTimes: makerListItem.c2AvalibleTimes,
            },
        ];
    }
    /**
     * @param accountAddress
     * @param signer
     * @param fromChain
     * @param toChain
     */
    ensureStarkAccount(accountAddress, signer, fromChain, toChain) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3Provider = signer.provider;
            // dYdX
            let dydxChainId = 0;
            if (validator_1.ChainValidator.dydx((dydxChainId = fromChain.id)) ||
                validator_1.ChainValidator.dydx((dydxChainId = toChain.id))) {
                const dydxHelper = new orbiter_sdk_1.DydxHelper(dydxChainId, new web3_1.default(web3Provider.provider), web3Provider.provider.isMetaMask ? v3_client_1.SigningMethod.MetaMask : v3_client_1.SigningMethod.TypedData);
                yield dydxHelper.getAccount(accountAddress);
            }
        });
    }
    /**
     * @returns
     */
    getNetwork() {
        return this.network;
    }
    /**
     * @returns
     */
    getMakerList() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.makerList) {
                return this.makerList;
            }
            // In the future, it will be obtained from the Internet
            if (this.network == 'Mainnet') {
                return (this.makerList = maker_list_mainnet_1.makerList);
            }
            else {
                return (this.makerList = maker_list_testnet_1.makerList);
            }
        });
    }
    /**
     * @param fromChain
     * @param toChain
     */
    supports(fromChain, toChain) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = [];
            const fromChains = [];
            const toChains = [];
            const makerList = yield this.getMakerList();
            for (const item of makerList) {
                this.expandMakerInfo(item).forEach((makerInfo) => {
                    // Push tokens
                    const findIndexToken = tokens.findIndex((_token) => (0, utils_1.equalsIgnoreCase)(_token.address, makerInfo.fromTokenAddress) &&
                        _token.chainId == makerInfo.fromChainId);
                    if (findIndexToken === -1 && (!toChain || toChain.id == makerInfo.toChainId)) {
                        tokens.push({
                            chainId: makerInfo.fromChainId,
                            address: makerInfo.fromTokenAddress,
                            name: makerInfo.tokenName,
                            precision: makerInfo.precision,
                            makerAddress: makerInfo.makerAddress,
                        });
                    }
                    // Push fromChains.
                    // Warnning: starknet cannot transfer out now!, dYdX cannot transfer out now!
                    if ((!toChain || toChain.id == makerInfo.toChainId) &&
                        validator_1.ChainValidator.starknet(makerInfo.fromChainId) === undefined &&
                        validator_1.ChainValidator.dydx(makerInfo.fromChainId) === undefined) {
                        const findIndexFromChain = fromChains.findIndex((_chain) => _chain.id == makerInfo.fromChainId);
                        if (findIndexFromChain === -1) {
                            fromChains.push({
                                id: makerInfo.fromChainId,
                                name: makerInfo.fromChainName,
                                networkId: config_1.default.orbiterChainIdToNetworkId[makerInfo.fromChainId],
                            });
                        }
                    }
                    // Push toChains
                    // Warnning: starknet cannot transfer in now!
                    if ((!fromChain || fromChain.id == makerInfo.fromChainId) &&
                        validator_1.ChainValidator.starknet(makerInfo.toChainId) === undefined) {
                        const findIndexToChain = toChains.findIndex((_chain) => _chain.id == makerInfo.toChainId);
                        if (findIndexToChain === -1) {
                            toChains.push({
                                id: makerInfo.toChainId,
                                name: makerInfo.toChainName,
                                networkId: config_1.default.orbiterChainIdToNetworkId[makerInfo.toChainId],
                            });
                        }
                    }
                });
            }
            return { tokens, fromChains, toChains };
        });
    }
    /**
     * @param token
     * @param fromChain
     * @param toChain
     * @returns
     */
    getTargetMakerInfo(token, fromChain, toChain) {
        return __awaiter(this, void 0, void 0, function* () {
            const makerList = yield this.getMakerList();
            // Use map to maintain type deduction
            const targets = makerList
                .map((item) => {
                const expand = this.expandMakerInfo(item);
                // Normal
                if (expand[0].fromChainId == fromChain.id &&
                    expand[0].toChainId == toChain.id &&
                    (0, utils_1.equalsIgnoreCase)(expand[0].fromTokenAddress, token.address)) {
                    return expand[0];
                }
                // Reverse
                if (expand[1].fromChainId == fromChain.id &&
                    expand[1].toChainId == toChain.id &&
                    (0, utils_1.equalsIgnoreCase)(expand[1].fromTokenAddress, token.address)) {
                    return expand[1];
                }
                return undefined;
            })
                .filter((item) => item !== undefined);
            if (targets.length < 1) {
                throw new Error('Orbiter cannot find target maker info!');
            }
            // Only return first. Normally there is only one record here
            return targets[0];
        });
    }
    /**
     * @param token
     * @param fromChain
     * @param toChain
     * @param amountHm Human readable amount
     */
    getAmounts(token, fromChain, toChain, amountHm) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetMakerInfo = yield this.getTargetMakerInfo(token, fromChain, toChain);
            const { tradingFee, precision, minPrice, maxPrice } = targetMakerInfo;
            // Check minPrice, maxPrice
            //@ts-ignore
            if (amountHm < minPrice) {
                throw new Error(`Orbiter get amounts failed: amount less than minPrice(${minPrice}), token: ${token.name}, fromChain: ${fromChain.name}, toChain: ${toChain.name}`);
            }
            //@ts-ignore
            if (amountHm > maxPrice) {
                throw new Error(`Orbiter get amounts failed: amount greater than maxPrice(${maxPrice}), token: ${token.name}, fromChain: ${fromChain.name}, toChain: ${toChain.name}`);
            }
            const amount = ethers_1.utils.parseUnits(Number(amountHm).toFixed(precision), precision);
            const userAmount = amount.add(ethers_1.utils.parseUnits(tradingFee + '', precision));
            const receiveAmountHm = orbiter_sdk_1.core
                .getToAmountFromUserAmount(ethers_1.utils.formatUnits(userAmount, precision), targetMakerInfo, false)
                .toString();
            const payText = 9000 + Number(toChain.id) + '';
            const result = orbiter_sdk_1.core.getTAmountFromRAmount(fromChain.id, userAmount, payText);
            if (!result.state) {
                throw new Error('Obirter get total amount failed! Please check if the amount matches the rules!');
            }
            const payAmount = ethers_1.ethers.BigNumber.from(result.tAmount + '');
            const payAmountHm = ethers_1.utils.formatUnits(payAmount, precision);
            return { payText, payAmount, payAmountHm, receiveAmountHm };
        });
    }
    /**
     * @param signer
     * @param token
     * @param fromChain
     * @param toChain
     * @param amountHm
     */
    transfer(signer, token, fromChain, toChain, amountHm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!signer) {
                throw new Error('Orbiter bridge transfer miss params [signer]');
            }
            // Get web3Provider
            let web3Provider = signer.provider;
            web3Provider.provider;
            if (!web3Provider || !(web3Provider instanceof providers_1.Web3Provider)) {
                throw new Error('Orbiter bridge transfer failed: Invalid signer.provider');
            }
            const amounts = yield this.getAmounts(token, fromChain, toChain, amountHm);
            const transferOptions = {
                amount: amounts.payAmount,
                tokenAddress: token.address,
                toAddress: token.makerAddress,
            };
            const accountAddress = yield signer.getAddress();
            if (!accountAddress) {
                throw new Error('Orbiter bridge failed: Empty fromAddress');
            }
            // Ensure StarkAccount(imx, dydx...)
            yield this.ensureStarkAccount(accountAddress, signer, fromChain, toChain);
            // When provider is metamask, switch network
            if (web3Provider.provider.isMetaMask === true) {
                yield (0, utils_1.ensureMetamaskNetwork)(fromChain.id, web3Provider.provider);
                // Reset web3Provider, signer
                web3Provider = new providers_1.Web3Provider(web3Provider.provider);
                signer = web3Provider.getSigner();
            }
            // To dydx is cross address transfer
            // It will cache dydxAccount in ensureStarkAccount
            if (validator_1.ChainValidator.dydx(toChain.id)) {
                const dydxHelper = new orbiter_sdk_1.DydxHelper(toChain.id);
                const dydxAccount = yield dydxHelper.getAccount(accountAddress);
                transferOptions.crossAddressExt = {
                    type: '0x02',
                    value: dydxHelper.conactStarkKeyPositionId('0x' + dydxAccount.starkKey, dydxAccount.positionId),
                };
            }
            // Web3
            if (validator_1.ChainValidator.loopring(fromChain.id)) {
                const web3 = new web3_1.default(web3Provider.provider);
                if (signer instanceof ethers_1.Wallet && signer.privateKey) {
                    web3.eth.accounts.wallet.add(signer.privateKey);
                }
                const tLoopring = new transaction_1.TransactionLoopring(fromChain.id, web3);
                return yield tLoopring.transfer(Object.assign(Object.assign({}, transferOptions), { fromAddress: accountAddress, memo: amounts.payText }));
            }
            if (validator_1.ChainValidator.dydx(fromChain.id)) {
                // dYdx cannot transfer out now
                return undefined;
            }
            // Evm transaction
            const tEvm = new transaction_1.TransactionEvm(fromChain.id, signer);
            return yield tEvm.transfer(transferOptions);
        });
    }
}
exports.Bridge = Bridge;
//# sourceMappingURL=index.js.map