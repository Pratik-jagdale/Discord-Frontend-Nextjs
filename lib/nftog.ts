import SkyMainBrowser from "@decloudlabs/skynet/lib/services/SkyMainBrowser";

export const fetchNfts = async (address: string, skyBrowser: SkyMainBrowser) => {
    let storedNfts = JSON.parse(localStorage.getItem(`nfts-${address}`) || '[]');
    let selectedNftId = localStorage.getItem(`selectedNftId-${address}`);

    const BATCH_SIZE = 20;

    try {
        const nftCount = await skyBrowser?.contractService.AgentNFT.balanceOf(address);
        if (nftCount) {
            const totalCount = parseInt(nftCount.toString());
            let currentIndex = storedNfts.length;

            while (currentIndex < totalCount) {
                const batchPromises = [];
                const endIndex = Math.min(currentIndex + BATCH_SIZE, totalCount);

                for (let i = currentIndex; i < endIndex; i++) {
                    batchPromises.push(
                        skyBrowser?.contractService.AgentNFT.tokenOfOwnerByIndex(address, i)
                    );
                }

                const batchResults = await Promise.all(batchPromises);
                const newNftIds = batchResults
                    .filter(nft => nft)
                    .map(nft => nft.toString());

                const updatedNfts = [...storedNfts, ...newNftIds].sort((a, b) => parseInt(b) - parseInt(a));
                storedNfts = updatedNfts;
                localStorage.setItem(`nfts-${address}`, JSON.stringify(updatedNfts));

                currentIndex += BATCH_SIZE;
            }

            if (!selectedNftId || !(await isValidOwner(selectedNftId, address, skyBrowser))) {
                selectedNftId = storedNfts[0];
                localStorage.setItem(`selectedNftId-${address}`, selectedNftId!);
            }

            return storedNfts;
        }
        return [];
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
};

export const storedNfts = (address: string) => {
    const nfts = localStorage.getItem(`nfts-${address}`);
    return nfts ? JSON.parse(nfts) : [];
};

export const mintNft = async (skyBrowser: SkyMainBrowser) => {
    const registeredNFT = await skyBrowser.contractService.NFTMinter.getRegisteredNFTs(skyBrowser.contractService.AgentNFT);
    console.log(registeredNFT);
    // if (!registeredNFT.isRegistered) {
    //     return false;
    // }
    const response = await skyBrowser.contractService.callContractWrite(
        skyBrowser.contractService.NFTMinter.mint(
            skyBrowser.contractService.selectedAccount,
            skyBrowser.contractService.AgentNFT,
            {
                value: registeredNFT.mintPrice
            }));
    if (response.success) {
        fetchNfts(skyBrowser.contractService.selectedAccount, skyBrowser);
        return true;
    }
    return false;
};

const isValidOwner = async (tokenId: string, address: string, skyBrowser: SkyMainBrowser) => {
    try {
        const owner = await skyBrowser?.contractService.AgentNFT.ownerOf(tokenId);
        return owner?.toLowerCase() === address.toLowerCase();
    } catch {
        return false;
    }
};