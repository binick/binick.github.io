---
title: Micro frontend and Blazor Server, the beginning of the journey
date: 2022-05-22
author: Nicola Biancolini
description: |
  Not all donuts come out with a hole, but that doesn't mean there isn't good in them. I stumbled upon one of these in an attempt to implement a micro frontends architecture with Blazor Server.
keywords: 
 - blazor server
 - micro frontends
 - server side rendering
 - architecture
 - blazor
tags:
 - blazor
 - architecture
draft: true
cover:
  image: cover.jpg
  alt: Post cover
  relative: true
  caption: Photo by [Bernie Almanzar](https://unsplash.com/@bhurnal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

<style>
  body.dark .post-content img[src$="art-assemblies-graph.drawio.svg"] {
    filter: invert(90%);
  }
</style>

I was recently asked to make a **spike**[^spike] to evaluate the feasibility of implementing a **micro frontends** architecture with **Blazor Server**.

[^spike]: A spike is a product development method originating from extreme programming that uses the simplest possible program to explore potential solutions. Source [Wikipedia](https://en.wikipedia.org/wiki/Spike_(software_development)).

I'll tell you right now that it was a **failure**; but let's go in order, first analyzing the declension of the term *failure* and the reasons that led me to use it and then try to recapitulate what emerged from this exploration that led me to this conclusion.

I really like the definition he gives [Treccani](https://www.treccani.it/vocabolario).

> Riconoscere l'inutilità dei propri sforzi, l'impossibilità e incapacità di raggiungere gli scopi fissati, rinunciando definitivamente alla lotta, all'azione.
>
> -- <cite>[Treccani](https://www.treccani.it/vocabolario/fallimento)</cite>

Which translated, hoping to do it correctly, would be "*Recognizing the futility of one's efforts, the impossibility and inability to achieve the set goals, definitely giving up the struggle, action.*"

I find it particularly appropriate because it uses the term *fixed scopes*, and so what are those purposes?

## Context matters.

Nothing is done by accident, and this is certainly no exception. The work done is part of a larger context involving the need to migrate a number of *ASP.NET MVC 5* applications to *ASP.NET Core* combined with a desire to make the current architecture more flexible by introducing the concept of **modular-programming**[^modular-programming].

[^modular-programming]: Modular programming is a software design technique that emphasizes separating the functionality of a program into independent, interchangeable modules, such that each contains everything necessary to execute only one aspect of the desired functionality. Source [Wikipedia](https://en.wikipedia.org/wiki/Modular_programming).

Without getting around too much, the ultimate goal was to measure the feasibility of "realizing" a *micro frontends* architecture rendered server-side thanks to *Blazor Server*.

In this regard on [Martin Fowler's](https://martinfowler.com/) blog there is a nice article by [Cam Jackson](https://camjackson.net/) in which an [overview of this architecture](https://martinfowler.com/articles/micro-frontends.html) is given and from which I have translated their definition of *micro frontends*

> An architectural style where independently deliverable frontend applications are composed into a greater whole.
>
> -- <cite>[Thoughtworks su martinfowler.com](https://martinfowler.com/articles/micro-frontends.html)</cite>

I put realize in quotes since the deployment of the various sites would only ever be done in a unified manner.  
Perhaps we would address this issue in a future post.

## Not all donuts come out with a hole.

{{< collapse summary="Don't you know what it means?" >}}
A clear explanation of what this Italian saying means I found in [Clozemaster](https://www.clozemaster.com/blog/italian-sayings/) at point 4.
Anyway, in two words it means that despite failure there is still something left to eat!
{{< /collapse >}}

Getting straight to the point, the main reason for the failure is related to the inability to give [complete autonomy to the teams](https://martinfowler.com/articles/micro-frontends.html#AutonomousTeams), for two main distinct reasons.

### Homonymy in support for pages and views *Razor*.

To compose the site each *frontends* is contained within a **Razor** class library which also contains the view that is responsible for doing [hosting](https://docs.microsoft.com/aspnet/core/blazor/fundamentals/routing#aspnet-core-endpoint-routing-integration) of the *Blazor* application.

This is made possible by the functionality exposed by the *SDK* that allows a *web app* to use *Razor* views, pages, or layouts from class libraries and, as defined in the [official documentation](https://docs.microsoft.com/aspnet/core/razor-pages/ui-class#override-views-partial-views-and-pages-2), in case of homonymy, precedence is given to the view, page, layout present in the *web app*.

In my case I am in a situation like this

{{< figure src="./art-assemblies-graph.drawio.svg" caption="Figure 1: an ASP.NET Core application referencing two *Razor Class Library* representing two modules." >}}

where both modules internally make use of layouts contained at the `/Pages/Shared/_Layout.cshtml` path.

Here, what would happen in this case is that one of the two teams would be displeased since, if it went well it would see its application rendered inside another layout, in the worst case one part or all of the views would go wrong (e.g., a view tries to enhance a [section](https://docs.microsoft.com/aspnet/core/mvc/views/razor#section) not declared in the layout).    
And we note well that both modules executed independently would behave as expected.

### Routes, the basic route that does not want to work.

I have that at least I could not get it to work.

Again, following the principle of autonomy, the desired was to separate the module routes from the container routes, for example within *Module A* we would find `/` or `/index` while from the container perspective the routes would be `/module-a/` or `/module-a/index`.

What I found was a "short blanket," when internal navigation within the module worked, route generation using [*Anchor Tag Helper*](https://docs.microsoft.com/aspnet/core/mvc/views/tag-helpers/built-in/anchor-tag-helper) did not work (remember that this *spike* is the result of a [migration process](#the-context-counts)), as I used the middleware [`UsePathBaseMiddleware`](https://github.com/dotnet/aspnetcore/blob/main/src/Http/Http.Abstractions/src/Extensions/UsePathBaseMiddleware.cs) for the implementation of the requirement.

This resulted in the generation of links within the module to the outside always adding the `/module-a` at the top of the address even as the link should have simply pointed to the container.

Otherwise using middleware I would have been forced to use the module name at the top of all [`@page`](https://docs.microsoft.com/aspnet/core/mvc/views/razor#page) directives.

## Conclusions.

Summing up what has been done and reasoning with a cool mind I could say that something good we can still take home, in fact, by not enabling support for *Razor* pages and views in a *RCL*[^razor-class-library] and avoiding the use of *Anchor Tag Helper* in the HTML markup that contributes to view rendering we would not run into these problems.

[^razor-class-library]: [Razor Class libraries (RCLs)](https://docs.microsoft.com/aspnet/core/razor-pages/ui-class) were introduced in ASP.NET Core 2.1 as a way to package and distribute UI components to be referenced and consumed within a host application.
