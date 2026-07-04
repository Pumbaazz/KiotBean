namespace KiotBean.Models;

public class ApiResponse
{
    public bool Success { get; set; }
    public object? Data { get; set; }
    public ApiError? Error { get; set; }

    public static ApiResponse Ok(object data) => new() { Success = true, Data = data, Error = null };
    public static ApiResponse Fail(string message, string? code = null, object? details = null) =>
        new() { Success = false, Error = new ApiError { Message = message, Code = code, Details = details } };
}

public class ApiError
{
    public string Message { get; set; } = string.Empty;
    public string? Code { get; set; }
    public object? Details { get; set; }
}
