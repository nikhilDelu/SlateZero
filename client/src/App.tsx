import { useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./Sidebar/Sidebar";
import { DocumentData } from "./types/Document";
import { saveDocument } from "./utils/storage";

const App: React.FC = () => {
  const [currentDoc, setCurrentDoc] = useState<DocumentData | null>(null);

  const createNewDocument = () => {
    const id = Date.now().toString();
    const newDoc: DocumentData = {
      id,
      title: `Untitled Document`,
      blocks: [],
      updatedAt: Date.now(),
    };
    saveDocument(newDoc);
    setCurrentDoc(newDoc);
  };
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar onSelect={setCurrentDoc} onCreate={createNewDocument} />
      <div className="w-full">
        {currentDoc ? (
          <Editor doc={currentDoc} setDoc={setCurrentDoc} />
        ) : (
          <div className="text-white p-10">Select or create a document</div>
        )}
      </div>
    </div>
  );
};

export default App;
