#include "engine.h"
#include <stdio.h>

int main() {
  logger_initialize( );

  FZY_INFO( "Hello from the logger in Editor!" );

  printf("Press Enter to exit...\n");
  getchar();

  return 0;
}
