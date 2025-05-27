#ifndef FZY_LOGGER_H
#define FZY_LOGGER_H

#include "../defines.h"

#define LOG_WARNING_ENABLED 1
#define LOG_INFO_ENABLED 1
#define LOG_DEBUG_ENABLED 1
#define LOG_TRACE_ENABLED 1

#ifdef FZY_CONFIG_RELEASE
  LOG_DEBUG_ENABLED 0
  LOG_TRACE_ENABLED 0
  #endif

  typedef enum log_level
  {
    LOG_LEVEL_FATAL = 0,
    LOG_LEVEL_ERROR = 1,
    LOG_LEVEL_WARNING = 2,
    LOG_LEVEL_INFO = 3,
    LOG_LEVEL_DEBUG = 4,
    LOG_LEVEL_TRACE = 5
  } log_level;

  /*
  @brief initalizes the logger system and return true if initialized correctly
  @return true if successful otherwise false
  */
  b8 logger_initialize( );

  /*
  @brief Shuts down the logger system and ensures the log is written to a file
  */
  void logger_shutdown( );

  void logger_output( log_level level, const char *message );

  // log fatal level message
  #ifndef FZY_FATAL
  #define FZY_FATAL( message ) logger_output( LOG_LEVEL_FATAL, message );
  #endif

  // log an error
  #ifndef FZY_ERROR
  #define FZY_ERROR( message ) logger_output( LOG_LEVEL_ERROR, message );
  #endif

  // log a warning
  #if LOG_WARNING_ENABLED == 1
  #define FZY_WARNING( message ) logger_output( LOG_LEVEL_WARNING, message );
  #else
  #define FZY_WARNING( message )
  #endif

  #if LOG_INFO_ENABLED == 1
#define FZY_INFO( message ) logger_output( LOG_LEVEL_INFO, message );
#else
// does nothing if LOG_WARNING_ENABLED != 1
#define FZY_INFO(message )
#endif

// log a debug statement
#if LOG_DEBUG_ENABLED == 1
#define FZY_DEBUG( message ) logger_output( LOG_LEVEL_DEBUG, message );
#else
// does nothing if LOG_DEBUG_ENABLED != 1
#define FZY_DEBUG( message )
#endif

// log a trace
#if LOG_TRACE_ENABLED == 1
#define FZY_TRACE( message ) logger_output( LOG_LEVEL_TRACE, message );
#else
#define FZY_TRACE( message )
#endif

#endif // FZY_LOGGER_H
