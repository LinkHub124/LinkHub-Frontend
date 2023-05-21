import { User } from "interfaces/user"
import { Link } from "interfaces/link"

export interface Theme {
  id: number
  title: string
  post_status: number
  user?: User
  links?: Link[]
}

export interface PostTheme {
  title: string
}
