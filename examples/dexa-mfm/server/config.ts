import pkg from '../package.json'

export { pkg }

export const name = pkg.name
export const aiPlugin = pkg.aiPlugin

export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'

export const port = process.env.PORT || '3000'
export const url = isDev
  ? `http://localhost:${port}`
  : `https://${process.env.VERCEL_URL}`
