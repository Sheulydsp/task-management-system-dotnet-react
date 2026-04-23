using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using TaskManagementSystem.Application.Interfaces;


namespace TaskManagementSystem.Application.Services
{
        public class CurrentUserService : ICurrentUserService
        {
            private readonly IHttpContextAccessor _httpContext;

            public CurrentUserService(IHttpContextAccessor httpContext)
            {
                _httpContext = httpContext;
            }

            public int UserId =>
                int.Parse(_httpContext.HttpContext.User
                    .FindFirst(ClaimTypes.NameIdentifier).Value);

            public string Role =>
                _httpContext.HttpContext.User
                    .FindFirst(ClaimTypes.Role).Value;
        }
}