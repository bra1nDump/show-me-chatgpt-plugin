import { NextApiRequest, NextApiResponse } from 'next'

import { aiPluginManifest } from '../../../server/ai-plugin'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(aiPluginManifest)
}

export default handler
