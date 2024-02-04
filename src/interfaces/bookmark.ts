export interface GetBookmarksResponse {
  BookmarkLinks: BookmarkLink[];
}

export interface BookmarkLink {
  bookmarkLinkId: number
  url: string;
  urlTitle: string;
  faviconUrl: string;
}
