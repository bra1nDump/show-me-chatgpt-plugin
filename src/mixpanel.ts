
export type MixpanelEventProperties = {
  [key: string]: any;
}

export async function sendMixpanelEvent(token: string, eventName: string, userId: string | undefined, properties: MixpanelEventProperties) {
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
}