import type { SupportedNft } from "config/constants/bond-tokens";
import CurrencySelectorSupportedNftItem from "components/currency-selector/currency-selector-supported-nft-item";

const CurrencySelectorSupportedNfts = ({ supportedNfts }: { supportedNfts: SupportedNft[] }) => (
  <>
    {supportedNfts.map((nft, index) => (
      <CurrencySelectorSupportedNftItem key={index} nft={nft} />
    ))}
  </>
);

export default CurrencySelectorSupportedNfts;
