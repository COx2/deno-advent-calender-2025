#include "core.h"

namespace myapp
{
namespace core
{

int Calculator::add(int a, int b)
{
    return a + b;
}

int Calculator::multiply(int a, int b)
{
    return a * b;
}

std::string Calculator::getVersion()
{
    return "1.0.0";
}

} // namespace core
} // namespace myapp
