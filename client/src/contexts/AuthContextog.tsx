import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { web3AuthService } from "../lib/web3auth";
import { fetchNfts, storedNfts } from "../lib/nft";

interface User {
  address: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  nftCollections?: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  refreshNFTCollections: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [nftCollections, setNftCollections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await web3AuthService.initialize();
      
      if (web3AuthService.isConnected()) {
        const userInfo = await web3AuthService.getUserInfo();
        const address = await web3AuthService.getAddress();
        
        const userData: User = {
          address,
          name: userInfo.name || "Unknown User",
          email: userInfo.email,
          profileImage: userInfo.profileImage,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Load NFT collections
        await loadNFTCollections(address);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNFTCollections = async (address: string) => {
    try {
      const provider = web3AuthService.getProvider();
      if (!provider) {
        console.error("No provider available");
        return;
      }
      // Import the helper and fetchNfts
      const { initializeSkyBrowser } = await import("../lib/initSky");
      const { fetchNfts } = await import("../lib/nft");
      // Initialize SkyMainBrowser
      const skyBrowser = await initializeSkyBrowser(provider);
      // Fetch NFTs
      const collections = await fetchNfts(address, skyBrowser);
      setNftCollections(collections);
    } catch (error) {
      console.error("Error loading NFT collections:", error);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      await web3AuthService.login();
      
      const userInfo = await web3AuthService.getUserInfo();
      const address = await web3AuthService.getAddress();
      
      const userData: User = {
        address,
        name: userInfo.name || "Unknown User",
        email: userInfo.email,
        profileImage: userInfo.profileImage,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      await loadNFTCollections(address);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await web3AuthService.logout();
      setUser(null);
      setNftCollections([]);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated");
    }
    
    return await web3AuthService.signMessage(message);
  };

  const refreshNFTCollections = async () => {
    if (!user) return;
    await loadNFTCollections(user.address);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        nftCollections,
        isLoading,
        isAuthenticated,
        login,
        logout,
        signMessage,
        refreshNFTCollections,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
