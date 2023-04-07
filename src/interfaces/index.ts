// サインアップ
export interface SignUpData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

// サインイン
export interface SignInData {
  email: string
  password: string
}

// ユーザー
export interface User {
  id: number
  email: string
  name: string
  introduction: string
  themes?: Theme[]
}

export interface Theme {
  id: number
  title: string
  post_status: number
  user?: User
  links?: Link[]
}

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
