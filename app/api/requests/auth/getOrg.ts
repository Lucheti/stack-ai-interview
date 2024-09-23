import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';

export const getOrg = async () => {
  try {
    const authService = AuthorizationService.getInstance();
    const authHeaders = authService.getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!authHeaders) throw new Error('Authentication headers not available');
    if (!backendUrl) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

    const orgUrl = `${backendUrl}/organizations/me/current`;
    const response = await axios.get(orgUrl, { headers: authHeaders });

    return response.data;
  } catch (error) {
    console.error('Error getting organization:', error);
    throw error;
  }
};
