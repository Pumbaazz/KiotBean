using KiotBean.Features.Prices.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Controllers;

[ApiController]
[Route("api/price")]
public class PricesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await mediator.Send(new GetCurrentPriceQuery());
        return result is not null ? Ok(result) : NotFound(new { message = "No price set yet" });
    }

    [HttpPost]
    public async Task<IActionResult> Set(SetCurrentPriceCommand req)
    {
        var result = await mediator.Send(req);
        return Ok(result);
    }
}

