import { pdfToImages, fileToBase64 } from "@/lib/pdf-to-img";

export async function extractStudentAnswers(
  answerSheet: File
) {
  let pageImages: string[];

  if (answerSheet.type === "application/pdf") {
    pageImages = await pdfToImages(answerSheet);
  } else {
    pageImages = [await fileToBase64(answerSheet)];
  }

  const response = await fetch("/api/extract-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageImages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Answer extraction failed"
    );
  }

  return data.answers;
}