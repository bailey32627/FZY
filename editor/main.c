#include "fzy.h"

int main()
{
  // initialize the engine first
  fzy_initialize( );

  // add any views you want here

  // state the engine by calling the update function
  fzy_update( 0.016f );

  // shutdown the engine, this will free all the resources 
  fzy_shutdown( );
}
