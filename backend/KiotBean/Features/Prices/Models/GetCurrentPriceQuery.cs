using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Features.Prices.Models;

public record GetCurrentPriceQuery : IRequest<IActionResult>;
