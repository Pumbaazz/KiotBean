using KiotBean.Models;
using Microsoft.AspNetCore.Diagnostics;

namespace KiotBean.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var response = ApiResponse.Fail("An internal error occurred", "INTERNAL_ERROR");
        await context.Response.WriteAsJsonAsync(response, cancellationToken);
        return true;
    }
}
