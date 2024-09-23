"use client"
import React, { useEffect, useState, useCallback, memo } from "react";
import { useRecoilState } from "recoil";
import { selectedConnectionState } from "../../state/atoms";
import { useListConnections } from "../../api/requests/connections/listConnections";
import { LoadingSkeleton } from "../common/loadingSkeleton";
import ShinyButton from "@/components/magicui/shiny-button";
import { Connection } from "../../api/requests/connections/types";

const ConnectionButton = memo(({ connection, isSelected, onClick }: { connection: Connection; isSelected: boolean; onClick: () => void }) => (
  <ShinyButton onClick={onClick}>
    {connection.name}
  </ShinyButton>
));

ConnectionButton.displayName = 'ConnectionButton';

export const ConnectionList: React.FC = () => {
    const [selectedConnection, setSelectedConnection] = useRecoilState(selectedConnectionState);
    const { data: connections, isLoading, error } = useListConnections();
    const [autoSelected, setAutoSelected] = useState<boolean>(false);
  
    useEffect(() => {
        if (connections && connections.length === 1 && !selectedConnection) {
            setSelectedConnection(connections[0].connection_id);
            setAutoSelected(true);
        }
    }, [connections, selectedConnection, setSelectedConnection]);

    const handleConnectionSelect = useCallback((connectionId: string) => {
        setSelectedConnection(connectionId);
    }, [setSelectedConnection]);

    if (isLoading) return <LoadingSkeleton count={1} aria-label="Loading connections" />;
    if (!connections || connections.length === 0) {
        return (
            <p className="text-sm text-gray-500" role="alert">
                No data sources available. Please add a data source to proceed.
            </p>
        );
    }

    return (
      <div className="w-full pb-6">
        <h2 className="text-gray-600 mb-2 text-sm font-semibold">Integrations</h2>
        <ul className="flex space-x-2 overflow-x-auto pb-2" role="listbox" aria-label="Available integrations">
          {connections.map((connection) => (    
            <li key={connection.connection_id} role="option" aria-selected={selectedConnection === connection.connection_id}>
              <ConnectionButton
                connection={connection}
                isSelected={selectedConnection === connection.connection_id}
                onClick={() => handleConnectionSelect(connection.connection_id)}
              />
            </li>
          ))}
        </ul>
        {autoSelected && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-2 mt-2" role="alert">
            <p className="text-xs">Your integration was automatically selected as it's the only one available.</p>
          </div>
        )}
      </div>
    );
  };