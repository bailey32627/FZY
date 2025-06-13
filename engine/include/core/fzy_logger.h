#ifndef FZY_LOGGER_H
#define FZY_LOGGER_H

#include "defines.h"

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

  FZY_API void logger_output( log_level level, const char *fmt, ... );

  // log fatal level message
  #ifndef FZY_FATAL
  #define FZY_FATAL( ... ) logger_output( LOG_LEVEL_FATAL, __VA_ARGS__ );
  #endif

  // log an error
  #ifndef FZY_ERROR
  #define FZY_ERROR( ... ) logger_output( LOG_LEVEL_ERROR, __VA_ARGS__ );
  #endif

  // log a warning
  #if LOG_WARNING_ENABLED == 1
  #define FZY_WARNING( ... ) logger_output( LOG_LEVEL_WARNING, __VA_ARGS__ );
  #else
  #define FZY_WARNING( ... )
  #endif

  #if LOG_INFO_ENABLED == 1
#define FZY_INFO( ... ) logger_output( LOG_LEVEL_INFO, __VA_ARGS__ );
#else
// does nothing if LOG_WARNING_ENABLED != 1
#define FZY_INFO(... )
#endif

// log a debug statement
#if LOG_DEBUG_ENABLED == 1
#define FZY_DEBUG( ... ) logger_output( LOG_LEVEL_DEBUG, __VA_ARGS__ );
#else
// does nothing if LOG_DEBUG_ENABLED != 1
#define FZY_DEBUG( ... )
#endif

// log a trace
#if LOG_TRACE_ENABLED == 1
#define FZY_TRACE( message ) logger_output( LOG_LEVEL_TRACE, message );
#else
#define FZY_TRACE( message )
#endif

#endif // FZY_LOGGER_H
