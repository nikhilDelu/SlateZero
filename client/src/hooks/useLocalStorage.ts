export const loadDocuments = (): { id: string; title: string }[] => {
  const savedDocs = localStorage.getItem("documents");
  if (savedDocs) {
    return JSON.parse(savedDocs);
  }
  return [];
};

export const saveDocuments = (documents: { id: string; title: string }[]) => {
  localStorage.setItem("documents", JSON.stringify(documents));
};
