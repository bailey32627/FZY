#ifndef FZY_RENDERER_TYPES_H
#define FZY_RENDERER_TYPES_H

#include "defines.h"
#include "resources/fzy_resource_types.h"
#include "core/fzy_event.h"

#define MAX_RENDERPASSES 6

typedef enum
{
	COLOR = 0,
	DEPTH,
	STENCIL,

} clear_flag;


/** @brief Represents a render pass, render calls made to a framebuffer */
typedef struct renderpass
{
  shader* shader;                             // Shader to use when drawing this renderpass
  void* internal_data;                        // Holds the backend data
  texture* attachments[ ATTACHMENT_TOTAL ];   // Holds the texture attachments
  u16 width;                                  // width of the textures
  u16 height;                                 // height of the textures
  u32 clear_flags;                            // flags to clear
  vec4 clear_color;                           // clear color for the clear calls
  struct renderpass* previous;                // pointer to the renderpass before this one, to access buffers
  void(*draw)(void);                          // function pointer to the function that draws this pass

} renderpass;


/** @brief Represents the GUI components of a render pass */
typedef struct gui_context
{
  // any meshes rendered with a text will need any individual draw call ( render mesh )
  mesh* controls;     // holds all data needed to render a solid color control
  mesh* text;         // holds any text in the view used for gui

} gui_context;


/** @brief Represents a view or window in the engine, contains renderpasses */
typedef struct view
{
  b8 focus;                                  // determines if the view is in focus
  ivec2 position;                            // the position of the views top left corner
  ivec2 size;                                // The size of the view
  f32 z;                                     // The depth is used to stack views if needed
  renderpass* passes[ MAX_RENDERPASSES ];    // The renderpasses used in this view
  u8 pass_count;                             // The number of renderpasses in this view
  gui_context* context;                      // The mesh used to render text in the view
  //camera camera;                           // Camera view to draw the view with

	/* @brief Functon to call when the view is created */
	b8 (*on_create)( struct view* self );

	/* @brief Function to call when the view is destroyed */
	b8 (*on_destroy)( struct view* self );

	/* @brief Function called when the view is resized */
	b8 (*on_resize)( struct view* self, u16 width, u16 height );

	/* @brief Function to use when a mouse event is detected in this view */
	b8 (*on_mouse_event)( struct view* self, u16 code, event_context context );

	/* @brief Function to use when a keyboard event is detected in the view */
	b8 (*on_keyboard_event)( struct view* self, u16 code, event_context context );

	/* @brief Function to use when drawing the gui for the view */
	void (*render_gui)( struct view* self );

} view;


