import { useEffect } from 'react'
import { ConnectorData, useAccount } from 'wagmi'
import { clearUserStates } from 'utils/clearUserStates'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { setGlobalState, useAppDispatch } from '../state'
import { useActiveChainId } from './useActiveChainId'

export const useAccountEventListener = () => {
  const { address: account, connector } = useAccount()

  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleUpdateEvent = (e: ConnectorData<any>) => {
        if (e?.chain?.id && !(e?.chain?.unsupported ?? false)) {
          replaceBrowserHistory('chainId', e.chain.id)
          setGlobalState("sessionChainId", e.chain.id)
        }
        clearUserStates(dispatch, { chainId, newChainId: e?.chain?.id })
      }

      const handleDeactiveEvent = () => {
        clearUserStates(dispatch, { chainId })
      }

      connector.addListener('disconnect', handleDeactiveEvent)
      connector.addListener('change', handleUpdateEvent)

      return () => {
        connector.removeListener('disconnect', handleDeactiveEvent)
        connector.removeListener('change', handleUpdateEvent)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
