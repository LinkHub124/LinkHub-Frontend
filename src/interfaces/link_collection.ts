export interface PostLinkCollectionRequest {
  subtitle?: string
  links: PostLinkCollectionRequestLink[]
}

export interface PostLinkCollectionRequestLink {
  linkId?: number
  url: string
  description: string
}

export interface PutLinkCollectionRequest {
  subtitle?: string
  links: PutLinkCollectionRequestLink[]
}

export interface PutLinkCollectionRequestLink {
  linkId?: number
  url: string
  description: string
}