import { AuthorizationService } from "../../services/authorizationService";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Resource } from "./types";
import { useSetRecoilState } from 'recoil';
import { resourceDataMapState } from '../../../state/atoms';
import { useEffect } from 'react';
export const LIST_RESOURCES_KEY = 'ListResources';

export const listResources = async (connectionId: string, resourceId?: string): Promise<Resource[]> => {
    try {
        const authService = AuthorizationService.getInstance();
        const authHeaders = authService.getAuthHeaders();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!authHeaders) throw new Error('Authentication headers not available');
        if (!backendUrl) throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable');
        
        const data = resourceId ? { resource_id: resourceId } : undefined;
        const params = new URLSearchParams(data);
        const url = `${backendUrl}/connections/${connectionId}/resources/children?${params.toString()}`;
        const response = await axios.get(url, { headers: authHeaders });
        return response.data;

    } catch (error) {
        console.error('Error listing resources for connection:', error);

        throw error;
    }
}

export const useListResources = (connectionId: string, resourceId?: string, enabled: boolean = true) => {
    const setResourceDataMap = useSetRecoilState(resourceDataMapState);

    const { data, isLoading, error } = useQuery({
        queryKey: [LIST_RESOURCES_KEY, connectionId, resourceId],
        queryFn: async () => listResources(connectionId, resourceId),
        enabled: enabled,
    });

    useEffect(() => {
        if (data) {
            setResourceDataMap(prevMap => {
                const newMap = new Map(prevMap);
                data.forEach(resource => {
                    newMap.set(resource.inode_path.path, resource);
                });
                return newMap;
            });
        }
    }, [data]);

    return { data, isLoading, error };
}
