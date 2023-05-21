"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainValidator = exports.ChainValidatorTypes = void 0;
var ChainValidatorTypes;
(function (ChainValidatorTypes) {
    ChainValidatorTypes[ChainValidatorTypes["Mainnet"] = 1] = "Mainnet";
    ChainValidatorTypes[ChainValidatorTypes["Testnet"] = 2] = "Testnet";
})(ChainValidatorTypes = exports.ChainValidatorTypes || (exports.ChainValidatorTypes = {}));
class ChainValidator {
    static ethereum(chainId) {
        if (chainId == 1) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 5) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static arbitrum(chainId) {
        if (chainId == 2) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 22) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static zksync(chainId) {
        if (chainId == 3) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 33) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static zksync2(chainId) {
        if (chainId == 514) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static starknet(chainId) {
        if (chainId == 4) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 44) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static polygon(chainId) {
        if (chainId == 6) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 66) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static optimism(chainId) {
        if (chainId == 7) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 77) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static immutablex(chainId) {
        if (chainId == 8) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 88) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static loopring(chainId) {
        if (chainId == 9) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 99) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static metis(chainId) {
        if (chainId == 10) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 510) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static dydx(chainId) {
        if (chainId == 11) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 511) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
    static zkspace(chainId) {
        if (chainId == 12) {
            return ChainValidatorTypes.Mainnet;
        }
        if (chainId == 512) {
            return ChainValidatorTypes.Testnet;
        }
        return undefined;
    }
}
exports.ChainValidator = ChainValidator;
//# sourceMappingURL=validator.js.map