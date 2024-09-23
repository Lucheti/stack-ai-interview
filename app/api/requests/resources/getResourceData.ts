import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthorizationService } from "../../services/authorizationService";
import { Resource } from "./types";

export const GET_RESOURCE_DATA_QUERY_KEY = ['GetResourceData'];


export const getResourceData = async (connectionId: string, resourceId: string): Promise<Resource> => {
    try {
        const authService = AuthorizationService.getInstance();
        const authHeaders = authService.getAuthHeaders();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!authHeaders) throw new Error('Authentication headers not available');

        const data = { resource_id: resourceId };
        const params = new URLSearchParams(data);
        const url = `${backendUrl}/connections/${connectionId}/resources?${params.toString()}`;
        const response = await axios.get(url, { headers: authHeaders });
        return response.data;
    } catch (error) {
        console.error('Error fetching resource data:', error);
        throw error;
    }
}

export const useGetResourceData = ((connectionId: string, resourceId: string) => {
    return useQuery({
        queryKey: [GET_RESOURCE_DATA_QUERY_KEY, connectionId, resourceId],
        queryFn: () => getResourceData(connectionId, resourceId),
    });
});
