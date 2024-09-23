import { Resource } from "../api/requests/resources/types";

export const getParentFromResource = (resourceList: Resource[], resourcePath: string) => {
    const pathParts = resourcePath.split('/');
    pathParts.pop();
    const parentPath = pathParts.join('/');
    return resourceList.find(resource => resource.inode_path.path === parentPath);
}