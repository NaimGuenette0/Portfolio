
using Microsoft.AspNetCore.Http.HttpResults;
using RaiditeServer.Data;
using RaiditeServer.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace RaiditeServer.Services
{
    public class PictureService
    {
        private readonly RaiditeServerContext _context;

        public PictureService(RaiditeServerContext context)
        {
            _context = context;
        }

        private bool IsContextNull() => _context == null || _context.Picture == null;

        public async Task<Picture?> GetPicture(int id)
        {
            if (IsContextNull()) return null;

            return await _context.Picture.FindAsync(id);
        }
        public async Task<List<Picture>> CreatePicture(IFormCollection formCollection, Comment comment)

        {

            List<Picture> pictures = new List<Picture>();

            foreach (IFormFile f in formCollection.Files)

            {

                Image image = Image.Load(f.OpenReadStream());

                Picture pic = new Picture

                {

                    Id = 0,

                    FileName = Guid.NewGuid().ToString() + Path.GetExtension(f.FileName),

                    MimeType = f.ContentType,

                    Comment = comment

                };

                pictures.Add(pic);

                _context.Picture.Add(pic);

                image.Save(Directory.GetCurrentDirectory() + "/images/full/" + pic.FileName);

                image.Mutate(i => i.Resize(

                    new ResizeOptions() { Mode = ResizeMode.Min, Size = new Size() { Height = 100 } }));
                image.Save(Directory.GetCurrentDirectory() + "/images/thumbnail/" + pic.FileName); 
            }

            await _context.SaveChangesAsync();

            return pictures;

        }
        public async Task DeletePicture(Picture picture)
        {
            System.IO.File.Delete(Directory.GetCurrentDirectory() + "/images/full/" + picture.FileName);
            System.IO.File.Delete(Directory.GetCurrentDirectory() + "/images/thumbnail/" + picture.FileName);
            _context.Picture.Remove(picture);
            await _context.SaveChangesAsync();
        }

    }
}

