import { useRouter } from 'next/router'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useDeferredValue } from 'react'
import { useNetwork } from 'wagmi'

import { bsc } from 'contexts/wagmi'
import { isChainSupported } from 'utils/wagmi'

const queryChainIdAtom = atom(-1) // -1 unload, 0 no chainId on query
const sessionChainIdAtom = atom<number>(0)

queryChainIdAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams
  const c = params.get('chainId') ?? "0"
  if (isChainSupported(+c)) {
    set(+c)
  } else {
    set(0)
  }
}

export function useLocalNetworkChain() {
  const [sessionChainId] = useSessionChainId()
  // useRouter is kind of slow, we only get this query chainId once
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { query } = useRouter()

  const chainId = +(sessionChainId || query.chainId || queryChainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useSessionChainId = () => {
  return useAtom(sessionChainIdAtom)
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { chain } = useNetwork()
  const chainId = localChainId ?? chain?.id ?? (queryChainId >= 0 ? bsc.id : -1)

  const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId)

  return {
    chainId,
    isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
    isNotMatched,
  }
}
