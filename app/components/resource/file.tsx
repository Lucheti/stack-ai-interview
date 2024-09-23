import { useResource } from "./hooks/useResource";
import { useResourceSelection } from "./hooks/useResourceSelection";
import { Resource } from "../../api/requests/resources/types";
import { FileIcon, CheckIcon, AlertTriangleIcon } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import React from "react";
import { useRecoilValue } from "recoil";
import { knowledgeBaseResourcesState } from "../../state/atoms";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

export const File = ({ resource }: { resource: Resource }) => {
    const { leafName, spacingClassName } = useResource(resource);
    const { toggleResourceSelection, isResourceSelected } = useResourceSelection();
    const isSelected = isResourceSelected(resource.inode_path.path);
    const knowledgeBaseResources = useRecoilValue(knowledgeBaseResourcesState);
  
    const handleSelect = (checked: boolean) => {
      toggleResourceSelection(resource.inode_path.path, checked);
    };
  
    const matchingResources = Array.from(knowledgeBaseResources.entries())
      .flatMap(([kbId, resources]) => 
        resources.filter(r => r.inode_path.path === resource.inode_path.path)
          .map(r => ({ ...r, kbId }))
      );
  
    const statusChips = matchingResources
      .filter(r => r.status === "indexed" || r.status === "error")
      .map((r, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <span
                className={`ml-2 px-3 py-0.5 text-xs rounded flex items-center ${
                  r.status === "indexed" 
                    ? "bg-green-50 text-green-800 border border-green-300" 
                    : "bg-red-50 text-red-800 border border-red-300"
                }`}
              >
                {r.status === "indexed" ? (
                  <CheckIcon className="w-3 h-3 mr-1" />
                ) : (
                  <AlertTriangleIcon className="w-3 h-3 mr-1" />
                )}
                {r.status} ({r.kbId.slice(0, 10)}...)
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{r.kbId}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ));
  
    return (
      <div className={`text-sm text-gray-700 border-b border-gray-200 py-2 ${spacingClassName} flex items-center justify-between`}>
        <div className="flex items-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelect}
            className="mr-2 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500"
          />
          <FileIcon className="inline-block mr-2 h-4 w-4" />
          <span className="ml-1">{leafName}</span>
        </div>
        <div className="flex flex-wrap justify-end">
          {statusChips}
        </div>
      </div>
    )
  }