export async function onRequest(context) {
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  
  const url = new URL(context.request.url);
  
  // Set correct MIME type for JavaScript files
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
    newHeaders.set('Content-Type', 'application/javascript');
  }
  
  // Set correct MIME type for CSS files
  if (url.pathname.endsWith('.css')) {
    newHeaders.set('Content-Type', 'text/css');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}