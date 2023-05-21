import client from "lib/api/client"
import { PostTheme } from "interfaces/theme"

// 全体公開のテーマを取得
export const getThemes = () => {
  return client.get("themes")
}

export const getTheme = (id: number) => {
  return client.get(`themes/${id}`)
}

export const postTheme = (data: PostTheme) => {
  return client.post("themes", data)
}
