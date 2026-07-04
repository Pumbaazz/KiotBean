using Microsoft.AspNetCore.Diagnostics;

namespace KiotBean.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var response = new ApiResponse
        {
            StatusCode = 500,
            Message = "Internal Server Error",
            IsSuccess = false,
        };
        await context.Response.WriteAsJsonAsync(response, cancellationToken);
        return true;
    }
}
