export interface IOauthLinkProviderRequest {}

export interface IOauthGenerateTokenResponse {
  token: string;
}

export interface IOauthUnlinkProviderRequest {
  provider: string;
}

export interface IOauthFindProvidersRequest {}

export interface IOauthProviderResponse {
  providerName: string;
}
