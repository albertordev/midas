import { AccountModel } from '@/types/appwrite.types'
import { create } from 'zustand'

export const useAccountActionStore = create(set => ({
  rowDeleted: false,
  rowUpdated: false,
  currentAccount: null,
  setRowDeleted: (deleteRow: boolean) =>
    set((state: any) => ({ rowDelete: (state.rowDeleted = deleteRow) })),
  setRowUpdated: (updateRow: boolean) =>
    set((state: any) => ({ rowUpdated: (state.rowUpdated = updateRow) })),
  updateCurrentAccount: (account: AccountModel) =>
    set((state: any) => ({ currentAccount: account })),
}))
