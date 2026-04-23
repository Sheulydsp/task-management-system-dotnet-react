using TaskManagementSystem.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Infrastructure.Data;
using TaskManagementSystem.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class UsersController : BaseController
{
    private readonly AppDbContext _context;
    private readonly IUserService _userService;

    public UsersController(AppDbContext context, IUserService userService)
    {
        _context = context;
        _userService = userService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = GetUserId();

        var result = await _userService.UpdateProfileAsync(userId, dto);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = GetUserId();

        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Name,
                u.Email,
                u.Role,
                u.ProfileImageUrl // ✅ MUST be here
            })
            .FirstOrDefaultAsync();

        return Ok(user);
    }

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/uploads/{fileName}";

        return Ok(imageUrl);
    }

    [Authorize]
    [HttpPut("profile-image")]
    public async Task<IActionResult> UpdateProfileImage(UpdateProfileImageDto dto)
    {
        var userId = GetUserId();

        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return NotFound();

        user.ProfileImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();

        return Ok();
    }


}