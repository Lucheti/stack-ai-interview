import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';
import { useQuery } from '@tanstack/react-query';
import { KnowledgeBase, KnowledgeBaseResponse } from './types';
export const LIST_KNOWLEDGE_BASES_QUERY_KEY = ['list_knowledge_bases'];

export const listKnowledgeBases = async (): Promise<KnowledgeBase[]> => {
  try {
    const authService = AuthorizationService.getInstance();
    const authHeaders = authService.getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!authHeaders) throw new Error('Authentication headers not available');
    if (!backendUrl) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

    const listKbUrl = `${backendUrl}/knowledge_bases`;
    
    const response = await axios.get<KnowledgeBaseResponse>(listKbUrl, { headers: authHeaders });
    console.log(response.data);

    return response?.data?.admin || [];
  } catch (error) {
    console.error('Error listing knowledge bases:', error);
    throw error;
  }
};

export const useListKnowledgeBases = () => {
  return useQuery({
    queryKey: LIST_KNOWLEDGE_BASES_QUERY_KEY,
    queryFn: listKnowledgeBases,
  });
};
