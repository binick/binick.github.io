---
title: Come utilizzare uno script SQL con le migrazioni di Entity Framework?
date: 2022-07-02
author: Nicola Biancolini
description: |
  Spesso utilizziamo le migrazioni di Entity Framework come mero tool di sviluppo per aggiornare il nostro database. Nella realtà è uno strumento molto potente che può addirittura mettere in comunicazioni due silos aziendali.
keywords: 
  - entity framework
  - database versioning
  - migration
  - dbre
tags:
  - devops
aliases:
  - /it/2022/07/02/how-to-use-raw-sql-script-with-ef-migrations/
draft: false
cover:
  image: cover.jpg
  alt: Dispositivi di archiviazione su scaffale con etichetta con scritto "Storage Engineer"
  relative: true
  caption: "[Foto di Brett Sayles](https://www.pexels.com/photo/set-of-modern-cables-and-connectors-on-shelf-4330788/)"
---

Uno delle cose più complesse da gestire nello sviluppo di qualsiasi applicazione, dalle semplici applicazioni client alle più complesse soluzioni enterprise, riguarda la gestione della persistenza.

In ambiente .NET parte di questa complessità può essere gestita attraverso l’utilizzo delle [migrazioni](https://learn.microsoft.com/ef/core/managing-schemas/migrations/) implementate internamente in Entity Framework.

Spesso questa funzionalità è vista come una utilità prettamente ad uso e consumo degli sviluppatori per aggiornare lo schema del database.

> Quando pensiamo di essere arrivati ad una situazione stabile eliminiamo tutte le migrazioni e partiamo da una situazione pulita.

Questa è una frase che ho sentito davvero troppo spesso da molti colleghi, utilizzata in modo più o meno consapevole, spesso i motivi che portano ad una esternalizzazione in tal senso è una non sufficiente analisi del problema che genera molti cambiamenti, anche distruttivi, delle base dati.

Altre volte più consapevole e guidata dalla volontà di non mantenere versioni precedenti a quella che supponiamo conterrà dati "reali", spesso questo coincide con il primo rilascio in produzione.

In realtà quello che il tool ci offre è un sistema di versionamento incrementale cosa che va ben oltre l'ambito di competenza dello sviluppatore coinvolgendo anche *DBA* o più propriamente *DBRE*, consiglio l'ascolto dell'episodio [*Da DBA a DBRE, il nuovo approccio DevOps nel mondo database, con Alessandro Alpi*](https://www.spreaker.com/user/dotnetpodcast/alpi-dba-to-dbre) di [*dotNET{podcast}*](http://www.dotnetpodcast.com/) se volete approfondire le sottili differenze fra i due ruoli.

## Come posso effettuare operazioni sui dati?

Questa cosa è una di quelle operazioni che non è possibile istruire in una migrazione attraverso le API che *Entity Framework* ci mette a disposizione in quanto è molto dipendente dal dominio e cercare di formalizzare ciò attraverso delle API sarebbe stato molto complesso se non impossibile ed è per questi casi che è stata prevista la scappatoia per l'esecuzione di script SQL grezzi.

``` cs
public partial class InitialWithSeed : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"CREATE TABLE Persons (
    Id int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);

INSERT INTO Persons (Id, LastName, FirstName, Address, City)
VALUES 
    (1, 'Nesfield', 'Carmelia', '802 Knutson Drive', 'Krajan Dua Putukrejo'),
    (2, 'Valentino', 'Daune', '1464 Forest Dale Road', 'Prozor'),
    (3, 'Chrstine', 'Gus', '817 Bonner Park', 'Lukunor'),
    (4, 'Tebb', 'Stearne', '63138 Colorado Plaza', 'Sanjiang'),
    (5, 'Dyne', 'Gibby', '39613 Pond Road', 'Thành Phố Hạ Long'),
    (6, 'MacShane', 'Sandra', '02617 Continental Parkway', 'Cihambali'),
    (7, 'Lissandri', 'Sidney', '61 Talmadge Circle', 'Langarūd'),
    (8, 'O'' Quirk', 'Marc', '828 Ohio Avenue', 'Farafangana'),
    (9, 'Mabee', 'Man', '79 Crownhardt Street', 'Kembang'),
    (10, 'Izak', 'Bertie', '7 High Crossing Junction', 'Taodian');");
    }
}
```

L'esempio appena fatto potrebbe far storcere il naso ad entrambe le categorie.  
Agli sviluppatori perché sono presenti stringhe all'interno del sorgente e al *DBRE* perché si troverebbe a lavorare "scomodo" senza completamento automatico.

## Come far felici i due mondi?

Una caratteristica del tool è quella di generare delle classi parziali che vengono abbinate a classi contente in file denominati `{MigrationId}.Design.cs`

``` cs
[DbContext(typeof(DesignContext))]
[Migration("20220624071324_InitialWithSeed")]
partial class InitialWithSeed
{
    ...
}
```

che contengono l'altra parte della classe parziale decorata con un attributo che ne identifica il contesto al quale è legata ed uno che ne rappresenta l'identificativo.

Possiamo quindi pensare di estrarre lo script SQL all'interno di un file con estensione `.sql` e sfruttare l'identificativo della migrazione a runtime per leggerlo ed integrarlo all'interno della migrazione.

La nostra migrazione avrà quindi questo contenuto

``` cs
public partial class InitialWithSeed : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        var migrationAttribute = (MigrationAttribute)this.GetType()
            .GetCustomAttributes(typeof(MigrationAttribute), false)
            .Single();

        migrationBuilder.Sql(File.ReadAllText(string.Format(
            CultureInfo.InvariantCulture,
            "{1}{0}RawMigrations{0}{2}",
            Path.DirectorySeparatorChar,
            AppContext.BaseDirectory,
            $"{migrationAttribute.Id}.sql")));
    }
}
```

e lo script SQL potrà quindi essere letto dal percorso relativo alla directory di esecuzione `/RawMigrations/20220624071324_InitialWithSeed.sql`

Ricordiamoci inoltre di aggiungere l'istruzione

``` xml
<ItemGroup>
  <None Include="RawMigrations\*.sql" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

all'interno del `.csproj` per istruire *MSBuild* a pubblicare i file nella cartella di destinazione.

Come sempre potete consultare il progetto dell'intero esempio su

{{< github account="binick" repo="samples" repoUrl="https://github.com/binick/samples/tree/master/src/raw-ef-migrations" >}}
