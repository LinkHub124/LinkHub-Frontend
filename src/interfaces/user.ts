export interface User {
  id: number
  email: string
  name: string
  introduction: string
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

export interface PutUserRequest {
  name: string
}