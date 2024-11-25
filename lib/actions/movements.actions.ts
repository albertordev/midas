'use server'

import * as sdk from 'node-appwrite'

import { AuthResponse, Balance, HistoryFiltersParams, Movement } from '@/types'
import { Query } from 'node-appwrite'
import { ID } from 'node-appwrite'
import { MovementModel } from '@/types/appwrite.types'
import { createBalance, deleteBalance, modifyBalance } from './balance.actions'

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_MOVEMENTS_COLLECTION_ID,
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

/** OBTENER LISTA DE MOVIMIENTOS */
export const getMovements = async (userId: string) => {
  try {
    const movements = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )
    if (movements.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const movementsData: MovementModel[] =
      movements.documents as MovementModel[]

    return {
      data: movementsData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      return {
        data: {
          message: 'Ha ocurrido un error al obtener la lista de movimientos',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** CREAR NUEVO MOVIMIENTO */
export const createMovement = async (movement: Movement) => {
  const movementToCreate = {
    userId: movement.userId,
    account: movement.account,
    description: movement.description,
    type: movement.type,
    date: movement.date,
    amount: movement.amount,
  }
  let balance: Balance
  let balanceCreated: AuthResponse | undefined

  try {
    /** Primero buscamos si ya hay un registro de saldo con esa cuenta y fecha,
     *  para poder crearlo o acumular importes según el caso
     */
    const existingBalance = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      [
        Query.equal('userId', [movement.userId]),
        Query.equal('account', [movement.account]),
        Query.equal('period', [movement.date.getMonth() + 1]),
        Query.equal('year', [movement.date.getFullYear()]),
      ]
    )

    if (!existingBalance) {
      return {
        data: {
          message:
            'Ha ocurrido un error al obtener los registros de saldos de la cuenta.',
        },
        status: 500,
      } as AuthResponse
    }

    const movementCreated = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      ID.unique(),
      movementToCreate
    )

    if (!movementCreated) {
      return {
        data: {
          message: 'Ha ocurrido un error al crear el movimiento',
        },
        status: 500,
      } as AuthResponse
    }

    if (existingBalance.documents.length === 0) {
      balance = {
        id: '',
        userId: movement.userId,
        account: movement.account,
        accountName: movement.accountName,
        type: movement.type,
        period: movement.date.getMonth() + 1,
        year: movement.date.getFullYear(),
        amount: movement.amount,
      }
      balanceCreated = await createBalance(balance)
    } else {
      balance = {
        id: existingBalance.documents[0].$id,
        userId: movement.userId,
        account: movement.account,
        accountName: movement.accountName,
        type: movement.type,
        period: movement.date.getMonth() + 1,
        year: movement.date.getFullYear(),
        amount: existingBalance.documents[0].amount,
      }
      balance.amount += movement.amount
      balanceCreated = await modifyBalance(balance)
    }

    if (!balanceCreated || balanceCreated?.status !== 200) {
      return {
        data: {
          message: `Ha ocurrido un error al actualizar el saldo. No se ha podido acumular el importe ${movement.amount}`,
        },
        status: balanceCreated?.status ?? 500,
      } as AuthResponse
    }

    return {
      data: movementCreated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    console.log(error)

    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: 'Ha ocurrido un error al crear el movimiento',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** MODIFICAR MOVIMIENTO */
export const modifyMovement = async (movement: Movement) => {
  try {
    /** Primero buscamos si ya hay un registro de saldo con esa cuenta y fecha,
     *  para poder crearlo o acumular importes según el caso
     */
    const existingBalance = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      [
        Query.equal('userId', [movement.userId]),
        Query.equal('account', [movement.account]),
        Query.equal('period', [movement.date.getMonth() + 1]),
        Query.equal('year', [movement.date.getFullYear()]),
      ]
    )

    if (!existingBalance) {
      return {
        data: {
          message:
            'Ha ocurrido un error al obtener los registros de saldo de la cuenta.',
        },
        status: 500,
      } as AuthResponse
    }

    if (existingBalance.documents.length === 0) {
      return {
        data: {
          message: 'No hay registros de saldo para el movimiento seleccionado.',
        },
        status: 500,
      } as AuthResponse
    }

    /** Obtenemos el movimiento actual antes de modificarlo para recuperar su importe */
    const previousMovement = await databases.getDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      movement.id
    )

    if (!previousMovement) {
      return {
        data: {
          message: 'No se ha encontrado el movimiento seleccionado.',
        },
        status: 200,
      } as AuthResponse
    }
    const previousMovementAmount = previousMovement.amount

    const movementToUpdate = {
      userId: movement.userId,
      account: movement.account,
      description: movement.description,
      type: movement.type,
      date: movement.date,
      amount: movement.amount,
    }

    const movementUpdated = await databases.updateDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      movement.id,
      movementToUpdate
    )

    /** Actualizamos el saldo */
    const currentBalance = existingBalance.documents[0]

    const balance: Balance = {
      id: currentBalance.$id,
      userId: movement.userId,
      account: currentBalance.account,
      accountName: movement.accountName,
      type: currentBalance.type,
      period: currentBalance.period,
      year: currentBalance.year,
      amount: currentBalance.amount - previousMovementAmount + movement.amount,
    }
    const balanceCreated: AuthResponse | undefined =
      await modifyBalance(balance)

    if (!balanceCreated || balanceCreated?.status !== 200) {
      return {
        data: {
          message: `Ha ocurrido un error al actualizar el saldo. No se ha podido acumular el importe ${movement.amount}`,
        },
        status: balanceCreated?.status ?? 500,
      } as AuthResponse
    }

    return {
      data: movementUpdated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: 'Ha ocurrido un error al modificar el movimiento',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** ELIMINAR MOVIMIENTO */
export const deleteMovement = async (movementId: string) => {
  let auxResponse: AuthResponse | undefined
  try {
    const existingMovement = await databases.getDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      movementId
    )

    if (!existingMovement) {
      return {
        data: {
          message: 'No se ha encontrado el movimiento seleccionado.',
        },
        status: 200,
      } as AuthResponse
    }

    /** Buscamos si ya hay un registro de saldo con esa cuenta y fecha,
     *  para poder restar importes o eliminarlo si el importe es cero
     */
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BALANCE_COLLECTION_ID!,
      [
        Query.equal('userId', [existingMovement.userId]),
        Query.equal('account', [existingMovement.account]),
        Query.equal('period', [new Date(existingMovement.date).getMonth() + 1]),
        Query.equal('year', [new Date(existingMovement.date).getFullYear()]),
      ]
    )

    if (!response) {
      return {
        data: {
          message:
            'Ha ocurrido un error al obtener los registros de saldo de la cuenta.',
        },
        status: 500,
      } as AuthResponse
    }

    if (response.documents.length === 0) {
      return {
        data: {
          message: 'No hay registros de saldo para el movimiento seleccionado.',
        },
        status: 500,
      } as AuthResponse
    }

    const existingBalance = response.documents[0]

    const movementDeleted = await databases.deleteDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      existingMovement.$id
    )

    /** Actualizamos el saldo */
    if (existingBalance.amount <= existingMovement.amount) {
      /** Si el saldo es igual al movimiento eliminado, eliminamos el registro del saldo */
      await deleteBalance(existingBalance.$id)
    } else {
      const balance: Balance = {
        id: existingBalance.$id,
        userId: existingBalance.userId,
        account: existingBalance.account,
        accountName: existingBalance.accountName,
        type: existingBalance.type,
        period: existingBalance.period,
        year: existingMovement.year,
        amount: existingBalance.amount - existingMovement.amount,
      }
      auxResponse = await modifyBalance(balance)

      if (!auxResponse || auxResponse?.status !== 200) {
        return {
          data: {
            message: `Ha ocurrido un error al actualizar el saldo. No se ha podido acumular el importe ${existingMovement.amount}`,
          },
          status: auxResponse?.status ?? 500,
        } as AuthResponse
      }
    }

    return {
      data: movementDeleted,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: 'Ha ocurrido un error al eliminar el movimiento',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** OBTENER HISTORICO DE MOVIMIENTOS CON FILTRO */
export const getMovementsHistory = async (
  historyFilters: HistoryFiltersParams
) => {
  const {
    userId,
    account,
    description,
    type,
    dateFrom,
    dateTo,
    amountFrom,
    amountTo,
    limit = 5000,
  } = historyFilters

  console.log(dateFrom, dateTo)

  try {
    const query: any = [Query.equal('userId', [userId])]
    account && query.push(Query.equal('account', [account]))
    type && query.push(Query.equal('type', [type]))
    description && query.push(Query.contains('description', [description]))
    dateFrom &&
      query.push(Query.greaterThanEqual('date', [dateFrom.toISOString()]))
    dateTo && query.push(Query.lessThanEqual('date', [dateTo.toISOString()]))
    amountFrom && query.push(Query.greaterThanEqual('amount', [amountFrom]))
    amountTo && query.push(Query.lessThanEqual('amount', [amountTo]))
    limit && query.push(Query.limit(limit))

    const movements = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      query
    )
    if (movements.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    if (movements.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const movementsData: MovementModel[] =
      movements.documents as MovementModel[]

    return {
      data: movementsData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      console.log(error)
      return {
        data: {
          message:
            'Ha ocurrido un error al obtener el histórico de movimientos',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}
