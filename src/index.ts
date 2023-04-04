import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import * as routes from './routes'
import * as types from './types'

const router = OpenAPIRouter({
  schema: {
    info: {
      title: 'ChatGPT ASCII Art Plugin',
      version: '1.0'
    }
  }
})

router.get('/render', routes.ASCIIArtRender)

router.get('/.well-known/ai-plugin.json', (request: Request) => {
  const host = request.headers.get('host')
  const pluginSpec: types.AIPlugin = {
    schema_version: 'v1',
    name_for_model: 'asciiArt0',
    name_for_human: 'ASCII Art',
    description_for_model:
      'Plugin for rendering text as ASCII art. Use it whenever a user asks to convert text into ASCII character art. Output is a string that should be rendered as a markdown code block (no programming language).',
    description_for_human: 'Convert any text to ASCII art.',
    auth: {
      type: 'none'
    },
    api: {
      type: 'openapi',
      url: `https://${host}/openapi.json`,
      has_user_authentication: false
    },
    logo_url: 'https://transitivebullsh.it/.well-known/logo.png',
    contact_email: 'travis@transitivebullsh.it',
    legal_info_url: 'https://transitivebullsh.it/about'
  }

  return new Response(JSON.stringify(pluginSpec, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  })
})

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
  fetch: router.handle
}
