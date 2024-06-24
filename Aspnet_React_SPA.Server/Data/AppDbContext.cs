using Aspnet_React_SPA.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Aspnet_React_SPA.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
