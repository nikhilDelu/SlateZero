import { DocumentData } from "../types/Document";
import { getDocuments } from "../utils/storage";
import { useEffect, useState } from "react";

interface SidebarProps {
  onSelect: (doc: DocumentData) => void;
  onCreate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, onCreate }) => {
  const [docs, setDocs] = useState<DocumentData[]>([]);

  useEffect(() => {
    setDocs(getDocuments());
  }, []);

  return (
    <div className="w-64 bg-white/5 p-4">
      <button onClick={onCreate} className="text-white font-bold mb-4">
        + New Document
      </button>
      {docs.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc)}
          className="text-white cursor-pointer mt-2"
        >
          {doc.title}
        </div>
      ))}
    </div>
  );
};
export default Sidebar;
