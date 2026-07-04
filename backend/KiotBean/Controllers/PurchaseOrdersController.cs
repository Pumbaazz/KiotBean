using KiotBean.Features.PurchaseOrders.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Controllers;

[Route("purchase-orders")]
public class PurchaseOrdersController(IMediator mediator) : ApiControllerBase(mediator)
{
    [HttpPost]
    public Task<IActionResult> Create(CreatePurchaseOrderCommand req)
        => Send(req);
}

