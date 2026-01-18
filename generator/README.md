# C++/CMake Project Generator

Deno URL実行でリモートからC++/CMakeプロジェクトをローカルに生成するジェネレーターです。

## 使い方

### リモートURLからの実行

GitHubにホストした場合、以下のコマンドでプロジェクトを生成できます：

```bash
# 基本的な使用方法
deno run --allow-read --allow-write --allow-run \
  https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/generator/generate.ts

# オプション付き
deno run --allow-read --allow-write --allow-run \
  https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/generator/generate.ts \
  --name "MyProject" \
  --author "Your Name" \
  --version "1.0.0" \
  --output ./my-project \
  --with-git
```

### ローカルでの実行

```bash
cd generator
deno run --allow-read --allow-write --allow-run generate.ts --name "TestProject"
```

## オプション

| オプション | 短縮形 | デフォルト | 説明 |
|-----------|--------|-----------|------|
| `--name` | `-n` | `MyApp` | プロジェクト名 |
| `--author` | `-a` | `Your Name` | 作者名 |
| `--version` | `-v` | `1.0.0` | バージョン |
| `--output` | `-o` | (プロジェクト名) | 出力ディレクトリ |
| `--with-git` | - | false | Gitリポジトリを初期化 |
| `--help` | `-h` | - | ヘルプを表示 |

## 生成されるプロジェクト構造

```
<project-name>/
├── CMakeLists.txt          # CMake設定
├── deno.json               # Denoタスク設定
├── build.ts                # ビルドスクリプト
├── build.config.ts         # ビルド設定
├── cmake-file-api.ts       # CMake File API統合
├── cmake-types.ts          # TypeScript型定義
├── .gitignore
└── src/
    ├── main.cpp            # メインエントリーポイント
    ├── core/
    │   ├── core.h          # 静的ライブラリヘッダー
    │   └── core.cpp        # 静的ライブラリ実装
    └── utils/
        ├── utils.h         # 動的ライブラリヘッダー
        └── utils.cpp       # 動的ライブラリ実装
```

## 生成後のワークフロー

```bash
cd <project-name>

# ビルド
deno task build              # Releaseモードでビルド
deno task build:debug        # Debugモードでビルド

# クリーン
deno task clean              # ビルドディレクトリを削除
deno task rebuild            # クリーンして再ビルド

# テスト
deno task test               # ビルドして実行ファイルを実行

# フォーマット＆リント
deno task format             # TypeScriptファイルをフォーマット
deno task lint               # リント検査
```

## 必要条件

- [Deno](https://deno.land/) v1.40以上
- [CMake](https://cmake.org/) 3.15以上
- C++17対応コンパイラ
  - Windows: Visual Studio 2022
  - macOS: Xcode Command Line Tools
  - Linux: GCC 8+ または Clang 8+

## カスタマイズ

生成されたプロジェクトは以下のようにカスタマイズできます：

1. **CMakeLists.txt**: ライブラリの追加、依存関係の設定
2. **build.config.ts**: プロジェクトメタデータの変更
3. **src/**: C++ソースコードの追加・変更

## GitHub Rawでのホスティング

1. このリポジトリをフォークまたはクローン
2. `generator/` ディレクトリをGitHubにプッシュ
3. Raw URLを使用してアクセス：
   ```
   https://raw.githubusercontent.com/<user>/<repo>/<branch>/generator/generate.ts
   ```

## ライセンス

MIT License
