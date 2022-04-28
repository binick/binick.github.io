
--\-
title: GitHub Copilot contro Roslyn SDK
date: 2022-04-20
author: Nicola Biancolini
description: 
keywords:
- ia
- strumenti
- conoscenza
- intelligenza artificiale
- tools
- github
- copilot
- sviluppo
- roslyn
- intellisense
tags:
- artificial intelligence
- tools
draft: true
cover:
  image: cover.jpg
  alt: Foto di copertina
  relative: true
  caption: |
    ["Iron Man vs. WALL-E (110/365)"](https://www.flickr.com/photos/83346641@N00/4539257241) by [JD Hancock](https://www.flickr.com/photos/83346641@N00) is marked with [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/?ref=openverse).
---

Il 29 marzo [*GitHub*](https://github.com) ha presentato l'estensione di [*Copilot* per *Visual Studio 2022*](https://github.blog/2022-03-29-github-copilot-now-available-for-visual-studio-2022).

{{< collapse summary="Cos’è [*GitHub Copilot*]( https://copilot.github.com)?" >}}
*GitHub Copilot* è uno strumento che assiste gli sviluppatori attraverso proposizioni di frammenti di codice sulla base della volontà dello sviluppatore espresse mediante commenti.
{{</ collapse >}}

Se ne è fatto un gran parlare, in rete si trovano molti articoli a riguardo che spaziano dal campo pratico a quello etico passando per quello legale.
Rappresenta l’ultima frontiera raggiunta in campo tecnologico riguardo l’assistenza alla scrittura di codice.

Personalmente non lo ho ancora provato e devo ammettere che questa volta le mie aspettative nei confronti di questo strumento non sono così elevate come lo è stato nel passato nei confronti di altri.

## Riavvolgiamo il nastro.

Nel 2014, data solamente simbolica in quanto è il primo riferimento temporale attendibile che sono riuscito a trovare, *Microsoft* introduce una di quelle che ritengo le pietre miliari che posizionano oggi *.NET* fra le piattaforme [più usate a livello mondiale](https://www.statista.com/statistics/793628/worldwide-developer-survey-most-used-languages), ovvero il [*.NET Compiler Platform SDK*](https://devblogs.microsoft.com/dotnet/enabling-the-net-compiler-platform-roslyn-in-asp-net-applications).

{{< collapse summary="Cos’è [*Roslyn*](https://docs.microsoft.com/dotnet/csharp/roslyn-sdk)?" >}}
*.NET Compiler Platform SDK* comunemente conosciuto come *Roslyn* è uno strumento per fare introspezione dell’[*Intermediate Language*](https://docs.microsoft.com/dotnet/standard/managed-code).
{{</ collapse >}}

*Roslyn* non è direttamente uno strumento di assistenza allo sviluppo, bensì pone solide basi per la costruzione di strumenti a questo scopo.


## Differenti a

Per uno sviluppatore *.NET* che utilizza un’IDE od un editor testuale che supporta [*OmniSharp*](https://www.omnisharp.net) funzionalità come quelle di IntelliSense, refactoring ed il supporto agli [analizzatori statici](https://docs.microsoft.com/visualstudio/code-quality/roslyn-analyzers-overview) sono strumenti disponibili da anni.

Io ho iniziato a sviluppare che queste funzionalità erano già state introdotte e rodate anni prima, sono un nativo *Roslyn*!  
Il suo arrivo ha inoltre di fatto sancite obsolete nomenclature come `cPet` per le classi, `tPers` per le tabelle e `vUserPets` per le viste. Piuttosto che l’utilizzo di previssi per identificare variabili private e/o statiche.



Circa un mese fa, parlando con un collega a fine giornata lui ha detto una frase che suonava più o meno cosi "Siamo sviluppatori, scrivere codice cercando di rispettare il pattern è il nostro lavoro".
Questa frase è stata detta in quanto stavamo implementando una funzionalità all'interno di un'applicazione web realizzata con l'intramontabile architettura a tre strati e puntualmente due controller condividevano lo stesso servizio solo per risparmiare una dozzina di linee di codice, ciò ha comportato per altro una dilatazione dei tempi di lavorazione.

In seguito, più o meno due settimane fà, stavolta un altro collega ha detto una frase simile a "Non possiamo impedire ad un sviluppatore di sbagliare". 
Il mio cervello ha messo subito in collegamente quelle due celle di memoria e le ha ricondotte al concetto.
