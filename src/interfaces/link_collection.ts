export interface PostLinkCollectionRequest {
  subtitle?: string
  links: PostLinkCollectionRequestLink[]
}

export interface PostLinkCollectionRequestLink {
  url: string
}