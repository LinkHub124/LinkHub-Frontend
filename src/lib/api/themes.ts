import client from "lib/api/client"
import Cookies from "js-cookie"
import { PostThemeRequest, PutThemeRequest, PutThemeRequestTags } from "interfaces/theme"

// 全体公開のテーマを取得
export const getThemes = () => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.get("themes", { headers })
}

export const getTheme = (id: number) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.get(`themes/${id}`, { headers })
}

export const postTheme = (data: PostThemeRequest) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.post("themes", { theme: data }, { headers })
}

export const putTheme = (id: number, data: PutThemeRequest) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.put(`themes/${id}`, { theme: data }, { headers })
}

export const putThemeTags = (id: number, data: PutThemeRequestTags) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.put(`themes/${id}`, { theme: data }, { headers })
}

export const deleteTheme = (id: number) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.delete(`themes/${id}`, { headers })
}
