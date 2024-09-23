import { Resource as ResourceType } from "../../api/requests/resources/types";
import { match } from "ts-pattern";
import { Directory } from "./directory";
import { File } from "./file";
import React from "react";
  
  export const Resource = ({ resource }: { resource: ResourceType }) => {
    return (
      match(resource.inode_type)
        .with("directory", () => <Directory resource={resource} />)
        .with("file", () => <File resource={resource} />)
        .exhaustive()
    );
  }