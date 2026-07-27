import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-card rounded-xl shadow-card border border-line p-5 ${className}`}>
      {title && (
        <h2 className="font-display text-lg font-semibold text-ink mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
