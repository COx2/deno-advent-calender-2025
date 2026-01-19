export interface InstallerConfig {
  /** 固定のUpgradeCode（製品ファミリーを識別するGUID） */
  upgradeCode: string;
  /** インストール先フォルダ名（Program Files配下） */
  installDir: string;
  /** 除外するファイル拡張子 */
  excludeExtensions: string[];
}

export interface BuildConfig {
  projectName: string;
  version: string;
  author: string;
  buildTypes: string[];
  installer: InstallerConfig;
}

export const config: BuildConfig = {
  projectName: "MyApp",
  version: "1.0.0",
  author: "Your Name",
  buildTypes: ["Debug", "Release"],
  installer: {
    // このGUIDは変更しないでください（アップグレードの識別に使用）
    upgradeCode: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890",
    installDir: "MyApp",
    excludeExtensions: [".pdb", ".exp", ".lib", ".obj", ".tlog", ".idb"],
  },
};
