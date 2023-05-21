export declare enum ChainValidatorTypes {
    Mainnet = 1,
    Testnet = 2
}
export declare class ChainValidator {
    static ethereum(chainId: number): ChainValidatorTypes;
    static arbitrum(chainId: number): ChainValidatorTypes;
    static zksync(chainId: number): ChainValidatorTypes;
    static zksync2(chainId: number): ChainValidatorTypes;
    static starknet(chainId: number): ChainValidatorTypes;
    static polygon(chainId: number): ChainValidatorTypes;
    static optimism(chainId: number): ChainValidatorTypes;
    static immutablex(chainId: number): ChainValidatorTypes;
    static loopring(chainId: number): ChainValidatorTypes;
    static metis(chainId: number): ChainValidatorTypes;
    static dydx(chainId: number): ChainValidatorTypes;
    static zkspace(chainId: number): ChainValidatorTypes;
}
