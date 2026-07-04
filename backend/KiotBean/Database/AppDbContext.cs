using KiotBean.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace KiotBean.Database;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<CoffeePurchaseOrder> PurchaseOrders => Set<CoffeePurchaseOrder>();
    public DbSet<CashFlow> CashFlows => Set<CashFlow>();
}

