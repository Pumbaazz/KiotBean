using KiotBean.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace KiotBean.Middleware;

public class ApiResponseFilter : IResultFilter
{
    public void OnResultExecuting(ResultExecutingContext context)
    {
        if (context.Result is ObjectResult obj && obj.Value is not ApiResponse)
        {
            var status = obj.StatusCode ?? 200;
            string? message = null;
            if (obj.Value is IEnumerable<KeyValuePair<string, string[]>> errors)
                message = string.Join("; ", errors.SelectMany(e => e.Value));
            else if (obj.Value is IDictionary<string, object> dict && dict.TryGetValue("message", out var m))
                message = m?.ToString();

            obj.Value = status switch
            {
                >= 200 and < 300 => ApiResponse.Ok(obj.Value!),
                400 => ApiResponse.Fail(message ?? "Bad request", "BAD_REQUEST", obj.Value),
                401 => ApiResponse.Fail(message ?? "Unauthorized", "UNAUTHORIZED"),
                403 => ApiResponse.Fail(message ?? "Forbidden", "FORBIDDEN"),
                404 => ApiResponse.Fail(message ?? "Resource not found", "NOT_FOUND"),
                409 => ApiResponse.Fail(message ?? "Conflict", "CONFLICT"),
                >= 500 => ApiResponse.Fail(message ?? "An internal error occurred", "INTERNAL_ERROR"),
                _ => ApiResponse.Fail(message ?? "Request failed", "ERROR"),
            };
        }
    }

    public void OnResultExecuted(ResultExecutedContext context) { }
}
