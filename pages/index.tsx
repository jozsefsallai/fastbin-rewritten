import { NavigationItem } from '@/components/the-header/TheHeader';
import { Save } from '@geist-ui/react-icons';
import AppTemplate from '@/components/AppTemplate';
import { useEffect, useState } from 'react';
import EditorWrapper from '@/components/editor-wrapper/EditorWrapper';
import upload from '@/lib/upload';
import { useToasts } from '@geist-ui/react';
import LoadingContainer from '@/components/loading-container/LoadingContainer';
import { useRouter } from 'next/router';
import Mousetrap from 'mousetrap';
import globalKeyBind from '@/lib/globalKeyBind';

const Home = () => {
  const [ documentLanguage, setDocumentLanguage ] = useState('plain');
  const [ contents, setContents ] = useState('');
  const [ uploading, setUploading ] = useState(false);

  const [ toasts, setToast ] = useToasts();
  const router = useRouter();

  const save = async () => {
    setUploading(true);

    try {
      const key = await upload(contents, documentLanguage);

      setUploading(false);

      setToast({
        text: 'Snippet created successfully!' + ' ' + key,
        type: 'success'
      });

      router.push(`/${key}`);
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
        contents={contents}
        setContents={setContents}
        language={documentLanguage}
      />

      {uploading && <LoadingContainer text="Creating snippet..." />}
    </AppTemplate>
  );
};

export default Home;
