import { forwardRef, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { createRoot } from "react-dom/client";

interface Props {
  text: string;
  pageSize: string;
  margin: number;
  mode: "single" | "paged";
}

const sizeMap: Record<string, { w: number; h: number }> = {
  A4: { w: 794, h: 1123 },
  B5: { w: 729, h: 1032 },
  Letter: { w: 816, h: 1056 },
};

const MarkdownPreview = forwardRef<HTMLDivElement, Props>(function MarkdownPreview(
  { text, pageSize, margin, mode },
  ref
) {
  const normalizedText = text.replace(/\r\n/g, "\n");

  const size = sizeMap[pageSize];
  const hiddenRef = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<string[]>([]);

  const SAFE_OFFSET = 200;
  const printableHeight = size.h - margin * 2 - SAFE_OFFSET;

  /** 블록 단위로 split (문단/리스트/제목 유지) */
  // const blocks = text.split(/\n{2,}/g);
  const blocks = normalizedText.split("\n\n");

  /** 페이지 계산 */
  useEffect(() => {
  if (mode === "single") {
    setPages([]);
    return;
  }
  if (mode !== "paged") return;
  if (!hiddenRef.current) return;

  // 👉 즉시 반응용 임시 페이지
  setPages([text]);

  const el = hiddenRef.current;
  el.innerHTML = "";

  const container = document.createElement("div");
  el.appendChild(container);
  const root = createRoot(container);

  const measure = (content: string): Promise<number> =>
    new Promise((resolve) => {
      root.render(
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {content}
        </ReactMarkdown>
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(el.scrollHeight);
        });
      });
    });

  const paginate = async () => {
    const result: string[] = [];
    let current = "";

    for (const block of blocks) {
      const test = current ? `${current}\n\n${block}` : block;
      const height = await measure(test);

      if (height > printableHeight) {
        if (current.trim()) result.push(current);
        current = block;
      } else {
        current = test;
      }
    }

    if (current.trim()) result.push(current);
    setPages(result);
    root.unmount();
  };

  // ⭐⭐⭐ 여기
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(paginate, { timeout: 300 });
  } else {
    setTimeout(paginate, 0);
  }
}, [text, pageSize, margin, mode]);


  /** 단일 페이지 모드 */
  if (mode === "single") {
    return (
      <div
        ref={ref}
        className="flex justify-center py-10 bg-white markdown-preview"
      >
        <div
          className="bg-white shadow-md markdown-preview"
          style={{ width: size.w, padding: margin }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{text}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 숨겨진 측정용 영역 */}
      <div
        ref={hiddenRef}
        style={{
          width: size.w - margin * 2,
          padding: margin,
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          left: -9999,
          top: 0,
          boxSizing: "border-box",
        }}
      />

      <div ref={ref} className="flex flex-col items-center gap-10 py-10">
        {pages.map((page, i) => (
          <div
            key={i}
            className="bg-white shadow-md markdown-preview"
            style={{
              width: size.w,
              height: size.h,
              padding: margin,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {page}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </>
  );
});

export default MarkdownPreview;
