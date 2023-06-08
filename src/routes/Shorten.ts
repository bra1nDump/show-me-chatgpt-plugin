import { KVNamespace } from '@cloudflare/workers-types'
import { customAlphabet } from 'nanoid'
import { Env } from '..'
import { createTrackerForRequest, sendMixpanelEvent } from '../mixpanel'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
)

// TODO: Create 2 functions save svg and save short link, dont create slug outside
export async function saveShortLink(
  store: KVNamespace,
  url: string
): Promise<string> {
  let slug = nanoid()
  // Add slug to our KV store so it can be retrieved later:
  await store.put(slug, url)
  return slug
}

// Always has SVG stored in it
export async function DiagramLinkRoute(request, env) {
  const slug = request.params.id
  if (!slug) {
    return new Response('404 Not Found...', { status: 200 })
  }
  const data = await env.SHORTEN.get(slug)
  if (!data) {
    return new Response('404 Not Found...', { status: 200 })
  }

  return new Response(data, {
    headers: {
      'content-type': 'image/svg+xml'
    }
  })
}

// Stores redirect links (or SVGs, for legacy reasons)
export async function ShortLinkRoute(request, env: Env) {
  const slug = request.params.id
  if (!slug) {
    return new Response('404 Not Found...', { status: 200 })
  }
  const data = await env.SHORTEN.get(slug)
  if (!data) {
    return new Response('404 Not Found...', { status: 200 })
  }

  // Here is the deal: There still is a bug where we started passing the SVG
  // contents to the shorten function expecting to get a link to this blob but
  // then we also passed the editor links expecting to get redirects.
  // Previously we always stored a redirect location. Fortunately all the SVG
  // blobs don't start with http so we can fix this route in a backwards
  // compatible way. If we were using a new type wrapper so that only URLs
  // could be passed to saveShortLink then this problem would have been avoided.
  if (data.startsWith('http')) {
    // Most likely its an edit link (in the newer versions of the plugin)
    // 
    // NOTE: Might want to associate the edit link with the original render request
    // Currently can be kind of inferred by conversation id but requires a mixpanel query

    // NOTE: Seems like open ai is checking the links so 
    // we shouldn't log these as actual opens
    // Login is setup on the editor page
    // const track = createTrackerForRequest(request, env)
    // track('open_edit_link', {
    //   link: data,
    // })

    return renderDiagramEditorWithEmailForm(data, env)

    // return new Response(null, {
    //   status: 301,
    //   statusText: 'Moved Permenantly',
    //   headers: {
    //     'Location': data,
    //   }
    // });
  }

  // Assume that the all the non link data is SVG files
  return new Response(data, {
    headers: {
      'content-type': 'image/svg+xml'
    }
  })
}

/**
 * Displays diagram editor in an iframe with a header that allows the user to enter their email
 * Once the user enters the email, we fire a mixpanel event. The editor will always be visible in the remaining space.
 * @param editorUrl 
 * @returns 
 */
