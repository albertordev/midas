'use server'

import * as sdk from 'node-appwrite'

import { AuthResponse, Balance, Budget, BudgetFiltersParams } from '@/types'
import { Query } from 'node-appwrite'
import { BudgetModel } from '@/types/appwrite.types'
import { ID } from 'node-appwrite'

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_BUDGET_COLLECTION_ID,
  APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT,
} = process.env

const client = new sdk.Client()

client
  .setEndpoint(APPWRITE_API_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!)

const databases = new sdk.Databases(client)

/** OBTENER LISTA DE PRESUPUESTOS */
export const getBudgets = async (userId: string) => {
  try {
    const budgets = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BUDGET_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )
    if (budgets.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const budgetsData: BudgetModel[] = budgets.documents as BudgetModel[]

    return {
      data: budgetsData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      return {
        data: {
          message: 'Ha ocurrido un error al obtener la lista de presupuestos',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** OBTENER LISTA DE PRESUPUESTOS CON FILTROS */
export const getFilteredBudget = async (budgetFilters: BudgetFiltersParams) => {
  const { userId, account, type, year, period } = budgetFilters

  const query: any = [Query.equal('userId', [userId])]
  if (account) query.push(Query.equal('account', [account]))
  if (type) query.push(Query.equal('type', [type]))
  if (year) query.push(Query.equal('year', [year]))
  if (period) query.push(Query.equal('period', [period]))
  try {
    const budget = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BUDGET_COLLECTION_ID!,
      query
    )
    if (budget.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const budgetData: BudgetModel[] = budget.documents as BudgetModel[]

    return {
      data: budgetData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      console.log(error)
      const errorCode = error?.code
      return {
        data: {
          message:
            'Ha ocurrido un error al obtener los registros de presupuestos',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** CREAR PRESUPUESTO */
export const createBudget = async (budget: Budget) => {
  const budgetToCreate = {
    userId: budget.userId,
    account: budget.account,
    accountName: budget.accountName,
    type: budget.type,
    period: budget.period,
    year: budget.year,
    amount: budget.amount,
  }
  try {
    const budgetCreated = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BUDGET_COLLECTION_ID!,
      ID.unique(),
      budgetToCreate
    )

    return {
      data: budgetCreated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: `Ha ocurrido un error al crear el registro de presupuestos`,
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** MODIFICAR PRESUPUESTO */
export const modifyBudget = async (budget: Budget) => {
  const budgetToUpdate = {
    userId: budget.userId,
    account: budget.account,
    accountName: budget.accountName,
    type: budget.type,
    period: budget.period,
    year: budget.year,
    amount: budget.amount,
  }
  try {
    const budgetUpdated = await databases.updateDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BUDGET_COLLECTION_ID!,
      budget.id,
      budgetToUpdate
    )

    return {
      data: budgetUpdated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: `Ha ocurrido un error al actualizar los registros de presupuestos`,
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** ELIMINAR SALDO */
export const deleteBudget = async (balanceId: string) => {
  try {
    const budgetDeleted = await databases.deleteDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BUDGET_COLLECTION_ID!,
      balanceId
    )

    return {
      data: budgetDeleted,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message:
            'Ha ocurrido un error al actualizar el saldo. No se ha podido acumular el importe',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

