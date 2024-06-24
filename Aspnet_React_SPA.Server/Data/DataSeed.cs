using Aspnet_React_SPA.Server.Models;

namespace Aspnet_React_SPA.Server.Data
{
    public class DataSeed
    {
        public static void SeedDatabase(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                var users = new List<User>();

                for (int i = 1; i <= 100; i++)
                {
                    users.Add(new User
                    {
                        UserName = $"User{i}",
                        Password = $"Password{i}"
                    });
                }

                context.Users.AddRange(users);
                context.SaveChanges();
            }
        }
    }
}
