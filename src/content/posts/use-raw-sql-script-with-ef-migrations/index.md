---
title: How to use a raw SQL script with Entity Framework migrations?
date: 2022-07-03
author: Nicola Biancolini
description: |
  We often use Entity Framework migrations as a mere development tool to update our database. In reality it is a very powerful tool that can even bring two company silos into communication.
keywords: 
  - entity framework
  - database versioning
  - migration
  - dbre
tags:
  - devops
aliases:
  - /2022/07/03/how-to-use-raw-sql-script-with-ef-migrations/
draft: false
cover:
  image: cover.jpg
  alt: Shelf storage devices labeled "Storage Engineer"
  relative: true
  caption: "[Photo by Brett Sayles](https://www.pexels.com/photo/set-of-modern-cables-and-connectors-on-shelf-4330788/)"
---

One of the most complex things to manage in the development of any application, from simple client applications to the most complex enterprise solutions, concerns the management of persistence.

In the .NET environment some of this complexity can be managed through the use of [migrations](https://docs.microsoft.com/ef/core/managing-schemas/) implemented internally in Entity Framework.

Often this feature is seen as a utility purely for the use of developers to update the database schema.

> When we think we have arrived at a stable situation we drop all migration and start from a clean situation.

This is a phrase that I have heard really too often from many colleagues, used more or less consciously, often the reasons that lead to outsourcing in this sense is an insufficient analysis of the problem that generates many changes, even destructive changes, of the databases.

Other times more conscious and driven by a desire not to keep versions earlier than the one we assume will hold "real" data, often this coincides with the first production release.

Actually, what the tool offers us is an incremental versioning system something that goes far beyond the scope of the developer by also involving *DBA* or more properly *DBRE*.

## How can I perform operations on the data?

This thing is one of those operations that is not possible to instruct in a migration through the APIs that *Entity Framework* makes available to us as it is very domain dependent and trying to formalize this through APIs would have been very complex if not impossible and it is for these cases that the loophole for running raw SQL scripts was provided.

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

The example just given might turn the nose up at both categories.  
To the developers because there are strings within the source and to the *DBRE* because they would find themselves working "inconveniently" without auto-completion.

## How to make both worlds happy?

One feature of the tool is to generate partial classes that are matched with content classes in files named `{MigrationId}.Design.cs`

``` cs
[DbContext(typeof(DesignContext))]
[Migration("20220624071324_InitialWithSeed")]
partial class InitialWithSeed
{
    ...
}
```

which hold the other part of the partial class decorated with an attribute identifying the context to which it is bound and one representing its identifier.

We can then think of extracting the SQL script within a file with the `.sql` extension and exploit the runtime migration identifier to read it and integrate it within the migration.

Our migration will then have this content

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

and the SQL script can then be read from the path relative to the execution directory `/RawMigrations/20220624071324_InitialWithSeed.sql`

Let us also remember to add the instruction

``` xml
<ItemGroup>
  <None Include="RawMigrations\*.sql" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

within the `.csproj` to instruct *MSBuild* to publish the files to the target folder.
