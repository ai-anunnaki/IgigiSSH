# 鸬鹚SSH客户端 — 编译打包文档

## 目录

- [环境准备](#环境准备)
- [macOS 打包](#macos-打包)
- [Windows 打包](#windows-打包)
- [Linux 打包](#linux-打包)
- [跨平台打包](#跨平台打包)
- [常见问题](#常见问题)

---

## 环境准备

### 通用依赖

所有平台都需要先安装以下工具：

**1. Node.js（推荐 v18 LTS 或 v20 LTS）**

```bash
# 验证版本
node --version   # >= 18.0.0
npm --version    # >= 9.0.0
```

> 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本：
> ```bash
> nvm install 20
> nvm use 20
> ```

**2. Git**

```bash
# 克隆项目
git clone https://github.com/ai-anunnaki/LuciSSHClient.git
cd LuciSSHClient
```

**3. 安装依赖**

```bash
npm install --legacy-peer-deps
```

> 如果下载 Electron 二进制文件超时，使用国内镜像：
> ```bash
> ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" \
> npm install --legacy-peer-deps
> ```

---

## macOS 打包

### 系统要求

| 项目 | 要求 |
|------|------|
| 系统版本 | macOS 12 Monterey 或更高 |
| Xcode | 14.0+（需安装 Command Line Tools） |
| 芯片 | Intel x64 / Apple Silicon M1/M2/M3 |

### 安装 Xcode Command Line Tools

```bash
xcode-select --install
```

### 构建步骤

**1. 构建 React 前端**

```bash
CI=false npm run build:react
# 或等价：
CI=false npx react-scripts build
```

> `CI=false` 可以将 warning 不视为 error，避免构建失败

**2. 打包 macOS 应用**

```bash
# 打包为 .dmg（磁盘镜像，推荐分发）
npx electron-builder --mac dmg

# 打包为 .zip（直接解压运行）
npx electron-builder --mac zip

# 同时打包两种格式
npx electron-builder --mac
```

**3. 打包 Apple Silicon（M 系列芯片）**

```bash
# 仅打包 arm64（M 芯片原生）
npx electron-builder --mac --arm64

# 仅打包 x64（Intel，M 芯片可通过 Rosetta 2 运行）
npx electron-builder --mac --x64

# 打包通用二进制（体积较大，两种芯片均可原生运行）
npx electron-builder --mac --universal
```

**4. 一键命令**

```bash
npm run build
```

### 产物位置

```
dist/
├── 鸬鹚SSH客户端-1.0.0.dmg           # 安装包（推荐）
├── 鸬鹚SSH客户端-1.0.0-mac.zip       # 免安装版
└── mac/
    └── 鸬鹚SSH客户端.app              # 应用包
```

### 代码签名（可选，正式分发需要）

```bash
# 查看本机可用证书
security find-identity -v -p codesigning

# 在 package.json 的 build.mac 中添加：
# "identity": "Developer ID Application: Your Name (TEAM_ID)"

# 构建时自动签名
npx electron-builder --mac
```

> ⚠️ 没有签名的应用在其他 Mac 打开时会提示"无法验证开发者"，
> 用户需在「系统设置 → 隐私与安全性」中点击「仍要打开」。

---

## Windows 打包

### 系统要求

| 项目 | 要求 |
|------|------|
| 系统版本 | Windows 10 / 11 |
| Visual Studio | Build Tools 2019 或更高（用于编译原生模块） |
| Python | 3.x |

### 安装 Windows 构建工具

```powershell
# 以管理员身份运行 PowerShell

# 方式一：使用 npm 一键安装（推荐）
npm install --global windows-build-tools

# 方式二：手动安装
# 1. 下载 Visual Studio Build Tools：
#    https://visualstudio.microsoft.com/visual-cpp-build-tools/
# 2. 安装时勾选「C++ build tools」
# 3. 安装 Python：https://www.python.org/downloads/
```

### 构建步骤

**1. 重新安装依赖（确保原生模块为 Windows 版本）**

```powershell
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm install --legacy-peer-deps
```

**2. 构建 React 前端**

```powershell
$env:CI="false"
npm run dev:react  # 先确认能编译
# 正式构建：
$env:CI="false"; npx react-scripts build
```

**3. 打包 Windows 安装包**

```powershell
# 打包为 NSIS 安装包（.exe，推荐，有安装向导）
npx electron-builder --win nsis

# 打包为便携版（单文件 .exe，免安装）
npx electron-builder --win portable

# 同时打包两种
npx electron-builder --win
```

**4. 指定架构**

```powershell
# 64 位（主流，推荐）
npx electron-builder --win --x64

# 32 位（兼容老机器）
npx electron-builder --win --ia32

# ARM64（Surface Pro X 等 ARM Windows）
npx electron-builder --win --arm64
```

### 产物位置

```
dist\
├── 鸬鹚SSH客户端 Setup 1.0.0.exe    # NSIS 安装包（推荐）
└── 鸬鹚SSH客户端 1.0.0.exe          # 便携版
```

### 代码签名（可选）

```json
// package.json 的 build.win 中添加：
{
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your-password"
}
```

> ⚠️ 未签名应用在 Windows 上会触发 SmartScreen 警告，
> 用户点击「仍要运行」即可继续安装。

---

## Linux 打包

### 系统要求

| 项目 | 要求 |
|------|------|
| 发行版 | Ubuntu 20.04+ / Debian 11+ / Fedora 35+ |
| 依赖 | rpm（打 rpm 包时需要）, fakeroot |

### 安装系统依赖

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y \
  build-essential \
  libssl-dev \
  libffi-dev \
  python3 \
  fakeroot \
  rpm           # 如果需要打 RPM 包

# Fedora / CentOS
sudo dnf install -y \
  gcc-c++ \
  make \
  python3 \
  rpm-build
```

### 构建步骤

**1. 构建 React 前端**

```bash
CI=false npx react-scripts build
```

**2. 打包不同格式**

```bash
# AppImage（推荐，通用，任意发行版均可运行）
npx electron-builder --linux AppImage

# .deb（Debian / Ubuntu 系）
npx electron-builder --linux deb

# .rpm（Fedora / CentOS / RHEL 系）
npx electron-builder --linux rpm

# .tar.gz（通用压缩包）
npx electron-builder --linux tar.gz

# 同时打包全部格式
npx electron-builder --linux
```

**3. 指定架构**

```bash
# x64（主流）
npx electron-builder --linux --x64

# ARM64（树莓派 4 / ARM 服务器 / Apple Silicon Linux）
npx electron-builder --linux --arm64

# armv7l（树莓派 3 及更早）
npx electron-builder --linux --armv7l
```

### 产物位置

```
dist/
├── 鸬鹚SSH客户端-1.0.0.AppImage      # 通用包（推荐）
├── luci-ssh-client_1.0.0_amd64.deb   # Debian/Ubuntu 安装包
├── luci-ssh-client-1.0.0.x86_64.rpm  # Fedora/CentOS 安装包
└── luci-ssh-client-1.0.0.tar.gz      # 压缩包
```

### 安装产物

```bash
# AppImage（直接运行，无需安装）
chmod +x 鸬鹚SSH客户端-1.0.0.AppImage
./鸬鹚SSH客户端-1.0.0.AppImage

# .deb
sudo dpkg -i luci-ssh-client_1.0.0_amd64.deb

# .rpm
sudo rpm -i luci-ssh-client-1.0.0.x86_64.rpm
# 或
sudo dnf install luci-ssh-client-1.0.0.x86_64.rpm
```

---

## 跨平台打包

### 在 macOS 上同时打包三个平台

```bash
# 注意：Windows 和 Linux 包需要对应平台的原生模块重新编译
# macOS 上跨平台打包有一定限制，以下命令尽量覆盖

# 打包 macOS + Linux（macOS 上可以构建 Linux 包）
npx electron-builder --mac --linux

# 完整跨平台（需要 Docker 或 Wine 来处理 Windows 原生模块）
npm run build:all
```

### 使用 GitHub Actions 自动构建（推荐）

在项目根目录创建 `.github/workflows/build.yml`：

```yaml
name: Build & Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --legacy-peer-deps
      - run: CI=false npx react-scripts build
      - run: npx electron-builder --mac --universal
      - uses: actions/upload-artifact@v4
        with:
          name: macos-build
          path: dist/*.dmg

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --legacy-peer-deps
      - run: npx react-scripts build
        env:
          CI: false
      - run: npx electron-builder --win
      - uses: actions/upload-artifact@v4
        with:
          name: windows-build
          path: dist/*.exe

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --legacy-peer-deps
      - run: CI=false npx react-scripts build
      - run: npx electron-builder --linux AppImage deb
      - uses: actions/upload-artifact@v4
        with:
          name: linux-build
          path: |
            dist/*.AppImage
            dist/*.deb
```

> 推送 tag（如 `v1.0.1`）后，GitHub Actions 自动构建三平台安装包。

---

## 常见问题

### Q: `npm install` 时 Electron 下载超时

```bash
# 使用国内镜像
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" \
npm install --legacy-peer-deps
```

### Q: `node-gyp` 编译 ssh2 原生模块失败

```bash
# macOS：确保安装 Xcode Command Line Tools
xcode-select --install

# Windows：安装 windows-build-tools
npm install -g windows-build-tools

# Linux
sudo apt install build-essential python3
```

### Q: macOS 提示「无法验证开发者」

```bash
# 移除隔离属性
xattr -cr /Applications/鸬鹚SSH客户端.app

# 或在「系统设置 → 隐私与安全性」中点击「仍要打开」
```

### Q: Windows 触发 SmartScreen 警告

正常现象，未签名应用会提示。点击「更多信息 → 仍要运行」即可。

### Q: Linux AppImage 无法运行

```bash
# 添加执行权限
chmod +x *.AppImage

# 如果提示沙箱问题（常见于 Ubuntu 23.10+）
./鸬鹚SSH客户端-1.0.0.AppImage --no-sandbox
```

### Q: `react-scripts build` 报 Warning 导致失败

```bash
# 加上 CI=false 忽略 warning
CI=false npx react-scripts build
```

### Q: 打包后应用无法连接 SSH

检查 Electron `main.js` 是否被正确打包进 `resources/app/electron/`，
以及 `ssh2` 模块是否在 `dependencies`（不能在 `devDependencies`）。

---

## 版本发布流程

```bash
# 1. 更新 package.json 版本号
npm version patch   # 1.0.0 → 1.0.1
# 或
npm version minor   # 1.0.0 → 1.1.0
# 或
npm version major   # 1.0.0 → 2.0.0

# 2. 推送 tag（触发 GitHub Actions 自动构建）
git push origin master --tags

# 3. 在 GitHub Releases 页面填写更新说明
# https://github.com/ai-anunnaki/LuciSSHClient/releases/new
```

---

## 快速参考

| 平台 | 命令 | 产物 |
|------|------|------|
| macOS DMG | `npx electron-builder --mac dmg` | `.dmg` |
| macOS 通用 | `npx electron-builder --mac --universal` | `.dmg`（兼容 Intel+M 系列）|
| Windows 安装包 | `npx electron-builder --win nsis` | `.exe` |
| Windows 便携版 | `npx electron-builder --win portable` | `.exe` |
| Linux AppImage | `npx electron-builder --linux AppImage` | `.AppImage` |
| Linux DEB | `npx electron-builder --linux deb` | `.deb` |
| 全平台 | `npm run build:all` | 以上全部 |

---

*文档版本：1.0.0 · 最后更新：2026-03-18*
