"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Basic regex to find H2 IDs and text
    const h2Regex = /<h2 id="([^"]+)">([^<]+)<\/h2>/g;
    const items: TocItem[] = [];
    let match;

    while ((match = h2Regex.exec(content)) !== null) {
      items.push({ id: match[1], text: match[2] });
    }
    setToc(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-900/50 rounded-lg p-[16px_20px] mb-12 border-l-[3px] border-[#0f69c5] shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-[#0f69c5]">
        <h2 className="text-[14px] font-bold uppercase tracking-widest">En este artículo:</h2>
      </div>
      <nav>
        <ul className="flex flex-col gap-[6px]">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`text-[14px] font-medium transition-colors hover:text-[#0f69c5]/80 text-[#0f69c5] flex items-center gap-2`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    const offset = 100; // Offset for navbar
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });
                  }
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f69c5]/20 shrink-0" />
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
