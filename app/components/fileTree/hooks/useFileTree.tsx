"use client"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { resourceDataMapState, selectedConnectionState, processedResourceDataState, resourceSortState } from "../../../state/atoms";
import { useQuery } from "@tanstack/react-query";
import { fetchAllConnectionResources } from "../../../api/requests/resources/listAllResources";
import { Resource as ResourceType } from "../../../api/requests/resources/types";
import { useState, useMemo, useEffect, useCallback } from "react";


export const useFileTree = () => {
    const [, setResourceDataMap] = useRecoilState(resourceDataMapState);
    const selectedConnection = useRecoilValue(selectedConnectionState);
    const processedResources = useRecoilValue(processedResourceDataState);
    const setResourceSort = useSetRecoilState(resourceSortState);
    const [activeSorter, setActiveSorter] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState({ total: 0, loaded: 0 });

    const { data: resources, isLoading } = useQuery({
        queryKey: ['fetchAllConnectionResources', selectedConnection],
        queryFn: () => fetchAllConnectionResources(
            selectedConnection!,
            undefined,
            (count) => setLoadingProgress(prev => ({ ...prev, total: prev.total + count })),
            (count) => setLoadingProgress(prev => ({ ...prev, loaded: prev.loaded + count }))
        ),
        enabled: !!selectedConnection,
    });

    const rootLevelResources = useMemo(() => {
        return processedResources.filter(resource => resource.inode_path.path.split('/').length === 1);
    }, [processedResources]);

    useEffect(() => {
        if (resources) setResourceDataMap(new Map(resources.map(resource => [resource.inode_path.path, resource])));
    }, [resources, setResourceDataMap]);

    const handleSort = useCallback((sortType: string) => {
        setActiveSorter(prevSorter => {
            const newSorter = prevSorter === sortType ? null : sortType;
            setResourceSort(() => (a: ResourceType, b: ResourceType) => {
                if (!newSorter) return a.inode_path.path.localeCompare(b.inode_path.path);
                switch (newSorter) {
                    case 'dateCreated':
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    case 'dateModified':
                        return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime();
                    case 'size':
                        return (b?.size ?? 0) - (a?.size ?? 0);
                    default:
                        return a.inode_path.path.localeCompare(b.inode_path.path);
                }
            });
            return newSorter;
        });
    }, [setResourceSort]);

    return { 
        resources: rootLevelResources, 
        isLoading, 
        handleSort, 
        activeSorter,
        loadingProgress: {
            loaded: loadingProgress.loaded,
            total: loadingProgress.total
        }
    };
};