using System.ComponentModel.DataAnnotations.Schema;

namespace KiotBean.Database.Entities;

[Table("CoffeePurchaseOrders")]
public class CoffeePurchaseOrder
{
    public int Id { get; set; }
    public int TotalBags { get; set; }
    public decimal GrossWeight { get; set; }
    public decimal BagTareWeight { get; set; }
    public decimal Moisture { get; set; }
    public decimal ImpurityRate { get; set; }
    public decimal NetWeight { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalAmount { get; set; }

    public int? CashFlowId { get; set; }

    [ForeignKey(nameof(CashFlowId))]
    public CashFlow? CashFlow { get; set; }
}

