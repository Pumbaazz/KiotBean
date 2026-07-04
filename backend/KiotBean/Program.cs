using System.Text.Json;
using FluentValidation;
using KiotBean.Database;
using KiotBean.Middleware;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Get builder configuration
var configuration = builder.Configuration;

// Configure database context
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(configuration["Redis:ConnectionString"]!));

// Add MediatR and FluentValidation services
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    );
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Configure CORS policies based on the environment
#if DEBUG
builder.Services.AddCors(opts => opts.AddDefaultPolicy(p =>
    p.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()));
#elif RELEASE
builder.Services.AddCors(opts => opts.AddDefaultPolicy(p =>
    p.WithOrigins("https://kiotbean.com")
    .AllowAnyMethod()
    .AllowAnyHeader()));
#endif

var app = builder.Build();
app.UseExceptionHandler();
app.UsePathBase("/api");
app.UseCors();
app.MapControllers();

app.Run();
