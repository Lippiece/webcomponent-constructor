import { expect, fixture, html, unsafeStatic } from "@open-wc/testing"
import WebComponentConfiguration
                                               from "./@types/WebComponentConfiguration"
import createWebComponentBaseClass             from "./main"
import { produce } from "immer"
import { Recipe } from "./@types/State"

const generateRandomString = () => {
  return Math.random().toString( 36 ).substring( 2 )
}
const render               = async ( template: string, dom: string = "" ) => {
  const config: WebComponentConfiguration = {
    tag         : "my-element",
    defaultState: {
      foo: "foo",
      bar: "bar",
    },
    template    : template,
  }

  const tag = `${ config.tag }-${ generateRandomString() }`
  customElements.define( tag,
                         createWebComponentBaseClass( config ) )

  return await fixture( html`
    <${ unsafeStatic( tag ) }>
      ${ unsafeStatic( dom ) }
    </${ unsafeStatic( tag ) }>` )
}

describe( "custom component builder", () => {
  describe( "render", () => {
    it( "allows slots", async () => {
      const element    = await render( `
        <slot></slot>`, `<div></div>` )
      const slottedDiv = element.querySelector( "div" )

      expect( slottedDiv ).to.exist
      expect( typeof element.state.get() ).to.equal( "object" )
    } )
    it( "works with custom class", async () => {
      type State = {
        foo: string
        bar: string
      }
      const Base = createWebComponentBaseClass<State>( {
                                                         tag         : "my-element",
                                                         defaultState: {
                                                           foo: "foo",
                                                           bar: "bar",
                                                         },
                                                         // language=HTML
                                                         template: `
                                                           <slot></slot>
                                                           <button>button
                                                           </button>
                                                         `,
                                                       } )

      class Extended extends Base {
        connectedCallback() {
          const a = this.state.get().foo

          this.shadowRoot.querySelector( "button" )
              .addEventListener( "click",
                                 () => this.render( "<div>bar</div>" ) )
        }
      }

      customElements.define( "my-element", Extended )

      const element = await fixture( html`
        <my-element>
          <div>foo</div>
        </my-element>` )


      const button = element.shadowRoot.querySelector( "button" )
      button.click()

      expect( element.shadowRoot ).html( "<div>bar</div>" )
    } )
  } )

  describe( "state", () => {
    it( "has working defaultState", async () => {
      const element = await render( `<div></div>` )

      expect( element.state.get() ).to.deep.equal( {
                                                     foo: "foo",
                                                     bar: "bar",
                                                   } )
    } )
    it( "should update state", async () => {
      const element = await render( `<div></div>` )

      const newValue = {
        foo: "new foo",
        bar: "bar",
      }
      element.state.set(()=>newValue )

      expect( element.state.get() ).to.deep.equal(newValue)
    } )
    it( "supports templates", async () => {
      // language=HTML
      const element = await render( `
        <template>
          <slot></slot>
          <div>bar</div>
        </template>
      ` )

    } )
    it( "supports state subscribing", async () => {
      const element = await render( `<div></div>` )

      expect( element.state.subscribe ).to.be.a( "function" )
    } )
  } )
} )
