import { KVNamespace } from '@cloudflare/workers-types'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
)

// TODO: Create 2 functions save svg and save short link, dont create slug outside
export async function saveShortLink(
  store: KVNamespace,
  url: string
): Promise<string> {
  let slug = nanoid()
  // Add slug to our KV store so it can be retrieved later:
  await store.put(slug, url)
  return slug
}

// Always has SVG stored in it
export async function DiagramLinkRoute(request, env) {
  const slug = request.params.id
  if (!slug) {
    return new Response('404 Not Found...', { status: 200 })
  }
  const data = await env.SHORTEN.get(slug)
  if (!data) {
    return new Response('404 Not Found...', { status: 200 })
  }

  return new Response(data, {
    headers: {
      'content-type': 'image/svg+xml'
    }
  })
}

// Stores redirect links (or SVGs, for legacy reasons)
export async function ShortLinkRoute(request, env) {
  const slug = request.params.id
  if (!slug) {
    return new Response('404 Not Found...', { status: 200 })
  }
  const data = await env.SHORTEN.get(slug)
  if (!data) {
    return new Response('404 Not Found...', { status: 200 })
  }

  // Here is the deal: There still is a bug where we started passing the SVG
  // contents to the shorten function expecting to get a link to this blob but
  // then we also passed the editor links expecting to get redirects.
  // Previously we always stored a redirect location. Fortunately all the SVG
  // blobs don't start with http so we can fix this route in a backwards
  // compatible way. If we were using a new type wrapper so that only URLs
  // could be passed to saveShortLink then this problem would have been avoided.
  if (data.startsWith('http')) {
    return new Response(null, {
      status: 301,
      statusText: 'Moved Permenantly',
      headers: {
        'Location': data,
      }
    });
  }

  // Assume that the all the non link data is SVG files
  return new Response(data, {
    headers: {
      'content-type': 'image/svg+xml'
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
