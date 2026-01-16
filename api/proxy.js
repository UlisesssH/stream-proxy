export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Obtener la ruta del query parameter
  const path = req.url.replace('/api/proxy?path=', '').replace('/api/proxy/', '');
  const targetUrl = `http://190.108.83.142:8000/${path}`;
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Server responded with ${response.status}`,
        url: targetUrl 
      });
    }
    
    const contentType = response.headers.get('Content-Type');
    const data = await response.arrayBuffer();
    
    res.setHeader('Content-Type', contentType || 'application/vnd.apple.mpegurl');
    res.send(Buffer.from(data));
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      targetUrl: targetUrl 
    });
  }
}

