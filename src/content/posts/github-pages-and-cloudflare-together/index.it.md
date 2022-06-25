---
title: GitHub Pages ed il confusionario processo per applicare HTTPS
date: 2022-06-01
author: Nicola Biancolini
description: |
  GitHub offre un’esperienza utente appagante come pochi altri servizi. Nonostante questo, però, il processo di configurazione di un dominio personalizzato con il servizio Pages può risultare ostico, qui vi racconto la mia esperienza nella speranza che possa aiutare qualcuno.
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
  alt: Indicazioni stradali confusionarie
  relative: true
  caption: Foto di [Daniele Levis Pelusi](https://unsplash.com/@yogidan2012?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) su [Unsplash](https://unsplash.com/s/photos/confusion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

Molti di voi sapranno che ormai da un po’ di tempo, 13 anni[^gh-pages-release-date] ormai, GitHub offre un servizio chiamato [Pages](/refs/gh-pages) che consente di ospitare siti statici, molto comodo per ospitare blog e documentazione.

[^gh-pages-release-date]: Non ho cosi tanta memoria ma [Wikipedia](https://en.wikipedia.org/wiki/GitHub#GitHub_Pages) attribuisce la prima release del servizio al 2008.

Per questo non è una novità che questo blog, come molti altri, sia ospitato proprio li. Ed il motivo non è perché' "fa figo" ma molto più concreto e venale.  
Uno degli obbiettivi che mi ero prefissato era quello di non farlo diventare una spesa viva, per questo scelsi l'accoppiata [HUGO](/refs/hugo) + GitHub Pages, una scelta che oggi rifarei! Per una volta mi posso dare una pacca sulla spalla 🙂.

In seguito, ho pensato che per avere una SEO migliore ed una maggiore associazione fra questo blog e me sarebbe stata buona cosa avere qualche dominio personalizzato.

## Applicare HTTPS.

I domini li ho presi su [()register.it](https://www.register.it/) ed ho scelto di usare il servizio DNS di [Cloudflare](https://www.cloudflare.com/dns/) per cui dopo aver provveduto a configurare i record DNS in modo da [supportare i domini personalizzati](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages#supported-custom-domains) facendo puntare l'apex e `www` al sottodominio `github.io`.

A questo punto nonostante la sezione *Pages* delle impostazioni del repo riportasse il flag sulla correttezza dei record DNS impostati il messaggio subito sotto mi informava che il dominio non era correttamente configurato

{{< figure src=./gh-pages-without-tls.png alt="Raffigurazione della sezione Pages nelle impostazione di GitHub che riporta l’impossibilità di abilitare HTTPS." >}}

Anche la sezione [Custom domain names that are unsupported](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages#custom-domain-names-that-are-unsupported) confermata la validità della configurazione e questa cosa mi ha causato un gran mal di testa fino a quando non ho trovato questo [post](https://github.community/t/the-enforce-https-button-isnt-working/10429/9) dal quale cito testualmente.

> If you’re configuring an apex domain make sure there are no other `A`, `AAAA`, or `ALIAS` records listed on the apex.
>
> If you’re configuring a subdomain, `www` or otherwise, make sure there are no other `A`, `AAAA`, or `CNAME` records on that same subdomain.

Un po' nello sconforto ho rimosso il record `www` ed a dispetto di quanto riportato dalla documentazione e della comparsa di questo warning

{{< figure src="https://user-images.githubusercontent.com/523825/114216669-d53baa00-992c-11eb-96c0-c0f9da7330fe.png" alt="Warning che riporta la cattiva configurazione dei record DNS." >}}

(scusate ma mi sono dimenticato di catturare lo schermo 🙏 per cui l'ho recuperato da una [issue](https://github.com/isaacs/github/issues/1675) dove ho scoperto che altre persone hanno avuto il mio stesso mal di testa)

GitHub ha avviato il processo di creazione del certificato su [Let's Encrypt](https://letsencrypt.org/), successivamente ho riconfigurato i record DNS come in precedenza e finalmente.

{{< figure src=./gh-pages-with-tls.png alt="Raffigurazione della sezione Pages nelle impostazione di GitHub che riporta la corretta configurazione dei record DNS e HTTPS abilitato." >}}
