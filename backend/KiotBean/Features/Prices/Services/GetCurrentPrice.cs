using KiotBean.Features.Prices.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using static KiotBean.Middleware.ApiResponseFilter;

namespace KiotBean.Features.Prices.Services;

// Handling both query and notification for price changes
public class GetCurrentPriceHandler(IConnectionMultiplexer redis) : IRequestHandler<GetCurrentPriceQuery, IActionResult>, INotificationHandler<PriceChangedNotification>
{
    public async Task<IActionResult> Handle(GetCurrentPriceQuery _, CancellationToken ct)
    {
        var db = redis.GetDatabase();
        var value = await db.StringGetAsync("coffee:current-price");
        if (!value.HasValue)
            return NotFound("No price set yet");

        return Ok(new GetCurrentPriceResponse((double)value));
    }

    public Task Handle(PriceChangedNotification notification, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
