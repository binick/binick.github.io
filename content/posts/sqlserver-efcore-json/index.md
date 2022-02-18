---
title: SQL Server, EF Core, JSON
date: 2020-10-22
author: Nicola Biancolini
description: Sometimes we are forced to work with JSON, it will have happened to you too! In this post, I want to show you how to work with that using EF Core.
keywords:
  - efcore
  - sql server
tags:
  - tip
aliases:
  - /posts/2020-10-22_sqlserver-efcore-json
cover:
  image: cover.jpg
  alt: Post cover
  relative: true
  caption: Photo by [Hsiao Aristides](https://unsplash.com/@hsiaoaristides?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/elephant?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

Sometimes we have been forced to work with JSON stored on table columns, it will have happened to you too!

In this post, I want to show you how to work with that using **EntityFramework Core**

{{< github dotnet efcore >}}

Clearly this is one of many possible ways.

We could talk for a long time about the choice to store JSON into RDBMS is a good or bad choice, but the intent of this post isn't making a rant.

Ok, well. First of all, take a look to JSON that we want to persist into a table column

{{< gist binick 7c40dc3dcb74dae0485ebc95bbc4b015 "metadata.json" >}}

Our application has a requirement that makes it necessary to query the database with the name of the retailer that has stored in the JSON.

The retailer is the one who has the car we want to rent.
The car is represented by the class

{{< gist binick 7c40dc3dcb74dae0485ebc95bbc4b015 "Car.cs" >}}

The Car entity has a property `public string NameOfRetailer { get; }` that is computed by the [Computed columns](https://docs.microsoft.com/ef/core/modeling/generated-properties?tabs=data-annotations#computed-columns) functionality.

{{< gist binick 7c40dc3dcb74dae0485ebc95bbc4b015 "Car.NameOfRetailer.cs" >}}

With this instruction **efcore** will inflate property with value returned by `JSON_VALUE(Metadata, '$.Retailer.Name')` expression, for more information about `JSON_VALUE` see at [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-ver15)

To make it work, we need to persist the JSON into table column `Metadata`.

We can use the other useful [Value conversions](https://docs.microsoft.com/ef/core/modeling/value-conversions) functionality of **efcore**.

{{< gist binick 7c40dc3dcb74dae0485ebc95bbc4b015 "Car.Metadata.cs" >}} 

{{< gist binick 7c40dc3dcb74dae0485ebc95bbc4b015 "JsonValueConverter.cs" >}}

Now, after that model configurations we are able to resolve this simple query `var car = await context.Cars.MaterializeAsync(car => car.NameOfRetailer == "Car Auto Orvieto").ConfigureAwait(false);` without materialize the entire dataset on the client. 🚀

If you want to learn more you can find the sample on my github repo [ef-core-json](https://github.com/binick/samples/blob/6b9a4676c4f7f243c73abd59fb6aec592fd9f543/src/ef-core-json)

Happy coding! 🐱‍👤
