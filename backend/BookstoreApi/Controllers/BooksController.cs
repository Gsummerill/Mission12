using BookstoreApi.Data;
using BookstoreApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        [FromQuery] int pageSize = 5,
        [FromQuery] int pageNum = 1,
        [FromQuery] string sortOrder = "asc",
        [FromQuery] string? category = null)
    {
        if (pageSize <= 0)
        {
            pageSize = 5;
        }

        if (pageNum <= 0)
        {
            pageNum = 1;
        }

        var query = context.Books.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(b => b.Category == category);
        }

        query = sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalBooks = await query.CountAsync();

        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            books,
            totalBooks,
            pageSize,
            pageNum
        });
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await context.Books
            .AsNoTracking()
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> AddBook([FromBody] Book newBook)
    {
        context.Books.Add(newBook);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBooks), new { id = newBook.BookId }, newBook);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
    {
        if (id != updatedBook.BookId)
        {
            return BadRequest();
        }

        var existingBook = await context.Books.FindAsync(id);
        if (existingBook == null)
        {
            return NotFound();
        }

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.Isbn = updatedBook.Isbn;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        context.Books.Remove(book);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
