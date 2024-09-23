"use client"
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useListKnowledgeBases } from "../../api/requests/knowledgeBase/listKnowledgeBases";
import { deleteKb } from "../../api/requests/knowledgeBase/deleteKb";
import { fetchAllKnowledgeBaseResources } from "@/app/api/requests/resources/listAllResources";
import { knowledgeBasesState, knowledgeBaseResourcesState } from "../../state/atoms";
import { KnowledgeBase } from "../../api/requests/knowledgeBase/types";
import { LoadingSkeleton } from "../common/loadingSkeleton";
import { Trash2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Resource } from "../../api/requests/resources/types";

const EmptyKnowledgeBaseList = () => (
  <div className="p-4 bg-white rounded-lg h-[400px] overflow-auto">
    <h1 className="text-lg font-semibold mb-2 text-gray-800">Knowledge Base Overview</h1>
    <p className="text-gray-600 mb-4 text-xs">You haven&apos;t created any knowledge bases yet.</p>
  </div>
);

interface KnowledgeBaseItemProps {
  knowledgeBase: KnowledgeBase;
  resources: Resource[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isPendingDelete: boolean;
  isLastItem: boolean;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, isDeleting }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this knowledge base? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const KnowledgeBaseItem: React.FC<KnowledgeBaseItemProps> = ({ 
  knowledgeBase, 
  resources, 
  onDelete, 
  isDeleting, 
  isPendingDelete, 
  isLastItem 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="p-2 border rounded-lg text-xs">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-sm font-semibold text-black">{knowledgeBase.name}</h2>
          <button
            className="text-red-500 hover:text-red-700"
            disabled={isDeleting || isPendingDelete}
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash2Icon size={16} />
          </button>
        </div>
        <div className="text-gray-500">
          <p><span className="font-medium">Created:</span> {new Date(knowledgeBase.created_at).toLocaleString()}</p>
          <p><span className="font-medium">Connection ID:</span> {knowledgeBase.connection_id}</p>
          <p><span className="font-medium">Knowledge Base ID:</span> {knowledgeBase.knowledge_base_id}</p>
          <div className="mt-2">
            <p className="font-medium text-gray-600">Indexed Files:</p>
            <ul className="list-disc pl-4 mt-1 text-gray-500">
              {resources?.filter(resource => resource.status === "indexed").map((resource, index) => (
                <li key={index} className="break-words">{resource.inode_path.path}</li>
              )) || <li>No indexed files available</li>}
            </ul>
          </div>
        </div>
      </div>
      {!isLastItem && <hr className="my-3 border-gray-200" />}
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          onDelete(knowledgeBase.knowledge_base_id);
          setIsDialogOpen(false);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export const KnowledgeBaseList = () => {
    const { data: knowledgeBases, isLoading, error } = useListKnowledgeBases();
    const [, setKnowledgeBases] = useRecoilState(knowledgeBasesState);
    const [knowledgeBaseResources, setKnowledgeBaseResources] = useRecoilState(knowledgeBaseResourcesState);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (knowledgeBases) {
            knowledgeBases.forEach(kb => {
                fetchAllKnowledgeBaseResources(kb.knowledge_base_id, "/").then(resources => {
                    setKnowledgeBaseResources(prevState => new Map(prevState).set(kb.knowledge_base_id, resources));
                });
            });
        }
    }, [knowledgeBases, setKnowledgeBases, setKnowledgeBaseResources]);

    const deleteMutation = useMutation({
        mutationFn: deleteKb,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list_knowledge_bases'] });
        },
    });

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteMutation.mutateAsync(id);
        } catch (error) {
            console.error("Failed to delete knowledge base:", error);
        } finally {
            setDeletingId(null);
            setKnowledgeBases(prevState => prevState.filter(kb => kb.knowledge_base_id !== id));
            setKnowledgeBaseResources(prevState => {
                const newState = new Map(prevState);
                newState.delete(id);
                return newState;
            });
        }
    };

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <p className="text-sm text-red-500">Error: {error.message}</p>;
    if (!knowledgeBases || knowledgeBases.length === 0) return <EmptyKnowledgeBaseList />;

    return (
      <div className="p-4 bg-white rounded-lg h-[600px] overflow-auto">
        <h1 className="text-lg font-semibold mb-2 text-gray-800">Knowledge Base Overview</h1>
        <p className="text-gray-600 mb-4 text-xs">A comprehensive list of your knowledge bases and their details.</p>
        <div className="space-y-4">
          {knowledgeBases.map((knowledgeBase: KnowledgeBase, index: number) => (
            <KnowledgeBaseItem
              key={knowledgeBase.knowledge_base_id}
              knowledgeBase={knowledgeBase}
              resources={knowledgeBaseResources.get(knowledgeBase.knowledge_base_id) || []}
              onDelete={handleDelete}
              isDeleting={deletingId === knowledgeBase.knowledge_base_id}
              isPendingDelete={deleteMutation.isPending}
              isLastItem={index === knowledgeBases.length - 1}
            />
          ))}
        </div>
      </div>
    );
}