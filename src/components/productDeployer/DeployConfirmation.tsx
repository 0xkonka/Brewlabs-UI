import { useState } from "react";
import { formatEther } from "viem";
// import { useNetwork } from "wagmi";
import { Info, Loader2, Pen } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";

import { getNativeSymbol } from "lib/bridge/helpers";
import { useTokenFactory } from "state/deploy/hooks";
import { useFactory } from "hooks/useFactory";
import { useActiveChainId } from "hooks/useActiveChainId";
import TokenFactoryAbi from "config/abi/token/factory.json";
import { useDeployerState, setDeployedAddress, setDeployerStep } from "state/deploy/deployer.store";
import TokenSummary from "components/productDeployer/TokenSummary";
import { ChainId } from "@brewlabs/sdk";

///Solana
import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';
import * as web3 from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  MINT_SIZE,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMintInstruction,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  ExtensionType,
  createInitializeMetadataPointerInstruction,
  createInitializeNonTransferableMintInstruction,
  createUpdateAuthorityInstruction,
  createSetAuthorityInstruction,
  setAuthority,
  getMintLen,
  AuthorityType,
} from '@solana/spl-token';
import {
  PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

const DeployConfirmation = () => {
  // const { chain } = useNetwork();

  const { chainId, isLoading } = useActiveChainId();
  const { connection } = useConnection();

  const { publicKey: walletPublicKey, sendTransaction } = useWallet();
  const wallet = useWallet();
  wallet.connect()

  const [isDeploying, setIsDeploying] = useState(false);

  const [{
    tokenName,
    tokenImage,
    tokenDescription,
    tokenSymbol,
    tokenDecimals,
    tokenTotalSupply,
    tokenImmutable,
    tokenRevokeFreeze,
    tokenRevokeMint
  }] = useDeployerState("tokenInfo");

  console.log(useDeployerState("tokenInfo"))

  const factory = useTokenFactory(chainId);

  // const { onCreate } = useFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");

  // const handleDeploy = async () => {
  //   setIsDeploying(true);

  //   try {
  //     // Deploy farm contract
  //     const tx = await onCreate(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply.toString());

  //     const iface = new ethers.utils.Interface(TokenFactoryAbi);

  //     for (let i = 0; i < tx.logs.length; i++) {
  //       try {
  //         const log = iface.parseLog(tx.logs[i]);
  //         if (log.name === "StandardTokenCreated") {
  //           const token = log.args.token;
  //           setDeployedAddress(token);
  //           setDeployerStep("success");
  //           break;
  //         }
  //       } catch (e) {}
  //     }
  //   } catch (e) {
  //     toast.error("Error deploying token contract");
  //   }
  //   setIsDeploying(false);
  // };

  const handleDeploy = async () => {
    // setTimeout(() => {
    //   setDeployedAddress("0x1234");
    //   setDeployerStep("success");
    // }, 1000);
    console.log("chainId", chainId)
    if (chainId === (900 as ChainId) || chainId === (901 as ChainId)) {
      deployTokenSolana();
      return;
    }
    else {
      deployTokenEVM();
      return;
    }
    console.log("unsupported chain")
  };

  // const deployTokenSolana = useCallback(async () => {
  //   // Generate new keypair for Mint Account
  //   const mintKeypair = Keypair.generate();
  //   // Address for Mint Account
  //   const mint = mintKeypair.publicKey;
  //   // Authority that can mint new tokens
  //   const mintAuthority = walletPublicKey;

  //   const tokenATA = await getAssociatedTokenAddressSync(mintKeypair.publicKey, walletPublicKey, false, TOKEN_2022_PROGRAM_ID);

  //   // Metadata to store in Mint Account
  //   const metaData: TokenMetadata = {
  //     updateAuthority: walletPublicKey,
  //     mint: mint,
  //     name: "OPOS",
  //     symbol: "OPOS",
  //     uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  //     additionalMetadata: [
  //       ["description", "Only Possible On Solana"]
  //     ],
  //   };

  //   // Size of MetadataExtension 2 bytes for type, 2 bytes for length
  //   const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
  //   // Size of metadata
  //   const metadataLen = pack(metaData).length;

  //   // Size of Mint Account with extension
  //   const mintLenNT = getMintLen([ExtensionType.NonTransferable]);
  //   const mintLenMP = getMintLen([ExtensionType.MetadataPointer]);
  //   const mintLen = mintLenNT + mintLenMP

  //   // Minimum lamports required for Mint Account
  //   const lamports = await connection.getMinimumBalanceForRentExemption(
  //     mintLen + metadataExtension + metadataLen
  //   );

  //   // Instruction to invoke System Program to create new account
  //   const createAccountInstruction = SystemProgram.createAccount({
  //     fromPubkey: walletPublicKey, // Account that will transfer lamports to created account
  //     newAccountPubkey: mint, // Address of the account to create
  //     space: mintLen, // Amount of bytes to allocate to the created account
  //     lamports, // Amount of lamports transferred to created account
  //     programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
  //   });

  //   // Instruction to initialize the MetadataPointer Extension
  //   const initializeMetadataPointerInstruction =
  //     createInitializeMetadataPointerInstruction(
  //       mint, // Mint Account address
  //       walletPublicKey, // Authority that can set the metadata address
  //       mint, // Account address that holds the metadata
  //       TOKEN_2022_PROGRAM_ID
  //     );

  //   // Instruction to initialize the NonTransferable Extension
  //   const initializeNonTransferableMintInstruction =
  //     createInitializeNonTransferableMintInstruction(
  //       mint, // Mint Account address
  //       TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  //     );

  //   // Instruction to initialize Mint Account data
  //   const initializeMintInstruction = createInitializeMintInstruction(
  //     mint, // Mint Account Address
  //     tokenDecimals, // Decimals of Mint
  //     mintAuthority, // Designated Mint Authority
  //     walletPublicKey, // Optional Freeze Authority
  //     TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  //   );

  //   // Instruction to initialize Metadata Account data
  //   const initializeMetadataInstruction = createInitializeInstruction({
  //     programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  //     metadata: mint, // Account address that holds the metadata
  //     updateAuthority: walletPublicKey, // Authority that can update the metadata
  //     mint: mint, // Mint Account address
  //     mintAuthority: mintAuthority, // Designated Mint Authority
  //     name: metaData.name,
  //     symbol: metaData.symbol,
  //     uri: metaData.uri,
  //   });

  //   // Instruction to update metadata, adding custom field
  //   // const updateFieldInstruction = createUpdateFieldInstruction({
  //   //   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  //   //   metadata: mint, // Account address that holds the metadata
  //   //   updateAuthority: updateAuthority, // Authority that can update the metadata
  //   //   field: metaData.additionalMetadata[0][0], // key
  //   //   value: metaData.additionalMetadata[0][1], // value
  //   // });

  //   const associatedTokenAccountInstruction = createAssociatedTokenAccountInstruction(
  //     walletPublicKey,
  //     tokenATA,
  //     walletPublicKey,
  //     mintKeypair.publicKey,
  //     TOKEN_2022_PROGRAM_ID
  //   );

  //   const mintToInstruction = createMintToInstruction(
  //     mintKeypair.publicKey,
  //     tokenATA,
  //     walletPublicKey,
  //     tokenTotalSupply * Math.pow(10, tokenDecimals),
  //     undefined,
  //     TOKEN_2022_PROGRAM_ID
  //   );

  //   // Add instructions to new transaction
  //   const transaction = new Transaction().add(
  //     createAccountInstruction,
  //     initializeMetadataPointerInstruction,
  //     initializeNonTransferableMintInstruction,
  //     initializeMintInstruction,
  //     initializeMetadataInstruction,
  //     associatedTokenAccountInstruction,
  //     mintToInstruction,
  //     // createMetadataInstruction
  //   );

  //   // Send transaction
  //   // const transactionSignature = await sendAndConfirmTransaction(
  //   //   connection,
  //   //   transaction,
  //   //   [payer, mintKeypair], // Signers
  //   // );

  //   // console.log(
  //   //   "\nCreate Mint Account:",
  //   //   `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  //   // );

  //   // createNewTokenTransaction.feePayer = publicKey
  //   // let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
  //   // console.log("blockhash", blockhash)
  //   // createNewTokenTransaction.recentBlockhash = blockhash;
  //   console.log("NT transation", transaction)
  //   // return;
  //   const signature = await sendTransaction(transaction, connection, { signers: [mintKeypair] });

  //   console.log(
  //     "\nCreate Mint Account:",
  //     `https://solana.fm/tx/${signature}?cluster=devnet-solana`
  //   );
  // }, [walletPublicKey, connection, sendTransaction]);

  const deployTokenSolana = useCallback(async () => {
    // Generate new keypair for Mint Account
    const mintKeypair = Keypair.generate();
    // Address for Mint Account
    const mint = mintKeypair.publicKey;
    // Authority that can mint new tokens
    const mintAuthority = walletPublicKey;
    // Authority that can update token metadata
    const updateAuthority = tokenImmutable ? null : walletPublicKey;
    // const updateAuthority = walletPublicKey;
    // Authority that can freeze token account
    const freezeAuthority = tokenRevokeFreeze ? null : walletPublicKey;
    // const freezeAuthority = walletPublicKey;

    const tokenATA = await getAssociatedTokenAddressSync(mintKeypair.publicKey, walletPublicKey, false, TOKEN_2022_PROGRAM_ID);

    // Metadata to store in Mint Account
    const metaData: TokenMetadata = {
      updateAuthority: updateAuthority,
      mint: mint,
      name: tokenName,
      symbol: tokenSymbol,
      uri: "",
      additionalMetadata: [
        ["description", tokenDescription]
      ],
    };

    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    // Size of metadata
    const metadataLen = pack(metaData).length;

    // Size of Mint Account with extension
    const mintLen = getMintLen([
      ExtensionType.MetadataPointer,
      // ExtensionType.TokenMetadata,
      // ExtensionType.NonTransferable,
    ]);

    // Minimum lamports required for Mint Account
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataExtension + metadataLen
    );

    // Instruction to invoke System Program to create new account
    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: walletPublicKey, // Account that will transfer lamports to created account
      newAccountPubkey: mint, // Address of the account to create
      lamports, // Amount of lamports transferred to created account
      space: mintLen, // Amount of bytes to allocate to the created account
      programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
    });

    // Instruction to initialize the MetadataPointer Extension
    const initializeMetadataPointerInstruction =
      createInitializeMetadataPointerInstruction(
        mint, // Mint Account address
        updateAuthority, // Authority that can set the metadata address
        mint, // Account address that holds the metadata
        TOKEN_2022_PROGRAM_ID
      );

    // Instruction to initialize Mint Account data
    const initializeMintInstruction = createInitializeMint2Instruction(
      mint, // Mint Account Address
      tokenDecimals, // Decimals of Mint
      mintAuthority, // Designated Mint Authority
      freezeAuthority, // Optional Freeze Authority (default: null)
      TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
    );

    // Instruction to initialize Metadata Account data
    const initializeMetadataInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: walletPublicKey, // Authority that can update the metadata
      mint: mint, // Mint Account address
      mintAuthority: mintAuthority, // Designated Mint Authority
      name: metaData.name,
      symbol: metaData.symbol,
      uri: metaData.uri,
    });

    // Instruction to update metadata, adding custom field
    const updateFieldInstruction = createUpdateFieldInstruction({
      programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
      metadata: mint, // Account address that holds the metadata
      updateAuthority: walletPublicKey, // Authority that can update the metadata
      field: metaData.additionalMetadata[0][0], // key
      value: metaData.additionalMetadata[0][1], // value
    });

    const associatedTokenAccountInstruction = createAssociatedTokenAccountInstruction(
      walletPublicKey,
      tokenATA,
      walletPublicKey,
      mint,
      TOKEN_2022_PROGRAM_ID
    );

    const mintToInstruction = createMintToInstruction(
      mint,
      tokenATA,
      walletPublicKey,
      tokenTotalSupply * Math.pow(10, tokenDecimals),
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    const updateAuthorityInstruction = createUpdateAuthorityInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mint,
      oldAuthority: walletPublicKey,
      newAuthority: null,
    })

    const setAuthorityInstruction = createSetAuthorityInstruction(
      mint, // account
      walletPublicKey, // current authority
      AuthorityType.MintTokens, // 'FreezeAccount' for freeze authority
      null, // new authority
      [], // signers
      TOKEN_2022_PROGRAM_ID // program id
    )

    // Add instructions to new transaction
    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      // note: the above instructions are required before initializing the mint
      initializeMintInstruction,
      initializeMetadataInstruction,
      updateFieldInstruction,
      associatedTokenAccountInstruction,
      mintToInstruction,
    );
    if (tokenRevokeMint == true)
      transaction.add(setAuthorityInstruction)

    if (tokenImmutable == true)
      transaction.add(updateAuthorityInstruction)

    // createNewTokenTransaction.feePayer = publicKey
    // let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
    // console.log("blockhash", blockhash)
    // createNewTokenTransaction.recentBlockhash = blockhash;
    console.log("NT transation", transaction)
    // return;
    const signature = await sendTransaction(transaction, connection, { signers: [mintKeypair] });

    console.log(
      "Transaction :",
      `https://solana.fm/tx/${signature}?cluster=devnet-solana`
    );
    console.log(
      "\nMint Account:",
      `https://solana.fm/address/${mint}?cluster=devnet-solana`
    );
  }, [walletPublicKey, connection, sendTransaction]);

  const deployTokenEVM = async () => {
    console.log("deploy EVM token");
  }

  return (
    <div className={`mx-auto my-8 max-w-xl ${isDeploying && "animate-pulse"}`}>
      {isDeploying && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-between rounded-3xl bg-zinc-900/40">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
        </div>
      )}

      <h4 className="mb-6 text-xl">Summary</h4>

      <p className="my-2">You are about to deploy a new token contract on the __insert name__ network.</p>
      <p className="my-2">Please confirm the details.</p>

      <TokenSummary />

      <div className="flex items-center justify-between p-4">
        <div className="font-bold text-gray-200">Total fee</div>
        <div className="font-bold text-brand">
          {/* {formatEther(BigInt(factory.serviceFee))} {getNativeSymbol(chainId)} */}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="button" onClick={() => setDeployerStep("details")} className="flex w-full items-center gap-2">
          Edit <Pen className="h-4 w-4" />
        </Button>

        {isLoading ?
          (
            <div>Loading</div>
          ) :
          (
            <Button type="button" onClick={() => handleDeploy()} variant="brand" className="w-full">
              Deploy
            </Button>
          )
        }
      </div>
    </div>
  );
};

export default DeployConfirmation;
