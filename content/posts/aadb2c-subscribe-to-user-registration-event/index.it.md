---
title: Sviluppare soluzioni integrate con Active Directory B2C ed Azure Event Grid.
date: 2022-01-08
author: Nicola Biancolini
description: Vediamo come è possibile integrare la registrazione di un utente.
series: 
  - Identity Experience Framework
keywords:
  - identity experience framework 
  - active directory b2c
  - custom policy
  - azure
  - event grid
tags: 
  - azure
  - active directory b2c
  - event grid
aliases:
  - /it/posts/2022-01-10_aadb2c-subscribe-to-user-registration-event
cover:
  image: cover.jpg
  alt: Foto di copertina
  caption: Foto di [Elena Mozhvilo](https://unsplash.com/@miracleday?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) su [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

In un articolo precedente abbiamo visto <a href="https://www.ugidotnet.org/tip/2873/Arricchire-JWT-emessi-da-Active-Directory-B2C-con-criteri-personalizzati" title="Arricchire token JWT emessi da Azure Active Directory B2C." target="_blank">Arricchire token JWT emessi da Azure Active Directory B2C</a>.

In quell'articolo abbiamo parlato di come sia possibile aggiungere ad un JWT informazioni esterne a _Microsoft Graph_ mediante l'uso di una _Logic App_ ed un _Blob Storage_.

In questo invece vedremo come sia possibile creare una soluzioni che integri _Azure Active Directory B2C_.

Seguendo la traccia di quanto trattato nel precedente articolo vedremo come salvare su _Blob Storage_ dati fittizi alla registrazione di un utente.

{{< collapse summary="Note" >}}
Nel resto dell'articolo ci sono riferimenti a risorse e concetti trattati nel <a href="https://www.ugidotnet.org/tip/2873/Arricchire-JWT-emessi-da-Active-Directory-B2C-con-criteri-personalizzati" title="Arricchire token JWT emessi da Azure Active Directory B2C." target="_blank">precedente articolo</a> al quale si rimanda.
{{< /collapse >}}

## Panoramica della soluzione.

La soluzione è cosi composta:

{{< figure class="background-light" align=center src="component-map.svg" caption="Composizione della soluzione" >}}

- `read-customer-details-identity-la`: rappresenta l'api il cui scopo è reperire il contenuto del _blob_ da `customersstgacc` (lo _storage account_)
- `customer-register-tpc`: è il _topic_ nel quale sono collezionati gli eventi di creazione di un nuovo utente
- `customer-identity-details-filler-la`: rappresenta l'api al quale spetta l'onere di generare dati fittizi che poi saranno salvati all'interno di un _blob_ sullo `customersstgacc`
{{< figure align=center src="logic-app-steps.png" alt="Definizione della logic app" >}}
- `contoso-b2c`: è il servizio di gestione degli accessi e delle identità offerto da _Azure_

## Introduzione ad _Azure Event Grid_.

In _Azure_ esiste un'implementazione del pattern [publish/subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) concepita per agevolare l'integrazione e la gestione delle risorse mediante un paradigma di sviluppo ad eventi.

Mediante _Event Grid_ sarà quindi possibile sottoscriversi a [sorgenti di messaggi built-in](https://docs.microsoft.com/azure/event-grid/overview#event-sources) attraverso una [serie di gestori](https://docs.microsoft.com/azure/event-grid/overview#event-handlers).

Qual'ora questo non fosse sufficiente è comunque possibile creare dei _topic_ personalizzati ai quali sarà possibile sottoscriversi per riceverne gli eventi.

## Creazione di un _topic_ personalizzato.

Per la creazione di un _topic_ è possibile fare riferimento a [questa guida](https://docs.microsoft.com/azure/event-grid/custom-event-quickstart-portal#create-a-custom-topic).

Una scelta da fare al momento della creazione del _topic_ riguarda lo schema del contenuto della richiesta _HTTP_ utilizzato. Gli schemi supportati al momento sono:

- [`Event Grid Schema`](https://docs.microsoft.com/azure/event-grid/event-schema)
- [`Cloud Event Schema`](https://docs.microsoft.com/azure/event-grid/cloud-event-schema)
- `Custom Input Schema`, questo schema richiederà la creazione di un'[associazione](https://docs.microsoft.com/azure/event-grid/input-mappings) fra le proprietà dell'oggetto in ingresso e quelle richieste dallo `Event Grid Schema`.

Il messaggio usato in questo caso ha la seguente struttura

``` json
[
    {
        "data": {
            "objectId": "25100647-****-4571-****-b03e4ce72d02" // l'identificativo utile ad identificare l'utente
        },
        "id": "25100647-****-4571-****-b03e4ce72d02", // l'identificativo univoco del messaggio, lo stesso di `data.objectId` in qesto caso
        "eventType": "Microsoft.ActiveDirectory", 
        "subject": "*.onmicrosoft.com",
        "dataVersion": "1.0",
        "metadataVersion": "1",
        "eventTime": "2021-12-03T21:04:03.8504745Z",
        "topic": "/subscriptions/{your-subscription-id}/resourceGroups/{your-resource-group}/providers/Microsoft.EventGrid/topics/{your-event-grid-topic}"
    }
]
```

## Emissione dell'evento di registrazione.

L'invio degli eventi verso il _topic_ avviene utilizzando un [`RESTful technical profile`](https://docs.microsoft.com/azure/active-directory-b2c/restful-technical-profile).

``` xml
<TechnicalProfile Id="AAD-UserEmitRegistrationEvent">
    <DisplayName>Emit user registration event to Event Grid.</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <Metadata>
        <Item Key="ServiceUrl">{Settings:CustomerRegisteredTopicUrl}</Item>
        <Item Key="AuthenticationType">ApiKeyHeader</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="ClaimUsedForRequestPayload">userRegisterEvent</Item>
        <Item Key="DefaultUserMessageIfRequestFailed">Cannot process your request right now, please try again later.</Item>
    </Metadata>
    <CryptographicKeys>
        <Key Id="aeg-sas-key" StorageReferenceId="B2C_1A_CustomerRegisteredTopicSas" />
    </CryptographicKeys>
    <InputClaimsTransformations>
        <InputClaimsTransformation ReferenceId="GetSystemDateTime" />
        <InputClaimsTransformation ReferenceId="GenerateRegistrationEventRequest" />
    </InputClaimsTransformations>
    <InputClaims>
        <InputClaim ClaimTypeReferenceId="userRegisterEvent" />
    </InputClaims>
    <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="systemDateTime" />
    </PersistedClaims>
    <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
</TechnicalProfile>
```

Questo frammento di markup tradotto in comando `curl`, per maggiore esplicabilità, risulterebbe cosi:

``` bash
curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
```

dove i requisiti di autenticazione vengono soddisfatti dal metadato `AuthenticationType` al quale viene associata la chiave crittografica `aeg-sas-key` il cui valore viene recuperato dalla chiave `B2C_1A_CustomerRegisteredTopicSas` presente nella collezione delle [chiavi dei criteri](https://docs.microsoft.com/azure/active-directory-b2c/policy-keys-overview?pivots=b2c-custom-policy).

{{< collapse summary="TL;DR" >}}  
La scelta dello _schema_ del _topic_ in questo esempio è stata guidata dalle limitazioni al momento imposte dal [_profilo tecnico RESTful_](https://docs.microsoft.com/azure/active-directory-b2c/restful-technical-profile) riguardo alle possibilità di costruzione della richiesta _HTTP_, infatti per una combinazione di criteri non risulta possibile passare informazioni nelle intestazioni e nel corpo della richiesta allo stesso tempo.  
Ciò rende impossibile inviare verso un _topic_ schemi di tipo `Cloud Event` in quanto il protocollo, nella versione _1.0_ richiede la presenza di un'[intestazione obbligatoria](https://docs.microsoft.com/azure/event-grid/cloud-event-schema#sample-event-using-cloudevents-schema).
{{< /collapse >}}

Ben più complessa è la creazione del corpo della richiesta per la quale risultano necessario:

- utilizzare le [`InputClaimsTransformation`](https://docs.microsoft.com/azure/active-directory-b2c/technicalprofiles#input-claims-transformations)
- aggiungere due attestazioni all'interno del bagaglio `userRegisterEvent` e `systemDateTime` entrambe di tipo _stringa_.

Infine il _profilo tecnico_ è stato aggiunto fra i _profili tecnici di validazione_ di [`LocalAccountSignUpWithLogonEmail`](https://github.com/binick/samples/blob/7782bd6bfcfcb8c2b18dc911d501b29ec05f8212/src/enrich-a-jwt-token-with-ief/ief/TrustFrameworkBase.xml#L764) in modo tale che l'evento venga emesso solamente in fase di registrazione di un'utente.

### Utilizzo delle trasformazioni delle attestazioni.

Durante la creazione di _criteri personalizzati_ potremmo avere la necessità di eseguire calcoli, come ad esempio il numero di tentativi di autenticazione, che seppur molto semplici risulterebbero impossibili senza l'esecuzioni di funzioni.

Questo requisito trova espressività tramite le `ClaimsTransformation` il cui [riferimento delle trasformazioni delle attestazioni](https://docs.microsoft.com/azure/active-directory-b2c/claimstransformations#claims-transformations-reference) contiene la lista completa delle _trasformazioni_ utilizabili.

Nell'esempio sono stati utilizzati i metodi [`GetCurrentDateTime`](https://docs.microsoft.com/azure/active-directory-b2c/date-transformations#getcurrentdatetime) e [`GenerateJson`](https://docs.microsoft.com/azure/active-directory-b2c/json-transformations#generatejson)

``` xml
<ClaimsTransformation Id="GetSystemDateTime" TransformationMethod="GetCurrentDateTime">
    <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="systemDateTime" TransformationClaimType="currentDateTime" />
    </OutputClaims>
</ClaimsTransformation>
```

`GetSystemDateTime` ha lo scopo di valorizzare l'attestazione `systemDateTime`

``` xml
<ClaimsTransformation Id="GenerateRegistrationEventRequest" TransformationMethod="GenerateJson">
    <InputClaims>
        <InputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="0.data.objectId" />
        <InputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="0.id" />
        <InputClaim ClaimTypeReferenceId="systemDateTime" TransformationClaimType="0.eventTime" />
    </InputClaims>
    <InputParameters>
        <InputParameter Id="0.dataVersion" DataType="string" Value="1.0" />
        <InputParameter Id="0.eventType" DataType="string" Value="Microsoft.ActiveDirectory" />
        <InputParameter Id="0.subject" DataType="string" Value="{Settings:Tenant}" />
    </InputParameters>
    <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="userRegisterEvent" TransformationClaimType="outputClaim" />
    </OutputClaims>
</ClaimsTransformation>
```

`GenerateRegistrationEventRequest` ha invece l'onere di costruire il JSON e valorizzare l'attestazione `userRegisterEvent`.

## Conclusioni.

In questo articolo abbiamo visto come mediante _Identity Experience Framework_ sia possibile integrare un tenant B2C con la nostra infrastruttura ed aprire eventuali scenari di sviluppo interessanti.  
Per farlo abbiamo toccato _Azure Event Grid_ e come creare un _Event Grid Topic_.

Infine come sia possibile [manipolare delle attestazioni](https://docs.microsoft.com/azure/active-directory-b2c/claimstransformations#claims-transformations-reference) ed utilizzarle all'interno dei [_profili tecnici_](https://docs.microsoft.com/azure/active-directory-b2c/technicalprofiles).

Se foste interessati all’esempio completo lo potrete trovare al seguente indirizzo [https://github.com/binick/samples/tree/master/src/enrich-a-jwt-token-with-ief](https://github.com/binick/samples/tree/master/src/enrich-a-jwt-token-with-ief).
