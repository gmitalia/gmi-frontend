# Test the blog

- navigate to blog directory
  cd blog

- Install dependencies  
   npm ci

- Run Next.js in development mode
  npm run dev

# Deploy a new blog post

- Edit articles content at
  https://gmitalia.sanity.studio/desk
- navigate to blog directory
  cd blog

- Install dependencies  
   npm ci

- render the blog to static pages
  npm run export

- copy the 'blog/out' directory content into 'public'

- navigate to root directory
  cd ..
- deploy on firebase
  npx firebase deploy

## Deploy gmi-contest

- Open the gmi-contest project
- follow the README.md
- return here and deploy on firebase
  npx firebase deploy

## rewrite del path verso index

"rewrites": [
{
"source": "**",
"destination": "/index.html"
}
]
