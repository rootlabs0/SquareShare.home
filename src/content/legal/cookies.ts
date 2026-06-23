import type { LegalContent } from "@/components/legal/LegalDocument";

export const cookiesContent: LegalContent = {
  "title": "Cookie Policy",
  "subtitle": "How Square Share uses cookies and similar technologies under EU ePrivacy rules.",
  "lastUpdated": "22 June 2026",
  "disclaimer": "These documents are provided for general information only. They are a starting template generated for Square Share and should be reviewed by a qualified lawyer before launch and before processing any payments.",
  "intro": [
    {
      "type": "p",
      "text": "This Cookie Policy explains how **Square Share** (\"we\", \"us\", \"our\") uses cookies and similar technologies when you visit [squareshare.to](https://squareshare.to) and, once they go live, when you use our Seller Dashboard at [store.squareshare.to](https://store.squareshare.to) (planned) or interact with our embeddable Widget (planned) (together, the \"Service\"). It is written to comply with the EU ePrivacy rules and the General Data Protection Regulation (GDPR)."
    },
    {
      "type": "note",
      "text": "**In short:** Today, the live site at [squareshare.to](https://squareshare.to) is a pre-launch landing page, and the only cookies that may be set are **strictly necessary** ones. We currently use **no** analytics, advertising, or tracking cookies of any kind, and our fonts are self-hosted so no requests are made to Google Fonts. If we ever introduce non-essential cookies, we will ask for your consent first."
    },
    {
      "type": "p",
      "text": "This Cookie Policy should be read together with our [Privacy Policy](/privacy), which describes how we handle personal data more generally, and our [Terms of Service](/terms)."
    }
  ],
  "sections": [
    {
      "id": "what-are-cookies",
      "heading": "1. What are cookies and similar technologies?",
      "blocks": [
        {
          "type": "p",
          "text": "**Cookies** are small text files that a website places on your device (computer, phone, or tablet) when you visit. They are widely used to make websites work, to make them work more efficiently, and to provide information to the website operator. Cookies set by the website you are visiting are called **first-party cookies**; cookies set by a different domain are called **third-party cookies**."
        },
        {
          "type": "p",
          "text": "\"Similar technologies\" perform comparable functions to cookies but use different mechanisms. Where this policy refers to \"cookies\", it also covers these technologies, including:"
        },
        {
          "type": "ul",
          "items": [
            "**Local storage and session storage**, data stored in your browser by a website, often used to remember preferences or keep you signed in. Unlike cookies, this data is not automatically sent back to the server with every request.",
            "**Pixels (also called web beacons or tags)**, tiny, usually invisible images or snippets of code embedded in a page or email that can record that a page was loaded. We do **not** currently use pixels or web beacons.",
            "**Software development kits (SDKs)** and similar embedded code that can read or write information on your device."
          ]
        },
        {
          "type": "p",
          "text": "Under EU ePrivacy rules, storing information on, or accessing information already stored on, your device generally requires your **consent**, unless it is strictly necessary to provide a service you have explicitly requested."
        }
      ]
    },
    {
      "id": "cookie-categories",
      "heading": "2. Categories of cookies explained",
      "blocks": [
        {
          "type": "p",
          "text": "Cookies are commonly grouped into the following categories based on their purpose. This section explains each category in general terms; the next section sets out exactly which categories we actually use."
        },
        {
          "type": "h3",
          "text": "Strictly necessary cookies"
        },
        {
          "type": "p",
          "text": "These are essential for the website to function and for you to use features you have explicitly requested, for example, security, load balancing, network management, and remembering information across the pages of a single session. They do **not** require your consent under ePrivacy rules. The Service cannot work properly without them."
        },
        {
          "type": "h3",
          "text": "Functional / preferences cookies"
        },
        {
          "type": "p",
          "text": "These remember choices you make to give you a more personalised experience, for example, your language, region, or a light/dark display mode. They are not strictly essential, so where they are not necessary to deliver a feature you have requested, they require consent. Settings tied to your account (such as how your Bento Grid is arranged in the Seller Dashboard) are stored server-side with your Seller account rather than in a browser cookie."
        },
        {
          "type": "h3",
          "text": "Analytics / performance cookies"
        },
        {
          "type": "p",
          "text": "These help us understand how visitors interact with the Service, for example, which pages are visited and whether errors occur, so we can measure and improve performance. They require your consent before being set."
        },
        {
          "type": "h3",
          "text": "Advertising / targeting cookies"
        },
        {
          "type": "p",
          "text": "These are used to build a profile of your interests, show you relevant advertising, and measure advertising effectiveness, often across different websites. They require your consent before being set. **We do not use advertising or targeting cookies and have no current plans to do so.**"
        }
      ]
    },
    {
      "id": "cookies-we-use",
      "heading": "3. Cookies we currently use",
      "blocks": [
        {
          "type": "p",
          "text": "We currently use **strictly necessary cookies only**. These support the security and basic operation of the Service. The table below lists the strictly necessary cookies that may be set when you use the Service today."
        },
        {
          "type": "table",
          "tableHeaders": [
            "Cookie / Name",
            "Provider",
            "Purpose",
            "Duration"
          ],
          "tableRows": [
            [
              "__cf_bm",
              "Cloudflare (our hosting, CDN, and security provider)",
              "Bot management and security. Helps distinguish humans from automated traffic to protect the Service against abuse, fraud, and attacks. Strictly necessary.",
              "Short-lived: a 30-minute expiry, which may be refreshed on continued activity"
            ],
            [
              "cf_clearance (only where a security challenge is presented)",
              "Cloudflare",
              "Set **only if** a Cloudflare security challenge is triggered, for example, when bot or DDoS protections present an interactive challenge, so that you are not repeatedly challenged after passing it. Whether this cookie appears at all depends on Cloudflare's security configuration and your traffic; it is not set by default on every visit. Where set, it is strictly necessary for site security and availability.",
              "Short-lived (typically up to around 30 minutes, subject to Cloudflare's configuration)"
            ]
          ]
        },
        {
          "type": "note",
          "text": "**No analytics, advertising, or tracking.** We currently set **no** analytics/performance cookies, **no** advertising/targeting cookies, and use **no** third-party tracking technologies. We do not use Google Analytics or any comparable tool. Our **fonts are self-hosted** (via `next/font`), so loading our pages makes **no requests to Google Fonts** or other external font services and shares no data with them. The waitlist sign-up form collects only the email address you submit; it does not require us to set any non-essential cookie."
        },
        {
          "type": "p",
          "text": "The exact names and durations of provider-set security cookies (such as Cloudflare's) are controlled by that provider and may change. Where any cookie involves processing of personal data, it is handled in accordance with our [Privacy Policy](/privacy). You can review Cloudflare's privacy practices at [cloudflare.com/privacypolicy](https://www.cloudflare.com/privacypolicy/) and Supabase's (our database/backend provider, which stores your waitlist email) at [supabase.com/privacy](https://supabase.com/privacy)."
        },
        {
          "type": "h3",
          "text": "Planned features"
        },
        {
          "type": "p",
          "text": "When the Seller Dashboard, Stripe-powered payments (via Stripe Connect), the embeddable Widget, and the Discovery Feed marketplace go live, additional **strictly necessary** cookies are likely to be required, for example, to keep you securely signed in to your account, to maintain your session in the dashboard, to protect forms against cross-site request forgery, and to enable secure checkout. Payment functionality will be provided by Stripe, which may set its own strictly necessary cookies for fraud prevention and secure payment processing; see [stripe.com/privacy](https://stripe.com/privacy). We will update this policy to describe these cookies before those features are made available to you."
        }
      ]
    },
    {
      "id": "consent",
      "heading": "4. Your consent",
      "blocks": [
        {
          "type": "p",
          "text": "Under EU ePrivacy rules, **strictly necessary cookies do not require your consent**, because they are essential to deliver a service you have explicitly requested. These are the only cookies we currently use, so no consent banner is required at this time."
        },
        {
          "type": "p",
          "text": "If and when we introduce any **functional, analytics/performance, or advertising/targeting** cookies or similar technologies, we will:"
        },
        {
          "type": "ul",
          "items": [
            "Request your **consent first**, before any non-essential cookie is set, through a clear consent tool (such as a cookie banner or preference centre);",
            "Give you a genuine choice to accept or reject non-essential cookies, with rejecting being as easy as accepting;",
            "Provide a **persistent control**, such as a \"Cookie settings\" link in the site footer, so you can review and change your choices at any time, not only via the initial banner;",
            "Let you **withdraw or change** your consent at any time through that control; and",
            "Update this Cookie Policy to describe the new cookies, their providers, purposes, and durations."
          ]
        },
        {
          "type": "p",
          "text": "We will not treat continued use of the site, scrolling, or closing a banner as valid consent for non-essential cookies."
        }
      ]
    },
    {
      "id": "local-storage",
      "heading": "5. Local storage and similar technologies",
      "blocks": [
        {
          "type": "p",
          "text": "In addition to cookies, a website can use your browser's **local storage** or **session storage** to hold information on your device. This information stays in your browser and is not automatically transmitted to us with every request. Under ePrivacy rules, writing to or reading from this storage requires the same legal basis as a cookie."
        },
        {
          "type": "p",
          "text": "On the current pre-launch landing page, we do **not** use local or session storage for any non-essential purpose, and we do not use it for analytics, advertising, or tracking. Where we use such storage at all, it is only for **strictly necessary** purposes, for example, to temporarily hold information needed for a page or form to function securely."
        },
        {
          "type": "p",
          "text": "As with cookies, we will only use local or session storage for **non-essential** purposes (such as remembering optional preferences or measuring performance) after obtaining your consent, once any such features are introduced. You can clear local and session storage through your browser's settings, typically in the same area used to clear cookies and site data."
        }
      ]
    },
    {
      "id": "managing-cookies",
      "heading": "6. How to control or delete cookies",
      "blocks": [
        {
          "type": "p",
          "text": "Because we currently set strictly necessary cookies only, there is no consent banner to manage today. However, you can always control or delete cookies through your **browser settings**. Most browsers let you view the cookies stored, delete them individually or all at once, and block cookies from some or all websites."
        },
        {
          "type": "p",
          "text": "Instructions for the major browsers are available here:"
        },
        {
          "type": "ul",
          "items": [
            "[Google Chrome](https://support.google.com/chrome/answer/95647)",
            "[Mozilla Firefox](https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox)",
            "[Apple Safari (Mac)](https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac)",
            "[Apple Safari (iPhone/iPad)](https://support.apple.com/en-us/105082)",
            "[Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)"
          ]
        },
        {
          "type": "p",
          "text": "You can also generally find guidance for other browsers in their help or privacy settings, and use private/incognito browsing modes, which typically clear cookies and local storage when the window is closed. On mobile devices, you can clear cookies and site storage from your browser app's settings (for example, under Safari or Chrome settings on iOS or Android)."
        },
        {
          "type": "p",
          "text": "You can clear **local and session storage** the same way, see **Local storage and similar technologies** above for more detail."
        },
        {
          "type": "note",
          "text": "**Please note:** the cookies we currently use are **strictly necessary**. If you block or delete them, parts of the Service, including security checks, the waitlist form, and (in future) signing in to your account or completing a checkout, may not work correctly or may become unavailable."
        }
      ]
    },
    {
      "id": "do-not-track",
      "heading": "7. Do Not Track signals",
      "blocks": [
        {
          "type": "p",
          "text": "Some browsers offer a \"Do Not Track\" (DNT) setting, and some send a Global Privacy Control (GPC) signal, indicating that you do not want to be tracked. There is no consistent industry or legal standard for how websites should respond to these signals."
        },
        {
          "type": "p",
          "text": "Because we currently do **no** tracking and set **no** non-essential cookies, there is nothing for a DNT or GPC signal to disable today. These signals have no effect on our Service because the activity they target, analytics, advertising, and cross-site or behavioural tracking, does not occur here. We do not track you across third-party websites."
        },
        {
          "type": "p",
          "text": "If we introduce optional analytics or other non-essential technologies in the future, we will respect your choices through our consent tool, and we will describe at that time how we treat browser-level signals such as DNT or Global Privacy Control."
        }
      ]
    },
    {
      "id": "changes-and-contact",
      "heading": "8. Changes to this policy and how to contact us",
      "blocks": [
        {
          "type": "p",
          "text": "We may update this Cookie Policy from time to time, for example, when we launch new features such as the Seller Dashboard, payments, the Widget, or the Discovery Feed, or if we introduce new categories of cookies. When we do, we will revise the \"Last updated\" date above, and, where the changes are significant (such as introducing non-essential cookies), we will take appropriate steps to notify you and, where required, obtain your consent before those cookies are set."
        },
        {
          "type": "p",
          "text": "If you have any questions about this Cookie Policy or our use of cookies and similar technologies, please contact us at [rootlabs0@gmail.com](mailto:rootlabs0@gmail.com)."
        },
        {
          "type": "p",
          "text": "For more information about how we handle personal data, including the legal bases we rely on and your data-protection rights, please see our [Privacy Policy](/privacy)."
        }
      ]
    }
  ]
};
