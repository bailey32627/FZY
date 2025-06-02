#ifndef FZY_WINDOW_H
#define FZY_WINDOW_H

#include "defines.h"

/*
  @brief Initalizes the window
  @param title - Title to set the window to create
  @param width - width of the window to create
  @param height - height of the window to create
  @return true if successful
*/
b8 window_initialize( const char *title, i32 width, i32 height );

/*
  @brief Shuts down the window
*/
void window_shutdown( void );

/*
  @brief Swaps the back buffer for the front
*/
void window_swap_buffers( void );

/*
  @brief Gets the width of the window
  @return Width
*/
i32 window_get_width( void );

/*
  @brief Gets the height of the window
  @return Height
*/
i32 window_get_height( void );

/*
  @brief Gets the aspect ratio of the window
  @return Aspect ratio
*/
f32 window_get_aspect_ratio( void );

/*
  @brief Sets the width and height of the window
  @Should only be called by a resize event
*/
void window_set_width_height( i32 width, i32 height );

#endif // FZY_WINDOW_H
