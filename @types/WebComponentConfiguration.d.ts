import { HTMLTemplateResult } from "../node_modules/lit-html/lit-html";

export default interface WebComponentConfiguration<T> {
  name: string;
  defaultState: T;
  template: HTMLTemplateResult;
}
