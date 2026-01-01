"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ThumbsUp,
    Plus,
    Tag,
    CheckCircle2,
    Clock,
    XCircle,
    Pause,
    Lightbulb,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { SubmitFeatureModal } from "@/components/features/submit-feature-modal";
import { AppLayout } from "@/components/layout/app-layout";
import {
    useFeatureRequests,
    useVoteFeatureRequest,
    useUnvoteFeatureRequest,
} from "@/lib/hooks/use-feature-requests";

interface FeatureRequestResponseDto {
    id: string;
    title: string;
    description: string;
    status: string;
    tags: string[];
    upvotes: number;
    hasUserVoted: boolean;
    creator: {
        id: string;
        email: string;
        displayName: string;
    };
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function FeaturesPage() {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("votes");
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const { data: features, isLoading, error } = useFeatureRequests(
        selectedStatus === "all" ? undefined : selectedStatus,
        undefined,
        sortBy,
        "DESC"
    );

    const voteMutation = useVoteFeatureRequest();
    const unvoteMutation = useUnvoteFeatureRequest();

    const statuses = [
        { id: "all", label: "All", icon: Lightbulb, color: "text-foreground" },
        {
            id: "proposed",
            label: "Proposed",
            icon: Lightbulb,
            color: "text-blue-500",
        },
        {
            id: "under-review",
            label: "Under Review",
            icon: Clock,
            color: "text-yellow-500",
        },
        {
            id: "planned",
            label: "Planned",
            icon: CheckCircle2,
            color: "text-green-500",
        },
        {
            id: "in-progress",
            label: "In Progress",
            icon: Clock,
            color: "text-purple-500",
        },
        {
            id: "completed",
            label: "Completed",
            icon: CheckCircle2,
            color: "text-green-600",
        },
        {
            id: "postponed",
            label: "Postponed",
            icon: Pause,
            color: "text-gray-500",
        },
        {
            id: "rejected",
            label: "Rejected",
            icon: XCircle,
            color: "text-red-500",
        },
    ];

    const getStatusIcon = (status: string) => {
        const statusConfig = statuses.find((s) => s.id === status);
        return statusConfig || statuses[0];
    };

    const getStatusBadgeClass = (status: string) => {
        const baseClass =
            "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5";
        const colorMap: Record<string, string> = {
            proposed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
            "under-review":
                "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
            planned:
                "bg-green-500/10 text-green-600 border border-green-500/20",
            "in-progress":
                "bg-purple-500/10 text-purple-500 border border-purple-500/20",
            completed:
                "bg-green-600/10 text-green-700 border border-green-600/20",
            postponed:
                "bg-gray-500/10 text-gray-600 border border-gray-500/20",
            rejected: "bg-red-500/10 text-red-500 border border-red-500/20",
        };
        return `${baseClass} ${colorMap[status] || colorMap.proposed}`;
    };

    const handleVote = async (featureId: string, hasVoted: boolean) => {
        if (hasVoted) {
            await unvoteMutation.mutateAsync(featureId);
        } else {
            await voteMutation.mutateAsync(featureId);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-background p-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold font-display mb-2">
                            Feature <span className="gradient-text">Roadmap</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Vote for features you'd like to see and submit your own
                            ideas
                        </p>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            Submit Idea
                        </button>

                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="votes">Most Voted</option>
                                <option value="newest">Newest</option>
                                <option value="updated">Recently Updated</option>
                            </select>
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                        {statuses.map((status) => {
                            const Icon = status.icon;
                            return (
                                <button
                                    key={status.id}
                                    onClick={() => setSelectedStatus(status.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedStatus === status.id
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-card hover:bg-muted border border-border"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {status.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground">
                                Loading features...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                            <p className="text-destructive font-semibold mb-2">
                                Failed to load features
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {error.message}
                            </p>
                        </div>
                    )}

                    {/* Feature Cards */}
                    {!isLoading && !error && (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {features && features.length > 0 ? (
                                    features.map((feature: FeatureRequestResponseDto) => {
                                        const statusConfig = getStatusIcon(
                                            feature.status
                                        );
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <motion.div
                                                key={feature.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex gap-6">
                                                    {/* Vote Button */}
                                                    <div className="flex flex-col items-center gap-1">
                                                        <button
                                                            onClick={() =>
                                                                handleVote(
                                                                    feature.id,
                                                                    feature.hasUserVoted
                                                                )
                                                            }
                                                            disabled={
                                                                voteMutation.isPending ||
                                                                unvoteMutation.isPending
                                                            }
                                                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all disabled:opacity-50 ${feature.hasUserVoted
                                                                ? "bg-primary text-white"
                                                                : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
                                                                }`}
                                                        >
                                                            <ThumbsUp
                                                                className={`w-6 h-6 ${feature.hasUserVoted
                                                                    ? "fill-current"
                                                                    : ""
                                                                    }`}
                                                            />
                                                            <span className="text-sm font-bold mt-1">
                                                                {feature.upvotes}
                                                            </span>
                                                        </button>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-2">
                                                                    {feature.title}
                                                                </h3>
                                                                <div
                                                                    className={getStatusBadgeClass(
                                                                        feature.status
                                                                    )}
                                                                >
                                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                                    {
                                                                        statusConfig.label
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <p className="text-muted-foreground mb-4">
                                                            {feature.description}
                                                        </p>

                                                        {/* Tags */}
                                                        {feature.tags &&
                                                            feature.tags.length >
                                                            0 && (
                                                                <div className="flex flex-wrap gap-2 mb-4">
                                                                    {feature.tags.map(
                                                                        (tag: string) => (
                                                                            <span
                                                                                key={
                                                                                    tag
                                                                                }
                                                                                className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                                                                            >
                                                                                <Tag className="w-3 h-3" />
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}

                                                        {/* Footer */}
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>
                                                                by{" "}
                                                                {
                                                                    feature.creator
                                                                        .displayName
                                                                }
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {new Date(
                                                                    feature.createdAt
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-16">
                                        <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-xl font-semibold mb-2">
                                            No features found
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            Be the first to submit a feature
                                            request!
                                        </p>
                                        <button
                                            onClick={() =>
                                                setShowSubmitModal(true)
                                            }
                                            className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                        >
                                            Submit Your Idea
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Submit Modal */}
                <SubmitFeatureModal
                    isOpen={showSubmitModal}
                    onClose={() => setShowSubmitModal(false)}
                />
            </div>
        </AppLayout>
    );
}
