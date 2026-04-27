# 如何複製搬移這個專案

## 快速方式：直接複製資料夾

1. 複製整個專案資料夾到目的地
2. 刪除以下不需要的目錄：
   - `node_modules/` — 套件，目的地重新安裝即可
   - `.next/` — 編譯快取，自動重新產生
3. 在目的地資料夾執行：

```bash
npm install
npm run dev
```

## 乾淨方式：用 git 打包

只打包 git 追蹤的檔案（自動排除 `node_modules`、`.next` 等）：

```bash
git archive --format=zip HEAD -o ../polymarket-earnings-clean.zip
```

解壓縮後進入資料夾執行：

```bash
npm install
npm run dev
```

## 哪些檔案不會被包含

由 `.gitignore` 控制，主要有：

| 路徑 | 原因 |
|------|------|
| `node_modules/` | 套件，透過 `npm install` 重新安裝 |
| `.next/` | Next.js 編譯產物 |
| `*.tsbuildinfo` | TypeScript 編譯快取 |
| `.env*` | 環境變數，含敏感資訊不應版控 |
| `docs/superpowers/` | AI 產生的計畫文件 |
