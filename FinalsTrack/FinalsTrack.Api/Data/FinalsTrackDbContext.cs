using FinalsTrack.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Data
{
    public class FinalsTrackDbContext : DbContext
    {
        public FinalsTrackDbContext(DbContextOptions<FinalsTrackDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<UserRole> UserRoles => Set<UserRole>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            base.OnModelCreating(modelBuilder);

            }
        }
}
