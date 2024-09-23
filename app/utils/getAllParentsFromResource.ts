import { Resource } from "../api/requests/resources/types";
import { getParentFromResource } from "./getParentFromResource";

export const getAllParentsFromResource = (resourceList: Resource[], resourcePath: string): Resource[] => {
    const parent = getParentFromResource(resourceList, resourcePath);
    return parent ? [parent, ...getAllParentsFromResource(resourceList, parent.inode_path.path)] : [];
}