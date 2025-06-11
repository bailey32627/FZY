#ifndef FZY_TIMER_H
#define FZY_TIMER_H

#include "defines.h"

typedef struct timer
{
  f32 elasped;
  f32 duration;
  b8 repeating;
  b8 active;

} timer;

/*
  @brief Initializes the timer with a duration in seconds and wether it should repeat
  @param t - the timer to start
  @param duration - time in seconds the timer should run for
  @param repeating - indicates if the timer should repeat its count
*/
void fzy_timer_start( timer *t, f32 duration, b8 repeating );

/*
  @brief Updates the timers elasped time,  Call this every frame with delta_time
  @param t - the timer to update
  @param delta_time - the elaspsed time of the last frame
  @return true if the timer has fired
*/
b8 fzy_timer_update( timer *t, f32 delta_time );

/*
  @brief Stops the timer
  @param t - ptr to the timer to stop
*/
void fzy_timer_stop( timer *t );

/*
  @brief Resets the timer ( sets elasped time to 0 )
  @param t - ptr to the timer to reset
*/
void fzy_timer_reset( timer *t );


#endif // FZY_TIMER_H
