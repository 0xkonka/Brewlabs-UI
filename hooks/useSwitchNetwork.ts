/* eslint-disable consistent-return */
import { ChainId } from '@brewlabs/sdk'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify';
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'

import { ConnectorNames } from 'config/constants/wallets';
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { useSessionChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetworkLocal() {
  const [, setSessionChainId] = useSessionChainId()
  return useCallback(
    (chainId: number) => {
      setSessionChainId(chainId)
      replaceBrowserHistory('chainId', chainId === ChainId.BSC_MAINNET ? null : chainId)
    },
    [setSessionChainId],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    switchNetworkAsync: _switchNetworkAsync,
    isLoading: _isLoading,
    switchNetwork: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchNetworkWallet()

  const { isConnected, connector } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()
  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && typeof _switchNetworkAsync === 'function') {
        if (isLoading) return
        setLoading(true)
        return _switchNetworkAsync(chainId)
          .then((c) => {
            // well token pocket
            if (window.ethereum?.isTokenPocket === true) {
              switchNetworkLocal(chainId)
              window.location.reload()
            }
            return c
          })
          .catch(() => {
            // TODO: review the error
            toast.error('Error connecting, please retry and confirm in wallet!')
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {
        switchNetworkLocal(chainId)
      })
    },
    [isConnected, _switchNetworkAsync, isLoading, setLoading, switchNetworkLocal],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork(chainId)
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          connector?.id !== ConnectorNames.WalletConnect &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            (window.ethereum?.isSafePal || window.ethereum?.isMathWallet)
          )
        : true,
    [_switchNetworkAsync, isConnected, connector],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
