import { Component, createMemo, Show } from "solid-js";
import { I18nTag } from "werner-shared-components";

interface TimeAgoProps {
    timestamp: string; // ISO timestamp
}

export const TimeAgo: Component<TimeAgoProps> = (props) => {
    const getTimeAgo = createMemo(() => {
        const now = new Date();
        const then = new Date(props.timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        // Days
        if (diffDays > 7) return `more than 7d ago`;
        if (diffDays === 7) return `7d ago`;
        if (diffDays === 6) return `6d ago`;
        if (diffDays === 5) return `5d ago`;
        if (diffDays === 4) return `4d ago`;
        if (diffDays === 3) return `3d ago`;
        if (diffDays === 2) return `2d ago`;
        if (diffDays === 1) return `yesterday`;

        // Hours
        if (diffHours > 8) return `more than 8h ago`;
        if (diffHours === 7) return `7h ago`;
        if (diffHours === 6) return `6h ago`;
        if (diffHours === 5) return `5h ago`;
        if (diffHours === 4) return `4h ago`;
        if (diffHours === 3) return `3h ago`;
        if (diffHours === 2) return `2h ago`;
        if (diffHours === 1) return `1h ago`;

        // Minutes
        if (diffMinutes >= 30) return `less than 1h ago`;
        return `less than 30min ago`;
    });

    return <Show when={props.timestamp}>
        <span><I18nTag>{getTimeAgo()}</I18nTag></span>
    </Show>;
}; 