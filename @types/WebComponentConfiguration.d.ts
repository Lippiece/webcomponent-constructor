import { TemplateResult } from "lit";

export default interface WebComponentConfiguration<State> {
  name: string;
  defaultState: State;
  template: TemplateResult;
}
