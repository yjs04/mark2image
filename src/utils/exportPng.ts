import html2canvas from "html2canvas";

export async function exportAsPng(
  container: HTMLElement,
  filename: string
) {
  const pages = container.querySelectorAll(
    ".markdown-preview"
  ) as NodeListOf<HTMLElement>;

  if (!pages.length) return;

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download =
      pages.length === 1
        ? `${filename}.png`
        : `${filename}-${i + 1}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
