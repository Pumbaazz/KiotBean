using KiotBean.Middleware;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KiotBean.Controllers;

[ApiController]
[TypeFilter(typeof(ApiResponseFilter))]
public abstract class ApiControllerBase(IMediator mediator) : ControllerBase
{
    protected IMediator Mediator => mediator;
    protected Task<T> Send<T>(IRequest<T> request) => Mediator.Send(request);
}
