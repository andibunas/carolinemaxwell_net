// Shared todo logic used by both the Azure Functions app (src/functions/todos.js)
// and the local server (local-server.js). Keep this free of any Azure or http imports.

// Dummy data until a database is added. Writes are not persisted.
export const todos = [
  { id: "1", title: "Sketch new series", completed: false },
  { id: "2", title: "Update artwork manifest", completed: true },
  { id: "3", title: "Write about studio process", completed: false },
];

// Each function returns { status, body }. Adapters turn that into an HTTP response.

export function listTodos() {
  return { status: 200, body: todos };
}

export function getTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return { status: 404, body: { error: "Todo not found" } };
  return { status: 200, body: todo };
}

// `input` is the parsed JSON body, or null if the body was missing or not valid JSON.
export function createTodo(input) {
  if (input === null) {
    return { status: 400, body: { error: "Request body must be valid JSON" } };
  }
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  if (!title) {
    return { status: 400, body: { error: "'title' is required" } };
  }
  return { status: 201, body: { id: String(Date.now()), title, completed: false } };
}
