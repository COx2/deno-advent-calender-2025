export interface BuildConfig {
  projectName: string;
  version: string;
  author: string;
  buildTypes: string[];
}

export const config: BuildConfig = {
  projectName: "MyApp",
  version: "1.0.0",
  author: "Your Name",
  buildTypes: ["Debug", "Release"],
};
