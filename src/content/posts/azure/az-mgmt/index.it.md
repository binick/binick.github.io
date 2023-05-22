---
title: Utilizzare i modelli ARM con Azure SDK per .NET
date: 2022-05-09
author: Nicola Biancolini
description: Vediamo come è possibile provisionare risorce Azure utilizzando Azure SDK per .NET
keywords: 
- azure sdk
- azure
- deploy
- arm
- arm template
- bicep
tags:
- arm
- azure sdk
- deployment
draft: false
cover:
  image: cover.jpg
  alt: Cassette postali
  relative: true
  caption: Foto di <a href="https://unsplash.com/@mathyaskurmann?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mathyas Kurmann</a> su <a href="https://unsplash.com/photos/fb7yNPbT0l8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
---

Recentemente il team [_Azure SDK_](https://devblogs.microsoft.com/azure-sdk/azure-sdk-release-april-2022/) ha rilasciato la prima versione stabile delle librerie per la gestione delle risorse.  
Raccolte sotto lo spazio dei nomi `Azure.ResourceManager` queste librerie andranno a sostituire tutte quelle attualmente presenti nello spazio dei nomi `Microsoft.Azure.Management` e a differenza delle precedenti saranno suddivide per servizio.

## Differenze con _Bicep_ e _ARM templates_.

Se hai avuto modo di approvvigionare risorse _Azure_ mediante uno di questi due pseudo-linguaggi hai sfruttato gli endpoint REST della risorsa [_deployments_](https://docs.microsoft.com/rest/api/resources/deployments) per la creazione dell'infrastruttura richiesta mediante il passaggio di un [_template_](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) in formato _JSON_ strutturato e validato da un _JSON Schema_.

Le ragioni per cui prendere in considerazione l'utilizzo dei template sono innumerevoli, oltre l'integrazione con [_Visual Studio Code_](https://docs.microsoft.com/azure/azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code) e [_Visual Studio_](https://docs.microsoft.com/azure/azure-resource-manager/templates/create-visual-studio-deployment-project) è possibile distribuire le risorse ottenendo risultati ripetibili, mantenere uno storico delle distribuzioni e valutare la conformità agli standard aziendali attraverso i [criteri di _Azure_](https://docs.microsoft.com/azure/governance/policy/overview).

[`Azure.ResourceManager.Resources`](https://www.nuget.org/packages/Azure.ResourceManager.Resources/) non implementa “nativamente” questo concetto ma comunque ne consente l'utilizzo in quanto attraverso la classe [`ArmDeploymentCollection`](https://docs.microsoft.com/dotnet/api/azure.resourcemanager.resources.armdeploymentcollection) abbiamo modo operare sugli stessi endpoint REST utilizzati da _Bicep_ e _ARM templates_.

## Creare una nuova distribuzione.

Per ottenere una nuova distribuzione dobbiamo dotarci di un [`ArmClient`](https://docs.microsoft.com/%20dotnet/api/azure.resourcemanager.armclient) passandogli un _auth token_ con [`TokenCredential`](https://docs.microsoft.com/dotnet/api/azure.core.tokencredential).

``` c#
using Azure.Identity; using Azure.ResourceManager;  
  
ArmClient client = new ArmClient(new DefaultAzureCredential());
```

Che ci consentirà di accedere alla sottoscrizione predefinita, in base alle credenziali fornite, con `await client.GetDefaultSubscriptionAsync()` oppure all'ambito desiderato creando un identificativo della risorsa di interesse con [`ResourceIdentifier`](https://docs.microsoft.com/dotnet/api/azure.core.resourceidentifier) e passandolo ad uno dei metodi `client.GetSubscriptionResource(id)` o `client.GetManagementGroupResource(id)` o ancora `client.GetResourceGroupResource(id)`.

Ad esempio:

``` c#
var id = ManagementGroupResource.CreateResourceIdentifier("MY_MNGM_GROUP");  
var managementGroup = client.GetManagementGroupResource(id);  
  
ArmDeploymentCollection deploymentCollection = managementGroup.GetArmDeployments();
```

Non ci resta che creare un'istanza di [`ArmDeploymentContent`](https://docs.microsoft.com/dotnet/api/azure.resourcemanager.resources.models.armdeploymentcontent) al quale possiamo passare il link ad un _template_ esistente

``` c#
var deployment = new ArmDeploymentContent(new ArmDeploymentProperties(ArmDeploymentMode.Incremental)
{
  TemplateLink = new ArmDeploymentTemplateLink  
  {  
    Uri = new Uri("https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/emptyrg.json")  
  },  
});
```
oppure utilizzare la proprietà `Template` per definire uno nostro.  
In questo caso sarà necessario costruire un oggetto di tipo [`BinaryData`](https://docs.microsoft.com/dotnet/api/system.binarydata) che rappresenti un _JSON_ valido, ad esempio serializzando un dizionario.

``` c#
var emptyDeployment = new Dictionary<string, object>();  
emptyDeployment.Add("$schema", "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#");  
emptyDeployment.Add("contentVersion", "1.0.0.0");  
emptyDeployment.Add("resources", Array.Empty<object>());  
  
var deployment = new ArmDeploymentContent(new ArmDeploymentProperties(ArmDeploymentMode.Incremental)  
{  
  Template = BinaryData.FromObjectAsJson(emptyDeployment)  
});
```

E successivamente effettuare la chiamata al metodo `CreateOrUpdate` per ottenere lo scopo.

``` c#
deploymentCollection.CreateOrUpdate(
  deploymentName: Guid.NewGuid().ToString(),
  content: deployment,  
  waitUntil: WaitUntil.Started);
```

## Riferimenti utili.

* [introduzione alla nuova esperienza di sviluppo](https://devblogs.microsoft.com/azure-sdk/introducing-the-new-azure-sdk-resource-management-libraries-for-net/): comparativa fra le vecchie librerie e le nuove
* [principi progettuali alla base dell'SDK](https://azure.github.io/azure-sdk/dotnet_introduction.html) utili in caso doveste aprire segnalazioni di problemi incontrati nell'utilizzo
* lista comprensiva delle librerie attualmente in sviluppo: [https://azure.github.io/azure-sdk/releases/latest/index.html?search=Azure.ResourceManager](https://azure.github.io/azure-sdk/releases/latest/index.html?search=Azure.ResourceManager).
