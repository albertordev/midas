'use server'

import * as sdk from 'node-appwrite'

import { Account, AuthResponse, User } from '@/types'
import { Query } from 'node-appwrite'
import { ID } from 'node-appwrite'
import { AccountModel } from '@/types/appwrite.types'

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_ACCOUNTS_COLLECTION_ID,
  APPWRITE_MOVEMENTS_COLLECTION_ID,
  APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT,
} = process.env

const client = new sdk.Client()

client
  .setEndpoint(APPWRITE_API_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!)

const databases = new sdk.Databases(client)

/** OBTENER CUENTAS */
export const getAccounts = async (userId: string) => {
  try {
    const accounts = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      [Query.equal('userId', [userId]), Query.limit(5000)]
    )
    if (accounts.documents.length === 0) {
      return {
        data: null,
        status: 200,
      } as AuthResponse
    }

    const accountsData: AccountModel[] = accounts.documents as AccountModel[]

    return {
      data: accountsData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      console.log(error)
      return {
        data: {
          message: 'Ha ocurrido un error al obtener la lista de cuentas',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** CREAR NUEVA CUENTA */
export const createAccount = async (account: Account) => {
  const accountToCreate = {
    userId: account.userId,
    code: account.code,
    description: account.description,
    icon: account.icon,
    type: account.type,
    comments: account.comments,
  }
  try {
    const accountCreated = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      ID.unique(),
      accountToCreate
    )
    return {
      data: accountCreated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: {
          message: 'Ha ocurrido un error al crear la cuenta',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** MODIFICAR CUENTA */
export const modifyAccount = async (account: Account) => {
  const accountToUpdate = {
    userId: account.userId,
    code: account.code,
    description: account.description,
    icon: account.icon,
    type: account.type,
    comments: account.comments,
  }
  try {
    const accountModified = await databases.updateDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      account.id,
      accountToUpdate
    )

    return {
      data: accountModified,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      console.log(error)

      const errorCode = error?.code
      return {
        data: {
          message: 'Ha ocurrido un error al modificar la cuenta',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** BORRAR CUENTA */
export const deleteAccount = async (accountId: string) => {
  const { APPWRITE_ACCOUNTS_COLLECTION_ID } = process.env

  try {
    const accountToDelete = await databases.getDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      accountId
    )

    if (!accountToDelete) {
      return {
        data: {
          message: 'No se ha encontrado la cuenta a eliminar',
        },
        status: 200,
      }
    }

    /** Primero verificamos que no haya movimientos asignados a esa
     *  cuenta
     */

    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_MOVEMENTS_COLLECTION_ID!,
      [
        Query.equal('userId', [accountToDelete.userId]),
        Query.equal('account', [accountToDelete.code]),
      ]
    )

    if (response?.documents.length > 0) {
      return {
        data: {
          message:
            'Existen movimientos asociados a esa cuenta. No se ha podido eliminar.',
        },
        status: 500,
      }
    }

    const accountDeleted = await databases.deleteDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      accountId
    )

    return {
      data: accountDeleted,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      console.log(error)
      return {
        data: {
          message: 'Ha ocurrido un error al elimianar cuenta',
        },
        status: errorCode,
      } as AuthResponse
    }
  }
}
