using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RaiditeServer.Models;
using SixLabors.ImageSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RaiditeServer.Data
{
    public class RaiditeServerContext : IdentityDbContext<User>
    {
        public RaiditeServerContext (DbContextOptions<RaiditeServerContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Deux utilisateurs 
            PasswordHasher<User> hasher = new PasswordHasher<User>();

            User u1 = new User
            {
                Id = "11111111-1111-1111-1111-111111111111", UserName = "bob", Email = "b@b.b", 
                NormalizedUserName = "BOB", NormalizedEmail = "B@B.B"
            };
            User u2 = new User
            {
                Id = "11111111-1111-1111-1111-111111111112", UserName = "tom", Email = "t@t.t", 
                NormalizedUserName = "TOM", NormalizedEmail = "T@T.T"
            };

            u1.PasswordHash = hasher.HashPassword(u1, "allo");
            u2.PasswordHash = hasher.HashPassword(u2, "allo");

            builder.Entity<User>().HasData(u1, u2);
            builder.Entity<IdentityRole>().HasData(
              new IdentityRole
               {
                 Id = "11111111-1111-1111-1111-111111111113",
                 Name = "Moderator",
                 NormalizedName = "MODERATOR"
               },
              new IdentityRole
              {
                  Id= "11111111-1111-1111-1111-111111111114",
                  Name = "Administrateur",
                  NormalizedName = "ADMINISTRATEUR"
              });
            builder.Entity<IdentityUserRole<string>>().HasData(
              new IdentityUserRole<string>
               {
                 UserId = u2.Id,
                 RoleId = "11111111-1111-1111-1111-111111111113"
              },
              new IdentityUserRole<string>
              {
                  UserId = u1.Id,
                  RoleId = "11111111-1111-1111-1111-111111111114"
              }
              );
        }

        public DbSet<Hub> Hub { get; set; } = default!;
        public DbSet<Comment> Comment { get; set; } = default!;
        public DbSet<Picture> Picture { get; set; } = default!;
        public DbSet<Post> Post { get; set; } = default!;
    }
}
