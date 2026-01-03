"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteStarProps {
    isFavorite?: boolean;
    className?: string;
}

export function FavoriteStar({ isFavorite, className }: FavoriteStarProps) {
    if (!isFavorite) {
        return <Star className={cn("text-muted-foreground", className)} />;
    }

    return (
        <>
            <svg width="0" height="0" className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
                <defs>
                    <linearGradient id="fav-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(250, 70%, 55%)" />
                        <stop offset="100%" stopColor="hsl(220, 70%, 55%)" />
                    </linearGradient>
                </defs>
            </svg>
            <Star
                className={cn(className)}
                style={{
                    fill: "url(#fav-star-gradient)",
                    stroke: "url(#fav-star-gradient)"
                }}
            />
        </>
    );
}
