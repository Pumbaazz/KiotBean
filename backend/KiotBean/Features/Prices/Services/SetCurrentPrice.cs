using KiotBean.Features.Prices.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using static KiotBean.Middleware.ApiResponseFilter;

namespace KiotBean.Features.Prices.Services;

public class SetCurrentPriceHandler(IConnectionMultiplexer redis) : IRequestHandler<SetCurrentPriceCommand, IActionResult>
{
    public async Task<IActionResult> Handle(SetCurrentPriceCommand req, CancellationToken ct)
    {
        var db = redis.GetDatabase();
        var price = (double)req.Price;
        await db.StringSetAsync("coffee:current-price", price);
        return Ok(new SetCurrentPriceResponse(price));
    }
}

