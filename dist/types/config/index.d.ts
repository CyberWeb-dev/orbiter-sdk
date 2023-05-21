import * as abis from './abis';
import * as contracts from './contracts';
declare const _default: {
    chains: {
        name: string;
        chainId: number;
        shortName: string;
        networkId: number;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpc: string[];
        faucets: string[];
        explorers: any[];
        infoURL: string;
    }[];
    chainsApi: {
        etherscan: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        arbitrum: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        zkSync: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        starknet: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        polygon: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        optimistic: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        immutableX: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        loopring: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        metis: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        dydx: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        zkspace: {
            key: string;
            Mainnet: string;
            Testnet: string;
        };
        zkSync2: {
            key: string;
            Testnet: string;
        };
        bsc: {
            key: string;
            Mainnet: string;
            TestNet: string;
        };
    };
    abis: typeof abis;
    contracts: typeof contracts;
    orbiterChainIdToNetworkId: {
        [key: number]: string;
    };
};
export default _default;
