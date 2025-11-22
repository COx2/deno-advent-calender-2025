#include <iostream>
#include <vector>

#include "core/core.h"
#include "utils/utils.h"

int main()
{
    myapp::utils::printBanner("MyApp Calculator");
    
    myapp::core::Calculator calc;
    
    std::cout << "Version: " << calc.getVersion() << std::endl;
    std::cout << std::endl;
    
    std::vector<std::string> operations;
    
    int result1 = calc.add(10, 5);
    operations.push_back("10 + 5 = " + std::to_string(result1));
    
    int result2 = calc.multiply(10, 5);
    operations.push_back("10 x 5 = " + std::to_string(result2));
    
    std::cout << myapp::utils::join(operations, "\n") << std::endl;
    
    return 0;
}
