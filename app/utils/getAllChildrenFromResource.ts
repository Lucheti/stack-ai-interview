import { Resource } from "../api/requests/resources/types";
import { getChildrenFromResource } from "./getChildrenFromResource";

export const getAllChildrenFromResource = (resourceList: Resource[], resourcePath: string): Resource[] => {
    const children = getChildrenFromResource(resourceList, resourcePath);
    return children.concat(children.map(child => getAllChildrenFromResource(resourceList, child.inode_path.path)).flat());
}