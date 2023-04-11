import pkg from '../package.json'

export { pkg }

export const name = pkg.name
export const aiPlugin = pkg.aiPlugin

export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'

export const port = process.env.PORT || '3000'
export const domain = 'chatgpt-plugin-dexa-mfm.vercel.app'
export const url = isDev ? `http://localhost:${port}` : `https://${domain}`
