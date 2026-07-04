using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace KiotBean.Middleware;

public class ApiResponseFilter : IResultFilter
{
    public static IActionResult Ok(object? value) => new OkObjectResult(value);

    // Intentionally not using URI, hide the implementation detail of the resource location
    public static IActionResult Created(object? value, Uri? uri = null) => new CreatedResult(uri?.ToString(), value);

    // Not Found
    public static IActionResult NotFound() => new NotFoundObjectResult((object?)null);
    public static IActionResult NotFound(object? value) => new NotFoundObjectResult(value);

    // Bad Request
    public static IActionResult BadRequest() => new BadRequestObjectResult((object?)null);
    public static IActionResult BadRequest(object? value) => new BadRequestObjectResult(value);

    // No Content
    public static IActionResult NoContent() => new NoContentResult();

    // Conflict
    public static IActionResult Conflict() => new ConflictObjectResult((object?)null);
    public static IActionResult Conflict(object? value) => new ConflictObjectResult(value);

    // Unauthorized
    public static IActionResult Unauthorized() => new UnauthorizedResult();

    public void OnResultExecuting(ResultExecutingContext context)
    {
        if (context.Result is ObjectResult obj && obj.Value is not ApiResponse)
        {
            var status = obj.StatusCode ?? 200;

            var statusEnum = status switch
            {
                >= 200 and < 300 => HttpStatusCode.OK,
                400 => HttpStatusCode.BadRequest,
                401 => HttpStatusCode.Unauthorized,
                403 => HttpStatusCode.Forbidden,
                404 => HttpStatusCode.NotFound,
                409 => HttpStatusCode.Conflict,
                >= 500 => HttpStatusCode.InternalServerError,
                _ => HttpStatusCode.BadRequest,
            };

            var message = obj.Value?.ToString() ?? statusEnum.ToString();

            obj.Value = new ApiResponse
            {
                StatusCode = status,
                Message = message,
                IsSuccess = status >= 200 && status < 300,
                Data = status >= 200 && status < 300 ? obj.Value : null,
            };
        }
    }

    public void OnResultExecuted(ResultExecutedContext context)
    {
        // Do nothing
    }
}
