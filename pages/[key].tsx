import AppTemplate from '@/components/AppTemplate';
import { NavigationItem } from '@/components/the-header/TheHeader';
import env from '@/lib/env';
import languages from '@/lib/languages';
import { Copy, Code, Trash2 } from '@geist-ui/react-icons';
import Editor from '@/components/editor/Editor';
import Mousetrap from 'mousetrap';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import globalKeyBind from '@/lib/globalKeyBind';

interface DocumentPageProps {
  contents: string;
  finalKey: string;
  originalKey: string;
  languageId: string;
  secret: string | null;
}

const DocumentPage = ({ contents, finalKey, originalKey, languageId, secret }: DocumentPageProps) => {
  const navigation: NavigationItem[] = [
    {
      tooltip: 'Clone (ctrl+shift+c)',
      url: `/clone/${originalKey}`,
      icon: Copy
    },
    {
      tooltip: 'Raw (ctrl+shift+r)',
      url: `/raw/${finalKey}`,
      external: true,
      icon: Code
    }
  ];

  if (secret) {
    navigation.push({
      tooltip: 'Delete',
      url: `/delete/${secret}`,
      icon: Trash2
    });
  }

  const router = useRouter();

  useEffect(() => {
    globalKeyBind(Mousetrap);

    Mousetrap.bindGlobal('ctrl+shift+c', e => {
      e.preventDefault();
      router.push(`/clone/${originalKey}`);
    });

    Mousetrap.bindGlobal('ctrl+shift+r', e => {
      e.preventDefault();
      window.location.href = `/raw/${finalKey}`;
    });

    return () => {
      (Mousetrap as any).unbindGlobal('ctrl+shift+c');
      (Mousetrap as any).unbindGlobal('ctrl+shift+r');
    };
  }, []);

  return (
    <AppTemplate navigation={navigation}>
      <Editor
        language={languageId}
        contents={contents}
        readOnly
      />
    </AppTemplate>
  );
};

export default DocumentPage;

export async function getServerSideProps({ req, res, params, query }) {
  let key = params.key;
  let originalKey = key;

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

  const secret: string | null = query.secret || null;

  return {
    props: {
      contents,
      finalKey: key,
      originalKey,
      languageId,
      secret
    }
  };
};
