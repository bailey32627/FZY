#ifndef FZY_ASSERTS_H
#define FZY_ASSERTS_H

#include "../defines.h"

// commit out line below to remove assertions
#define FZY_ASSERTIONS_ENABLED


#ifdef FZY_ASSERTIONS_ENABLED
#if _MSC_VER
#include <intrin.h>
/** @brief Causes a debug breakpoint to be hit. */
#define debug_break() __debugbreak()
#else
/** @brief Causes a debug breakpoint to be hit. */
#define debug_break() __builtin_trap()
#endif

FZY_API void report_assertion_failure( const char *expression, const char *message, const char *file, i32 line );

#define FZY_ASSERT( expr )                                         \
  {                                                                \
    if( expr ){                                                    \
    }else {                                                        \
      report_assertion_failure( #expr, "", __FILE__, __LINE__ );   \
      debug_break();                                               \
    }                                                              \
  }                                                                \

#define FZY_ASSERT_MSG( expr, message )                               \
  {                                                                   \
    if( expr ){                                                       \
    }else {                                                           \
      report_assertion_failure( #expr, message, __FILE__, __LINE__ ); \
      debug_break();                                                  \
    }                                                                 \
  }                                                                   \

#ifdef FZY_CONFIG_DEBUG
#define FZY_ASSERT_DEBUG( expr )                                      \
  {                                                                   \
    if( expr ){                                                       \
    }else {                                                           \
      report_assertion_failure( #expr, message, __FILE__, __LINE__ ); \
      debug_break();                                                  \
    }                                                                 \
  }
#else
#define FZY_ASSERT_DEBUG( expr )
#endif

#else
#define FZY_ASSERT( expr )                // does nothing
#define FZY_ASSERT_MSG(expr, message )    // does nothing
#define FZY_ASSERT_DEBUG(expr)            // does nothing

#endif

#endif // FZY_ASSERTS_H
