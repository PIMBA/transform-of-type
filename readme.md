# transform of type

## Movition

validate or fatory a type is not a easy thing.

## Installation

- npm install

```bash
npm install --save-dev transform-of-type
```

## Usage

```typescript
import { schemaOf, factoryOf, validatorOf } from "transform-of-type";

interface A {
  a: string;
  b: number;
}

const schemaString = schemaOf<A>(); // will generate a json-schema string of interface A;

factoryOf<A>().then(factory => {
  console.log(factory()); // will generate an object instance of A;
});

validatorOf<A>().then(validate => {
  console.log(validate({ a: 1 })); // return false (a is not instance of A);
});
```
