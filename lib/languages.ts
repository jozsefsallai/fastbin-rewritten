export interface Language {
  id: string;
  name: string;
  extension: string;
}

export interface LanguageList {
  [key: string]: Language;
}

const languages: LanguageList = {
  'plain': { id: 'plain', name: 'Plain', extension: '' },
  'bat': { id: 'bat', name: 'Batch', extension: 'bat' },
  'cj': { id: 'clojure', name: 'Clojure', extension: 'cj' },
  'coffee': { id: 'coffee', name: 'CoffeeScript', extension: 'coffee' },
  'c': { id: 'c', name: 'C', extension: 'c' },
  'cpp': { id: 'cpp', name: 'C++', extension: 'cpp' },
  'cs': { id: 'csharp', name: 'C#', extension: 'cs' },
  'css': { id: 'css', name: 'CSS', extension: 'css' },
  'Dockerfile': { id: 'dockerfile', name: 'Dockerfile', extension: 'Dockerfile' },
  'fs': { id: 'fsharp', name: 'F#', extension: 'fs' },
  'go': { id: 'go', name: 'Go', extension: 'go' },
  'graphql': { id: 'graphql', name: 'GraphQL', extension: 'graphql' },
  'hbs': { id: 'handlebars', name: 'Handlebars', extension: 'hbs' },
  'html': { id: 'html', name: 'HTML', extension: 'html' },
  'ini': { id: 'ini', name: 'INI', extension: 'ini' },
  'java': { id: 'java', name: 'Java', extension: 'java' },
  'js': { id: 'javascript', name: 'JavaScript', extension: 'js' },
  'json': { id: 'json', name: 'JSON', extension: 'json' },
  'kt': { id: 'kotlin', name: 'Kotlin', extension: 'kt' },
  'less': { id: 'less', name: 'LESS', extension: 'less' },
  'lua': { id: 'lua', name: 'Lua', extension: 'lua' },
  'md': { id: 'markdown', name: 'Markdown', extension: 'md' },
  'mysql': { id: 'mysql', name: 'MySQL', extension: 'mysql' },
  'm': { id: 'objective-c', name: 'Objective-C', extension: 'm' },
  'pascal': { id: 'pascal', name: 'Pascal', extension: 'pascal' },
  'perl': { id: 'perl', name: 'Perl', extension: 'perl' },
  'pgsql': { id: 'pgsql', name: 'Postgres', extension: 'pgsql' },
  'php': { id: 'php', name: 'PHP', extension: 'php' },
  'ps': { id: 'powershell', name: 'Powershell', extension: 'ps' },
  'pug': { id: 'pug', name: 'Pug', extension: 'pug' },
  'py': { id: 'python', name: 'Python', extension: 'py' },
  'r': { id: 'r', name: 'R', extension: 'r' },
  'rst': { id: 'restructuredtext', name: 'Restructured Text', extension: 'rst' },
  'rb': { id: 'ruby', name: 'Ruby', extension: 'rb' },
  'rs': { id: 'rust', name: 'Rust', extension: 'rs' },
  'scss': { id: 'scss', name: 'SCSS', extension: 'scss' },
  'sh': { id: 'shell', name: 'Shell script', extension: 'sh' },
  'sql': { id: 'sql', name: 'SQL', extension: 'sql' },
  'swift': { id: 'swift', name: 'Swift', extension: 'swift' },
  'twig': { id: 'twig', name: 'Twig', extension: 'twig' },
  'ts': { id: 'typescript', name: 'TypeScript', extension: 'ts' },
  'tsc': { id: 'tsc', name: 'TSC (Cave Story)', extension: 'tsc' },
  'vb': { id: 'vb', name: 'Visual Basic', extension: 'vb' },
  'xml': { id: 'xml', name: 'XML', extension: 'xml' },
  'yaml': { id: 'yaml', name: 'YAML', extension: 'yaml' }
};

export default languages;
