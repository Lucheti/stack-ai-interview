import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';
import { useQuery } from '@tanstack/react-query';

export const SYNC_KNOWLEDGE_BASE_QUERY_KEY = ['sync_knowledge_base'];

export const syncKnowledgeBase = async (knowledgeBaseId: string): Promise<unknown> => {
  try {
    const authService = AuthorizationService.getInstance();
    const authHeaders = authService.getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const orgId = authService.getOrgId();

    if (!authHeaders) throw new Error('Authentication headers not available');
    if (!backendUrl) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');
    if (!orgId) throw new Error('Organization ID not available');

    const syncKbUrl = `${backendUrl}/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`;
    
    const response = await axios.get(syncKbUrl, { headers: authHeaders });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('Error syncing knowledge base:', error);
    throw error;
  }
};

export const useSyncKnowledgeBase = (knowledgeBaseId: string) => {
  return useQuery({
    queryKey: [...SYNC_KNOWLEDGE_BASE_QUERY_KEY, knowledgeBaseId],
    queryFn: () => syncKnowledgeBase(knowledgeBaseId),
  });
};


