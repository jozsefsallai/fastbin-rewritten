import { ControlledEditor } from '@monaco-editor/react';
import checkMobile from 'ismobilejs';
import { useState, useEffect } from 'react';
import MobileEditor from './MobileEditor';

export interface EditorOpts {
  contents?: string;
  readOnly?: boolean;
  language: string;
  setContents?(contents: string): any;
}

const Editor = ({ contents, readOnly, language, setContents }: EditorOpts) => {
  const editorOptions = {
    fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
    fontLigatures: true,
    lineHeight: 22,
    readOnly
  };

  const [ isMobile, setIsMobile ] = useState(false);

  useEffect(() => {
    setIsMobile(checkMobile(window.navigator).any);
  }, []);

  const handleEditorChange = setContents
    ? (_, value) => setContents(value)
    : undefined;

  if (isMobile) {
    return (
      <MobileEditor
        contents={contents}
        readOnly={readOnly}
        setContents={setContents}
      />
    );
  }

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
