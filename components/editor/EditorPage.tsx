import AppTemplate from '@/components/AppTemplate';
import { NavigationItem } from '@/components/the-header/TheHeader';
import { Save } from '@geist-ui/react-icons';
import Editor from '@/components/editor/Editor';
import React, { useEffect, useRef, useState } from 'react';
import upload from '@/lib/upload';
import { useToasts } from '@geist-ui/react';
import LoadingContainer from '@/components/loading-container/LoadingContainer';
import Mousetrap from 'mousetrap';
import globalKeyBind from '@/lib/globalKeyBind';
import { useRouter } from 'next/router';

interface EditorPageProps {
  contents?: string;
  languageId: string;
}

const EditorPage = ({ contents, languageId }: EditorPageProps) => {
  const [documentLanguage, _setDocumentLanguage] = useState(languageId);
  const documentLanguageRef = useRef(languageId);
  const setDocumentLanguage = (l: string) => {
    _setDocumentLanguage(l);
    documentLanguageRef.current = l;
  };

  const [uploading, setUploading] = useState(false);

  const documentContents = useRef(contents ?? '');
  const setDocumentContents = (c: string) => documentContents.current = c;

  const [toasts, setToast] = useToasts();
  const router = useRouter();

  const save = async () => {
    if (uploading) {
      return;
    }

    setUploading(true);

    try {
      const { key, secret } = await upload(documentContents.current, documentLanguageRef.current);

      setToast({
        text: 'Snippet created successfully! Redirecting...',
        type: 'success'
      });

      router.push({
        pathname: `/${key}`,
        query: {
          secret
        }
      }, `/${key}`);
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
    let mounted = true;
    globalKeyBind(Mousetrap);

    Mousetrap.bindGlobal('ctrl+s', e => {
      e.preventDefault();
      if (mounted) {
        save();
      }
    });

    return () => {
      (Mousetrap as any).unbindGlobal('ctrl+s');
      mounted = false;
    };
  }, []);

  return (
    <AppTemplate
      navigation={navigation}
      displayLanguages
      documentLanguage={documentLanguage}
      setDocumentLanguage={setDocumentLanguage}
    >
      <Editor
        contents={documentContents.current}
        setContents={setDocumentContents}
        language={documentLanguage}
      />

      {uploading && <LoadingContainer text="Creating snippet..." />}
    </AppTemplate>
  );
};

export default EditorPage;
