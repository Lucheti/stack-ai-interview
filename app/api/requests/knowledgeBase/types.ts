export interface EmbeddingParams {
  api: string | null;
  embedding_model: string;
  batch_size: number;
  track_usage: boolean;
  timeout: number;
}

export interface ChunkerParams {
  chunk_size: number;
  chunk_overlap: number;
  chunker_type: string;
}

export interface IndexingParams {
  ocr: boolean;
  unstructured: boolean;
  embedding_params: EmbeddingParams;
  chunker_params: ChunkerParams;
}

export interface KnowledgeBase {
  knowledge_base_id: string;
  connection_id: string;
  created_at: string;
  updated_at: string;
  connection_source_ids: string[];
  is_empty: boolean;
  name: string;
  description: string;
  indexing_params: IndexingParams;
  cron_job_id: string | null;
  org_id: string;
  org_level_role: string | null;
}

export interface KnowledgeBaseResponse {
  admin: KnowledgeBase[];
}
