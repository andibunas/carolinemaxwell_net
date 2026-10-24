using Microsoft.Extensions.Hosting;

// Azure Functions (isolated worker) entry point. Functions are in TodoFunctions.cs.
var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .Build();

host.Run();
