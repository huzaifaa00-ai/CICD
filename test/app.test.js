const test = require("node:test");
const assert = require("node:assert/strict");
const { requestHandler } = require("../src/app");

function callRoute(url, method = "GET") {
  return new Promise((resolve) => {
    const req = { method, url };
    const res = {
      statusCode: 200,
      headers: {},
      writeHead(statusCode, headers) {
        this.statusCode = statusCode;
        this.headers = headers;
      },
      end(body = "") {
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body
        });
      }
    };

    requestHandler(req, res);
  });
}

test("GET /health returns service status", async () => {
  const response = await callRoute("/health");
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "CI/CD Demo App");
});

test("GET /api/info returns pipeline stages", async () => {
  const response = await callRoute("/api/info");
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.pipeline.length, 5);
  assert.match(body.pipeline[1], /Jenkins/);
});

test("unknown route returns 404", async () => {
  const response = await callRoute("/missing");

  assert.equal(response.statusCode, 404);
});
