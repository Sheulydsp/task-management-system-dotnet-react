using System.Net;
using System.Text.Json;
using TaskManagementSystem.Application.Common.Exceptions;

namespace TaskManagementSystem.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            // ✅ Allow preflight requests
            if (context.Request.Method == "OPTIONS")
            {
                context.Response.StatusCode = 200;
                return;
            }

            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }

        private static Task HandleException(HttpContext context, Exception ex)
        {
            HttpStatusCode status;
            string message = ex.Message;

            switch (ex)
            {
                case NotFoundException:
                    status = HttpStatusCode.NotFound;
                    break;

                case BadRequestException:
                    status = HttpStatusCode.BadRequest;
                    break;

                case UnauthorizedException:
                    status = HttpStatusCode.Unauthorized;
                    break;

                default:
                    status = HttpStatusCode.InternalServerError;
                    message = "Something went wrong";
                    break;
            }

            var response = new
            {
                status = (int)status,
                message = message
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)status;

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
