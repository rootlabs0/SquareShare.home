import type { LegalContent } from "@/components/legal/LegalDocument";

export const termsContent: LegalContent = {
  "title": "Terms of Service",
  "subtitle": "The agreement that governs your use of Square Share, including our waitlist today and the full platform when it launches.",
  "lastUpdated": "22 June 2026",
  "disclaimer": "These documents are provided for general information only. They are a starting template generated for Square Share and should be reviewed by a qualified lawyer before launch and before processing any payments.",
  "intro": [
    {
      "type": "p",
      "text": "These Terms of Service (the **Terms**) form a legally binding agreement between you and Square Share, the operator of the Square Share platform (**we**, **us**, **our**). They explain the rules for using our website, our waitlist, and, when launched, our full e-commerce platform."
    },
    {
      "type": "note",
      "text": "**What's live today.** Right now, [squareshare.to](https://squareshare.to) is a pre-launch landing page. The only thing you can do is join our **waitlist** by submitting your email address. The Seller Dashboard, the embeddable Widget, Stripe payments, and the Discovery Feed marketplace are **planned and not yet available**. Sections of these Terms that describe those features will apply to you **only when, and if, they go live**. We have written these Terms to cover both today's waitlist-only reality and the planned full service."
    },
    {
      "type": "p",
      "text": "Please also read our [Privacy Policy](/privacy) and [Cookie Policy](/cookies), which are incorporated into these Terms by reference and explain how we handle personal data and cookies."
    },
    {
      "type": "p",
      "text": "By joining our waitlist, creating an account, embedding our Widget, using the platform to purchase an Artifact from a Seller, or otherwise using the Service, you confirm that you have read, understood, and agree to be bound by these Terms. **If you do not agree, do not use the Service.**"
    },
    {
      "type": "note",
      "text": "**Square Share is a facilitator only.** The contract of sale for any Artifact is concluded directly and exclusively between the Buyer and the Seller. Square Share is not the seller, supplier, merchant of record, or a party to that sale contract. These Terms govern your use of the Square Share platform; they do **not** govern the sale contract between Buyer and Seller, which is subject to the Seller's own terms and applicable consumer law."
    }
  ],
  "sections": [
    {
      "id": "who-we-are",
      "heading": "1. Who we are and who these Terms apply to",
      "blocks": [
        {
          "type": "p",
          "text": "Square Share operates a SaaS platform for **portable, embeddable e-commerce**. The platform lets creators, digital artists, and indie sellers sell their products without building a full custom online store. The platform is operated by [Square Share, registered legal entity name and registered office in the Czech Republic, to be finalised upon incorporation], established in **the Czech Republic**."
        },
        {
          "type": "note",
          "text": "**Company status.** Square Share is currently in the process of incorporation. Once incorporation is complete, the bracketed registered entity name and address above will be finalised and these Terms will be updated accordingly. Until then, the operator is the team building Square Share, contactable at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)."
        },
        {
          "type": "p",
          "text": "These Terms apply to everyone who interacts with the Service, in any of the following roles:"
        },
        {
          "type": "ul",
          "items": [
            "**Visitors**, anyone who browses our website or joins the waitlist.",
            "**Sellers**, creators, digital artists, and indie sellers who register an account to list and sell Artifacts (available when the Dashboard launches).",
            "**Buyers**, people who use the platform to purchase an Artifact through a Seller's embedded Widget or the future Marketplace (available when those features launch)."
          ]
        },
        {
          "type": "note",
          "text": "**Our role is to facilitate, not to sell.** Square Share is a facilitator only. The contract of sale for any Artifact is concluded directly and exclusively between the Buyer and the Seller. Square Share is not the seller, supplier, merchant of record, or a party to that sale contract. These Terms govern your use of the Square Share platform; they do not govern the sale contract between Buyer and Seller, which is subject to the Seller's own terms and applicable consumer law."
        },
        {
          "type": "p",
          "text": "Some sections apply only to a specific role; where that is the case, the section says so."
        }
      ]
    },
    {
      "id": "definitions",
      "heading": "2. Definitions",
      "blocks": [
        {
          "type": "p",
          "text": "In these Terms, capitalised terms have the following meanings:"
        },
        {
          "type": "table",
          "tableHeaders": [
            "Term",
            "Meaning"
          ],
          "tableRows": [
            [
              "**Service**",
              "The Square Share website at [squareshare.to](https://squareshare.to), the waitlist, and, when launched, the Seller Dashboard, the Widget, payment facilitation, the Marketplace, and all related software, content, and features we make available."
            ],
            [
              "**Seller**",
              "A creator, digital artist, indie seller, or other person or organisation that registers an account to list and sell Artifacts through the Service. As between Seller and Buyer, the Seller is the seller and merchant of record."
            ],
            [
              "**Buyer**",
              "A person who purchases, or seeks to purchase, an Artifact from a Seller through the Service."
            ],
            [
              "**Consumer**",
              "A natural person who is acting for purposes wholly or mainly outside that person's trade, business, craft, or profession. A Buyer who purchases in a business capacity is not a Consumer."
            ],
            [
              "**Artifact**",
              "A product, digital or otherwise, that a Seller lists for sale through the Service."
            ],
            [
              "**Widget** (or **Digital Store Shelf**)",
              "The embeddable JavaScript component that Sellers embed into their own external websites (such as WordPress or Wix) to display a customizable **Bento Grid** of their Artifacts."
            ],
            [
              "**Dashboard** (or **Seller Dashboard**)",
              "The Seller-facing interface at [store.squareshare.to](https://store.squareshare.to) used to manage inventory, customize the grid, connect Stripe, and generate the embed snippet."
            ],
            [
              "**Marketplace** (or **Discovery Feed**)",
              "The planned public, business-to-consumer feed where Buyers discover and purchase Artifacts."
            ],
            [
              "**Stripe**",
              "The third-party payment service provider used to process payments for Artifacts. Sellers connect their own Stripe accounts via **Stripe Connect**, and Stripe processes Buyer payments into the Seller's connected account."
            ],
            [
              "**Content**",
              "Any text, images, descriptions, branding, files, or other materials a Seller uploads, lists, or otherwise provides through the Service."
            ]
          ]
        }
      ]
    },
    {
      "id": "eligibility",
      "heading": "3. Eligibility, age, and capacity",
      "blocks": [
        {
          "type": "p",
          "text": "The Service is directed to businesses and adults. To join the waitlist, register an account, or transact, you must be at least **18 years old**, or the **age of majority** in your country of residence if that is higher."
        },
        {
          "type": "p",
          "text": "By using the Service, you confirm that:"
        },
        {
          "type": "ul",
          "items": [
            "you meet the age requirement above and have the legal capacity to enter into a binding contract;",
            "if you use the Service on behalf of an organisation, you have the **authority to bind that organisation** to these Terms, and **you** and **your** then refer to that organisation; and",
            "your use of the Service complies with all laws that apply to you."
          ]
        },
        {
          "type": "p",
          "text": "The Service is **not directed to children**. We do not knowingly collect personal data from anyone under 16 (consistent with Article 8 GDPR). If you believe a child has provided us with personal data, contact us at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com) and we will take appropriate steps."
        }
      ]
    },
    {
      "id": "pre-launch-beta",
      "heading": "4. Current pre-launch status and beta basis",
      "blocks": [
        {
          "type": "p",
          "text": "Square Share is in a **pre-launch** phase. Today, the only feature available is the **waitlist**, through which you may submit your email address so we can notify you about availability and updates."
        },
        {
          "type": "note",
          "text": "The Seller Dashboard, the Widget, Stripe payments, and the Marketplace are **planned but not yet live**. We make no promise that any of these features will launch, launch on any particular date, or include any particular functionality. We may change, delay, or cancel planned features at any time."
        },
        {
          "type": "p",
          "text": "When features do launch, they may initially be offered on a **beta** or early-access basis. To the fullest extent permitted by law, beta features are provided **\"as is\"** and **\"as available\"**, may contain errors, and may be modified or withdrawn without notice. We do not guarantee that the Service will be uninterrupted, error-free, secure, or available at any particular time."
        },
        {
          "type": "p",
          "text": "This section is **subject to**, and does not limit, the mandatory-liability savings and consumer protections set out in the **Limitation of liability** section below, including liability that cannot lawfully be excluded and the mandatory rights of Consumers, which prevail over this section."
        }
      ]
    },
    {
      "id": "accounts",
      "heading": "5. Accounts",
      "blocks": [
        {
          "type": "p",
          "text": "Joining the waitlist does not create an account. When account registration launches, the following will apply."
        },
        {
          "type": "ul",
          "items": [
            "**Accurate information.** You must provide accurate, current, and complete information when registering, and keep it up to date.",
            "**Credential security.** You are responsible for keeping your login credentials confidential and for all activity that occurs under your account.",
            "**Responsibility for activity.** You must notify us promptly at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com) if you suspect any unauthorised use of, or security breach affecting, your account.",
            "**One identity.** You must not impersonate any person or organisation, or misrepresent your affiliation with anyone."
          ]
        },
        {
          "type": "p",
          "text": "We may refuse, suspend, or terminate an account in accordance with the **Suspension and termination** section below."
        }
      ]
    },
    {
      "id": "seller-obligations",
      "heading": "6. Seller obligations",
      "blocks": [
        {
          "type": "p",
          "text": "This section applies to Sellers once the Dashboard and selling features launch. As a Seller, you are solely responsible for your Artifacts and your business. In particular, you must:"
        },
        {
          "type": "ul",
          "items": [
            "**List accurately.** Ensure your listings, prices, descriptions, and images are accurate, not misleading, and kept up to date.",
            "**Sell only lawful Artifacts you have the right to sell.** Only list Artifacts that are lawful and that you own or are otherwise authorised to sell, and that do not infringe anyone else's rights.",
            "**Disclose your trading identity.** Accurately disclose your trading identity and contact details to Buyers at or before checkout. Square Share's platform (when launched) surfaces these details to Buyers, but you remain responsible for their accuracy and completeness.",
            "**Provide mandatory pre-contractual information.** As the trader and merchant of record, provide Buyers, before they are bound, with all mandatory pre-contractual information required by consumer law, including your identity and contact details, the total price including taxes, delivery/performance terms, the conditions and time limit for exercising the right of withdrawal, and the legal guarantee of conformity.",
            "**Honour consumer rights.** Meet all consumer-protection obligations that apply to your sales, including pre-contract information duties, the **14-day right of withdrawal** for distance contracts, the statutory legal guarantee of conformity, remedies for non-conforming Artifacts, and complaints handling. Where a Buyer validly withdraws or exercises a statutory remedy, you must provide the required refund (for withdrawal, generally within 14 days).",
            "**Operate the withdrawal mechanism correctly.** Where the right of withdrawal applies, present the withdrawal-waiver consent at checkout where relevant, supply Buyers with a model withdrawal form and clear withdrawal instructions, and provide durable-medium confirmation of any consent and acknowledgment. Square Share's checkout/platform (when launched) makes the consent and acknowledgment mechanism available; you remain responsible for using it correctly.",
            "**Handle your own fulfilment and customer service.** Deliver Artifacts to Buyers and provide your own customer support, returns handling, and dispute resolution.",
            "**Handle your own taxes and VAT.** Determine, collect, report, and remit all taxes (including VAT) due on your sales. Square Share does not do this for you and is not your tax agent.",
            "**Comply with AML, sanctions, and KYC requirements.** You are responsible for complying with all applicable anti-money-laundering, counter-terrorist-financing, and sanctions laws, and for completing and satisfying Stripe's identity-verification (KYC), onboarding, and due-diligence requirements. You must not use the Service or Stripe in breach of any sanctions or to launder funds.",
            "**Keep records.** Retain your own sales, transaction, and tax records for at least the statutory period of **10 years** (the 10-year retention period for tax documents under Czech tax law), as required by applicable law.",
            "**Comply with Stripe's requirements.** Maintain a valid, compliant Stripe account and comply with Stripe's terms (see the **Payments and fees** section)."
          ]
        },
        {
          "type": "note",
          "text": "As between you and the Buyer, **you are the seller and merchant of record** for your Artifacts. Square Share operates the platform that facilitates listings and embedding; it does not sell your Artifacts and is not a party to the sale contract between you and your Buyer."
        }
      ]
    },
    {
      "id": "widget-licence",
      "heading": "7. Widget licence and restrictions",
      "blocks": [
        {
          "type": "p",
          "text": "When the Widget launches, and subject to your compliance with these Terms, we grant you a **limited, revocable, non-exclusive, non-transferable, non-sublicensable licence** to embed and display the Widget (the Digital Store Shelf) on websites you own or control, solely to display and sell your own Artifacts."
        },
        {
          "type": "p",
          "text": "You must **not**, and must not allow anyone else to:"
        },
        {
          "type": "ul",
          "items": [
            "copy, modify, reverse engineer, decompile, or attempt to extract the source code of the Widget or any part of the Service, except where this restriction is prohibited by mandatory law;",
            "resell, rent, sublicense, or otherwise make the Widget available to third parties as a standalone product;",
            "interfere with, disrupt, overload, or attempt to gain unauthorised access to the Widget, the Service, or related systems;",
            "embed or use the Widget on any website that is unlawful, infringing, deceptive, or that otherwise breaches these Terms or the **Acceptable Use Policy**; or",
            "remove, obscure, or alter any proprietary notices in the Widget or Service."
          ]
        },
        {
          "type": "p",
          "text": "**You are responsible for the website on which you embed the Widget**, including its lawfulness, security, cookie and privacy compliance, and the accuracy of everything you publish there. We may revoke or suspend the Widget licence at any time in accordance with these Terms, including where the embedding site breaches them."
        }
      ]
    },
    {
      "id": "payments-fees",
      "heading": "8. Payments and fees",
      "blocks": [
        {
          "type": "p",
          "text": "Payments are **not yet live**. This section will apply when payment features launch."
        },
        {
          "type": "h3",
          "text": "How payments work"
        },
        {
          "type": "p",
          "text": "Payments for Artifacts are processed by **Stripe** using **Stripe Connect**. Each Seller connects their **own Stripe account** to receive payments. To use payments, you must register for Stripe and **accept Stripe's own terms of service**; your use of Stripe is governed by your agreement with Stripe, not by us."
        },
        {
          "type": "note",
          "text": "**Square Share does not receive, hold, or transmit Buyer or Seller funds.** Buyer payments are processed by Stripe and settled directly into the Seller's connected Stripe account; Square Share's platform fee is collected by Stripe and remitted to Square Share. Square Share is **not** the merchant of record, is not a bank, payment institution, or money-services business. Stripe is the payment processor and the **Seller is the seller and merchant of record**."
        },
        {
          "type": "h3",
          "text": "Platform fee"
        },
        {
          "type": "p",
          "text": "Square Share charges a platform fee/commission of **[fee %]** of the gross sale price of each Artifact, collected automatically as a **Stripe Connect application fee** deducted from the transaction at the time of sale. The fee schedule in effect at the time of a sale, as shown in your Dashboard, applies and is binding. Stripe's own processing fees are separate and charged by Stripe."
        },
        {
          "type": "h3",
          "text": "Taxes and record-keeping"
        },
        {
          "type": "ul",
          "items": [
            "**Taxes and VAT** on Artifact sales are the **Seller's responsibility**, as set out in the **Seller obligations** section.",
            "**Financial records.** Square Share and/or Stripe retain transaction and financial records as required to operate the Service and comply with law, and such records are kept for at least the statutory period of **10 years** (the 10-year retention period for tax documents under Czech tax law). The Seller is responsible for keeping their own sales and tax records. See our [Privacy Policy](/privacy) for data-retention detail."
          ]
        },
        {
          "type": "h3",
          "text": "Refunds, chargebacks, and AML"
        },
        {
          "type": "ul",
          "items": [
            "**Refunds and chargebacks** are handled between the Buyer, the Seller, and Stripe in accordance with applicable mandatory consumer law (which prevails), and then the Seller's published policies and Stripe's rules. Where a Consumer validly exercises a right of withdrawal or a statutory remedy, the Seller must refund as required by law (for withdrawal, generally within 14 days).",
            "**Fee on refund.** Where a sale is refunded, the platform fee is handled in accordance with the then-current fee policy shown in your Dashboard.",
            "**Chargeback and negative-balance liability.** Chargebacks, disputes, reversals, related fees, and any resulting negative balance are the **Seller's responsibility** and are settled between the Seller and Stripe under the Stripe Connect agreement. Square Share does not fund refunds or chargebacks and may recover from the Seller any amounts Square Share is charged as a result.",
            "**AML, sanctions, and KYC.** Sellers must comply with all applicable anti-money-laundering, counter-terrorist-financing, and sanctions laws, and complete Stripe's KYC, onboarding, and due-diligence requirements, as set out in the **Seller obligations** section."
          ]
        }
      ]
    },
    {
      "id": "buyer-terms",
      "heading": "9. Buyer terms",
      "blocks": [
        {
          "type": "p",
          "text": "This section applies to Buyers once purchasing launches."
        },
        {
          "type": "note",
          "text": "When you buy an Artifact, **your contract is directly and exclusively with the Seller**, not with Square Share. Square Share is a **facilitator** that provides the platform and embedding technology; it is not the seller, supplier, or merchant of record for any Artifact, and is not a party to the sale contract."
        },
        {
          "type": "h3",
          "text": "Pre-contractual information"
        },
        {
          "type": "p",
          "text": "Before you are bound by a purchase, the Seller, as the trader and merchant of record, must provide the mandatory pre-contractual information required by consumer law, including the Seller's identity and contact details, the total price including taxes, delivery/performance terms, the conditions and time limit for exercising the right of withdrawal, and the legal guarantee of conformity. Square Share's platform surfaces the Seller's identity and contact details, but the Seller is responsible for their accuracy and for providing the full pre-contractual information."
        },
        {
          "type": "h3",
          "text": "Your consumer rights (where you are a Consumer)"
        },
        {
          "type": "note",
          "text": "**Your mandatory rights cannot be taken away.** These Terms do not exclude, restrict, or waive any mandatory consumer right you have under EU or your local consumer-protection law, and any provision that purported to do so does not apply to you. These rights are non-derogable and run **against the Seller** as merchant of record. They include, where applicable: the legal guarantee of conformity for goods and for digital content/services (Directives (EU) 2019/771 and 2019/770), remedies for non-conforming Artifacts, the right to clear pre-contract information, and the 14-day right of withdrawal for distance contracts."
        },
        {
          "type": "ul",
          "items": [
            "The Seller is responsible for the Artifact, its description, delivery, support, returns, and for honouring your consumer rights.",
            "**Who gets these rights.** Consumer-protection rights (including the right of withdrawal and the statutory guarantees) apply only to Buyers who are **Consumers** (a natural person acting wholly or mainly outside a trade, business, craft, or profession). Buyers purchasing in a **business capacity do not** benefit from the consumer right of withdrawal or the mandatory consumer guarantees, although the contractual terms agreed with the Seller still apply.",
            "**Right of withdrawal.** Where you buy as a Consumer under a distance contract, you generally have a **14-day right of withdrawal**. For digital content, this period runs from the conclusion of the contract; for goods, it generally runs from delivery. Sellers must give you a model withdrawal form and clear withdrawal instructions where the right applies.",
            "**Digital-content waiver (CRD Art. 16(m)).** For a digital Artifact supplied immediately and not on a tangible medium, you lose the right of withdrawal **only if all three** of the following are met: (1) you give **prior express consent** to performance beginning before the withdrawal period ends; (2) you **acknowledge** that you thereby lose the right of withdrawal; **and** (3) the Seller provides **confirmation of that consent and acknowledgment on a durable medium**. Square Share's checkout (when launched) makes this consent and acknowledgment mechanism available; the Seller remains responsible for using it correctly and supplying the durable-medium confirmation.",
            "Any complaint or dispute about an Artifact should be raised first with the **Seller**. Square Share may, but is not obliged to, help facilitate communication."
          ]
        }
      ]
    },
    {
      "id": "acceptable-use",
      "heading": "10. Acceptable Use Policy",
      "blocks": [
        {
          "type": "p",
          "text": "Everyone using the Service must comply with this Acceptable Use Policy. You must **not** use the Service to list, sell, promote, or do any of the following."
        },
        {
          "type": "h3",
          "text": "Prohibited products"
        },
        {
          "type": "ul",
          "items": [
            "illegal goods or services, or goods that are regulated or restricted where you cannot lawfully sell them (for example weapons, drugs, or other controlled items);",
            "counterfeit items or anything that infringes another person's intellectual-property, privacy, or other rights;",
            "malware, spyware, or other harmful code;",
            "content that is unlawful, hateful, defamatory, or that harasses or endangers others;",
            "**adult content**: sexually explicit or pornographic material is not permitted on the Service."
          ]
        },
        {
          "type": "h3",
          "text": "Prohibited conduct"
        },
        {
          "type": "ul",
          "items": [
            "fraud, deception, money laundering, sanctions breaches, or any unlawful financial activity;",
            "**circumventing or evading platform fees**, or arranging transactions off-platform to avoid them;",
            "scraping, crawling, harvesting, or bulk-extracting data from the Service except as expressly permitted;",
            "using the Service, the Widget, or any Content (including Sellers' Artifacts) to **train, develop, or improve any machine-learning or AI model**, or accessing the Service by automated means (bots, scrapers), except as we expressly permit;",
            "interfering with, probing, or attacking the Service or other users; and",
            "any use that violates applicable law or these Terms."
          ]
        },
        {
          "type": "p",
          "text": "We may investigate suspected breaches and take action, including removing Content and suspending or terminating accounts and the Widget licence."
        }
      ]
    },
    {
      "id": "intellectual-property",
      "heading": "11. Intellectual property",
      "blocks": [
        {
          "type": "h3",
          "text": "Our rights"
        },
        {
          "type": "p",
          "text": "Square Share and its licensors own all rights in the Service, including the platform, the Dashboard, the Widget, the underlying software, designs, and the **Square Share** name, logo, and other marks. Except for the limited licences expressly granted in these Terms, no rights are transferred to you."
        },
        {
          "type": "h3",
          "text": "Your content"
        },
        {
          "type": "p",
          "text": "As a Seller, you **retain ownership** of your Content and Artifacts. By submitting Content to the Service, you grant us a **worldwide, non-exclusive, royalty-free, sublicensable (to our hosting and sub-processor providers solely to operate the Service) licence** to host, store, reproduce, adapt (for formatting and display), display, and distribute that Content **solely** to operate, provide, and promote the Service, for example, to render your Bento Grid in the Widget on the external sites where you embed it, to serve it via our hosting and CDN providers, and, when launched, to feature your Artifacts in the Marketplace. You confirm you have all rights necessary to grant this licence. The licence continues for as long as the Content is hosted by us or retained in our backups, and terminates a reasonable period after the Content is deleted, except for residual backup copies that are overwritten in the ordinary course."
        },
        {
          "type": "h3",
          "text": "Feedback"
        },
        {
          "type": "p",
          "text": "If you send us feedback, ideas, or suggestions, you grant us a **perpetual, irrevocable, worldwide, royalty-free licence** to use them for any purpose without obligation or compensation to you."
        }
      ]
    },
    {
      "id": "third-party-services",
      "heading": "12. Third-party services",
      "blocks": [
        {
          "type": "p",
          "text": "The Service relies on, and links to, third-party services, in particular **Stripe** for payments and the **websites on which Sellers embed the Widget**."
        },
        {
          "type": "ul",
          "items": [
            "Your use of Stripe is governed by **Stripe's own terms and privacy policy**. We are not responsible for Stripe's services, availability, or decisions.",
            "We are not responsible for third-party embedding sites, their content, security, or compliance; the Seller controls and is responsible for those sites.",
            "Third-party services may change, become unavailable, or impose their own requirements, which can affect the Service."
          ]
        },
        {
          "type": "p",
          "text": "Our technical sub-processors (Supabase, Stripe, and Cloudflare) are described in our [Privacy Policy](/privacy)."
        }
      ]
    },
    {
      "id": "disclaimers",
      "heading": "13. Disclaimers of warranties",
      "blocks": [
        {
          "type": "p",
          "text": "To the fullest extent permitted by law, the Service, including any beta or pre-launch features, is provided **\"as is\"** and **\"as available\"**, without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, timely, secure, error-free, or that it will meet your requirements, and we do not guarantee any sales, results, or that any planned feature will launch. This \"as is\" / \"as available\" disclaimer applies only so far as legally permitted and primarily to business users."
        },
        {
          "type": "note",
          "text": "**Consumers.** Nothing in this section excludes or limits any warranty or right that cannot be excluded or limited under applicable law. In particular, the **statutory legal guarantees of conformity** for digital content, digital services, and goods under EU law (including Directives (EU) 2019/770 and (EU) 2019/771, as transposed nationally) remain **unaffected** for Consumers, and the remedies for non-conformity available under that law continue to apply. Where such mandatory rights apply, they prevail over this section."
        }
      ]
    },
    {
      "id": "limitation-of-liability",
      "heading": "14. Limitation of liability",
      "blocks": [
        {
          "type": "note",
          "text": "**We do not exclude or limit liability where it would be unlawful to do so.** This includes liability for death or personal injury caused by our negligence; for fraud or fraudulent misrepresentation; for **gross negligence and wilful misconduct**; for breach of essential/cardinal contractual obligations (where applicable); and any other liability that cannot lawfully be excluded or limited. **Consumers keep all mandatory rights under applicable law**, and nothing in these Terms affects those rights."
        },
        {
          "type": "h3",
          "text": "For Consumers"
        },
        {
          "type": "p",
          "text": "If you are a Consumer, our liability to you is governed **solely by applicable mandatory law**. We do not exclude liability for foreseeable loss resulting from our breach of these Terms or our failure to use reasonable care and skill, and the financial caps and broad consequential-loss exclusions in this section **do not apply to you**."
        },
        {
          "type": "h3",
          "text": "For business users (non-consumer Sellers and organisations)"
        },
        {
          "type": "p",
          "text": "Subject to the mandatory-liability savings above, and to the fullest extent permitted by law, where you use the Service in a business or professional capacity:"
        },
        {
          "type": "ul",
          "items": [
            "we are **not liable** for indirect, incidental, special, consequential, or punitive losses, or for loss of profits, revenue, goodwill, data, or business opportunity;",
            "we are **not liable** for the acts or omissions of Sellers, Buyers, Stripe, or other third parties, nor for any Artifact, sale, refund, chargeback, or dispute between a Buyer and a Seller; and",
            "our **total aggregate liability** arising out of or in connection with the Service and these Terms is limited to the greater of (a) the total **fees you paid to us in the 12 months** before the event giving rise to the liability, or (b) **EUR 100**."
          ]
        },
        {
          "type": "p",
          "text": "Each party is responsible for its own compliance with the law. This section reflects a reasonable allocation of risk and survives termination of these Terms."
        }
      ]
    },
    {
      "id": "indemnification",
      "heading": "15. Indemnification",
      "blocks": [
        {
          "type": "p",
          "text": "This section applies only to **Sellers acting in a business or professional capacity (non-consumers)**. It does **not** apply where the Seller is a Consumer. To the extent permitted by law, such Sellers agree to indemnify, defend, and hold harmless Square Share, its affiliates, and their respective officers, employees, and agents from and against any third-party claims, damages, losses, liabilities, and reasonable and directly incurred costs (including reasonable legal fees), **to the extent** caused by:"
        },
        {
          "type": "ul",
          "items": [
            "your Artifacts, Content, listings, and sales, including defects, infringement, or consumer-law or tax/VAT non-compliance, including any failure by you to honour a Buyer's right of withdrawal, statutory guarantee of conformity, refund obligations, or other mandatory consumer rights, all of which are owed by you as the Seller and merchant of record;",
            "the website(s) on which you embed the Widget;",
            "your breach of these Terms, the Acceptable Use Policy, or applicable law (including AML, sanctions, and KYC requirements); and",
            "your acts or omissions that cause Square Share to incur liability to a third party."
          ]
        },
        {
          "type": "p",
          "text": "As a condition of this indemnity, Square Share will: give you prompt written notice of any claim; take reasonable steps to mitigate; allow you to assume and control the defence of the claim with counsel of your choice; and not admit liability or settle any claim without your prior consent (not to be unreasonably withheld or delayed). This section does not apply to the extent a claim results from our own breach of these Terms or our negligence, and it does not affect any mandatory consumer rights."
        }
      ]
    },
    {
      "id": "suspension-termination",
      "heading": "16. Suspension and termination",
      "blocks": [
        {
          "type": "p",
          "text": "You may stop using the Service at any time and, when accounts launch, close your account through the Dashboard or by contacting us."
        },
        {
          "type": "p",
          "text": "We may **suspend or terminate** your access to all or part of the Service, remove Content, or revoke the Widget licence, where:"
        },
        {
          "type": "ul",
          "items": [
            "you breach these Terms or the Acceptable Use Policy;",
            "we reasonably suspect unlawful, fraudulent, or harmful activity;",
            "we are required to do so by law or by a third-party service such as Stripe; or",
            "we discontinue the Service or a feature."
          ]
        },
        {
          "type": "p",
          "text": "Where practicable and lawful, we will give reasonable notice and, for serious or urgent issues, may act immediately."
        },
        {
          "type": "p",
          "text": "**Effect of termination.** On termination, your right to use the Service ends, but provisions that by their nature should survive (including intellectual property, disclaimers, limitation of liability, and indemnification) will continue. Any sales already in progress will be settled through Stripe in the ordinary course, and the Seller remains responsible for fulfilling Buyer contracts already concluded. The Seller may export their inventory and Content for a reasonable period before deletion (see our [Privacy Policy](/privacy) for data deletion and retention). Terminating your relationship with Square Share does not affect contracts you have already entered into with Buyers or Sellers."
        }
      ]
    },
    {
      "id": "changes",
      "heading": "17. Changes to the Service and to these Terms",
      "blocks": [
        {
          "type": "p",
          "text": "We may change, add, suspend, or remove features of the Service, particularly as we move from pre-launch to full operation. We may also update these Terms from time to time, for example to reflect new features, legal requirements, or business changes."
        },
        {
          "type": "p",
          "text": "When we make changes to these Terms, we will update the **last updated** date and take reasonable steps to notify you, for example by email (including to waitlist subscribers) or by a notice on the Service."
        },
        {
          "type": "ul",
          "items": [
            "**Material changes** that are adverse to existing users take effect only after a **reasonable notice period (at least 14 to 30 days)** following notice. If you continue using the Service after they take effect, you accept the updated Terms; if you do not agree, you should stop using the Service.",
            "**Non-material or legally-required changes** may take effect when posted, unless a later date is stated.",
            "**Consumers.** Changes do not apply retroactively to contracts already concluded, and your mandatory consumer rights are unaffected."
          ]
        }
      ]
    },
    {
      "id": "governing-law",
      "heading": "18. Governing law, jurisdiction, and dispute resolution",
      "blocks": [
        {
          "type": "p",
          "text": "These Terms and any dispute arising out of or in connection with them are governed by the laws of **the Czech Republic**, and the **competent courts of the Czech Republic** have jurisdiction."
        },
        {
          "type": "h3",
          "text": "Informal resolution first"
        },
        {
          "type": "p",
          "text": "Before commencing proceedings, the parties will first attempt to resolve any dispute informally by contacting [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com) and allowing a period of **30 days** to reach a resolution. This does not prejudice either party's right to seek urgent injunctive relief, or any Consumer's mandatory rights."
        },
        {
          "type": "note",
          "text": "**Consumers.** If you use the Service as a Consumer, this choice of law and jurisdiction does **not** deprive you of the protection of mandatory provisions of the law of your country of residence, and you may also bring proceedings in the courts of that country where applicable law allows."
        },
        {
          "type": "h3",
          "text": "Out-of-court dispute resolution"
        },
        {
          "type": "p",
          "text": "The EU Online Dispute Resolution (ODR) platform was **discontinued by the European Commission with effect from 20 July 2025** and is no longer available. Consumers may instead seek out-of-court resolution through the competent alternative dispute resolution (ADR) / consumer arbitration body in their country of residence, in the Czech Republic, the general ADR body for consumer disputes is the **Czech Trade Inspection Authority** (*Česká obchodní inspekce*, **ČOI**), [https://www.coi.cz](https://www.coi.cz), and through any national consumer complaint channels. We are **not obliged** to participate in dispute-resolution proceedings before a consumer arbitration board. You can always contact us first at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)."
        }
      ]
    },
    {
      "id": "miscellaneous",
      "heading": "19. Miscellaneous",
      "blocks": [
        {
          "type": "ul",
          "items": [
            "**Entire agreement.** These Terms, together with the [Privacy Policy](/privacy) and [Cookie Policy](/cookies), are the entire agreement between you and us regarding the Service and supersede any prior agreements on that subject.",
            "**Severability.** If any provision is found invalid or unenforceable, the rest remains in full force, and the invalid provision will be applied as closely as possible to its original intent.",
            "**No waiver.** If we do not enforce a right or provision, that is not a waiver of it.",
            "**No partnership or agency.** Nothing in these Terms creates a partnership, agency, joint venture, or employment relationship between you and us.",
            "**No third-party rights.** These Terms do not give any person who is not a party any right to enforce them, except as expressly stated.",
            "**Assignment.** You may not assign or transfer these Terms without our prior written consent. We may assign these Terms to an affiliate or in connection with a merger, acquisition, reorganisation, or sale of assets, including on completion of our incorporation, without affecting your rights.",
            "**Force majeure.** We are not liable for any failure or delay caused by events beyond our reasonable control, including outages of third-party services such as Stripe, Supabase, or Cloudflare, internet failures, or acts of government. The affected party will use reasonable efforts to mitigate the effect, and either party may terminate the affected arrangement if the event continues for more than **30 days**.",
            "**Notices.** We may give notice by email or via the Service. You give notice to us in writing at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com). Notices sent by email are deemed received 24 hours after sending, unless a bounce or delivery-failure notification is received."
          ]
        }
      ]
    },
    {
      "id": "contact",
      "heading": "20. Contact",
      "blocks": [
        {
          "type": "p",
          "text": "Questions about these Terms, the Service, or your account can be sent to us at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com)."
        },
        {
          "type": "p",
          "text": "Operator: [Square Share, registered legal entity name and registered office in the Czech Republic, to be finalised upon incorporation], established in **the Czech Republic**."
        }
      ]
    }
  ]
};
