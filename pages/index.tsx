import EditorPage from '@/components/editor/EditorPage';
import languages from '@/lib/languages';

const Home = ({ languageId }) => {
  return <EditorPage languageId={languageId} />;
};

export default Home;

export async function getServerSideProps({ query }) {
  let languageId = 'plain';

  const { language } = query;

  if (typeof language === 'string' && Object.keys(languages).includes(language)) {
    languageId = language;
  }

  return {
    props: {
      languageId
    }
  };
};
