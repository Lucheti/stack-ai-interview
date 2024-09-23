import { queryClient } from "../../queryClient";
import { LIST_RESOURCES_KEY, listResources } from "./listResources";
import { Resource } from "./types";
import { listKnowledgeBaseFiles, LIST_KNOWLEDGE_BASE_FILES_QUERY_KEY } from "../knowledgeBase/listKnowledgeBaseFiles";

export const fetchAllConnectionResources = async (
    connectionId: string,
    resourceId?: string,
    onNewResourcesFound?: (count: number) => void,
    onMoreResourcesLoaded?: (count: number) => void
): Promise<Resource[]> => {
    const resources = await queryClient.fetchQuery({
        queryKey: [LIST_RESOURCES_KEY, connectionId, resourceId],
        queryFn: () => listResources(connectionId, resourceId),
    });

    if (onNewResourcesFound) {
        onNewResourcesFound(resources.length);
    }

    const children = resources
        .filter((resource: Resource) => resource.inode_type === "directory")
        .map(resource => fetchAllConnectionResources(
            connectionId,
            resource.resource_id,
            onNewResourcesFound,
            onMoreResourcesLoaded
        ));

    const allResources = await Promise.all(children).then(children => {
        const flattenedChildren = children.flat();
        if (onMoreResourcesLoaded) {
            onMoreResourcesLoaded(flattenedChildren.length);
        }
        return resources.concat(flattenedChildren);
    });

    return allResources;
}

export const fetchAllKnowledgeBaseResources = async (knowledgeBaseId: string, resourcePath: string): Promise<Resource[]> => {
    console.log("fetching", knowledgeBaseId, resourcePath);
    const knowledgeBaseResources = await queryClient.fetchQuery({
        queryKey: [LIST_KNOWLEDGE_BASE_FILES_QUERY_KEY, knowledgeBaseId, resourcePath],
        queryFn: () => listKnowledgeBaseFiles(knowledgeBaseId, resourcePath),
    });

    const children = knowledgeBaseResources
        .filter((resource: Resource) => resource.inode_type === "directory")
        .map(resource => fetchAllKnowledgeBaseResources(knowledgeBaseId, resource.inode_path.path))


    return Promise.all(children).then(children => knowledgeBaseResources.concat(children.flat()))
}
