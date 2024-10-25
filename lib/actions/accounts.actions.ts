import { AccountModel } from '@/types/appwrite.types'
import { APPWRITE_DATABASE_ID, databases } from '../appwrite.config'
import { ID } from 'node-appwrite'

/** CREAR NUEVA CUENTA */
export const createAccount = async (account: AccountModel) => {
  const { APPWRITE_ACCOUNTS_COLLECTION_ID } = process.env

  return await databases.createDocument(
    APPWRITE_DATABASE_ID!,
    APPWRITE_ACCOUNTS_COLLECTION_ID!,
    ID.unique(),
    account
  )
}

/** MODIFICAR CUENTA */
// export const modifyAccount = async (account: AccountModel) => {
//   const { APPWRITE_ACCOUNTS_COLLECTION_ID } = process.env

//   client
//   .setEndpoint(APPWRITE_AI_ENDPOINT!)
//   .setProject(APPWRITE_PROJECT_ID!)
//   .setKey(APPWRITE_API_KEY!)

// export const databases = new sdk.Databases(client)

//   return await databases.updateDocument(
//     APPWRITE_DATABASE_ID!,
//     APPWRITE_ACCOUNTS_COLLECTION_ID!,
//     ID.unique(),
//     account
//   )
// }

/** BORRAR CUENTA */
// export const deleteAccount = async (accountId: string) => {
//   const { APPWRITE_ACCOUNTS_COLLECTION_ID } = process.env

//   return await databases.deleteDocument(
//     APPWRITE_ACCOUNTS_COLLECTION_ID!,
//     accountId
//   )
// }
