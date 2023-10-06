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
 * @param {WebComponentConfiguration<T>} configuration - The configuration
 *   object for the web component.
 * @return {WebComponentClass} The new web component class.
 */
const createWebComponentBaseClass = <T>( configuration: WebComponentConfiguration<T> ) => {
  interface State {
    get: () => T
    set: ( producer: ( state: T,
                       draft: T ) => T ) => void

    subscribe( subscriber: ( state: T ) => void ): () => void
  }

  const template     = document.createElement( "template" )
  template.innerHTML = configuration.template

  const stateAtom = atom<T>( configuration.defaultState )

  return class WebComponent extends HTMLElement {
    state: State = {
      get: () => stateAtom.get(),
      // updater function using immer
      set: producer => {
        const newState = produce( this.state.get(), producer )
        stateAtom.set( newState )
      },
      subscribe( subscriber: ( state: T ) => void ): () => void {
        return stateAtom.subscribe( subscriber )
      },
    }

    constructor() {
      super()
      this.attachShadow( { mode: "open" } )
      this.render( configuration.template )
    }

    render( content: string ) {
      template.innerHTML = content

      this.shadowRoot.replaceChildren( template.content.cloneNode( true ) )
    }
  }
}

export default createWebComponentBaseClass
