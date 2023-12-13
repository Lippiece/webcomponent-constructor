import { produce } from "immer"
import { HTMLTemplateResult } from "lit"
import {render } from "lit-html"
import { atom } from "nanostores"

import { Recipe, State } from "./@types/State"
import WebComponentConfiguration from "./@types/WebComponentConfiguration"

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

  const stateAtom = atom(configuration.defaultState)

  return class WebComponent extends HTMLElement {
    state: State<T> = {
      ...stateAtom,

      set: (recipe:Recipe<T>) =>
      { stateAtom.set(produce(stateAtom.get(), recipe)) },
    }

    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this.render(configuration.template)
    }

    render(content: HTMLTemplateResult) {
      render(content, this.shadowRoot!)
    }
  }
}

export default createWebComponentBaseClass
