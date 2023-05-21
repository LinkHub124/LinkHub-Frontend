import { Theme } from "interfaces/theme"

export interface User {
  id: number
  email: string
  name: string
  introduction: string
  themes?: Theme[]
}