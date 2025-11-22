#pragma once

#include <string>

namespace myapp
{
namespace core
{

class Calculator
{
public:
    int add(int a, int b);
    int multiply(int a, int b);
    std::string getVersion();
};

} // namespace core
} // namespace myapp
