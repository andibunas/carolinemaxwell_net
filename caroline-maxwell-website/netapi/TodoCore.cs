// Shared todo logic. Mirrors api/src/todos-core.js. Keep the two in sync.
// Each function returns (status, body); the Functions layer turns that into an HTTP response.
namespace netapi;

public record Todo(string Id, string Title, bool Completed);

public record TodoInput(string? Title);

public static class TodoCore
{
    // Dummy data until a database is added. Writes are not persisted.
    private static readonly List<Todo> Todos =
    [
        new("1", "Sketch new series", false),
        new("2", "Update artwork manifest", true),
        new("3", "Write about studio process", false),
    ];

    public static (int Status, object Body) ListTodos() => (200, Todos);

    public static (int Status, object Body) GetTodo(string id)
    {
        var todo = Todos.FirstOrDefault(t => t.Id == id);
        return todo is null
            ? (404, new { error = "Todo not found" })
            : (200, todo);
    }

    // `input` is null if the body was missing or not valid JSON.
    public static (int Status, object Body) CreateTodo(TodoInput? input)
    {
        if (input is null)
        {
            return (400, new { error = "Request body must be valid JSON" });
        }

        var title = input.Title?.Trim() ?? "";
        if (title.Length == 0)
        {
            return (400, new { error = "'title' is required" });
        }

        var todo = new Todo(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(), title, false);
        return (201, todo);
    }
}
