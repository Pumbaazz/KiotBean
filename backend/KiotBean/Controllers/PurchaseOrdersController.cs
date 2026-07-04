using FluentValidation;
using KiotBean.Features.PurchaseOrders.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Controllers;

[ApiController]
[Route("api/purchase-orders")]
public class PurchaseOrdersController(IMediator mediator, IValidator<CreatePurchaseOrderCommand> validator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreatePurchaseOrderCommand req)
    {
        var result = await validator.ValidateAsync(req);
        if (!result.IsValid)
            return BadRequest(result.ToDictionary());

        var response = await mediator.Send(req);
        return Created($"/api/purchase-orders/{response.Id}", response);
    }
}

