const fs = require("node:fs");
const path = require("node:path");

const appVersion = process.env.APP_VERSION || "1.0.0";
const appName = process.env.APP_NAME || "CI/CD Demo App";
const environment = process.env.NODE_ENV || "development";

const staticFile = path.join(__dirname, "..", "public", "index.html");
const htmlTemplate = fs.readFileSync(staticFile, "utf8");

function buildPage() {
  return htmlTemplate
    .replaceAll("{{APP_NAME}}", appName)
    .replaceAll("{{APP_VERSION}}", appVersion)
    .replaceAll("{{ENVIRONMENT}}", environment);
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function notFound(res) {
  json(res, 404, {
    status: "error",
    message: "Resource not found"
  });
}

function requestHandler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, {
      status: "error",
      message: "Method not allowed"
    });
    return;
  }

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(buildPage());
    return;
  }

  if (req.url === "/health") {
    json(res, 200, {
      status: "ok",
      service: appName,
      environment,
      version: appVersion,
      uptimeSeconds: Math.round(process.uptime())
    });
    return;
  }

  if (req.url === "/api/info") {
    json(res, 200, {
      name: appName,
      version: appVersion,
      environment,
      pipeline: [
        "GitHub push",
        "Jenkins build and test",
        "Docker image build",
        "Registry push",
        "Kubernetes deployment"
      ]
    });
    return;
  }

  notFound(res);
}

module.exports = {
  requestHandler
};
