import { Suspense } from 'react'
// kit:if cloudflare-router
import { Navigate, Route } from 'react-router'
// kit:end
// kit:if !cloudflare-router
import { Route } from 'react-router'
// kit:end
import { AppLayout } from '@/layouts/AppLayout/AppLayout'
import { Home } from '@/pages/Home/Home'
import { NotFound } from '@/pages/NotFound/NotFound'
import { ItemsShell } from '@/pages/Items/components/ItemsShell/ItemsShell'
import { ItemsSkeleton } from '@/pages/Items/components/ItemsSkeleton/ItemsSkeleton'
import { Items } from '@/providers/RouterProvider/lazyPages'

export const appRoutes = (
  <Route Component={AppLayout}>
    <Route Component={Home} index />
    <Route
      element={
        <Suspense
          fallback={
            <ItemsShell>
              <ItemsSkeleton />
            </ItemsShell>
          }
        >
          <Items />
        </Suspense>
      }
      path='/items'
    />
    {/* kit:if cloudflare-router */}
    {/* The router Worker answers these; they reach the SPA only when it is bypassed. */}
    <Route element={<Navigate to='/' replace />} path='/r/*' />
    {/* kit:end */}
    <Route Component={NotFound} path='*' />
  </Route>
)
