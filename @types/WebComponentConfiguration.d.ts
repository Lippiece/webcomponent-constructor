export default interface WebComponentConfiguration<T> {
  name: string;
  defaultState: T;
  template: string;
}
