import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types'

interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (userId: string, name: string, email: string) => Promise<void>
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? 'Login failed')
        }
        const { user } = await res.json()
        set({ user, isAuthenticated: true })
      },

      register: async (name, email, password) => {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? 'Registration failed')
        }
        const { user } = await res.json()
        set({ user, isAuthenticated: true })
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: async (userId, name, email) => {
        const res = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, name, email }),
        })
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? 'Update failed')
        }
        const { user } = await res.json()
        set({ user })
      },

      changePassword: async (userId, currentPassword, newPassword) => {
        const res = await fetch('/api/user/password', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, currentPassword, newPassword }),
        })
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? 'Password change failed')
        }
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)
