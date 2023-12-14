import { produce } from "immer"
import { render,TemplateResult  } from "lit"
import { atom } from "nanostores"

import { Recipe } from "./@types/State"
import WebComponentConfiguration from "./@types/WebComponentConfiguration"

/**
 * Creates a web component template based on the provided configuration.
 *
 * The returned class will:
 *     Extend HTMLElement
 *     Render() accepts defaultState and renders shadow DOM
 *     State initialized from config
 *     Methods can be added by extending class after it is returned
 *
 * @param {WebComponentConfiguration<StateGeneric>} configuration - The configuration
 *  object for the web component.
 * @return {WebComponentClass} The new web component class.
 */
const createWebComponentBaseClass = <StateGeneric>(
  configuration: WebComponentConfiguration<StateGeneric>,
) => {
  const stateAtom = atom<StateGeneric>(configuration.defaultState)

  return class WebComponent extends HTMLElement {
    state = {
      ...stateAtom,

      set: (recipe: Recipe<StateGeneric>) => {
        stateAtom.set(produce(stateAtom.get(), recipe))
      },
    }

    template = atom<TemplateResult>(configuration.template)

    constructor() {
      super()
      this.attachShadow({ mode: "open" })

      this.template.subscribe(() => {
        this.render()
      })

      this.state.listen(() => {
        this.render()
      })
    }

    render() {
      render(this.template.get(), this.shadowRoot!)
    }
  }
}

export default createWebComponentBaseClass
