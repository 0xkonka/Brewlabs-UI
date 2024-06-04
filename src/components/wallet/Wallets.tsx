// import Button from "@components/Button";
import React from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import Image from 'next/image';
import { WalletIcon } from 'lucide-react';

import { WalletConnectButton, WalletDisconnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';

import solanaLogo from '../../../public/images/networks/Solana_logo.png'

const Wallets = () => {
    const { wallet, publicKey, connecting, connected } = useWallet();

    const truncatedAddress = (address: string) =>
        `${address.substring(0, 8)}...${address.substring(address.length - 4)}`;

    return (
        <>
            {!wallet ?
                <WalletModalButton className='group block w-full flex-shrink-0'>
                    <div className="flex items-center">
                        <div className="relative shrink-0 p-2">
                            <div className="absolute inset-0 m-auto h-8 w-8 animate-ping rounded-full border-2 border-brand"></div>
                            <WalletIcon className="inline-block h-6 w-6 rounded-full text-yellow-200" />
                        </div>

                        <div className="ml-3">
                            <p className="whitespace-nowrap text-sm font-medium text-gray-700 group-hover:text-gray-500">
                                {connected ? `Connecting wallet` : `Connect wallet`}
                            </p>
                            <p className="whitespace-nowrap text-sm font-medium text-gray-500 group-hover:text-gray-400">
                                Connect to interact
                            </p>
                        </div>
                    </div>
                </WalletModalButton> :
                !connected ?
                    <WalletConnectButton className='group block w-full flex-shrink-0'>
                        <div className="flex items-center">
                            <div className="relative shrink-0">
                                <Image
                                    src={wallet?.adapter.icon}
                                    alt="Wallet Logo"
                                    width={70}
                                    height={70}
                                    className='inline-block rounded-full'
                                    style={{ marginLeft: -30 }}
                                />
                            </div>
                            <div className="ml-1">
                                <p className="whitespace-nowrap text-sm font-medium text-gray-700 group-hover:text-gray-500">
                                    {connected ? `Connecting wallet` : `Connect wallet`}
                                </p>
                                <p className="whitespace-nowrap text-sm font-medium text-gray-500 group-hover:text-gray-400">
                                    Connect to interact
                                </p>
                            </div>
                        </div>
                    </WalletConnectButton> :
                    <WalletDisconnectButton className='group block w-full flex-shrink-0'>
                        <div className="flex items-center">
                            <div className="relative shrink-0">
                                <Image
                                    src={solanaLogo}
                                    alt="Solana Logo"
                                    width={70}
                                    height={70}
                                    className='inline-block rounded-full'
                                    style={{ marginLeft: -30 }}
                                />
                            </div>
                            <div className="ml-1">
                                <p className="truncate text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100">
                                    {connecting ? "..." : truncatedAddress(publicKey.toString())}
                                </p>
                                <p className="whitespace-nowrap text-left text-sm font-medium">
                                    <span className={"text-slate-400"}>Solana</span>
                                </p>
                            </div>
                        </div>
                    </WalletDisconnectButton>
            }
        </>
    )
};


export default Wallets;