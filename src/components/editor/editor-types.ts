export type EditorProps = {
  contents?: string;
  readOnly?: boolean;
  language: string;
  setContents?(contents: string): void | Promise<void>;
};
