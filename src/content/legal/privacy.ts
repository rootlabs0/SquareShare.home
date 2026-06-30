import type { LegalContent } from "@/components/legal/LegalDocument";

export const privacyContent: LegalContent = {
  "title": "Privacy Policy",
  "subtitle": "How we collect, use, and protect personal data across the Square Share platform, today and when fully launched.",
  "lastUpdated": "22 June 2026",
  "disclaimer": "These documents are provided for general information only. They are a starting template generated for Square Share and should be reviewed by a qualified lawyer before launch and before processing any payments.",
  "intro": [
    {
      "type": "p",
      "text": "**Square Share** (\"**we**\", \"**us**\", \"**our**\") operates the Square Share platform, a SaaS service for portable, embeddable e-commerce that lets creators, digital artists, and indie sellers (\"**Sellers**\") sell products (\"**Artifacts**\") without building a full custom store. This Privacy Policy explains how we handle personal data in accordance with the EU General Data Protection Regulation (**GDPR**) and other applicable data protection laws."
    },
    {
      "type": "note",
      "text": "**Current state, please read this first.** The live site at **squareshare.to** is currently a **pre-launch landing page**. Right now, the **only** personal data we collect is the **email address** you submit to our waitlist form. The Seller Dashboard, Stripe payments, the embeddable Widget, and the Discovery Feed marketplace are **planned but not yet live**. Throughout this policy we clearly mark what is **currently available** versus what is **planned / will apply when launched**."
    },
    {
      "type": "p",
      "text": "This policy works alongside our [Terms of Service](/terms) and [Cookie Policy](/cookies). Words that are capitalised but not defined here have the meaning given to them in the [Terms of Service](/terms)."
    }
  ],
  "sections": [
    {
      "id": "who-we-are",
      "heading": "1. Who we are (data controller) and how to contact us",
      "blocks": [
        {
          "type": "p",
          "text": "Square Share is the **data controller** responsible for the personal data described in this policy. We determine why and how your personal data is processed."
        },
        {
          "type": "p",
          "text": "**Controller identity:** [Square Share, registered legal entity name and registered office in the Czech Republic, to be finalised upon incorporation], established in **the Czech Republic**. Square Share is in the process of incorporation; this block will be finalised on incorporation."
        },
        {
          "type": "note",
          "text": "**Pending incorporation.** Until the Square Share company is incorporated, the natural person (founder) operating Square Share acts as the data controller for the personal data collected during the pre-incorporation period (currently, the waitlist email). On incorporation, the registered entity will become the controller and the identity and registered-address details above will be completed. In either case, the privacy contact point below remains the same."
        },
        {
          "type": "p",
          "text": "**Privacy contact point:** For any question about this policy, about how we handle your personal data, or to exercise your rights, contact us at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)."
        },
        {
          "type": "note",
          "text": "We have **not appointed a Data Protection Officer (DPO)**, as we are not legally required to do so. The email address above ([squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)) is our designated **privacy contact point** for all data protection matters and data-subject requests."
        }
      ]
    },
    {
      "id": "scope",
      "heading": "2. Scope of this policy",
      "blocks": [
        {
          "type": "p",
          "text": "This policy applies to personal data we process in connection with:"
        },
        {
          "type": "ul",
          "items": [
            "the public website at **squareshare.to**, including the **waitlist** form (**currently available**);",
            "the **Seller Dashboard** at **store.squareshare.to**, used to manage inventory, customise the Bento Grid, connect Stripe, and generate the embed snippet (**planned**);",
            "the embeddable JavaScript **Widget** / **Digital Store Shelf** that Sellers embed into their own external websites such as WordPress or Wix (**planned**);",
            "the future public B2C **Discovery Feed** marketplace where Buyers discover and purchase Artifacts (**planned**)."
          ]
        },
        {
          "type": "p",
          "text": "Where a Seller embeds our Widget on their own website, that Seller operates their own site and is responsible for their own privacy practices. We are the controller only for the data we ourselves process as described in this policy."
        }
      ]
    },
    {
      "id": "data-we-collect",
      "heading": "3. What personal data we collect and how",
      "blocks": [
        {
          "type": "h3",
          "text": "(a) Waitlist email, collected now"
        },
        {
          "type": "p",
          "text": "When you sign up to our waitlist on squareshare.to, you submit your **email address**, which we store in our database (hosted on Supabase). This is the **only** personal data we actively collect today. We use it to keep you informed about Square Share's launch and updates. You can withdraw at any time (see **Your rights**)."
        },
        {
          "type": "h3",
          "text": "(b) Seller account and inventory data, when the Dashboard launches"
        },
        {
          "type": "p",
          "text": "When the Seller Dashboard goes live, Sellers who create an account will provide and generate, for example: name, email address and login credentials; account and profile details; Artifact listing and inventory data (titles, descriptions, prices, images and other content you upload); grid customisation settings; and the embed snippet you generate. Some of this content may incidentally contain personal data if you choose to include it."
        },
        {
          "type": "h3",
          "text": "(c) Buyer and transaction data via Stripe, when payments launch"
        },
        {
          "type": "p",
          "text": "When payments go live, purchases will be processed by **Stripe** using **Stripe Connect**. The Seller is the **seller / merchant of record** for their Artifacts and connects their own Stripe account. **Square Share is not a bank, payment institution, or merchant of record**. Stripe is the payment processor."
        },
        {
          "type": "p",
          "text": "Payment card details are collected and processed **directly by Stripe**. We do **not** receive or store full card numbers. Depending on how the Stripe Connect integration is ultimately configured, we may receive limited transaction-related metadata needed to operate the platform, such as a Buyer's email, order details, transaction status, amounts, and timestamps; the exact data flows will be confirmed against the final integration before launch. Stripe processes payment data as its **own independent controller** under its own terms; see [https://stripe.com/privacy](https://stripe.com/privacy)."
        },
        {
          "type": "h3",
          "text": "(d) Data collected automatically"
        },
        {
          "type": "p",
          "text": "As a normal part of hosting and securing our site, our provider **Cloudflare** processes standard server and CDN log data when you visit our sites or (in future) load the Widget. This is not data Square Share actively gathers for its own analytics. It may include: **IP address**, device and browser type, operating system, referring URL, resources requested, and date/time **log data**, processed for content delivery and security. We may also set **strictly necessary / essential cookies** (for example a Cloudflare security cookie such as **__cf_bm**). We currently use **no analytics, advertising, or third-party tracking** of any kind."
        },
        {
          "type": "h3",
          "text": "(e) Data arising when the Widget loads on a third-party site, when the Widget launches"
        },
        {
          "type": "p",
          "text": "When the embeddable Widget is live and a Buyer visits a Seller's external website that embeds it, the Widget loads from our infrastructure. As a normal part of serving that content over the internet, the visitor's browser sends technical request data (such as IP address and browser/device information) to Cloudflare so we can deliver the Widget, secure it, and prevent abuse. This is processed for the purposes described in this policy and is **not** used for advertising or cross-site tracking."
        },
        {
          "type": "h3",
          "text": "(f) Support and communications"
        },
        {
          "type": "p",
          "text": "If you contact us (for example by emailing [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)), we process the information you provide, such as your email address, name, and the content of your message, to respond to and manage your request and keep a record of our correspondence."
        },
        {
          "type": "h3",
          "text": "(g) Where we get your data (sources)"
        },
        {
          "type": "p",
          "text": "Most of the personal data we hold is collected **directly from you** (for example, your waitlist email, account details, and support messages). Some data, however, is **not** collected directly from you:"
        },
        {
          "type": "ul",
          "items": [
            "**From Stripe** (*when payments launch*): we may receive limited transaction data about Buyers, such as Buyer email, order details, amounts, timestamps and transaction status, originating from Stripe as the payment processor;",
            "**Via Cloudflare** (*for site visits now, and for Widget visitors when the Widget launches*): we receive standard technical request data, such as IP address and browser/device information, originating from your connection through Cloudflare as our hosting, CDN and security provider."
          ]
        },
        {
          "type": "p",
          "text": "Where we obtain personal data about you from these sources rather than from you directly, the **source** is Stripe or Cloudflare respectively, the data does not come from publicly accessible sources, and the **categories** obtained are those listed above. Where required, we will provide the information in this policy to indirectly-sourced individuals within a reasonable period and at the latest within **one month**, or at the time of first communication with them (GDPR Art. 14(3))."
        },
        {
          "type": "h3",
          "text": "(h) Whether you must provide your data"
        },
        {
          "type": "p",
          "text": "Providing your **waitlist email** is entirely **voluntary**; if you do not provide it, you simply will not receive launch updates, and there is no other consequence. When the **Dashboard** launches, providing the account data marked as **required** is a **contractual requirement** necessary to create an account and use the Service under our [Terms of Service](/terms), without it we cannot provide the Service. When **payments** launch, certain transaction and financial-record data must be collected to meet our **legal (tax and accounting) obligations**, and failure to provide it may mean we cannot complete the transaction."
        }
      ]
    },
    {
      "id": "purposes-legal-bases",
      "heading": "4. Why we use your data and our legal bases (GDPR Art. 6)",
      "blocks": [
        {
          "type": "p",
          "text": "We only process personal data where we have a valid legal basis under Article 6 GDPR. The table below maps each purpose to the data involved and the legal basis we rely on."
        },
        {
          "type": "table",
          "tableHeaders": [
            "Purpose",
            "Data involved",
            "Legal basis (GDPR Art. 6)"
          ],
          "tableRows": [
            [
              "Send you launch and product **marketing** communications about Square Share via the waitlist",
              "Waitlist email address",
              "**Consent** (Art. 6(1)(a)), given when you submit the waitlist form, specifically for these marketing/launch communications; you may withdraw (unsubscribe) at any time, which stops these emails"
            ],
            [
              "Send logged-in Sellers **service-related** messages about their account and the Service (e.g. security, billing and operational notices), *planned*",
              "Seller account and contact data",
              "**Performance of a contract** (Art. 6(1)(b)) for messages necessary to provide the Service; or **legitimate interests** (Art. 6(1)(f)) in keeping account holders informed about the Service they use. Any future *marketing* emails to Sellers would be sent only on a separate, appropriate basis (such as consent or soft opt-in)"
            ],
            [
              "Create and operate your account and provide the Service (Dashboard, Widget, listings, embedding, marketplace), *planned*",
              "Seller account, profile, inventory and configuration data",
              "**Performance of a contract** (Art. 6(1)(b)), to provide the Service you sign up for under our [Terms of Service](/terms)"
            ],
            [
              "Facilitate purchases of Artifacts between Buyers and Sellers, *planned*",
              "Buyer email, order and transaction data via Stripe",
              "**Performance of a contract** (Art. 6(1)(b)); **legal obligation** for related records (Art. 6(1)(c))"
            ],
            [
              "Secure our platform, prevent fraud and abuse, and maintain availability",
              "IP address, log/device data, essential cookies",
              "**Legitimate interests** (Art. 6(1)(f)), our interest in keeping the Service, our users, and Sellers' embedded Widgets secure and protected from misuse"
            ],
            [
              "Debug, maintain and improve our products and features",
              "Technical / security log data",
              "**Legitimate interests** (Art. 6(1)(f)), our interest in diagnosing problems and improving how the Service performs. We do **not** currently perform analytics or usage tracking; if we introduce analytics in future, we will request consent first (see the [Cookie Policy](/cookies))"
            ],
            [
              "Respond to your support requests and communications",
              "Contact details and message content",
              "**Legitimate interests** (Art. 6(1)(f)), our interest in responding to and managing enquiries; or **performance of a contract** where the request relates to your account"
            ],
            [
              "Comply with tax, accounting and other legal obligations, *applies when payments launch*",
              "Transaction and financial records",
              "**Legal obligation** (Art. 6(1)(c))"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Where we rely on **legitimate interests**, we have balanced those interests against your rights and freedoms and concluded they are not overridden. You can object to this processing at any time (see **Your rights**)."
        }
      ]
    },
    {
      "id": "recipients-subprocessors",
      "heading": "5. Recipients and sub-processors",
      "blocks": [
        {
          "type": "p",
          "text": "We do not sell your personal data. We share it only with the trusted service providers we rely on to run the Service, and with others where legally required or permitted. We use the following providers:"
        },
        {
          "type": "table",
          "tableHeaders": [
            "Provider",
            "Purpose",
            "Privacy policy"
          ],
          "tableRows": [
            [
              "**Supabase**",
              "Database / backend (our processor), stores the waitlist email today and (in future) account and inventory data",
              "[https://supabase.com/privacy](https://supabase.com/privacy)"
            ],
            [
              "**Stripe**",
              "Payment processing via Stripe Connect (*planned*). Stripe acts as an **independent controller** for payment data, and as our **processor** only for any platform-related data we instruct it to handle on our behalf",
              "[https://stripe.com/privacy](https://stripe.com/privacy)"
            ],
            [
              "**Cloudflare**",
              "Hosting, CDN, edge runtime, DDoS protection and security (our processor)",
              "[https://www.cloudflare.com/privacypolicy/](https://www.cloudflare.com/privacypolicy/)"
            ]
          ]
        },
        {
          "type": "p",
          "text": "Our fonts are **self-hosted** (via next/font), so **no data is sent to Google Fonts**. We use **no analytics, advertising, or third-party tracking** services."
        },
        {
          "type": "p",
          "text": "We may also disclose personal data:"
        },
        {
          "type": "ul",
          "items": [
            "to **public authorities, regulators, courts or law enforcement** where required by law or to establish, exercise or defend legal claims;",
            "to our **professional advisers** (such as lawyers, accountants and auditors) where reasonably necessary and under a duty of confidentiality;",
            "in connection with a **business transfer**, for example a merger, acquisition, financing, reorganisation or sale of assets, in which case personal data may be transferred to the relevant party, subject to this policy."
          ]
        }
      ]
    },
    {
      "id": "international-transfers",
      "heading": "6. International data transfers (GDPR Art. 44–49)",
      "blocks": [
        {
          "type": "p",
          "text": "Some of our sub-processors process personal data in the **United States**. Transfers to the United States occur in connection with **Supabase**, **Stripe** and **Cloudflare**, which process data outside the European Economic Area (EEA)."
        },
        {
          "type": "p",
          "text": "There is **no general GDPR adequacy decision for the United States**. Accordingly, for transfers of personal data to the United States we rely on:"
        },
        {
          "type": "ul",
          "items": [
            "the **EU-US Data Privacy Framework (DPF)** where the recipient is **DPF-certified**; and otherwise",
            "the European Commission's **Standard Contractual Clauses (SCCs)** (Commission Implementing Decision (EU) 2021/914), supplemented by additional technical and organisational measures following a transfer impact assessment."
          ]
        },
        {
          "type": "p",
          "text": "Where personal data is transferred to a country the European Commission has formally recognised as providing adequate protection, we may rely on that **adequacy decision**. We are committed to ensuring an appropriate Chapter V safeguard is in place for each transfer; as the controller entity is finalised on incorporation, we will confirm and document each provider's current transfer mechanism (for example DPF certification or executed SCCs) before launch. You can request more information about these safeguards by contacting [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)."
        }
      ]
    },
    {
      "id": "data-retention",
      "heading": "7. How long we keep your data",
      "blocks": [
        {
          "type": "p",
          "text": "We keep personal data only for as long as necessary for the purposes set out in this policy, then delete or anonymise it. Our retention periods are:"
        },
        {
          "type": "table",
          "tableHeaders": [
            "Category",
            "Retention period"
          ],
          "tableRows": [
            [
              "**Waitlist email**",
              "Until you withdraw / unsubscribe, or at the latest [e.g. 24 months] after the Service launches or the waitlist is discontinued, whichever is earlier, after which the email is deleted"
            ],
            [
              "**Seller account and inventory data** (*planned*)",
              "For the life of your account, plus [e.g. 90 days] after closure to handle deletion and disputes, save where longer retention is required to establish, exercise or defend legal claims up to the applicable limitation period, after which it is deleted or anonymised"
            ],
            [
              "**Buyer / transaction data** (*planned*)",
              "[e.g. 24 months] after the transaction, to support the transaction and handle chargebacks and disputes, unless a longer period is required by law"
            ],
            [
              "**Financial and tax records** (*applies when payments launch*)",
              "For **10 years** as required by applicable Czech tax and accounting law (in particular the 10-year retention period for tax documents under the Czech VAT Act; certain accounting records must be kept for at least 5 years under the Czech Accounting Act)"
            ],
            [
              "**Support communications**",
              "[e.g. 24 months] after the matter is closed, for our records"
            ],
            [
              "**Technical / security log data**",
              "Retained only as long as needed to investigate and prevent abuse and in line with our hosting/CDN provider's standard log retention, typically no longer than [e.g. 30–90 days], after which it is deleted or aggregated"
            ]
          ]
        }
      ]
    },
    {
      "id": "your-rights",
      "heading": "8. Your rights (GDPR Art. 15–22)",
      "blocks": [
        {
          "type": "p",
          "text": "Subject to the conditions in the GDPR, you have the following rights over your personal data:"
        },
        {
          "type": "ul",
          "items": [
            "**Access** (Art. 15), obtain confirmation of whether we process your data and a copy of it;",
            "**Rectification** (Art. 16), correct inaccurate or incomplete data;",
            "**Erasure** (Art. 17), ask us to delete your data (the 'right to be forgotten');",
            "**Restriction** (Art. 18), ask us to limit how we use your data;",
            "**Portability** (Art. 20), receive certain data in a structured, commonly used, machine-readable format, or have it transmitted to another controller;",
            "**Object** (Art. 21), object to processing based on our legitimate interests, and to direct marketing at any time;",
            "**Withdraw consent** (Art. 7(3)), where we rely on consent (such as the waitlist), withdraw it at any time, without affecting processing already carried out."
          ]
        },
        {
          "type": "p",
          "text": "**How to exercise your rights:** email us at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com). We will respond **within one month** of receiving your request, though we may extend this by up to two further months for complex or numerous requests, in which case we will let you know. Exercising your rights is free unless your request is manifestly unfounded or excessive."
        },
        {
          "type": "p",
          "text": "**Right to complain (Art. 77):** if you believe we have not handled your personal data lawfully, you may lodge a complaint with a supervisory authority, in particular our lead supervisory authority, the Czech **Office for Personal Data Protection** (*Úřad pro ochranu osobních údajů*, **ÚOOÚ**), [https://uoou.gov.cz](https://uoou.gov.cz), or the supervisory authority in your country of residence or work. We would, however, appreciate the chance to address your concerns first."
        }
      ]
    },
    {
      "id": "cookies",
      "heading": "9. Cookies",
      "blocks": [
        {
          "type": "p",
          "text": "We currently use only **strictly necessary / essential cookies** (for example a Cloudflare security cookie such as **__cf_bm**). We do **not** currently use analytics or marketing cookies. If we add analytics in future, we will ask for your **consent first**."
        },
        {
          "type": "p",
          "text": "For full details of the cookies we use and how to manage them, see our [Cookie Policy](/cookies)."
        }
      ]
    },
    {
      "id": "automated-decisions",
      "heading": "10. Automated decision-making and profiling",
      "blocks": [
        {
          "type": "p",
          "text": "**Square Share does not** carry out automated decision-making that produces legal or similarly significant effects about you, and we do not engage in profiling for such purposes."
        },
        {
          "type": "p",
          "text": "When payments are live, **Stripe** may run automated **fraud and risk checks** on transactions as part of processing payments. These checks **may result in a transaction being declined**. Square Share does not make these decisions. Where such checks involve solely automated decision-making producing legal or similarly significant effects, your rights in relation to that processing are as set out in **Stripe's** privacy policy ([https://stripe.com/privacy](https://stripe.com/privacy)); you may also contact us at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com) and we will assist where we can in raising the matter with Stripe."
        }
      ]
    },
    {
      "id": "childrens-privacy",
      "heading": "11. Children's privacy",
      "blocks": [
        {
          "type": "p",
          "text": "The Service is directed to **businesses and adults**. You must be at least **18** (or the age of majority in your country) to register or transact. The Service is **not directed to children**."
        },
        {
          "type": "p",
          "text": "Under **GDPR Art. 8**, the age below which a child cannot consent to information-society services without parental authorisation is **16**, unless the member state of our establishment has set a lower age (member states may set it as low as **13**). The **Czech Republic** has set this age at **15** (Section 7 of Act No. 110/2019 Coll.). We treat **16** as our general threshold (and in no case process the data of a Czech child under **15** on the basis of their own consent), and we do **not knowingly collect** personal data from anyone below the applicable age."
        },
        {
          "type": "p",
          "text": "If you believe a child has provided us with personal data, contact [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com) and we will take appropriate steps to delete it."
        }
      ]
    },
    {
      "id": "security",
      "heading": "12. Security and data breaches",
      "blocks": [
        {
          "type": "p",
          "text": "We take appropriate technical and organisational measures to protect personal data against unauthorised access, loss, misuse, or alteration. These include:"
        },
        {
          "type": "ul",
          "items": [
            "**encryption in transit** (HTTPS) and **encryption at rest** for stored data (for example, database encryption at rest provided by Supabase);",
            "**role-based, least-privilege access controls** and authentication, with **multi-factor authentication** for administrative access;",
            "reliance on **reputable infrastructure providers** (Supabase, Cloudflare and, in future, Stripe), with **regular review** of sub-processor security;",
            "**DDoS and edge security** via Cloudflare;",
            "**data minimisation**, collecting only the data we need, and ensuring that **payment card data never touches our systems** (it is handled directly by Stripe)."
          ]
        },
        {
          "type": "p",
          "text": "No method of transmission or storage is completely secure. If a personal data breach occurs that is likely to result in a risk to your rights and freedoms, we will **notify the competent supervisory authority within 72 hours** where required (GDPR Art. 33) and inform affected individuals without undue delay where the breach is likely to result in a **high risk** to them (Art. 34)."
        }
      ]
    },
    {
      "id": "no-sale-of-data",
      "heading": "13. We do not sell your data",
      "blocks": [
        {
          "type": "p",
          "text": "**We do not sell your personal data, and we do not share it for cross-context behavioural advertising.** We share data only with the sub-processors and recipients described in this policy, for the purposes set out here."
        },
        {
          "type": "p",
          "text": "For California residents, this means we do **not** \"**sell**\" or \"**share**\" personal information as those terms are defined under the **CCPA/CPRA** (including sharing for cross-context behavioural advertising), and there is therefore **no opt-out to exercise**. See **Section 14** for your California privacy rights."
        }
      ]
    },
    {
      "id": "california-privacy",
      "heading": "14. California privacy rights (CCPA / CPRA)",
      "blocks": [
        {
          "type": "p",
          "text": "If you are a California resident, the California Consumer Privacy Act, as amended by the California Privacy Rights Act (**CCPA/CPRA**), gives you certain rights. This section supplements the rest of this policy."
        },
        {
          "type": "h3",
          "text": "Categories of personal information we collect"
        },
        {
          "type": "ul",
          "items": [
            "**Identifiers**, such as email address and, in future, name and account credentials, and IP address;",
            "**Internet or network activity**, such as log data, device/browser information, and essential-cookie data;",
            "**Commercial information**, *when payments launch*, order and transaction details (payment card data is handled directly by Stripe);",
            "**Customer records / contact information**, information you provide when you contact support."
          ]
        },
        {
          "type": "h3",
          "text": "Sensitive personal information"
        },
        {
          "type": "p",
          "text": "When accounts launch, we will collect account **log-in credentials in combination with a password**, which is treated as **sensitive personal information** under the CPRA. We use it **solely** to authenticate you and provide the Service, and not for any purpose that would trigger the **Right to Limit Use of Sensitive Personal Information**. We do **not** otherwise collect sensitive personal information, and we do not use or disclose it for purposes that require offering that right."
        },
        {
          "type": "h3",
          "text": "Sources, business purposes, and recipients"
        },
        {
          "type": "p",
          "text": "We collect these categories **from you directly** and **automatically (via Cloudflare)**. We use them for the following **business and commercial purposes**: providing, operating and securing the Service; processing transactions (when payments launch); communicating with users and responding to support; fraud prevention; and legal compliance. We do **not** collect additional categories of personal information, or use personal information for materially different, unrelated, or incompatible purposes, without providing notice."
        },
        {
          "type": "p",
          "text": "We disclose the categories above to our **service providers** (database/hosting, payment processing and security providers, see **Section 5**), and may disclose them to **government authorities**, **professional advisers**, and **parties to a business transfer**. We do **not** disclose personal information to third parties for their own commercial purposes."
        },
        {
          "type": "h3",
          "text": "Retention"
        },
        {
          "type": "p",
          "text": "We retain each category of personal information for the periods, or according to the criteria, described in **Section 7 (How long we keep your data)**."
        },
        {
          "type": "h3",
          "text": "Your California rights"
        },
        {
          "type": "ul",
          "items": [
            "**Right to know** the categories and specific pieces of personal information we have collected, the sources, purposes, and the categories of third parties with whom we share it;",
            "**Right to delete** personal information we hold about you, subject to legal exceptions;",
            "**Right to correct** inaccurate personal information;",
            "**Right to opt out of the 'sale' or 'sharing'** of personal information, **we do not sell or share your personal information** as those terms are defined under the CCPA/CPRA, so there is nothing to opt out of;",
            "**Right to limit the use of sensitive personal information**, as explained above, we use the only sensitive personal information we collect (account credentials) solely to provide the Service, so this right does not apply;",
            "**Right to non-discrimination**, we will **not** deny you services, charge different prices, or provide a different level or quality of service because you exercised your CCPA/CPRA rights, and we do not offer financial incentives in exchange for personal information."
          ]
        },
        {
          "type": "p",
          "text": "Because the Service is restricted to adults (18+), we do **not** knowingly collect, sell, or share the personal information of consumers under 16; if we learn that we have, we will delete it."
        },
        {
          "type": "h3",
          "text": "How to submit a request and use of an authorised agent"
        },
        {
          "type": "p",
          "text": "To exercise any of these rights, email [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com); this channel applies to all California requests. We **verify** requests by matching the information you provide (such as your email address) against our records, and may request additional information for higher-risk requests. You may designate an **authorised agent** by providing the agent with **signed, written permission** to act on your behalf; we may require you to verify your own identity directly with us and/or to confirm that you authorised the agent."
        }
      ]
    },
    {
      "id": "uk-gdpr",
      "heading": "15. UK GDPR",
      "blocks": [
        {
          "type": "p",
          "text": "If you are in the **United Kingdom**, we process your personal data in accordance with the **UK GDPR** and the **Data Protection Act 2018**. The rights and protections described in this policy apply equivalently. Transfers of UK personal data outside the UK are protected by appropriate safeguards, such as the UK International Data Transfer Agreement (IDTA), the UK Addendum to the Standard Contractual Clauses, or the UK Extension to the EU-US Data Privacy Framework where applicable."
        },
        {
          "type": "p",
          "text": "**Complaints:** You have the right to lodge a complaint with the UK **Information Commissioner's Office (ICO)**, [https://ico.org.uk](https://ico.org.uk), or by calling its helpline."
        }
      ]
    },
    {
      "id": "changes-and-contact",
      "heading": "16. Changes to this policy and contact",
      "blocks": [
        {
          "type": "p",
          "text": "We may update this Privacy Policy from time to time, for example, when we launch the Dashboard, payments, the Widget, or the marketplace. When we make material changes, we will update the date below and, where appropriate, notify you. The current version always governs."
        },
        {
          "type": "p",
          "text": "For any privacy question or to exercise your rights, contact our privacy contact point at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)."
        },
        {
          "type": "note",
          "text": "**Last updated: 22 June 2026.** See also our [Terms of Service](/terms) and [Cookie Policy](/cookies)."
        }
      ]
    }
  ]
};
