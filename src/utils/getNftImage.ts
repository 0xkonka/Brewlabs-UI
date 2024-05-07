import type { EvmNftData } from "@moralisweb3/common-evm-utils";

function removeAfterIpfs(url) {
  const ipfsIndex = url.indexOf("/ipfs/");
  if (ipfsIndex !== -1) {
    // if '/ipfs/' not found, return the original URL
    return url.slice(0, ipfsIndex + "/ipfs/".length);
  }
  return url;
}

const createIPFSURL = (tokenUri, imagePath) => {
  const trimmedUrl = removeAfterIpfs(tokenUri);
  const x = imagePath?.replace("ipfs://", trimmedUrl);

  return x;
};

export const getNftImage = (nft: EvmNftData): string => {
  if (!nft) return "/images/nfts/default.png";

  // If brewlabs NFT
  if (nft.name.includes("Brewlabs Flask NFT")) {
    return "/images/nfts/brewlabs-flask-nfts/brewlabs-flask-common.png";
  }

  // Try that - Metadata image
  if (nft.metadata && "image" in nft.metadata) {
    return createIPFSURL(nft.tokenUri, nft.metadata.image);
  }

  return "/images/nfts/default.png";
};
