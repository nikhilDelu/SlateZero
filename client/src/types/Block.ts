export type BlockType = "heading" | "paragraph" | "list" | "code" | "image";
export interface Block {
  id: string;
  type: BlockType;
  content: string;
}
