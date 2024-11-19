import { BalanceModel } from '@/types/appwrite.types'
import { create } from 'zustand'

export const useBalanceStore = create(set => ({
  balanceRows: null,
  setBalanceRows: (rows: BalanceModel[]) =>
    set((state: any) => ({ balanceRows: rows })),
}))
