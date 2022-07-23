import { Payload } from "./lib/class.js";

const payload = new Payload();

async function start() {
  var response = await payload
    .access()
    .catch((err) => {
      console.log(err);
    });
  
}

start();
