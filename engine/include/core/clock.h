#ifndef FZY_CLOCK_H
#define FZY_CLOCK_H

#include "../defines.h"

typedef struct clock
{
  u64 start_time;
  u64 elasped;
} clock;

/*
  @brief Updates the provided clock.  Should be called before checking elasped time
    Has no effect on clocks that have not been started
  @param clock - the clock to update
*/
void clock_update( clock *clock );

/*
  @brief Starts the provided clock.  Resets the elasped time
  @param clock - the clock to start
*/
void clock_start( clock *clock );

/*
  @brief Stops the provided clock.  Does not reset the elasped time
  @param clock - the clock to stop
*/
void clock_stop( clock *clock );

#endif // FZY_CLOCK_H
