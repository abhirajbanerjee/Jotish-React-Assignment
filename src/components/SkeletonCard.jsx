// components/SkeletonCard.jsx — Placeholder card shown while loading. Pure UI, no data.
export default function SkeletonCard() {
    return (
        <div className="employee-card skeleton-card">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-body">
                <div className="skeleton skeleton-line skeleton-line-lg" />
                <div className="skeleton skeleton-line skeleton-line-sm" />
                <div className="skeleton skeleton-line skeleton-line-md" />
                <div className="skeleton-footer">
                    <div className="skeleton skeleton-badge" />
                    <div className="skeleton skeleton-btn" />
                </div>
            </div>
        </div>
    );
}
