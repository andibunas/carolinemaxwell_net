using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace netapi;

public class TodoFunctions
{
    // GET /api/todos
    [Function("getTodos")]
    public async Task<HttpResponseData> GetTodos(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "todos")] HttpRequestData req)
    {
        var (status, body) = TodoCore.ListTodos();
        return await JsonResponse(req, status, body);
    }

    // GET /api/todos/{id}
    [Function("getTodoById")]
    public async Task<HttpResponseData> GetTodoById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "todos/{id}")] HttpRequestData req,
        string id)
    {
        var (status, body) = TodoCore.GetTodo(id);
        return await JsonResponse(req, status, body);
    }

    // POST /api/todos  body: { "title": "..." }
    [Function("createTodo")]
    public async Task<HttpResponseData> CreateTodo(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "todos")] HttpRequestData req)
    {
        TodoInput? input;
        try
        {
            input = await req.ReadFromJsonAsync<TodoInput>();
        }
        catch (Exception e) when (e is JsonException or InvalidOperationException)
        {
            input = null;
        }

        var (status, body) = TodoCore.CreateTodo(input);
        return await JsonResponse(req, status, body);
    }

    private static async Task<HttpResponseData> JsonResponse(HttpRequestData req, int status, object body)
    {
        var response = req.CreateResponse((HttpStatusCode)status);
        await response.WriteAsJsonAsync(body);
        return response;
    }
}
