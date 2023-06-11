import { Env } from ".."
// @ts-ignore
import DiagramEditorWithEmailFormHtml from "./DiagramEditorWithEmailForm.html"

import { IRequest } from "itty-router"

/**
 * Displays diagram editor in an iframe with a header that allows the user to enter their email
 * Once the user enters the email, we fire a mixpanel event. The editor will always be visible in the remaining space.
 * @param editorUrl 
 * @returns 
 */
export function DiagramEditorWithEmailForm(editorUrl: string, workerUrl: string, env: Env) {
    console.log('renderDiagramEditorWithEmailForm')

    const htmlTemplate = DiagramEditorWithEmailFormHtml as string
    const html = 
        htmlTemplate
        .replace(/\{\{editorUrl\}\}/g, editorUrl)
        .replace(/\{\{env.MIXPANEL_TOKEN\}\}/g, env.MIXPANEL_TOKEN)
        .replace(/\{\{env.WORKER_ENV\}\}/g, env.WORKER_ENV)
        .replace(/\{\{API_URL\}\}/g, workerUrl)

    return new Response(html, {
        headers: {
            'content-type': 'text/html;charset=UTF-8'
        }
    })
}

// https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
export async function JoinWorkTogetherEmailRoute(request: IRequest, env: Env) {
    // get api key from env
    const apiKey = env.MAILCHIMP_API_KEY!
    const listId = env.MAILCHIMP_LIST_ID!
    
    // extract email from request body
    const { email }: { email: string } = await request.json()

    // send email to mailchimp
    const mailchimpResponse = await fetch(`https://us21.api.mailchimp.com/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("anystring:" + apiKey)
        }),
        body: JSON.stringify({
            email_address: email,
            status: "subscribed"
        })
    })

    const responsePayload  = await mailchimpResponse.json()
    console.log('responsePayload from mailchimp', (responsePayload as any)?.email_address)

    return new Response("OK", {status: 200})
}