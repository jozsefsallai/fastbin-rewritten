import { ControlledEditor } from '@monaco-editor/react';

export interface EditorOpts {
  contents?: string;
  readonly?: boolean;
  language: string;
  setContents(contents: string): any;
}

const Editor = ({ contents, readonly, language, setContents }: EditorOpts) => {
  const editorOptions = {
    fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
    fontLigatures: true,
    lineHeight: 22,
    readonly
  };

  const handleEditorChange = (_, value) => setContents(value);

  return (
    <ControlledEditor
      language={language}
      value={contents}
      onChange={handleEditorChange}
      theme="dark"
      wrapperClassName="editor"
      options={editorOptions}
    />
  );
};

export default Editor;
