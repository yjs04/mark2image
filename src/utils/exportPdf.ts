import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export async function exportAsPdf(
  container: HTMLElement,
  fileName: string
) {
  const pages = container.querySelectorAll(".shadow-md");
  if (!pages.length) return;

  const pdf = new jsPDF("p", "px", "a4");

  for (let i = 0; i < pages.length; i++) {
    const pageEl = pages[i] as HTMLElement;

    const canvas = await htmlToImage.toCanvas(pageEl, {
      backgroundColor: "#ffffff",
      pixelRatio: 2, // 인쇄 선명도
    });

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const scale = Math.min(
      pdfWidth / imgWidth,
      pdfHeight / imgHeight
    );

    const renderWidth = imgWidth * scale;
    const renderHeight = imgHeight * scale;

    const x = (pdfWidth - renderWidth) / 2;
    const y = 0;

    if (i !== 0) pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      x,
      y,
      renderWidth,
      renderHeight
    );
  }

  pdf.save(`${fileName}.pdf`);
}
