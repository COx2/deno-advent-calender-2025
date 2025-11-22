# deno-advent-calender-2025

This is an example of C++ build system using Deno, dax, and CMake for type-safe, cross-platform build automation

## Overview

This project demonstrates a modern approach to C++ build automation:

- **C++17** standard library and language features
- **CMake** for cross-platform build configuration
- **Deno + dax** for type-safe, cross-platform build scripts
- **CMake File API** for programmatic access to build information

## Project Structure

```
myapp/
├── src/
│   ├── main.cpp           # Main application
│   ├── core/              # Static library (myapp_core)
│   │   ├── core.h
│   │   └── core.cpp
│   └── utils/             # Shared library (myapp_utils)
│       ├── utils.h
│       └── utils.cpp
├── CMakeLists.txt         # CMake configuration
├── build.ts               # Main build script
├── build.config.ts        # Build configuration
├── cmake-file-api.ts      # CMake File API integration
├── cmake-types.ts         # TypeScript type definitions
└── deno.json              # Deno tasks configuration
```

## Prerequisites

- [Deno](https://deno.land/) 1.x or later
- CMake 3.15 or later
- A C++17 compatible compiler (GCC, Clang, MSVC)

### Installing Deno

**macOS/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows:**
```powershell
irm https://deno.land/install.ps1 | iex
```

### Installing CMake

**macOS:**
```bash
brew install cmake
```

**Ubuntu/Debian:**
```bash
sudo apt-get install cmake
```

**Windows:**
Download from [cmake.org](https://cmake.org/download/)

## Quick Start

### Build the project

```bash
# Move current directory to myapp
cd myapp

# Using deno task
deno task build

# Or directly
deno run --allow-all build.ts
```

### Run the application

```bash
# Windows (Visual Studio - Release)
.\build\Release\myapp.exe

# Windows (Visual Studio - Debug)
.\build\Debug\myapp.exe

# macOS/Linux
./build/bin/myapp
```

**Output:**
```
====================
| MyApp Calculator |
====================
Version: 1.0.0

10 + 5 = 15
10 × 5 = 50
```

**Note for Windows users:** When using Visual Studio generator, the executable and DLL are placed in the same directory (`build/Release/` or `build/Debug/`), so the DLL is automatically found. If you move the executable, make sure to copy `myapp_utils.dll` along with it.

## Available Commands

### Build Commands

```bash
deno task build          # Build (Release mode)
deno task build:debug    # Build (Debug mode)
deno task build:release  # Build (Release mode)
deno task clean          # Clean build directory
deno task rebuild        # Clean + Build (Release)
deno task test           # Build + Run application
```

### Development Commands

```bash
deno task format         # Format TypeScript files
deno task format:check   # Check formatting
deno task lint           # Lint TypeScript files
```

## Build Script Options

You can also run the build script directly with options:

```bash
# Clean build directory
deno run --allow-all ./build.ts --clean

# Debug build
deno run --allow-all ./build.ts --config Debug

# Build and run tests
deno run --allow-all ./build.ts --test

# Use Ninja generator (if installed)
deno run --allow-all ./build.ts --generator Ninja
```

**Note for Windows users:** The default generator is "Visual Studio 17 2022". If you have Ninja installed, you can use it with `--generator Ninja` for faster builds.

## What Gets Built

The project builds three targets:

1. **myapp_core** (Static Library)
   - Core calculator functionality
   - Windows: `build/Release/myapp_core.lib` or `build/Debug/myapp_core.lib`
   - Unix: `build/lib/libmyapp_core.a`

2. **myapp_utils** (Shared Library)
   - Utility functions (string joining, banner printing)
   - Windows: `build/Release/myapp_utils.dll` or `build/Debug/myapp_utils.dll`
   - Unix: `build/lib/libmyapp_utils.so` (Linux) or `libmyapp_utils.dylib` (macOS)

3. **myapp** (Executable)
   - Main application using both libraries
   - Windows: `build/Release/myapp.exe` or `build/Debug/myapp.exe`
   - Unix: `build/bin/myapp`

**Build Directory Structure:**

Windows (Visual Studio):
```
build/
├── Release/              # Release build artifacts
│   ├── myapp.exe
│   ├── myapp_core.lib
│   ├── myapp_utils.dll
│   ├── myapp_utils.lib   # Import library
│   └── myapp_utils.exp   # Export file
└── Debug/                # Debug build artifacts
    └── ...
```

macOS/Linux (Unix Makefiles):
```
build/
├── bin/                  # Executables
│   └── myapp
└── lib/                  # Libraries
    ├── libmyapp_core.a
    └── libmyapp_utils.so (or .dylib)
```

**Note:** When using Visual Studio generator on Windows, all build artifacts are placed directly in the `Release/` or `Debug/` directory. When using Unix Makefiles or Ninja, artifacts are organized into `bin/` and `lib/` subdirectories.

## Features

### Type-Safe Build Scripts

All build scripts are written in TypeScript with full type checking:

```typescript
interface BuildConfig {
  projectName: string;
  version: string;
  author: string;
  buildTypes: string[];
}
```

### CMake File API Integration

The build system uses CMake File API to automatically detect build artifacts:

- No hardcoded paths
- Automatic discovery of executables and libraries
- Type-safe access to build information

### Cross-Platform

The same build scripts work on:
- macOS (tested on Apple Silicon)
- Linux (tested on Ubuntu 20.04+)
- Windows (tested on Windows 10+)

## Development

### Modifying the Build Configuration

Edit `build.config.ts` to change project settings:

```typescript
export const config: BuildConfig = {
  projectName: "MyApp",
  version: "1.0.0",
  author: "Your Name",
  buildTypes: ["Debug", "Release"],
};
```

### Adding New Build Tasks

Edit `deno.json` to add custom tasks:

```json
{
  "tasks": {
    "my-task": "deno run --allow-all build.ts --custom-flag"
  }
}
```

## Troubleshooting

### CMake not found

Make sure CMake is installed and in your PATH:

```bash
cmake --version
```

### Deno permission errors

The build script requires full permissions. If you see permission errors, run:

```bash
deno run --allow-all build.ts
```

### Build errors

Clean the build directory and try again:

```bash
deno task clean
deno task build
```

### Cannot find executable or libraries

The location of build artifacts depends on the CMake generator:

**Visual Studio (Windows default):**
- Artifacts in `build/Release/` or `build/Debug/`
- Example: `build/Release/myapp.exe`

**Unix Makefiles / Ninja:**
- Executables in `build/bin/`
- Libraries in `build/lib/`
- Example: `build/bin/myapp`

Check the CMake File API output in the build log to see exact paths.

## License

MIT License - feel free to use this project as a template for your own C++ projects.

## Related Articles

This project was created as a companion to the article:  
"DenoとdaxでC++/CMakeプロジェクトの開発を支援する話" (Deno Advent Calendar 2025)
