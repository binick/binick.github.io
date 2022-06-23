---
title: Report di code coverage integrati in MsBullet SDK 🥳
date: 2022-06-18
author: Nicola Biancolini
description: |
  Lavoriamo per risolvere problemi di business ma di tanto in tanto incappiamo in problemi tecnici, utilizzare la conoscienza altrui nella loro risoluzione puo' essere un'arma vincente se compatibile con i nostri requisiti
summary: |
  Lavoriamo per risolvere problemi di business ma di tanto in tanto incappiamo in problemi tecnici, utilizzare la conoscienza altrui nella loro risoluzione puo' essere un'arma vincente se compatibile con i nostri requisiti
keywords: 
project: msbullet
tags: 
  - devops
draft: true
cover:
  image: cover.jpg
  alt: Prato con albero di mele con in primo piano una cesta in legno dalla quale esce una coperta
  relative: true
  caption: Foto di <a href="https://unsplash.com/@lianamikah?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Liana Mikah</a> su <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
---

Da poco meno di un paio d'anni porto avanti lo sviluppo di un SDK per *MSBuild* chiamato [**MsBullet**]({{< ref path="/projects/msbullet" lang="it" >}}) il cui scopo e' quello di agevolare l'adozione di convenzioni tra team, lo sviluppo di un software qualitativamente migliore attraverso una serie di strumenti built-in e fornire una integrazione con i principali sistemi di build.

Piu o meno nello stesso periodo nel quale *MsBullet* e' stato reso open, ho pubblicato un articolo dove spiegavo [come integrare la copertura del nostro codice]({{< relref path="../../azure-devops-code-coverage/" lang="en" >}}) all'interno dei risultati delle pipeline di *Azure DevOps* illustando quali fossero le insidie a cui prestare attenzione e come aggirarle.

Bene e' il post piu' visualizzato del blog

| Pagina | Visualizzazioni % |
| --- | :-: |
| [How to include code coverage in Azure DevOps pipeline?]({{< relref path="../../azure-devops-code-coverage/" lang="en" >}}) | 41 % |
| [SQL Server, EF Core, JSON]({{< relref path="../../sqlserver-efcore-json/" lang="en" >}}) | 24 % |
| [Home page]({{< relref path="../../../" lang="en" >}}) | 20 % |

queste sono le percentuali delle visualizzazioni su un campione degli ultimi trenta giorni ma questo e' un trend che va avanti da oltre un anno.  
Per capirci le visualizzazioni sono il doppio di quelle della home page 👀!

Tutto questo per? Per dirvi che finalmente mi sono deciso ad integrare quei frammenti di codice all'interno dell'SDK 🥳!

## Quale e' il vantaggio di utilizzare un SDK per MsBuild?

Lo stesso per cui utilizzi librerie o framework di terze parti.  
Lavoriamo per risolvere problemi di business inciampando di tanto in tanto in problemi tecnici. Se qualcuno ha gia' incontrato e risolto questi problemi perche' non trarne vantaggio?

> DevOps è l'unione di persone, processi e tecnologia per fornire continuamente valore ai clienti.
>
> -- <cite>[Microsoft Docs](https://docs.microsoft.com/devops/what-is-devops)</cite>

## Quindi? Come lo utilizzo?

Adesso l'unica co
