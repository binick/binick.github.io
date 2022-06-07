---
title: Micro frontends e Blazor Server, l'inizio del viaggio
date: 2022-05-22
author: Nicola Biancolini
description: |
  Non sempre le ciambelle riescono col buco ma questo non vuol dire che non ci sia del buono in loro. Sono incappato in una di queste nel tentativo di realizzare un'architettura a micro frontends con Blazor Server.
summary: |
  Non sempre le ciambelle riescono col buco ma questo non vuol dire che non ci sia del buono in loro. Sono incappato in una di queste nel tentativo di realizzare un'architettura a micro frontends con Blazor Server.
keywords: 
 - blazor server
 - micro frontends
 - server side rendering
 - architecture
 - blazor
tags:
 - blazor
 - architecture
cover:
  image: cover.jpg
  alt: Pasticcere non propriamente soddisfatto delle ciambelle appena preparate
  relative: true
  caption: Photo by [Bernie Almanzar](https://unsplash.com/@bhurnal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

<style>
  body.dark .post-content img[src$="art-assemblies-graph.drawio.svg"] {
    filter: invert(90%);
  }
</style>

Recentemente mi è stato chiesto di realizzare uno **spike**[^spike] per valutare la fattibilità nella realizzazione di un'architettura **micro frontends** con **Blazor Server**.

[^spike]: Uno spike è un metodo di sviluppo del prodotto originato dalla programmazione estrema che utilizza il programma più semplice possibile per esplorare potenziali soluzioni. Fonte [Wikipedia](https://en.wikipedia.org/wiki/Spike_(software_development)).

Ti dico subito che è stato un **fallimento**; ma andiamo con ordine, analizzando dapprima la declinazione del termine *fallimento* e le ragioni che mi hanno portato ad usarlo per poi cercare di ricapitolare quanto emerso da questa esplorazione che mi ha fatto giungere a questa conclusione.

<!-- Dal titolo  -->
<!-- Rif. to https://www.clozemaster.com/blog/italian-sayings/ 4. -->
<!-- avrai già capito che è stato un **fallimento**; ma andiamo con ordine, analizzando dapprima la declinazione del termine *fallimento* ed le ragioni per poi cercare di ricapitolare quanto emerso da questa esplorazione che mi ha fatto giungere a questa conclusione. -->

Mi piace molto la definizione che da [Treccani](https://www.treccani.it/vocabolario).

> Riconoscere l'inutilità dei propri sforzi, l'impossibilità e incapacità di raggiungere gli scopi fissati, rinunciando definitivamente alla lotta, all'azione.
>
> -- <cite>[Treccani](https://www.treccani.it/vocabolario/fallimento)</cite>

Lo trovo particolarmente appropriato perché utilizza il termine *scopi fissati*, e quindi quali sono questi scopi?

## Il contesto conta.

Nulla si fa per caso, e questa non è certo un'eccezione. Il lavoro svolto è parte di un contesto più ampio che riguarda la necessità di migrare una serie di applicativi *ASP.NET MVC 5* ad *ASP.NET Core* combinata alla volontà di rendere l'attuale architettura più flessibile introducendo il concetto di **programmazione modulare**[^modular-programming].

[^modular-programming]: La programmazione modulare è una tecnica di progettazione software che enfatizza la separazione della funzionalità di un programma in moduli indipendenti e intercambiabili, in modo tale che ognuno contenga tutto il necessario per eseguire solo un aspetto della funzionalità desiderata. Fonte [Wikipedia](https://en.wikipedia.org/wiki/Modular_programming).

Senza girarci troppo intorno, lo scopo finale era quello di misurare la fattibilità di "realizzare" un'architettura a *micro frontends* renderizzati lato server grazie a *Blazor Server*.

A tal proposito sul blog di [Martin Fowler](https://martinfowler.com/) è presente un articolo bell'articolo di [Cam Jackson](https://camjackson.net/) nel quale viene fatta una [panoramica su questa architettura](https://martinfowler.com/articles/micro-frontends.html) e dal quale ho tradotto la loro definizione di *micro frontends*

> Uno stile architettonico in cui le applicazioni frontend, consegnabili in modo indipendente, sono composte in un insieme più grande.
>
> -- <cite>[Thoughtworks su martinfowler.com](https://martinfowler.com/articles/micro-frontends.html)</cite>

Ho messo realizzare fra virgolette in quanto la pubblicazione dei vari siti sarebbe avvenuta sempre e soltanto in modo unitario.  
Magari affronteremmo questo problema in un prossimo post.

## Non tutte le ciambelle riescono col buco.

Andando dritti al punto, la motivazione principe che ha decretato il fallimento è legata all'impossibilità di dare [completa autonomia ai team](https://martinfowler.com/articles/micro-frontends.html#AutonomousTeams), per due principali motivi ben precisi.

### Omonimia nel supporto alle pagine ed alle viste *Razor*.

Per comporre il sito ogni *frontend* viene contenuto all'interno di una libreria di classi **Razor** la quale contiene anche la vista che si occupa di fare [hosting](https://docs.microsoft.com/aspnet/core/blazor/fundamentals/routing#aspnet-core-endpoint-routing-integration) dell'applicazione *Blazor*.

Questo è reso possibile grazie alla funzionalità esposta dal *SDK* che consente ad una *web app* di utilizzare viste, pagine *Razor* o layout da librerie di classi e, come definito nella [documentazione ufficiale](https://docs.microsoft.com/aspnet/core/razor-pages/ui-class#override-views-partial-views-and-pages-2), in caso di omonimia la precedenza viene data alla vista, pagina, layout presente nella *web app*.

Nel mio caso mi trovo in una situazione del genere

{{< figure src="./art-assemblies-graph.drawio.svg" caption="Figura 1: una applicazione ASP.NET Core che referenzia due *Razor Class Library* che rappresentano due moduli." >}}

dove entrambi i moduli internamente fanno uso di layout contenuti al percorso `/Pages/Shared/_Layout.cshtml`.

Ecco, in questo caso accadrebbe che uno dei due team sarebbe scontento in quanto, se andasse bene vedrebbe la sua applicazione renderizzata all'interno di un altro layout, nel peggiore dei casi una parte o tutte le viste andrebbero in errore (es. una vista cerca di valorizzare una [sezione](https://docs.microsoft.com/aspnet/core/mvc/views/razor#section) non dichiarata nel layout).  
E notiamo bene che entrambi i moduli eseguiti indipendentemente si comporterebbero come atteso.

### Le rotte, il percorso di base che non vuole funzionare.

Ho che almeno io non sono riuscito a far funzionare.

Anche in questo caso, seguendo il principio dell'autonomia, il desiderata era quello di separare le rotte del modulo da quelle del contenitore, per esempio all'interno del *Modulo A* avremmo trovato `/` oppure `/index` mentre dal punto di vista del contenitore le rotte sarebbero state `/module-a/` o `/module-a/index`.

Quello che ho trovato è stata una "coperta corta", quando funzionava la navigazione interna al modulo non funzionava la generazione di rotte utilizzando [*Anchor Tag Helper*](https://docs.microsoft.com/aspnet/core/mvc/views/tag-helpers/built-in/anchor-tag-helper) (ricordo che questo *spike* è frutto di un [processo di migrazione](#il-contesto-conta)), in quanto per la realizzazione del requisito ho utilizzato il middleware [`UsePathBaseMiddleware`](https://github.com/dotnet/aspnetcore/blob/main/src/Http/Http.Abstractions/src/Extensions/UsePathBaseMiddleware.cs).

Questo ha comportato che nella generazione dei link all'interno del modulo verso l'esterno venisse aggiunto sempre il `/module-a` in testa all'indirizzo anche quanto il collegamento avrebbe dovuto semplicemente puntare la contenitore.

Diversamente utilizzando il middleware sarei stato costretto ad utilizzare il nome del modulo in testa a tutte le direttive [`@page`](https://docs.microsoft.com/aspnet/core/mvc/views/razor#page).

## Conclusioni.

Tirando le somme di quanto fatto e ragionando a mente fredda potrei dire che qualcosa di buono ce lo possiamo comunque portare a casa, infatti, non abilitando il supporto alle pagine e viste *Razor* in una *RCL*[^razor-class-library] ed evitando l'utilizzo di *Anchor Tag Helper* nel markup HTML che contribuisce al rendering della vista non incorreremmo in questi problemi.

[^razor-class-library]: Le [librerie di classi Razor (RCL)](https://docs.microsoft.com/aspnet/core/razor-pages/ui-class) sono state introdotte in ASP.NET Core 2.1 come metodo per impacchettare e distribuire componenti dell'interfaccia utente da referenziare e utilizzare all'interno di un'applicazione host.
