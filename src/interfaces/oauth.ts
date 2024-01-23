export interface IOauthGenerateTokenResponse {
  token: string;
}

export interface IOauthUnlinkProviderRequest {
  provider: string;
}

export interface IOauthUnlinkProviderResponse {}

export interface IOauthProviderResponse {
  providerName: string;
}
