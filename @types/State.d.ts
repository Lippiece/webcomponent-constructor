import { WritableAtom } from "nanostores"

  export type Recipe<T> = (draft: T) => T
  export type State<T> = WritableAtom | {
    set: (recipe: Recipe<T>) => void
  }