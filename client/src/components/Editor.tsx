import { Block, BlockType } from "../types/Block";
import { Key, useEffect, useRef } from "react";
import { debounceSaveDocument, saveDocument } from "../utils/storage";
import { DocumentData } from "../types/Document";
import html2pdf from "html2pdf.js";

interface EditorProps {
  doc: DocumentData;
  setDoc: (doc: DocumentData) => void;
}

const Editor: React.FC<EditorProps> = ({ doc, setDoc }) => {
  const refMap = useRef<Record<string, HTMLElement | null>>({});
  const exportRef = useRef<HTMLDivElement>(null);
  const blockStyle =
    "p-2 border-b-2 border-[rgb(32,32,32)] text-gray-300 max-w-[calc(100%-16px)] min-w-[calc(100%-16px)] m-2 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none";

  const updateBlocks = (id: string) => {
    const ref = refMap.current[id];
    if (ref) {
      const newContent = ref.innerText;
      const newBlocks: Block[] = doc.blocks.map((block: Block) =>
        block.id === id ? { ...block, content: newContent } : block
      );
      setDoc({ ...doc, blocks: newBlocks, updatedAt: Date.now() });
      debounceSaveDocument({
        ...doc,
        blocks: newBlocks,
        updatedAt: Date.now(),
      });
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
    };
    setDoc({
      ...doc,
      blocks: [...doc.blocks, newBlock],
      updatedAt: Date.now(),
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDocument(doc);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [doc]);

  const renderBlock = (block: Block) => {
    const commonProps = {
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: blockStyle,
      ref: (el: HTMLElement | null) => {
        refMap.current[block.id] = el || null;
      },
      onBlur: () => updateBlocks(block.id),
    };

    switch (block.type) {
      case "heading":
        return (
          <h2 {...commonProps} className={`${blockStyle} text-2xl font-bold`}>
            {block.content || ""}
          </h2>
        );
      case "paragraph":
        return <p {...commonProps}>{block.content || ""}</p>;
      case "list":
        const listItems = block.content
          ? block.content
              .split("\n")
              .map((item: any, index: Key | null | undefined) => (
                <li key={index}>{item || "List item..."}</li>
              ))
          : [""].map((item, index) => <li key={index}>{item}</li>);
        return (
          <ul
            {...commonProps}
            className={`${blockStyle} list-disc list-inside`}
          >
            <li>{listItems || ""}</li>
          </ul>
        );
      case "code":
        return (
          <pre
            {...commonProps}
            className={`${blockStyle} font-mono rounded-md text-sm`}
          >
            {block.content || ""}
          </pre>
        );
      default:
        return null;
    }
  };
  const downloadText = () => {
    const content = doc.blocks.map((b) => b.content).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const downloadHTML = () => {
    const style = `
    <style>
      body {
        background-color: black;
        font-family: sans-serif;
        color: #d1d5db;
        padding: 20px;
      }
      h2 {
        font-size: 1.5rem;
        font-weight: bold;
        background-color: rgba(255,255,255,0.05);
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
      }
      p {
        background-color: rgba(255,255,255,0.05);
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
      }
      ul {
        background-color: rgba(255,255,255,0.05);
        padding: 0.5rem 1rem;
        padding-left: 1.5rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        list-style-type: disc;
      }
      pre {
        background-color: rgba(255,255,255,0.05);
        padding: 0.5rem;
        border-radius: 0.5rem;
        font-family: monospace;
        font-size: 0.9rem;
        margin: 0.5rem 0;
        overflow-x: auto;
      }
    </style>
  `;

    const htmlBlocks = doc.blocks
      .map((block) => {
        switch (block.type) {
          case "heading":
            return `<h2>${block.content}</h2>`;
          case "paragraph":
            return `<p>${block.content}</p>`;
          case "list":
            const items = block.content
              .split("\n")
              .map((i) => `<li>${i}</li>`)
              .join("");
            return `<ul>${items}</ul>`;
          case "code":
            return `<pre>${block.content}</pre>`;
          default:
            return "";
        }
      })
      .join("\n");

    const fullHTML = `<html><head><meta charset="UTF-8">${style}</head><body>${htmlBlocks}</body></html>`;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title || "document"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const downloadPDF = () => {
    const element = exportRef.current;
    if (!element) return;

    // Create a wrapper div with desired styles
    const wrapper = document.createElement("div");
    wrapper.style = "color:black"; // Apply Tailwind classes

    // Clone the export content
    const clone = element.cloneNode(true) as HTMLElement;

    // Append the cloned content inside the styled wrapper
    wrapper.appendChild(clone);

    // Append the wrapper to body temporarily (required by html2pdf)
    document.body.appendChild(wrapper);

    html2pdf()
      .from(wrapper)
      .set({
        margin: 0.5,
        filename: `${doc.title || "document"}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save()
      .then(() => {
        // Clean up the temporary wrapper after saving
        document.body.removeChild(wrapper);
      });
  };

  return (
    <div className="h-screen overflow-hidden overflow-y-scroll text-white relative">
      {/* <div className="w-full flex justify-center"> */}
      <div className="bg-[rgb(32,32,32)] z-50 backdrop-blur-md flex justify-around items-center border-b-2 border-white/5 text-xs w-full h-10 font-mono">
        <button
          className="hover:text-blue-500 hover:underline transition-all duration-100 hover:scale-105 hov w-full h-full"
          onClick={() => addBlock("heading")}
        >
          Add Heading
        </button>
        <button
          className="hover:text-blue-500 hover:underline transition-all duration-100 hover:scale-105 hov w-full h-full"
          onClick={() => addBlock("paragraph")}
        >
          Add Paragraph
        </button>
        <button
          className="hover:text-blue-500 hover:underline transition-all duration-100 hover:scale-105 hov w-full h-full"
          onClick={() => addBlock("list")}
        >
          Add List
        </button>
        <button
          className="hover:text-blue-500 hover:underline transition-all duration-100 hover:scale-105 hov w-full h-full"
          onClick={() => addBlock("code")}
        >
          Add Code Block
        </button>
      </div>
      {/* </div> */}
      <div ref={exportRef}>
        {doc.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button onClick={downloadText}>Download .txt</button>
        <button onClick={downloadHTML}>Download .html</button>
        <button onClick={downloadPDF}>Download .pdf</button>
        {/* <button onClick={downloadDOCX}>Download .docx</button> */}
      </div>
    </div>
  );
};

export default Editor;
