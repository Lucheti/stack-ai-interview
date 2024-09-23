import axios from 'axios';

export const getAuthHeaders = async (email: string, password: string) => {
  const SUPABASE_AUTH_URL = process.env.NEXT_PUBLIC_SUPABASE_AUTH_URL;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const requestUrl = `${SUPABASE_AUTH_URL}/auth/v1/token?grant_type=password`;

  const response = await axios.post(requestUrl, {
    email,
    password,
    gotrue_meta_security: {},
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Apikey': ANON_KEY,
    },
  });

  const accessToken = response.data.access_token;
  return { Authorization: `Bearer ${accessToken}` };
};
