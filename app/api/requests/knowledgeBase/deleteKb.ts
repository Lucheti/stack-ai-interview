import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';
import { KnowledgeBase, KnowledgeBaseResponse } from './types';
export const LIST_KNOWLEDGE_BASES_QUERY_KEY = ['list_knowledge_bases'];

export const deleteKb = async (knowledgeBaseId: string): Promise<KnowledgeBase[]> => {
  try {
    const authService = AuthorizationService.getInstance();
    const authHeaders = authService.getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!authHeaders) throw new Error('Authentication headers not available');
    if (!backendUrl) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

    const listKbUrl = `${backendUrl}/knowledge_bases/${knowledgeBaseId}`;
    
    const response = await axios.delete<KnowledgeBaseResponse>(listKbUrl, { headers: authHeaders });

    return response.data.admin;
  } catch (error) {
    console.error('Error listing knowledge bases:', error);
    throw error;
  }
};
