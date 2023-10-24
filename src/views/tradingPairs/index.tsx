import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { useEffect, useState } from "react";
import PairList from "./PairList";
import { useRouter } from "next/router";
import ChartPanel from "./ChartPanel";
import { useTradingAllPairDatas, useTradingAllPairs } from "state/pair/hooks";
import { ChainId } from "@brewlabs/sdk";

export default function Info() {
  const [criteria, setCriteria] = useState("");
  const [selectedPair, setSelectedPair] = useState({});
  const [wrappedPairs, setWrappedPairs] = useState([]);

  useTradingAllPairs(ChainId.POLYGON);
  const pairs = useTradingAllPairDatas(ChainId.POLYGON);

  const stringifiedPairs = JSON.stringify(pairs);

  useEffect(() => {
    if (!pairs.length) return;
    setSelectedPair(Object.keys(selectedPair).length ? selectedPair : pairs[0]);
  }, [pairs.length]);

  useEffect(() => {
    setWrappedPairs(
      pairs.map(
        (pair) =>
          pair.address.toLowerCase().includes(criteria) ||
          pair.baseToken.address.toLowerCase().includes(criteria) ||
          pair.baseToken.symbol.toLowerCase().includes(criteria) ||
          pair.quoteToken.address.toLowerCase().includes(criteria) ||
          pair.quoteToken.symbol.toLowerCase().includes(criteria)
      )
    );
  }, [stringifiedPairs, criteria]);

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Exchange tokens at the <WordHighlight content="best" /> rate on the market.
          </>
        }
      />
      <Container className="font-brand">
        <div className="-mt-4 mb-10">
          <div className="text-xl text-primary">BrewSwap pools</div>
          <div className="mt-2 text-sm">
            Observe the volume and fee collection from various liquidity pools across the BrewSwap decentralised
            exchange. Users can easily join pools and start earning a portion of fee revenue by using the “join pool”
            feature. Fee revenue is generated from swap, bridge and index volume and is distributed to users who supply
            liquidity instantly.
          </div>
        </div>
        <ChartPanel pair={selectedPair} />
        <input
          type={"text"}
          placeholder="Search pair, token, symbol..."
          className="primary-shadow leading-1.2 focusShadow w-full rounded border-none bg-[#29292C] p-2.5 font-brand text-sm font-bold text-white"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
        <div className="mb-10 mt-5">
          <PairList pairs={wrappedPairs} setSelectedPair={setSelectedPair} />
        </div>
      </Container>
    </PageWrapper>
  );
}
