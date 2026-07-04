using KiotBean.Features.Prices.Models;
using MediatR;
using StackExchange.Redis;

namespace KiotBean.Features.Prices;

public class SetCurrentPriceHandler(IConnectionMultiplexer redis) : IRequestHandler<SetCurrentPriceCommand, SetCurrentPriceResult>
{
    public async Task<SetCurrentPriceResult> Handle(SetCurrentPriceCommand req, CancellationToken ct)
    {
        var db = redis.GetDatabase();
        await db.StringSetAsync("coffee:current-price", req.Price.ToString());
        return new SetCurrentPriceResult(req.Price);
    }
}

