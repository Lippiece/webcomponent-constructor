import { Immer, produce } from "immer"
import { WritableAtom, atom } from "nanostores"
import WebComponentConfiguration from "./@types/WebComponentConfiguration"
import { Recipe, State } from "./@types/State"

/**
 * Creates a web component template based on the provided configuration.
 *
 * The returned class will:
 *     Extend HTMLElement and call super() in constructor
 *     Create shadow root and clone template
 *     Set ARIA attributes in connectedCallback
 *     Remove event listeners in disconnectedCallback
 *     Implement attribute changed callbacks
 *     Reflect attributes to properties
 *     Render() accepts defaultState and renders shadow DOM
 *     Properties will be generated from config
 *     Event handlers will be added from config
 *     State initialized from config
 *     Methods can be added by extending class after it is returned
 *
 * @param {WebComponentConfiguration<T>} configuration - The configuration
 *   object for the web component.
 * @return {WebComponentClass} The new web component class.
 */
const createWebComponentBaseClass = <T>(configuration: WebComponentConfiguration<T>) => {

  const template = document.createElement("template")
  template.innerHTML = configuration.template

  const stateAtom = atom(configuration.defaultState)


  return class WebComponent extends HTMLElement {
    state: State<T> = {
      ...stateAtom,
      set: (recipe:Recipe<T>) =>
        stateAtom.set(produce(stateAtom.get(), recipe))
    }

    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this.render(configuration.template)
    }

    render(content: string) {
      template.innerHTML = content

      this.shadowRoot.replaceChildren(template.content.cloneNode(true))
    }
  }
}

export default createWebComponentBaseClass
