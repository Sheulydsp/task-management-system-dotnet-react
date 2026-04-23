using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TaskManagementSystem.API.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (claim == null)
                throw new UnauthorizedAccessException();

            return int.Parse(claim);
        }

        protected string GetUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value
                   ?? throw new UnauthorizedAccessException("User role not found");
        }
    }
}