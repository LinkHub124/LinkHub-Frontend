import client from "lib/api/client"
import Cookies from "js-cookie"
import { PostThemeRequest } from "interfaces/theme"

// 全体公開のテーマを取得
export const getThemes = () => {
  return client.get("themes")
}

export const getTheme = (id: number) => {
  return client.get(`themes/${id}`)
}

export const postTheme = (data: PostThemeRequest) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  };

  return client.post("themes", data, { headers });
};
