const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles')
    ]
  },

  async rewrites() {
    return [
      {
        source: '/documents',
        destination: '/api/documents'
      },
      {
        source: '/documents/:key',
        destination: '/api/documents/:key'
      },
      {
        source: '/raw/:key',
        destination: '/api/documents/:key/raw'
      }
    ]
  },

  async redirects() {
    return [
      {
        source: '/languages/:language',
        destination: '/?language=:language',
        permanent: true
      }
    ]
  }
};
