import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMessage } from '@/contexts/useMessage'
import { MessageProvider } from '@/providers/MessageProvider/MessageProvider'

function ShowButton() {
  const { showMessage } = useMessage()
  return (
    <button onClick={() => showMessage('Site publicado.', { tone: 'success' })}>
      Show
    </button>
  )
}

// jsdom has no AnimationEvent, so React listens for the prefixed name.
function endAnimation(element: HTMLElement) {
  act(() => {
    element.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true }))
  })
}

function UpdateButton({ onPress }: { onPress: () => void }) {
  const { showMessage } = useMessage()
  return (
    <button
      onClick={() =>
        showMessage('A new version is available.', {
          persistent: true,
          action: { label: 'Update', onPress },
        })
      }
    >
      Notify
    </button>
  )
}

function PendingButton({ onPress }: { onPress: () => Promise<unknown> }) {
  const { showMessage } = useMessage()
  return (
    <button
      onClick={() =>
        showMessage('A new version is available.', {
          persistent: true,
          action: { label: 'Update', pendingLabel: 'Updating', onPress },
        })
      }
    >
      Notify
    </button>
  )
}

function renderPending(onPress: () => Promise<unknown>) {
  render(
    <MessageProvider>
      <PendingButton onPress={onPress} />
    </MessageProvider>
  )
}

function renderProvider() {
  return render(
    <MessageProvider>
      <ShowButton />
    </MessageProvider>
  )
}

describe('MessageProvider', () => {
  it('announces the message in a polite live region', async () => {
    renderProvider()

    await userEvent.click(screen.getByRole('button', { name: 'Show' }))

    expect(screen.getByRole('status')).toHaveTextContent('Site publicado.')
  })

  it('removes the message once its leave animation ends', async () => {
    renderProvider()
    await userEvent.click(screen.getByRole('button', { name: 'Show' }))
    const message = screen.getByText('Site publicado.').parentElement!

    endAnimation(message)
    expect(screen.getByText('Site publicado.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    endAnimation(message)

    expect(screen.queryByText('Site publicado.')).not.toBeInTheDocument()
  })

  it('keeps a persistent message up and runs its action', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const onPress = vi.fn()
    render(
      <MessageProvider>
        <UpdateButton onPress={onPress} />
      </MessageProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Notify' }))
    act(() => vi.advanceTimersByTime(10_000))
    await userEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(screen.getByText('A new version is available.')).toBeInTheDocument()
    expect(onPress).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('shows the action as in progress until the work is done', async () => {
    renderPending(() => new Promise(() => {}))

    await userEvent.click(screen.getByRole('button', { name: 'Notify' }))
    await userEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(screen.getByRole('button', { name: 'Updating' })).toBeDisabled()
  })

  it('lets the action be pressed again when it fails', async () => {
    renderPending(() => Promise.reject(new Error('sem rede')))

    await userEvent.click(screen.getByRole('button', { name: 'Notify' }))
    await userEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(await screen.findByRole('button', { name: 'Update' })).toBeEnabled()
  })
})
