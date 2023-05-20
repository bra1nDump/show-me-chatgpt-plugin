import { KVNamespace } from '@cloudflare/workers-types'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
)

export async function saveShortLink(
  store: KVNamespace,
  url: string
): Promise<string> {
  let slug = nanoid()
  // Add slug to our KV store so it can be retrieved later:
  await store.put(slug, url)
  return slug
}

export async function DiagramLinkRoute(request, env) {
  const slug = request.params.id
  if (!slug) {
    return new Response('404 Not Found...', { status: 200 })
  }
  const imageSVG = await env.SHORTEN.get(slug)
  if (!imageSVG) {
    return new Response('404 Not Found...', { status: 200 })
  }

  return new Response(imageSVG, {
    headers: {
      'content-type': 'image/svg+xml'
    }
  })
}

export async function ShortLinkRoute(request, env) {
  const slug = request.params.id
  if (!slug) {
    return new Response('404 Not Found...', { status: 200 })
  }
  const targetUrl = await env.SHORTEN.get(slug)
  if (!targetUrl) {
    return new Response('404 Not Found...', { status: 200 })
  }

  return new Response(null, {
    status: 301,
    statusText: 'Moved Permanently',
    headers: {
      Location: targetUrl
    }
  })
}

export async function debugCreateLink(request, env) {
  let requestBody = await request.json()
  console.log('shorten', env.SHORTEN)
  if ('url' in requestBody) {
    // Add slug to our KV store so it can be retrieved later:
    const slug = await saveShortLink(env.SHORTEN, requestBody.url)
    let shortenedURL = `${new URL(request.url).origin}/${slug}`
    let responseBody = {
      message: 'Link shortened successfully',
      slug,
      shortened: shortenedURL
    }
    return new Response(JSON.stringify(responseBody), {
      headers: { 'content-type': 'application/json' },
      status: 200
    })
  } else {
    return new Response('Must provide a valid URL', { status: 400 })
  }
}
