import { schemaOf, factoryOf, validatorOf } from "../dist";
interface A {
  a: string;
  b?: B;
}
interface B {
  c: number;
  d: any;
}
// 自动从类型代码中生成jsonSchema
const schema = schemaOf<A>();
console.log(schema);
// 自动从类型代码中生成假数据
factoryOf<A>().then(factory => console.log(factory()));
// 自动从类型代码中生成校验器
validatorOf<A>().then(validate => console.log(validate("")));
