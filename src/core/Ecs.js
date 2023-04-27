
// Generates a random Id ----------------------------------------------
const randomID = () => {
  return (+new Date()) + (Math.random() * 100000000 | 0) + (++randomID.nextID);
}
randomID.nextID = 0;

// creates a hash int based on the string input ------------------------
const hashCode = ( str ) => {
  let hash = 5381, i = str.length;
  while( i ) {
    hash = ( hash * 33 ) ^ str.charCodeAt( --i );
  }
  return hash >>> 0; // force Negative bit to positive
}

/*/////////////////////////////////////////////////////////////////////////////////
	Components
	Creates a Factory to generate new Components which for ECS should just be data only
	Ex:
	Components(
		class Test{
			constructor(){
				this.x = 0;
			}
		}
	);
	var com = Components("Test"); 	// New Component by calling its name
	var com = Components(1); 		// New Component by calling its ComponentTypeID
	both returns "new Test()";
/////////////////////////////////////////////////////////////////////////////////*/

const Components = ( component ) => {
  switch( typeof component ){
    case "function":
      if( Components.list.has( component.name ) ) {
        console.log( "Component name already exist: %s", component.name );
        return Components;
      }

      let typeID = Util.hashCode( component.name );   // generate hash code for component type
      component.prototype.componentTypeID = typeID;   // add the typeID to the objects prototype
      component.prototype.entity = null;              // reference to the Entity attached to

      Components.list.set( component.name, { // Add object to list with extra meta data that may be needed
        typeID: typeID,
        object: component
      });

      console.log( "Registered Component: %s, typeID: %s", component.name, typeID );
      break;

    case "string":
      let c = Components.list.get( component );
      return (c) ? new c.object() : null;
      break;
    case "number":
      let v;
      for([,v] of Components.list) {
        if( v.typeID == component ) {
          return new v.object();
        }
      }
      break;
  }
  return null;
}

Components.list = new Map();
Components.exists = (name) => { return Components.list.has(name); }
Components.destroy = (component) => { component.entity = null; }

/*/////////////////////////////////////////////////////////////////////////////////
	Entities
	Basicly just a container for a list of Components
	var ent = new Entity("test", ["Transform","Drawable"]);
/////////////////////////////////////////////////////////////////////////////////*/

class Entity {
  constructor( name = "", componentList = null ) {
    this.id = Util.randomID(); // used as the key in the entities list
    this.name = name;          // given name of the entity
    this.active = true;        // indicates if the entity is active
    this.components = [ ];     // list of components

    if( componentList ) {
      this.addComponentByArray( componentList );
    }
  }

  // Add a component instance to this entity ---------------------------------
  addComponent( component ) {
    if( !component.componentTypeID ) {
      console.log( "Entity.addComponent : not a component instance" );
      return this;
    }

    component.entity = this;
    this.component[ component.constructor.name ] = component;
    return this;
  }

  //  Add component by component name -------------------------------------
  addComponentByName( name ) {
    let c;
    if( !(c = Components( name ) ) ) {
      console.log( "Could not find component ", name );
      return null;
    }
    this.addComponent( c );
    return c;
  }

  // Add a list of components-------------------------------------------
  addComponentByArray( array ) {
    let i, c;
    for( i of array ) {
      if( c = Components( i ) ) { this.addComponent( c ); }
      else { console.log( "Could not find component ", i ) }
    }
    return this;
  }

  // Removes the component --------------------------------------------
  removeComponent( name ) {
    if ( this.components[ name ] ) {
      Components.destroy( this.components[ name ] );
      delete this.components[ name ];
    } else {
      console.log( "Entity.removeComponent name not found: ", name );
    }
    return this;
  }

  // object handling -------------------------------------------------
  static destroy( entity ) {
    let c;
    for( c in entity.components ) {
      entity.removeComponent( c );
    }
  }
}

/*/////////////////////////////////////////////////////////////////////////////////
	Assemblies
	Some predefined entities, to make it easy to create common entity objects
	with the right set of components.
	Ex:
	Assemblies.add("particle", ["Movement", "Transform"]);
	var ent = Assemblages.new("particle","MyParticle");
/////////////////////////////////////////////////////////////////////////////////*/

class Assemblies {
  static async add( name, componentList ) {
    // dynamically load components that are not registred
    for ( let c of componentList ) {
      if( !Components.exists( c ) ) await import( `./components/${c}.js`);
    }
    // create assemblage instance
    Assemblies.list.set( name, { componentsList: componentList } );

    console.log( "New Assemblage: %s with components: %s", name, componentList.join( ", " ) );
    return Assemblies;
  }

