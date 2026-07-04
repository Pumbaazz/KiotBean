using FluentValidation;
using KiotBean.Features.PurchaseOrders.Models;

namespace KiotBean.Features.PurchaseOrders.Validation;

public class CreatePurchaseOrderValidator : AbstractValidator<CreatePurchaseOrderCommand>
{
    public CreatePurchaseOrderValidator()
    {
        RuleFor(x => x.TotalBags).GreaterThan(0);
        RuleFor(x => x.GrossWeight).GreaterThan(0);
        RuleFor(x => x.UnitPrice).GreaterThan(0);
        RuleFor(x => x.Moisture).InclusiveBetween(0, 100);
        RuleFor(x => x.ImpurityRate).InclusiveBetween(0, 100);
    }
}
