# Ways of Using kdu

We believe there is no "one size fits all" story for the web. This is why kdu is designed to be flexible and incrementally adoptable. Depending on your use case, kdu can be used in different ways to strike the optimal balance between stack complexity, developer experience and end performance.

## Standalone Script

kdu can be used as a standalone script file - no build step required! If you have a backend framework already rendering most of the HTML, or your frontend logic isn't complex enough to justify a build step, this is the easiest way to integrate kdu into your stack. You can think of kdu as a more declarative replacement of jQuery in such cases.

kdu also provides an alternative distribution called [petite-kdu](https://github.com/kdujs/petite-kdu) that is specifically optimized for progressively enhancing existing HTML. It has a smaller feature set, but is extremely lightweight and uses an implementation that is more efficient in no-build-step scenarios.

## Embedded Web Components

You can use kdu to [build standard Web Components](/guide/extras/web-components) that can be embedded in any HTML page, regardless of how they are rendered. This option allows you to leverage kdu in a completely consumer-agnostic fashion: the resulting web components can be embedded in legacy applications, static HTML, or even applications built with other frameworks.

## Single-Page Application (SPA)

Some applications require rich interactivity and non-trivial stateful logic on the frontend. The best way to build such applications is to use an architecture where kdu not only controls the entire page, but also handles data updates and navigation without having to reload the page. This type of application is typically referred to as a Single-Page Application (SPA).

kdu provides core libraries and [comprehensive tooling support](/guide/scaling-up/tooling) with amazing developer experience for building modern SPAs, including:

- Client-side router
- Blazing fast build tool chain
- IDE support
- Browser devtools
- TypeScript integrations
- Testing utilities

SPAs typically require the backend to expose API endpoints - but you can also pair kdu with solutions like [Inertia.js](https://inertiajs.com) to get the SPA benefits while retaining a server-centric development model.

## Fullstack / SSR

Pure client-side SPAs are problematic when the app is sensitive to SEO and time-to-content. This is because the browser will receive a largely empty HTML page, and has to wait until the JavaScript is loaded before rendering anything.

kdu provides first-class APIs to "render" a kdu app into HTML strings on the server. This allows the server to send back already-rendered HTML, allowing end users to see the content immediately while the JavaScript is being downloaded. kdu will then "hydrate" the application on the client side to make it interactive. This is called [Server-Side Rendering (SSR)](/guide/scaling-up/ssr) and it greatly improves Core Web Vital metrics such as [Largest Contentful Paint (LCP)](https://web.dev/lcp/).

There are higher-level kdu-based frameworks built on top of this paradigm, such as [Dorayaki](https://dorayakijs.web.app/), which allow you to develop a fullstack application using kdu and JavaScript.

## JAMStack / SSG

Server-side rendering can be done ahead of time if the required data is static. This means we can pre-render an entire application into HTML and serve them as static files. This improves site performance and makes deployment a lot simpler since we no longer need to dynamically render pages on each request. Kdu can still hydrate such applications to provide rich interactivity on the client. This technique is commonly referred to as Static-Site Generation (SSG), also known as [JAMStack](https://jamstack.org/what-is-jamstack/).

The Kdu team maintains a static-site generator called [WitePress](https://witepress.web.app/), which powers this website you are reading right now! In addition, [Nuxt](https://dorayakijs.web.app/) also supports SSG. You can even mix SSR and SSG for different routes in the same Nuxt app.

## Beyond the Web

Although Kdu is primarily designed for building web applications, it is by no means limited to just the browser. You can:

- Build desktop apps with [Electron](https://www.electronjs.org/)
