import AppTemplate from '@/components/AppTemplate';
import Editor from '@/components/editor/Editor';

const ERROR_PAGE = `# Error 500

Something bad happened on the server side. This might be a temporary issue, so
please try checking back later. If the problem persists, please report the it in
the project's issue tracker:

https://github.com/jozsefsallai/fastbin-rewritten/issues
`;

const InternalServerError = () => {
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

export default InternalServerError;
