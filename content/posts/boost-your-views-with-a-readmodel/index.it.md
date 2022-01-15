---
title: Aumenta le prestazioni delle tue visualizzazioni con un modello di lettura.
date: 2022-01-20
author: Nicola Biancolini
description: TODO
series: 
  - Cloud adoption
  - Case study
keywords:
  - read model
tags: 
  - azure
  - cloud adoption
draft: true

---

L'Amministratore Delegato dell'azienda [Postal Bird](../../case-study/postalbird) ha espresso il bisogno di reingegnerizzare il portale web in quanto alcuni clienti lamentano della lentezza nell'utilizzo di alcune sue parti.

## Panoramica della soluzione.

{{< figure src=starting-point.svg  caption="Architettura di partenza" >}}

- _Server_: rappresenta il server fisico sul quale attualmente è ospitato l'applicativo tramite [IIS](https://www.iis.net/)
- _Web portal store_: il database _SQL Server_ a servizio dell'applicazione
- _Main store_: il database centrare gestito dell'ecosistema aziendale |  questo database _SQL Server_ è collegato a _Web portal store_
- _Ecosystem workloads_: identifica l'insieme di tutti i processi aziendali rappresentati come una scatola nera

Inspezionando la relazione fra le due persistenze si può identificare la presenza di numerose viste presenti in _Web portal store_ che insistono su di un'unica tabella presente in _Main store_.

| CustomerCode | Lot | Sublot | Recepient | Address | ... |
| --- | --- | --- | --- | --- | --- |
| RI927 | 994889 | 826196 | Gib Hixson | 8 Kipling Plaza | ... |
| PA263 | 081484 | 785412 | Eamon Giorio | 0 Paget Road | ... |
| QD733 | 527876 | 847958 | Phelia Conaghy | 41 Green Drive | ... |
| OI708 | 068381 | 730886 | Jerrilee Prall | 7 Westport Center | ... |
| PA263 | 192934 | 669009 | Oberon Switsur | 12 4th Street | ... |

Si può notare come fra le varie viste presenti su _Web portal store_ ci siano essenzialmente due difference, il codice cliente presente nella clausola `where` ed i campi nella clausola `select`, ad esempio `SELECT Lot, Recepient, EmailTo FROM Workings WHERE CustomerCore = 'PA263'` oppure `SELECT Lot, Sublot, Recepient, Address, PostalCode, City, CountryCode FROM Workings WHERE CustomerCore = 'OI708'`.

## Obbiettivo della migrazione.

Il management ed il team di ingeneri concordano sul fatto che l'attuale situazione infrastruttura non soddisfa più i requisiti aziendali. Il Cloud rappresenta per loro un'opportunità di efficientamento dell'infrastruttura in termini di costi |  affidabilità e sicureza di cui beneficeranno anche i loro clienti.

Nella realizzazione della nuova soluzione sono stati espressi il vincoli stringente per la preservazione dell'ecosistema.

## Fase esplorativa.

Al fine di trovare la miglior soluzione che rispetti i perimetri di azione imposti sono state valutare le sequenti soluzioni:

| Strada | Compatibilità con i vincoli | Praticabilità | Note |
| --- | :-: | --- | --- |
| Traformare le attuali viste in viste indicizzate | ⬆️ | Impossibile in quanto non è possibile impostare legami con le tabele sottostanti |  |
| Utilizzo di viste materializzate | ⬆️ | Le viste non presentano aggregazioni per cui questa soluzione risulta non realizzabile |  |