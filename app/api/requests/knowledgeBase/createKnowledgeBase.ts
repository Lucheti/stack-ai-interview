import axios from 'axios';
import { AuthorizationService } from '../../services/authorizationService';
import { KnowledgeBase } from './types';
export const CREATE_KNOWLEDGE_BASE_QUERY_KEY = ['knowledge_bases'];

export const createKnowledgeBase = async (connectionId: string, resourceIds: string[]): Promise<KnowledgeBase> => {
  try {

    const authService = AuthorizationService.getInstance();
    const authHeaders = authService.getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!authHeaders) throw new Error('Authentication headers not available');
    if (!backendUrl)  throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');

    const create_kb_url = `${backendUrl}/knowledge_bases`
    const data = {
      "connection_id": connectionId,
      "connection_source_ids": resourceIds,
      "indexing_params": {
        "ocr": false,
        "unstructured": true,
        "embedding_params": {
            "embedding_model": "text-embedding-ada-002",
            "api_key": null
        },
        "chunker_params": {
            "chunk_size": 1500,
            "chunk_overlap": 500,
            "chunker": "sentence"
        }
      }
    }
    
    const response = await axios.post(create_kb_url, data, { headers: authHeaders });
    console.log(response.data)

    return response.data;
  } catch (error) {
    console.error('Error listing connections:', error);
    throw error;
  }
};
