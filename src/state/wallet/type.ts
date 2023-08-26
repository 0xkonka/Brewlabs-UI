import { ChainId } from "@brewlabs/sdk";

export interface SerializedWalletNFT {
  type: string;
  collectionName: string;
  address: string;
  description: string;
  logo: string;
  chainId: ChainId;
  name: string;
  tokenId: number;
  balance: number;
}
