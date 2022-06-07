---
title: Github pages and the confusing process for enforcing HTTPS
date: 2022-06-01
author: Nicola Biancolini
description: |
  GitHub offers a rewarding user experience like few other services. However, the process of creating a custom domain with the Pages service can be tricky; here I share my experience in the hope that it may help someone.
keywords: 
  - github
  - github pages
  - https
  - tls
  - security
  - encription
  - cloudflare
  - dns
  - domain
tags:
draft: false
cover:
  image: cover.jpg
  alt: Confusing road directions
  relative: true
  caption: Photo by [Daniele Levis Pelusi](https://unsplash.com/@yogidan2012?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/confusion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

Many of you may know that for some time, now 13 years[^gh-pages-release-date], GitHub has offered a service called [Pages](https://pages.github.com/) that allows you to host static sites, which is very convenient for hosting blogs and documentation.

[^gh-pages-release-date]: I don't have that much memory but [Wikipedia](https://en.wikipedia.org/wiki/GitHub#GitHub_Pages) attributes the first release of the service to 2008.

That's why it's not news that this blog, like many others, is hosted right there. And the reason is not because it's "cool" but much more concrete and venal.  
One of the goals I set for myself was to not make it a living expense, so I chose the [HUGO](https://gohugo.io/) + GitHub Pages combo, a choice I would make again today! For once I can pat myself on the shoulder 🙂.

I later thought that in order to have a better SEO and more association between this blog and me, it would be good to have some custom domains.

## Enforcing HTTPS.

I got the domains from [()register.it](https://www.register.it/) and I chose to use the DNS service from [Cloudflare](https://www.cloudflare.com/dns/) so after I configured the DNS records to [support custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages#supported-custom-domains) by having the apex and `www` point to the `github.io` subdomain.

At this point although the *Pages* section of the repo settings reset the flag on the correctness of the DNS records set the message immediately below informed me that the domain was not properly configured

{{< figure src=./gh-pages-without-tls.png alt="Depiction of Pages section in GitHub settings reporting inability to enable HTTPS." >}}

Also the section [Custom domain names that are unsupported](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages#custom-domain-names-that-are-unsupported) confirmed the validity of the configuration and this caused me a big headache until I found this [post](https://github.community/t/the-enforce-https-button-isnt-working/10429/9) from which I quote verbatim.

> If you’re configuring an apex domain make sure there are no other `A`, `AAAA`, or `ALIAS` records listed on the apex.
>
> If you’re configuring a subdomain, `www` or otherwise, make sure there are no other `A`, `AAAA`, or `CNAME` records on that same subdomain.

Somewhat discouraged, I removed the `www` record and despite the documentation and the appearance of this warning

{{< figure src="https://user-images.githubusercontent.com/523825/114216669-d53baa00-992c-11eb-96c0-c0f9da7330fe.png" alt="Warning reporting misconfiguration of DNS records." >}}

(sorry but I forgot to capture the screen 🙏 so I retrieved it from an [issue](https://github.com/isaacs/github/issues/1675) where I found out that other people had the same headache as me)

{{< figure src=./gh-pages-with-tls.png alt="Depiction of the Pages section in the GitHub settings showing the correct configuration of DNS records and HTTPS enabled." >}}
