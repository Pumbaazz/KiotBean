using MediatR;
namespace KiotBean.Features.Prices.Models;

// Mock notification
public record PriceChangedNotification(double NewPrice) : INotification;
