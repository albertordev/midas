import { BudgetModel } from '@/types/appwrite.types'
import { create } from 'zustand'

export const useBudgetActionStore = create(set => ({
  rowDeleted: false,
  rowUpdated: false,
  currentBudget: null,
  setRowDeleted: (deleteRow: boolean) =>
    set((state: any) => ({ rowDelete: (state.rowDeleted = deleteRow) })),
  setRowUpdated: (updateRow: boolean) =>
    set((state: any) => ({ rowUpdated: (state.rowUpdated = updateRow) })),
  updateCurrentBudget: (budget: BudgetModel) =>
    set((state: any) => ({ currentBudget: budget })),
}))
