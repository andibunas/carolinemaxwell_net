import { app } from "@azure/functions";

// Dummy data until a database is added. Writes are not persisted.
const todos = [
  { id: "1", title: "Sketch new series", completed: false },
  { id: "2", title: "Update artwork manifest", completed: true },
  { id: "3", title: "Write about studio process", completed: false },
];

// GET /api/todos
app.http("getTodos", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "todos",
  handler: async () => {
    return { jsonBody: todos };
  },
});

// GET /api/todos/{id}
app.http("getTodoById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "todos/{id}",
  handler: async (request) => {
    const todo = todos.find((t) => t.id === request.params.id);
    if (!todo) {
      return { status: 404, jsonBody: { error: "Todo not found" } };
    }
    return { jsonBody: todo };
  },
});

// POST /api/todos  body: { "title": "..." }
app.http("createTodo", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "todos",
  handler: async (request) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "Request body must be valid JSON" } };
    }

    const title = typeof body?.title === "string" ? body.title.trim() : "";
    if (!title) {
      return { status: 400, jsonBody: { error: "'title' is required" } };
    }

    const todo = { id: String(Date.now()), title, completed: false };
    return { status: 201, jsonBody: todo };
  },
});
