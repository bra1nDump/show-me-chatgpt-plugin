import { Env } from ".";

export type MixpanelEventProperties = {
  [key: string]: any;
}

export function createTrackerForRequest(request: Request, env: Env) {
    // Print headers
    const headers = Object.fromEntries(request.headers)
    console.log('headers', headers)

    const conversationId = headers['openai-conversation-id']
    const ephemeralUserId = headers['openai-ephemeral-user-id']
    const realIP = headers['x-real-ip']

    // Track render event
    return async (event: string, properties: Record<string, any>) => {
      try {
        const adjustedProperties = {
          ...properties,
          'conversation_id': conversationId,

          ip: realIP,
          'worker_environment': env.WORKER_ENV,
        }
        await sendMixpanelEvent(
          env.MIXPANEL_TOKEN, 
          env.MIXPANEL_GLOBAL_SAMPLING_RATE, 
          event, ephemeralUserId, 
          adjustedProperties
        )
      } catch (e) {
        console.log('Error sending mixpanel event', e)
      }
    }
}

export async function sendMixpanelEvent(token: string, samplingRate: number, eventName: string, userId: string | undefined, properties: MixpanelEventProperties) {
  // Sample events
  if (Math.random() > samplingRate) {
    console.log('Skipping mixpanel event due to sampling', eventName, properties)
    return
  }

  let mixpanelEvent = {
    "event": eventName,
    "properties": {
      // Mixpanel system properties
      
      "token": token,
      "time": Date.now(),

      // UserID is undefined for impression logging when /logo is fetched
      ...userId && { "distinct_id": userId },

      ...properties
    }
  }

  console.log("Sending mixpanel event: ", mixpanelEvent)

  let response = await fetch("https://api.mixpanel.com/track", {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'text/plain',
    },
    // Note: we need to send an array of events
    body: JSON.stringify([mixpanelEvent])
  })

  if (!response.ok) {
    // handle error
    console.error("Mixpanel event tracking failed")
  }

  console.log('Sent mixpanel event', eventName, properties)
}