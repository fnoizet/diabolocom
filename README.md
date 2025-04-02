# test technique diablocom

J'ai développé des composants en Vue et des WebComponents.

## Composants Vue : (src/components/notification)
- NotificationWidget.vue => Un container qui gère la liste des notifications, avec 3 boutons pour ajouter des notifs basiques de différents types (mais même title et description)
- Notification.vue => Un composant notification, dupliqué dans la liste, avec ses boutons read / delete
- NotificationForm.vue => Un formulaire basique développé pour générer des notifications, indépendant du widget en lui mêmeCes composants fonctionnent avec un storage vueuse/core, définie dans useNotificationStore.ts

## WebComponents : (src/web-components/notification)
- notificationWidget.ts => le container qui gère la liste des notifications, avec 4 boutons pour ajouter les notifs... 3 pour les notifs basiques et un qui déploie un formulaire
- notification.ts => le webComponent de notification, même mécanisme que pour le composant vue
- customNotificationStore.ts => un store en JS natif, avec les mêmes fonctionnatlités.
- Formulaire encapsulé dans notificationWidget.ts, mais le composant Vue permet de choisir dans quel store on veut ajouter les notifs

## CI
Le workflow sur la branche permet de lancer les TU et les e2e
Au final, le dossier dist contient :
- Build de base avec une petite app en Vue, qui contient
  - les composants Vue
  - les WebComponents
  - le formulaire Vue qui permet l'ajout dans les 2 type de composants
- Dans le dossier lib, le build lib avec :
  - Le fichier .mjs
  - Une page HTML de test


## Test unitaires : 
Avec vitest, mis en place sur le store vue

## Test e2e :
Cypress, sur les composants Vue aussi

## Usage

```html
<script>
    import "path/to/lib/notification-widget.es.mjs"
</script>
<cc-notification-widget data-namespace="ANY_NAMESPACE"></cc-notification-widget>
```

# ⚠️ Code destiné uniquement à un test technique ⚠️
This code is provided for evaluation by Diabolocom, and cannot be reused without authorization.

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Build library (.mjs file)
```sh
npm run build-lib
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
