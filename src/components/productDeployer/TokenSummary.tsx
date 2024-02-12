import { numberWithCommas } from "utils/functions";
import { useDeployerState } from "state/deploy/deployer.store";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

const TokenSummary = () => {
  const [{ tokenName, tokenDescription, tokenSymbol, tokenDecimals, tokenTotalSupply }] = useDeployerState("tokenInfo");
  const [tokenImageDisplayUrl] = useDeployerState("tokenImageDisplayUrl");

  return (
    <dl className="mb-8 mt-8 divide-y divide-gray-600 text-sm lg:col-span-7 lg:mt-0 lg:pr-8">
      <div className="flex items-center justify-between p-4">
        <dt className="text-gray-400">Token name</dt>
        <dd className="font-medium text-gray-200">{tokenName}</dd>
      </div>

      <div className="flex items-center justify-between p-4">
        <dt className="text-gray-400">Token image</dt>
        <dd className="font-medium text-gray-200">
          <Avatar className="ring ring-zinc-900">
            <AvatarImage src={tokenImageDisplayUrl} width={500} height={500} alt="Token image" />
          </Avatar>
        </dd>
      </div>

      <div className="flex items-center justify-between p-4">
        <dt className="text-gray-400">Token symbol</dt>
        <dd className="font-medium text-gray-200">{tokenSymbol}</dd>
      </div>
      <div className="flex items-center justify-between p-4">
        <dt className="text-gray-400">Token decimals</dt>
        <dd className="font-medium text-gray-200">{tokenDecimals}</dd>
      </div>
      <div className="flex items-center justify-between p-4">
        <dt className=" text-gray-400">Total supply</dt>
        <dd className="font-medium text-gray-200">
          {numberWithCommas(Number(tokenTotalSupply))} {tokenSymbol}
        </dd>
      </div>

      {tokenDescription && (
        <div className="flex flex-col gap-4 bg-slate-500/10 p-4">
          <dt className="text-gray-400">Token description</dt>
          <dd className="font-medium text-gray-200">{tokenDescription}</dd>
        </div>
      )}
    </dl>
  );
};

export default TokenSummary;
