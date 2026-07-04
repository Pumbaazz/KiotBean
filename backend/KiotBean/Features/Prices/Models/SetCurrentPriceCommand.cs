using MediatR;

namespace KiotBean.Features.Prices.Models;

public record SetCurrentPriceCommand(decimal Price) : IRequest<SetCurrentPriceResult>;
