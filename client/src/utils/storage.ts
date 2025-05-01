import { DocumentData } from "../types/Document";

export const getDocuments = (): DocumentData[] => {
  return JSON.parse(localStorage.getItem("documents") || "[]");
};

export const saveDocument = (doc: DocumentData) => {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index !== -1) docs[index] = doc;
  else docs.push(doc);
  localStorage.setItem("documents", JSON.stringify(docs));
};
