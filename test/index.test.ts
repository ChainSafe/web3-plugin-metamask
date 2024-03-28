import { Web3, core } from "web3";
import MetamaskPlugin, {Chain} from "../src/index";


const mockChain: Chain = {chainId: "0xA4B1", blockExplorerUrls: ["https://arbiscan.io"], chainName: "arbitrum", iconUrls: [], nativeCurrency: {decimals:18, name:"aritrum", symbol:"ETH"}, rpcUrls: ["https://1rpc.io/arb"]}

describe("TemplatePlugin Tests", () => {
  it("should register TemplatePlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(new MetamaskPlugin());
    expect(web3Context.metamask).toBeDefined();
  });

  describe("Metamask method tests", () => {

    let web3: Web3;
    let mockSend: jest.Mock;

    beforeAll(() => {
      web3 = new Web3("http://127.0.0.1:8545");
      web3.registerPlugin(new MetamaskPlugin());
      mockSend = jest.fn();
        web3.metamask.requestManager.send = mockSend;
    });

    it("should add an Ethereum chain with the expected parameters", async () => {
      await web3.metamask.addEthereumChain(mockChain);
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_addEthereumChain',
          params: [mockChain]
      });
  });

  it("should switch the Ethereum chain with the expected chain ID", async () => {
      await web3.metamask.switchEthereumChain(mockChain.chainId);
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: mockChain.chainId }]
      });
  });

  it("should get permissions correctly", async () => {
      await web3.metamask.getPermissions();
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_getPermissions',
          params: []
      });
  });

  it("should request permissions with expected parameters", async () => {
      const requestPermissionsObject = { permissionType: 'example_permission' };
      await web3.metamask.requestPermissions(requestPermissionsObject);
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_requestPermissions',
          params: [requestPermissionsObject]
      });
  });

  it("should revoke permissions with expected parameters", async () => {
      const permission = { permissionType: 'example_permission' };
      await web3.metamask.revokePermissions(permission);
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_revokePermissions',
          params: [permission]
      });
  });

  it("should register onboarding", async () => {
      await web3.metamask.registerOnBoarding();
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_registerOnboarding',
          params: []
      });
  });

  it("should get snap with expected parameters", async () => {
      await web3.metamask.getSnap();
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_getSnaps',
          params: []
      });
  });

  it("should request snap with expected parameters", async () => {
      const requestSnap = { snapId: "exampleSnap", requestData: {} };
      await web3.metamask.requestSnap(requestSnap);
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_snap',
          params: [requestSnap]
      });
  });

  it("should handle snap interaction with expected parameters", async () => {
      const snapParameter = { snapId: "exampleSnap", request: { method: "exampleMethod", params: {} } };
      await web3.metamask.snap(snapParameter);
      expect(mockSend).toHaveBeenCalledWith({
          method: 'wallet_snap',
          params: [snapParameter]
      });
  });

  });
});
