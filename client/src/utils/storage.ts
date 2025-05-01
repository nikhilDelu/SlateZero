import { DocumentData } from "../types/Document";

export const getDocuments = (): DocumentData[] => {
  return JSON.parse(localStorage.getItem("documents") || "[]");
};

let saveTimeout: NodeJS.Timeout;

export const saveDocument = (doc: DocumentData) => {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index !== -1) docs[index] = doc;
  else docs.push(doc);
  localStorage.setItem("documents", JSON.stringify(docs));
};

export const debounceSaveDocument = (doc: DocumentData) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(
      "docs",
      JSON.stringify(getDocuments().map((d) => (d.id === doc.id ? doc : d)))
    );
  }, 1000); // Save 1s after the last change
};

export const saveDocuments = (docs: DocumentData[]) => {
  localStorage.setItem("documents", JSON.stringify(docs));
};

export const deleteDocumentById = (id: string) => {
  console.log("line 20");
  const docs = getDocuments();
  console.log("line 22", id);
  const updatedDocs = docs.filter((doc) => doc.id !== id);
  saveDocuments(updatedDocs);
};