  // Returns a new entity from the Assemblage ------------------------------
  static new( assemblyName, entityName = "New_Entity" ) {
    let item = Assemblies.list.get( assemblyName );
    if( item ) return new Entity( entityName, item.componentsList );
    else console.log( "No Assemblies with the name: ", name );

    return null;
  }
}

Assemblies.list = new Map();

/*/////////////////////////////////////////////////////////////////////////////////
	Systems
	Logic that will execute on the component data of an entity
/////////////////////////////////////////////////////////////////////////////////*/
class System{
	constructor(){ this.active = true; }

  // Every system needs an update function
}

/*/////////////////////////////////////////////////////////////////////////////////
Ecs
/////////////////////////////////////////////////////////////////////////////////*/

let gSystemCount = 0; // used to create an order id for systems when added to an ECS object

class Ecs {
  constructor( ) {
    this.entities = new Map();
    this.systems = new Array();
    this.queryCache = new Map();
  }

  // Entities -------------------------

  // Creates a new Entity based on an assemblage name ------------------------
  newEntityFromAssembly( assemblyName, entityName = "New_Entity" ) {
    let e = Assemblies.new( assemblyName, entityName );
    if( e ) {
      this.addEntity( e );
      return e;
    }
    return null;
  }

  // Creaes a new Entity and add it to the list automatically -----------------
  newEntity( entityName = "New_Entity", componentList = null ) {
    let e = new Entity( entityName, componentList );
    if( e ){
      this.addEntity( e );
      return e;
    }
    return null;
  }

  // Adds the entity instance to the entities list ----------------------------
  addEntity( entity ) {
    this.entities.set( entity.id, entity );
    return this;
  }

  // Removes an entity from the entities list and destroys it ------------------
  removeEntity( entityID ) {
    let e = this.entities.get( entityID );
    if( e ) {
      Entity.destroy( e );
      this.entities.remove( entityID );
    } else {
      console.log( "Entity does not exist when trying to remove: ", entityID );
    }
    return this;
  }

  // SYSTEMS ---------------------------------

  // Add a system to the ecs, ordered by priority ------------------------------
  addSystem( system, priority = 50 ) {
    let order = ++gSystemCount,
    item = { system, priority, order, name:system.constructor.name },
    saveIndex = -1,
    i = -1;
    s;

    // Find where on the area to put the system
    for( s of this.systems ){
      i++;
      if( s.priority < priority ) continue; // Order by priority first
      if( s.priority === priority && s.order < order ) continue; // Then by order of insertion
      saveIndex = i;
      break;
    }

    // insert system in the sorted location in the array
    if( saveIndex === -1 ) { this.systems.push( itm ); }
    else {
      this.systems.push( null); // add blank space to the array
      for( var x = this.systems.length - 1; x > saveIndex; x-- ) { // shift the array contents one index up
        this.systems[ x ] = this.systems[ x - 1 ];
      }
      this.systems[ saveIndex ] = item; // Save new item in its sorted location
    }
    console.log( "Adding System: %s with priority: %s and insert order of %d, system.constructor.name, priority, order" );
    return this;
  }

  //  Updates the systems in order------------------------------------------
  updateSystems( ) {
    let s;
    for( s of this.systems ) { s.systems.update( this ); }
    return this;
  }

  // Removes the named system from the ecs ----------------------------------
  removeSystem( name ) {
    let i;
    for( i = 0; i < this.systems.length; i++ ) {
      if( this.systems[ i ].name === name ) {
        this.systems.splice( i, 1 );
        console.log( "Removing system: ", name );
        break;
      }
    }
    return this;
  }

  // Queries ----------------------------------------------------

  // Searches the entities and returns an array of entities that have the components
    //in the componentList ----------------------------------------------------
  queryEntities( componentList, sorFunc=null ){
    // check if query has already been cached
    let queryName = "query~" + componentsList.join( "_" ),
    out = this.queryCache.get( queryName );
    if( out ) return out;

    // not in cache, run search
    let cLen = componentList.length,
    cFind = 0,
    e, c;

    out = new Array();
    for( [,e] of this.entities ) {
      cFind = 0;
      for( c of componentList ) {
        if( !e.components[ c ] ) break;  // break loop if Component is not found
        else cFind++;  // Add to find count if component is found
      }
      if( cFind === cLen ) out.push( e );
    }

    // save results for other systems
    if( out.length > 0 ) {
      this.queryCache.set( queryName, out );
      if( sortFunc ) {
        out.sort( sortFunc );
      }
    }
    return out;
  }
}

export { Components, Assemblies, Entity, System, Ecs };
