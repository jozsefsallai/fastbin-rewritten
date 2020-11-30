import { ControlledEditor as Editor } from '@monaco-editor/react';

export interface EditorWrapperOpts {
  contents?: string;
  readonly?: boolean;
  language: string;
  setContents(contents: string): any;
}

const EditorWrapper = ({ contents, readonly, language, setContents }: EditorWrapperOpts) => {
  const editorOptions = {
    fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
    fontLigatures: true,
    lineHeight: 22,
    readonly
  };

  const handleEditorChange = (_, value) => setContents(value);

  return (
    <Editor
      language={language}
      value={contents}
      onChange={handleEditorChange}
      theme="dark"
      wrapperClassName="editor"
      options={editorOptions}
    />
  );
};

export default EditorWrapper;
