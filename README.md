## Test the blog

- navigate to blog directory
  `cd blog`
- Install dependencies  
  `npm ci`
- Run Next.js in development mode
  `npm run dev`

## Login to Firebase

If it is the first time you try to deploy, you need to login to Firebase
`npx firebase login`
or
`npm exec -- firebase login`

## Deploy a new blog post
Follow the readme `./blog/README.md`

## Deploy gmi-contest


- Open the gmi-contest project
- follow the README.md
- return here and deploy on firebase
  `npx firebase deploy`

In case of this error:
  Error: Failed to get Firebase project gmi-frontend. Please make sure the project exists and your account has permission to access it.
do
  `npx firebase login --reauth`

## rewrite del path verso index

```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

## Deploy the CMS
- navigate to /studio
- `npx sanity login`
- use the same account you use to access the CMS
- `npx sanity deploy`
