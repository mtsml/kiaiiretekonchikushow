# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Kiaiiretekonchikushow（気合入れてこんちくしょう）は「Link！Like！ラブライブ！」のサークル「めぐ島」の公式サイトです。JavaScriptフレームワークを使用せず、純粋なHTML/CSS/JavaScriptで構築されています。

## 開発方針

- **フレームワーク不使用**: React、Vue等のJavaScriptフレームワークは使用しない
- **自己完結型ページ**: 各ページは `src/pages/[page]/` 配下で完結させる
- **共通部品最小化**: ページ間の依存関係を減らし、独立性を保つ
- **シンプルな構成**: ビルドプロセスなし、誰でも気軽に開発可能

## ディレクトリ構成

```
src/
├── assets/          # 画像、フォント、3Dモデル等
├── pages/
│   ├── _root/      # トップページ
│   └── [page]/     # 各ページ（独立したHTML/CSS/JS）
└── global.css      # 全ページ共通スタイル
```

## コマンド

### 開発環境起動
```bash
# ローカルでの確認（ブラウザで直接開く）
open src/pages/_root/index.html

# または任意のページを開く
open src/pages/[page]/index.html
```

### デプロイ
- masterブランチへのマージで自動デプロイ（Cloudflare）
- ビルドプロセスなし

## アーキテクチャ

### ページ構成
各ページは以下の3ファイルで構成：
- `index.html` - ページ構造
- `style.css` - ページ固有のスタイル
- `script.js` - ページ固有の動作

### 共通スタイル（global.css）
- CSS変数によるテーマ管理（ライト/ダークモード自動切替）
- 最大幅600pxのモバイルファースト設計
- 基本的なタイポグラフィとレイアウト

### 主要ページ一覧
- **ミニゲーム系**: count, draw, fire, bomber, dress, gacha, world
- **ツール系**: meggen（画像生成）, circle_profile_generator, odekake（AR/3D表示）
- **イベント系**: kanazawa_1st, tominshukai20241222, hellomeg_vote2

### 技術仕様
- **3D表示**: Google Model Viewer（odekake、android_odekake）
- **アナリティクス**: Google Analytics（gtag.js）
- **フォント**: Google Fonts（Noto Sans JP）、カスタムフォント（keifont.ttf）
- **CSSリセット**: Ress CSS

## 新規ページ追加時の注意

1. `src/pages/` に新規ディレクトリを作成
2. 必須ファイル：`index.html`、`style.css`、`script.js`
3. global.cssの共通スタイルを活用
4. ページ固有のアセットは同ディレクトリ内に配置
5. 他ページへの依存は避ける