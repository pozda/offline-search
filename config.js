// @flow
import dotenv from "dotenv";
dotenv.config();
const env = ((process.env: any): { [string]: string }); // if you're sure that everything will be defined

export default {
  foo: env.FOO,
  bar: env.BAR
  // ...
};
