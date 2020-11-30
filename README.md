# fastbin rewritten

Painless, self-hosted, modern alternative to [Hastebin](https://hastebin.com/).

## How to Use

Just paste your code or text, click save, and you're ready to go! You can also
select a programming language from the dropdown. You can click on the **Raw**
button to view only the contents, without any UI stuff.

fastbin uses [Monaco](https://microsoft.github.io/monaco-editor/) as its editor,
which is the editor used by Visual Studio Code. This offers great functionality
and syntax highlighting support.

You can also clone a document using the **Clone** button.

When viewing documents, the syntax highlighter works based on the ending of the
URL. For example, if I have a JavaScript file with the key "foobar", I can
append ".js" to the end of the URL and it will highlight it as JavaScript.
Appending .js to the raw URL will obviously not work, it expects only the key to
be provided.

## fastbin cli

fastbin now has its own command line client. It's available for Linux, Mac OS,
Windows, and OpenBSD and you can download it using the link below:

https://github.com/jozsefsallai/fastbin-cli

## Compatibility with Haste clients

fastbin was designed to be compatible with most Hastebin clients. If your client
support specifying a custom server, you can specify your self-hosted fastbin URL
and it should work just fine.

## Duration

Currently, files are stored for an indefinite amout of time. This might change
in the future (possibly as a custom config option).

## Privacy

Please do NOT post any of your secret keys or passwords to a fastbin server.
Every URL is unlisted, but again, available for the public. Snippets are NOT
encrypted (i.e. they're plaintext). If there's popular demand for snippet
encryption, I'll make sure to include that.

## Self Hosting

### One-Click Deployment with Vercel

You can deploy the app to your own [Vercel](https://vercel.com) account in just
one click:

<a href="https://vercel.com/new/project?template=jozsefsallai/fastbin-rewritten"><img width="128" src="https://vercel.com/button" alt="One-click Deployment" /></a>

Once the project is created, you must specify the environment variables that are
necessary for the storage strategies to work. This is the same as creating a
.env file in the manual setup.

### Manual Setup

**1. Clone the repository**

```
git clone git@github.com:jozsefsallai/fastbin-rewritten.git fastbin
cd fastbin
```

**2. Install the dependencies**

```
npm i -g yarn
yarn
```

**3. Configure your fastbin server**

```
cp .env.example .env
vim .env
```

**Start the server in development mode:**

```
yarn dev
```

**Create a production build:**

```
yarn build
yarn start
```

## Storage Strategies

At the moment, fastbin can store snippets using three different strategies:
`file`, `s3`, `firebase`. You can specify which one you want to use by changing
the value of the `STORAGE_STRATEGY` environment variable inside of your `.env`
file from `file` to any of the ones mentioned earlier.

Some storage strategies require additional configuration.

### FileStorageStrategy

You can specify the location of the snippets using the `FILE_STORAGE_LOCATION`
environment variable. This path is relative to the root of the project.

### S3StorageStrategy

You need to specify the auth credentials, as well as the endpoint and the S3
bucket name using the `S3_*` environment variables.

### FirebaseStorageStrategy

You need to specify the name of the Firebase Storage bucket* inside of the
`FIREBASE_BUCKET` property of the config. You should also include your Firebase
credentials certificate in `.firebase/credentials.json` (or as an environment
variable, using `FIREBASE_SERVICE_ACCOUNT`). This step is cruial. If you don't
have a credentials JSON file yet, you can generate one in the settings of your
Firebase projects.

*Make sure you only specify the bucket's name, WITHOUT ".appspot.com".

## Contribution

Contribution is more than welcome and appreciated! If you want to contribute,
you can:

- [file a bug report](https://github.com/jozsefsallai/fastbin-rewritten/issues/new)
- [submit a pull request](https://github.com/jozsefsallai/fastbin-rewritten/pulls)

## License

MIT.
