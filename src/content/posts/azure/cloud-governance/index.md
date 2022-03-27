---
title: A new side project
date: 2022-03-29
author: Nicola Biancolini
description: Usually when a large company approaches the cloud one of the main concerns is cost management.
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
  alt: Post cover
  relative: true
  caption: Photo by [Tom Fisk](https://www.pexels.com/photo/bird-s-eye-view-of-river-in-middle-of-green-fields-1483880/)
---

A few years ago, when I was commuting to work by car, there was a tree-lined stretch of country road along a stream. Within this area there was a very narrow chicane at the exit immediately following a slight descent that followed a long straight.
Given the presence of the stream and the permanent shade caused by the trees, it was not uncommon that on some winter mornings there was the presence of ice.

I never had any accidents there as I was aware of the potential danger and even though the straightaway led to pushing on the accelerator I held back.

What do I want to tell you with this anecdote?  
That prevention is better than cure?  
Not really, the message is more subtle and is about *instinct* and *consciousness*.

What if someone just happened to walk by on one of those mornings?  
And maybe even late for his appointment?  
In all likelihood they would be forced to call the tow truck as they would be unaware of the presence of ice and would step on the brake pedal to reduce their speed on the curve. With consequent loss of grip and a car in the ditch.

What would be the potential consequences?  
Let's assume that after this unfortunate "adventure" the driver gets out of the car unharmed, what would be the other consequences?  
I would say two, a lightened wallet and a missed appointment.

## A typical approach to OpEx.

I guess you are wondering what is the purpose and the reason of this parable.  
You must know that some time ago I attended some meetings about the migration of a business application for internal use in *Azure* in which many issues arose due to the permissions assigned to users.  
Problems that have caused the postponement of the production release of a business application for internal use by more than two weeks.

Let's try, with not exactly little effort, to transpose the parable of the unfortunate driver within this context; we can identify the road as the *cloud*, the person driving the car as the company. And I'd say let's stop there for now.

Typically when a company approaches the cloud one of the main concerns is cost management[^capex-vs-opex].

[^capex-vs-opex]: [CapEx vs OpEx in Cloud Computing]( https://www.geeksforgeeks.org/capex-vs-opex-in-cloud-computing)

Imagine being a member of the security operations team, used to operating on a predetermined set of machines, who now finds himself with a potentially infinite fleet of machines and a warning from his area manager telling him he must contain his expenses.

The only thing it knows of that is more like what it has used so far is the role-based access control of [Active Directory](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models#role-based-access-controls-rbac-for-active-directory) which finds its counterpart [Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview) also configurable from [Azure Active Directory]( https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis).

What would you do? I think I would limit access to all users by giving only the minimum permissions necessary to members of the development team, but I think you would do the same.

And that's what the team did, so they set up two resource groups, one to house all the resources related to networking issues and one for the development team giving them the role of [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) for the latter.

Slipping into misuse of resource groups improperly in that some resources such as for example the [Azure Kubernetes service]( https://docs.microsoft.com/azure/aks/intro-kubernetes) relies on a third resource group to host agent pool nodes shared between us and the service itself.

## Educate rather than impose.

The *SecOps* team failed because they were unaware of the meaning of the term *Cloud Governance* and the tools that *Azure* offers to support it.

{{< figure src="cloud-governance.svg" >}}

Obviously, the team acted in good faith by trying to limit each team's *scope*[^scope] of action.  
Thinking to achieve two goals: *cost control*[^cost-management] and *security*[^security]. 

[^scope]: [Understand scope for Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/scope-overview)
[^cost-management]: [What is Cost Management + Billing?]( https://docs.microsoft.com/azure/cost-management-billing/cost-management-billing-overview)
[^security]: [Introduction to Azure security](https://docs.microsoft.com/azure/security/fundamentals/overview)

Here we now have the necessary elements to resume the transposition begun earlier and identify 
the *ambit*[^scope] in the jacke, the release date in the date, and [the five disciplines of *Cloud Governance*]( https://docs.microsoft.com/azure/cloud-adoption-framework/govern/governance-disciplines#disciplines-of-cloud-governance) in the awareness.

Here that to try to increase this awareness I created this repository

{{< github binick oh-my-azure-playground >}}

whose intent is to define standards based on best practices that have emerged in areas such as resource naming, tag management and localization.  
On which it will then be possible to define patterns for the definition of budget[^cost-management].

Over the years I've started several side projects but never had a post like this one.  
I see this as a first step towards a real commitment, if you would like to elaborate or feel the need to contribute please feel free to [contact me]({{< ref "about-me" >}}) 🙂 .
