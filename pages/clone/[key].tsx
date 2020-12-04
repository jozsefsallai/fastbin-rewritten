import env from '@/lib/env';
import languages from '@/lib/languages';
import EditorPage from '@/components/editor/EditorPage';

interface ClonePageProps {
  contents: string;
  languageId: string;
}

const ClonePage = ({ contents, languageId }: ClonePageProps) => {
  return <EditorPage contents={contents} languageId={languageId} />;
};

export default ClonePage;

export async function getServerSideProps({ params }) {
  let key = params.key;

  let languageId = 'plain';

  const components = key.split('.');
  if (components.length > 1) {
    const extension = components.pop();
    key = components.join('.');

    const targetLanguage = Object.values(languages)
      .find(l => l.extension === extension);

    if (targetLanguage) {
      languageId = targetLanguage.id;
    }
  }

  const baseUrl = env('site-url', true);

  const data = await fetch(`${baseUrl}/api/documents/${key}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  });

  const json = await data.json();

  if (!json.ok) {
    return {
      notFound: true
    };
  }

  const contents = json.contents;

  return {
    props: {
      contents,
      languageId
    }
  };
};
