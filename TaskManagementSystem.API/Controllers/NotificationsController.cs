using TaskManagementSystem.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Infrastructure.Data;
using TaskManagementSystem.Application.Interfaces;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : BaseController
{
    private readonly INotificationRepository _repo;

    public NotificationsController(INotificationRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userId = GetUserId();
        var data = await _repo.GetByUserIdAsync(userId);
        return Ok(data);
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        await _repo.MarkAsReadAsync(id);
        return Ok();
    }
}