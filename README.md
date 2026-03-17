# 鸬鹚SSH客户端 LuciSSHClient

简洁、跨平台的 SSH 客户端，支持拖拽文件传输。

## 功能特性

- 🖥️ **多会话标签页** - 同时管理多个SSH连接
- 📁 **SFTP文件管理** - 侧边栏浏览远程文件
- 🖱️ **拖拽上传** - 直接拖拽本地文件上传到服务器
- ⬇️ **一键下载** - 点击即可下载远程文件
- 🔑 **多种认证** - 支持密码和私钥认证
- 💾 **保存主机** - 常用服务器本地持久化
- 🎨 **深色主题** - 护眼的深色终端UI
- ⌨️ **全功能终端** - 基于xterm.js，支持颜色/字体/快捷键
- 🌍 **跨平台** - macOS / Windows / Linux

## 系统要求

- Node.js 18+
- macOS 12+ / Windows 10+ / Ubuntu 20+

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发模式（同时启动React和Electron）
npm run dev
```

## 打包构建

```bash
# 构建当前平台
npm run build

# 构建所有平台
npm run build:all

# 仅构建指定平台
npx electron-builder --mac
npx electron-builder --win
npx electron-builder --linux
```

构建产物在 `dist/` 目录。

## 项目结构

```
LuciSSHClient/
├── electron/
│   ├── main.js          # Electron主进程（SSH/SFTP逻辑）
│   └── preload.js       # 安全桥接层
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── components/
│   │   ├── Terminal.tsx     # xterm.js终端
│   │   ├── Sidebar.tsx      # 侧边栏（主机列表+会话）
│   │   ├── FilePanel.tsx    # SFTP文件管理面板
│   │   └── ConnectModal.tsx # 新建连接弹窗
│   └── index.css        # 全局样式
├── public/
│   └── index.html
└── package.json
```

## 使用说明

### 新建连接
1. 点击 **+ 连接** 或侧边栏的 **+**
2. 填写主机、端口、用户名和认证信息
3. 选择是否保存到主机列表
4. 点击连接

### 文件管理
1. 连接成功后，点击工具栏 **📁 文件** 开启文件面板
2. 双击目录进入，点击 **←** 返回上级

### 拖拽上传
- 将本地文件**拖拽**到文件面板即可上传到当前目录

### 下载文件
- 点击文件列表中的 **⬇** 按钮，选择本地保存目录

## Bundle ID

`org.igigi.lucisshclient`

## 许可证

MIT License © 2026 Igigi

## 联系方式

- GitHub: https://github.com/ai-anunnaki/LuciSSHClient
- Website: https://igigi.org
