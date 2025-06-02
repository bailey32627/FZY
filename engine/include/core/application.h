#ifndef FZY_APPLICATION_H
#define FZY_APPLICATION_H

#include "defines.h"

typedef struct application
{
  /*
    @brief Function pointer to initialize the application
    @param instance - pointer to the instance of the app
    @return true if successfully initialized
  */
  b8 (*initialize)( struct application *instance );

  /*
    @brief Function pointer to shutdown the application
    @param instance - pointer to the instance of the application
    @return true if successful
  */
  b8 (*shutdown)( struct application *instance );

  /*
    @brief Function pointer to update the app
    @param instance - pointer to the istance of the application
    @param delta_time - elasped time of the last frame
    @return true if successful
  */
  b8 (*update)( struct application *instance, f32 delta_time );

  /*
    @brief Function pointer to render the app
    @param instance - pointer to the instance of the application
    @param delta_time - elasped time of the last frame
    @return true if successful
  */
  b8 (*render)( struct application *instance, f32 delta_time );

} application;

/*
  @brief extern function to create and asign function pointers of an application
*/
extern b8 create_application( application *instance );

/*
  @brief Creates a application with the given params of the application configuration
  @param instance - pointer to the application instance
  @return true if successful
*/
FZY_API b8 application_initialize( application *instance );

/*
  @brief Runs the application loop until quit or error occurs
  @param instance - pointer to the instance of the application
  @return true if successful
*/
FZY_API b8 application_run( application *instance );

/*
  @brief Shuts down the application, releasing memory and freeing the window
  @param instance - pointer to the instance of the application
  @return true if successful
*/
FZY_API b8 application_shutdown( application *instance );

#endif // FZY_APLICATION_H
