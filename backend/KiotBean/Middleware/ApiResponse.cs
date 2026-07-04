using System.Text.Json.Serialization;

namespace KiotBean.Middleware;

public class ApiResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsSuccess { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Data { get; set; }

    public static ApiResponse Ok(object data) => new() { IsSuccess = true, Message = "Success", Data = data };
    public static ApiResponse Fail(string message) => new() { IsSuccess = false, Message = message };
}
