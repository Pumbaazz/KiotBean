using KiotBean.Features.Prices.Models;
using MediatR;
using StackExchange.Redis;

namespace KiotBean.Features.Prices;

public class GetCurrentPriceHandler(IConnectionMultiplexer redis) : IRequestHandler<GetCurrentPriceQuery, GetCurrentPriceResult?>
{
    public async Task<GetCurrentPriceResult?> Handle(GetCurrentPriceQuery _, CancellationToken ct)
    {
        var db = redis.GetDatabase();
        var value = await db.StringGetAsync("coffee:current-price");
        return value.HasValue ? new GetCurrentPriceResult(decimal.Parse(value!)) : null;
    }
}

