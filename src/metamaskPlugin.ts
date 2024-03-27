import { Web3PluginBase } from 'web3';

export type Permission = {id: string, context: string[], invoker: string, caveats: {type:string, value:any, name:string}};
export type Snap = {id: {id: string, initialPermissions: Permission, version: string, enabled: boolean, blocked: boolean}};
export type Chain = {chainId:string, blockExplorerUrls?:string[], chainName: string, iconUrls?:string[], nativeCurrency: {name: string, symbol: string, decimals: Number}, rpcUrls: string[]};
// a plugin for the metamask JSON-RPC API 
export default class MetamaskPlugin extends Web3PluginBase {
    public pluginNamespace = 'metamask';

    public constructor(){
        super();
    }

    public async addEthereumChain(chain: Chain) {
        const { chainId, blockExplorerUrls, chainName, iconUrls, nativeCurrency, rpcUrls } = chain;
    
        await this.requestManager.send({method:'wallet_addEthereumChain', params:[{chainId, // The chain ID of the Ethereum chain to add
            blockExplorerUrls, // (Optional) The URL for the block explorer for the chain
            chainName, // The name of the chain to display to the user
            iconUrls, // (Optional) URLs to icons to display for the chain
            nativeCurrency, // (Optional) Information about the native currency of the chain
            rpcUrls, // The URLs of the RPC endpoints for the chain
        }]});
    }

    public async switchEthereumChain(chainId: string) {
        await this.requestManager.send({method:'wallet_switchEthereumChain', params:[{chainId}]});
    }

    public async getPermissions(): Promise<Permission[]> {
        return await this.requestManager.send({method:'wallet_getPermissions', params:[]});
    }

    public async requestPermissions():Promise<Permission[]> {
        return await this.requestManager.send({method:'wallet_requestPermissions', params:[]});
    }


    public async revokePermissions(permission: any) {
        await this.requestManager.send({method:'wallet_revokePermissions', params:[permission]});
    }

    public async registerOnBoarding(): Promise<boolean> {
        return await this.requestManager.send({method:'wallet_registerOnboarding', params:[]});
    }

    public async getSnap(): Promise<Snap> {
        return await this.requestManager.send({method:'wallet_getSnaps', params:[]});
    }

    public async snap(snapId: string, request: {method: string, params: any}): Promise<Snap> {
        return await this.requestManager.send({method:'wallet_snap', params:[snapId, request]});
    }
}

declare module 'web3' {
	interface Web3Context {
		metamask: MetamaskPlugin;
	}
}