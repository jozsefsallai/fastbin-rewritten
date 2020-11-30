import AppTemplate from '@/components/AppTemplate';
import { ControlledEditor as Editor } from '@monaco-editor/react';

const ERROR_PAGE = `# Error 500

Something bad happened on the server side. This might be a temporary issue, so
please try checking back later. If the problem persists, please report the it in
the project's issue tracker:

https://github.com/jozsefsallai/fastbin-rewritten/issues
`;

const InternalServerError = () => {
  const editorOptions = {
    fontFamily: '"Fira Code", "Consolas", "Courier New", monospace',
    fontLigatures: true,
    lineHeight: 22,
    readOnly: true
  };

  return (
    <AppTemplate navigation={[]}>
      <Editor
        language="markdown"
        value={ERROR_PAGE}
        theme="dark"
        wrapperClassName="editor"
        options={editorOptions}
      />
    </AppTemplate>
  );
};

export default InternalServerError;
