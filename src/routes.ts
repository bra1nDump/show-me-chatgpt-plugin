import {
  Enumeration,
  OpenAPIRoute,
  Query,
  Str
} from '@cloudflare/itty-router-openapi'
import figlet from 'figlet'

figlet.defaults({
  fontPath: 'https://www.unpkg.com/figlet@1.5.2/fonts'
})

export class ASCIIArtRender extends OpenAPIRoute {
  static schema = {
    tags: ['figlet'],
    summary: 'Renders text as ASCII art',
    parameters: {
      input: Query(
        new Str({
          description: 'Input text to convert',
          example: 'boo'
        }),
        {
          required: true
        }
      ),
      font: Query(Enumeration, {
        description: 'Which ASCII art font to render',
        default: 'Ghost',
        required: false,
        enumCaseSensitive: true,
        values: {
          Standard: 'Standard',
          Ghost: 'Ghost',
          '3D Diagonal': '3D Diagonal',
          Graffiti: 'Graffiti',
          'Dancing Font': 'Dancing Font'
        }
      })
    },
    responses: {
      '200': {
        schema: new Str({
          example: `
_   _      _ _        __        __         _     _ _ _
 | | | | ___| | | ___   \ \      / /__  _ __| | __| | | |
 | |_| |/ _ \ | |/ _ \   \ \ /\ / / _ \| '__| |/ _\` | | |
 |  _  |  __/ | | (_) |   \ V  V / (_) | |  | | (_| |_|_|
 |_| |_|\___|_|_|\___/     \_/\_/ \___/|_|  |_|\__,_(_|_)
`
        })
      }
    }
  }

  async handle(request: Request, data: Record<string, any>) {
    const url = new URL(request.url)
    const input = url.searchParams.get('input') || 'hello'
    const font: any = url.searchParams.get('font') || 'Ghost'

    const output: string = await new Promise((resolve, reject) => {
      figlet.text(
        input,
        {
          font
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        }
      )
    })

    return new Response(output)
  }
}
