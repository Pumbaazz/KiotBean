namespace KiotBean.Features.PurchaseOrders.Models;

public record CreatePurchaseOrderResult(int Id, decimal NetWeight, decimal TotalAmount, int CashFlowId);
