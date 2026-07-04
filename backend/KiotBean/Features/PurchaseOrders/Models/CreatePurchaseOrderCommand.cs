using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Features.PurchaseOrders.Models;

public record CreatePurchaseOrderCommand(
    int TotalBags,
    decimal GrossWeight,
    decimal BagTareWeight,
    decimal Moisture,
    decimal ImpurityRate,
    decimal UnitPrice,
    string PaymentMethod
) : IRequest<IActionResult>;
