import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';
import { useQuery } from '@tanstack/react-query';
import { Connection } from './types';

export const LIST_CONNECTIONS_QUERY_KEY = ['connections'];

export const listConnections = async (): Promise<Connection[]> => {
  const authService = AuthorizationService.getInstance();
  const authHeaders = authService.getAuthHeaders();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!authHeaders) throw new Error('Authentication headers not available');
  if (!backendUrl)  throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

  const connectionListUrl = `${backendUrl}/connections?connection_provider=gdrive&limit=1`;
  
  try {
    const response = await axios.get(connectionListUrl, { headers: authHeaders });
    return response.data;
  } catch (error) {
    console.error('Error listing connections:', error);
    throw error;
  }
};

// Separate hook for better separation of concerns
export const useListConnections = () => {
  return useQuery({
    queryKey: LIST_CONNECTIONS_QUERY_KEY,
    queryFn: listConnections,
  });
};

