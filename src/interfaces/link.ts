import { Theme } from "interfaces/theme"

export interface Link {
  id: number
  subtitle: string
  caption: string
  theme?: Theme
  one_links?: OneLink[]
}

export interface OneLink {
  id: number
  url: string
  url_title: string
  url_description: string
  url_image: string
  link?: Link
}