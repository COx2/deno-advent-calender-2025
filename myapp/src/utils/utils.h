#pragma once

#include <string>
#include <vector>

// Export macfro for Windows DLL
#ifdef _WIN32
    #ifdef MYAPP_UTILS_EXPORTS
        #define MYAPP_UTILS_API __declspec(dllexport)
    #else
        #define MYAPP_UTILS_API __declspec(dllimport)
    #endif
#else
    #define MYAPP_UTILS_API
#endif

namespace myapp
{
namespace utils
{

MYAPP_UTILS_API std::string join(const std::vector<std::string>& items, const std::string& delimiter);
MYAPP_UTILS_API void printBanner(const std::string& text);

} // namespace utils
} // namespace myapp
