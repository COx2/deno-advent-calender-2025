import $ from "jsr:@david/dax@0.42.0";
import { walk } from "jsr:@std/fs@1.0.8/walk";
import { join, normalize } from "jsr:@std/path@1.0.8";
import type {
  FileAPIIndex,
  CodeModelV2,
  TargetInfo,
  BuildArtifact,
} from "./cmake-types.ts";

/**
 * CMake File APIのクエリファイルを生成
 */
export async function setupFileAPI(buildDir: string): Promise<void> {
  const queryDir = join(buildDir, ".cmake", "api", "v1", "query");
  await $`mkdir -p ${queryDir}`;

  // codemodel-v2をリクエスト
  const queryFile = join(queryDir, "codemodel-v2");
  await Deno.writeTextFile(queryFile, "");

  console.log("✅ CMake File API query created");
}

/**
 * CMake File APIのレスポンスをパース
 */
export async function parseFileAPI(
  buildDir: string
): Promise<BuildArtifact[]> {
  const replyDir = join(buildDir, ".cmake", "api", "v1", "reply");

  // replyディレクトリの存在確認
  try {
    await Deno.stat(replyDir);
  } catch {
    throw new Error(
      `CMake File API reply directory not found: ${replyDir}\nRun cmake configure first.`
    );
  }

  // indexファイルを探す（Denoのwalkを使用）
  const indexFiles: string[] = [];
  for await (const entry of walk(replyDir, { maxDepth: 1, includeFiles: true, includeDirs: false })) {
    if (entry.name.startsWith("index-") && entry.name.endsWith(".json")) {
      indexFiles.push(entry.path);
    }
  }

  if (indexFiles.length === 0) {
    throw new Error(
      `CMake File API index file not found in ${replyDir}\nRun cmake configure first.`
    );
  }

  // 最新のindexファイルを読み込む（ファイル名でソート）
  indexFiles.sort();
  const indexPath = indexFiles[indexFiles.length - 1];
  
  console.log(`📄 Reading CMake File API: ${indexPath}`);
  
  const index: FileAPIIndex = JSON.parse(
    await Deno.readTextFile(indexPath)
  );

  // codemodel-v2を取得
  const codemodelRef = index.reply["codemodel-v2"];
  if (!codemodelRef) {
    throw new Error("codemodel-v2 not found in File API response");
  }

  const codemodelPath = join(replyDir, codemodelRef.jsonFile);
  const codemodel: CodeModelV2 = JSON.parse(
    await Deno.readTextFile(codemodelPath)
  );

  // 各ターゲットの情報を収集
  const artifacts: BuildArtifact[] = [];

  for (const config of codemodel.configurations) {
    for (const targetRef of config.targets) {
      const targetPath = join(replyDir, targetRef.jsonFile);
      const target: TargetInfo = JSON.parse(
        await Deno.readTextFile(targetPath)
      );

      // 実行ファイル、静的ライブラリ、動的ライブラリのみ
      if (
        target.type === "EXECUTABLE" ||
        target.type === "STATIC_LIBRARY" ||
        target.type === "SHARED_LIBRARY"
      ) {
        if (target.artifacts && target.artifacts.length > 0) {
          for (const artifact of target.artifacts) {
            // CMakeのパスはフォワードスラッシュを使用するため、正規化
            const artifactPath = artifact.path.replace(/\\/g, "/");
            const fullPath = normalize(join(codemodel.paths.build, artifactPath));

            artifacts.push({
              name: target.name,
              type: target.type,
              path: fullPath,
            });
          }
        }
      }
    }
  }

  return artifacts;
}

/**
 * ビルド成果物を表示
 */
export function printArtifacts(artifacts: BuildArtifact[]): void {
  console.log("\n📦 Build Artifacts:");
  console.log("─".repeat(80));

  const grouped = new Map<string, BuildArtifact[]>();

  for (const artifact of artifacts) {
    if (!grouped.has(artifact.type)) {
      grouped.set(artifact.type, []);
    }
    grouped.get(artifact.type)!.push(artifact);
  }

  for (const [type, items] of grouped) {
    console.log(`\n${type}:`);
    for (const item of items) {
      console.log(`  • ${item.name}`);
      console.log(`    ${item.path}`);
    }
  }

  console.log("\n" + "─".repeat(80));
}
