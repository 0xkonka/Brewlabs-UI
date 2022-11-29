import { useEffect, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { simpleRpcProvider } from 'utils/providers'
import { DEFAULT_CHAIN_ID } from 'config/constants'
import { SUPPORTED_CHAIN_IDS } from 'config/constants/networks'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { library, chainId: connectedChainId, ...web3React } = useWeb3React()
  const refEth = useRef(library)
  const metamaskChainId = window.ethereum?.chainId

  const [provider, setProvider] = useState(library)
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID)

  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library)
      refEth.current = library
    }

    if (connectedChainId && SUPPORTED_CHAIN_IDS.includes(connectedChainId)) {
      setChainId(connectedChainId)
      localStorage.setItem('chainId', connectedChainId.toString())
    }

    if (!connectedChainId && chainId !== +metamaskChainId && SUPPORTED_CHAIN_IDS.includes(+metamaskChainId)) {
      localStorage.setItem('chainId', metamaskChainId.toString())
      setChainId(+metamaskChainId)
      setProvider(simpleRpcProvider(+metamaskChainId))
    }
  }, [library, chainId, connectedChainId, metamaskChainId])

  return {
    library: provider,
    chainId: chainId ?? DEFAULT_CHAIN_ID,
    ...web3React
  }
}

export default useActiveWeb3React
