using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Data
{
    public class FinalsTrackDbContext : DbContext
    {
        public FinalsTrackDbContext(DbContextOptions<FinalsTrackDbContext> options)
            : base(options)
        {
        }

       
    }
}
