import { GeistProvider, CssBaseline } from '@geist-ui/react';
import '@/styles/base.scss';

import { useEffect } from 'react';
import { monaco } from '@monaco-editor/react';
import { useRouter } from 'next/router';

import Mousetrap from 'mousetrap';
import globalKeyBind from '@/lib/globalKeyBind';

import Head from 'next/head';

const Fastbin = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    globalKeyBind(Mousetrap);
    Mousetrap.bindGlobal('ctrl+i', () => router.push('/'));

    monaco.init()
      .then(instance => {
        instance.languages.register({ id: 'tsc' });
        instance.languages.setMonarchTokensProvider('tsc', {
          tokenizer: {
            root: [
              // events
              [/#.+/, 'number'],

              // commands
              [/<([A-Z0-9+-]{3})/, 'tag'],

              // arguments
              [/[V0-9][0-9]{3}/, 'attribute.value'],

              // comments
              [/\/\/.+/, 'comment']
            ]
          }
        });

        instance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
          noSuggestionDiagnostics: true
        });
      })
      .catch(console.error);

    return () => {
      (Mousetrap as any).unbindGlobal('ctrl+i');
    };
  }, []);

  return (
    <GeistProvider theme={{ type: 'dark' }}>
      <CssBaseline />
      <Component {...pageProps} />

      <Head>
        <title>fastbin</title>
        <meta name="charset" content="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="title" content="fastbin" />
        <meta name="description" content="free, fast, and easy pastebin service" />
      </Head>
    </GeistProvider>
  );
};

export default Fastbin;
