# Deploy a new blog post

- Edit articles content at
  https://gmitalia.sanity.studio/desk
- navigate to blog directory
  `cd blog`
- Install dependencies  
  `npm ci`
- render the blog to static pages
  `npm run export`
- copy the `<root>/blog/out` directory content into `<root>/public` directory
- navigate to `<root>` directory
  `cd ..`
- deploy on firebase
  `npx firebase deploy`