function renderDiagramEditorWithEmailForm(editorUrl: string, env: Env) {
  console.log('renderDiagramEditorWithEmailForm')

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Edit Diagram</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
      <!-- Including Mixpanel Library -->
      <!-- Paste this right before your closing </head> tag -->
      <script type="text/javascript">
(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?nMIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
</script>
    
      <!-- Mixpanel Initialization -->
      <script>
        mixpanel.init("${env.MIXPANEL_TOKEN}");
        mixpanel.set_config({debug: true});
      </script>

      <script>
        // Only show the email form to the user 3 times, or until they provide the email. use a cookie to track this
        // Set or increment the cookie
        function setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          var expires = "expires="+d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
      
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return undefined;
        }
      
        function onLoad() {
          var websiteLoadCount = parseInt(getCookie("websiteLoadCount") ?? "0");
          var submittedEmailOrDismissed = getCookie("submittedEmailOrDismissed");

          var emailFormShown = true;

          if(websiteLoadCount > 3 
            // If already submitted email or dismissed, don't show
             || submittedEmailOrDismissed !== undefined
             // Don't show uless mermaid.live
             || !"${editorUrl}".includes("mermaid.live")) {

            document.getElementById("emailFormContainer").style.display = "none";
            emailFormShown = false;
          }

          // Update count
          websiteLoadCount++;
          setCookie("websiteLoadCount", websiteLoadCount, 30);

          // Log impression
          mixpanel.track("edit_diagram_load", {
            "editorUrl": "${editorUrl}",
            "worker_environment": "${env.WORKER_ENV}",
            "email_form_shown": emailFormShown,
            "website_load_count": websiteLoadCount
          });

          // We will use this in mixpanel
          window.websiteLoadCount = websiteLoadCount;
          window.submittedEmailOrDismissed = submittedEmailOrDismissed;

          // Finally unhide the body
          document.body.classList.add("visible");
        }

        function dismissEmailForm() {
          setCookie("submittedEmailOrDismissed", "dismissed", 30);
          document.getElementById("emailFormContainer").style.display = "none";

          mixpanel.track("edit_diagram_dismissed_email_form", {
            "editorUrl": "${editorUrl}",
            "worker_environment": "${env.WORKER_ENV}",
            "website_load_count": websiteLoadCount
          });
        }
      </script>

      <!-- Flexbox CSS -->
      <style>
        body {
          /* Wait until we check the cookie */
          opacity: 0;
          visibility: hidden;

          display: flex;
          flex-direction: column;
          height: 100svh;
          margin: 0;

          position:relative;
        }

        body.visible {
            opacity: 1;
            visibility: visible;
        }

        h4, h5 {
          margin: 8px auto;
        }

        h5 {
          display: inline-block;
        }

        #emailFormContainer {
          background: rgb(48 30 184);
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 8px 40px 12px 16px;
          color: #e5e3ed;
          font-family: Arial, sans-serif;
          text-shadow: 0 2px 0 rgba(0,0,0,.25);
        }

        #salesPitch {
          
        }
      
        #emailForm {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
        }
      
        #emailForm label {
          font-size: 16px;
        }
      
        #emailForm input[type="email"] {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 5px;
        }

        #email::placeholder {
          color: #aaa;
        }
        #email { color: #fff; background-color: #181818; border: 1px solid #484848; }

        #emailForm input[type="submit"] {
          color: #000;
          border-radius: 5px;
          border: none;
          cursor: pointer;
        }

        /* #b1741e */
        /* ff9b40cc */
        .RaisedButtonOuter {
          border: 1px solid #fef1bc;
          padding: 0px 1px 3px 1px;
          border-radius: 6px;
          background: #a28717;
        }
        .RaisedButtonInner {
          background: #fef1bc;
          padding: 8px 16px;
          text-align: center;
          border-radius: 6px
          font-size: 16px;

        }

        #diagramEditor {
          flex: 1;
          width: 100%;
          border: none;
        }

        #dismiss {
          position: absolute;
          top: 8px;
          right: 8px;
        }
      </style>
    </head>
    <body onload="onLoad()">
      <!-- Email Input Form -->
      <div id="emailFormContainer">
        <div id="salesPitch">
            <h4>We also created a collaborative tool for prompt engineers 😊</h4>
          
            <form id="emailForm">
              <h5>Give us your email to join the private beta</h5>
              <input type="email" id="email" name="email" placeholder="Enter your email" required>
              <label class="RaisedButtonOuter">
                <input class="RaisedButtonInner" type="submit" value="Join Now">
              </label>
            </form>
          <label id="dismiss" onclick="dismissEmailForm()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
          </label>
        </div>
      </div>

      <script>
        // Submit Event Listener
        document.getElementById('emailForm').addEventListener('submit', function(e) {
          e.preventDefault();

          setCookie("submittedEmailOrDismissed", "submitted", 30);
          document.getElementById("emailFormContainer").style.display = "none";

          // Get email input value
          var email = document.getElementById('email').value;
    
          // Fire Mixpanel Event
          mixpanel.track("edit_diagram_email_submitted", {
            "email": email,
            "editor_url": "${editorUrl}",
            "worker_enviroment": "${env.WORKER_ENV}",
            "website_load_count": websiteLoadCount
          });
        });
      </script>
    
      <!-- Diagram Editor Iframe -->
      <iframe id="diagramEditor" src="${editorUrl}" style="border: none;"></iframe>
    </body>
    </html>
  `

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })
}


export async function debugCreateLink(request, env) {
  let requestBody = await request.json()
  console.log('shorten', env.SHORTEN)
  if ('url' in requestBody) {
    // Add slug to our KV store so it can be retrieved later:
    const slug = await saveShortLink(env.SHORTEN, requestBody.url)
    let shortenedURL = `${new URL(request.url).origin}/${slug}`
    let responseBody = {
      message: 'Link shortened successfully',
      slug,
      shortened: shortenedURL
    }
    return new Response(JSON.stringify(responseBody), {
      headers: { 'content-type': 'application/json' },
      status: 200
    })
  } else {
    return new Response('Must provide a valid URL', { status: 400 })
  }
}
