export async function onRequest(context) {
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  
  const url = new URL(context.request.url);
  const pathname = url.pathname.toLowerCase();
  
  // Force correct MIME types for all JavaScript files
  if (pathname.endsWith('.js') || pathname.endsWith('.mjs') || pathname.includes('/assets/') && pathname.match(/\.(js|mjs)$/)) {
    newHeaders.set('Content-Type', 'application/javascript; charset=utf-8');
    newHeaders.delete('X-Content-Type-Options');
  }
  
  // Force correct MIME type for all CSS files
  if (pathname.endsWith('.css') || pathname.includes('/assets/') && pathname.endsWith('.css')) {
    newHeaders.set('Content-Type', 'text/css; charset=utf-8');
    newHeaders.delete('X-Content-Type-Options');
  }
  
  // Add security headers
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}