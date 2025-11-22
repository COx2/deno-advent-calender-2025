/**
 * CMake File API v1のレスポンス型定義
 */
export interface FileAPIIndex {
  cmake: {
    version: {
      string: string;
      major: number;
      minor: number;
      patch: number;
    };
  };
  objects: Array<{
    kind: string;
    version: { major: number; minor: number };
    jsonFile: string;
  }>;
  reply: {
    [key: string]: {
      kind: string;
      version: { major: number; minor: number };
      jsonFile: string;
    };
  };
}

export interface CodeModelV2 {
  version: { major: number; minor: number };
  paths: {
    source: string;
    build: string;
  };
  configurations: Array<{
    name: string;
    targets: Array<{
      name: string;
      id: string;
      type: string;
      jsonFile: string;
    }>;
  }>;
}

export interface TargetInfo {
  name: string;
  type: "EXECUTABLE" | "STATIC_LIBRARY" | "SHARED_LIBRARY" | "MODULE_LIBRARY" | "OBJECT_LIBRARY";
  artifacts?: Array<{
    path: string;
  }>;
  nameOnDisk?: string;
  sources?: Array<{
    path: string;
  }>;
  dependencies?: Array<{
    id: string;
  }>;
}

export interface BuildArtifact {
  name: string;
  type: string;
  path: string;
}
