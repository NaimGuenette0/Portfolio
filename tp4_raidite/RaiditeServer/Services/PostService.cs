
using Microsoft.EntityFrameworkCore;
using RaiditeServer.Data;
using RaiditeServer.Models;

namespace RaiditeServer.Services
{
    public class PostService
    {
        private readonly RaiditeServerContext _context;

        public PostService(RaiditeServerContext context)
        {
            _context = context;
        }

        public async Task<Post> CreatePost(string title, Hub hub, Comment mainComment)
        {
            Post newPost = new Post()
            {
                Title = title,
                MainComment = mainComment,
                Hub = hub
            };
            _context.Post.Add(newPost);
            await _context.SaveChangesAsync();
            return newPost;
        }

        public async Task<Post?> GetPost(int id)
        {
            if (IsContextNull()) return null;
            return await _context.Post.FindAsync(id);
        }

        public async Task<Post> DeletePost(Post post)
        {
            _context.Post.Remove(post);
            await _context.SaveChangesAsync();
            return post;
        }

        private bool IsContextNull() => _context == null || _context.Post == null;

        public async Task<Post?> SavePost(User user, Post post)
        {
            if (user.SavedPosts.Contains(post))
            {
                user.SavedPosts.Remove(post);
            }
            else
            {
                user.SavedPosts.Add(post);
            }
            await _context.SaveChangesAsync();
            return post;
        }
    }
}
