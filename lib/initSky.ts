import { ethers } from 'ethers';
import SkyMainBrowser from '@decloudlabs/skynet/lib/services/SkyMainBrowser';
import SkyBrowserSigner from '@decloudlabs/skynet/lib/services/SkyBrowserSigner';
import type { SkyEnvConfigBrowser } from '@decloudlabs/skynet/lib/types/types';
// You may need to adjust the import path for your contract service implementation
// import ContractService from './cls';

export const initializeSkyBrowser = async (provider: any): Promise<any> => {
  if (!provider) throw new Error("Web3 provider not found");

  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  const address = await signer.getAddress();
  // If you have a custom contract service, import and use it here
  // const contractService = new ContractService(619, ethersProvider, signer, address);
  // await contractService.setup();

  // If not, use the default SkyMainBrowser contractService
  const envConfig: SkyEnvConfigBrowser = {
    STORAGE_API: 'https://appsender.skynet.io/api/lighthouse',
    CACHE: { TYPE: 'CACHE' },
  };

  const skyBrowser = new SkyMainBrowser(
    // contractService,
    ethersProvider, // fallback to ethersProvider if no custom contractService
    address,
    new SkyBrowserSigner(address, signer),
    envConfig
  );

  await skyBrowser.init(true);
  return skyBrowser;
}; 