using System.ComponentModel.DataAnnotations.Schema;

namespace KiotBean.Database.Entities;

[Table("CashFlows")]
public class CashFlow
{
    public int Id { get; set; }
    public string FlowType { get; set; } = "CHI";
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "Tiền mặt";
    public string Category { get; set; } = "Mua cà phê";
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public CoffeePurchaseOrder? PurchaseOrder { get; set; }
}

