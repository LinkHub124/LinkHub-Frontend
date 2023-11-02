import { Theme } from "interfaces/theme"

export interface User {
  id: number
  email: string
  name: string
  introduction: string
  themes?: Theme[]
}

export interface GetUserResponse {
  userId: number
  name: string
  image?: string
  themes?: {
    themeId: number
    title: string
    postStatus: number
    createdAt: Date
    updatedAt: Date
  }[]
}