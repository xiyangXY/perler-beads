const fs = require('fs');
const path = require('path');

// dist 目录结构：
// dist/
//   ├── app/          # Next.js 构建输出
//   ├── server-prod.js
//   ├── start.bat
//   └── README.txt
const distDir = path.join(__dirname, '..', 'dist');
const appDir = path.join(distDir, 'app');

// 需要复制到 dist 根目录的文件
const itemsToCopy = [
  { src: 'server-prod.js', dest: path.join(distDir, 'server-prod.js') },
  { src: 'start.bat', dest: path.join(distDir, 'start.bat') }
];

// 复制函数
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`警告: ${src} 不存在，跳过`);
    return;
  }

  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 执行复制
console.log('正在准备发布包...');

// 确保 dist 目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制启动文件到 dist 根目录
for (const item of itemsToCopy) {
  console.log(`复制: ${item.src} -> ${item.dest}`);
  copyRecursive(item.src, item.dest);
}

// 创建 README 文件
const readmeContent = `# 拼豆图纸生成器 - 本地版

## 目录结构

- app/          # 应用程序文件
- server-prod.js # 服务器脚本
- start.bat     # 一键启动脚本

## 启动方式

### 方式一：一键启动（推荐）
双击运行 \`start.bat\`，服务将自动启动并打开浏览器。

### 方式二：命令行启动
\`\`\`bash
node server-prod.js
\`\`\`

## 访问地址

服务启动后，在浏览器中访问：
http://127.0.0.1:3000

## 停止服务

在命令行窗口中按 Ctrl+C 即可停止服务。

## 系统要求

- Windows 7 或更高版本
- Node.js 18+
`;

fs.writeFileSync(path.join(distDir, 'README.txt'), readmeContent);

console.log('');
console.log('============================================');
console.log('  发布包准备完成！');
console.log('============================================');
console.log(`  输出目录: ${distDir}`);
console.log('');
console.log('  目录结构:');
console.log('    dist/');
console.log('      ├── app/          # 应用程序');
console.log('      ├── server-prod.js');
console.log('      ├── start.bat');
console.log('      └── README.txt');
console.log('');
console.log('  使用方式:');
console.log('  1. 将 dist 目录复制到目标机器');
console.log('  2. 确保目标机器已安装 Node.js 18+');
console.log('  3. 双击 start.bat 启动服务');
console.log('============================================');
