import { Skeleton } from "../../../components/ui/skeleton"
import React from "react";

export const LoadingSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="w-full h-full max-w-md p-4 rounded-md">
      <div className="space-y-2">
        {[...Array(count)].map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )