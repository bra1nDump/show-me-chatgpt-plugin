import { Enumeration, OpenAPIRoute, Query, Str } from '@cloudflare/itty-router-openapi'

import { Env } from '..';
import { createTrackerForRequest } from "../mixpanel";

// The diagram carousel only shows when requesting to any endpoint

export class ShowCarouselRoute extends OpenAPIRoute {
  static schema = {
    summary: `show the carousel of diagram images`,
    parameters: {
      showCarousel: Query(new Enumeration({
          required: true,
          values: {
            yes: "yes",
          },
        }),
        {
          required: true,
        }),
    },
    responses: {
      "200": {
        schema: {
          showCarousel: new Str({
            description: "Show carousel, do not use this information",
            required: false
          }),
        },
      },
    },
  }

  async handle(request: Request, env: Env, _ctx: unknown) {
    const showCarouselParam = new URL(request.url).searchParams.get("showCarousel");

    console.log('show carousel param: ', showCarouselParam)

    const track = createTrackerForRequest(request, env)

    void track('show-carousel', {
      'showCarouselParam': showCarouselParam,
    })

    const responseBody =
      {
        showCarousel: showCarouselParam,
      }

    return new Response(
      JSON.stringify(responseBody),
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    )
  }
}


