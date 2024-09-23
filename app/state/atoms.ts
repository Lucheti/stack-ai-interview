import { atom, selector } from 'recoil';
import { Resource } from '../api/requests/resources/types';
import { KnowledgeBase } from '../api/requests/knowledgeBase/types';
export const selectedConnectionState = atom<string | null>({
    key: 'selectedConnectionState',
    default: null,
});

export const selectedResourcesState = atom<Set<string>>({
    key: 'selectedResourcesState',
    default: new Set(),
});

// Map<resource_path, resource>
export const resourceDataMapState = atom<Map<string, Resource>>({
    key: 'resourceDataMapState',
    default: new Map(),
});

export const knowledgeBasesState = atom<KnowledgeBase[]>({
    key: 'knowledgeBasesState',
    default: [],
});

// New atoms for sorting, filtering, and searching
export const resourceSortState = atom<(a: Resource, b: Resource) => number>({
    key: 'resourceSortState',
    default: (a, b) => a.inode_path.path.localeCompare(b.inode_path.path),
});

export const resourceSearchState = atom<string>({
    key: 'resourceSearchState',
    default: '',
});

// Selector that applies sorting, filtering, and searching
export const processedResourceDataState = selector<Resource[]>({
    key: 'processedResourceDataState',
    get: ({get}) => {
        const resourceDataMap = get(resourceDataMapState);
        const sortFn = get(resourceSortState);
        const searchTerm = get(resourceSearchState).toLowerCase();
        const filteredResources = Array.from(resourceDataMap.values())
            .filter(resource => resource.inode_path.path.toLowerCase().includes(searchTerm))
        
        const filteredResources2 = Array.from(resourceDataMap.values())
        .filter(resource => filteredResources.some(r => r.inode_path.path.includes(resource.inode_path.path)))
        .sort(sortFn);

        return filteredResources2;
    },
});

// Atom to hold a map of knowledge base IDs to their respective resources
export const knowledgeBaseResourcesState = atom<Map<string, Resource[]>>({
    key: 'knowledgeBaseResourcesState',
    default: new Map(),
});


// Atom to hold the count of loaded files and total files being loaded
export const fileLoadingProgressState = atom<{ loadedFiles: number; totalFiles: number }>({
    key: 'fileLoadingProgressState',
    default: { loadedFiles: 0, totalFiles: 0 },
});
