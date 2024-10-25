import * as sdk from 'node-appwrite'

/*** SEGURAMENTE BORRAR PORQUE NO SIRVE */
export const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_ACCOUNTS_COLLECTION_ID,
  APPWRITE_USERS_COLLECTION_ID,
  APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT,
} = process.env

const client = new sdk.Client()

client
  .setEndpoint(APPWRITE_API_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!)

export const databases = new sdk.Databases(client)
export const users = new sdk.Users(client)
export const messaging = new sdk.Messaging(client)
export const storage = new sdk.Storage(client)
