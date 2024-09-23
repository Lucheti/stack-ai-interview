import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';
import { Resource } from '../resources/types';
export const LIST_KNOWLEDGE_BASE_FILES_QUERY_KEY = ['list_knowledge_base_files'];

export const listKnowledgeBaseFiles = async (knowledgeBaseId: string, resourcePath: string): Promise<Resource[]> => {
  try {
    const authService = AuthorizationService.getInstance();
    const authHeaders = authService.getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!authHeaders) throw new Error('Authentication headers not available');
    if (!backendUrl) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

    const data = {
      "resource_path": resourcePath
    }
    const params = new URLSearchParams(data);
    const listKbUrl = `${backendUrl}/knowledge_bases/${knowledgeBaseId}/resources/children?${params.toString()}`;
    
    const response = await axios.get(listKbUrl, { headers: authHeaders });

    return response.data;
  } catch (error) {
    console.error('Error listing knowledge bases:', error);
    throw error;
  }
};
