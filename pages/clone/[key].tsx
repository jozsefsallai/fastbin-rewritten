import AppTemplate from '@/components/AppTemplate';
import { NavigationItem } from '@/components/the-header/TheHeader';
import { Save } from '@geist-ui/react-icons';
import env from '@/lib/env';
import languages from '@/lib/languages';
import EditorWrapper from '@/components/editor-wrapper/EditorWrapper';
import React, { useEffect, useState } from 'react';
import upload from '@/lib/upload';
import { useToasts } from '@geist-ui/react';
import LoadingContainer from '@/components/loading-container/LoadingContainer';
import Mousetrap from 'mousetrap';
import globalKeyBind from '@/lib/globalKeyBind';

interface ClonePageProps {
  contents: string;
  languageId: string;
}

const ClonePage = ({ contents, languageId }: ClonePageProps) => {
  const [ documentLanguage, setDocumentLanguage ] = useState(languageId);
  const [ documentContents, setDocumentContents ] = useState(contents);
  const [ uploading, setUploading ] = useState(false);

  const [ toasts, setToast ] = useToasts();

  const save = async () => {
    setUploading(true);

    try {
      const key = await upload(documentContents, documentLanguage);

      setUploading(false);

      setToast({
        text: 'Snippet created successfully!' + ' ' + key,
        type: 'success'
      });

      console.log(key);
    } catch (err) {
      setUploading(false);

      setToast({
        text: `${err}`,
        type: 'error'
      });
    }
  };

  const navigation: NavigationItem[] = [
    {
      onClick: save,
      tooltip: 'Save (ctrl+s)',
      icon: Save
    }
  ];

  useEffect(() => {
    globalKeyBind(Mousetrap);

    Mousetrap.bindGlobal('ctrl+s', async e => {
      e.preventDefault();
      await save();
    });

    return () => (Mousetrap as any).unbindGlobal('ctrl+s');
  }, []);

  return (
    <AppTemplate
      navigation={navigation}
      displayLanguages
      setDocumentLanguage={setDocumentLanguage}
    >
      <EditorWrapper
        contents={documentContents}
        setContents={setDocumentContents}
        language={documentLanguage}
      />

      {uploading && <LoadingContainer text="Creating snippet..." />}
    </AppTemplate>
  );
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
