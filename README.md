# Kiaiiretekonchikushow
## これはなに？
「Link！Like！ラブライブ！」のサークル「めぐ島」の公式サイト。

## Usage

```bash
git clone git@github.com:mtsml/kiaiiretekonchikushow.git
cd kiaiiretekonchikushow
open index.html
```

## 開発ガイド
- JavaScript フレームワークは利用しない

### ディレクトリ構成
```
 ┝ .github/
 ┝ .vscode/
 ┝ src/
 │  ┝ assets/
 │  ┝ pages/
 │  │  └ [page]
 │  │    ┝ index.html
 │  │    ┝ script.js
 │  │    └ style.css
 │  ┝ global.css
 │  ┝ global.js
 │  └ index.html
 ┝ _redirects
 └ README.md
```

## デプロイ
Cloudflare でホストしている。master にマージされると自動でデプロイされる。
