# Web component constructor in Typescript
Welcome! This readme explains the functionality and usage of the `createWebComponentBaseClass` function for creating reusable web components in TypeScript.

### What is it?
This library is my pet project. It provides a base class for building web components with `lit-html`, `nanostores` and `immer`. It simplifies the setup process by handling several boilerplate tasks:

- State management: Creates a `nanostores`' `atom` with the provided default state using `immer`'s `produce` for immutable updates.
- Templating: Accepts a lit `TemplateResult` and updates the shadow DOM whenever it changes.
- Basic setup: Extends `HTMLElement`, attaches a shadow DOM, and provides access to state and template.

### How to use it

#### Install:
```bash
npm install webcomponent-constructor
```

#### Write your configuration:
Create an object that defines the name, default state, and template for your web component.

```ts
import createWebComponentBaseClass from "webcomponent-constructor";

const configuration = {
  name: "my-component",
  defaultState: { count: 0 },
  template: html`<h1>No event listeners here, just static HTML</h1>`,
};

const Base = createWebComponentBaseClass(configuration);
```

#### Create the web component:
Use the createWebComponentBaseClass function with your configuration.

```ts
class YourOwnClass extends Base {
  constructor() {
    super()
    this.state.subscribe((state => {
      this.template.set(html`<button @click=${() => this.state.set(()=>({ count: state.count + 1 }))}>Click Me: ${state.count}</button>`)
    }
    // ^ ^ ^
    // `@`-stuff is ok here since you have access to `this`.
    // Just don't forget about arrow functions or binding `this` inside the listeners.
  }
}

customElements.define(configuration.name, YourOwnClass);
```

#### Then import the script where you defined the customElement:
- Into the HTML, and then declare your component there (`<my-component></my-component>`).
- Or into some other script, and do your magic there.

#### Extend and customize:
You can further extend the generated class to add methods, lifecycle hooks, and additional functionality specific to your component.

### Features
- Simple and concise: Focuses on essential tasks, keeping the codebase clean and easy to understand.
- State management with `immer`: Enables immutable updates with a familiar API. The state is automatically subscribed to to re-rendeer on change.
- `lit-html` integration: Renders templates efficiently using `lit`'s virtual DOM. Technically, it's just another `nanostores` `atom`, which is also subscribed to.
- Open shadow DOM: Allows direct styling of component internals.

### Benefits
- Reduced boilerplate: Save time and effort by focusing on your component logic.
- Consistent structure: Provides a standardized base for all your web components.
- Improved maintainability: Code is easier to understand and extend.

### Why?
I wanted my own `Lit` with bells and whistles.

### Feedback and contributions
Sure.
