import type { LegalContent } from "@/components/legal/LegalDocument";

export const accessibilityContent: LegalContent = {
  "title": "Accessibility Statement",
  "subtitle": "Our commitment to making Square Share usable by everyone, including people with disabilities, and the standards and laws we work to.",
  "lastUpdated": "1 July 2026",
  "disclaimer": "These documents are provided for general information only. They are a starting template generated for Square Share and should be reviewed by a qualified lawyer before launch and before processing any payments.",
  "intro": [
    {
      "type": "p",
      "text": "**Square Share** (\"**we**\", \"**us**\", \"**our**\") wants everyone to be able to use our website and, when it launches, our full platform, regardless of ability, device, or assistive technology. This statement explains the accessibility standards we follow, how the current site measures up, the areas we are still improving, and how to reach us if you hit a barrier."
    },
    {
      "type": "note",
      "text": "**Current state, please read this first.** The live site at **squareshare.to** is currently a **pre-launch landing page**. The only interactive feature is the waitlist email form. The Seller Dashboard, the embeddable Widget, Stripe payments, and the Discovery Feed marketplace are **planned but not yet live**. This statement describes the accessibility of what is available today and the commitments we carry into the full launch."
    },
    {
      "type": "p",
      "text": "This statement works alongside our [Privacy Policy](/privacy), [Terms of Service](/terms), and [Cookie Policy](/cookies)."
    }
  ],
  "sections": [
    {
      "id": "commitment",
      "heading": "1. Our commitment",
      "blocks": [
        {
          "type": "p",
          "text": "We treat accessibility as part of building the product, not an afterthought. Our goal is for the website and the future platform to be **perceivable, operable, understandable, and robust** for people who are blind or have low vision, who are deaf or hard of hearing, who have motor or cognitive disabilities, or who rely on assistive technologies such as screen readers, screen magnifiers, voice control, or keyboard-only navigation."
        },
        {
          "type": "p",
          "text": "Accessibility is an ongoing effort. As we add the Dashboard, the Widget, and checkout, we will keep testing against the standards below and update this statement."
        }
      ]
    },
    {
      "id": "standards",
      "heading": "2. Standards we work to",
      "blocks": [
        {
          "type": "p",
          "text": "We aim to meet the **Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA**, the internationally recognised benchmark for digital accessibility published by the W3C. Where practical, we also adopt improvements from **WCAG 2.2**."
        },
        {
          "type": "p",
          "text": "For the European market, the relevant technical standard is **EN 301 549** (the harmonised European standard for ICT accessibility), whose current version incorporates WCAG 2.1 Level AA. A future version of EN 301 549 is expected to be published in the EU Official Journal; when it becomes the reference standard for the European Accessibility Act, we will align with it."
        },
        {
          "type": "table",
          "tableHeaders": [
            "Standard",
            "What it covers"
          ],
          "tableRows": [
            [
              "**WCAG 2.1 / 2.2 Level AA** (W3C)",
              "The technical success criteria for accessible web content that we design and test against."
            ],
            [
              "**EN 301 549** (EU)",
              "The harmonised European accessibility standard for ICT, which references WCAG and underpins EU accessibility law."
            ]
          ]
        }
      ]
    },
    {
      "id": "legal-framework",
      "heading": "3. Legal framework",
      "blocks": [
        {
          "type": "p",
          "text": "Because Square Share is being built in the **Czech Republic** and intends to serve customers across the EU, the UK, and the US, we take the following accessibility laws into account:"
        },
        {
          "type": "h3",
          "text": "European Union"
        },
        {
          "type": "p",
          "text": "The **European Accessibility Act (EAA)**, Directive (EU) 2019/882, sets common accessibility requirements for certain products and services, including **e-commerce services**. Its requirements have applied since **28 June 2025**. In the Czech Republic the EAA is transposed by **Act No. 424/2023 Coll.** (the Act on accessibility requirements for certain products and services), which entered into force on the same date and requires covered service providers to keep their services accessible."
        },
        {
          "type": "note",
          "text": "**Micro-enterprise position.** Under the EAA and Act No. 424/2023 Coll., a service provider that is a **micro-enterprise** (broadly, fewer than **10** staff and annual turnover or balance-sheet total not exceeding **EUR 2 million**) can be exempt from the accessibility obligations that apply to services. As a small pre-launch operation, Square Share may currently fall within that exemption. **Even where an exemption may apply, we choose to work to WCAG 2.1 AA voluntarily**, and we will re-assess our obligations as the company incorporates and grows."
        },
        {
          "type": "h3",
          "text": "United Kingdom"
        },
        {
          "type": "p",
          "text": "In the UK, the **Equality Act 2010** requires service providers to make reasonable adjustments so that disabled people are not put at a substantial disadvantage. WCAG 2.1 AA is the commonly accepted way to demonstrate reasonable adjustments online."
        },
        {
          "type": "h3",
          "text": "United States"
        },
        {
          "type": "p",
          "text": "In the US, **Title III of the Americans with Disabilities Act (ADA)** is widely applied to commercial websites, and **Section 508** of the Rehabilitation Act sets accessibility requirements for federal contexts. US courts and regulators commonly reference **WCAG 2.1 AA** as the practical measure of an accessible website, which is the standard we target."
        }
      ]
    },
    {
      "id": "measures",
      "heading": "4. What we have done so far",
      "blocks": [
        {
          "type": "p",
          "text": "Accessibility features already built into the current site include:"
        },
        {
          "type": "ul",
          "items": [
            "**Semantic HTML and landmarks**, using real headings, lists, navigation, and main-content regions so assistive technologies can understand the page structure.",
            "**Keyboard operability**, interactive controls (links, the menu toggle, and the waitlist form) can be reached and operated with a keyboard, with visible focus styles.",
            "**Reduced-motion support**, we honour the operating-system **prefers-reduced-motion** setting, so the animated hero, background effects, and transitions fall back to static or minimal motion for people who are sensitive to movement.",
            "**Text alternatives and labels**, meaningful images carry alternative text, icon-only buttons and social links have accessible names, and decorative visuals (background canvases and effects) are hidden from assistive technologies so they do not add noise.",
            "**A readable, animated headline with a text fallback**, the stylised hero word keeps the real text in the accessibility tree, so screen readers always announce the full heading.",
            "**Colour and contrast**, we use a high-contrast palette (white and light-grey text on black) and treat our single accent colour carefully to keep text legible.",
            "**Status feedback**, the waitlist form communicates success and error states as text (not colour alone) and announces confirmation to assistive technologies.",
            "**Self-hosted fonts loaded with a swap fallback**, so text stays visible while fonts load and no third-party font requests are needed."
          ]
        }
      ]
    },
    {
      "id": "conformance",
      "heading": "5. Current conformance status",
      "blocks": [
        {
          "type": "p",
          "text": "We consider the current landing page to be **partially conformant** with WCAG 2.1 Level AA. \"Partially conformant\" means most of the content meets the standard, but we have not yet completed a full independent audit, and some parts may not yet fully conform (see **Known limitations**)."
        },
        {
          "type": "note",
          "text": "We have not yet obtained a third-party accessibility certification or a formal audit report. We assess the site ourselves against WCAG 2.1 AA and fix issues as we find them. When the platform launches, we intend to commission a fuller review."
        }
      ]
    },
    {
      "id": "known-limitations",
      "heading": "6. Known limitations",
      "blocks": [
        {
          "type": "p",
          "text": "We are honest about where we are still improving. Current known limitations include:"
        },
        {
          "type": "ul",
          "items": [
            "**Decorative motion and WebGL effects.** The site uses animated background effects for visual atmosphere. These are marked as decorative and hidden from assistive technologies, and they respect reduced-motion preferences, but they are not themselves informative content.",
            "**No completed independent audit.** Our conformance claim is based on internal review rather than a formal third-party audit, which we plan to arrange as the product matures.",
            "**Planned features not yet assessed.** The Seller Dashboard, the embeddable Widget, and Stripe checkout are not live, so their accessibility has not yet been evaluated. We will assess and document them before they launch.",
            "**Third-party and embedded content.** When the Widget is live and embedded on a Seller's own website, the accessibility of the surrounding page is controlled by that Seller. Payment pages are provided by **Stripe** and are subject to Stripe's own accessibility practices."
          ]
        }
      ]
    },
    {
      "id": "compatibility",
      "heading": "7. Compatibility and requirements",
      "blocks": [
        {
          "type": "p",
          "text": "The site is designed to work with current versions of major browsers (Chrome, Firefox, Safari, and Edge) on desktop and mobile, together with the assistive technologies commonly used with them, such as built-in screen readers (VoiceOver, TalkBack), popular desktop screen readers, screen magnification, and browser zoom."
        },
        {
          "type": "p",
          "text": "The site should remain usable at **200% zoom** and adapts to different screen sizes. If you use a very old browser or an unusual configuration, some features may not work as intended."
        }
      ]
    },
    {
      "id": "feedback",
      "heading": "8. Feedback and how to report a problem",
      "blocks": [
        {
          "type": "p",
          "text": "If you encounter an accessibility barrier on Square Share, or need information from this site in a different format, please tell us. Accessibility feedback is a priority and helps us fix issues quickly."
        },
        {
          "type": "p",
          "text": "**Contact:** email us at [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com). Please include the page or feature, a description of the problem, and the browser and assistive technology you were using, so we can reproduce and address it."
        },
        {
          "type": "p",
          "text": "We aim to acknowledge accessibility reports **within 5 working days** and to give you a realistic timeframe for a fix or a suitable alternative. If you need the content of this page or any information on the site provided in an accessible alternative format, we will work with you to provide it."
        }
      ]
    },
    {
      "id": "enforcement",
      "heading": "9. Enforcement and complaints",
      "blocks": [
        {
          "type": "p",
          "text": "We would always like the chance to resolve an accessibility issue with you directly first. If you are not satisfied with our response, you may be able to escalate to the relevant authority for your country."
        },
        {
          "type": "ul",
          "items": [
            "**Czech Republic / EU:** market-surveillance and enforcement of the accessibility rules under Act No. 424/2023 Coll. (transposing the EAA) are handled by the competent Czech authorities; the general consumer-protection body is the **Czech Trade Inspection Authority** (*Česká obchodní inspekce*, **ČOI**), [https://www.coi.cz](https://www.coi.cz).",
            "**United Kingdom:** you can contact the **Equality Advisory and Support Service (EASS)** for advice on rights under the Equality Act 2010.",
            "**United States:** complaints about disability access can be raised with the **US Department of Justice** under the ADA."
          ]
        }
      ]
    },
    {
      "id": "changes-and-contact",
      "heading": "10. Changes to this statement",
      "blocks": [
        {
          "type": "p",
          "text": "We will review and update this statement as the site changes, as we launch new features, and as the applicable standards and laws evolve. The date below records the latest update."
        },
        {
          "type": "note",
          "text": "**Last updated: 1 July 2026.** Questions or accessibility feedback? Email [squareshare.to@gmail.com](mailto:squareshare.to@gmail.com). See also our [Privacy Policy](/privacy), [Terms of Service](/terms), and [Cookie Policy](/cookies)."
        }
      ]
    }
  ]
};
