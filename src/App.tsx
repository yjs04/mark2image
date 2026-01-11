import { useRef, useState } from "react";
import MarkdownPreview from "./components/MarkdownPreview";
import { exportAsPdf } from "./utils/exportPdf";
import { exportAsPng } from "./utils/exportPng";

function App() {
  const [text, setText] = useState(`# 마크다운 입력 예시

# 제목 1 (H1)
## 제목 2 (H2)
### 제목 3 (H3)
#### 제목 4 (H4)  

---

## 텍스트 강조

- **굵은 글씨**
- *기울임*
- ***굵고 기울임***
- ~~취소선~~
- \`인라인 코드\`

---

## 문단과 줄바꿈

이것은 일반 문단입니다.

문단 사이에는 빈 줄이 필요합니다.  
문장 끝에 스페이스 두 개를 넣으면 줄바꿈이 됩니다.

---

## 목록

### 순서 없는 목록
- 사과
- 바나나
  - 노란 바나나
  - 초록 바나나
- 오렌지

### 순서 있는 목록
1. 첫 번째
2. 두 번째
3. 세 번째

---

## 체크리스트 (Todo)

- [x] 완료한 작업
- [ ] 아직 안 한 작업

---

## 링크와 이미지

[구글로 이동](https://www.google.com)

![이미지 설명](https://via.placeholder.com/150)

---

## 인용문

> 이것은 인용문입니다.  
> 여러 줄도 가능합니다.

---

## 코드 블록

### JavaScript
\`\`\`js
function hello() {
  console.log("Hello, Markdown!");
}`);

  const [pageSize, setPageSize] = useState<"A4" | "B5" | "Letter">("A4");
  const [margin, setMargin] = useState(40);
  const [previewMode, setPreviewMode] = useState<"single" | "paged">("single");

  const previewRef = useRef<HTMLDivElement | null>(null);

  const askFileName = (defaultName = "markdown") => {
    const name = prompt("파일 이름을 입력하세요", defaultName);
    if (name === null) return null; // 취소
    return name.trim() || defaultName;
  };

  // ✅ PNG 저장 (흰 배경)
  const exportPng = async () => {
    const name = askFileName();
    console.log(name);
    console.log(previewRef.current);
    if (!name) return;
    if (!previewRef.current) return;
    await exportAsPng(previewRef.current!, name);
  };

  // ✅ PDF 저장 (여러 페이지 자동 분할)
  const exportPdf = async () => {
    const name = askFileName();
    if (!name) return;
    if (!previewRef.current) return;
    await exportAsPdf(previewRef.current, name);
  };

  return (
    <div className="flex h-screen">
      {/* ✅ 왼쪽: 마크다운 입력 */}
      <div className="w-1/2 p-4 border-r flex flex-col">
        <h2 className="font-bold mb-2">Markdown 입력</h2>
        <textarea
          className="w-full h-full border p-2 resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* ✅ 오른쪽: 미리보기 */}
      <div className="w-1/2 p-4 overflow-auto">
        {/* ✅ 상단 컨트롤 패널 */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {/* ✅ 페이지 사이즈 */}
          <select
            value={pageSize}
            onChange={(e) =>
              setPageSize(e.target.value as "A4" | "B5" | "Letter")
            }
            className="border px-2 py-1"
          >
            <option value="A4">A4</option>
            <option value="B5">B5</option>
            <option value="Letter">Letter</option>
          </select>

          {/* 여백 숫자 입력 */}
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="border px-2 py-1 w-24"
            placeholder="여백(px)"
          />

          {/* 여백 슬라이더 */}
          <input
            type="range"
            min={10}
            max={120}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-sm text-gray-600">{margin}px</span>

          {/* ✅ 저장 버튼 */}
          <button
            onClick={exportPng}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            PNG 저장
          </button>

          <button
            onClick={exportPdf}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            PDF 저장
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 items-center">
          {/* 미리보기 모드 */}
          <button
            onClick={() => setPreviewMode("single")}
            className={`px-3 py-1 rounded ${
              previewMode === "single"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            한 페이지 보기
          </button>

          <button
            onClick={() => setPreviewMode("paged")}
            className={`px-3 py-1 rounded ${
              previewMode === "paged"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            여러 페이지 보기
          </button>
        </div>

        {/* ✅ 미리보기 영역 */}
        <MarkdownPreview
          ref={previewRef}
          text={text}
          pageSize={pageSize}
          margin={margin}
          mode={previewMode}
        />
      </div>
    </div>
  );
}

export default App;
