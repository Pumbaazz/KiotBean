namespace KiotBean.Features.PurchaseOrders.Models;

public record CreatePurchaseOrderResponse(int Id, decimal NetWeight, decimal TotalAmount, int CashFlowId);
