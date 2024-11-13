import { User } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: {},
      saveUser: (newUser: User) => set({ ...newUser }),
    }),
    { name: 'midas-user' }
  )
)
