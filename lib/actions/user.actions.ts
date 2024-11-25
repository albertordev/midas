'use server'

import * as sdk from 'node-appwrite'

import { AuthResponse, User } from '@/types'
import { UserModel } from '@/types/appwrite.types'
import { Query } from 'node-appwrite'
import { ID } from 'node-appwrite'
import { parseStringify, getAvatarColor } from '../utils'

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID,
  APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT,
} = process.env

const client = new sdk.Client()

client
  .setEndpoint(APPWRITE_API_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!)

const databases = new sdk.Databases(client)

/** LOGIN - MÓDULO AUTH */
export const loginUser = async (username: string, password: string) => {
  const client = new sdk.Client()

  client
    .setEndpoint(APPWRITE_API_ENDPOINT!)
    .setProject(APPWRITE_PROJECT_ID!)
    .setKey(APPWRITE_API_KEY!)

  const users = new sdk.Users(client)

  try {
    /** Obtenemos el email del usuario */
    const documents = await users.list([Query.equal('name', username)])

    if (documents.users.length === 0) {
      return {
        data: null,
        status: 401,
      } as AuthResponse
    }

    const user = documents.users[0]

    /** Validamos usuario y contraseña */
    const account = new sdk.Account(client)
    await account.createEmailPasswordSession(user.email, password)

    const loggedUser: User = {
      id: user.$id,
      name: user.name,
    }

    /** Si todo ha ido bien, creamos el usuario en la base de datos
     *  en caso de que no exista
     */
    const alreadyExistingUser = await getUserByName(user.name)

    if (!alreadyExistingUser) {
      /** Buscamos un color al azar para su avatar */
      loggedUser.avatarColor = getAvatarColor()
      const newUser: UserModel = await createUser(loggedUser)

      return {
        data: newUser,
        status: 200,
      }
    }

    return {
      data: alreadyExistingUser,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      return {
        data: null,
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** CREAR NUEVO USUARIO */
export const createUser = async (user: User) => {
  try {
    const newUser: UserModel = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USERS_COLLECTION_ID!,
      ID.unique(),
      { id: user.id, name: user.name, avatarColor: user.avatarColor }
    )

    return parseStringify(newUser)
  } catch (error) {
    console.log(error)
  }
}

export const getUserByName = async (name: string) => {
  try {
    const user = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USERS_COLLECTION_ID!,
      [Query.equal('name', [name])]
    )

    if (user.documents.length === 0) {
      return null
    }

    return parseStringify(user.documents[0])
  } catch (error) {
    console.log(error)
  }
}
