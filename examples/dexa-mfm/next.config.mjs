import transpile from 'next-transpile-modules'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/.well-known/ai-plugin.json',
        destination: '/api/.well-known/ai-plugin.json'
      }
    ]
  }
}
const withTM = transpile(['../../packages/chatgpt-plugin'])

export default withTM(nextConfig)
