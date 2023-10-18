import { useCallback, useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { Address, parseAbi } from "viem";
import { useAccount } from "wagmi";

import { useActiveChainId } from "hooks/useActiveChainId";
import { getViemClients } from "utils/viem";

import { useBridgeDirection } from "./useBridgeDirection";
import { getContract } from "utils/contractHelpers";

export const useMediatorInfo = () => {
  const { address: account } = useAccount();
  const { chainId: providerChainId } = useActiveChainId();

  const {
    version: bridgeVersion,
    homeChainId,
    homeMediatorAddress,
    foreignChainId,
    foreignMediatorAddress,
  } = useBridgeDirection();

  const [currentDay, setCurrentDay] = useState<string>();
  const [homeFeeManagerAddress, setHomeFeeManagerAddress] = useState<Address>();
  const [foreignFeeManagerAddress, setForeignFeeManagerAddress] = useState<Address>();
  const [fetching, setFetching] = useState(false);
  const [isRewardAddress, setRewardAddress] = useState(false);

  const [homeToForeignFeeType, setHomeToForeignFeeType] = useState(
    "0x741ede137d0537e88e0ea0ff25b1f22d837903dbbee8980b4a06e8523247ee26"
  );
  const [foreignToHomeFeeType, setForeignToHomeFeeType] = useState(
    "0x03be2b2875cb41e0e77355e802a16769bb8dfcf825061cde185c73bf94f12625"
  );

  const calculateFees = useCallback(async (address: Address, chainId: ChainId) => {
    const client = getViemClients({ chainId });
    const abi = parseAbi([
      "function FOREIGN_TO_HOME_FEE() view returns (bytes32)",
      "function HOME_TO_FOREIGN_FEE() view returns (bytes32)",
    ]);

    const [{ result: home }, { result: foreign }] = await client.multicall({
      contracts: [
        { abi, address, functionName: "FOREIGN_TO_HOME_FEE" },
        { abi, address, functionName: "HOME_TO_FOREIGN_FEE" },
      ],
    });

    setForeignToHomeFeeType(home);
    setHomeToForeignFeeType(foreign);
  }, []);

  const checkRewardAddress = useCallback(
    async (address: Address, chainId: ChainId) => {
      if (!account) {
        setRewardAddress(false);
        return;
      }

      const client = getViemClients({ chainId });
      const abi = parseAbi(["function isRewardAddress(address) view returns (bool)"]);
      const is = await client.readContract({ address, abi, functionName: "isRewardAddress", args: [account] });

      setRewardAddress(is);
    },
    [account]
  );

  useEffect(() => {
    const processMediatorData = async () => {
      try {
        setFetching(true);
        const abi = parseAbi([
          "function getCurrentDay() external view returns (uint256)",
          "function feeManager() external view returns (address)",
          "function getBridgeInterfacesVersion() external pure returns (uint64, uint64, uint64)",
        ]);

        const homeClient = getViemClients({ chainId: homeChainId });
        const [{ result: versionArray }, { result: day }] = await homeClient.multicall({
          contracts: [
            { abi, address: homeMediatorAddress as Address, functionName: "getBridgeInterfacesVersion" },
            { abi, address: homeMediatorAddress as Address, functionName: "getCurrentDay" },
          ],
        });

        setCurrentDay(day.toString());

        const version = versionArray.map((v: any) => v.toString()).join(".");
        let homeManagerAddress: any = homeMediatorAddress;
        if (version >= "2.1.0") {
          const homeMediatorContract = getContract(homeChainId, homeMediatorAddress, abi);
          homeManagerAddress = await homeMediatorContract.read.feeManager([]);
        }

        setHomeFeeManagerAddress(homeManagerAddress);

        let foreignManagerAddress;
        if (bridgeVersion) {
          const foreignMediatorContract = getContract(foreignChainId, foreignMediatorAddress, abi);
          foreignManagerAddress = await foreignMediatorContract.read.feeManager([]);
          setForeignFeeManagerAddress(foreignManagerAddress);
        } else {
          foreignManagerAddress = homeFeeManagerAddress;
          setForeignFeeManagerAddress(homeManagerAddress);
        }

        await Promise.all([
          checkRewardAddress(
            providerChainId === homeChainId || !bridgeVersion ? homeManagerAddress : foreignManagerAddress,
            providerChainId === homeChainId || !bridgeVersion ? homeChainId : foreignChainId
          ),
          calculateFees(homeManagerAddress, homeChainId),
        ]);
      } catch (error) {
        console.error("Error fetching mediator info:", error);
      } finally {
        setFetching(false);
      }
    };
    processMediatorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeMediatorAddress, homeChainId, calculateFees, checkRewardAddress]);

  return {
    fetching,
    currentDay,
    homeFeeManagerAddress,
    foreignFeeManagerAddress,
    isRewardAddress,
    homeToForeignFeeType,
    foreignToHomeFeeType,
  };
};
