export default interface WebComponentConfiguration {
  name: string;
  defaultState: { [ key: string ]: any; };
  template: string;
}
