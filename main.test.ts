import { expect, fixture, html }  from "@open-wc/testing"
import WebComponentConfiguration  from "./@types/WebComponentConfiguration"
import createWebComponentTemplate from "./main"

const config: WebComponentConfiguration = {
  name        : "my-element",
  defaultState: {
    foo: "foo",
    bar: "bar",
  },
  template    : `<div></div>`,
}

customElements.define( "my-element", createWebComponentTemplate( config ) )

describe( "custom component builder", () => {
  it( "has working config", async () => {
    const element = await fixture( html`
      <my-element foo = "foo" bar = "bar"></my-element>` )
    expect( element.getAttribute( "foo" ) ).to.equal( "foo" )
    expect( element.getAttribute( "bar" ) ).to.equal( "bar" )

  } )

  describe( "state", () => {
    it( "has working defaultState", async () => {
      const element = await fixture( html`
        <my-element foo = "foo" bar = "bar"></my-element>` )
      expect( element.state.get() ).to.deep.equal( {
                                                     foo: "foo",
                                                     bar: "bar",
                                                   } )
    } )
  } )
} )
