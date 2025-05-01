import { DocumentData } from "../types/Document";
import { getDocuments, deleteDocumentById } from "../utils/storage";
import { useEffect, useState } from "react";

interface SidebarProps {
  onSelect: (doc: DocumentData) => void;
  onCreate: () => void;
  currentDocId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelect,
  onCreate,
  currentDocId,
}) => {
  const [docs, setDocs] = useState<DocumentData[]>([]);

  const refreshDocs = () => setDocs(getDocuments());

  useEffect(() => {
    refreshDocs();
  }, []);
  const deleteDoc = (id: string) => {
    deleteDocumentById(id);
    refreshDocs();
  };

  return (
    <div className="w-64 bg-white/5 p-4">
      <button onClick={onCreate} className="text-white font-bold mb-4">
        + New Document
      </button>
      {docs.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between gap-2 py-1 group"
        >
          <span
            className={`cursor-pointer text-sm truncate max-w-[120px] ${
              doc.id === currentDocId ? "text-blue-400 font-semibold" : ""
            }`}
            onClick={() => onSelect(doc)}
          >
            {doc.title || "Untitled Document"}
          </span>
          <button
            className="text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => deleteDoc(doc.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
export default Sidebar;
