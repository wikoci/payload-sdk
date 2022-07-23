import json from "@rollup/plugin-json";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import externalGlobals from "rollup-plugin-external-globals";
export default {
  input: "./index.js",
  output: {
    dir: "./dist/sdk/",
      format: "umd",
    
    global: {
      consola: "consola",
      ufo: "ufo",
    },
  },

  plugins: [
      json(),
      nodeResolve({browser:true}),
      externalGlobals({
        "lodash":"_",
        consola: "consola",
        "ufo": "ufo",
        "qs": "qs",
        "js-cookie":"Cookies"
      
    }),
  ],
};
