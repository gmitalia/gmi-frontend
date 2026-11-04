import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'idfqw720',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
    appId: 'd234e2cfa718391b0c5bb840',
  },
})
