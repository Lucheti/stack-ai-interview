
export interface Resource {
    knowledge_base_id: string;
    created_at: string;
    modified_at: string;
    indexed_at: string | null;
    inode_type: 'directory' | 'file';
    resource_id: string;
    inode_path: {
        path: string;
    };
    inode_id: string | null;
    content_hash?: string;
    content_mime?: string;
    size?: number;
    status?: string;
}
