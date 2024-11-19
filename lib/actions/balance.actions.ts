'use server'

import * as sdk from 'node-appwrite'

import {
  AuthResponse,
  Balance,
  BalanceFiltersParams,
  SortedBalanceParams,
} from '@/types'
import { Query } from 'node-appwrite'
import { BalanceModel } from '@/types/appwrite.types'
import { ID } from 'node-appwrite'

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_BALANCE_COLLECTION_ID,
  APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT,
} = process.env

const client = new sdk.Client()

client
  .setEndpoint(APPWRITE_API_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!)

const databases = new sdk.Databases(client)

/** OBTENER LISTA DE SALDOS */
export const getBalances = async (balanceFilters: BalanceFiltersParams) => {
  const { userId, account, type, year, period } = balanceFilters

  const query: any = [Query.equal('userId', [userId])]
  if (account) query.push(Query.equal('account', [account]))
  if (type) query.push(Query.equal('type', [type]))
  if (year) query.push(Query.equal('year', [year]))
  if (period) query.push(Query.equal('period', [period]))
  try {
    const balance = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      query
    )
    if (balance.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const balanceData: BalanceModel[] = balance.documents as BalanceModel[]

    return {
      data: balanceData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      console.log(error)
      const errorCode = error?.code
      return {
        data: {
          message: 'Ha ocurrido un error al obtener los saldos',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** OBTENER LISTA DE SALDOS */
export const getSortedBalances = async (
  balanceFilters: SortedBalanceParams
) => {
  const { userId, account, type, year, period, sort, order } = balanceFilters

  const query: any = [Query.equal('userId', [userId])]
  account && query.push(Query.equal('account', [account]))
  type && query.push(Query.equal('type', [type]))
  year && query.push(Query.equal('year', [year]))
  period && query.push(Query.equal('period', [period]))
  if (sort && order) {
    if (order === 'asc') {
      query.push(Query.orderAsc(sort))
    } else {
      query.push(Query.orderDesc(sort))
    }
  }

  try {
    const balance = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      query
    )
    if (balance.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const balanceData: BalanceModel[] = balance.documents as BalanceModel[]

    return {
      data: balanceData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      console.log(error)
      const errorCode = error?.code
      return {
        data: {
          message: 'Ha ocurrido un error al obtener los saldos',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** CREAR SALDO */
export const createBalance = async (balance: Balance) => {
  const balanceToCreate = {
    userId: balance.userId,
    account: balance.account,
    accountName: balance.accountName,
    type: balance.type,
    period: balance.period,
    year: balance.year,
    amount: balance.amount,
  }
  try {
    const balanceCreated = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      ID.unique(),
      balanceToCreate
    )

    return {
      data: balanceCreated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: `Ha ocurrido un error al crear el registro de saldo. No se ha podido acumular la cantidad ${balanceToCreate}`,
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** MODIFICAR SALDO */
export const modifyBalance = async (balance: Balance) => {
  const balanceToUpdate = {
    userId: balance.userId,
    account: balance.account,
    accountName: balance.accountName,
    type: balance.type,
    period: balance.period,
    year: balance.year,
    amount: balance.amount,
  }
  try {
    const balanceUpdated = await databases.updateDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      balance.id,
      balanceToUpdate
    )

    return {
      data: balanceUpdated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: `Ha ocurrido un error al actualizar el saldo. No se ha podido acumular el importe ${balance.amount}`,
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** ELIMINAR SALDO */
export const deleteBalance = async (balanceId: string) => {
  try {
    const balanceDeleted = await databases.deleteDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      balanceId
    )

    return {
      data: balanceDeleted,
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
