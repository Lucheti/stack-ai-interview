import { useState } from "react";
import { useResource } from "./hooks/useResource";
import { useResourceSelection } from "./hooks/useResourceSelection";
import { useRecoilValue } from "recoil";
import { Resource as ResourceType } from "../../api/requests/resources/types";
import { Resource } from "./resource";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion";
import { Checkbox } from "../../../components/ui/checkbox";
import { FolderIcon } from "lucide-react";
import { getChildrenFromResource } from "../../utils/getChildrenFromResource";
import React from "react";
import { processedResourceDataState } from "../../state/atoms";

export const Directory = ({ resource }: { resource: ResourceType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { leafName, spacingClassName } = useResource(resource);
    const { toggleResourceSelection, isResourceSelected } = useResourceSelection();
    const processedResourceData = useRecoilValue(processedResourceDataState);
    const toggleOpen = () => setIsOpen(!isOpen);
  
    const children = getChildrenFromResource(processedResourceData, resource.inode_path.path);
    const isSelected = isResourceSelected(resource.inode_path.path);
    const handleSelect = (checked: boolean) => toggleResourceSelection(resource.inode_path.path, checked);
  
    return (
      <Accordion type="multiple" className={`border-none ${spacingClassName}`}>
        <AccordionItem value={resource.resource_id} className="border-none">
          <div className="flex items-center border-b border-gray-200 py-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelect}
              className="mr-2 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500"
            />
            <AccordionTrigger className="text-gray-700 text-sm p-0 " onClick={toggleOpen}>
              <div className="flex items-center">
                <FolderIcon className="h-4 w-4 mr-2" />
                <span className="ml-1">{leafName}</span>
              </div>
            </AccordionTrigger>
          </div>
  
          <AccordionContent className="p-0">
            <ul className="m-0 p-0">
              {children.map((childResource) => (
                <li key={childResource.resource_id}>
                  <Resource resource={childResource} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }