import { generateOpenApiDocument } from '@fisch0920/trpc-openapi'

import * as config from './config'
import { appRouter } from './router'

// @ts-ignore
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: config.aiPlugin.name,
  version: config.pkg.version,
  baseUrl: `${config.url}/api`
})
