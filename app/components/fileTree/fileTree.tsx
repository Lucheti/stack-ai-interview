"use client"
import React from "react";
import { useRecoilState } from "recoil";
import { resourceSearchState } from "../../state/atoms";
import { Resource } from "../resource/resource";
import { useFileTree } from "./hooks/useFileTree";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import { motion } from "framer-motion";

const FileTreeHeader: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
    >
        <h2 className="text-gray-600 mb-1 text-sm">File Tree</h2>
        <p className="text-xs text-muted-foreground">Select the files you want to include in the knowledge base.</p>
    </motion.div>
);

export const FileTree: React.FC = () => {
    const { resources, handleSort, activeSorter, loadingProgress } = useFileTree();
    const [searchTerm, setSearchTerm] = useRecoilState(resourceSearchState);

    if (!resources.length) {
        return (
            <div className="flex flex-col h-full">
                <FileTreeHeader />
                <div className="flex flex-col items-center justify-center flex-grow mt-10">
                    <AnimatedCircularProgressBar
                        max={loadingProgress.total}
                        min={0}
                        value={loadingProgress.loaded}
                        gaugePrimaryColor="rgb(79 70 229)"
                        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                    />
                    <p className="mt-4 text-sm text-gray-600">
                        Loading files
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col h-full">
            <FileTreeHeader />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mb-2"
            >
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-1 pl-8 pr-4 border rounded text-sm"
                    aria-label="Search files"
                />
                <svg
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-2 flex items-center space-x-2 text-xs"
            >
                <span className="text-gray-600">Sort by:</span>
                {['dateCreated', 'dateModified', 'size'].map((sortType) => (
                    <button 
                        key={sortType}
                        onClick={() => handleSort(sortType)} 
                        className={`px-2 py-1 ${activeSorter === sortType ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded transition-colors duration-200`}
                        aria-pressed={activeSorter === sortType}
                    >
                        {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                    </button>
                ))}
            </motion.div>
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
                className="px-4 bg-white rounded-md h-[350px] overflow-y-auto"
            >
                <ul className="w-full" role="tree">
                    {resources.map((resource, index) => (
                        <motion.li
                            key={resource.resource_id}
                            role="treeitem"
                            initial={{ scale: 0, x: -20 }}
                            animate={{ scale: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                            <Resource resource={resource} />
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};