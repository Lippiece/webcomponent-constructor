import { produce }               from "immer"
import { atom }                  from "nanostores"
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
 * @param {WebComponentConfiguration} configuration - The configuration object
 *   for the web component.
 * @return {WebComponentClass} The new web component class.
 */
const createWebComponentTemplate = ( configuration: WebComponentConfiguration ) => {
  const stateAtom = atom( configuration.defaultState )

  return class WebComponent extends HTMLElement {
    state = {
      get: () => stateAtom.get(),
      // updater function using immer
      set: ( updater: ( state: Record<string, any> ) => Record<string, any> ) => {
        stateAtom.set( produce( updater ) )
      },
    }

    /**
     *  connectedCallback() fires when the element is inserted into the DOM.
     *  It's a good place to set the initial role, tabindex, internal
     * defaultState, and install event listeners.
     */
    connectedCallback() {
      this.render( configuration.template )
    }

    render( template ) {
      const fragment = new DOMParser()
        .parseFromString( template, "text/html" )
        .firstChild
      this.shadowRoot.replaceChildren( fragment )
    }

    constructor() {
      super()
      this.attachShadow( { mode: "open" } )
    }
  }
}

export default createWebComponentTemplate
