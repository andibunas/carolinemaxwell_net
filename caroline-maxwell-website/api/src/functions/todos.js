import { app } from "@azure/functions";
import { listTodos, getTodo, createTodo } from "../todos-core.js";

// GET /api/todos
app.http("getTodos", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "todos",
  handler: async () => {
    const { status, body } = listTodos();
    return { status, jsonBody: body };
  },
});

// GET /api/todos/{id}
app.http("getTodoById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "todos/{id}",
  handler: async (request) => {
    const { status, body } = getTodo(request.params.id);
    return { status, jsonBody: body };
  },
});

// POST /api/todos  body: { "title": "..." }
app.http("createTodo", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "todos",
  handler: async (request) => {
    const input = await request.json().catch(() => null);
    const { status, body } = createTodo(input);
    return { status, jsonBody: body };
  },
});
