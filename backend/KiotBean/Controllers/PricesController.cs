using KiotBean.Features.Prices.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Controllers;

[Route("price")]
public class PricesController(IMediator mediator) : ApiControllerBase(mediator)
{
    [HttpGet]
    public Task<IActionResult> Get()
        => Send(new GetCurrentPriceQuery());

    [HttpPost]
    public Task<IActionResult> Set(SetCurrentPriceCommand req)
        => Send(req);
}

