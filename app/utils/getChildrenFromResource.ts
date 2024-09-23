import { Resource } from "../api/requests/resources/types";

export const getChildrenFromResource = (resourceList: Resource[], resourcePath: string) => {
    return resourceList
      .filter(child => 
        child.inode_path.path.startsWith(resourcePath) && 
        child.inode_path.path !== resourcePath &&
        child.inode_path.path.split('/').length === resourcePath.split('/').length + 1
      );
}