import { useEffect } from 'react'
import { useMessage } from '@/contexts/useMessage'
import { registerServiceWorker } from '@/utils/registerServiceWorker/registerServiceWorker'

export function ServiceWorkerUpdatePrompt() {
  const { showMessage } = useMessage()

  useEffect(() => {
    registerServiceWorker((applyUpdate) =>
      showMessage('A new version is available.', {
        persistent: true,
        action: {
          label: 'Update',
          pendingLabel: 'Updating',
          onPress: applyUpdate,
        },
      })
    )
  }, [showMessage])

  return null
}
