import AppTemplate from '@/components/AppTemplate';
import { ControlledEditor as Editor } from '@monaco-editor/react';

const ERROR_PAGE = `# Error 404

The requested page/snippet could not be found. Either it was never created, or
it got deleted from our database. If you're sure the snippet must be here,
contact me on GitHub: https://github.com/jozsefsallai

* To create a new snippet, press \`ctrl+i\`
`;

const NotFound = () => {
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

export default NotFound;
