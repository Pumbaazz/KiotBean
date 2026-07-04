using KiotBean.Database;
using KiotBean.Database.Entities;
using KiotBean.Features.PurchaseOrders.Models;
using MediatR;

namespace KiotBean.Features.PurchaseOrders;

public class CreatePurchaseOrderHandler(AppDbContext db) : IRequestHandler<CreatePurchaseOrderCommand, CreatePurchaseOrderResult>
{
    public async Task<CreatePurchaseOrderResult> Handle(CreatePurchaseOrderCommand req, CancellationToken cancellationToken)
    {
        var impurityWeight = req.GrossWeight * req.ImpurityRate / 100m;
        var moistureDeduction = req.Moisture > 15
            ? req.GrossWeight * (req.Moisture - 15) / 100m
            : 0m;
        var netWeight = req.GrossWeight - req.BagTareWeight - impurityWeight - moistureDeduction;
        var totalAmount = netWeight * req.UnitPrice;

        using var tx = await db.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var order = new CoffeePurchaseOrder
            {
                TotalBags = req.TotalBags,
                GrossWeight = req.GrossWeight,
                BagTareWeight = req.BagTareWeight,
                Moisture = req.Moisture,
                ImpurityRate = req.ImpurityRate,
                NetWeight = netWeight,
                UnitPrice = req.UnitPrice,
                TotalAmount = totalAmount
            };
            db.PurchaseOrders.Add(order);
            await db.SaveChangesAsync(cancellationToken);

            var cashFlow = new CashFlow
            {
                FlowType = "CHI",
                Amount = totalAmount,
                PaymentMethod = req.PaymentMethod,
                Category = "Mua cà phê",
                Note = $"Thanh toán {order.TotalBags} bao cà phê, KL tịnh {netWeight:F2} kg"
            };
            db.CashFlows.Add(cashFlow);
            await db.SaveChangesAsync(cancellationToken);

            order.CashFlowId = cashFlow.Id;
            await db.SaveChangesAsync(cancellationToken);

            await tx.CommitAsync(cancellationToken);

            return new CreatePurchaseOrderResult(order.Id, order.NetWeight, order.TotalAmount, cashFlow.Id);
        }
        catch
        {
            await tx.RollbackAsync(cancellationToken);
            throw;
        }
    }
}

