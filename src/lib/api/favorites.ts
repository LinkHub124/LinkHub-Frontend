import client from "lib/api/client"
import Cookies from "js-cookie"

export const postFavorite = (themeId: number) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  console.log(headers)
  return client.post(`themes/${themeId}/favorites`, {}, { headers })
}
