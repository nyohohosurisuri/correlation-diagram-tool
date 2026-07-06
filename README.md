# 相関図作成ツール

人物、グループ、関係線、文章、図形、画像を配置できる相関図作成ツールです。

## GitHub Pages / iPhone PWA

GitHub Pages に公開すると、iPhone の Safari から「ホーム画面に追加」してオフラインアプリとして使えます。

1. GitHub Pages の URL を iPhone の Safari で開く。
2. 共有ボタンから「ホーム画面に追加」を選ぶ。
3. 追加したアイコンから起動する。
4. 一度開いた後は、通信なしでも基本機能を使えます。

GitHub Pages 版では PC 保存サーバーを使いません。作業データの移動やバックアップは、ツール内の「保存」から JSON ファイルを書き出し、「読込」から JSON ファイルを読み込んでください。

## 公開するファイル

GitHub Pages のリポジトリには、少なくとも次のファイルを置いてください。

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `service-worker.js`
- `pwa-icon.svg`
- `pwa-icon-192.png`
- `pwa-icon-512.png`
- `.nojekyll`

`data/`、`ngrok-*.log`、`ngrok-runtime.yml` は公開しないでください。
