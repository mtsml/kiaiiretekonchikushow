# Kiaiiretekonchikushow
## これはなに？
「Link！Like！ラブライブ！」のサークル「めぐ島」の公式サイト。

## 開発ガイド

### 方針
誰でも気軽に開発をおこなえるようにする。

- JavaScript フレームワークは利用しない
- 共通部品は減らし基本的に [page] 配下で完結させる

### ディレクトリ構成
```
 ├ .github/
 ├ .vscode/
 ├ src/
 │  ├ assets/
 │  ├ pages/
 │  │  ├ _root/
 │  │  │ ├ index.html
 │  │  │ ├ script.js
 │  │  │ └ style.css
 │  │  └ [page]/
 │  │    ├ index.html
 │  │    ├ script.js
 │  │    └ style.css
 │  ├ global.css
 ├ _redirects
 └ README.md
```
[pages] 内に各ページで必要なコードを配置する。

### 起動

```bash
git clone git@github.com:mtsml/kiaiiretekonchikushow.git
cd kiaiiretekonchikushow
open src/pages/_root/index.html
```

## デプロイ
Cloudflare でホストしている。master にマージされると自動でデプロイされる。
