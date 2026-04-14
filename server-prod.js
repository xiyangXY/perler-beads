const http = require('http');
const path = require('path');
const fs = require('fs');
const { parse } = require('url');

// 生产环境配置
const port = 3000;
const hostname = '127.0.0.1';

// 静态文件根目录（app 子目录）
const staticRoot = path.join(process.cwd(), 'app');

// 获取静态文件路径
function getAssetPath(filePath) {
  return path.join(staticRoot, filePath);
}

// MIME 类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // 默认返回 index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // 处理静态文件路径（从 app 子目录提供）
  const filePath = pathname.slice(1); // 移除开头的 /

  // 检查文件是否存在
  const fullPath = getAssetPath(filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // 如果是 HTML 路由（没有文件扩展名），返回 index.html
      if (!pathname.includes('.')) {
        const indexPath = getAssetPath('index.html');
        fs.readFile(indexPath, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
        return;
      }
      
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000'
    });
    res.end(data);
  });
});

// 启动服务器
server.listen(port, hostname, () => {
  console.log('='.repeat(50));
  console.log('  拼豆图纸生成器 - 本地版');
  console.log('='.repeat(50));
  console.log(`  服务地址: http://${hostname}:${port}`);
  console.log('');
  console.log('  按 Ctrl+C 停止服务');
  console.log('='.repeat(50));
  
  // 自动打开浏览器
  const { exec } = require('child_process');
  const url = `http://${hostname}:${port}`;
  
  setTimeout(() => {
    exec(`start ${url}`, (err) => {
      if (err) {
        console.log(`  请手动打开浏览器访问: ${url}`);
      }
    });
  }, 1000);
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n  正在关闭服务...');
  server.close(() => {
    console.log('  服务已停止');
    process.exit(0);
  });
});
