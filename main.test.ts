/* eslint-disable @typescript-eslint/no-unsafe-member-access */


/* eslint-disable @typescript-eslint/no-unsafe-call */
import { assert, expect, fixture, html, unsafeStatic } from "@open-wc/testing"
import { HTMLTemplateResult } from "lit"

import WebComponentConfiguration
  from "./@types/WebComponentConfiguration"
import createWebComponentBaseClass             from "./main"

const generateRandomString = () => Math.random().toString( 36 ).slice( 2 )
const render               = async ( template: HTMLTemplateResult, dom = "" ) => {
  const config: WebComponentConfiguration = {
    defaultState: {
      bar: "bar",
      foo: "foo",
    },

    tag         : "my-element",
    template,
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
      const element    = await render( html`
        <slot></slot> <div class='existing'>foo</div>`, "<div class='slotted'></div>" )

      expect(element.innerHTML).to.include( "slotted" )
    } )

    it("works with custom class", async () => {
      interface State {
        bar: string
        foo: string
      }
      const Base = createWebComponentBaseClass<State>( {
        defaultState: {
          bar: "bar",
          foo: "foo",
        },

        tag         : "my-element",
        template: html`
            <slot></slot>
            <button>button</button>` } )

      class Extended extends Base {
        connectedCallback() {
          this.shadowRoot?.querySelector( "button" )
            ?.addEventListener( "click",
              () => { this.template.set( html`<div>bar</div>` ) } )
        }
      }

      customElements.define( "my-element", Extended )

      const element = await fixture( html`
        <my-element>
          <div>foo</div>
        </my-element>` )

      assert( element.shadowRoot?.querySelector("button"),
        "doesn't have button")

      const button = element.shadowRoot?.querySelector( "button" )
      button?.click()

      expect( element.shadowRoot?.innerHTML ).to.include( "<div>bar</div>" )
    } )
  } )

  describe( "state", () => {
    it( "has working defaultState", async () => {
      const element = await render( html`<div>default state should work</div>` )

      expect(element.state.get())
        .to.deep.equal({
          bar: "bar",
          foo: "foo",
        } )
    } )

    it( "should update state", async () => {
      const element = await render( html`<div></div>` )

      const newValue = {
        bar: "bar",
        foo: "new foo",
      }
      element.state.set(()=>newValue )

      expect( element.state.get() ).to.deep.equal(newValue)
    } )

    it( "supports state subscribing", async () => {
      const element = await render( html`<div></div>` )

      expect( element.state.subscribe ).to.be.a( "function" )
    } )

    it("works with custom template", async () => {
      const Base = createWebComponentBaseClass( {
        tag         : "custom-template",
      } )

      class Extended extends Base {
        connectedCallback() {
          this.template.set(html`
            <slot></slot>
            <button @click="${()=>{ this.querySelector( "div" ).textContent = "clicked" } }">button</button>`)
        }
      }

      customElements.define( "custom-template", Extended )

      const element = await fixture(html`
        <custom-template>
          <div>foo</div>
        </custom-template>
      `)

      assert(element.shadowRoot?.innerHTML.includes("button"), "doesn't have button")

      const button = element.shadowRoot?.querySelector("button")
      button.click()

      expect(element.innerHTML).to.include("clicked")
    })
  } )
} )
