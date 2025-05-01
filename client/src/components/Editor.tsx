import { Block, BlockType } from "../types/Block";
import { Key, useEffect, useRef, useState } from "react";
import { saveDocument } from "../utils/storage";
import { DocumentData } from "../types/Document";

interface EditorProps {
  doc: DocumentData;
  setDoc: (doc: DocumentData) => void;
}

const Editor: React.FC<EditorProps> = ({ doc, setDoc }) => {
  const refMap = useRef<Record<string, HTMLElement | null>>({});

  const blockStyle =
    "rounded-lg p-2 bg-white/5 text-gray-300 max-w-[calc(100%-16px)] min-w-[calc(100%-16px)] m-2 whitespace-pre-wrap break-words overflow-x-auto";

  const updateBlocks = (id: string) => {
    const ref = refMap.current[id];
    if (ref) {
      const newContent = ref.innerText;
      const newBlocks: Block[] = doc.blocks.map((block: Block) =>
        block.id === id ? { ...block, content: newContent } : block
      );
      setDoc({ ...doc, blocks: newBlocks, updatedAt: Date.now() });
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
        refMap.current[block.id] = el;
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
            {listItems || ""}
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

  return (
    <div className="h-full text-white">
      <div className="w-full flex justify-center">
        <div className="bg-white/5 flex justify-around items-center border border-white/40 rounded-lg m-2 mx-2 text-xs w-full h-10 max-w-2xl mx-auto">
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
      </div>
      <div>
        {doc.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
