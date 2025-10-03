import { renderHtml } from "./renderHtml";

export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      // Parse form data
      const formData = await request.formData();
      const author = formData.get("author");
      const content = formData.get("content");

      // Validate input
      if (!author || !content) {
        return new Response("Missing author or content", { status: 400 });
      }

      // Prepare and execute INSERT statement
      const stmt = env.DB.prepare("INSERT INTO comments (author, content) VALUES (?, ?)");
      await stmt.bind(author, content).run();

      // Redirect back to the main page to show updated comments
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }

    // Existing GET request to display comments
    const stmt = env.DB.prepare("SELECT * FROM comments");
    const { results } = await stmt.all();

    return new Response(renderHtml(JSON.stringify(results, null, 2)), {
      headers: {
        "content-type": "text/html",
      },
    });
  },
} satisfies ExportedHandler<Env>;