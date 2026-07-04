using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KiotBean.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CashFlows",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FlowType = table.Column<string>(type: "text", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CashFlows", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CoffeePurchaseOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TotalBags = table.Column<int>(type: "integer", nullable: false),
                    GrossWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    BagTareWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    Moisture = table.Column<decimal>(type: "numeric", nullable: false),
                    ImpurityRate = table.Column<decimal>(type: "numeric", nullable: false),
                    NetWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    CashFlowId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoffeePurchaseOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoffeePurchaseOrders_CashFlows_CashFlowId",
                        column: x => x.CashFlowId,
                        principalTable: "CashFlows",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoffeePurchaseOrders_CashFlowId",
                table: "CoffeePurchaseOrders",
                column: "CashFlowId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoffeePurchaseOrders");

            migrationBuilder.DropTable(
                name: "CashFlows");
        }
    }
}
