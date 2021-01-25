import AppTemplate from '@/components/AppTemplate';
import Editor from '@/components/editor/Editor';

const ERROR_PAGE = `# Error 404

The requested page/snippet could not be found. Either it was never created, or
it got deleted from our database. If you're sure the snippet must be here,
contact me on GitHub: https://github.com/jozsefsallai

* To create a new snippet, press \`ctrl+i\`
`;

const NotFound = () => {
  return (
    <AppTemplate navigation={[]}>
      <Editor
        language="markdown"
        contents={ERROR_PAGE}
        readOnly
      />
    </AppTemplate>
  );
};

export default NotFound;
