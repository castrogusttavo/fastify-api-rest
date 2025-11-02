import { env } from "./env/index.js";
import { app } from "./app.js";

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server running on port", env.PORT);
  });
