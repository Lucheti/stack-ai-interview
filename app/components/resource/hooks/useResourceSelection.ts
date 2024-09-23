import { useRecoilState, useRecoilValue } from "recoil";
import { selectedResourcesState, selectedConnectionState, resourceDataMapState } from "../../../state/atoms";
import { useCallback } from "react";
import { getAllChildrenFromResource } from "../../../utils/getAllChildrenFromResource";

export const useResourceSelection = () => {
    const [selectedResources, setSelectedResources] = useRecoilState(selectedResourcesState);
    const selectedConnection = useRecoilValue(selectedConnectionState);
    const resourceDataMap = useRecoilValue(resourceDataMapState);
  
    const toggleResourceSelection = useCallback((resourcePath: string, checked: boolean) => {
      const resourceList = Array.from(resourceDataMap.values());
  
      setSelectedResources(prev => {
        const newSet = new Set(prev);
        const resource = resourceDataMap.get(resourcePath);
        if (!resource) return prev;
        const allChildren = getAllChildrenFromResource(resourceList, resourcePath);
        const allResources = [resource, ...allChildren].map(resource => resource.inode_path.path);
        if (checked) allResources.forEach(resource => newSet.add(resource));
        else allResources.forEach(resource => newSet.delete(resource));
        return newSet;
      });
    }, [setSelectedResources, selectedConnection, resourceDataMap]);
  
    const isResourceSelected = useCallback((resourcePath: string) => {
      return Array.from(selectedResources).some(selectedPath => selectedPath.includes(resourcePath));
    }, [selectedResources]);
  
    return { toggleResourceSelection, isResourceSelected };
  };