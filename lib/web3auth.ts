import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// Chain configuration for Ethereum mainnet
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x26B", // Ethereum Mainnet
  rpcTarget: "https://rpc.skynet.io", // You can use any RPC endpoint
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

// Get client ID from environment variables
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

if (!clientId) {
  throw new Error("WEB3AUTH_CLIENT_ID is not set in environment variables");
}

// Create Ethereum provider
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Web3Auth configuration
const web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig,
  uiConfig: {
    appName: "Your App Name",
    appUrl: "https://your-app-url.com",
    logoLight: "https://your-logo-url.com/logo-light.png",
    logoDark: "https://your-logo-url.com/logo-dark.png",
    defaultLanguage: "en" as const,
    mode: "auto" as const,
    theme: {
      primary: "#768729",
    },
  },
};

export class Web3AuthService {
  private web3auth: Web3Auth | null = null;
  private provider: IProvider | null = null;
  private isInitialized = false;

  constructor() {
    this.web3auth = new Web3Auth(web3AuthOptions);
  }

  async initialize() {
    if (this.isInitialized || !this.web3auth) return;

    try {
      // Initialize Web3Auth
      await this.web3auth.init();
      
      this.isInitialized = true;
      
      // Set provider if already connected
      if (this.web3auth.connected) {
        this.provider = this.web3auth.provider;
      }
      
      console.log("Web3Auth initialized successfully");
    } catch (error) {
      console.error("Error initializing Web3Auth:", error);
      throw error;
    }
  }

  async login() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.web3auth) {
      throw new Error("Web3Auth is not initialized");
    }

    try {
      const web3authProvider = await this.web3auth.connect();
      this.provider = web3authProvider;
      return web3authProvider;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async logout() {
    if (!this.web3auth) {
      throw new Error("Web3Auth is not initialized");
    }

    try {
      await this.web3auth.logout();
      this.provider = null;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }

  async getUserInfo() {
    if (!this.web3auth || !this.web3auth.connected) {
      throw new Error("User not connected");
    }

    try {
      const userInfo = await this.web3auth.getUserInfo();
      return userInfo;
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }

  async getAddress(): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" });
      return (accounts as string[])[0];
    } catch (error) {
      console.error("Error getting address:", error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" });
      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, (accounts as string[])[0]],
      });
      return signature as string;
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  async getBalance(): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" });
      const balance = await this.provider.request({
        method: "eth_getBalance",
        params: [(accounts as string[])[0], "latest"],
      });
      return balance as string;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async sendTransaction(to: string, value: string): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider not available");
    }

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" });
      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: (accounts as string[])[0],
            to,
            value,
            gasLimit: "0x5208", // 21000 gas limit for simple transfer
          },
        ],
      });
      return txHash as string;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  isConnected() {
    return this.web3auth?.connected || false;
  }

  getProvider() {
    return this.provider;
  }

  getWeb3Auth() {
    return this.web3auth;
  }
}

export const web3AuthService = new Web3AuthService();