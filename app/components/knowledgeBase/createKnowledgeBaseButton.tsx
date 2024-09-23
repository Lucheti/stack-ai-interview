"use client"
import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check } from "lucide-react"
import { Button } from "../../../components/ui/button";
import { selectedResourcesState, resourceDataMapState, selectedConnectionState } from "../../state/atoms";
import { getAllChildrenFromResource } from '../../utils/getAllChildrenFromResource';
import { createKnowledgeBase as createKnowledgeBaseRequest } from '../../api/requests/knowledgeBase/createKnowledgeBase';
import { syncKnowledgeBase } from '../../api/requests/knowledgeBase/syncKnowledgeBase';
import { LIST_KNOWLEDGE_BASES_QUERY_KEY } from "../../api/requests/knowledgeBase/listKnowledgeBases";
import { motion, AnimatePresence } from "framer-motion";

const buttonVariants = {
    initial: { scale: 1 },
    exit: { scale: 0 },
    enter: { scale: 1 },
};

export const CreateKnowledgeBaseButton: React.FC = () => {
    const selectedResources = useRecoilValue(selectedResourcesState);
    const [resourceDataMap] = useRecoilState(resourceDataMapState);
    const selectedConnection = useRecoilValue(selectedConnectionState);
    const queryClient = useQueryClient();

    const { mutate: createKnowledgeBase, isPending, isSuccess, reset } = useMutation({
        mutationFn: async () => {
            if (!selectedConnection) return;

            const knowledgeBaseResources = new Set(selectedResources);
            pruneRedundantResources(knowledgeBaseResources);

            const knowledgeBaseResourceIds = Array.from(knowledgeBaseResources)
                .map(resourcePath => resourceDataMap.get(resourcePath)?.resource_id)
                .filter((id): id is string => id !== undefined);

            const knowledgeBase = await createKnowledgeBaseRequest(selectedConnection, knowledgeBaseResourceIds);
            await syncKnowledgeBase(knowledgeBase.knowledge_base_id);

            queryClient.invalidateQueries({ queryKey: LIST_KNOWLEDGE_BASES_QUERY_KEY });
        },
        onSuccess: () => {
            // Optimistic UI update could be added here
        }
    });

    const pruneRedundantResources = (resources: Set<string>) => {
        resources.forEach(resourcePath => {
            const resource = resourceDataMap.get(resourcePath);
            if (!resource) return;

            const children = getAllChildrenFromResource(Array.from(resourceDataMap.values()), resourcePath);

            if (children.every(child => resources.has(child.inode_path.path))) {
                children.forEach(child => resources.delete(child.inode_path.path));
            }
        });
    };

    return (
        <AnimatePresence mode="wait">
            {isPending && (
                <motion.div
                    key="pending"
                    variants={buttonVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    <Button disabled aria-busy="true" className="bg-blue-500 text-white">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Creating Knowledge Base...
                    </Button>
                </motion.div>
            )}
            {isSuccess && (
                <motion.div
                    key="success"
                    variants={buttonVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    <Button onClick={reset} className="bg-green-500 text-white hover:bg-green-600">
                        <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        Knowledge Base Created
                    </Button>
                </motion.div>
            )}
            {!isPending && !isSuccess && (
                <motion.div
                    key="default"
                    variants={buttonVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        onClick={() => createKnowledgeBase()}
                        disabled={!selectedConnection}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Create Knowledge Base
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};