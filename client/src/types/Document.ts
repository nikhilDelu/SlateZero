import { Block } from "./Block";

export interface DocItemProps {
  documentId: string;
  title: string;
  onClick: (documentId: string) => void;
}
export interface DocumentData {
  id: string;
  title: string;
  blocks: Block[];
  updatedAt: number;
}
