import { ChangeEvent, MouseEvent } from "react";

export interface MobileEditorOpts {
  contents?: string;
  readOnly?: boolean;
  setContents(contents: string): any;
}

const MobileEditor = ({ contents, readOnly, setContents }: MobileEditorOpts) => {
  const handleEditorChange = (e: ChangeEvent<HTMLTextAreaElement>) => setContents(e.currentTarget.value);

  const handleEditorClick = readOnly
    ? (e: MouseEvent<HTMLTextAreaElement>) => e.currentTarget.select()
    : undefined;

  return (
    <textarea
      className="editor"
      onChange={handleEditorChange}
      readOnly={readOnly}
      spellCheck="false"
      onClick={handleEditorClick}
    >{contents}</textarea>
  );
};

export default MobileEditor;
