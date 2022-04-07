---
title: Un nuovo side project
date: 2022-03-29
author: Nicola Biancolini
description: Di solito quando una grande azienda si avvicina al cloud uno dei principali motivi di preoccupazione è la gestione dei costi.
keywords: 
- cloud governance
- azure
- security
- cloud adoption
- policy
- initiative
tags:
- cloud governance
- azure
- security 
- cloud adoption
draft: false
cover:
  image: cover.jpg
  alt: Foto di copertina
  relative: true
  caption: Foto di [Tom Fisk](https://www.pexels.com/photo/bird-s-eye-view-of-river-in-middle-of-green-fields-1483880/)
---

Qualche anno fa, quando ero un pendolare andavo a lavoro in auto, lungo il tragitto c’era un tratto di strada di campagna alberato che costeggiava un torrente. All’interno di questa zona era presente una chicane molto stretta in uscita immediatamente successiva ad una lieve discesa che seguiva un lungo rettifilo.
Data la presenza del torrente e l’ombra permanente causata degli alberi non era cosa rara che in alcune mattinate d'inverno vi fosse la presenza di ghiaccio.

Non ho mai avuto incidenti lì in quanto ero a conoscenza del potenziale pericolo e nonostante il rettifilo portasse a spingere sull’acceleratore mi trattenevo.

Cosa voglio dirvi con questo aneddoto?  
Che prevenire è meglio che curare?  
Non proprio, il messaggio è più sottile e riguarda l’*istinto* e la *coscienza*.

Cosa succederebbe se qualcuno passasse di lì per caso in una di quelle mattine?  
E magari anche in ritardo per il suo appuntamento?  
Con molta probabilità sarebbe costretto a chiamare il carroattrezzi in quanto non consapevole della presenza di ghiaccio avrebbe pestato a fondo il pedale del freno per ridurre la velocità ad affrontare la curva. Con conseguente perdita di aderenza e ad auto in fossa.

Quali sarebbero le potenziali conseguente?  
Supponiamo che dopo questa sfortunata “avventura" l’autista esca incolume dall’auto, quali sarebbero le altre conseguenze?  
Direi due, un portafogli alleggerito ed un appuntamento mancato.

## Un tipico approccio all’OpEx.

Immagino vi starete domandando quale sia il fine ed il perché di questa parabola.  
Dovete sapere che qualche tempo fa ho partecipato ad alcune riunioni inerenti alla migrazione di un applicativo aziendale ad uso interno in *Azure* nelle quali sono emerse molte problematiche dovute ai permessi assegnati agli utenti.  
Problemi che hanno causato lo slittamento del rilascio in produzione di un applicativo aziendale ad uso interno di oltre due settimane.

Proviamo, con non propriamente poco sforzo, a trasporre la parabola dello sfortunato autista all’interno di questo contesto; possiamo identificare la strada come il *cloud*, la persona alla guida dell’auto come l’azienda. E direi di fermarci qui per il momento.

Tipicamente quando un’azienda si avvicina al cloud uno dei principali motivi di preoccupazione è la gestione dei costi[^capex-vs-opex].

[^capex-vs-opex]: [CapEx vs OpEx in Cloud Computing](https://www.geeksforgeeks.org/capex-vs-opex-in-cloud-computing")

Immaginiamo di essere un membro del team di security operation, abituato ad operare su di un set di macchine predeterminato che adesso si ritrova con un potenziale parco macchine infinito ed un monito da parte del suo manager di area che gli dice di dover contenere le spese. 

L’unica cosa che conosce di più simile a ciò che ha usato finora è il controllo dell’accesso basato sui ruoli di [Active Directory](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models#role-based-access-controls-rbac-for-active-directory) che trova il suo corrispettivo [Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview) configurabile anche da [Azure Active Directory]( https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis).

Voi cosa fareste? Io credo che limiterei gli accessi a tutti gli utenti dando solo i permessi minimi necessari ai membri del team di sviluppo, ma penso che anche voi agireste così.

E questo è quello che il team ha fatto, per questo ha predisposto due gruppi di risorse, uno per ospitare tutte le risorse legate a tematiche di networking ed uno per il team di sviluppo dando loro il ruolo di [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) per quest’ultimo.

Scivolando in un uso improprio dei gruppi di risorse in modo improprio in quanto alcune risorse come per esempio il [servizio Azure Kubernetes]( https://docs.microsoft.com/azure/aks/intro-kubernetes) si appoggia ad un terzo gruppo di risorse per ospitare i nodi dei pool di agenti condiviso fra noi ed il servizio stesso.

## Educare piuttosto che imporre.

Il team di *SecOps* ha fallito in quanto non a conoscenza del significato del termine *Cloud Governance* e gli strumenti che *Azure* offre a supporto.

{{< figure src="cloud-governance.svg" alt="Rappresentazione del sottoinsieme della gestione del cloud formato dall'insieme della sicurezza e della gestione dei costi" >}}

Ovviamente il team ha agito in buona fede cercando di limitare l’*ambito*[^scope] di azione di ogni team.  
Pensando di raggiungere due obbiettivi: *controllo dei costi*[^cost-management] e *sicurezza*[^security]. 

[^scope]: [Comprendere l'ambito per il controllo degli accessi in base al ruolo di Azure](https://docs.microsoft.com/azure/role-based-access-control/scope-overview)
[^cost-management]: [Che cos'è Gestione dei costi e fatturazione?]( https://docs.microsoft.com/azure/cost-management-billing/cost-management-billing-overview)
[^security]: [Introduzione alla sicurezza di Azure](https://docs.microsoft.com/azure/security/fundamentals/overview)

Ecco che adesso abbiamo gli elementi necessari per riprendere la trasposizione iniziata precedentemente e identificare 
l’*ambito*[^scope] nel giaccio, la data di rilascio nell’appuntamento e [le cinque discipline della governance del cloud]( https://docs.microsoft.com/azure/cloud-adoption-framework/govern/governance-disciplines#disciplines-of-cloud-governance) nella consapevolezza.

Ecco che per cercare di aumentare questa consapevolezza ho creato questo repository

{{< github binick oh-my-azure-playground >}}

il cui intento è quello di definire degli standard basandosi sulle migliori pratiche emerse in tematiche come denominazione delle risorse, gestione dei tag e della localizzazione.  
Sulle quali sarà poi possibile definire dei pattern per la definizione di budget[^cost-management].

Nel corso degli anni ho iniziato diversi side project ma mai nessuno ha avuto un post come questo.  
Lo considero come un primo passo verso un impegno concreto, se volete approfondire o sentite la necessità di contribuire non esitate a [contattarmi]({{< ref "about-me" >}}) 🙂.
