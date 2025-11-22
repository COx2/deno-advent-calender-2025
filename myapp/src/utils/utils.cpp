#include "utils.h"

#include <iostream>
#include <sstream>

namespace myapp
{
namespace utils
{

std::string join(const std::vector<std::string>& items, const std::string& delimiter)
{
    std::ostringstream oss;
    for (size_t i = 0; i < items.size(); ++i) {
        if (i > 0) oss << delimiter;
        oss << items[i];
    }
    return oss.str();
}

void printBanner(const std::string& text)
{
    std::string border(text.length() + 4, '=');
    std::cout << border << std::endl;
    std::cout << "| " << text << " |" << std::endl;
    std::cout << border << std::endl;
}

} // namespace utils
} // namespace myapp
