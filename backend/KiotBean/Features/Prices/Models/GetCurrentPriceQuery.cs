using MediatR;

namespace KiotBean.Features.Prices.Models;

public record GetCurrentPriceQuery : IRequest<GetCurrentPriceResult?>;
