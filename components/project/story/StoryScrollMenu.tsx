"use client";

import { useEffect, useState } from "react";

interface StoryScrollMenuProps {
  items: Array<{ id: string; label: string }>;
}

/** Sticky side menu that highlights the section in view (Meta case study style). */
export function StoryScrollMenu({ items }: StoryScrollMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (targets.length === 0) return;

    const update = () => {
      // Active = last section whose top has passed 40% of the viewport.
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= line) current = target.id;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav className="story-scroll-menu" aria-label="Case study sections">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-active={activeId === item.id}
          onClick={(event) => {
            const target = document.getElementById(item.id);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", `#${item.id}`);
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
