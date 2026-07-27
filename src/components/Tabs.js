import React from "react";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex bg-surface border border-line rounded-lg p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            active === tab.id ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
