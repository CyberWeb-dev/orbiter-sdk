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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chains_1 = __importDefault(require("./chains"));
const chains_api_1 = __importDefault(require("./chains_api"));
const abis = __importStar(require("./abis"));
const contracts = __importStar(require("./contracts"));
const orbiterChainIdToNetworkId = {
    1: '1',
    2: '42161',
    3: '1',
    4: '1',
    5: '4',
    6: '137',
    7: '10',
    8: '1',
    9: '1',
    10: '1088',
    510: '588',
    11: '1',
    22: '421611',
    33: '4',
    44: '5',
    66: '80001',
    77: '69',
    88: '3',
    99: '5',
    511: '3',
    12: '13',
    512: '133',
    15: '56',
    515: '97',
    514: '280',
    16: '42170',
    516: '421613',
    517: '1402', // po zkevm(G)
};
exports.default = {
    chains: chains_1.default,
    chainsApi: chains_api_1.default,
    abis,
    contracts,
    orbiterChainIdToNetworkId,
};
//# sourceMappingURL=index.js.map