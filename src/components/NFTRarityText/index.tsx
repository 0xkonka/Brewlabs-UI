const NFTRarityText = ({ rarity = 0, children }: { rarity: any; children: any }) => {
  switch (rarity) {
    case 0:
      return <span className="text-[#ECEAEC]">{children}</span>;
    case 1:
      return <span className="text-[#69FE87]">{children}</span>;
    case 2:
      return <span className="text-[#69B0F6]">{children}</span>;
    case 3:
      return <span className="text-[#B050F7]">{children}</span>;
    case 4:
      return <span className="text-[#F3985F]">{children}</span>;
    case 5:
      return <span className="text-[#F3985F]">{children}</span>;
    default:
      return <span className="text-tailwind">{children}</span>;
  }
};

export default NFTRarityText;
