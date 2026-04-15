const http = require("node:http");

const port = Number(process.env.PORT || 3000);

http.get(`http://127.0.0.1:${port}/health`, (response) => {
  let raw = "";

  response.on("data", (chunk) => {
    raw += chunk;
  });

  response.on("end", () => {
    if (response.statusCode !== 200) {
      console.error(`Smoke test failed with status ${response.statusCode}`);
      process.exit(1);
    }

    console.log("Smoke test passed:");
    console.log(raw);
  });
}).on("error", (error) => {
  console.error(`Smoke test could not reach the app: ${error.message}`);
  process.exit(1);
});
