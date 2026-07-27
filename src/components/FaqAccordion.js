import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="divide-y divide-line">
      {items.map((item, index) => {
        const isOpen = openId === index;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenId(isOpen ? null : index)}
              className="w-full flex items-center justify-between text-left py-3.5 gap-3"
            >
              <span className="text-sm font-medium text-ink">{item.question}</span>
              <ChevronDown
                size={16}
                className={`text-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <p className="text-sm text-muted leading-relaxed pb-4 pr-6">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
