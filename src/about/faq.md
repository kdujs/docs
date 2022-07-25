# Frequently Asked Questions

## Who maintains Kdu?

Kdu is an independent, community-driven project. It was created by [NKDuy](https://www.facebook.com/khanhduy1407) as a personal side project.

## What license does Kdu use?

Kdu is a free and open source project released under the [MIT License](https://opensource.org/licenses/MIT).

## What browsers does Kdu support?

The latest version of Kdu (3.x) only supports [browsers with native ES2015 support](https://caniuse.com/es6).

## Is Kdu fast?

Kdu 3 is one of the most performant mainstream frontend frameworks, and handles most web application use cases with ease, without the need for manual optimizations.

In stress-testing scenarios, Kdu out-performs React and Angular by a decent margin in the [js-framework-benchmark](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html). It also goes neck-and-neck against some of the fastest production-level non-Virtual-DOM frameworks in the benchmark.

Do note that synthetic benchmarks like the above focus on raw rendering performance with dedicated optimizations and may not be fully representative of real-world performance results. If you care more about page load performance, you are welcome to audit this very website using [WebPageTest](https://www.webpagetest.org/lighthouse) or [PageSpeed Insights](https://pagespeed.web.dev/). This website is powered by Kdu itself, with SSG pre-rendering, full page hydration and SPA client-side navigation. It scores 100 in performance on an emulated Moto G4 with 4x CPU throttling over slow 4G networks.

You can learn more about how Kdu automatically optimizes runtime performance in the [Rendering Mechanism](/guide/extras/rendering-mechanism.html) section, and how to optimize a Kdu app in particularly demanding cases in the [Performance Optimization Guide](/guide/best-practices/performance.html).

## Does Kdu scale?

Yes. Despite a common misconception that Kdu is only suitable for simple use cases, Kdu is perfectly capable of handling large scale applications:

- [Single-File Components](/guide/scaling-up/sfc) provide a modularized development model that allows different parts of an application to be developed in isolation.

- [Composition API](/guide/reusability/composables) provides first-class TypeScript integration and enables clean patterns for organizing, extracting and reusing complex logic.

- [Comprehensive tooling support](/guide/scaling-up/tooling.html) ensures a smooth development experience as the application grows.

- Lower barrier to entry and excellent documentation translate to lower onboarding and training costs for new developers.

## Should I use Options API or Composition API?

If you are new to Kdu, we provide a high-level comparison between the two styles [here](/guide/introduction.html#which-to-choose).

If you have previously used Options API and are currently evaluating Composition API, check out [this FAQ](/guide/extras/composition-api-faq).

## Should I use JavaScript or TypeScript with Kdu?

While Kdu itself is implemented in TypeScript and provides first-class TypeScript support, it does not enforce an opinion on whether you should use TypeScript as a user.

TypeScript support is an important consideration when new features are added to Kdu. APIs that are designed with TypeScript in mind are typically easier for IDEs and linters to understand, even if you aren't using TypeScript yourself. Everybody wins. Kdu APIs are also designed to work the same way in both JavaScript and TypeScript as much as possible.

Adopting TypeScript involves a trade-off between onboarding complexity and long-term maintainability gains. Whether such a trade-off can be justified can vary depending on your team's background and project scale, but Kdu isn't really an influencing factor in making that decision.

## How does Kdu compare to Web Components?

Kdu was created before Web Components were natively available, and some aspects of Kdu's design (e.g. slots) were inspired by the Web Components model.

The Web Components specs are relatively low-level, as they are centered around defining custom elements. As a framework, Kdu addresses additional higher-level concerns such as efficient DOM rendering, reactive state management, tooling, client-side routing, and server-side rendering.

Kdu also fully supports consuming or exporting to native custom elements - check out the [Kdu and Web Components Guide](/guide/extras/web-components) for more details.

<!-- ## TODO How does Kdu compare to React? -->

<!-- ## TODO How does Kdu compare to Angular? -->
