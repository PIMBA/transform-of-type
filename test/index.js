"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("../dist");
// 自动从类型代码中生成jsonSchema
const schema = "{\"type\":\"object\",\"properties\":{\"a\":{\"type\":\"string\"},\"b\":{\"$ref\":\"#/definitions/B\"}},\"definitions\":{\"B\":{\"type\":\"object\",\"properties\":{\"c\":{\"type\":\"number\"},\"d\":{}}}},\"$schema\":\"http://json-schema.org/draft-07/schema#\"}";
console.log(schema);
// 自动从类型代码中生成假数据
Promise.resolve().then(() => __importStar(require("json-schema-faker"))).then(x => x.default || x).then(jsf => () => (jsf.option("alwaysFakeOptionals", true), jsf.generate(JSON.parse("{\"type\":\"object\",\"properties\":{\"a\":{\"type\":\"string\"},\"b\":{\"$ref\":\"#/definitions/B\"}},\"definitions\":{\"B\":{\"type\":\"object\",\"properties\":{\"c\":{\"type\":\"number\"},\"d\":{}}}},\"$schema\":\"http://json-schema.org/draft-07/schema#\"}")))).then(factory => console.log(factory()));
// 自动从类型代码中生成校验器
Promise.all([Promise.resolve().then(() => __importStar(require("enjoi"))), Promise.resolve().then(() => __importStar(require("joi")))]).then(([x, y]) => [x.default || x, y.default || y]).then(([Enjoi, Joi]) => f => {
    const { error, value } = Joi.validate(f, Enjoi.schema(JSON.parse("{\"type\":\"object\",\"properties\":{\"a\":{\"type\":\"string\"},\"b\":{\"$ref\":\"#/definitions/B\"}},\"definitions\":{\"B\":{\"type\":\"object\",\"properties\":{\"c\":{\"type\":\"number\"},\"d\":{}}}},\"$schema\":\"http://json-schema.org/draft-07/schema#\"}")));
    return !error;
}).then(validate => console.log(validate("")));
