import http from "node:http";
import { listTodos, getTodo, createTodo } from "./src/todos-core.js";

// Local stand-in for the Azure Functions app in src/functions/todos.js.
// Same routes and responses, no Azure tooling needed. Run: npm run start:local
const PORT = process.env.PORT || 7071;

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/\/$/, "");

  // GET /api/todos
  if (req.method === "GET" && path === "/api/todos") {
    const { status, body } = listTodos();
    return send(res, status, body);
  }

  // GET /api/todos/{id}
  const match = path.match(/^\/api\/todos\/([^/]+)$/);
  if (req.method === "GET" && match) {
    const { status, body } = getTodo(match[1]);
    return send(res, status, body);
  }

  // POST /api/todos  body: { "title": "..." }
  if (req.method === "POST" && path === "/api/todos") {
    const { status, body } = createTodo(await readJson(req));
    return send(res, status, body);
  }

  return send(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Local API running at http://localhost:${PORT}/api/todos`);
});
