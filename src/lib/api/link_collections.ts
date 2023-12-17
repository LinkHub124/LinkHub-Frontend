import client from "lib/api/client"
import Cookies from "js-cookie"
import { PostLinkCollectionRequest, PutLinkCollectionRequest } from "interfaces/link_collection"

export const postLinkCollections = (id: number, data: PostLinkCollectionRequest) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  };
  return client.post(`/themes/${id}/link_collections`, { link_collection: data }, { headers });
};

export const putLinkCollections = (id: number, linkCollectionId: number, data: PutLinkCollectionRequest) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  };
  return client.put(`/themes/${id}/link_collections`, { link_collection: data }, { headers });
};

export const deleteLinkCollections = (id: number, linkCollectionId: number) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  };
  return client.delete(`/themes/${id}/link_collections/${linkCollectionId}`, { headers });
};