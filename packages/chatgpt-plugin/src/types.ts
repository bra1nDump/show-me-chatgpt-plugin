export interface AIPlugin {
  schema_version: string
  name_for_model: string
  name_for_human: string
  description_for_model: string
  description_for_human: string
  auth: Auth
  api: API
  logo_url: string
  contact_email: string
  legal_info_url: string
}

export interface API {
  type: string
  url: string
  has_user_authentication: boolean
}

export interface Auth {
  type: string | 'none'
  authorization_type?: string
  authorization_url?: string
  client_url?: string
  scope?: string
  authorization_content_type?: string
  verification_tokens?: VerificationTokens
  instructions?: string
}

export interface VerificationTokens {
  openai: string
}
