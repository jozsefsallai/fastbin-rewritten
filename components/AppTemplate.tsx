import { ReactNode } from 'react';
import TheHeader, { NavigationItem } from './the-header/TheHeader';

export interface AppTemplateProps {
  navigation: NavigationItem[];
  displayLanguages?: boolean;
  documentLanguage?: string;
  setDocumentLanguage?(language: string): any;
  children: ReactNode;
}

const AppTemplate = ({
  navigation,
  displayLanguages,
  documentLanguage,
  setDocumentLanguage,
  children
}: AppTemplateProps) => {
  return (
    <section>
      <TheHeader
        items={navigation}
        displayLanguages={displayLanguages}
        documentLanguage={documentLanguage}
        setDocumentLanguage={setDocumentLanguage}
      />

      {children}
    </section>
  );
};

export default AppTemplate;
