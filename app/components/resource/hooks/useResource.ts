import { Resource } from "../../../api/requests/resources/types";

export const useResource = (resource: Resource) => {
    const depth = resource.inode_path.path.split('/').length - 1;
    const leafName = resource.inode_path.path.split('/').pop() || '';
    const spacingClassName = `px-${depth * 4}`;
    return { depth, leafName, spacingClassName }
}