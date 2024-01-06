import client from "lib/api/client"
import Cookies from "js-cookie"

// タグに紐づいた全体公開のテーマを取得
export const getTag = (tag_name: string) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.get(`/tags/${tag_name}`, { headers })
}
