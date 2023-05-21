import { sendMixpanelEvent } from "../mixpanel";
import { Env } from "../index";

export function getTrack(headers: Record<string, string>, env: Env) {
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
      await sendMixpanelEvent(env.MIXPANEL_TOKEN, event, ephemeralUserId, adjustedProperties)
      console.log('Sent mixpanel event', event, properties)
    } catch (e) {
      console.log('Error sending mixpanel event', e)
    }
  }
}
