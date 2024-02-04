import client from "lib/api/client"
import Cookies from "js-cookie"

export const getBookmarkLinks = () => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.get('/bookmark_links', { headers });
};

export const deleteBookmarkLink = (bookmark_link_id: number) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  }
  return client.delete(`/bookmark_links/${bookmark_link_id}`, { headers });
};