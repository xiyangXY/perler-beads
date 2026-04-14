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

// 查找 Node.js 安装包
function findNodeInstaller() {
  const rootDir = path.join(__dirname, '..');
  const files = fs.readdirSync(rootDir);
  const nodeInstaller = files.find(f => f.match(/^node-v.*-x64\.msi$/));
  if (nodeInstaller) {
    return path.join(rootDir, nodeInstaller);
  }
  return null;
}

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

// 查找并复制 Node.js 安装包
const nodeInstallerPath = findNodeInstaller();
let nodeInstallerName = null;
if (nodeInstallerPath) {
  nodeInstallerName = path.basename(nodeInstallerPath);
  const destPath = path.join(distDir, nodeInstallerName);
  console.log(`复制: ${nodeInstallerName} -> ${destPath}`);
  copyRecursive(nodeInstallerPath, destPath);
} else {
  console.warn('警告: 未找到 Node.js 安装包 (node-v*-x64.msi)');
}

// 创建 README 文件
const readmeContent = `# 拼豆图纸生成器 - 本地版

## 首次使用安装步骤

### 1. 安装 Node.js
如果电脑未安装 Node.js，请运行目录中的 Node.js 安装包：
${nodeInstallerName ? `- ${nodeInstallerName}` : '- node-v22.x.x-x64.msi（请从官网下载）'}

安装步骤：
1. 双击 MSI 文件
2. 点击 "Next" 接受许可协议
3. 点击 "Next" 使用默认安装路径
4. 点击 "Next" 选择默认组件
5. 点击 "Install" 开始安装
6. 安装完成后点击 "Finish"

### 2. 验证安装
打开命令提示符（CMD），输入：
\`\`\`
node --version
\`\`\`
如果显示版本号（如 v22.21.1），说明安装成功。

## 目录结构

- app/              # 应用程序文件
- server-prod.js    # 服务器脚本
- start.bat         # 一键启动脚本
${nodeInstallerName ? `- ${nodeInstallerName}  # Node.js 安装包` : ''}

## 启动方式

### 一键启动（推荐）
双击运行 \`start.bat\`，服务将自动启动并打开浏览器。

### 命令行启动
\`\`\`bash
node server-prod.js
\`\`\`

## 访问地址

服务启动后，在浏览器中访问：
http://127.0.0.1:3000

## 停止服务

按 Ctrl+C 停止服务，窗口将自动关闭。

## 系统要求

- Windows 7 或更高版本
- Node.js 18+

## 常见问题

**Q: 双击 start.bat 后闪退**
A: 说明未安装 Node.js，请先安装 Node.js 安装包。

**Q: 提示 "node 不是内部或外部命令"**
A: Node.js 安装后未正确配置环境变量，请重新安装并勾选 "Add to PATH" 选项。
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
if (nodeInstallerName) {
  console.log(`      ├── ${nodeInstallerName}  # Node.js 安装包`);
}
console.log('      └── README.txt');
console.log('');
console.log('  使用方式:');
console.log('  1. 将 dist 目录复制到目标机器');
console.log('  2. 确保目标机器已安装 Node.js 18+');
console.log('  3. 双击 start.bat 启动服务');
console.log('============================================');
