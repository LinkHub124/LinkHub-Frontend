import client from "lib/api/client"
import Cookies from "js-cookie"
import { PostLinkCollectionRequest, PostLinkCollectionRequestLink } from "interfaces/link_collection"

export const postLinkCollections = (id: number, data: PostLinkCollectionRequest) => {
  const headers = {
    "access-token": Cookies.get("_access_token"),
    "client": Cookies.get("_client"),
    "uid": Cookies.get("_uid"),
  };

  return client.post(`/themes/${id}/link_collections`,
                      { link_collection: data },
                      { headers }
                    );
};
