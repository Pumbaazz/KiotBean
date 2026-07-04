using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Features.Prices.Models;

public record SetCurrentPriceCommand(decimal Price) : IRequest<IActionResult>;
