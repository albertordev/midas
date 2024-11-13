import { MovementModel } from '@/types/appwrite.types'
import { create } from 'zustand'

export const useMovementActionStore = create(set => ({
  rowDeleted: false,
  rowUpdated: false,
  currentMovement: null,
  setRowDeleted: (deleteRow: boolean) =>
    set((state: any) => ({ rowDelete: (state.rowDeleted = deleteRow) })),
  setRowUpdated: (updateRow: boolean) =>
    set((state: any) => ({ rowUpdated: (state.rowUpdated = updateRow) })),
  updateCurrentMovement: (movement: MovementModel) =>
    set((state: any) => ({ currentMovement: movement })),
}))

export const useHistoryStore = create(set => ({
  historyRows: null,
  setHistoryList: (rows: MovementModel[]) =>
    set((state: any) => ({ historyRows: rows })),
}))
