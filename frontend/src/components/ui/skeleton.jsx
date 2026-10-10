import React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[var(--skeleton-bg)] backdrop-blur-sm',
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex gap-4 pb-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6">
      <Skeleton className="h-4 w-1/3 mb-6" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function ListSkeleton({ items = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="glass-card p-4 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
