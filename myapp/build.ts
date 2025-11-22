#!/usr/bin/env -S deno run --allow-all

import $ from "jsr:@david/dax@0.42.0";
import { parseArgs } from "jsr:@std/cli@1.0.6/parse-args";
import { config } from "./build.config.ts";
import {
  setupFileAPI,
  parseFileAPI,
  printArtifacts,
} from "./cmake-file-api.ts";
import type { BuildArtifact } from "./cmake-types.ts";

// コマンドライン引数のパース
const args = parseArgs(Deno.args, {
  boolean: ["clean", "test"],
  string: ["config", "generator"],
  default: {
    config: "Release",
    generator: Deno.build.os === "windows" ? "Visual Studio 17 2022" : "Unix Makefiles",
  },
});

async function clean(): Promise<void> {
  console.log("🧹 Cleaning build directory...");
  await $`rm -rf build dist`;
}

async function configure(): Promise<void> {
  console.log("⚙️  Configuring CMake...");

  await $`mkdir -p build`;

  // File APIのクエリをセットアップ
  await setupFileAPI("build");

  // CMake設定を実行
  await $`cmake -B build -DCMAKE_BUILD_TYPE=${args.config} -G ${args.generator}`;
}

async function build(): Promise<BuildArtifact[]> {
  console.log("🔨 Building project...");

  // Windowsとそれ以外でコマンドを分ける
  if (Deno.build.os === "windows") {
    await $`cmake --build build --config ${args.config}`;
  } else {
    await $`cmake --build build --config ${args.config} --parallel`;
  }

  // ビルド成果物を自動検出
  const artifacts = await parseFileAPI("build");
  printArtifacts(artifacts);

  return artifacts;
}

async function runTests(artifacts: BuildArtifact[]): Promise<void> {
  console.log("🧪 Running tests...");

  // ビルド設定に一致する実行ファイルを優先的に探す
  // （MSVCのマルチコンフィグビルドでDebug/Releaseを区別するため）
  let executable = artifacts.find(
    (a) => a.type === "EXECUTABLE" && a.path.includes(args.config)
  );

  // 見つからない場合は、任意の実行ファイルを使用
  if (!executable) {
    executable = artifacts.find((a) => a.type === "EXECUTABLE");
  }

  if (!executable) {
    console.log("⚠️  No executable found to test");
    return;
  }

  console.log(`   Executing: ${executable.path}`);

  // 実行ファイルを実行してテスト
  await $`${executable.path}`;
}

// メイン処理
async function main(): Promise<void> {
  try {
    console.log(`🚀 Building ${config.projectName} v${config.version}`);
    console.log(`   Configuration: ${args.config}`);
    console.log(`   Platform: ${Deno.build.os}`);
    console.log("");

    if (args.clean) {
      await clean();
      Deno.exit(0);
    }

    await configure();
    const artifacts = await build();

    if (args.test) {
      await runTests(artifacts);
    }

    console.log("\n✅ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    Deno.exit(1);
  }
}

await main();
