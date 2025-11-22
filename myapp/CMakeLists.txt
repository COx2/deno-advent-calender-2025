cmake_minimum_required(VERSION 3.15)
project(MyApp VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# 静的ライブラリ: myapp_core
add_library(myapp_core STATIC
    src/core/core.cpp
    src/core/core.h
)
target_include_directories(myapp_core PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

# 動的ライブラリ: myapp_utils
add_library(myapp_utils SHARED
    src/utils/utils.cpp
    src/utils/utils.h
)
target_include_directories(myapp_utils PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)
target_compile_definitions(myapp_utils PRIVATE MYAPP_UTILS_EXPORTS)

# 実行ファイル: myapp
add_executable(myapp
    src/main.cpp
)
target_link_libraries(myapp PRIVATE
    myapp_core
    myapp_utils
)
