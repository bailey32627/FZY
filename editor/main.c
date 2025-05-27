#include "engine.h"

int main() {
  char str[64] = "Hello from Editor\n";
  print_hello( str );

  printf("Press Enter to exit...\n");
  getchar();

  return 0;
}
