![Deploy to firebase](https://github.com/gmitalia/gmi-frontend/actions/workflows/deploy-firebase.yml/badge.svg)

# Build
## Build the blog
Follow the readme `./packages/blog/README.md`

## Build sanity CMS
follow the readme `./packages/sanity/README.md`

## Build gmicontest
Follow the readme `./packages/gmicontest/README.md`

# Firebase
## Login
If it is the first time you try to deploy, you need to login to Firebase
`npx firebase login`
or
`npm exec -- firebase login`

## Set Environment
There are 2 environments `staging` and `default` (production)
To set an environment run `npx firebase use <environment>`

## Deploy to production 
Run `firebase deploy -P default`

## Deploy to staging
Run `firebase deploy -P staging`

## Troubleshooting
In case of this error:
  Error: Failed to get Firebase project gmi-frontend. Please make sure the project exists and your account has permission to access it.
do
  `npx firebase login --reauth`

## Notes

### rewrite del path verso index

```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```
