const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// ════════════════════════════════════════════
// YOUR 7 LOGIC APP URLS
// ════════════════════════════════════════════
const LOGIC_APPS = {
  POST_VIDEO:       'https://prod-30.germanywestcentral.logic.azure.com:443/workflows/eb420e3876224ab6b51607918f79e7f4/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ydkchJbl73pXFw5D4AjMxAFXk_es585T5Wp5Y3bp6qc',
  GET_VIDEOS:       'https://prod-24.germanywestcentral.logic.azure.com:443/workflows/e1e73bb28bbd48b49091d027025f3e6d/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ZrU5Zd6uxaaAgPk0D5ZowFeDmMrKuksyCtXAMZbNMnU',
  GET_BY_ID:        'https://prod-14.germanywestcentral.logic.azure.com:443/workflows/b4bb8816fdc04b90a23cc1f071b8f6cf/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=5sK37ppXz-asspTA3WgtVyLmARron1OEvOeZATfUBy8',
  PUT_VIDEO:        'https://prod-21.germanywestcentral.logic.azure.com:443/workflows/48a951b0fb204364bb0d057598664f7c/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ugFc8nlCTpNDW86RjYeZdwkDfrcSwFPOcG4EuB8C1o8',
  DELETE_VIDEO:     'https://prod-04.germanywestcentral.logic.azure.com:443/workflows/5e72ccfcbdb042c9b3b0ac228b9101b3/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=3WwNndU1LFhLystDESV-15V1ffX-12YbGJ_sEpYpLKo',
  POST_USER:        'https://prod-18.germanywestcentral.logic.azure.com:443/workflows/229c1a8b0b4441b4890cbbbbc34f0c97/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=XoIfP-yJre4ZF7qarPtYxD-RZdxBpe6pCbnAYzDhQ5I',
  POST_INTERACTION: 'https://prod-13.germanywestcentral.logic.azure.com:443/workflows/2dec047a8f034434bb6d550ae238ef74/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=DJnS_894mPQsTBnhc1wnpmZp4Y-lGUZMyXlqH_t_Bos'
};

// CORS headers — allow everything from localhost
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Forward a request to a Logic App URL
function forwardToLogicApp(logicAppUrl, method, body, res) {
  const parsed = new url.URL(logicAppUrl);
  const options = {
    hostname: parsed.hostname,
    port: 443,
    path: parsed.pathname + parsed.search,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body ? Buffer.byteLength(body) : 0
    }
  };

  const req = https.request(options, (logicRes) => {
    let data = '';
    logicRes.on('data', chunk => data += chunk);
    logicRes.on('end', () => {
        console.log('RESPONSE:', logicRes.statusCode, data.substring(0, 300));
      Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
      res.writeHead(logicRes.statusCode);
      res.end(data);
    });
  });

  req.on('error', (e) => {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  });

  if (body) req.write(body);
  req.end();
}

// Main server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    res.writeHead(204);
    res.end();
    return;
  }

  // Serve index.html
  if (pathname === '/' || pathname === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('index.html not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Collect request body
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {

    // ── API ROUTES ──────────────────────────────

    // GET /api/videos — get all videos
    if (pathname === '/api/videos' && method === 'GET') {
      forwardToLogicApp(LOGIC_APPS.GET_VIDEOS, 'GET', null, res);
      return;
    }

    // GET /api/videos/:id — get single video
    if (pathname.startsWith('/api/videos/') && method === 'GET') {
      const id = pathname.split('/')[3];
      const urlWithId = LOGIC_APPS.GET_BY_ID + '&id=' + id;
      forwardToLogicApp(urlWithId, 'GET', null, res);
      return;
    }

    // POST /api/videos — upload video
    if (pathname === '/api/videos' && method === 'POST') {
      forwardToLogicApp(LOGIC_APPS.POST_VIDEO, 'POST', body, res);
      return;
    }

    // PUT /api/videos — update video
    if (pathname === '/api/videos' && method === 'PUT') {
      forwardToLogicApp(LOGIC_APPS.PUT_VIDEO, 'PUT', body, res);
      return;
    }

    // DELETE /api/videos/:id — delete video
    if (pathname.startsWith('/api/videos/') && method === 'DELETE') {
      const id = pathname.split('/')[3];
      const urlWithId = LOGIC_APPS.DELETE_VIDEO + '&id=' + id;
      forwardToLogicApp(urlWithId, 'DELETE', null, res);
      return;
    }

    // POST /api/users — create user
    if (pathname === '/api/users' && method === 'POST') {
      forwardToLogicApp(LOGIC_APPS.POST_USER, 'POST', body, res);
      return;
    }

    // POST /api/interactions — record interaction
    if (pathname === '/api/interactions' && method === 'POST') {
      forwardToLogicApp(LOGIC_APPS.POST_INTERACTION, 'POST', body, res);
      return;
    }

    // 404 for unknown routes
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     Edukate Local Server Running       ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Open: http://localhost:${PORT}           ║`);
  console.log('║                                        ║');
  console.log('║  API endpoints:                        ║');
  console.log('║  GET    /api/videos                    ║');
  console.log('║  POST   /api/videos                    ║');
  console.log('║  GET    /api/videos/:id                ║');
  console.log('║  PUT    /api/videos                    ║');
  console.log('║  DELETE /api/videos/:id                ║');
  console.log('║  POST   /api/users                     ║');
  console.log('║  POST   /api/interactions              ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});
