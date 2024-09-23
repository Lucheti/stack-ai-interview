
export interface Connection {
  name: string;
  connection_id: string;
  user_id: string;
  org_id: string;
  share_with_org: boolean;
  created_at: string;
  updated_at: string;
  connection_provider: string;
  connection_provider_data: {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    can_be_knowledge_base: boolean;
  };
}
