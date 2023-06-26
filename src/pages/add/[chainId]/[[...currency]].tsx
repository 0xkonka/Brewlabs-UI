import { useCurrency } from "hooks/Tokens";
import { useRouter } from "next/router";
import { WNATIVE } from "@brewlabs/sdk";

import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { brewsToken, usdToken } from "config/constants/tokens";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getExplorerLink } from "lib/bridge/helpers";
import { getLpManagerAddress } from "utils/addressHelpers";

import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { InfoSVG } from "components/dashboard/assets/svgs";

import AddLiquidityPanel from "views/contructor/AddLiquidityPanel";
import { useLPTokens } from "@hooks/constructor/useLPTokens";

const AddLiquidityPage = () => {
  const router = useRouter();
  const { chainId } = useActiveChainId();
  const { fetchLPTokens }: any = useLPTokens();

  const selectedChainId = +router.query.chainId ?? chainId;

  const [currencyIdA, currencyIdB] = router.query.currency || [
    WNATIVE[selectedChainId]?.symbol,
    brewsToken[selectedChainId]?.address || usdToken[selectedChainId]?.address,
  ];
  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Manage your liquidity with the <WordHighlight content="Brewlabs" /> Constructor.
            <div className="whitespace-wrap mt-5 text-xl font-normal sm:whitespace-nowrap">
              Add or remove liquidity from a number of routers free from any token tax fees.
            </div>
          </>
        }
      />
      <Container className="font-brand overflow-hidden">
        <div className="relative mx-auto mb-4 flex w-fit min-w-[90%] max-w-[660px] flex-col gap-1 rounded-3xl border-t px-4 pb-10 pt-4 dark:border-slate-600 dark:bg-zinc-900 sm:min-w-[540px] sm:px-10 md:mx-0">
          <div className="mt-2 text-2xl text-white">Liquidity Constructor</div>
          <a
            className="mt-9 flex cursor-pointer items-center justify-center rounded-[30px] border border-[#FFFFFF80] text-[#FFFFFFBF] transition hover:text-white"
            target="_blank"
            href={getExplorerLink(selectedChainId, "address", getLpManagerAddress(selectedChainId))}
            rel="noreferrer"
          >
            <div className="flex w-full items-start justify-between p-[16px_12px_16px_12px] sm:p-[16px_40px_16px_40px]">
              <div className="mt-2 scale-150 text-white">
                <InfoSVG />
              </div>
              <div className="ml-4 flex-1 text-sm xsm:ml-6">
                Important message to project owners: To ensure tax-free liquidity token creation for users of this
                constructor, please whitelist the following address
              </div>
            </div>
          </a>

          <AddLiquidityPanel
            onBack={() => router.back()}
            fetchLPTokens={fetchLPTokens}
            selectedChainId={chainId}
            currencyA={currencyA}
            currencyB={currencyB}
          />
        </div>
      </Container>
    </PageWrapper>
  );
};

AddLiquidityPage.chains = PAGE_SUPPORTED_CHAINS["swap"];

export default AddLiquidityPage;
