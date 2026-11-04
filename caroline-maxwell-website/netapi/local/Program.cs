using System.Text.Json;
using netapi;

// Local stand-in for the Azure Functions app in ../TodoFunctions.cs.
// Same routes and responses, no Azure tooling needed. Run: dotnet run (serves on http://localhost:7071)
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:7071");
var app = builder.Build();

// GET /api/todos
app.MapGet("/api/todos", () =>
{
    var (status, body) = TodoCore.ListTodos();
    return Results.Json(body, statusCode: status);
});

// GET /api/todos/{id}
app.MapGet("/api/todos/{id}", (string id) =>
{
    var (status, body) = TodoCore.GetTodo(id);
    return Results.Json(body, statusCode: status);
});

// POST /api/todos  body: { "title": "..." }
app.MapPost("/api/todos", async (HttpRequest request) =>
{
    TodoInput? input;
    try
    {
        input = await request.ReadFromJsonAsync<TodoInput>();
    }
    catch (Exception e) when (e is JsonException or InvalidOperationException)
    {
        input = null;
    }

    var (status, body) = TodoCore.CreateTodo(input);
    return Results.Json(body, statusCode: status);
});

app.Run();