/** Abstract backend struct to allow different types of rendering apis  */
typedef struct renderer_backend
{
	u64 frame_number;

	/*
		@brief Initializes the backend

		@param backend Pointer to the generic backend interface
		@return true if successful, false otherwise
	*/
	b8 (*initialize)( struct renderer_backend *backend );

	/*
		@brief Shutdowns the renderer backend and frees any memory that it is holding

		@return True if successful, false otherwise
	*/
	b8 (*shutdown)( struct renderer_backend *backend );

	/*
		@brief allows tests to be enabled and disabled on the backend

		@param flag The test to enable/disable
		@param enable True to enable, false to disable
	*/
	void (*enable)( u8 flag, b8 enable );

	/*
		@brief Handles window resizes

		@param backend Pointer to the generic backend
		@param width The new window width
		@param height The new window height
	*/
	void (*resized)( struct renderer_backend *backend, u16 width, u16 height );

	/*
		@brief Preforms setup routines required at the strart of a frame

		@param backend Pointer to the generic backend
		@param delta_time The time in seconds since the last frame
		@return True if successful, otherwise false
	*/
	b8 (*begin_frame)( struct renderer_backend* backend, f32 delta_time );

	/*
		@brief Preforms functions required to draw a frame, and present it.  Only called after a successful start_frame

		@param backend A pointer to the generic backend
		@param delta_time The time in seconds since the last frame
		@return true if successful, otherwise false
	*/
	b8 (*end_frame)( struct renderer_backend* backend, f32 delta_time );

	//---------------------------------------------------------------------------
	//  shaders
	//---------------------------------------------------------------------------

	/*
	  @brief creates an shader and allocates backend resources

		@param sdr The shader to create backend resources for
	  @param vertex File name for the vertex shader to use ( Required )
	  @param fragment File name for the fragment shader to use ( Required )
		@return true if successful, false otherwise
	*/
	b8 (*create_shader)( shader* sdr, const char* vertex_file, const char* fragment_file );

	/*
	  @brief Frees the shader and the backend resources

	  @param shader The shader to free resources for
	*/
	b8 (*destroy_shader)( shader* sdr );

	/*
	  @brief Add a uniform to the uniforms table in the shader

	  @param shader The shader to add uniform to
	  @param name The name of the uniform
	  @param type The uniform type
	  @return True if successful, false otherwise
	*/
	b8 (*add_shader_uniform)( shader* sdr, const char* name, u8 type );

	/*
	  @brief Sets the value of the uniform with the given name

	  @param sdr The shader to access
	  @param name The name of the uniform
	  @param value Pointer to the value to copy to the uniform
	*/
	void (*set_shader_uniform)( shader* sdr, const char* name, void* value );

	/*
	  @brief Tells the backend to bind this shader

	  @param shader The shader to bind, 0 to unbind
	*/
	void (*use_shader)( shader* sdr );

	/*
		@brief Initializes the global shaders needed for rendering

		@param texture_shader The global texture shader ( used to draw views to the screen )
		@param font_shader The global font shader ( used to draw text )
		@param color_shader The global color shader ( used to draw gui controls )
	*/
	void (*initialize_global_shaders)( shader* texture_shader, shader* font_shader, shader* color_shader );

	//---------------------------------------------------------------------------
  //  vetex buffers
  //---------------------------------------------------------------------------

	/*
	  @brief create a vertex buffer and backend resources

	  @param vb The vertex buffer to create backend resources for
	  @return True if succesful
	*/
	b8 (*create_vertex_buffer)( vertex_buffer* vb );

	/*
	  @brief Frees all resources held by the vertex buffer and the back end resouces

	  @param vb Vertex buffer to destroy
		@return true if successful
	*/
	b8 (*destroy_vertex_buffer)( vertex_buffer *vb );

	/*
	  @brief Uploads the vertex buffer to the backend renderer for use

	  @param vb The vertex buffer to upload
	  @param dynamic Indicates if the buffer is dynamic or not
	*/
	void (*upload_vertex_buffer)( vertex_buffer *vb, b8 dynamic );

	//---------------------------------------------------------------------------
	//  Mesh
	//---------------------------------------------------------------------------

	/*
	  @brief Creates the internal resources for a mesh

		@param mesh The mesh to create backend resources for
	  @returns True if successful
	*/
	b8 (*create_mesh)( mesh* mesh );

	/*
	  @brief Frees all the resources associated with the mesh

	  @param mesh The mesh to destroy
		@return True if successful
	*/
	b8 (*destroy_mesh)( mesh* mesh );

	/*
	  @brief Uploads the mesh to the backend

	  @param mesh The mesh to upload
		@param dynamic Indicates if the mesh is dynamic
	*/
	void (*upload_mesh)( mesh* mesh, b8 dynamic );

	/*
		@brief draw the mesh on the backend

		@param mesh The mesh to draw
	*/
	void (*draw_mesh)( mesh* mesh );

	//---------------------------------------------------------------------------
	//  Textures
	//---------------------------------------------------------------------------

	/*
	 	@brief Creates a texture on the backend

		@param tex The texture to create resources for
		@param path The path the texture file
		@param atlas_square The number of rows and columns in the atlas
		@return True if successful
	*/
	b8 (*create_texture)( texture* texture, const char* path, u32 atlas_square );

	/*
		@brief Creates backend data for a writable texture

		@param texture The texture to create as an attachment
		@param attachment The type of attachment this texture will be
		@param width The width of the texture
		@param height The height of the texture
		@return True if successful
	*/
	b8 (*create_writeable_texture)( texture* texture, attachment attachment, u16 width, u16 height );
	/*
	 	@brief Destroys the texture on the backend and clean up the memory

		@param tex The texture to free
	*/
	void (*destroy_texture)( texture* tex );

	/*
	 	@brief Binds the texture for rendering

		@param tex The texture to bind
	*/
	void (*bind_texture)( texture* tex, u32 active_texture );

	/*
	 	@brief unbinds the textures
	*/
	void (*unbind_texture)( );

	//----------------------------------------------------------------------------
	// Renderpass
	//----------------------------------------------------------------------------

	/*
	  @brief Creates a new renderpass.

	  @param out_renderpass A pointer to the generic renderpass.
		@param clear_flags The clear flags to set
		@return True on success; otherwise false.
	*/
	b8 (*renderpass_create)( renderpass* renderpass, u32 clear_flags );

	/*
	  @brief Destroys the given renderpass.

	  @param pass A pointer to the renderpass to be destroyed.
		@return True on success; otherwise false.
	*/
	b8 (*renderpass_destroy)( renderpass* pass );

	/*
	  @brief Begins a renderpass with the given id.

	  @param pass A pointer to the renderpass to begin.
	  @param target A pointer to the render target to be used.
	 */
	void (*renderpass_begin)( renderpass* pass );

	/*
	  @brief Ends a renderpass with the given id.

	  @param pass A pointer to the renderpass to end.
	  @return True on success; otherwise false.
	*/
	void (*renderpass_end)( renderpass* pass );


} renderer_backend;


#endif // FZY_RENDERER_TYPES_H
