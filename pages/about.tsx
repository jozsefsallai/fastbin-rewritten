import AppTemplate from '@/components/AppTemplate';
import Editor from '@/components/editor/Editor';

import * as fs from 'fs-extra';
import * as path from 'path';

const About = ({ readme }: { readme: string }) => {
  return (
    <AppTemplate navigation={[]}>
      <Editor language="markdown" contents={readme} readOnly />
    </AppTemplate>
  );
};

export async function getStaticProps(ctx) {
  let readme = await fs.readFile(path.join(process.cwd(), 'README.md'), {
    encoding: 'utf8',
  });

  readme = readme.replace(
    '<a href="https://vercel.com/new/project?template=jozsefsallai/fastbin-rewritten"><img width="128" src="https://vercel.com/button" alt="One-click Deployment" /></a>',
    'https://vercel.com/new/project?template=jozsefsallai/fastbin-rewritten',
  );

  readme = readme.replace(
    '<a href="https://app.netlify.com/start/deploy?repository=https://github.com/jozsefsallai/fastbin-rewritten"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" /></a>',
    'https://app.netlify.com/start/deploy?repository=https://github.com/jozsefsallai/fastbin-rewritten',
  );

  return {
    props: {
      readme,
    },
  };
}

export default About;
