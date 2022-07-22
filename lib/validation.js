const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    key: { type: "string" },
    apiURL: { type: "string" },
    mediaURL: { type: "string" },
    debug:{ type: "boolean"}
  },
  required: ["key","apiURL","mediaURL"],
  additionalProperties: false,
};