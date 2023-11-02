import { User } from "interfaces/user"
import { Link } from "interfaces/link"

export interface Theme {
  themeId: number
  title: string
  post_status: number
  user?: User
  links?: Link[]
}

export interface GetThemesResponse {
  themeId: number
  title: string
  postStatus: number
  createdAt: Date
  updatedAt: Date
  user: {
    userId: number
    name: string
    image: string
  }
}

export interface GetThemeResponse {
  themeId: number
  title: string
  postStatus: number
  createdAt: Date
  updatedAt: Date
  user?: {
    userId: number
    name: string
    image: string
  }
  linkCollections?: {
    subtitle: string
    links: {
      url: string
      urlTitle: string
      urlDescription: string
      urlImage: string
      description?: string
    }[]
  }[]
}

export interface PostThemeRequest {
  title: string
}

export interface PostThemeResponse {
  themeId: number
  userId: number
  title: string
}