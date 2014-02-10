/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);












/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */


(function (window, document, $, undefined) {
	"use strict";

	var H = $("html"),
		W = $(window),
		D = $(document),
		F = $.fancybox = function () {
			F.open.apply( this, arguments );
		},
		IE =  navigator.userAgent.match(/msie/i),
		didUpdate	= null,
		isTouch		= document.createTouch !== undefined,

		isQuery	= function(obj) {
			return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function(str) {
			return str && $.type(str) === "string";
		},
		isPercentage = function(str) {
			return isString(str) && str.indexOf('%') > 0;
		},
		isScrollable = function(el) {
			return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
		},
		getScalar = function(orig, dim) {
			var value = parseInt(orig, 10) || 0;

			if (dim && isPercentage(orig)) {
				value = F.getViewport()[ dim ] / 100 * value;
			}

			return Math.ceil(value);
		},
		getValue = function(value, dim) {
			return getScalar(value, dim) + 'px';
		};

	$.extend(F, {
		// The current version of fancyBox
		version: '2.1.5',

		defaults: {
			padding : 15,
			margin  : 20,

			width     : 800,
			height    : 600,
			minWidth  : 100,
			minHeight : 100,
			maxWidth  : 9999,
			maxHeight : 9999,
			pixelRatio: 1, // Set to 2 for retina display support

			autoSize   : true,
			autoHeight : false,
			autoWidth  : false,

			autoResize  : true,
			autoCenter  : !isTouch,
			fitToView   : true,
			aspectRatio : false,
			topRatio    : 0.5,
			leftRatio   : 0.5,

			scrolling : 'auto', // 'auto', 'yes' or 'no'
			wrapCSS   : '',

			arrows     : true,
			closeBtn   : true,
			closeClick : false,
			nextClick  : false,
			mouseWheel : true,
			autoPlay   : false,
			playSpeed  : 3000,
			preload    : 3,
			modal      : false,
			loop       : true,

			ajax  : {
				dataType : 'html',
				headers  : { 'X-fancyBox': true }
			},
			iframe : {
				scrolling : 'auto',
				preload   : true
			},
			swf : {
				wmode: 'transparent',
				allowfullscreen   : 'true',
				allowscriptaccess : 'always'
			},

			keys  : {
				next : {
					13 : 'left', // enter
					34 : 'up',   // page down
					39 : 'left', // right arrow
					40 : 'up'    // down arrow
				},
				prev : {
					8  : 'right',  // backspace
					33 : 'down',   // page up
					37 : 'right',  // left arrow
					38 : 'down'    // up arrow
				},
				close  : [27], // escape key
				play   : [32], // space - start/stop slideshow
				toggle : [70]  // letter "f" - toggle fullscreen
			},

			direction : {
				next : 'left',
				prev : 'right'
			},

			scrollOutside  : true,

			// Override some properties
			index   : 0,
			type    : null,
			href    : null,
			content : null,
			title   : null,

			// HTML templates
			tpl: {
				wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
				image    : '<img class="fancybox-image" src="{href}" alt="" />',
				iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
				error    : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
				closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
				next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
				prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
			},

			// Properties for each animation type
			// Opening fancyBox
			openEffect  : 'fade', // 'elastic', 'fade' or 'none'
			openSpeed   : 250,
			openEasing  : 'swing',
			openOpacity : true,
			openMethod  : 'zoomIn',

			// Closing fancyBox
			closeEffect  : 'fade', // 'elastic', 'fade' or 'none'
			closeSpeed   : 250,
			closeEasing  : 'swing',
			closeOpacity : true,
			closeMethod  : 'zoomOut',

			// Changing next gallery item
			nextEffect : 'elastic', // 'elastic', 'fade' or 'none'
			nextSpeed  : 250,
			nextEasing : 'swing',
			nextMethod : 'changeIn',

			// Changing previous gallery item
			prevEffect : 'elastic', // 'elastic', 'fade' or 'none'
			prevSpeed  : 250,
			prevEasing : 'swing',
			prevMethod : 'changeOut',

			// Enable default helpers
			helpers : {
				overlay : true,
				title   : true
			},

			// Callbacks
			onCancel     : $.noop, // If canceling
			beforeLoad   : $.noop, // Before loading
			afterLoad    : $.noop, // After loading
			beforeShow   : $.noop, // Before changing in current item
			afterShow    : $.noop, // After opening
			beforeChange : $.noop, // Before changing gallery item
			beforeClose  : $.noop, // Before closing
			afterClose   : $.noop  // After closing
		},

		//Current state
		group    : {}, // Selected group
		opts     : {}, // Group options
		previous : null,  // Previous element
		coming   : null,  // Element being loaded
		current  : null,  // Currently loaded element
		isActive : false, // Is activated
		isOpen   : false, // Is currently open
		isOpened : false, // Have been fully opened at least once

		wrap  : null,
		skin  : null,
		outer : null,
		inner : null,

		player : {
			timer    : null,
			isActive : false
		},

		// Loaders
		ajaxLoad   : null,
		imgPreload : null,

		// Some collections
		transitions : {},
		helpers     : {},

		/*
		 *	Static methods
		 */

		open: function (group, opts) {
			if (!group) {
				return;
			}

			if (!$.isPlainObject(opts)) {
				opts = {};
			}

			// Close if already active
			if (false === F.close(true)) {
				return;
			}

			// Normalize group
			if (!$.isArray(group)) {
				group = isQuery(group) ? $(group).get() : [group];
			}

			// Recheck if the type of each element is `object` and set content type (image, ajax, etc)
			$.each(group, function(i, element) {
				var obj = {},
					href,
					title,
					content,
					type,
					rez,
					hrefParts,
					selector;

				if ($.type(element) === "object") {
					// Check if is DOM element
					if (element.nodeType) {
						element = $(element);
					}

					if (isQuery(element)) {
						obj = {
							href    : element.data('fancybox-href') || element.attr('href'),
							title   : element.data('fancybox-title') || element.attr('title'),
							isDom   : true,
							element : element
						};

						if ($.metadata) {
							$.extend(true, obj, element.metadata());
						}

					} else {
						obj = element;
					}
				}

				href  = opts.href  || obj.href || (isString(element) ? element : null);
				title = opts.title !== undefined ? opts.title : obj.title || '';

				content = opts.content || obj.content;
				type    = content ? 'html' : (opts.type  || obj.type);

				if (!type && obj.isDom) {
					type = element.data('fancybox-type');

					if (!type) {
						rez  = element.prop('class').match(/fancybox\.(\w+)/);
						type = rez ? rez[1] : null;
					}
				}

				if (isString(href)) {
					// Try to guess the content type
					if (!type) {
						if (F.isImage(href)) {
							type = 'image';

						} else if (F.isSWF(href)) {
							type = 'swf';

						} else if (href.charAt(0) === '#') {
							type = 'inline';

						} else if (isString(element)) {
							type    = 'html';
							content = element;
						}
					}

					// Split url into two pieces with source url and content selector, e.g,
					// "/mypage.html #my_id" will load "/mypage.html" and display element having id "my_id"
					if (type === 'ajax') {
						hrefParts = href.split(/\s+/, 2);
						href      = hrefParts.shift();
						selector  = hrefParts.shift();
					}
				}

				if (!content) {
					if (type === 'inline') {
						if (href) {
							content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href ); //strip for ie7

						} else if (obj.isDom) {
							content = element;
						}

					} else if (type === 'html') {
						content = href;

					} else if (!type && !href && obj.isDom) {
						type    = 'inline';
						content = element;
					}
				}

				$.extend(obj, {
					href     : href,
					type     : type,
					content  : content,
					title    : title,
					selector : selector
				});

				group[ i ] = obj;
			});

			// Extend the defaults
			F.opts = $.extend(true, {}, F.defaults, opts);

			// All options are merged recursive except keys
			if (opts.keys !== undefined) {
				F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
			}

			F.group = group;

			return F._start(F.opts.index);
		},

		// Cancel image loading or abort ajax request
		cancel: function () {
			var coming = F.coming;

			if (!coming || false === F.trigger('onCancel')) {
				return;
			}

			F.hideLoading();

			if (F.ajaxLoad) {
				F.ajaxLoad.abort();
			}

			F.ajaxLoad = null;

			if (F.imgPreload) {
				F.imgPreload.onload = F.imgPreload.onerror = null;
			}

			if (coming.wrap) {
				coming.wrap.stop(true, true).trigger('onReset').remove();
			}

			F.coming = null;

			// If the first item has been canceled, then clear everything
			if (!F.current) {
				F._afterZoomOut( coming );
			}
		},

		// Start closing animation if is open; remove immediately if opening/closing
		close: function (event) {
			F.cancel();

			if (false === F.trigger('beforeClose')) {
				return;
			}

			F.unbindEvents();

			if (!F.isActive) {
				return;
			}

			if (!F.isOpen || event === true) {
				$('.fancybox-wrap').stop(true).trigger('onReset').remove();

				F._afterZoomOut();

			} else {
				F.isOpen = F.isOpened = false;
				F.isClosing = true;

				$('.fancybox-item, .fancybox-nav').remove();

				F.wrap.stop(true, true).removeClass('fancybox-opened');

				F.transitions[ F.current.closeMethod ]();
			}
		},

		// Manage slideshow:
		//   $.fancybox.play(); - toggle slideshow
		//   $.fancybox.play( true ); - start
		//   $.fancybox.play( false ); - stop
		play: function ( action ) {
			var clear = function () {
					clearTimeout(F.player.timer);
				},
				set = function () {
					clear();

					if (F.current && F.player.isActive) {
						F.player.timer = setTimeout(F.next, F.current.playSpeed);
					}
				},
				stop = function () {
					clear();

					D.unbind('.player');

					F.player.isActive = false;

					F.trigger('onPlayEnd');
				},
				start = function () {
					if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
						F.player.isActive = true;

						D.bind({
							'onCancel.player beforeClose.player' : stop,
							'onUpdate.player'   : set,
							'beforeLoad.player' : clear
						});

						set();

						F.trigger('onPlayStart');
					}
				};

			if (action === true || (!F.player.isActive && action !== false)) {
				start();
			} else {
				stop();
			}
		},

		// Navigate to next gallery item
		next: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.next;
				}

				F.jumpto(current.index + 1, direction, 'next');
			}
		},

		// Navigate to previous gallery item
		prev: function ( direction ) {
			var current = F.current;

			if (current) {
				if (!isString(direction)) {
					direction = current.direction.prev;
				}

				F.jumpto(current.index - 1, direction, 'prev');
			}
		},

		// Navigate to gallery item by index
		jumpto: function ( index, direction, router ) {
			var current = F.current;

			if (!current) {
				return;
			}

			index = getScalar(index);

			F.direction = direction || current.direction[ (index >= current.index ? 'next' : 'prev') ];
			F.router    = router || 'jumpto';

			if (current.loop) {
				if (index < 0) {
					index = current.group.length + (index % current.group.length);
				}

				index = index % current.group.length;
			}

			if (current.group[ index ] !== undefined) {
				F.cancel();

				F._start(index);
			}
		},

		// Center inside viewport and toggle position type to fixed or absolute if needed
		reposition: function (e, onlyAbsolute) {
			var current = F.current,
				wrap    = current ? current.wrap : null,
				pos;

			if (wrap) {
				pos = F._getPosition(onlyAbsolute);

				if (e && e.type === 'scroll') {
					delete pos.position;

					wrap.stop(true, true).animate(pos, 200);

				} else {
					wrap.css(pos);

					current.pos = $.extend({}, current.dim, pos);
				}
			}
		},

		update: function (e) {
			var type = (e && e.type),
				anyway = !type || type === 'orientationchange';

			if (anyway) {
				clearTimeout(didUpdate);

				didUpdate = null;
			}

			if (!F.isOpen || didUpdate) {
				return;
			}

			didUpdate = setTimeout(function() {
				var current = F.current;

				if (!current || F.isClosing) {
					return;
				}

				F.wrap.removeClass('fancybox-tmp');

				if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
					F._setDimension();
				}

				if (!(type === 'scroll' && current.canShrink)) {
					F.reposition(e);
				}

				F.trigger('onUpdate');

				didUpdate = null;

			}, (anyway && !isTouch ? 0 : 300));
		},

		// Shrink content to fit inside viewport or restore if resized
		toggle: function ( action ) {
			if (F.isOpen) {
				F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

				// Help browser to restore document dimensions
				if (isTouch) {
					F.wrap.removeAttr('style').addClass('fancybox-tmp');

					F.trigger('onUpdate');
				}

				F.update();
			}
		},

		hideLoading: function () {
			D.unbind('.loading');

			$('#fancybox-loading').remove();
		},

		showLoading: function () {
			var el, viewport;

			F.hideLoading();

			el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');

			// If user will press the escape-button, the request will be canceled
			D.bind('keydown.loading', function(e) {
				if ((e.which || e.keyCode) === 27) {
					e.preventDefault();

					F.cancel();
				}
			});

			if (!F.defaults.fixed) {
				viewport = F.getViewport();

				el.css({
					position : 'absolute',
					top  : (viewport.h * 0.5) + viewport.y,
					left : (viewport.w * 0.5) + viewport.x
				});
			}
		},

		getViewport: function () {
			var locked = (F.current && F.current.locked) || false,
				rez    = {
					x: W.scrollLeft(),
					y: W.scrollTop()
				};

			if (locked) {
				rez.w = locked[0].clientWidth;
				rez.h = locked[0].clientHeight;

			} else {
				// See http://bugs.jquery.com/ticket/6724
				rez.w = isTouch && window.innerWidth  ? window.innerWidth  : W.width();
				rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
			}

			return rez;
		},

		// Unbind the keyboard / clicking actions
		unbindEvents: function () {
			if (F.wrap && isQuery(F.wrap)) {
				F.wrap.unbind('.fb');
			}

			D.unbind('.fb');
			W.unbind('.fb');
		},

		bindEvents: function () {
			var current = F.current,
				keys;

			if (!current) {
				return;
			}

			// Changing document height on iOS devices triggers a 'resize' event,
			// that can change document height... repeating infinitely
			W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

			keys = current.keys;

			if (keys) {
				D.bind('keydown.fb', function (e) {
					var code   = e.which || e.keyCode,
						target = e.target || e.srcElement;

					// Skip esc key if loading, because showLoading will cancel preloading
					if (code === 27 && F.coming) {
						return false;
					}

					// Ignore key combinations and key events within form elements
					if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
						$.each(keys, function(i, val) {
							if (current.group.length > 1 && val[ code ] !== undefined) {
								F[ i ]( val[ code ] );

								e.preventDefault();
								return false;
							}

							if ($.inArray(code, val) > -1) {
								F[ i ] ();

								e.preventDefault();
								return false;
							}
						});
					}
				});
			}

			if ($.fn.mousewheel && current.mouseWheel) {
				F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
					var target = e.target || null,
						parent = $(target),
						canScroll = false;

					while (parent.length) {
						if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
							break;
						}

						canScroll = isScrollable( parent[0] );
						parent    = $(parent).parent();
					}

					if (delta !== 0 && !canScroll) {
						if (F.group.length > 1 && !current.canShrink) {
							if (deltaY > 0 || deltaX > 0) {
								F.prev( deltaY > 0 ? 'down' : 'left' );

							} else if (deltaY < 0 || deltaX < 0) {
								F.next( deltaY < 0 ? 'up' : 'right' );
							}

							e.preventDefault();
						}
					}
				});
			}
		},

		trigger: function (event, o) {
			var ret, obj = o || F.coming || F.current;

			if (!obj) {
				return;
			}

			if ($.isFunction( obj[event] )) {
				ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
			}

			if (ret === false) {
				return false;
			}

			if (obj.helpers) {
				$.each(obj.helpers, function (helper, opts) {
					if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
						F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
					}
				});
			}

			D.trigger(event);
		},

		isImage: function (str) {
			return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
		},

		isSWF: function (str) {
			return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
		},

		_start: function (index) {
			var coming = {},
				obj,
				href,
				type,
				margin,
				padding;

			index = getScalar( index );
			obj   = F.group[ index ] || null;

			if (!obj) {
				return false;
			}

			coming = $.extend(true, {}, F.opts, obj);

			// Convert margin and padding properties to array - top, right, bottom, left
			margin  = coming.margin;
			padding = coming.padding;

			if ($.type(margin) === 'number') {
				coming.margin = [margin, margin, margin, margin];
			}

			if ($.type(padding) === 'number') {
				coming.padding = [padding, padding, padding, padding];
			}

			// 'modal' propery is just a shortcut
			if (coming.modal) {
				$.extend(true, coming, {
					closeBtn   : false,
					closeClick : false,
					nextClick  : false,
					arrows     : false,
					mouseWheel : false,
					keys       : null,
					helpers: {
						overlay : {
							closeClick : false
						}
					}
				});
			}

			// 'autoSize' property is a shortcut, too
			if (coming.autoSize) {
				coming.autoWidth = coming.autoHeight = true;
			}

			if (coming.width === 'auto') {
				coming.autoWidth = true;
			}

			if (coming.height === 'auto') {
				coming.autoHeight = true;
			}

			/*
			 * Add reference to the group, so it`s possible to access from callbacks, example:
			 * afterLoad : function() {
			 *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
			 * }
			 */

			coming.group  = F.group;
			coming.index  = index;

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			F.coming = coming;

			if (false === F.trigger('beforeLoad')) {
				F.coming = null;

				return;
			}

			type = coming.type;
			href = coming.href;

			if (!type) {
				F.coming = null;

				//If we can not determine content type then drop silently or display next/prev item if looping through gallery
				if (F.current && F.router && F.router !== 'jumpto') {
					F.current.index = index;

					return F[ F.router ]( F.direction );
				}

				return false;
			}

			F.isActive = true;

			if (type === 'image' || type === 'swf') {
				coming.autoHeight = coming.autoWidth = false;
				coming.scrolling  = 'visible';
			}

			if (type === 'image') {
				coming.aspectRatio = true;
			}

			if (type === 'iframe' && isTouch) {
				coming.scrolling = 'scroll';
			}

			// Build the neccessary markup
			coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo( coming.parent || 'body' );

			$.extend(coming, {
				skin  : $('.fancybox-skin',  coming.wrap),
				outer : $('.fancybox-outer', coming.wrap),
				inner : $('.fancybox-inner', coming.wrap)
			});

			$.each(["Top", "Right", "Bottom", "Left"], function(i, v) {
				coming.skin.css('padding' + v, getValue(coming.padding[ i ]));
			});

			F.trigger('onReady');

			// Check before try to load; 'inline' and 'html' types need content, others - href
			if (type === 'inline' || type === 'html') {
				if (!coming.content || !coming.content.length) {
					return F._error( 'content' );
				}

			} else if (!href) {
				return F._error( 'href' );
			}

			if (type === 'image') {
				F._loadImage();

			} else if (type === 'ajax') {
				F._loadAjax();

			} else if (type === 'iframe') {
				F._loadIframe();

			} else {
				F._afterLoad();
			}
		},

		_error: function ( type ) {
			$.extend(F.coming, {
				type       : 'html',
				autoWidth  : true,
				autoHeight : true,
				minWidth   : 0,
				minHeight  : 0,
				scrolling  : 'no',
				hasError   : type,
				content    : F.coming.tpl.error
			});

			F._afterLoad();
		},

		_loadImage: function () {
			// Reset preload image so it is later possible to check "complete" property
			var img = F.imgPreload = new Image();

			img.onload = function () {
				this.onload = this.onerror = null;

				F.coming.width  = this.width / F.opts.pixelRatio;
				F.coming.height = this.height / F.opts.pixelRatio;

				F._afterLoad();
			};

			img.onerror = function () {
				this.onload = this.onerror = null;

				F._error( 'image' );
			};

			img.src = F.coming.href;

			if (img.complete !== true) {
				F.showLoading();
			}
		},

		_loadAjax: function () {
			var coming = F.coming;

			F.showLoading();

			F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
				url: coming.href,
				error: function (jqXHR, textStatus) {
					if (F.coming && textStatus !== 'abort') {
						F._error( 'ajax', jqXHR );

					} else {
						F.hideLoading();
					}
				},
				success: function (data, textStatus) {
					if (textStatus === 'success') {
						coming.content = data;

						F._afterLoad();
					}
				}
			}));
		},

		_loadIframe: function() {
			var coming = F.coming,
				iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
					.attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
					.attr('src', coming.href);

			// This helps IE
			$(coming.wrap).bind('onReset', function () {
				try {
					$(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
				} catch (e) {}
			});

			if (coming.iframe.preload) {
				F.showLoading();

				iframe.one('load', function() {
					$(this).data('ready', 1);

					// iOS will lose scrolling if we resize
					if (!isTouch) {
						$(this).bind('load.fb', F.update);
					}

					// Without this trick:
					//   - iframe won't scroll on iOS devices
					//   - IE7 sometimes displays empty iframe
					$(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();

					F._afterLoad();
				});
			}

			coming.content = iframe.appendTo( coming.inner );

			if (!coming.iframe.preload) {
				F._afterLoad();
			}
		},

		_preloadImages: function() {
			var group   = F.group,
				current = F.current,
				len     = group.length,
				cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
				item,
				i;

			for (i = 1; i <= cnt; i += 1) {
				item = group[ (current.index + i ) % len ];

				if (item.type === 'image' && item.href) {
					new Image().src = item.href;
				}
			}
		},

		_afterLoad: function () {
			var coming   = F.coming,
				previous = F.current,
				placeholder = 'fancybox-placeholder',
				current,
				content,
				type,
				scrolling,
				href,
				embed;

			F.hideLoading();

			if (!coming || F.isActive === false) {
				return;
			}

			if (false === F.trigger('afterLoad', coming, previous)) {
				coming.wrap.stop(true).trigger('onReset').remove();

				F.coming = null;

				return;
			}

			if (previous) {
				F.trigger('beforeChange', previous);

				previous.wrap.stop(true).removeClass('fancybox-opened')
					.find('.fancybox-item, .fancybox-nav')
					.remove();
			}

			F.unbindEvents();

			current   = coming;
			content   = coming.content;
			type      = coming.type;
			scrolling = coming.scrolling;

			$.extend(F, {
				wrap  : current.wrap,
				skin  : current.skin,
				outer : current.outer,
				inner : current.inner,
				current  : current,
				previous : previous
			});

			href = current.href;

			switch (type) {
				case 'inline':
				case 'ajax':
				case 'html':
					if (current.selector) {
						content = $('<div>').html(content).find(current.selector);

					} else if (isQuery(content)) {
						if (!content.data(placeholder)) {
							content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter( content ).hide() );
						}

						content = content.show().detach();

						current.wrap.bind('onReset', function () {
							if ($(this).find(content).length) {
								content.hide().replaceAll( content.data(placeholder) ).data(placeholder, false);
							}
						});
					}
				break;

				case 'image':
					content = current.tpl.image.replace('{href}', href);
				break;

				case 'swf':
					content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
					embed   = '';

					$.each(current.swf, function(name, val) {
						content += '<param name="' + name + '" value="' + val + '"></param>';
						embed   += ' ' + name + '="' + val + '"';
					});

					content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
				break;
			}

			if (!(isQuery(content) && content.parent().is(current.inner))) {
				current.inner.append( content );
			}

			// Give a chance for helpers or callbacks to update elements
			F.trigger('beforeShow');

			// Set scrolling before calculating dimensions
			current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

			// Set initial dimensions and start position
			F._setDimension();

			F.reposition();

			F.isOpen = false;
			F.coming = null;

			F.bindEvents();

			if (!F.isOpened) {
				$('.fancybox-wrap').not( current.wrap ).stop(true).trigger('onReset').remove();

			} else if (previous.prevMethod) {
				F.transitions[ previous.prevMethod ]();
			}

			F.transitions[ F.isOpened ? current.nextMethod : current.openMethod ]();

			F._preloadImages();
		},

		_setDimension: function () {
			var viewport   = F.getViewport(),
				steps      = 0,
				canShrink  = false,
				canExpand  = false,
				wrap       = F.wrap,
				skin       = F.skin,
				inner      = F.inner,
				current    = F.current,
				width      = current.width,
				height     = current.height,
				minWidth   = current.minWidth,
				minHeight  = current.minHeight,
				maxWidth   = current.maxWidth,
				maxHeight  = current.maxHeight,
				scrolling  = current.scrolling,
				scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
				margin     = current.margin,
				wMargin    = getScalar(margin[1] + margin[3]),
				hMargin    = getScalar(margin[0] + margin[2]),
				wPadding,
				hPadding,
				wSpace,
				hSpace,
				origWidth,
				origHeight,
				origMaxWidth,
				origMaxHeight,
				ratio,
				width_,
				height_,
				maxWidth_,
				maxHeight_,
				iframe,
				body;

			// Reset dimensions so we could re-check actual size
			wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');

			wPadding = getScalar(skin.outerWidth(true)  - skin.width());
			hPadding = getScalar(skin.outerHeight(true) - skin.height());

			// Any space between content and viewport (margin, padding, border, title)
			wSpace = wMargin + wPadding;
			hSpace = hMargin + hPadding;

			origWidth  = isPercentage(width)  ? (viewport.w - wSpace) * getScalar(width)  / 100 : width;
			origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

			if (current.type === 'iframe') {
				iframe = current.content;

				if (current.autoHeight && iframe.data('ready') === 1) {
					try {
						if (iframe[0].contentWindow.document.location) {
							inner.width( origWidth ).height(9999);

							body = iframe.contents().find('body');

							if (scrollOut) {
								body.css('overflow-x', 'hidden');
							}

							origHeight = body.outerHeight(true);
						}

					} catch (e) {}
				}

			} else if (current.autoWidth || current.autoHeight) {
				inner.addClass( 'fancybox-tmp' );

				// Set width or height in case we need to calculate only one dimension
				if (!current.autoWidth) {
					inner.width( origWidth );
				}

				if (!current.autoHeight) {
					inner.height( origHeight );
				}

				if (current.autoWidth) {
					origWidth = inner.width();
				}

				if (current.autoHeight) {
					origHeight = inner.height();
				}

				inner.removeClass( 'fancybox-tmp' );
			}

			width  = getScalar( origWidth );
			height = getScalar( origHeight );

			ratio  = origWidth / origHeight;

			// Calculations for the content
			minWidth  = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
			maxWidth  = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);

			minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
			maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);

			// These will be used to determine if wrap can fit in the viewport
			origMaxWidth  = maxWidth;
			origMaxHeight = maxHeight;

			if (current.fitToView) {
				maxWidth  = Math.min(viewport.w - wSpace, maxWidth);
				maxHeight = Math.min(viewport.h - hSpace, maxHeight);
			}

			maxWidth_  = viewport.w - wMargin;
			maxHeight_ = viewport.h - hMargin;

			if (current.aspectRatio) {
				if (width > maxWidth) {
					width  = maxWidth;
					height = getScalar(width / ratio);
				}

				if (height > maxHeight) {
					height = maxHeight;
					width  = getScalar(height * ratio);
				}

				if (width < minWidth) {
					width  = minWidth;
					height = getScalar(width / ratio);
				}

				if (height < minHeight) {
					height = minHeight;
					width  = getScalar(height * ratio);
				}

			} else {
				width = Math.max(minWidth, Math.min(width, maxWidth));

				if (current.autoHeight && current.type !== 'iframe') {
					inner.width( width );

					height = inner.height();
				}

				height = Math.max(minHeight, Math.min(height, maxHeight));
			}

			// Try to fit inside viewport (including the title)
			if (current.fitToView) {
				inner.width( width ).height( height );

				wrap.width( width + wPadding );

				// Real wrap dimensions
				width_  = wrap.width();
				height_ = wrap.height();

				if (current.aspectRatio) {
					while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
						if (steps++ > 19) {
							break;
						}

						height = Math.max(minHeight, Math.min(maxHeight, height - 10));
						width  = getScalar(height * ratio);

						if (width < minWidth) {
							width  = minWidth;
							height = getScalar(width / ratio);
						}

						if (width > maxWidth) {
							width  = maxWidth;
							height = getScalar(width / ratio);
						}

						inner.width( width ).height( height );

						wrap.width( width + wPadding );

						width_  = wrap.width();
						height_ = wrap.height();
					}

				} else {
					width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_)));
					height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
				}
			}

			if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
				width += scrollOut;
			}

			inner.width( width ).height( height );

			wrap.width( width + wPadding );

			width_  = wrap.width();
			height_ = wrap.height();

			canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
			canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));

			$.extend(current, {
				dim : {
					width	: getValue( width_ ),
					height	: getValue( height_ )
				},
				origWidth  : origWidth,
				origHeight : origHeight,
				canShrink  : canShrink,
				canExpand  : canExpand,
				wPadding   : wPadding,
				hPadding   : hPadding,
				wrapSpace  : height_ - skin.outerHeight(true),
				skinSpace  : skin.height() - height
			});

			if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
				inner.height('auto');
			}
		},

		_getPosition: function (onlyAbsolute) {
			var current  = F.current,
				viewport = F.getViewport(),
				margin   = current.margin,
				width    = F.wrap.width()  + margin[1] + margin[3],
				height   = F.wrap.height() + margin[0] + margin[2],
				rez      = {
					position: 'absolute',
					top  : margin[0],
					left : margin[3]
				};

			if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
				rez.position = 'fixed';

			} else if (!current.locked) {
				rez.top  += viewport.y;
				rez.left += viewport.x;
			}

			rez.top  = getValue(Math.max(rez.top,  rez.top  + ((viewport.h - height) * current.topRatio)));
			rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width)  * current.leftRatio)));

			return rez;
		},

		_afterZoomIn: function () {
			var current = F.current;

			if (!current) {
				return;
			}

			F.isOpen = F.isOpened = true;

			F.wrap.css('overflow', 'visible').addClass('fancybox-opened');

			F.update();

			// Assign a click event
			if ( current.closeClick || (current.nextClick && F.group.length > 1) ) {
				F.inner.css('cursor', 'pointer').bind('click.fb', function(e) {
					if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
						e.preventDefault();

						F[ current.closeClick ? 'close' : 'next' ]();
					}
				});
			}

			// Create a close button
			if (current.closeBtn) {
				$(current.tpl.closeBtn).appendTo(F.skin).bind('click.fb', function(e) {
					e.preventDefault();

					F.close();
				});
			}

			// Create navigation arrows
			if (current.arrows && F.group.length > 1) {
				if (current.loop || current.index > 0) {
					$(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
				}

				if (current.loop || current.index < F.group.length - 1) {
					$(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
				}
			}

			F.trigger('afterShow');

			// Stop the slideshow if this is the last item
			if (!current.loop && current.index === current.group.length - 1) {
				F.play( false );

			} else if (F.opts.autoPlay && !F.player.isActive) {
				F.opts.autoPlay = false;

				F.play();
			}
		},

		_afterZoomOut: function ( obj ) {
			obj = obj || F.current;

			$('.fancybox-wrap').trigger('onReset').remove();

			$.extend(F, {
				group  : {},
				opts   : {},
				router : false,
				current   : null,
				isActive  : false,
				isOpened  : false,
				isOpen    : false,
				isClosing : false,
				wrap   : null,
				skin   : null,
				outer  : null,
				inner  : null
			});

			F.trigger('afterClose', obj);
		}
	});

	/*
	 *	Default transitions
	 */

	F.transitions = {
		getOrigPosition: function () {
			var current  = F.current,
				element  = current.element,
				orig     = current.orig,
				pos      = {},
				width    = 50,
				height   = 50,
				hPadding = current.hPadding,
				wPadding = current.wPadding,
				viewport = F.getViewport();

			if (!orig && current.isDom && element.is(':visible')) {
				orig = element.find('img:first');

				if (!orig.length) {
					orig = element;
				}
			}

			if (isQuery(orig)) {
				pos = orig.offset();

				if (orig.is('img')) {
					width  = orig.outerWidth();
					height = orig.outerHeight();
				}

			} else {
				pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
				pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
			}

			if (F.wrap.css('position') === 'fixed' || current.locked) {
				pos.top  -= viewport.y;
				pos.left -= viewport.x;
			}

			pos = {
				top     : getValue(pos.top  - hPadding * current.topRatio),
				left    : getValue(pos.left - wPadding * current.leftRatio),
				width   : getValue(width  + wPadding),
				height  : getValue(height + hPadding)
			};

			return pos;
		},

		step: function (now, fx) {
			var ratio,
				padding,
				value,
				prop       = fx.prop,
				current    = F.current,
				wrapSpace  = current.wrapSpace,
				skinSpace  = current.skinSpace;

			if (prop === 'width' || prop === 'height') {
				ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

				if (F.isClosing) {
					ratio = 1 - ratio;
				}

				padding = prop === 'width' ? current.wPadding : current.hPadding;
				value   = now - padding;

				F.skin[ prop ](  getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) ) );
				F.inner[ prop ]( getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) - (skinSpace * ratio) ) );
			}
		},

		zoomIn: function () {
			var current  = F.current,
				startPos = current.pos,
				effect   = current.openEffect,
				elastic  = effect === 'elastic',
				endPos   = $.extend({opacity : 1}, startPos);

			// Remove "position" property that breaks older IE
			delete endPos.position;

			if (elastic) {
				startPos = this.getOrigPosition();

				if (current.openOpacity) {
					startPos.opacity = 0.1;
				}

			} else if (effect === 'fade') {
				startPos.opacity = 0.1;
			}

			F.wrap.css(startPos).animate(endPos, {
				duration : effect === 'none' ? 0 : current.openSpeed,
				easing   : current.openEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomIn
			});
		},

		zoomOut: function () {
			var current  = F.current,
				effect   = current.closeEffect,
				elastic  = effect === 'elastic',
				endPos   = {opacity : 0.1};

			if (elastic) {
				endPos = this.getOrigPosition();

				if (current.closeOpacity) {
					endPos.opacity = 0.1;
				}
			}

			F.wrap.animate(endPos, {
				duration : effect === 'none' ? 0 : current.closeSpeed,
				easing   : current.closeEasing,
				step     : elastic ? this.step : null,
				complete : F._afterZoomOut
			});
		},

		changeIn: function () {
			var current   = F.current,
				effect    = current.nextEffect,
				startPos  = current.pos,
				endPos    = { opacity : 1 },
				direction = F.direction,
				distance  = 200,
				field;

			startPos.opacity = 0.1;

			if (effect === 'elastic') {
				field = direction === 'down' || direction === 'up' ? 'top' : 'left';

				if (direction === 'down' || direction === 'right') {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
					endPos[ field ]   = '+=' + distance + 'px';

				} else {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
					endPos[ field ]   = '-=' + distance + 'px';
				}
			}

			// Workaround for http://bugs.jquery.com/ticket/12273
			if (effect === 'none') {
				F._afterZoomIn();

			} else {
				F.wrap.css(startPos).animate(endPos, {
					duration : current.nextSpeed,
					easing   : current.nextEasing,
					complete : F._afterZoomIn
				});
			}
		},

		changeOut: function () {
			var previous  = F.previous,
				effect    = previous.prevEffect,
				endPos    = { opacity : 0.1 },
				direction = F.direction,
				distance  = 200;

			if (effect === 'elastic') {
				endPos[ direction === 'down' || direction === 'up' ? 'top' : 'left' ] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
			}

			previous.wrap.animate(endPos, {
				duration : effect === 'none' ? 0 : previous.prevSpeed,
				easing   : previous.prevEasing,
				complete : function () {
					$(this).trigger('onReset').remove();
				}
			});
		}
	};

	/*
	 *	Overlay helper
	 */

	F.helpers.overlay = {
		defaults : {
			closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
			speedOut   : 200,       // duration of fadeOut animation
			showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
			css        : {},        // custom CSS properties
			locked     : !isTouch,  // if true, the content will be locked into overlay
			fixed      : true       // if false, the overlay CSS position property will not be set to "fixed"
		},

		overlay : null,      // current handle
		fixed   : false,     // indicates if the overlay has position "fixed"
		el      : $('html'), // element that contains "the lock"

		// Public methods
		create : function(opts) {
			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.close();
			}

			this.overlay = $('<div class="fancybox-overlay"></div>').appendTo( F.coming ? F.coming.parent : opts.parent );
			this.fixed   = false;

			if (opts.fixed && F.defaults.fixed) {
				this.overlay.addClass('fancybox-overlay-fixed');

				this.fixed = true;
			}
		},

		open : function(opts) {
			var that = this;

			opts = $.extend({}, this.defaults, opts);

			if (this.overlay) {
				this.overlay.unbind('.overlay').width('auto').height('auto');

			} else {
				this.create(opts);
			}

			if (!this.fixed) {
				W.bind('resize.overlay', $.proxy( this.update, this) );

				this.update();
			}

			if (opts.closeClick) {
				this.overlay.bind('click.overlay', function(e) {
					if ($(e.target).hasClass('fancybox-overlay')) {
						if (F.isActive) {
							F.close();
						} else {
							that.close();
						}

						return false;
					}
				});
			}

			this.overlay.css( opts.css ).show();
		},

		close : function() {
			var scrollV, scrollH;

			W.unbind('resize.overlay');

			if (this.el.hasClass('fancybox-lock')) {
				$('.fancybox-margin').removeClass('fancybox-margin');

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.removeClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			$('.fancybox-overlay').remove().hide();

			$.extend(this, {
				overlay : null,
				fixed   : false
			});
		},

		// Private, callbacks

		update : function () {
			var width = '100%', offsetWidth;

			// Reset width/height so it will not mess
			this.overlay.width(width).height('100%');

			// jQuery does not return reliable result for IE
			if (IE) {
				offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

				if (D.width() > offsetWidth) {
					width = D.width();
				}

			} else if (D.width() > W.width()) {
				width = D.width();
			}

			this.overlay.width(width).height(D.height());
		},

		// This is where we can manipulate DOM, because later it would cause iframes to reload
		onReady : function (opts, obj) {
			var overlay = this.overlay;

			$('.fancybox-overlay').stop(true, true);

			if (!overlay) {
				this.create(opts);
			}

			if (opts.locked && this.fixed && obj.fixed) {
				if (!overlay) {
					this.margin = D.height() > W.height() ? $('html').css('margin-right').replace("px", "") : false;
				}

				obj.locked = this.overlay.append( obj.wrap );
				obj.fixed  = false;
			}

			if (opts.showEarly === true) {
				this.beforeShow.apply(this, arguments);
			}
		},

		beforeShow : function(opts, obj) {
			var scrollV, scrollH;

			if (obj.locked) {
				if (this.margin !== false) {
					$('*').filter(function(){
						return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap") );
					}).addClass('fancybox-margin');

					this.el.addClass('fancybox-margin');
				}

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.addClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			this.open(opts);
		},

		onUpdate : function() {
			if (!this.fixed) {
				this.update();
			}
		},

		afterClose: function (opts) {
			// Remove overlay if exists and fancyBox is not opening
			// (e.g., it is not being open using afterClose callback)
			//if (this.overlay && !F.isActive) {
			if (this.overlay && !F.coming) {
				this.overlay.fadeOut(opts.speedOut, $.proxy( this.close, this ));
			}
		}
	};

	/*
	 *	Title helper
	 */

	F.helpers.title = {
		defaults : {
			type     : 'float', // 'float', 'inside', 'outside' or 'over',
			position : 'bottom' // 'top' or 'bottom'
		},

		beforeShow: function (opts) {
			var current = F.current,
				text    = current.title,
				type    = opts.type,
				title,
				target;

			if ($.isFunction(text)) {
				text = text.call(current.element, current);
			}

			if (!isString(text) || $.trim(text) === '') {
				return;
			}

			title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');

			switch (type) {
				case 'inside':
					target = F.skin;
				break;

				case 'outside':
					target = F.wrap;
				break;

				case 'over':
					target = F.inner;
				break;

				default: // 'float'
					target = F.skin;

					title.appendTo('body');

					if (IE) {
						title.width( title.width() );
					}

					title.wrapInner('<span class="child"></span>');

					//Increase bottom margin so this title will also fit into viewport
					F.current.margin[2] += Math.abs( getScalar(title.css('margin-bottom')) );
				break;
			}

			title[ (opts.position === 'top' ? 'prependTo'  : 'appendTo') ](target);
		}
	};

	// jQuery plugin initialization
	$.fn.fancybox = function (options) {
		var index,
			that     = $(this),
			selector = this.selector || '',
			run      = function(e) {
				var what = $(this).blur(), idx = index, relType, relVal;

				if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
					relType = options.groupAttr || 'data-fancybox-group';
					relVal  = what.attr(relType);

					if (!relVal) {
						relType = 'rel';
						relVal  = what.get(0)[ relType ];
					}

					if (relVal && relVal !== '' && relVal !== 'nofollow') {
						what = selector.length ? $(selector) : that;
						what = what.filter('[' + relType + '="' + relVal + '"]');
						idx  = what.index(this);
					}

					options.index = idx;

					// Stop an event from bubbling if everything is fine
					if (F.open(what, options) !== false) {
						e.preventDefault();
					}
				}
			};

		options = options || {};
		index   = options.index || 0;

		if (!selector || options.live === false) {
			that.unbind('click.fb-start').bind('click.fb-start', run);

		} else {
			D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
		}

		this.filter('[data-fancybox-start=1]').trigger('click');

		return this;
	};

	// Tests that need a body at doc ready
	D.ready(function() {
		var w1, w2;

		if ( $.scrollbarWidth === undefined ) {
			// http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
			$.scrollbarWidth = function() {
				var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
					child  = parent.children(),
					width  = child.innerWidth() - child.height( 99 ).innerWidth();

				parent.remove();

				return width;
			};
		}

		if ( $.support.fixedPosition === undefined ) {
			$.support.fixedPosition = (function() {
				var elem  = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
					fixed = ( elem[0].offsetTop === 20 || elem[0].offsetTop === 15 );

				elem.remove();

				return fixed;
			}());
		}

		$.extend(F.defaults, {
			scrollbarWidth : $.scrollbarWidth(),
			fixed  : $.support.fixedPosition,
			parent : $('body')
		});

		//Get real width of page scroll-bar
		w1 = $(window).width();

		H.addClass('fancybox-lock-test');

		w2 = $(window).width();

		H.removeClass('fancybox-lock-test');

		$("<style type='text/css'>.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
	});

}(window, document, jQuery));
 /*!
 * Buttons helper for fancyBox
 * version: 1.0.5 (Mon, 15 Oct 2012)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             buttons: {
 *                 position : 'top'
 *             }
 *         }
 *     });
 *
 */

(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	//Add helper object
	F.helpers.buttons = {
		defaults : {
			skipSingle : false, // disables if gallery contains single image
			position   : 'top', // 'top' or 'bottom'
			tpl        : '<div id="fancybox-buttons"><ul><li><a class="btnPrev" title="Previous" href="javascript:;"></a></li><li><a class="btnPlay" title="Start slideshow" href="javascript:;"></a></li><li><a class="btnNext" title="Next" href="javascript:;"></a></li><li><a class="btnToggle" title="Toggle size" href="javascript:;"></a></li><li><a class="btnClose" title="Close" href="javascript:;"></a></li></ul></div>'
		},

		list : null,
		buttons: null,

		beforeLoad: function (opts, obj) {
			//Remove self if gallery do not have at least two items

			if (opts.skipSingle && obj.group.length < 2) {
				obj.helpers.buttons = false;
				obj.closeBtn = true;

				return;
			}

			//Increase top margin to give space for buttons
			obj.margin[ opts.position === 'bottom' ? 2 : 0 ] += 30;
		},

		onPlayStart: function () {
			if (this.buttons) {
				this.buttons.play.attr('title', 'Pause slideshow').addClass('btnPlayOn');
			}
		},

		onPlayEnd: function () {
			if (this.buttons) {
				this.buttons.play.attr('title', 'Start slideshow').removeClass('btnPlayOn');
			}
		},

		afterShow: function (opts, obj) {
			var buttons = this.buttons;

			if (!buttons) {
				this.list = $(opts.tpl).addClass(opts.position).appendTo('body');

				buttons = {
					prev   : this.list.find('.btnPrev').click( F.prev ),
					next   : this.list.find('.btnNext').click( F.next ),
					play   : this.list.find('.btnPlay').click( F.play ),
					toggle : this.list.find('.btnToggle').click( F.toggle ),
					close  : this.list.find('.btnClose').click( F.close )
				}
			}

			//Prev
			if (obj.index > 0 || obj.loop) {
				buttons.prev.removeClass('btnDisabled');
			} else {
				buttons.prev.addClass('btnDisabled');
			}

			//Next / Play
			if (obj.loop || obj.index < obj.group.length - 1) {
				buttons.next.removeClass('btnDisabled');
				buttons.play.removeClass('btnDisabled');

			} else {
				buttons.next.addClass('btnDisabled');
				buttons.play.addClass('btnDisabled');
			}

			this.buttons = buttons;

			this.onUpdate(opts, obj);
		},

		onUpdate: function (opts, obj) {
			var toggle;

			if (!this.buttons) {
				return;
			}

			toggle = this.buttons.toggle.removeClass('btnDisabled btnToggleOn');

			//Size toggle button
			if (obj.canShrink) {
				toggle.addClass('btnToggleOn');

			} else if (!obj.canExpand) {
				toggle.addClass('btnDisabled');
			}
		},

		beforeClose: function () {
			if (this.list) {
				this.list.remove();
			}

			this.list    = null;
			this.buttons = null;
		}
	};

}(jQuery));
 /*!
 * Thumbnail helper for fancyBox
 * version: 1.0.7 (Mon, 01 Oct 2012)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             thumbs: {
 *                 width  : 50,
 *                 height : 50
 *             }
 *         }
 *     });
 *
 */

(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	//Add helper object
	F.helpers.thumbs = {
		defaults : {
			width    : 50,       // thumbnail width
			height   : 50,       // thumbnail height
			position : 'bottom', // 'top' or 'bottom'
			source   : function ( item ) {  // function to obtain the URL of the thumbnail image
				var href;

				if (item.element) {
					href = $(item.element).find('img').attr('src');
				}

				if (!href && item.type === 'image' && item.href) {
					href = item.href;
				}

				return href;
			}
		},

		wrap  : null,
		list  : null,
		width : 0,

		init: function (opts, obj) {
			var that = this,
				list,
				thumbWidth  = opts.width,
				thumbHeight = opts.height,
				thumbSource = opts.source;

			//Build list structure
			list = '';

			for (var n = 0; n < obj.group.length; n++) {
				list += '<li><a style="width:' + thumbWidth + 'px;height:' + thumbHeight + 'px;" href="javascript:jQuery.fancybox.jumpto(' + n + ');"></a></li>';
			}

			this.wrap = $('<div id="fancybox-thumbs"></div>').addClass(opts.position).appendTo('body');
			this.list = $('<ul>' + list + '</ul>').appendTo(this.wrap);

			//Load each thumbnail
			$.each(obj.group, function (i) {
				var href = thumbSource( obj.group[ i ] );

				if (!href) {
					return;
				}

				$("<img />").load(function () {
					var width  = this.width,
						height = this.height,
						widthRatio, heightRatio, parent;

					if (!that.list || !width || !height) {
						return;
					}

					//Calculate thumbnail width/height and center it
					widthRatio  = width / thumbWidth;
					heightRatio = height / thumbHeight;

					parent = that.list.children().eq(i).find('a');

					if (widthRatio >= 1 && heightRatio >= 1) {
						if (widthRatio > heightRatio) {
							width  = Math.floor(width / heightRatio);
							height = thumbHeight;

						} else {
							width  = thumbWidth;
							height = Math.floor(height / widthRatio);
						}
					}

					$(this).css({
						width  : width,
						height : height,
						top    : Math.floor(thumbHeight / 2 - height / 2),
						left   : Math.floor(thumbWidth / 2 - width / 2)
					});

					parent.width(thumbWidth).height(thumbHeight);

					$(this).hide().appendTo(parent).fadeIn(300);

				}).attr('src', href);
			});

			//Set initial width
			this.width = this.list.children().eq(0).outerWidth(true);

			this.list.width(this.width * (obj.group.length + 1)).css('left', Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5)));
		},

		beforeLoad: function (opts, obj) {
			//Remove self if gallery do not have at least two items
			if (obj.group.length < 2) {
				obj.helpers.thumbs = false;

				return;
			}

			//Increase bottom margin to give space for thumbs
			obj.margin[ opts.position === 'top' ? 0 : 2 ] += ((opts.height) + 15);
		},

		afterShow: function (opts, obj) {
			//Check if exists and create or update list
			if (this.list) {
				this.onUpdate(opts, obj);

			} else {
				this.init(opts, obj);
			}

			//Set active element
			this.list.children().removeClass('active').eq(obj.index).addClass('active');
		},

		//Center list
		onUpdate: function (opts, obj) {
			if (this.list) {
				this.list.stop(true).animate({
					'left': Math.floor($(window).width() * 0.5 - (obj.index * this.width + this.width * 0.5))
				}, 150);
			}
		},

		beforeClose: function () {
			if (this.wrap) {
				this.wrap.remove();
			}

			this.wrap  = null;
			this.list  = null;
			this.width = 0;
		}
	}

}(jQuery));
/*!
 * Media helper for fancyBox
 * version: 1.0.6 (Fri, 14 Jun 2013)
 * @requires fancyBox v2.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             media: true
 *         }
 *     });
 *
 * Set custom URL parameters:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             media: {
 *                 youtube : {
 *                     params : {
 *                         autoplay : 0
 *                     }
 *                 }
 *             }
 *         }
 *     });
 *
 * Or:
 *     $(".fancybox").fancybox({,
 *         helpers : {
 *             media: true
 *         },
 *         youtube : {
 *             autoplay: 0
 *         }
 *     });
 *
 *  Supports:
 *
 *      Youtube
 *          http://www.youtube.com/watch?v=opj24KnzrWo
 *          http://www.youtube.com/embed/opj24KnzrWo
 *          http://youtu.be/opj24KnzrWo
 *			http://www.youtube-nocookie.com/embed/opj24KnzrWo
 *      Vimeo
 *          http://vimeo.com/40648169
 *          http://vimeo.com/channels/staffpicks/38843628
 *          http://vimeo.com/groups/surrealism/videos/36516384
 *          http://player.vimeo.com/video/45074303
 *      Metacafe
 *          http://www.metacafe.com/watch/7635964/dr_seuss_the_lorax_movie_trailer/
 *          http://www.metacafe.com/watch/7635964/
 *      Dailymotion
 *          http://www.dailymotion.com/video/xoytqh_dr-seuss-the-lorax-premiere_people
 *      Twitvid
 *          http://twitvid.com/QY7MD
 *      Twitpic
 *          http://twitpic.com/7p93st
 *      Instagram
 *          http://instagr.am/p/IejkuUGxQn/
 *          http://instagram.com/p/IejkuUGxQn/
 *      Google maps
 *          http://maps.google.com/maps?q=Eiffel+Tower,+Avenue+Gustave+Eiffel,+Paris,+France&t=h&z=17
 *          http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
 *          http://maps.google.com/?ll=48.859463,2.292626&spn=0.000965,0.002642&t=m&z=19&layer=c&cbll=48.859524,2.292532&panoid=YJ0lq28OOy3VT2IqIuVY0g&cbp=12,151.58,,0,-15.56
 */

(function ($) {
	"use strict";

	//Shortcut for fancyBox object
	var F = $.fancybox,
		format = function( url, rez, params ) {
			params = params || '';

			if ( $.type( params ) === "object" ) {
				params = $.param(params, true);
			}

			$.each(rez, function(key, value) {
				url = url.replace( '$' + key, value || '' );
			});

			if (params.length) {
				url += ( url.indexOf('?') > 0 ? '&' : '?' ) + params;
			}

			return url;
		};

	//Add helper object
	F.helpers.media = {
		defaults : {
			youtube : {
				matcher : /(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*)).*/i,
				params  : {
					autoplay    : 1,
					autohide    : 1,
					fs          : 1,
					rel         : 0,
					hd          : 1,
					wmode       : 'opaque',
					enablejsapi : 1
				},
				type : 'iframe',
				url  : '//www.youtube.com/embed/$3'
			},
			vimeo : {
				matcher : /(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/,
				params  : {
					autoplay      : 1,
					hd            : 1,
					show_title    : 1,
					show_byline   : 1,
					show_portrait : 0,
					fullscreen    : 1
				},
				type : 'iframe',
				url  : '//player.vimeo.com/video/$1'
			},
			metacafe : {
				matcher : /metacafe.com\/(?:watch|fplayer)\/([\w\-]{1,10})/,
				params  : {
					autoPlay : 'yes'
				},
				type : 'swf',
				url  : function( rez, params, obj ) {
					obj.swf.flashVars = 'playerVars=' + $.param( params, true );

					return '//www.metacafe.com/fplayer/' + rez[1] + '/.swf';
				}
			},
			dailymotion : {
				matcher : /dailymotion.com\/video\/(.*)\/?(.*)/,
				params  : {
					additionalInfos : 0,
					autoStart : 1
				},
				type : 'swf',
				url  : '//www.dailymotion.com/swf/video/$1'
			},
			twitvid : {
				matcher : /twitvid\.com\/([a-zA-Z0-9_\-\?\=]+)/i,
				params  : {
					autoplay : 0
				},
				type : 'iframe',
				url  : '//www.twitvid.com/embed.php?guid=$1'
			},
			twitpic : {
				matcher : /twitpic\.com\/(?!(?:place|photos|events)\/)([a-zA-Z0-9\?\=\-]+)/i,
				type : 'image',
				url  : '//twitpic.com/show/full/$1/'
			},
			instagram : {
				matcher : /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
				type : 'image',
				url  : '//$1/p/$2/media/?size=l'
			},
			google_maps : {
				matcher : /maps\.google\.([a-z]{2,3}(\.[a-z]{2})?)\/(\?ll=|maps\?)(.*)/i,
				type : 'iframe',
				url  : function( rez ) {
					return '//maps.google.' + rez[1] + '/' + rez[3] + '' + rez[4] + '&output=' + (rez[4].indexOf('layer=c') > 0 ? 'svembed' : 'embed');
				}
			}
		},

		beforeLoad : function(opts, obj) {
			var url   = obj.href || '',
				type  = false,
				what,
				item,
				rez,
				params;

			for (what in opts) {
				if (opts.hasOwnProperty(what)) {
					item = opts[ what ];
					rez  = url.match( item.matcher );

					if (rez) {
						type   = item.type;
						params = $.extend(true, {}, item.params, obj[ what ] || ($.isPlainObject(opts[ what ]) ? opts[ what ].params : null));

						url = $.type( item.url ) === "function" ? item.url.call( this, rez, params, obj ) : format( item.url, rez, params );

						break;
					}
				}
			}

			if (type) {
				obj.href = url;
				obj.type = type;

				obj.autoHeight = false;
			}
		}
	};

}(jQuery));




(function() {
  var CSRFToken, allowLinkExtensions, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsCustomEvents, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, historyStateIsDefined, htmlExtensions, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  pageCache = {};

  cacheSize = 10;

  currentState = null;

  loadedAssets = null;

  htmlExtensions = ['html'];

  referer = null;

  createDocument = null;

  xhr = null;

  fetchReplacement = function(url) {
    rememberReferer();
    cacheCurrentPage();
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        resetScrollPosition();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    cacheCurrentPage();
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (!(key <= currentState.position - limit)) {
        continue;
      }
      triggerEvent('page:expire', pageCache[key]);
      pageCache[key] = null;
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function(node) {
    node.innerHTML = node.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/ig, '');
    return node;
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, removeNoscriptTags(doc.body), CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(new RegExp("\\.(?:" + (htmlExtensions.join('|')) + ")?(\\?.*)?$", 'g'));
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  allowLinkExtensions = function() {
    var extension, extensions, _i, _len;
    extensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      extension = extensions[_i];
      htmlExtensions.push(extension);
    }
    return htmlExtensions;
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.position]) {
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', installHistoryChangeHandler, false);
  };

  historyStateIsDefined = window.history.state !== void 0 || navigator.userAgent.match(/Firefox\/26/);

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && historyStateIsDefined;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  browserSupportsCustomEvents = document.addEventListener && document.createEvent;

  if (browserSupportsCustomEvents) {
    installDocumentReadyPageEventTriggers();
    installJqueryAjaxSuccessPageUpdateTrigger();
  }

  if (browserSupportsTurbolinks) {
    visit = fetchReplacement;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    allowLinkExtensions: allowLinkExtensions,
    supported: browserSupportsTurbolinks
  };

}).call(this);
/**
* bootstrap-formhelpers.js v2.3.0 by @vincentlamanna
* Copyright 2013 Vincent Lamanna
* http://www.apache.org/licenses/LICENSE-2.0
*/

if(!jQuery)throw new Error("Bootstrap Form Helpers requires jQuery");var BFHCountriesList={AF:"Afghanistan",AL:"Albania",DZ:"Algeria",AS:"American Samoa",AD:"Andorra",AO:"Angola",AI:"Anguilla",AQ:"Antarctica",AG:"Antigua and Barbuda",AR:"Argentina",AM:"Armenia",AW:"Aruba",AU:"Australia",AT:"Austria",AZ:"Azerbaijan",BH:"Bahrain",BD:"Bangladesh",BB:"Barbados",BY:"Belarus",BE:"Belgium",BZ:"Belize",BJ:"Benin",BM:"Bermuda",BT:"Bhutan",BO:"Bolivia",BA:"Bosnia and Herzegovina",BW:"Botswana",BV:"Bouvet Island",BR:"Brazil",IO:"British Indian Ocean Territory",VG:"British Virgin Islands",BN:"Brunei",BG:"Bulgaria",BF:"Burkina Faso",BI:"Burundi",CI:"Côte d'Ivoire",KH:"Cambodia",CM:"Cameroon",CA:"Canada",CV:"Cape Verde",KY:"Cayman Islands",CF:"Central African Republic",TD:"Chad",CL:"Chile",CN:"China",CX:"Christmas Island",CC:"Cocos (Keeling) Islands",CO:"Colombia",KM:"Comoros",CG:"Congo",CK:"Cook Islands",CR:"Costa Rica",HR:"Croatia",CU:"Cuba",CY:"Cyprus",CZ:"Czech Republic",CD:"Democratic Republic of the Congo",DK:"Denmark",DJ:"Djibouti",DM:"Dominica",DO:"Dominican Republic",TP:"East Timor",EC:"Ecuador",EG:"Egypt",SV:"El Salvador",GQ:"Equatorial Guinea",ER:"Eritrea",EE:"Estonia",ET:"Ethiopia",FO:"Faeroe Islands",FK:"Falkland Islands",FJ:"Fiji",FI:"Finland",MK:"Former Yugoslav Republic of Macedonia",FR:"France",FX:"France, Metropolitan",GF:"French Guiana",PF:"French Polynesia",TF:"French Southern Territories",GA:"Gabon",GE:"Georgia",DE:"Germany",GH:"Ghana",GI:"Gibraltar",GR:"Greece",GL:"Greenland",GD:"Grenada",GP:"Guadeloupe",GU:"Guam",GT:"Guatemala",GN:"Guinea",GW:"Guinea-Bissau",GY:"Guyana",HT:"Haiti",HM:"Heard and Mc Donald Islands",HN:"Honduras",HK:"Hong Kong",HU:"Hungary",IS:"Iceland",IN:"India",ID:"Indonesia",IR:"Iran",IQ:"Iraq",IE:"Ireland",IL:"Israel",IT:"Italy",JM:"Jamaica",JP:"Japan",JO:"Jordan",KZ:"Kazakhstan",KE:"Kenya",KI:"Kiribati",KW:"Kuwait",KG:"Kyrgyzstan",LA:"Laos",LV:"Latvia",LB:"Lebanon",LS:"Lesotho",LR:"Liberia",LY:"Libya",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MO:"Macau",MG:"Madagascar",MW:"Malawi",MY:"Malaysia",MV:"Maldives",ML:"Mali",MT:"Malta",MH:"Marshall Islands",MQ:"Martinique",MR:"Mauritania",MU:"Mauritius",YT:"Mayotte",MX:"Mexico",FM:"Micronesia",MD:"Moldova",MC:"Monaco",MN:"Mongolia",ME:"Montenegro",MS:"Montserrat",MA:"Morocco",MZ:"Mozambique",MM:"Myanmar",NA:"Namibia",NR:"Nauru",NP:"Nepal",NL:"Netherlands",AN:"Netherlands Antilles",NC:"New Caledonia",NZ:"New Zealand",NI:"Nicaragua",NE:"Niger",NG:"Nigeria",NU:"Niue",NF:"Norfolk Island",KP:"North Korea",MP:"Northern Marianas",NO:"Norway",OM:"Oman",PK:"Pakistan",PW:"Palau",PS:"Palestine",PA:"Panama",PG:"Papua New Guinea",PY:"Paraguay",PE:"Peru",PH:"Philippines",PN:"Pitcairn Islands",PL:"Poland",PT:"Portugal",PR:"Puerto Rico",QA:"Qatar",RE:"Reunion",RO:"Romania",RU:"Russia",RW:"Rwanda",ST:"São Tomé and Príncipe",SH:"Saint Helena",PM:"St. Pierre and Miquelon",KN:"Saint Kitts and Nevis",LC:"Saint Lucia",VC:"Saint Vincent and the Grenadines",WS:"Samoa",SM:"San Marino",SA:"Saudi Arabia",SN:"Senegal",RS:"Serbia",SC:"Seychelles",SL:"Sierra Leone",SG:"Singapore",SK:"Slovakia",SI:"Slovenia",SB:"Solomon Islands",SO:"Somalia",ZA:"South Africa",GS:"South Georgia and the South Sandwich Islands",KR:"South Korea",ES:"Spain",LK:"Sri Lanka",SD:"Sudan",SR:"Suriname",SJ:"Svalbard and Jan Mayen Islands",SZ:"Swaziland",SE:"Sweden",CH:"Switzerland",SY:"Syria",TW:"Taiwan",TJ:"Tajikistan",TZ:"Tanzania",TH:"Thailand",BS:"The Bahamas",GM:"The Gambia",TG:"Togo",TK:"Tokelau",TO:"Tonga",TT:"Trinidad and Tobago",TN:"Tunisia",TR:"Turkey",TM:"Turkmenistan",TC:"Turks and Caicos Islands",TV:"Tuvalu",VI:"US Virgin Islands",UG:"Uganda",UA:"Ukraine",AE:"United Arab Emirates",GB:"United Kingdom",US:"United States",UM:"United States Minor Outlying Islands",UY:"Uruguay",UZ:"Uzbekistan",VU:"Vanuatu",VA:"Vatican City",VE:"Venezuela",VN:"Vietnam",WF:"Wallis and Futuna Islands",EH:"Western Sahara",YE:"Yemen",ZM:"Zambia",ZW:"Zimbabwe"},BFHCurrenciesList={AED:{label:"United Arab Emirates dirham",currencyflag:"",symbol:"د.إ"},AFN:{label:"Afghan afghani",currencyflag:"",symbol:"؋"},ALL:{label:"Albanian lek",currencyflag:"",symbol:"L"},AMD:{label:"Armenian dram",currencyflag:"",symbol:"դր"},AOA:{label:"Angolan kwanza",currencyflag:"",symbol:"Kz"},ARS:{label:"Argentine peso",currencyflag:"",symbol:"$"},AUD:{label:"Australian dollar",currencyflag:"AUD",symbol:"$"},AWG:{label:"Aruban florin",currencyflag:"",symbol:"ƒ"},AZN:{label:"Azerbaijani manat",currencyflag:"",symbol:""},BAM:{label:"Bosnia and Herzegovina convertible mark",currencyflag:"",symbol:"KM"},BBD:{label:"Barbadian dollar",currencyflag:"",symbol:"$"},BDT:{label:"Bangladeshi taka",currencyflag:"",symbol:"৳"},BGN:{label:"Bulgarian lev",currencyflag:"",symbol:"лв"},BHD:{label:"Bahraini dinar",currencyflag:"",symbol:".د.ب"},BIF:{label:"Burundian franc",currencyflag:"",symbol:"Fr"},BMD:{label:"Bermudian dollar",currencyflag:"",symbol:"$"},BND:{label:"Brunei dollar",currencyflag:"",symbol:"$"},BOB:{label:"Bolivian boliviano",currencyflag:"",symbol:"Bs"},BRL:{label:"Brazilian real",currencyflag:"",symbol:"R$"},BSD:{label:"Bahamian dollar",currencyflag:"",symbol:"$"},BTN:{label:"Bhutanese ngultrum",currencyflag:"",symbol:"Nu"},BWP:{label:"Botswana pula",currencyflag:"",symbol:"P"},BYR:{label:"Belarusian ruble",currencyflag:"",symbol:"Br"},BZD:{label:"Belize dollar",currencyflag:"",symbol:"$"},CAD:{label:"Canadian dollar",currencyflag:"",symbol:"$"},CDF:{label:"Congolese franc",currencyflag:"",symbol:"Fr"},CHF:{label:"Swiss franc",currencyflag:"CHF",symbol:"Fr"},CLP:{label:"Chilean peso",currencyflag:"",symbol:"$"},CNY:{label:"Chinese yuan",currencyflag:"",symbol:"¥"},COP:{label:"Colombian peso",currencyflag:"",symbol:"$"},CRC:{label:"Costa Rican colón",currencyflag:"",symbol:"₡"},CUP:{label:"Cuban convertible peso",currencyflag:"",symbol:"$"},CVE:{label:"Cape Verdean escudo",currencyflag:"",symbol:"$"},CZK:{label:"Czech koruna",currencyflag:"",symbol:"Kč"},DJF:{label:"Djiboutian franc",currencyflag:"",symbol:"Fr"},DKK:{label:"Danish krone",currencyflag:"DKK",symbol:"kr"},DOP:{label:"Dominican peso",currencyflag:"",symbol:"$"},DZD:{label:"Algerian dinar",currencyflag:"",symbol:"د.ج"},EGP:{label:"Egyptian pound",currencyflag:"",symbol:"ج.م"},ERN:{label:"Eritrean nakfa",currencyflag:"",symbol:"Nfk"},ETB:{label:"Ethiopian birr",currencyflag:"",symbol:"Br"},EUR:{label:"Euro",currencyflag:"EUR",symbol:"€"},FJD:{label:"Fijian dollar",currencyflag:"",symbol:"$"},FKP:{label:"Falkland Islands pound",currencyflag:"",symbol:"£"},GBP:{label:"British pound",currencyflag:"",symbol:"£"},GEL:{label:"Georgian lari",currencyflag:"",symbol:"ლ"},GHS:{label:"Ghana cedi",currencyflag:"",symbol:"₵"},GMD:{label:"Gambian dalasi",currencyflag:"",symbol:"D"},GNF:{label:"Guinean franc",currencyflag:"",symbol:"Fr"},GTQ:{label:"Guatemalan quetzal",currencyflag:"",symbol:"Q"},GYD:{label:"Guyanese dollar",currencyflag:"",symbol:"$"},HKD:{label:"Hong Kong dollar",currencyflag:"",symbol:"$"},HNL:{label:"Honduran lempira",currencyflag:"",symbol:"L"},HRK:{label:"Croatian kuna",currencyflag:"",symbol:"kn"},HTG:{label:"Haitian gourde",currencyflag:"",symbol:"G"},HUF:{label:"Hungarian forint",currencyflag:"",symbol:"Ft"},IDR:{label:"Indonesian rupiah",currencyflag:"",symbol:"Rp"},ILS:{label:"Israeli new shekel",currencyflag:"",symbol:"₪"},IMP:{label:"Manx pound",currencyflag:"",symbol:"£"},INR:{label:"Indian rupee",currencyflag:"",symbol:""},IQD:{label:"Iraqi dinar",currencyflag:"",symbol:"ع.د"},IRR:{label:"Iranian rial",currencyflag:"",symbol:"﷼"},ISK:{label:"Icelandic króna",currencyflag:"",symbol:"kr"},JEP:{label:"Jersey pound",currencyflag:"",symbol:"£"},JMD:{label:"Jamaican dollar",currencyflag:"",symbol:"$"},JOD:{label:"Jordanian dinar",currencyflag:"",symbol:"د.ا"},JPY:{label:"Japanese yen",currencyflag:"",symbol:"¥"},KES:{label:"Kenyan shilling",currencyflag:"",symbol:"Sh"},KGS:{label:"Kyrgyzstani som",currencyflag:"",symbol:"лв"},KHR:{label:"Cambodian riel",currencyflag:"",symbol:"៛"},KMF:{label:"Comorian franc",currencyflag:"",symbol:"Fr"},KPW:{label:"North Korean won",currencyflag:"",symbol:"₩"},KRW:{label:"South Korean won",currencyflag:"",symbol:"₩"},KWD:{label:"Kuwaiti dinar",currencyflag:"",symbol:"د.ك"},KYD:{label:"Cayman Islands dollar",currencyflag:"",symbol:"$"},KZT:{label:"Kazakhstani tenge",currencyflag:"",symbol:"₸"},LAK:{label:"Lao kip",currencyflag:"",symbol:"₭"},LBP:{label:"Lebanese pound",currencyflag:"",symbol:"ل.ل"},LKR:{label:"Sri Lankan rupee",currencyflag:"",symbol:"Rs"},LRD:{label:"Liberian dollar",currencyflag:"",symbol:"$"},LSL:{label:"Lesotho loti",currencyflag:"",symbol:"L"},LTL:{label:"Lithuanian litas",currencyflag:"",symbol:"Lt"},LVL:{label:"Latvian lats",currencyflag:"",symbol:"Ls"},LYD:{label:"Libyan dinar",currencyflag:"",symbol:"ل.د"},MAD:{label:"Moroccan dirham",currencyflag:"",symbol:"د.م."},MDL:{label:"Moldovan leu",currencyflag:"",symbol:"L"},MGA:{label:"Malagasy ariary",currencyflag:"",symbol:"Ar"},MKD:{label:"Macedonian denar",currencyflag:"",symbol:"ден"},MMK:{label:"Burmese kyat",currencyflag:"",symbol:"Ks"},MNT:{label:"Mongolian tögrög",currencyflag:"",symbol:"₮"},MOP:{label:"Macanese pataca",currencyflag:"",symbol:"P"},MRO:{label:"Mauritanian ouguiya",currencyflag:"",symbol:"UM"},MUR:{label:"Mauritian rupee",currencyflag:"",symbol:"Rs"},MVR:{label:"Maldivian rufiyaa",currencyflag:"",symbol:".ރ"},MWK:{label:"Malawian kwacha",currencyflag:"",symbol:"MK"},MXN:{label:"Mexican peso",currencyflag:"",symbol:"$"},MYR:{label:"Malaysian ringgit",currencyflag:"",symbol:"MR"},MZN:{label:"Mozambican metical",currencyflag:"",symbol:"MT"},NAD:{label:"Namibian dollar",currencyflag:"",symbol:"$"},NGN:{label:"Nigerian naira",currencyflag:"",symbol:"₦"},NIO:{label:"Nicaraguan córdoba",currencyflag:"",symbol:"C$"},NOK:{label:"Norwegian krone",currencyflag:"",symbol:"kr"},NPR:{label:"Nepalese rupee",currencyflag:"",symbol:"Rs"},NZD:{label:"New Zealand dollar",currencyflag:"",symbol:"$"},OMR:{label:"Omani rial",currencyflag:"",symbol:"ر.ع."},PAB:{label:"Panamanian balboa",currencyflag:"",symbol:"B/."},PEN:{label:"Peruvian nuevo sol",currencyflag:"",symbol:"S/."},PGK:{label:"Papua New Guinean kina",currencyflag:"",symbol:"K"},PHP:{label:"Philippine peso",currencyflag:"",symbol:"₱"},PKR:{label:"Pakistani rupee",currencyflag:"",symbol:"Rs"},PLN:{label:"Polish złoty",currencyflag:"",symbol:"zł"},PRB:{label:"Transnistrian ruble",currencyflag:"",symbol:"р."},PYG:{label:"Paraguayan guaraní",currencyflag:"",symbol:"₲"},QAR:{label:"Qatari riyal",currencyflag:"",symbol:"ر.ق"},RON:{label:"Romanian leu",currencyflag:"",symbol:"L"},RSD:{label:"Serbian dinar",currencyflag:"",symbol:"дин"},RUB:{label:"Russian ruble",currencyflag:"",symbol:"руб."},RWF:{label:"Rwandan franc",currencyflag:"",symbol:"Fr"},SAR:{label:"Saudi riyal",currencyflag:"",symbol:"ر.س"},SBD:{label:"Solomon Islands dollar",currencyflag:"",symbol:"$"},SCR:{label:"Seychellois rupee",currencyflag:"",symbol:"Rs"},SDG:{label:"Singapore dollar",currencyflag:"",symbol:"$"},SEK:{label:"Swedish krona",currencyflag:"",symbol:"kr"},SGD:{label:"Singapore dollar",currencyflag:"",symbol:"$"},SHP:{label:"Saint Helena pound",currencyflag:"",symbol:"£"},SLL:{label:"Sierra Leonean leone",currencyflag:"",symbol:"Le"},SOS:{label:"Somali shilling",currencyflag:"",symbol:"Sh"},SRD:{label:"Surinamese dollar",currencyflag:"",symbol:"$"},SSP:{label:"South Sudanese pound",currencyflag:"",symbol:"£"},STD:{label:"São Tomé and Príncipe dobra",currencyflag:"",symbol:"Db"},SVC:{label:"Salvadoran colón",currencyflag:"",symbol:"₡"},SYP:{label:"Syrian pound",currencyflag:"",symbol:"£"},SZL:{label:"Swazi lilangeni",currencyflag:"",symbol:"L"},THB:{label:"Thai baht",currencyflag:"",symbol:"฿"},TJS:{label:"Tajikistani somoni",currencyflag:"",symbol:"SM"},TMT:{label:"Turkmenistan manat",currencyflag:"",symbol:"m"},TND:{label:"Tunisian dinar",currencyflag:"",symbol:"د.ت"},TOP:{label:"Tongan paʻanga",currencyflag:"",symbol:"T$"},TRY:{label:"Turkish lira",currencyflag:"",symbol:"&#8378;"},TTD:{label:"Trinidad and Tobago dollar",currencyflag:"",symbol:"$"},TWD:{label:"New Taiwan dollar",currencyflag:"",symbol:"$"},TZS:{label:"Tanzanian shilling",currencyflag:"",symbol:"Sh"},UAH:{label:"Ukrainian hryvnia",currencyflag:"",symbol:"₴"},UGX:{label:"Ugandan shilling",currencyflag:"",symbol:"Sh"},USD:{label:"United States dollar",currencyflag:"",symbol:"$"},UYU:{label:"Uruguayan peso",currencyflag:"",symbol:"$"},UZS:{label:"Uzbekistani som",currencyflag:"",symbol:"лв"},VEF:{label:"Venezuelan bolívar",currencyflag:"",symbol:"Bs F"},VND:{label:"Vietnamese đồng",currencyflag:"",symbol:"₫"},VUV:{label:"Vanuatu vatu",currencyflag:"",symbol:"Vt"},WST:{label:"Samoan tālā",currencyflag:"",symbol:"T"},XAF:{label:"Central African CFA franc",currencyflag:"XAF",symbol:"Fr"},XCD:{label:"East Caribbean dollar",currencyflag:"XCD",symbol:"$"},XOF:{label:"West African CFA franc",currencyflag:"XOF",symbol:"Fr"},XPF:{label:"CFP franc",currencyflag:"XPF",symbol:"Fr"},YER:{label:"Yemeni rial",currencyflag:"",symbol:"﷼"},ZAR:{label:"South African rand",currencyflag:"ZAR",symbol:"R"},ZMW:{label:"Zambian kwacha",currencyflag:"",symbol:"ZK"},ZWL:{label:"Zimbabwean dollar",currencyflag:"",symbol:"$"}},BFHMonthsList=["January","February","March","April","May","June","July","August","September","October","November","December"],BFHDaysList=["SUN","MON","TUE","WED","THU","FRI","SAT"],BFHDayOfWeekStart=0,BFHFontsList={"Andale Mono":'"Andale Mono", AndaleMono, monospace',Arial:'Arial, "Helvetica Neue", Helvetica, sans-serif',"Arial Black":'"Arial Black", "Arial Bold", Gadget, sans-serif',"Arial Narrow":'"Arial Narrow", Arial, sans-serif',"Arial Rounded MT Bold":'"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif',"Avant Garde":'"Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif',Baskerville:'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',"Big Caslon":'"Big Caslon", "Book Antiqua", "Palatino Linotype", Georgia, serif',"Bodoni MT":'"Bodoni MT", Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif',"Book Antiqua":'"Book Antiqua", Palatino, "Palatino Linotype", "Palatino LT STD", Georgia, serif',"Brush Script MT":'"Brush Script MT", cursive',Calibri:'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',"Calisto MT":'"Calisto MT", "Bookman Old Style", Bookman, "Goudy Old Style", Garamond, "Hoefler Text", "Bitstream Charter", Georgia, serif',Cambrio:"Cambria, Georgia, serif",Candara:'Candara, Calibri, Segoe, "Segoe UI", Optima, Arial, sans-serif',"Century Gothic":'"Century Gothic", CenturyGothic, AppleGothic, sans-serif',Consolas:"Consolas, monaco, monospace",Copperplate:'Copperplate, "Copperplate Gothic Light", fantasy',"Courier New":'"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',Didot:'Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif',"Franklin Gothic Medium":'"Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", Arial, sans-serif',Futura:'Futura, "Trebuchet MS", Arial, sans-serif',Garamond:'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif',Geneva:"Geneva, Tahoma, Verdana, sans-serif",Georgia:'Georgia, Times, "Times New Roman", serif',"Gill Sans":'"Gill Sans", "Gill Sans MT", Calibri, sans-serif',"Goudy Old Style":'"Goudy Old Style", Garamond, "Big Caslon", "Times New Roman", serif',Helvetica:'"Helvetica Neue", Helvetica, Arial, sans-serif',"Hoefler Text":'"Hoefler Text", "Baskerville old face", Garamond, "Times New Roman", serif',Impact:'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", sans serif',"Lucida Bright":'"Lucida Bright", Georgia, serif',"Lucida Console":'"Lucida Console", "Lucida Sans Typewriter", Monaco, "Bitstream Vera Sans Mono", monospace',"Lucida Sans Typewriter":'"Lucida Sans Typewriter", "Lucida Console", Monaco, "Bitstream Vera Sans Mono", monospace',"Lucida Grande":'"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',Monaco:'Monaco, Consolas, "Lucida Console", monospace',Optima:'Optima, Segoe, "Segoe UI", Candara, Calibri, Arial, sans-serif',Palatino:'Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif',Papyrus:"Papyrus, fantasy",Perpetua:'Perpetua, Baskerville, "Big Caslon", "Palatino Linotype", Palatino, "URW Palladio L", "Nimbus Roman No9 L", serif',Rockwell:'Rockwell, "Courier Bold", Courier, Georgia, Times, "Times New Roman", serif',"Rockwell Extra Bold":'"Rockwell Extra Bold", "Rockwell Bold", monospace',"Segoe UI":'"Segoe UI", Frutiger, "Frutiger Linotype',Tahoma:"Tahoma, Verdana, Segoe, sans-serif","Times New Roman":'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif',"Trebuchet MS":'"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',Verdana:"Verdana, Geneva, sans-serif"},BFHFontSizesList={8:"8px",9:"9px",10:"10px",11:"11px",12:"12px",14:"14px",16:"16px",18:"18px",20:"20px",24:"24px",28:"28px",36:"36px",48:"48px"},BFHGoogleFontsList={kind:"webfonts#webfontList",items:[{kind:"webfonts#webfont",family:"ABeeZee",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Abel",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Abril Fatface",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Aclonica",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Acme",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Actor",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Adamina",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Advent Pro",variants:["100","200","300","regular","500","600","700"],subsets:["latin-ext","latin","greek"]},{kind:"webfonts#webfont",family:"Aguafina Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Akronim",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Aladin",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Aldrich",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Alegreya",variants:["regular","italic","700","700italic","900","900italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Alegreya SC",variants:["regular","italic","700","700italic","900","900italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Alex Brush",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Alfa Slab One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Alice",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Alike",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Alike Angular",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Allan",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Allerta",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Allerta Stencil",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Allura",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Almendra",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Almendra Display",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Almendra SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Amarante",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Amaranth",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Amatic SC",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Amethysta",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Anaheim",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Andada",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Andika",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Angkor",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Annie Use Your Telescope",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Anonymous Pro",variants:["regular","italic","700","700italic"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Antic",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Antic Didone",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Antic Slab",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Anton",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Arapey",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Arbutus",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Arbutus Slab",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Architects Daughter",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Archivo Black",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Archivo Narrow",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Arimo",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Arizonia",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Armata",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Artifika",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Arvo",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Asap",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Asset",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Astloch",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Asul",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Atomic Age",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Aubrey",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Audiowide",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Autour One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Average",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Average Sans",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Averia Gruesa Libre",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Averia Libre",variants:["300","300italic","regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Averia Sans Libre",variants:["300","300italic","regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Averia Serif Libre",variants:["300","300italic","regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bad Script",variants:["regular"],subsets:["cyrillic","latin"]},{kind:"webfonts#webfont",family:"Balthazar",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bangers",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Basic",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Battambang",variants:["regular","700"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Baumans",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bayon",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Belgrano",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Belleza",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"BenchNine",variants:["300","regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bentham",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Berkshire Swash",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bevan",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bigelow Rules",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bigshot One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bilbo",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bilbo Swash Caps",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bitter",variants:["regular","italic","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Black Ops One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bokor",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Bonbon",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Boogaloo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bowlby One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bowlby One SC",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Brawler",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Bree Serif",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bubblegum Sans",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Bubbler One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Buda",variants:["300"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Buenard",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Butcherman",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Butterfly Kids",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Cabin",variants:["regular","italic","500","500italic","600","600italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cabin Condensed",variants:["regular","500","600","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cabin Sketch",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Caesar Dressing",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cagliostro",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Calligraffitti",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cambo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Candal",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cantarell",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cantata One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Cantora One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Capriola",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Cardo",variants:["regular","italic","700"],subsets:["greek-ext","latin-ext","latin","greek"]},{kind:"webfonts#webfont",family:"Carme",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Carrois Gothic",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Carrois Gothic SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Carter One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Caudex",variants:["regular","italic","700","700italic"],subsets:["greek-ext","latin-ext","latin","greek"]},{kind:"webfonts#webfont",family:"Cedarville Cursive",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Ceviche One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Changa One",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Chango",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Chau Philomene One",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Chela One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Chelsea Market",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Chenla",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Cherry Cream Soda",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cherry Swash",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Chewy",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Chicle",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Chivo",variants:["regular","italic","900","900italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cinzel",variants:["regular","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cinzel Decorative",variants:["regular","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Clicker Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Coda",variants:["regular","800"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Coda Caption",variants:["800"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Codystar",variants:["300","regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Combo",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Comfortaa",variants:["300","regular","700"],subsets:["cyrillic","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Coming Soon",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Concert One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Condiment",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Content",variants:["regular","700"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Contrail One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Convergence",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cookie",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Copse",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Corben",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Courgette",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Cousine",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Coustard",variants:["regular","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Covered By Your Grace",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Crafty Girls",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Creepster",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Crete Round",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Crimson Text",variants:["regular","italic","600","600italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Croissant One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Crushed",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Cuprum",variants:["regular","italic","700","700italic"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Cutive",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Cutive Mono",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Damion",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Dancing Script",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Dangrek",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Dawning of a New Day",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Days One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Delius",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Delius Swash Caps",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Delius Unicase",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Della Respira",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Devonshire",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Didact Gothic",variants:["regular"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Diplomata",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Diplomata SC",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Doppio One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Dorsa",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Dosis",variants:["200","300","regular","500","600","700","800"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Dr Sugiyama",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Droid Sans",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Droid Sans Mono",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Droid Serif",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Duru Sans",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Dynalight",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"EB Garamond",variants:["regular"],subsets:["cyrillic","latin-ext","latin","vietnamese","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Eagle Lake",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Eater",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Economica",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Electrolize",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Emblema One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Emilys Candy",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Engagement",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Englebert",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Enriqueta",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Erica One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Esteban",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Euphoria Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ewert",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Exo",variants:["100","100italic","200","200italic","300","300italic","regular","italic","500","500italic","600","600italic","700","700italic","800","800italic","900","900italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Expletus Sans",variants:["regular","italic","500","500italic","600","600italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fanwood Text",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fascinate",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fascinate Inline",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Faster One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fasthand",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Federant",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Federo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Felipa",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Fenix",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Finger Paint",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fjord One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Flamenco",variants:["300","regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Flavors",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fondamento",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Fontdiner Swanky",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Forum",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Francois One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Freckle Face",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Fredericka the Great",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fredoka One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Freehand",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Fresca",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Frijole",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Fugaz One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"GFS Didot",variants:["regular"],subsets:["greek"]},{kind:"webfonts#webfont",family:"GFS Neohellenic",variants:["regular","italic","700","700italic"],subsets:["greek"]},{kind:"webfonts#webfont",family:"Gafata",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Galdeano",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Galindo",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Gentium Basic",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Gentium Book Basic",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Geo",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Geostar",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Geostar Fill",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Germania One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Gilda Display",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Give You Glory",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Glass Antiqua",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Glegoo",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Gloria Hallelujah",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Goblin One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Gochi Hand",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Gorditas",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Goudy Bookletter 1911",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Graduate",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Gravitas One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Great Vibes",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Griffy",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Gruppo",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Gudea",variants:["regular","italic","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Habibi",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Hammersmith One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Hanalei",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Hanalei Fill",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Handlee",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Hanuman",variants:["regular","700"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Happy Monkey",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Headland One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Henny Penny",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Herr Von Muellerhoff",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Holtwood One SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Homemade Apple",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Homenaje",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"IM Fell DW Pica",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell DW Pica SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell Double Pica",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell Double Pica SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell English",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell English SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell French Canon",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell French Canon SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell Great Primer",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"IM Fell Great Primer SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Iceberg",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Iceland",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Imprima",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Inconsolata",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Inder",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Indie Flower",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Inika",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Irish Grover",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Istok Web",variants:["regular","italic","700","700italic"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Italiana",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Italianno",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Jacques Francois",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Jacques Francois Shadow",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Jim Nightshade",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Jockey One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Jolly Lodger",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Josefin Sans",variants:["100","100italic","300","300italic","regular","italic","600","600italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Josefin Slab",variants:["100","100italic","300","300italic","regular","italic","600","600italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Joti One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Judson",variants:["regular","italic","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Julee",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Julius Sans One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Junge",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Jura",variants:["300","regular","500","600"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Just Another Hand",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Just Me Again Down Here",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Kameron",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Karla",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Kaushan Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Keania One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Kelly Slab",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Kenia",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Khmer",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Kite One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Knewave",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Kotta One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Koulen",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Kranky",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Kreon",variants:["300","regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Kristi",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Krona One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"La Belle Aurore",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lancelot",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lato",variants:["100","100italic","300","300italic","regular","italic","700","700italic","900","900italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"League Script",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Leckerli One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Ledger",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Lekton",variants:["regular","italic","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Lemon",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Life Savers",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Lilita One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Limelight",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Linden Hill",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lobster",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Lobster Two",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Londrina Outline",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Londrina Shadow",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Londrina Sketch",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Londrina Solid",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lora",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Love Ya Like A Sister",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Loved by the King",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lovers Quarrel",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Luckiest Guy",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lusitana",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Lustria",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Macondo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Macondo Swash Caps",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Magra",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Maiden Orange",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Mako",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Marcellus",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Marcellus SC",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Marck Script",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Margarine",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Marko One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Marmelad",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Marvel",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Mate",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Mate SC",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Maven Pro",variants:["regular","500","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"McLaren",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Meddon",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"MedievalSharp",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Medula One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Megrim",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Meie Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Merienda",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Merienda One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Merriweather",variants:["300","regular","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Metal",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Metal Mania",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Metamorphous",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Metrophobic",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Michroma",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Miltonian",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Miltonian Tattoo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Miniver",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Miss Fajardose",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Modern Antiqua",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Molengo",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Molle",variants:["italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Monofett",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Monoton",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Monsieur La Doulaise",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Montaga",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Montez",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Montserrat",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Montserrat Alternates",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Montserrat Subrayada",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Moul",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Moulpali",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Mountains of Christmas",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Mouse Memoirs",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Mr Bedfort",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Mr Dafoe",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Mr De Haviland",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Mrs Saint Delafield",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Mrs Sheppards",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Muli",variants:["300","300italic","regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Mystery Quest",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Neucha",variants:["regular"],subsets:["cyrillic","latin"]},{kind:"webfonts#webfont",family:"Neuton",variants:["200","300","regular","italic","700","800"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"News Cycle",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Niconne",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Nixie One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nobile",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nokora",variants:["regular","700"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Norican",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Nosifer",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Nothing You Could Do",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Noticia Text",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin","vietnamese"]},{kind:"webfonts#webfont",family:"Nova Cut",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nova Flat",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nova Mono",variants:["regular"],subsets:["latin","greek"]},{kind:"webfonts#webfont",family:"Nova Oval",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nova Round",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nova Script",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nova Slim",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nova Square",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Numans",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Nunito",variants:["300","regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Odor Mean Chey",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Offside",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Old Standard TT",variants:["regular","italic","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Oldenburg",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Oleo Script",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Oleo Script Swash Caps",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Open Sans",variants:["300","300italic","regular","italic","600","600italic","700","700italic","800","800italic"],subsets:["cyrillic","greek-ext","latin-ext","latin","vietnamese","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Open Sans Condensed",variants:["300","300italic","700"],subsets:["cyrillic","greek-ext","latin-ext","latin","vietnamese","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Oranienbaum",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Orbitron",variants:["regular","500","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Oregano",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Orienta",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Original Surfer",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Oswald",variants:["300","regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Over the Rainbow",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Overlock",variants:["regular","italic","700","700italic","900","900italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Overlock SC",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ovo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Oxygen",variants:["300","regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Oxygen Mono",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"PT Mono",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"PT Sans",variants:["regular","italic","700","700italic"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"PT Sans Caption",variants:["regular","700"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"PT Sans Narrow",variants:["regular","700"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"PT Serif",variants:["regular","italic","700","700italic"],subsets:["cyrillic","latin"]},{kind:"webfonts#webfont",family:"PT Serif Caption",variants:["regular","italic"],subsets:["cyrillic","latin"]},{kind:"webfonts#webfont",family:"Pacifico",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Paprika",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Parisienne",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Passero One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Passion One",variants:["regular","700","900"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Patrick Hand",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Patua One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Paytone One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Peralta",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Permanent Marker",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Petit Formal Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Petrona",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Philosopher",variants:["regular","italic","700","700italic"],subsets:["cyrillic","latin"]},{kind:"webfonts#webfont",family:"Piedra",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Pinyon Script",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Pirata One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Plaster",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Play",variants:["regular","700"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Playball",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Playfair Display",variants:["regular","italic","700","700italic","900","900italic"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Playfair Display SC",variants:["regular","italic","700","700italic","900","900italic"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Podkova",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Poiret One",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Poller One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Poly",variants:["regular","italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Pompiere",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Pontano Sans",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Port Lligat Sans",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Port Lligat Slab",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Prata",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Preahvihear",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Press Start 2P",variants:["regular"],subsets:["cyrillic","latin-ext","latin","greek"]},{kind:"webfonts#webfont",family:"Princess Sofia",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Prociono",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Prosto One",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Puritan",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Purple Purse",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Quando",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Quantico",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Quattrocento",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Quattrocento Sans",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Questrial",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Quicksand",variants:["300","regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Quintessential",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Qwigley",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Racing Sans One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Radley",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Raleway",variants:["100","200","300","regular","500","600","700","800","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Raleway Dots",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rambla",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rammetto One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ranchers",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rancho",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Rationale",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Redressed",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Reenie Beanie",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Revalia",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ribeye",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ribeye Marrow",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Righteous",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Risque",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rochester",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Rock Salt",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Rokkitt",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Romanesco",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ropa Sans",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rosario",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Rosarivo",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rouge Script",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Ruda",variants:["regular","700","900"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rufina",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ruge Boogie",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ruluko",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rum Raisin",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ruslan Display",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Russo One",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Ruthie",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Rye",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sacramento",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sail",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Salsa",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sanchez",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sancreek",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sansita One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sarina",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Satisfy",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Scada",variants:["regular","italic","700","700italic"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Schoolbell",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Seaweed Script",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sevillana",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Seymour One",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Shadows Into Light",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Shadows Into Light Two",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Shanti",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Share",variants:["regular","italic","700","700italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Share Tech",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Share Tech Mono",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Shojumaru",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Short Stack",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Siemreap",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Sigmar One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Signika",variants:["300","regular","600","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Signika Negative",variants:["300","regular","600","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Simonetta",variants:["regular","italic","900","900italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sirin Stencil",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Six Caps",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Skranji",variants:["regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Slackey",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Smokum",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Smythe",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sniglet",variants:["800"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Snippet",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Snowburst One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sofadi One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sofia",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sonsie One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Sorts Mill Goudy",variants:["regular","italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Source Code Pro",variants:["200","300","regular","600","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Source Sans Pro",variants:["200","200italic","300","300italic","regular","italic","600","600italic","700","700italic","900","900italic"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Special Elite",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Spicy Rice",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Spinnaker",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Spirax",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Squada One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Stalemate",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Stalinist One",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Stardos Stencil",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Stint Ultra Condensed",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Stint Ultra Expanded",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Stoke",variants:["300","regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Strait",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sue Ellen Francisco",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Sunshiney",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Supermercado One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Suwannaphum",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Swanky and Moo Moo",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Syncopate",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Tangerine",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Taprom",variants:["regular"],subsets:["khmer"]},{kind:"webfonts#webfont",family:"Telex",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Tenor Sans",variants:["regular"],subsets:["cyrillic","latin-ext","latin","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Text Me One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"The Girl Next Door",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Tienne",variants:["regular","700","900"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Tinos",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Titan One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Titillium Web",variants:["200","200italic","300","300italic","regular","italic","600","600italic","700","700italic","900"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Trade Winds",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Trocchi",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Trochut",variants:["regular","italic","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Trykker",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Tulpen One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Ubuntu",variants:["300","300italic","regular","italic","500","500italic","700","700italic"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Ubuntu Condensed",variants:["regular"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Ubuntu Mono",variants:["regular","italic","700","700italic"],subsets:["cyrillic","greek-ext","latin-ext","latin","greek","cyrillic-ext"]},{kind:"webfonts#webfont",family:"Ultra",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Uncial Antiqua",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Underdog",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Unica One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"UnifrakturCook",variants:["700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"UnifrakturMaguntia",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Unkempt",variants:["regular","700"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Unlock",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Unna",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"VT323",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Vampiro One",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Varela",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Varela Round",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Vast Shadow",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Vibur",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Vidaloka",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Viga",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Voces",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Volkhov",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Vollkorn",variants:["regular","italic","700","700italic"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Voltaire",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Waiting for the Sunrise",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Wallpoet",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Walter Turncoat",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Warnes",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Wellfleet",variants:["regular"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Wire One",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Yanone Kaffeesatz",variants:["200","300","regular","700"],subsets:["latin-ext","latin"]},{kind:"webfonts#webfont",family:"Yellowtail",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Yeseva One",variants:["regular"],subsets:["cyrillic","latin-ext","latin"]},{kind:"webfonts#webfont",family:"Yesteryear",variants:["regular"],subsets:["latin"]},{kind:"webfonts#webfont",family:"Zeyada",variants:["regular"],subsets:["latin"]}]},BFHLanguagesList={om:"Afaan Oromoo",aa:"Afaraf",af:"Afrikaans",ak:"Akan",an:"aragonés",ig:"Asụsụ Igbo",gn:"Avañe'ẽ",ae:"avesta",ay:"aymar aru",az:"azərbaycan dili",id:"Bahasa Indonesia",ms:"bahasa Melayu",bm:"bamanankan",jv:"basa Jawa",su:"Basa Sunda",bi:"Bislama",bs:"bosanski jezik",br:"brezhoneg",ca:"català",ch:"Chamoru",ny:"chiCheŵa",sn:"chiShona",co:"corsu",cy:"Cymraeg",da:"dansk",se:"Davvisámegiella",de:"Deutsch",nv:"Diné bizaad",et:"eesti",na:"Ekakairũ Naoero",en:"English",es:"español",eo:"Esperanto",eu:"euskara",ee:"Eʋegbe",to:"faka Tonga",mg:"fiteny malagasy",fr:"français",fy:"Frysk",ff:"Fulfulde",fo:"føroyskt",ga:"Gaeilge",gv:"Gaelg",sm:"gagana fa'a Samoa",gl:"galego",sq:"gjuha shqipe",gd:"Gàidhlig",ki:"Gĩkũyũ",ha:"Hausa",ho:"Hiri Motu",hr:"hrvatski jezik",io:"Ido",rw:"Ikinyarwanda",rn:"Ikirundi",ia:"Interlingua",nd:"isiNdebele",nr:"isiNdebele",xh:"isiXhosa",zu:"isiZulu",it:"italiano",ik:"Iñupiaq",pl:"polski",mh:"Kajin M̧ajeļ",kl:"kalaallisut",kr:"Kanuri",kw:"Kernewek",kg:"KiKongo",sw:"Kiswahili",ht:"Kreyòl ayisyen",kj:"Kuanyama",ku:"Kurdî",la:"latine",lv:"latviešu valoda",lt:"lietuvių kalba",ro:"limba română",li:"Limburgs",ln:"Lingála",lg:"Luganda",lb:"Lëtzebuergesch",hu:"magyar",mt:"Malti",nl:"Nederlands",no:"Norsk",nb:"Norsk bokmål",nn:"Norsk nynorsk",uz:"O'zbek",oc:"occitan",ie:"Interlingue",hz:"Otjiherero",ng:"Owambo",pt:"português",ty:"Reo Tahiti",rm:"rumantsch grischun",qu:"Runa Simi",sc:"sardu",za:"Saɯ cueŋƅ",st:"Sesotho",tn:"Setswana",ss:"SiSwati",sl:"slovenski jezik",sk:"slovenčina",so:"Soomaaliga",fi:"suomi",sv:"Svenska",mi:"te reo Māori",vi:"Tiếng Việt",lu:"Tshiluba",ve:"Tshivenḓa",tw:"Twi",tk:"Türkmen",tr:"Türkçe",ug:"Uyƣurqə",vo:"Volapük",fj:"vosa Vakaviti",wa:"walon",tl:"Wikang Tagalog",wo:"Wollof",ts:"Xitsonga",yo:"Yorùbá",sg:"yângâ tî sängö",is:"Íslenska",cs:"čeština",el:"ελληνικά",av:"авар мацӀ",ab:"аҧсуа бызшәа",ba:"башҡорт теле",be:"беларуская мова",bg:"български език",os:"ирон æвзаг",kv:"коми кыв",ky:"Кыргызча",mk:"македонски јазик",mn:"монгол",ce:"нохчийн мотт",ru:"русский язык",sr:"српски језик",tt:"татар теле",tg:"тоҷикӣ",uk:"українська мова",cv:"чӑваш чӗлхи",cu:"ѩзыкъ словѣньскъ",kk:"қазақ тілі",hy:"Հայերեն",yi:"ייִדיש",he:"עברית",ur:"اردو",ar:"العربية",fa:"فارسی",ps:"پښتو",ks:"कश्मीरी",ne:"नेपाली",pi:"पाऴि",bh:"भोजपुरी",mr:"मराठी",sa:"संस्कृतम्",sd:"सिन्धी",hi:"हिन्दी",as:"অসমীয়া",bn:"বাংলা",pa:"ਪੰਜਾਬੀ",gu:"ગુજરાતી",or:"ଓଡ଼ିଆ",ta:"தமிழ்",te:"తెలుగు",kn:"ಕನ್ನಡ",ml:"മലയാളം",si:"සිංහල",th:"ไทย",lo:"ພາສາລາວ",bo:"བོད་ཡིག",dz:"རྫོང་ཁ",my:"ဗမာစာ",ka:"ქართული",ti:"ትግርኛ",am:"አማርኛ",iu:"ᐃᓄᒃᑎᑐᑦ",oj:"ᐊᓂᔑᓈᐯᒧᐎᓐ",cr:"ᓀᐦᐃᔭᐍᐏᐣ",km:"ខ្មែរ",zh:"中文 (Zhōngwén)",ja:"日本語 (にほんご)",ii:"ꆈꌠ꒿ Nuosuhxop",ko:"한국어 (韓國語)"},BFHPhoneFormatList={AF:"+93 0dd ddd dddd",AL:"+355 0dd ddd ddd",DZ:"+213 0ddd dd dd dd",AS:"+1 (ddd) ddd-dddd",AD:"+376 ddddddddd",AO:"+244 ddd ddd ddd",AI:"+1 (ddd) ddd-dddd",AQ:"+672 ddddddddd",AG:"+1 (ddd) ddd-dddd",AR:"+54 ddddddddd",AM:"+374 0dd dddddd",AW:"+297 ddd dddd",AU:"+61 ddd ddd ddd",AT:"+43 0dddd ddddddddd",AZ:"+994 ddddddddd",BH:"+973 ddddddddd",BD:"+880 ddddddddd",BB:"+1 ddddddddd",BY:"+375 ddddddddd",BE:"+32 ddddddddd",BZ:"+501 ddddddddd",BJ:"+229 ddddddddd",BM:"+1 (ddd) ddd-dddd",BT:"+975 ddddddddd",BO:"+591 ddddddddd",BA:"+387 ddddddddd",BW:"+267 ddddddddd",BV:"+0 ddddddddd",BR:"+55 ddddddddd",IO:"+0 ddddddddd",VG:"+1 (ddd) ddd-dddd",BN:"+673 ddddddddd",BG:"+359 ddddddddd",BF:"+226 ddddddddd",BI:"+257 ddddddddd",CI:"+225 ddddddddd",KH:"+855 ddddddddd",CM:"+237 ddddddddd",CA:"+1 (ddd) ddd-dddd",CV:"+238 ddddddddd",KY:"+1 (ddd) ddd-dddd",CF:"+236 ddddddddd",TD:"+235 ddddddddd",CL:"+56 ddddddddd",CN:"+86 ddddddddd",CX:"+61 ddddddddd",CC:"+61 ddddddddd",CO:"+57 ddddddddd",KM:"+269 ddddddddd",CG:"+242 ddddddddd",CK:"+682 ddddddddd",CR:"+506 ddddddddd",HR:"+385 ddddddddd",CU:"+53 ddddddddd",CY:"+357 ddddddddd",CZ:"+420 ddddddddd",CD:"+243 ddddddddd",DK:"+45 ddddddddd",DJ:"+253 ddddddddd",DM:"+1 (ddd) ddd-dddd",DO:"+1 (ddd) ddd-dddd",TL:"+670 ddddddddd",EC:"+593 ddddddddd",EG:"+20 ddddddddd",SV:"+503 ddddddddd",GQ:"+240 ddddddddd",ER:"+291 ddddddddd",EE:"+372 ddddddddd",ET:"+251 ddddddddd",FO:"+298 ddddddddd",FK:"+500 ddddddddd",FJ:"+679 ddddddddd",FI:"+358 ddddddddd",MK:"+389 ddddddddd",FR:"+33 d dd dd dd dd",GF:"+594 ddddddddd",PF:"+689 ddddddddd",TF:"+262 ddddddddd",GA:"+241 ddddddddd",GE:"+995 ddddddddd",DE:"+49 ddddddddd",GH:"+233 ddddddddd",GI:"+350 ddddddddd",GR:"+30 ddddddddd",GL:"+299 ddddddddd",GD:"+1 (ddd) ddd-dddd",GP:"+590 ddddddddd",GU:"+1 (ddd) ddd-dddd",GT:"+502 ddddddddd",GN:"+224 ddddddddd",GW:"+245 ddddddddd",GY:"+592 ddddddddd",HT:"+509 ddddddddd",HM:"+0 ddddddddd",HN:"+504 ddddddddd",HK:"+852 ddddddddd",HU:"+36 ddddddddd",IS:"+354 ddddddddd",IN:"+91 ddddddddd",ID:"+62 ddddddddd",IR:"+98 ddddddddd",IQ:"+964 ddddddddd",IE:"+353 ddddddddd",IL:"+972 ddddddddd",IT:"+39 ddddddddd",JM:"+1 (ddd) ddd-dddd",JP:"+81 ddddddddd",JO:"+962 ddddddddd",KZ:"+7 ddddddddd",KE:"+254 ddddddddd",KI:"+686 ddddddddd",KW:"+965 ddddddddd",KG:"+996 ddddddddd",LA:"+856 ddddddddd",LV:"+371 ddddddddd",LB:"+961 ddddddddd",LS:"+266 ddddddddd",LR:"+231 ddddddddd",LY:"+218 ddddddddd",LI:"+423 ddddddddd",LT:"+370 ddddddddd",LU:"+352 ddddddddd",MO:"+853 ddddddddd",MG:"+261 ddddddddd",MW:"+265 ddddddddd",MY:"+60 ddddddddd",MV:"+960 ddddddddd",ML:"+223 ddddddddd",MT:"+356 ddddddddd",MH:"+692 ddddddddd",MQ:"+596 ddddddddd",MR:"+222 ddddddddd",MU:"+230 ddddddddd",YT:"+262 ddddddddd",MX:"+52 ddddddddd",FM:"+691 ddddddddd",MD:"+373 ddddddddd",MC:"+377 ddddddddd",MN:"+976 ddddddddd",MS:"+1 (ddd) ddd-dddd",MA:"+212 ddddddddd",MZ:"+258 ddddddddd",MM:"+95 ddddddddd",NA:"+264 ddddddddd",NR:"+674 ddddddddd",NP:"+977 ddddddddd",NL:"+31 ddddddddd",AN:"+599 ddddddddd",NC:"+687 ddddddddd",NZ:"+64 ddddddddd",NI:"+505 ddddddddd",NE:"+227 ddddddddd",NG:"+234 ddddddddd",NU:"+683 ddddddddd",NF:"+672 ddddddddd",KP:"+850 ddddddddd",MP:"+1 (ddd) ddd-dddd",NO:"+47 ddddddddd",OM:"+968 ddddddddd",PK:"+92 ddddddddd",PW:"+680 ddddddddd",PA:"+507 ddddddddd",PG:"+675 ddddddddd",PY:"+595 ddddddddd",PE:"+51 ddddddddd",PH:"+63 ddddddddd",PN:"+870 ddddddddd",PL:"+48 ddddddddd",PT:"+351 ddddddddd",PR:"+1 (ddd) ddd-dddd",QA:"+974 ddddddddd",RE:"+262 ddddddddd",RO:"+40 ddddddddd",RU:"+7 ddddddddd",RW:"+250 ddddddddd",ST:"+239 ddddddddd",SH:"+290 ddddddddd",KN:"+1 (ddd) ddd-dddd",LC:"+1 (ddd) ddd-dddd",PM:"+508 ddddddddd",VC:"+1 (ddd) ddd-dddd",WS:"+685 ddddddddd",SM:"+378 ddddddddd",SA:"+966 ddddddddd",SN:"+221 ddddddddd",SC:"+248 ddddddddd",SL:"+232 ddddddddd",SG:"+65 ddddddddd",SK:"+421 ddddddddd",SI:"+386 ddddddddd",SB:"+677 ddddddddd",SO:"+252 ddddddddd",ZA:"+27 ddddddddd",GS:"+0 ddddddddd",KR:"+82 ddddddddd",ES:"+34 ddddddddd",LK:"+94 ddddddddd",SD:"+249 ddddddddd",SR:"+597 ddddddddd",SJ:"+0 ddddddddd",SZ:"+268 ddddddddd",SE:"+46 ddddddddd",CH:"+41 ddddddddd",SY:"+963 ddddddddd",TW:"+886 ddddddddd",TJ:"+992 ddddddddd",TZ:"+255 ddddddddd",TH:"+66 ddddddddd",BS:"+1 (ddd) ddd-dddd",GM:"+220 ddddddddd",TG:"+228 ddddddddd",TK:"+690 ddddddddd",TO:"+676 ddddddddd",TT:"+1 (ddd) ddd-dddd",TN:"+216 ddddddddd",TR:"+90 ddddddddd",TM:"+993 ddddddddd",TC:"+1 (ddd) ddd-dddd",TV:"+688 ddddddddd",VI:"+1 (ddd) ddd-dddd",UG:"+256 ddddddddd",UA:"+380 ddddddddd",AE:"+971 ddddddddd",GB:"+44 (ddd) dddd dddd",US:"+1 (ddd) ddd-dddd",UM:"+0 ddddddddd",UY:"+598 ddddddddd",UZ:"+998 ddddddddd",VU:"+678 ddddddddd",VA:"+39 ddddddddd",VE:"+58 ddddddddd",VN:"+84 ddddddddd",WF:"+681 ddddddddd",EH:"+0 ddddddddd",YE:"+967 ddddddddd",YU:"+0 ddddddddd",ZM:"+260 ddddddddd",ZW:"+263 ddddddddd"},BFHStatesList={AF:{1:{code:"BAL",name:"Balkh"},2:{code:"BAM",name:"Bamian"},3:{code:"BDG",name:"Badghis"},4:{code:"BDS",name:"Badakhshan"},5:{code:"BGL",name:"Baghlan"},6:{code:"FRA",name:"Farah"},7:{code:"FYB",name:"Faryab"},8:{code:"GHA",name:"Ghazni"},9:{code:"GHO",name:"Ghowr"},10:{code:"HEL",name:"Helmand"},11:{code:"HER",name:"Herat"},12:{code:"JOW",name:"Jowzjan"},13:{code:"KAB",name:"Kabul"},14:{code:"KAN",name:"Kandahar"},15:{code:"KAP",name:"Kapisa"},16:{code:"KDZ",name:"Kondoz"},17:{code:"KHO",name:"Khost"},18:{code:"KNR",name:"Konar"},19:{code:"LAG",name:"Laghman"},20:{code:"LOW",name:"Lowgar"},21:{code:"NAN",name:"Nangrahar"},22:{code:"NIM",name:"Nimruz"},23:{code:"NUR",name:"Nurestan"},24:{code:"ORU",name:"Oruzgan"},25:{code:"PAR",name:"Parwan"},26:{code:"PIA",name:"Paktia"},27:{code:"PKA",name:"Paktika"},28:{code:"SAM",name:"Samangan"},29:{code:"SAR",name:"Sar-e Pol"},30:{code:"TAK",name:"Takhar"},31:{code:"WAR",name:"Wardak"},32:{code:"ZAB",name:"Zabol"}},AL:{1:{code:"BR",name:"Berat"},2:{code:"BU",name:"Bulqize"},3:{code:"DI",name:"Diber"},4:{code:"DL",name:"Delvine"},5:{code:"DR",name:"Durres"},6:{code:"DV",name:"Devoll"},7:{code:"EL",name:"Elbasan"},8:{code:"ER",name:"Kolonje"},9:{code:"FR",name:"Fier"},10:{code:"GJ",name:"Gjirokaster"},11:{code:"GR",name:"Gramsh"},12:{code:"HA",name:"Has"},13:{code:"KA",name:"Kavaje"},14:{code:"KB",name:"Kurbin"},15:{code:"KC",name:"Kucove"},16:{code:"KO",name:"Korce"},17:{code:"KR",name:"Kruje"},18:{code:"KU",name:"Kukes"},19:{code:"LB",name:"Librazhd"},20:{code:"LE",name:"Lezhe"},21:{code:"LU",name:"Lushnje"},22:{code:"MK",name:"Mallakaster"},23:{code:"MM",name:"Malesi e Madhe"},24:{code:"MR",name:"Mirdite"},25:{code:"MT",name:"Mat"},26:{code:"PG",name:"Pogradec"},27:{code:"PQ",name:"Peqin"},28:{code:"PR",name:"Permet"},29:{code:"PU",name:"Puke"},30:{code:"SH",name:"Shkoder"},31:{code:"SK",name:"Skrapar"},32:{code:"SR",name:"Sarande"},33:{code:"TE",name:"Tepelene"},34:{code:"TP",name:"Tropoje"},35:{code:"TR",name:"Tirane"},36:{code:"VL",name:"Vlore"}},DZ:{1:{code:"ADE",name:"Ain Defla"},2:{code:"ADR",name:"Adrar"},3:{code:"ALG",name:"Alger"},4:{code:"ANN",name:"Annaba"},5:{code:"ATE",name:"Ain Temouchent"},6:{code:"BAT",name:"Batna"},7:{code:"BBA",name:"Bordj Bou Arreridj"},8:{code:"BEC",name:"Bechar"},9:{code:"BEJ",name:"Bejaia"},10:{code:"BIS",name:"Biskra"},11:{code:"BLI",name:"Blida"},12:{code:"BMD",name:"Boumerdes"},13:{code:"BOA",name:"Bouira"},14:{code:"CHL",name:"Chlef"},15:{code:"CON",name:"Constantine"},16:{code:"DJE",name:"Djelfa"},17:{code:"EBA",name:"El Bayadh"},18:{code:"EOU",name:"El Oued"},19:{code:"ETA",name:"El Tarf"},20:{code:"GHA",name:"Ghardaia"},21:{code:"GUE",name:"Guelma"},22:{code:"ILL",name:"Illizi"},23:{code:"JIJ",name:"Jijel"},24:{code:"KHE",name:"Khenchela"},25:{code:"LAG",name:"Laghouat"},26:{code:"MED",name:"Medea"},27:{code:"MIL",name:"Mila"},28:{code:"MOS",name:"Mostaganem"},29:{code:"MSI",name:"M'Sila"},30:{code:"MUA",name:"Muaskar"},31:{code:"NAA",name:"Naama"},32:{code:"OEB",name:"Oum el-Bouaghi"},33:{code:"ORA",name:"Oran"},34:{code:"OUA",name:"Ouargla"},35:{code:"REL",name:"Relizane"},36:{code:"SAH",name:"Souk Ahras"},37:{code:"SAI",name:"Saida"},38:{code:"SBA",name:"Sidi Bel Abbes"},39:{code:"SET",name:"Setif"},40:{code:"SKI",name:"Skikda"},41:{code:"TAM",name:"Tamanghasset"},42:{code:"TEB",name:"Tebessa"},43:{code:"TIA",name:"Tiaret"},44:{code:"TIN",name:"Tindouf"},45:{code:"TIP",name:"Tipaza"},46:{code:"TIS",name:"Tissemsilt"},47:{code:"TLE",name:"Tlemcen"},48:{code:"TOU",name:"Tizi Ouzou"}},AS:{1:{code:"E",name:"Eastern"},2:{code:"M",name:"Manu'a"},3:{code:"R",name:"Rose Island"},4:{code:"S",name:"Swains Island"},5:{code:"W",name:"Western"}},AD:{1:{code:"ALV",name:"Andorra la Vella"},2:{code:"CAN",name:"Canillo"},3:{code:"ENC",name:"Encamp"},4:{code:"ESE",name:"Escaldes-Engordany"},5:{code:"LMA",name:"La Massana"},6:{code:"ORD",name:"Ordino"},7:{code:"SJL",name:"Sant Julià de Lòria"}},AO:{1:{code:"BGO",name:"Bengo"},2:{code:"BGU",name:"Benguela"},3:{code:"BIE",name:"Bie"},4:{code:"CAB",name:"Cabinda"},5:{code:"CCU",name:"Cuando-Cubango"},6:{code:"CNO",name:"Cuanza Norte"},7:{code:"CUS",name:"Cuanza Sul"},8:{code:"CNN",name:"Cunene"},9:{code:"HUA",name:"Huambo"},10:{code:"HUI",name:"Huila"},11:{code:"LUA",name:"Luanda"},12:{code:"LNO",name:"Lunda Norte"},13:{code:"LSU",name:"Lunda Sul"},14:{code:"MAL",name:"Malange"},15:{code:"MOX",name:"Moxico"},16:{code:"NAM",name:"Namibe"},17:{code:"UIG",name:"Uige"},18:{code:"ZAI",name:"Zaire"}},AI:{1:{code:"ANG",name:"Anguillita"},2:{code:"ANG",name:"Anguila"},3:{code:"DOG",name:"Dog"},4:{code:"LIT",name:"Little Scrub"},5:{code:"PRI",name:"Prickly Pear"},6:{code:"SAN",name:"Sandy"},7:{code:"SCR",name:"Scrub"},8:{code:"SEA",name:"Seal"},9:{code:"SOM",name:"Sombrero"}},AQ:{1:{code:"ASG",name:"Saint George"},2:{code:"ASH",name:"Saint Philip"},3:{code:"ASJ",name:"Saint John"},4:{code:"ASL",name:"Saint Paul"},5:{code:"ASM",name:"Saint Mary"},6:{code:"ASR",name:"Saint Peter"},7:{code:"BAR",name:"Barbuda"},8:{code:"RED",name:"Redonda"}},AR:{1:{code:"AN",name:"Antartida e Islas del Atlantico"},2:{code:"BA",name:"Buenos Aires"},3:{code:"CA",name:"Catamarca"},4:{code:"CH",name:"Chaco"},5:{code:"CU",name:"Chubut"},6:{code:"CO",name:"Cordoba"},7:{code:"CR",name:"Corrientes"},8:{code:"CF",name:"Capital Federal"},9:{code:"ER",name:"Entre Rios"},10:{code:"FO",name:"Formosa"},11:{code:"JU",name:"Jujuy"},12:{code:"LP",name:"La Pampa"},13:{code:"LR",name:"La Rioja"},14:{code:"ME",name:"Mendoza"},15:{code:"MI",name:"Misiones"},16:{code:"NE",name:"Neuquen"},17:{code:"RN",name:"Rio Negro"},18:{code:"SA",name:"Salta"},19:{code:"SJ",name:"San Juan"},20:{code:"SL",name:"San Luis"},21:{code:"SC",name:"Santa Cruz"},22:{code:"SF",name:"Santa Fe"},23:{code:"SD",name:"Santiago del Estero"},24:{code:"TF",name:"Tierra del Fuego"},25:{code:"TU",name:"Tucuman"}},AM:{1:{code:"AGT",name:"Aragatsotn"},2:{code:"ARR",name:"Ararat"},3:{code:"ARM",name:"Armavir"},4:{code:"GEG",name:"Geghark 'unik'"},5:{code:"KOT",name:"Kotayk'"},6:{code:"LOR",name:"Lorri"},7:{code:"SHI",name:"Shirak"},8:{code:"SYU",name:"Syunik'"},9:{code:"TAV",name:"Tavush"},10:{code:"VAY",name:"Vayots' Dzor"},11:{code:"YER",name:"Yerevan"}},AW:{1:{code:"ARU",name:"Aruba"},2:{code:"DRU",name:"Druif Beach"},3:{code:"MAN",name:"Manchebo Beach"},4:{code:"NOO",name:"Noord"},5:{code:"ORA",name:"Oranjestad"},6:{code:"PAL",name:"Palm Beach"},7:{code:"ROO",name:"Rooi Thomas"},8:{code:"SIN",name:"Sint Nicolaas"},9:{code:"SIN",name:"Sint Nicolas"},10:{code:"WAY",name:"Wayaca"}},AU:{1:{code:"ACT",name:"Australian Capital Territory"},2:{code:"NSW",name:"New South Wales"},3:{code:"NT",name:"Northern Territory"},4:{code:"QLD",name:"Queensland"},5:{code:"SA",name:"South Australia"},6:{code:"TAS",name:"Tasmania"},7:{code:"VIC",name:"Victoria"},8:{code:"WA",name:"Western Australia"}},AT:{1:{code:"BUR",name:"Burgenland"},2:{code:"KAR",name:"Krnten"},3:{code:"NOS",name:"Niederöesterreich"},4:{code:"OOS",name:"Oberöesterreich"},5:{code:"SAL",name:"Salzburg"},6:{code:"STE",name:"Steiermark"},7:{code:"TIR",name:"Tirol"},8:{code:"VOR",name:"Vorarlberg"},9:{code:"WIE",name:"Wien"}},AZ:{1:{code:"AB",name:"Ali Bayramli"},2:{code:"ABS",name:"Abseron"},3:{code:"AGC",name:"AgcabAdi"},4:{code:"AGM",name:"Agdam"},5:{code:"AGS",name:"Agdas"},6:{code:"AGA",name:"Agstafa"},7:{code:"AGU",name:"Agsu"},8:{code:"AST",name:"Astara"},9:{code:"BA",name:"Baki"},10:{code:"BAB",name:"BabAk"},11:{code:"BAL",name:"BalakAn"},12:{code:"BAR",name:"BArdA"},13:{code:"BEY",name:"Beylaqan"},14:{code:"BIL",name:"Bilasuvar"},15:{code:"CAB",name:"Cabrayil"},16:{code:"CAL",name:"Calilabab"},17:{code:"CUL",name:"Culfa"},18:{code:"DAS",name:"Daskasan"},19:{code:"DAV",name:"Davaci"},20:{code:"FUZ",name:"Fuzuli"},21:{code:"GA",name:"Ganca"},22:{code:"GAD",name:"Gadabay"},23:{code:"GOR",name:"Goranboy"},24:{code:"GOY",name:"Goycay"},25:{code:"HAC",name:"Haciqabul"},26:{code:"IMI",name:"Imisli"},27:{code:"ISM",name:"Ismayilli"},28:{code:"KAL",name:"Kalbacar"},29:{code:"KUR",name:"Kurdamir"},30:{code:"LA",name:"Lankaran"},31:{code:"LAC",name:"Lacin"},32:{code:"LAN",name:"Lankaran"},33:{code:"LER",name:"Lerik"},34:{code:"MAS",name:"Masalli"},35:{code:"MI",name:"Mingacevir"},36:{code:"NA",name:"Naftalan"},37:{code:"NX",name:"Naxcivan"},38:{code:"NEF",name:"Neftcala"},39:{code:"OGU",name:"Oguz"},40:{code:"ORD",name:"Ordubad"},41:{code:"QAB",name:"Qabala"},42:{code:"QAX",name:"Qax"},43:{code:"QAZ",name:"Qazax"},44:{code:"QOB",name:"Qobustan"},45:{code:"QBA",name:"Quba"},46:{code:"QBI",name:"Qubadli"},47:{code:"QUS",name:"Qusar"},48:{code:"SA",name:"Saki"},49:{code:"SAT",name:"Saatli"},50:{code:"SAB",name:"Sabirabad"},51:{code:"SAD",name:"Sadarak"},52:{code:"SAH",name:"Sahbuz"},53:{code:"SAK",name:"Saki"},54:{code:"SAL",name:"Salyan"},55:{code:"SM",name:"Sumqayit"},56:{code:"SMI",name:"Samaxi"},57:{code:"SKR",name:"Samkir"},58:{code:"SMX",name:"Samux"},59:{code:"SAR",name:"Sarur"},60:{code:"SIY",name:"Siyazan"},61:{code:"SS",name:"Susa"},62:{code:"SUS",name:"Susa"},63:{code:"TAR",name:"Tartar"},64:{code:"TOV",name:"Tovuz"},65:{code:"UCA",name:"Ucar"},66:{code:"XA",name:"Xankandi"},67:{code:"XAC",name:"Xacmaz"},68:{code:"XAN",name:"Xanlar"},69:{code:"XIZ",name:"Xizi"},70:{code:"XCI",name:"Xocali"},71:{code:"XVD",name:"Xocavand"},72:{code:"YAR",name:"Yardimli"},73:{code:"YEV",name:"Yevlax"},74:{code:"ZAN",name:"Zangilan"},75:{code:"ZAQ",name:"Zaqatala"},76:{code:"ZAR",name:"Zardab"}},BS:{1:{code:"ACK",name:"Acklins"},2:{code:"BER",name:"Berry Islands"},3:{code:"BIM",name:"Bimini"},4:{code:"BLK",name:"Black Point"},5:{code:"CAT",name:"Cat Island"},6:{code:"CAB",name:"Central Abaco"},7:{code:"CAN",name:"Central Andros"},8:{code:"CEL",name:"Central Eleuthera"},9:{code:"FRE",name:"City of Freeport"},10:{code:"CRO",name:"Crooked Island"},11:{code:"EGB",name:"East Grand Bahama"},12:{code:"EXU",name:"Exuma"},13:{code:"GRD",name:"Grand Cay"},14:{code:"HAR",name:"Harbour Island"},15:{code:"HOP",name:"Hope Town"},16:{code:"INA",name:"Inagua"},17:{code:"LNG",name:"Long Island"},18:{code:"MAN",name:"Mangrove Cay"},19:{code:"MAY",name:"Mayaguana"},20:{code:"MOO",name:"Moore's Island"},21:{code:"NAB",name:"North Abaco"},22:{code:"NAN",name:"North Andros"},23:{code:"NEL",name:"North Eleuthera"},24:{code:"RAG",name:"Ragged Island"},25:{code:"RUM",name:"Rum Cay"},26:{code:"SAL",name:"San Salvador"},27:{code:"SAB",name:"South Abaco"},28:{code:"SAN",name:"South Andros"},29:{code:"SEL",name:"South Eleuthera"},30:{code:"SWE",name:"Spanish Wells"},31:{code:"WGB",name:"West Grand Bahama"}},BH:{1:{code:"CAP",name:"Capital"},2:{code:"CEN",name:"Central"},3:{code:"MUH",name:"Muharraq"},4:{code:"NOR",name:"Northern"},5:{code:"SOU",name:"Southern"}},BD:{1:{code:"BAR",name:"Barisal"},2:{code:"CHI",name:"Chittagong"},3:{code:"DHA",name:"Dhaka"},4:{code:"KHU",name:"Khulna"},5:{code:"RAJ",name:"Rajshahi"},6:{code:"SYL",name:"Sylhet"}},BB:{1:{code:"CC",name:"Christ Church"},2:{code:"AND",name:"Saint Andrew"},3:{code:"GEO",name:"Saint George"},4:{code:"JAM",name:"Saint James"},5:{code:"JOH",name:"Saint John"},6:{code:"JOS",name:"Saint Joseph"},7:{code:"LUC",name:"Saint Lucy"},8:{code:"MIC",name:"Saint Michael"},9:{code:"PET",name:"Saint Peter"},10:{code:"PHI",name:"Saint Philip"},11:{code:"THO",name:"Saint Thomas"}},BY:{1:{code:"BR",name:"Brestskaya (Brest)"},2:{code:"HO",name:"Homyel'skaya (Homyel')"},3:{code:"HM",name:"Horad Minsk"},4:{code:"HR",name:"Hrodzyenskaya (Hrodna)"},5:{code:"MA",name:"Mahilyowskaya (Mahilyow)"},6:{code:"MI",name:"Minskaya"},7:{code:"VI",name:"Vitsyebskaya (Vitsyebsk)"}},BE:{1:{code:"VAN",name:"Antwerpen"},2:{code:"WBR",name:"Brabant Wallon"},3:{code:"WHT",name:"Hainaut"},4:{code:"WLG",name:"Liege"},5:{code:"VLI",name:"Limburg"},6:{code:"WLX",name:"Luxembourg"},7:{code:"WNA",name:"Namur"},8:{code:"VOV",name:"Oost-Vlaanderen"},9:{code:"VBR",name:"Vlaams Brabant"},10:{code:"VWV",name:"West-Vlaanderen"}},BZ:{1:{code:"BZ",name:"Belize"},2:{code:"CY",name:"Cayo"},3:{code:"CR",name:"Corozal"},4:{code:"OW",name:"Orange Walk"},5:{code:"SC",name:"Stann Creek"},6:{code:"TO",name:"Toledo"}},BJ:{1:{code:"AL",name:"Alibori"},2:{code:"AK",name:"Atakora"},3:{code:"AQ",name:"Atlantique"},4:{code:"BO",name:"Borgou"},5:{code:"CO",name:"Collines"},6:{code:"DO",name:"Donga"},7:{code:"KO",name:"Kouffo"},8:{code:"LI",name:"Littoral"},9:{code:"MO",name:"Mono"},10:{code:"OU",name:"Oueme"},11:{code:"PL",name:"Plateau"},12:{code:"ZO",name:"Zou"}},BM:{1:{code:"DS",name:"Devonshire"},2:{code:"HC",name:"Hamilton City"},3:{code:"HA",name:"Hamilton"},4:{code:"PG",name:"Paget"},5:{code:"PB",name:"Pembroke"},6:{code:"GC",name:"Saint George City"},7:{code:"SG",name:"Saint George's"},8:{code:"SA",name:"Sandys"},9:{code:"SM",name:"Smith's"},10:{code:"SH",name:"Southampton"},11:{code:"WA",name:"Warwick"}},BT:{1:{code:"BUM",name:"Bumthang"},2:{code:"CHU",name:"Chukha"},3:{code:"DAG",name:"Dagana"},4:{code:"GAS",name:"Gasa"},5:{code:"HAA",name:"Haa"},6:{code:"LHU",name:"Lhuntse"},7:{code:"MON",name:"Mongar"},8:{code:"PAR",name:"Paro"},9:{code:"PEM",name:"Pemagatshel"},10:{code:"PUN",name:"Punakha"},11:{code:"SJO",name:"Samdrup Jongkhar"},12:{code:"SAT",name:"Samtse"},13:{code:"SAR",name:"Sarpang"},14:{code:"THI",name:"Thimphu"},15:{code:"TRG",name:"Trashigang"},16:{code:"TRY",name:"Trashiyangste"},17:{code:"TRO",name:"Trongsa"},18:{code:"TSI",name:"Tsirang"},19:{code:"WPH",name:"Wangdue Phodrang"},20:{code:"ZHE",name:"Zhemgang"}},BO:{1:{code:"BEN",name:"Beni"},2:{code:"CHU",name:"Chuquisaca"},3:{code:"COC",name:"Cochabamba"},4:{code:"LPZ",name:"La Paz"},5:{code:"ORU",name:"Oruro"},6:{code:"PAN",name:"Pando"},7:{code:"POT",name:"Potosi"},8:{code:"SCZ",name:"Santa Cruz"},9:{code:"TAR",name:"Tarija"}},BA:{1:{code:"BRO",name:"Brcko district"},2:{code:"FBP",name:"Bosanskopodrinjski Kanton"},3:{code:"FHN",name:"Hercegovacko-neretvanski Kanton"},4:{code:"FPO",name:"Posavski Kanton"},5:{code:"FSA",name:"Kanton Sarajevo"},6:{code:"FSB",name:"Srednjebosanski Kanton"},7:{code:"FTU",name:"Tuzlanski Kanton"},8:{code:"FUS",name:"Unsko-Sanski Kanton"},9:{code:"FZA",name:"Zapadnobosanska"},10:{code:"FZE",name:"Zenicko-Dobojski Kanton"},11:{code:"FZH",name:"Zapadnohercegovacka Zupanija"},12:{code:"SBI",name:"Bijeljina"},13:{code:"SBL",name:"Banja Luka"},14:{code:"SDO",name:"Doboj"},15:{code:"SFO",name:"Foca"},16:{code:"SSR",name:"Sarajevo-Romanija or Sokolac"},17:{code:"STR",name:"Trebinje"},18:{code:"SVL",name:"Vlasenica"}},BW:{1:{code:"CE",name:"Central"},2:{code:"GH",name:"Ghanzi"},3:{code:"KD",name:"Kgalagadi"},4:{code:"KT",name:"Kgatleng"},5:{code:"KW",name:"Kweneng"},6:{code:"NG",name:"Ngamiland"},7:{code:"NE",name:"North East"},8:{code:"NW",name:"North West"},9:{code:"SE",name:"South East"},10:{code:"SO",name:"Southern"}},BR:{1:{code:"AC",name:"Acre"},2:{code:"AL",name:"Alagoas"},3:{code:"AP",name:"Amapa"},4:{code:"AM",name:"Amazonas"},5:{code:"BA",name:"Bahia"},6:{code:"CE",name:"Ceara"},7:{code:"DF",name:"Distrito Federal"},8:{code:"ES",name:"Espirito Santo"},9:{code:"GO",name:"Goias"},10:{code:"MA",name:"Maranhao"},11:{code:"MT",name:"Mato Grosso"},12:{code:"MS",name:"Mato Grosso do Sul"},13:{code:"MG",name:"Minas Gerais"},14:{code:"PA",name:"Para"},15:{code:"PB",name:"Paraiba"},16:{code:"PR",name:"Parana"},17:{code:"PE",name:"Pernambuco"},18:{code:"PI",name:"Piaui"},19:{code:"RJ",name:"Rio de Janeiro"},20:{code:"RN",name:"Rio Grande do Norte"},21:{code:"RS",name:"Rio Grande do Sul"},22:{code:"RO",name:"Rondonia"},23:{code:"RR",name:"Roraima"},24:{code:"SC",name:"Santa Catarina"},25:{code:"SP",name:"Sao Paulo"},26:{code:"SE",name:"Sergipe"},27:{code:"TO",name:"Tocantins"}},IO:{1:{code:"DG",name:"Diego Garcia"},2:{code:"DI",name:"Danger Island"},3:{code:"EA",name:"Eagle Islands"},4:{code:"EG",name:"Egmont Islands"},5:{code:"NI",name:"Nelsons Island"},6:{code:"PB",name:"Peros Banhos"},7:{code:"SI",name:"Salomon Islands"},8:{code:"TB",name:"Three Brothers"}},BN:{1:{code:"BEL",name:"Belait"},2:{code:"BRM",name:"Brunei and Muara"},3:{code:"TEM",name:"Temburong"},4:{code:"TUT",name:"Tutong"}},BG:{1:{code:"BG-01",name:"Blagoevgrad"},2:{code:"BG-02",name:"Burgas"},3:{code:"BG-03",name:"Dobrich"},4:{code:"BG-04",name:"Gabrovo"},5:{code:"BG-05",name:"Haskovo"},6:{code:"BG-06",name:"Kardjali"},7:{code:"BG-07",name:"Kyustendil"},8:{code:"BG-08",name:"Lovech"},9:{code:"BG-09",name:"Montana"},10:{code:"BG-10",name:"Pazardjik"},11:{code:"BG-11",name:"Pernik"},12:{code:"BG-12",name:"Pleven"},13:{code:"BG-13",name:"Plovdiv"},14:{code:"BG-14",name:"Razgrad"},15:{code:"BG-15",name:"Shumen"},16:{code:"BG-16",name:"Silistra"},17:{code:"BG-17",name:"Sliven"},18:{code:"BG-18",name:"Smolyan"},19:{code:"BG-19",name:"Sofia"},20:{code:"BG-20",name:"Sofia - town"},21:{code:"BG-21",name:"Stara Zagora"},22:{code:"BG-22",name:"Targovishte"},23:{code:"BG-23",name:"Varna"},24:{code:"BG-24",name:"Veliko Tarnovo"},25:{code:"BG-25",name:"Vidin"},26:{code:"BG-26",name:"Vratza"},27:{code:"BG-27",name:"Yambol"}},BF:{1:{code:"BAL",name:"Bale"},2:{code:"BAM",name:"Bam"},3:{code:"BAN",name:"Banwa"},4:{code:"BAZ",name:"Bazega"},5:{code:"BOR",name:"Bougouriba"},6:{code:"BLG",name:"Boulgou"},7:{code:"BOK",name:"Boulkiemde"},8:{code:"COM",name:"Comoe"},9:{code:"GAN",name:"Ganzourgou"},10:{code:"GNA",name:"Gnagna"},11:{code:"GOU",name:"Gourma"},12:{code:"HOU",name:"Houet"},13:{code:"IOA",name:"Ioba"},14:{code:"KAD",name:"Kadiogo"},15:{code:"KEN",name:"Kenedougou"},16:{code:"KOD",name:"Komondjari"},17:{code:"KOP",name:"Kompienga"},18:{code:"KOS",name:"Kossi"},19:{code:"KOL",name:"Koulpelogo"},20:{code:"KOT",name:"Kouritenga"},21:{code:"KOW",name:"Kourweogo"},22:{code:"LER",name:"Leraba"},23:{code:"LOR",name:"Loroum"},24:{code:"MOU",name:"Mouhoun"},25:{code:"NAH",name:"Nahouri"},26:{code:"NAM",name:"Namentenga"},27:{code:"NAY",name:"Nayala"},28:{code:"NOU",name:"Noumbiel"},29:{code:"OUB",name:"Oubritenga"},30:{code:"OUD",name:"Oudalan"},31:{code:"PAS",name:"Passore"},32:{code:"PON",name:"Poni"},33:{code:"SAG",name:"Sanguie"},34:{code:"SAM",name:"Sanmatenga"},35:{code:"SEN",name:"Seno"},36:{code:"SIS",name:"Sissili"},37:{code:"SOM",name:"Soum"},38:{code:"SOR",name:"Sourou"},39:{code:"TAP",name:"Tapoa"},40:{code:"TUY",name:"Tuy"},41:{code:"YAG",name:"Yagha"},42:{code:"YAT",name:"Yatenga"},43:{code:"ZIR",name:"Ziro"},44:{code:"ZOD",name:"Zondoma"},45:{code:"ZOW",name:"Zoundweogo"}},BI:{1:{code:"BB",name:"Bubanza"},2:{code:"BJ",name:"Bujumbura"},3:{code:"BR",name:"Bururi"},4:{code:"CA",name:"Cankuzo"},5:{code:"CI",name:"Cibitoke"},6:{code:"GI",name:"Gitega"},7:{code:"KR",name:"Karuzi"},8:{code:"KY",name:"Kayanza"},9:{code:"KI",name:"Kirundo"},10:{code:"MA",name:"Makamba"},11:{code:"MU",name:"Muramvya"},12:{code:"MY",name:"Muyinga"},13:{code:"MW",name:"Mwaro"},14:{code:"NG",name:"Ngozi"},15:{code:"RT",name:"Rutana"},16:{code:"RY",name:"Ruyigi"}},KH:{1:{code:"BA",name:"Battambang"},2:{code:"BM",name:"Banteay Meanchey"},3:{code:"KB",name:"Keb"},4:{code:"KK",name:"Kaoh Kong"},5:{code:"KL",name:"Kandal"},6:{code:"KM",name:"Kampong Cham"},7:{code:"KN",name:"Kampong Chhnang"},8:{code:"KO",name:"Kampong Som"},9:{code:"KP",name:"Kampot"},10:{code:"KR",name:"Kratie"},11:{code:"KT",name:"Kampong Thom"},12:{code:"KU",name:"Kampong Speu"},13:{code:"MK",name:"Mondul Kiri"},14:{code:"OM",name:"Oddar Meancheay"},15:{code:"PA",name:"Pailin"},16:{code:"PG",name:"Prey Veng"},17:{code:"PP",name:"Phnom Penh"},18:{code:"PR",name:"Preah Vihear"},19:{code:"PS",name:"Preah Seihanu (Kompong Som or Si)"},20:{code:"PU",name:"Pursat"},21:{code:"RK",name:"Ratanak Kiri"},22:{code:"SI",name:"Siemreap"},23:{code:"SR",name:"Svay Rieng"},24:{code:"ST",name:"Stung Treng"},25:{code:"TK",name:"Takeo"}},CM:{1:{code:"ADA",name:"Adamawa (Adamaoua)"},2:{code:"CEN",name:"Centre"},3:{code:"EST",name:"East (Est)"},4:{code:"EXN",name:"Extrême-Nord"},5:{code:"LIT",name:"Littoral"},6:{code:"NOR",name:"North (Nord)"},7:{code:"NOT",name:"Northwest (Nord-Ouest)"},8:{code:"OUE",name:"West (Ouest)"},9:{code:"SUD",name:"South (Sud)"},10:{code:"SOU",name:"Southwest (Sud-Ouest)"}},CA:{1:{code:"AB",name:"Alberta"},2:{code:"BC",name:"British Columbia"},3:{code:"MB",name:"Manitoba"},4:{code:"NB",name:"New Brunswick"},5:{code:"NL",name:"Newfoundland and Labrador"},6:{code:"NT",name:"Northwest Territories"},7:{code:"NS",name:"Nova Scotia"},8:{code:"NU",name:"Nunavut"},9:{code:"ON",name:"Ontario"},10:{code:"PE",name:"Prince Edward Island"},11:{code:"QC",name:"Québec"},12:{code:"SK",name:"Saskatchewan"},13:{code:"YT",name:"Yukon Territory"}},CV:{1:{code:"BV",name:"Boa Vista"},2:{code:"BR",name:"Brava"},3:{code:"CS",name:"Calheta de Sao Miguel"},4:{code:"MA",name:"Maio"},5:{code:"MO",name:"Mosteiros"},6:{code:"PA",name:"Paul"},7:{code:"PN",name:"Porto Novo"},8:{code:"PR",name:"Praia"},9:{code:"RG",name:"Ribeira Grande"},10:{code:"SL",name:"Sal"},11:{code:"CA",name:"Santa Catarina"},12:{code:"CR",name:"Santa Cruz"},13:{code:"SD",name:"Sao Domingos"},14:{code:"SF",name:"Sao Filipe"},15:{code:"SN",name:"Sao Nicolau"},16:{code:"SV",name:"Sao Vicente"},17:{code:"TA",name:"Tarrafal"}},KY:{1:{code:"CR",name:"Creek"},2:{code:"EA",name:"Eastern"},3:{code:"ML",name:"Midland"},4:{code:"ST",name:"South Town"},5:{code:"SP",name:"Spot Bay"},6:{code:"SK",name:"Stake Bay"},7:{code:"WD",name:"West End"},8:{code:"WN",name:"Western"}},CF:{1:{code:"BAN",name:"Bangui"},2:{code:"BBA",name:"Bamingui-Bangoran"},3:{code:"BKO",name:"Basse-Kotto"},4:{code:"HKO",name:"Haute-Kotto"},5:{code:"HMB",name:"Haut-Mbomou"},6:{code:"KEM",name:"Kemo"},7:{code:"LOB",name:"Lobaye"},8:{code:"MBO",name:"Mbomou"},9:{code:"MKD",name:"Mambéré-Kadéï"},10:{code:"NGR",name:"Nana-Grebizi"},11:{code:"NMM",name:"Nana-Mambere"},12:{code:"OMP",name:"Ombella-M'Poko"},13:{code:"OPE",name:"Ouham-Pende"},14:{code:"OUH",name:"Ouham"},15:{code:"OUK",name:"Ouaka"},16:{code:"SMB",name:"Sangha-Mbaere"},17:{code:"VAK",name:"Vakaga"}},TD:{1:{code:"BA",name:"Batha"},2:{code:"BI",name:"Biltine"},3:{code:"BE",name:"Borkou-Ennedi-Tibesti"},4:{code:"CB",name:"Chari-Baguirmi"},5:{code:"GU",name:"Guera"},6:{code:"KA",name:"Kanem"},7:{code:"LA",name:"Lac"},8:{code:"LC",name:"Logone Occidental"},9:{code:"LR",name:"Logone Oriental"},10:{code:"MK",name:"Mayo-Kebbi"},11:{code:"MC",name:"Moyen-Chari"},12:{code:"OU",name:"Ouaddai"},13:{code:"SA",name:"Salamat"},14:{code:"TA",name:"Tandjile"}},CL:{1:{code:"AI",name:"Aisen del General Carlos Ibanez"},2:{code:"AN",name:"Antofagasta"},3:{code:"AR",name:"Araucania"},4:{code:"AT",name:"Atacama"},5:{code:"BI",name:"Bio-Bio"},6:{code:"CO",name:"Coquimbo"},7:{code:"LI",name:"Libertador General Bernardo O'Hi"},8:{code:"LL",name:"Los Lagos"},9:{code:"MA",name:"Magallanes y de la Antartica Chi"},10:{code:"ML",name:"Maule"},11:{code:"RM",name:"Region Metropolitana"},12:{code:"TA",name:"Tarapaca"},13:{code:"VS",name:"Valparaiso"}},CN:{1:{code:"AN",name:"Anhui"},2:{code:"BE",name:"Beijing"},3:{code:"CH",name:"Chongqing"},4:{code:"FU",name:"Fujian"},5:{code:"GA",name:"Gansu"},6:{code:"GU",name:"Guangdong"},7:{code:"GX",name:"Guangxi"},8:{code:"GZ",name:"Guizhou"},9:{code:"HA",name:"Hainan"},10:{code:"HB",name:"Hebei"},11:{code:"HL",name:"Heilongjiang"},12:{code:"HE",name:"Henan"},13:{code:"HK",name:"Hong Kong"},14:{code:"HU",name:"Hubei"},15:{code:"HN",name:"Hunan"},16:{code:"IM",name:"Inner Mongolia"},17:{code:"JI",name:"Jiangsu"},18:{code:"JX",name:"Jiangxi"},19:{code:"JL",name:"Jilin"},20:{code:"LI",name:"Liaoning"},21:{code:"MA",name:"Macau"},22:{code:"NI",name:"Ningxia"},23:{code:"SH",name:"Shaanxi"},24:{code:"SA",name:"Shandong"},25:{code:"SG",name:"Shanghai"},26:{code:"SX",name:"Shanxi"},27:{code:"SI",name:"Sichuan"},28:{code:"TI",name:"Tianjin"},29:{code:"XI",name:"Xinjiang"},30:{code:"YU",name:"Yunnan"},31:{code:"ZH",name:"Zhejiang"}},CC:{1:{code:"D",name:"Direction Island"},2:{code:"H",name:"Home Island"},3:{code:"O",name:"Horsburgh Island"},4:{code:"S",name:"South Island"},5:{code:"W",name:"West Island"}},CO:{1:{code:"AMZ",name:"Amazonas"},2:{code:"ANT",name:"Antioquia"},3:{code:"ARA",name:"Arauca"},4:{code:"ATL",name:"Atlantico"},5:{code:"BDC",name:"Bogota D.C."},6:{code:"BOL",name:"Bolivar"},7:{code:"BOY",name:"Boyaca"},8:{code:"CAL",name:"Caldas"},9:{code:"CAQ",name:"Caqueta"},10:{code:"CAS",name:"Casanare"},11:{code:"CAU",name:"Cauca"},12:{code:"CES",name:"Cesar"},13:{code:"CHO",name:"Choco"},14:{code:"COR",name:"Cordoba"},15:{code:"CAM",name:"Cundinamarca"},16:{code:"GNA",name:"Guainia"},17:{code:"GJR",name:"Guajira"},18:{code:"GVR",name:"Guaviare"},19:{code:"HUI",name:"Huila"},20:{code:"MAG",name:"Magdalena"},21:{code:"MET",name:"Meta"},22:{code:"NAR",name:"Narino"},23:{code:"NDS",name:"Norte de Santander"},24:{code:"PUT",name:"Putumayo"},25:{code:"QUI",name:"Quindio"},26:{code:"RIS",name:"Risaralda"},27:{code:"SAP",name:"San Andres y Providencia"},28:{code:"SAN",name:"Santander"},29:{code:"SUC",name:"Sucre"},30:{code:"TOL",name:"Tolima"},31:{code:"VDC",name:"Valle del Cauca"},32:{code:"VAU",name:"Vaupes"},33:{code:"VIC",name:"Vichada"}},KM:{1:{code:"G",name:"Grande Comore"},2:{code:"A",name:"Anjouan"},3:{code:"M",name:"Moheli"}},CG:{1:{code:"BO",name:"Bouenza"},2:{code:"BR",name:"Brazzaville"},3:{code:"CU",name:"Cuvette"},4:{code:"CO",name:"Cuvette-Ouest"},5:{code:"KO",name:"Kouilou"},6:{code:"LE",name:"Lekoumou"},7:{code:"LI",name:"Likouala"},8:{code:"NI",name:"Niari"},9:{code:"PL",name:"Plateaux"},10:{code:"PO",name:"Pool"},11:{code:"SA",name:"Sangha"}},CK:{1:{code:"AI",name:"Aitutaki"},2:{code:"AT",name:"Atiu"},3:{code:"MA",name:"Manuae"},4:{code:"MG",name:"Mangaia"},5:{code:"MK",name:"Manihiki"},6:{code:"MT",name:"Mitiaro"},7:{code:"MU",name:"Mauke"},8:{code:"NI",name:"Nassau Island"},9:{code:"PA",name:"Palmerston"},10:{code:"PE",name:"Penrhyn"},11:{code:"PU",name:"Pukapuka"},12:{code:"RK",name:"Rakahanga"},13:{code:"RR",name:"Rarotonga"},14:{code:"SU",name:"Surwarrow"},15:{code:"TA",name:"Takutea"}},CR:{1:{code:"AL",name:"Alajuela"},2:{code:"CA",name:"Cartago"},3:{code:"GU",name:"Guanacaste"},4:{code:"HE",name:"Heredia"},5:{code:"LI",name:"Limon"},6:{code:"PU",name:"Puntarenas"},7:{code:"SJ",name:"San Jose"}},CI:{1:{code:"ABE",name:"Abengourou"},2:{code:"ABI",name:"Abidjan"},3:{code:"ABO",name:"Aboisso"},4:{code:"ADI",name:"Adiake"},5:{code:"ADZ",name:"Adzope"},6:{code:"AGB",name:"Agboville"},7:{code:"AGN",name:"Agnibilekrou"},8:{code:"ALE",name:"Alepe"},9:{code:"BOC",name:"Bocanda"},10:{code:"BAN",name:"Bangolo"},11:{code:"BEO",name:"Beoumi"},12:{code:"BIA",name:"Biankouma"},13:{code:"BDK",name:"Bondoukou"},14:{code:"BGN",name:"Bongouanou"},15:{code:"BFL",name:"Bouafle"},16:{code:"BKE",name:"Bouake"},17:{code:"BNA",name:"Bouna"},18:{code:"BDL",name:"Boundiali"},19:{code:"DKL",name:"Dabakala"},20:{code:"DBU",name:"Dabou"},21:{code:"DAL",name:"Daloa"},22:{code:"DAN",name:"Danane"},23:{code:"DAO",name:"Daoukro"},24:{code:"DIM",name:"Dimbokro"},25:{code:"DIV",name:"Divo"},26:{code:"DUE",name:"Duekoue"},27:{code:"FER",name:"Ferkessedougou"},28:{code:"GAG",name:"Gagnoa"},29:{code:"GBA",name:"Grand-Bassam"},30:{code:"GLA",name:"Grand-Lahou"},31:{code:"GUI",name:"Guiglo"},32:{code:"ISS",name:"Issia"},33:{code:"JAC",name:"Jacqueville"},34:{code:"KAT",name:"Katiola"},35:{code:"KOR",name:"Korhogo"},36:{code:"LAK",name:"Lakota"},37:{code:"MAN",name:"Man"},38:{code:"MKN",name:"Mankono"},39:{code:"MBA",name:"Mbahiakro"},40:{code:"ODI",name:"Odienne"},41:{code:"OUM",name:"Oume"},42:{code:"SAK",name:"Sakassou"},43:{code:"SPE",name:"San-Pedro"},44:{code:"SAS",name:"Sassandra"},45:{code:"SEG",name:"Seguela"},46:{code:"SIN",name:"Sinfra"},47:{code:"SOU",name:"Soubre"},48:{code:"TAB",name:"Tabou"},49:{code:"TAN",name:"Tanda"},50:{code:"TIE",name:"Tiebissou"},51:{code:"TIN",name:"Tingrela"},52:{code:"TIA",name:"Tiassale"},53:{code:"TBA",name:"Touba"},54:{code:"TLP",name:"Toulepleu"},55:{code:"TMD",name:"Toumodi"},56:{code:"VAV",name:"Vavoua"},57:{code:"YAM",name:"Yamoussoukro"},58:{code:"ZUE",name:"Zuenoula"}},HR:{1:{code:"BB",name:"Bjelovar-Bilogora"},2:{code:"CZ",name:"City of Zagreb"},3:{code:"DN",name:"Dubrovnik-Neretva"},4:{code:"IS",name:"Istra"},5:{code:"KA",name:"Karlovac"},6:{code:"KK",name:"Koprivnica-Krizevci"},7:{code:"KZ",name:"Krapina-Zagorje"},8:{code:"LS",name:"Lika-Senj"},9:{code:"ME",name:"Medimurje"},10:{code:"OB",name:"Osijek-Baranja"},11:{code:"PS",name:"Pozega-Slavonia"},12:{code:"PG",name:"Primorje-Gorski Kotar"},13:{code:"SI",name:"Sibenik"},14:{code:"SM",name:"Sisak-Moslavina"},15:{code:"SB",name:"Slavonski Brod-Posavina"},16:{code:"SD",name:"Split-Dalmatia"},17:{code:"VA",name:"Varazdin"},18:{code:"VP",name:"Virovitica-Podravina"},19:{code:"VS",name:"Vukovar-Srijem"},20:{code:"ZK",name:"Zadar-Knin"},21:{code:"ZA",name:"Zagreb"}},CU:{1:{code:"CA",name:"Camaguey"},2:{code:"CD",name:"Ciego de Avila"},3:{code:"CI",name:"Cienfuegos"},4:{code:"CH",name:"Ciudad de La Habana"},5:{code:"GR",name:"Granma"},6:{code:"GU",name:"Guantanamo"},7:{code:"HO",name:"Holguin"},8:{code:"IJ",name:"Isla de la Juventud"},9:{code:"LH",name:"La Habana"},10:{code:"LT",name:"Las Tunas"},11:{code:"MA",name:"Matanzas"},12:{code:"PR",name:"Pinar del Rio"},13:{code:"SS",name:"Sancti Spiritus"},14:{code:"SC",name:"Santiago de Cuba"},15:{code:"VC",name:"Villa Clara"}},CY:{1:{code:"F",name:"Famagusta"},2:{code:"K",name:"Kyrenia"},3:{code:"A",name:"Larnaca"},4:{code:"I",name:"Limassol"},5:{code:"N",name:"Nicosia"},6:{code:"P",name:"Paphos"}},CZ:{1:{code:"A",name:"Hlavní město Praha"},2:{code:"B",name:"Jihomoravský"},3:{code:"C",name:"Jihočeský"},4:{code:"E",name:"Pardubický"},5:{code:"H",name:"Královéhradecký"},6:{code:"J",name:"Vysočina"},7:{code:"K",name:"Karlovarský"},8:{code:"L",name:"Liberecký"},9:{code:"M",name:"Olomoucký"},10:{code:"P",name:"Plzeňský"},11:{code:"S",name:"Středočeský"},12:{code:"T",name:"Moravskoslezský"},13:{code:"U",name:"Ústecký"},14:{code:"Z",name:"Zlínský"}},DK:{1:{code:"AR",name:"Arhus"},2:{code:"BH",name:"Bornholm"},3:{code:"CO",name:"Copenhagen"},4:{code:"FO",name:"Faroe Islands"},5:{code:"FR",name:"Frederiksborg"},6:{code:"FY",name:"Fyn"},7:{code:"KO",name:"Kobenhavn"},8:{code:"NO",name:"Nordjylland"},9:{code:"RI",name:"Ribe"},10:{code:"RK",name:"Ringkobing"},11:{code:"RO",name:"Roskilde"},12:{code:"SO",name:"Sonderjylland"},13:{code:"ST",name:"Storstrom"},14:{code:"VK",name:"Vejle"},15:{code:"VJ",name:"Vestjælland"},16:{code:"VB",name:"Viborg"}},DJ:{1:{code:"S",name:"'Ali Sabih"},2:{code:"K",name:"Dikhil"},3:{code:"J",name:"Djibouti"},4:{code:"O",name:"Obock"},5:{code:"T",name:"Tadjoura"}},DM:{1:{code:"AND",name:"Saint Andrew Parish"},2:{code:"DAV",name:"Saint David Parish"},3:{code:"GEO",name:"Saint George Parish"},4:{code:"JOH",name:"Saint John Parish"},5:{code:"JOS",name:"Saint Joseph Parish"},6:{code:"LUK",name:"Saint Luke Parish"},7:{code:"MAR",name:"Saint Mark Parish"},8:{code:"PAT",name:"Saint Patrick Parish"},9:{code:"PAU",name:"Saint Paul Parish"},10:{code:"PET",name:"Saint Peter Parish"}},DO:{1:{code:"DN",name:"Distrito Nacional"},2:{code:"AZ",name:"Azua"},3:{code:"BC",name:"Baoruco"},4:{code:"BH",name:"Barahona"},5:{code:"DJ",name:"Dajabon"},6:{code:"DU",name:"Duarte"},7:{code:"EL",name:"Elias Pina"},8:{code:"SY",name:"El Seybo"},9:{code:"ET",name:"Espaillat"},10:{code:"HM",name:"Hato Mayor"},11:{code:"IN",name:"Independencia"},12:{code:"AL",name:"La Altagracia"},13:{code:"RO",name:"La Romana"},14:{code:"VE",name:"La Vega"},15:{code:"MT",name:"Maria Trinidad Sanchez"},16:{code:"MN",name:"Monsenor Nouel"},17:{code:"MC",name:"Monte Cristi"},18:{code:"MP",name:"Monte Plata"},19:{code:"PD",name:"Pedernales"},20:{code:"PR",name:"Peravia (Bani)"},21:{code:"PP",name:"Puerto Plata"},22:{code:"SL",name:"Salcedo"},23:{code:"SM",name:"Samana"},24:{code:"SH",name:"Sanchez Ramirez"},25:{code:"SC",name:"San Cristobal"},26:{code:"JO",name:"San Jose de Ocoa"},27:{code:"SJ",name:"San Juan"},28:{code:"PM",name:"San Pedro de Macoris"},29:{code:"SA",name:"Santiago"},30:{code:"ST",name:"Santiago Rodriguez"},31:{code:"SD",name:"Santo Domingo"},32:{code:"VA",name:"Valverde"}},TP:{1:{code:"AL",name:"Aileu"},2:{code:"AN",name:"Ainaro"},3:{code:"BA",name:"Baucau"},4:{code:"BO",name:"Bobonaro"},5:{code:"CO",name:"Cova Lima"},6:{code:"DI",name:"Dili"},7:{code:"ER",name:"Ermera"},8:{code:"LA",name:"Lautem"},9:{code:"LI",name:"Liquica"},10:{code:"MT",name:"Manatuto"},11:{code:"MF",name:"Manufahi"},12:{code:"OE",name:"Oecussi"},13:{code:"VI",name:"Viqueque"}},EC:{1:{code:"AZU",name:"Azuay"},2:{code:"BOL",name:"Bolivar"},3:{code:"CAN",name:"Cañar"},4:{code:"CAR",name:"Carchi"},5:{code:"CHI",name:"Chimborazo"},6:{code:"COT",name:"Cotopaxi"},7:{code:"EOR",name:"El Oro"},8:{code:"ESM",name:"Esmeraldas"},9:{code:"GPS",name:"Galápagos"},10:{code:"GUA",name:"Guayas"},11:{code:"IMB",name:"Imbabura"},12:{code:"LOJ",name:"Loja"},13:{code:"LRO",name:"Los Ríos"},14:{code:"MAN",name:"Manabí"},15:{code:"MSA",name:"Morona Santiago"},16:{code:"NAP",name:"Napo"},17:{code:"ORE",name:"Orellana"},18:{code:"PAS",name:"Pastaza"},19:{code:"PIC",name:"Pichincha"},20:{code:"SUC",name:"Sucumbíos"},21:{code:"TUN",name:"Tungurahua"},22:{code:"ZCH",name:"Zamora Chinchipe"}},EG:{1:{code:"DHY",name:"Ad Daqahliyah"},2:{code:"BAM",name:"Al Bahr al Ahmar"},3:{code:"BHY",name:"Al Buhayrah"},4:{code:"FYM",name:"Al Fayyum"},5:{code:"GBY",name:"Al Gharbiyah"},6:{code:"IDR",name:"Al Iskandariyah"},7:{code:"IML",name:"Al Isma 'iliyah"},8:{code:"JZH",name:"Al Jizah"},9:{code:"MFY",name:"Al Minufiyah"},10:{code:"MNY",name:"Al Minya"},11:{code:"QHR",name:"Al Qahirah"},12:{code:"QLY",name:"Al Qalyubiyah"},13:{code:"WJD",name:"Al Wadi al Jadid"},14:{code:"SHQ",name:"Ash Sharqiyah"},15:{code:"SWY",name:"As Suways"},16:{code:"ASW",name:"Aswan"},17:{code:"ASY",name:"Asyut"},18:{code:"BSW",name:"Bani Suwayf"},19:{code:"BSD",name:"Bur Sa'id"},20:{code:"DMY",name:"Dumyat"},21:{code:"JNS",name:"Janub Sina'"},22:{code:"KSH",name:"Kafr ash Shaykh"},23:{code:"MAT",name:"Matruh"},24:{code:"QIN",name:"Qina"},25:{code:"SHS",name:"Shamal Sina'"},26:{code:"SUH",name:"Suhaj"}},SV:{1:{code:"AH",name:"Ahuachapan"},2:{code:"CA",name:"Cabanas"},3:{code:"CH",name:"Chalatenango"},4:{code:"CU",name:"Cuscatlan"},5:{code:"LB",name:"La Libertad"},6:{code:"PZ",name:"La Paz"},7:{code:"UN",name:"La Union"},8:{code:"MO",name:"Morazan"},9:{code:"SM",name:"San Miguel"},10:{code:"SS",name:"San Salvador"},11:{code:"SV",name:"San Vicente"},12:{code:"SA",name:"Santa Ana"},13:{code:"SO",name:"Sonsonate"},14:{code:"US",name:"Usulutan"}},GQ:{1:{code:"AN",name:"Provincia Annobon"},2:{code:"BN",name:"Provincia Bioko Norte"},3:{code:"BS",name:"Provincia Bioko Sur"},4:{code:"CS",name:"Provincia Centro Sur"},5:{code:"KN",name:"Provincia Kie-Ntem"},6:{code:"LI",name:"Provincia Litoral"},7:{code:"WN",name:"Provincia Wele-Nzas"}},ER:{1:{code:"MA",name:"Central (Maekel)"},2:{code:"KE",name:"Anseba (Keren)"},3:{code:"DK",name:"Southern Red Sea (Debub-Keih-Bah)"},4:{code:"SK",name:"Northern Red Sea (Semien-Keih-Ba)"},5:{code:"DE",name:"Southern (Debub)"},6:{code:"BR",name:"Gash-Barka (Barentu)"}},EE:{1:{code:"HA",name:"Harjumaa (Tallinn)"},2:{code:"HI",name:"Hiiumaa (Kardla)"},3:{code:"IV",name:"Ida-Virumaa (Johvi)"},4:{code:"JA",name:"Jarvamaa (Paide)"},5:{code:"JO",name:"Jogevamaa (Jogeva)"},6:{code:"LV",name:"Laane-Virumaa (Rakvere)"},7:{code:"LA",name:"Laanemaa (Haapsalu)"},8:{code:"PA",name:"Parnumaa (Parnu)"},9:{code:"PO",name:"Polvamaa (Polva)"},10:{code:"RA",name:"Raplamaa (Rapla)"},11:{code:"SA",name:"Saaremaa (Kuessaare)"},12:{code:"TA",name:"Tartumaa (Tartu)"},13:{code:"VA",name:"Valgamaa (Valga)"},14:{code:"VI",name:"Viljandimaa (Viljandi)"},15:{code:"VO",name:"Vorumaa (Voru)"}},ET:{1:{code:"AF",name:"Afar"},2:{code:"AH",name:"Amhara"},3:{code:"BG",name:"Benishangul-Gumaz"},4:{code:"GB",name:"Gambela"},5:{code:"HR",name:"Hariai"},6:{code:"OR",name:"Oromia"},7:{code:"SM",name:"Somali"},8:{code:"SN",name:"Southern Nations - Nationalities"},9:{code:"TG",name:"Tigray"},10:{code:"AA",name:"Addis Ababa"},11:{code:"DD",name:"Dire Dawa"}},FO:{1:{code:"TÛR",name:"Tûrshavnar Kommuna"},2:{code:"KLA",name:"Klaksvík"},3:{code:"RUN",name:"Runavík"},4:{code:"TVØ",name:"Tvøroyri"},5:{code:"FUG",name:"Fuglafjørður"},6:{code:"SUN",name:"Sunda Kommuna"},7:{code:"VáG",name:"Vágur"},8:{code:"NES",name:"Nes"},9:{code:"VES",name:"Vestmanna"},10:{code:"MIð",name:"Miðvágur"},11:{code:"SØR",name:"Sørvágur"},12:{code:"GØT",name:"Gøtu Kommuna"},13:{code:"SJû",name:"Sjûvar Kommuna"},14:{code:"LEI",name:"Leirvík"},15:{code:"SAN",name:"Sandavágur"},16:{code:"HVA",name:"Hvalba"},17:{code:"EIð",name:"Eiði"},18:{code:"KVí",name:"Kvívík"},19:{code:"SAN",name:"Sandur"},20:{code:"SKO",name:"Skopun"},21:{code:"HVA",name:"Hvannasund"},22:{code:"SUM",name:"Sumba"},23:{code:"VIð",name:"Viðareiði"},24:{code:"POR",name:"Porkeri"},25:{code:"SKá",name:"Skálavík"},26:{code:"KUN",name:"Kunoy"},27:{code:"HÚS",name:"HÚsavík"},28:{code:"HOV",name:"Hov"},29:{code:"FáM",name:"Fámjin"},30:{code:"FUN",name:"Funningur"},31:{code:"HÚS",name:"HÚsar"},32:{code:"SKÚ",name:"SkÚvoy"},33:{code:"SVí",name:"Svínoy"},34:{code:"FUG",name:"Fugloy"}},FJ:{1:{code:"C",name:"Central Division"},2:{code:"E",name:"Eastern Division"},3:{code:"N",name:"Northern Division"},4:{code:"R",name:"Rotuma"},5:{code:"W",name:"Western Division"}},FI:{1:{code:"AL",name:"Ahvenanmaan Laani"},2:{code:"ES",name:"Etela-Suomen Laani"},3:{code:"IS",name:"Ita-Suomen Laani"},4:{code:"LS",name:"Lansi-Suomen Laani"},5:{code:"LA",name:"Lapin Lanani"},6:{code:"OU",name:"Oulun Laani"}},FR:{1:{code:"AL",name:"Alsace"},2:{code:"AQ",name:"Aquitaine"},3:{code:"AU",name:"Auvergne"},4:{code:"BR",name:"Brittany"},5:{code:"BU",name:"Burgundy"},6:{code:"CE",name:"Center Loire Valley"},7:{code:"CH",name:"Champagne"},8:{code:"CO",name:"Corse"},9:{code:"FR",name:"France Comte"},10:{code:"LA",name:"Languedoc Roussillon"},11:{code:"LI",name:"Limousin"},12:{code:"LO",name:"Lorraine"},13:{code:"MI",name:"Midi Pyrenees"},14:{code:"NO",name:"Nord Pas de Calais"},15:{code:"NR",name:"Normandy"},16:{code:"PA",name:"Paris / Ile de France"},17:{code:"PI",name:"Picardie"},18:{code:"PO",name:"Poitou Charente"},19:{code:"PR",name:"Provence"},20:{code:"RH",name:"Rhone Alps"},21:{code:"RI",name:"Riviera"},22:{code:"WE",name:"Western Loire Valley"}},FX:{1:{code:"Et",name:"Etranger"},2:{code:"01",name:"Ain"},3:{code:"02",name:"Aisne"},4:{code:"03",name:"Allier"},5:{code:"04",name:"Alpes de Haute Provence"},6:{code:"05",name:"Hautes-Alpes"},7:{code:"06",name:"Alpes Maritimes"},8:{code:"07",name:"Ardèche"},9:{code:"08",name:"Ardennes"},10:{code:"09",name:"Ariège"},11:{code:"10",name:"Aube"},12:{code:"11",name:"Aude"},13:{code:"12",name:"Aveyron"},14:{code:"13",name:"Bouches du Rhône"},15:{code:"14",name:"Calvados"},16:{code:"15",name:"Cantal"},17:{code:"16",name:"Charente"},18:{code:"17",name:"Charente Maritime"},19:{code:"18",name:"Cher"},20:{code:"19",name:"Corrèze"},21:{code:"2A",name:"Corse du Sud"},22:{code:"2B",name:"Haute Corse"},23:{code:"21",name:"Côte d'or"},24:{code:"22",name:"Côtes d'Armor"},25:{code:"23",name:"Creuse"},26:{code:"24",name:"Dordogne"},27:{code:"25",name:"Doubs"},28:{code:"26",name:"Drôme"},29:{code:"27",name:"Eure"},30:{code:"28",name:"Eure et Loir"},31:{code:"29",name:"Finistère"},32:{code:"30",name:"Gard"},33:{code:"31",name:"Haute Garonne"},34:{code:"32",name:"Gers"},35:{code:"33",name:"Gironde"},36:{code:"34",name:"Hérault"},37:{code:"35",name:"Ille et Vilaine"},38:{code:"36",name:"Indre"},39:{code:"37",name:"Indre et Loire"},40:{code:"38",name:"Isére"},41:{code:"39",name:"Jura"},42:{code:"40",name:"Landes"},43:{code:"41",name:"Loir et Cher"},44:{code:"42",name:"Loire"},45:{code:"43",name:"Haute Loire"},46:{code:"44",name:"Loire Atlantique"},47:{code:"45",name:"Loiret"},48:{code:"46",name:"Lot"},49:{code:"47",name:"Lot et Garonne"},50:{code:"48",name:"Lozère"},51:{code:"49",name:"Maine et Loire"},52:{code:"50",name:"Manche"},53:{code:"51",name:"Marne"},54:{code:"52",name:"Haute Marne"},55:{code:"53",name:"Mayenne"},56:{code:"54",name:"Meurthe et Moselle"},57:{code:"55",name:"Meuse"},58:{code:"56",name:"Morbihan"},59:{code:"57",name:"Moselle"},60:{code:"58",name:"Nièvre"},61:{code:"59",name:"Nord"},62:{code:"60",name:"Oise"},63:{code:"61",name:"Orne"},64:{code:"62",name:"Pas de Calais"},65:{code:"63",name:"Puy de Dôme"},66:{code:"64",name:"Pyrenees Atlantique"},67:{code:"65",name:"Hautes Pyrenees"},68:{code:"66",name:"Pyrenees Orientale"},69:{code:"67",name:"Bas Rhin"},70:{code:"68",name:"Haut Rhin"},71:{code:"69",name:"Rhône"},72:{code:"70",name:"Haute Saône"},73:{code:"71",name:"Saône et Loire"},74:{code:"72",name:"Sarthe"},75:{code:"73",name:"Savoie"},76:{code:"74",name:"Haute Savoie"},77:{code:"75",name:"Paris"},78:{code:"76",name:"Seine Martitime"},79:{code:"77",name:"Seine et Marne"},80:{code:"78",name:"Yvelines"},81:{code:"79",name:"Deux Sèvres"},82:{code:"80",name:"Somme"},83:{code:"81",name:"Tarn"},84:{code:"82",name:"Tarn et Garonne"},85:{code:"83",name:"Var"},86:{code:"84",name:"Vaucluse"},87:{code:"85",name:"Vendée"},88:{code:"86",name:"Vienne"},89:{code:"87",name:"Haute Vienne"},90:{code:"88",name:"Vosges"},91:{code:"89",name:"Yonne"},92:{code:"90",name:"Territoire de Belfort"},93:{code:"91",name:"Essonne"},94:{code:"92",name:"Hauts de Seine"},95:{code:"93",name:"Seine St-Denis"},96:{code:"94",name:"Val de Marne"},97:{code:"95",name:"Val d'oise"}},GF:{1:{code:"AWA",name:"Awala-Yalimapo"},2:{code:"MAN",name:"Mana"},3:{code:"SAI",name:"Saint-Laurent-Du-Maroni"},4:{code:"APA",name:"Apatou"},5:{code:"GRA",name:"Grand-Santi"},6:{code:"PAP",name:"Papaïchton"},7:{code:"SAÜ",name:"SaÜl"},8:{code:"MAR",name:"Maripasoula"},9:{code:"CAM",name:"Camopi"},10:{code:"SAI",name:"Saint-Georges"},11:{code:"OUA",name:"Ouanary"},12:{code:"RéG",name:"Régina"},13:{code:"ROU",name:"Roura"},14:{code:"SAI",name:"Saint-élie"},15:{code:"IRA",name:"Iracoubo"},16:{code:"SIN",name:"Sinnamary"},17:{code:"KOU",name:"Kourou"},18:{code:"MAC",name:"Macouria"},19:{code:"MON",name:"Montsinéry-Tonnegrande"},20:{code:"MAT",name:"Matoury"},21:{code:"CAY",name:"Cayenne"},22:{code:"REM",name:"Remire-Montjoly"}},PF:{1:{code:"M",name:"Archipel des Marquises"},2:{code:"T",name:"Archipel des Tuamotu"},3:{code:"I",name:"Archipel des Tubuai"},4:{code:"V",name:"Iles du Vent"},5:{code:"S",name:"Iles Sous-le-Vent"}},TF:{1:{code:"C",name:"Iles Crozet"},2:{code:"K",name:"Iles Kerguelen"},3:{code:"A",name:"Ile Amsterdam"},4:{code:"P",name:"Ile Saint-Paul"},5:{code:"D",name:"Adelie Land"}},GA:{1:{code:"ES",name:"Estuaire"},2:{code:"HO",name:"Haut-Ogooue"},3:{code:"MO",name:"Moyen-Ogooue"},4:{code:"NG",name:"Ngounie"},5:{code:"NY",name:"Nyanga"},6:{code:"OI",name:"Ogooue-Ivindo"},7:{code:"OL",name:"Ogooue-Lolo"},8:{code:"OM",name:"Ogooue-Maritime"},9:{code:"WN",name:"Woleu-Ntem"}},GM:{1:{code:"BJ",name:"Banjul"},2:{code:"BS",name:"Basse"},3:{code:"BR",name:"Brikama"},4:{code:"JA",name:"Janjangbure"},5:{code:"KA",name:"Kanifeng"},6:{code:"KE",name:"Kerewan"},7:{code:"KU",name:"Kuntaur"},8:{code:"MA",name:"Mansakonko"},9:{code:"LR",name:"Lower River"},10:{code:"CR",name:"Central River"},11:{code:"NB",name:"North Bank"},12:{code:"UR",name:"Upper River"},13:{code:"WE",name:"Western"}},GE:{1:{code:"AB",name:"Abkhazia"},2:{code:"AJ",name:"Ajaria"},3:{code:"GU",name:"Guria"},4:{code:"IM",name:"Imereti"},5:{code:"KA",name:"Kakheti"},6:{code:"KK",name:"Kvemo Kartli"},7:{code:"MM",name:"Mtskheta-Mtianeti"},8:{code:"RL",name:"Racha Lechkhumi and Kvemo Svanet"},9:{code:"SJ",name:"Samtskhe-Javakheti"},10:{code:"SK",name:"Shida Kartli"},11:{code:"SZ",name:"Samegrelo-Zemo Svaneti"},12:{code:"TB",name:"Tbilisi"}},DE:{1:{code:"BAW",name:"Baden-Württemberg"},2:{code:"BAY",name:"Bayern"},3:{code:"BER",name:"Berlin"},4:{code:"BRG",name:"Brandenburg"},5:{code:"BRE",name:"Bremen"},6:{code:"HAM",name:"Hamburg"},7:{code:"HES",name:"Hessen"},8:{code:"MEC",name:"Mecklenburg-Vorpommern"},9:{code:"NDS",name:"Niedersachsen"},10:{code:"NRW",name:"Nordrhein-Westfalen"},11:{code:"RHE",name:"Rheinland-Pfalz"},12:{code:"SAR",name:"Saarland"},13:{code:"SAS",name:"Sachsen"},14:{code:"SAC",name:"Sachsen-Anhalt"},15:{code:"SCN",name:"Schleswig-Holstein"},16:{code:"THE",name:"Thüringen"}},GH:{1:{code:"AS",name:"Ashanti Region"},2:{code:"BA",name:"Brong-Ahafo Region"},3:{code:"CE",name:"Central Region"},4:{code:"EA",name:"Eastern Region"},5:{code:"GA",name:"Greater Accra Region"},6:{code:"NO",name:"Northern Region"},7:{code:"UE",name:"Upper East Region"},8:{code:"UW",name:"Upper West Region"},9:{code:"VO",name:"Volta Region"},10:{code:"WE",name:"Western Region"}},GI:{1:{code:"EAS",name:"East Side"},2:{code:"NOR",name:"North District"},3:{code:"REC",name:"Reclamation Areas"},4:{code:"SAN",name:"Sandpits Area"},5:{code:"SOU",name:"South District"},6:{code:"TOW",name:"Town Area"},7:{code:"UPP",name:"Upper Town"},8:{code:"OTH",name:"Other"}},GR:{1:{code:"AT",name:"Attica"},2:{code:"CN",name:"Central Greece"},3:{code:"CM",name:"Central Macedonia"},4:{code:"CR",name:"Crete"},5:{code:"EM",name:"East Macedonia and Thrace"},6:{code:"EP",name:"Epirus"},7:{code:"II",name:"Ionian Islands"},8:{code:"NA",name:"North Aegean"},9:{code:"PP",name:"Peloponnesos"},10:{code:"SA",name:"South Aegean"},11:{code:"TH",name:"Thessaly"},12:{code:"WG",name:"West Greece"},13:{code:"WM",name:"West Macedonia"}},GL:{1:{code:"A",name:"Avannaa"},2:{code:"T",name:"Tunu"},3:{code:"K",name:"Kitaa"}},86:{1:{code:"A",name:"Saint Andrew"},2:{code:"D",name:"Saint David"},3:{code:"G",name:"Saint George"},4:{code:"J",name:"Saint John"},5:{code:"M",name:"Saint Mark"},6:{code:"P",name:"Saint Patrick"},7:{code:"C",name:"Carriacou"},8:{code:"Q",name:"Petit Martinique"}},GP:{1:{code:"ARR",name:"Arrondissements Of The Guadeloup"},2:{code:"CAN",name:"Cantons Of The Guadeloup Depart"},3:{code:"COM",name:"Communes Of The Guadeloup Depart"}},GU:{1:{code:"AGA",name:"Agana Heights"},2:{code:"AGA",name:"Agat"},3:{code:"ASA",name:"Asan Maina"},4:{code:"BAR",name:"Barrigada"},5:{code:"CHA",name:"Chalan Pago Ordot"},6:{code:"DED",name:"Dededo"},7:{code:"HAG",name:"HagÅtña"},8:{code:"INA",name:"Inarajan"},9:{code:"MAN",name:"Mangilao"},10:{code:"MER",name:"Merizo"},11:{code:"MON",name:"Mongmong Toto Maite"},12:{code:"PIT",name:"Piti"},13:{code:"SAN",name:"Santa Rita"},14:{code:"SIN",name:"Sinajana"},15:{code:"TAL",name:"Talofofo"},16:{code:"TAM",name:"Tamuning"},17:{code:"UMA",name:"Umatac"},18:{code:"YIG",name:"Yigo"},19:{code:"YON",name:"Yona"}},GT:{1:{code:"AV",name:"Alta Verapaz"},2:{code:"BV",name:"Baja Verapaz"},3:{code:"CM",name:"Chimaltenango"},4:{code:"CQ",name:"Chiquimula"},5:{code:"PE",name:"El Peten"},6:{code:"PR",name:"El Progreso"},7:{code:"QC",name:"El Quiche"},8:{code:"ES",name:"Escuintla"},9:{code:"GU",name:"Guatemala"},10:{code:"HU",name:"Huehuetenango"},11:{code:"IZ",name:"Izabal"},12:{code:"JA",name:"Jalapa"},13:{code:"JU",name:"Jutiapa"},14:{code:"QZ",name:"Quetzaltenango"},15:{code:"RE",name:"Retalhuleu"},16:{code:"ST",name:"Sacatepequez"},17:{code:"SM",name:"San Marcos"},18:{code:"SR",name:"Santa Rosa"},19:{code:"SO",name:"Solola"},20:{code:"SU",name:"Suchitepequez"},21:{code:"TO",name:"Totonicapan"},22:{code:"ZA",name:"Zacapa"}},GN:{1:{code:"CNK",name:"Conakry"},2:{code:"BYL",name:"Beyla"},3:{code:"BFA",name:"Boffa"},4:{code:"BOK",name:"Boke"},5:{code:"COY",name:"Coyah"},6:{code:"DBL",name:"Dabola"},7:{code:"DLB",name:"Dalaba"},8:{code:"DGR",name:"Dinguiraye"},9:{code:"DBR",name:"Dubreka"},10:{code:"FRN",name:"Faranah"},11:{code:"FRC",name:"Forecariah"},12:{code:"FRI",name:"Fria"},13:{code:"GAO",name:"Gaoual"},14:{code:"GCD",name:"Gueckedou"},15:{code:"KNK",name:"Kankan"},16:{code:"KRN",name:"Kerouane"},17:{code:"KND",name:"Kindia"},18:{code:"KSD",name:"Kissidougou"},19:{code:"KBA",name:"Koubia"},20:{code:"KDA",name:"Koundara"},21:{code:"KRA",name:"Kouroussa"},22:{code:"LAB",name:"Labe"},23:{code:"LLM",name:"Lelouma"},24:{code:"LOL",name:"Lola"},25:{code:"MCT",name:"Macenta"},26:{code:"MAL",name:"Mali"},27:{code:"MAM",name:"Mamou"},28:{code:"MAN",name:"Mandiana"},29:{code:"NZR",name:"Nzerekore"},30:{code:"PIT",name:"Pita"},31:{code:"SIG",name:"Siguiri"},32:{code:"TLM",name:"Telimele"},33:{code:"TOG",name:"Tougue"},34:{code:"YOM",name:"Yomou"}},GW:{1:{code:"BF",name:"Bafata Region"},2:{code:"BB",name:"Biombo Region"},3:{code:"BS",name:"Bissau Region"},4:{code:"BL",name:"Bolama Region"},5:{code:"CA",name:"Cacheu Region"},6:{code:"GA",name:"Gabu Region"},7:{code:"OI",name:"Oio Region"},8:{code:"QU",name:"Quinara Region"},9:{code:"TO",name:"Tombali Region"}},GY:{1:{code:"BW",name:"Barima-Waini"},2:{code:"CM",name:"Cuyuni-Mazaruni"},3:{code:"DM",name:"Demerara-Mahaica"},4:{code:"EC",name:"East Berbice-Corentyne"},5:{code:"EW",name:"Essequibo Islands-West Demerara"},6:{code:"MB",name:"Mahaica-Berbice"},7:{code:"PM",name:"Pomeroon-Supenaam"},8:{code:"PI",name:"Potaro-Siparuni"},9:{code:"UD",name:"Upper Demerara-Berbice"},10:{code:"UT",name:"Upper Takutu-Upper Essequibo"}},HT:{1:{code:"AR",name:"Artibonite"},2:{code:"CE",name:"Centre"},3:{code:"GA",name:"Grand'Anse"},4:{code:"ND",name:"Nord"},5:{code:"NE",name:"Nord-Est"},6:{code:"NO",name:"Nord-Ouest"},7:{code:"OU",name:"Ouest"},8:{code:"SD",name:"Sud"},9:{code:"SE",name:"Sud-Est"}},HM:{1:{code:"F",name:"Flat Island"},2:{code:"M",name:"McDonald Island"},3:{code:"S",name:"Shag Island"},4:{code:"H",name:"Heard Island"}},HN:{1:{code:"AT",name:"Atlantida"},2:{code:"CH",name:"Choluteca"},3:{code:"CL",name:"Colon"},4:{code:"CM",name:"Comayagua"},5:{code:"CP",name:"Copan"},6:{code:"CR",name:"Cortes"},7:{code:"PA",name:"El Paraiso"},8:{code:"FM",name:"Francisco Morazan"},9:{code:"GD",name:"Gracias a Dios"},10:{code:"IN",name:"Intibuca"},11:{code:"IB",name:"Islas de la Bahia (Bay Islands)"},12:{code:"PZ",name:"La Paz"},13:{code:"LE",name:"Lempira"},14:{code:"OC",name:"Ocotepeque"},15:{code:"OL",name:"Olancho"},16:{code:"SB",name:"Santa Barbara"},17:{code:"VA",name:"Valle"},18:{code:"YO",name:"Yoro"}},HK:{1:{code:"HCW",name:"Central and Western Hong Kong Is"},2:{code:"HEA",name:"Eastern Hong Kong Island"},3:{code:"HSO",name:"Southern Hong Kong Island"},4:{code:"HWC",name:"Wan Chai Hong Kong Island"},5:{code:"KKC",name:"Kowloon City Kowloon"},6:{code:"KKT",name:"Kwun Tong Kowloon"},7:{code:"KSS",name:"Sham Shui Po Kowloon"},8:{code:"KWT",name:"Wong Tai Sin Kowloon"},9:{code:"KYT",name:"Yau Tsim Mong Kowloon"},10:{code:"NIS",name:"Islands New Territories"},11:{code:"NKT",name:"Kwai Tsing New Territories"},12:{code:"NNO",name:"North New Territories"},13:{code:"NSK",name:"Sai Kung New Territories"},14:{code:"NST",name:"Sha Tin New Territories"},15:{code:"NTP",name:"Tai Po New Territories"},16:{code:"NTW",name:"Tsuen Wan New Territories"},17:{code:"NTM",name:"Tuen Mun New Territories"},18:{code:"NYL",name:"Yuen Long New Territories"}},HU:{1:{code:"BK",name:"Bacs-Kiskun"},2:{code:"BA",name:"Baranya"},3:{code:"BE",name:"Bekes"},4:{code:"BS",name:"Bekescsaba"},5:{code:"BZ",name:"Borsod-Abauj-Zemplen"},6:{code:"BU",name:"Budapest"},7:{code:"CS",name:"Csongrad"},8:{code:"DE",name:"Debrecen"},9:{code:"DU",name:"Dunaujvaros"},10:{code:"EG",name:"Eger"},11:{code:"FE",name:"Fejer"},12:{code:"GY",name:"Gyor"},13:{code:"GM",name:"Gyor-Moson-Sopron"},14:{code:"HB",name:"Hajdu-Bihar"},15:{code:"HE",name:"Heves"},16:{code:"HO",name:"Hodmezovasarhely"},17:{code:"JN",name:"Jasz-Nagykun-Szolnok"},18:{code:"KA",name:"Kaposvar"},19:{code:"KE",name:"Kecskemet"},20:{code:"KO",name:"Komarom-Esztergom"},21:{code:"MI",name:"Miskolc"},22:{code:"NA",name:"Nagykanizsa"},23:{code:"NO",name:"Nograd"},24:{code:"NY",name:"Nyiregyhaza"},25:{code:"PE",name:"Pecs"},26:{code:"PS",name:"Pest"},27:{code:"SO",name:"Somogy"},28:{code:"SP",name:"Sopron"},29:{code:"SS",name:"Szabolcs-Szatmar-Bereg"},30:{code:"SZ",name:"Szeged"},31:{code:"SE",name:"Szekesfehervar"},32:{code:"SL",name:"Szolnok"},33:{code:"SM",name:"Szombathely"},34:{code:"TA",name:"Tatabanya"},35:{code:"TO",name:"Tolna"},36:{code:"VA",name:"Vas"},37:{code:"VE",name:"Veszprem"},38:{code:"ZA",name:"Zala"},39:{code:"ZZ",name:"Zalaegerszeg"}},IS:{1:{code:"AL",name:"Austurland"},2:{code:"HF",name:"Hofuoborgarsvaeoi"},3:{code:"NE",name:"Norourland eystra"},4:{code:"NV",name:"Norourland vestra"},5:{code:"SL",name:"Suourland"},6:{code:"SN",name:"Suournes"},7:{code:"VF",name:"Vestfiroir"},8:{code:"VL",name:"Vesturland"}},IN:{1:{code:"AN",name:"Andaman and Nicobar Islands"},2:{code:"AP",name:"Andhra Pradesh"},3:{code:"AR",name:"Arunachal Pradesh"},4:{code:"AS",name:"Assam"},5:{code:"BI",name:"Bihar"},6:{code:"CH",name:"Chandigarh"},7:{code:"DA",name:"Dadra and Nagar Haveli"},8:{code:"DM",name:"Daman and Diu"},9:{code:"DE",name:"Delhi"},10:{code:"GO",name:"Goa"},11:{code:"GU",name:"Gujarat"},12:{code:"HA",name:"Haryana"},13:{code:"HP",name:"Himachal Pradesh"},14:{code:"JA",name:"Jammu and Kashmir"},15:{code:"KA",name:"Karnataka"},16:{code:"KE",name:"Kerala"},17:{code:"LI",name:"Lakshadweep Islands"},18:{code:"MP",name:"Madhya Pradesh"},19:{code:"MA",name:"Maharashtra"},20:{code:"MN",name:"Manipur"},21:{code:"ME",name:"Meghalaya"},22:{code:"MI",name:"Mizoram"},23:{code:"NA",name:"Nagaland"},24:{code:"OR",name:"Orissa"},25:{code:"PO",name:"Pondicherry"},26:{code:"PU",name:"Punjab"},27:{code:"RA",name:"Rajasthan"},28:{code:"SI",name:"Sikkim"},29:{code:"TN",name:"Tamil Nadu"},30:{code:"TR",name:"Tripura"},31:{code:"UP",name:"Uttar Pradesh"},32:{code:"WB",name:"West Bengal"}},ID:{1:{code:"DA",name:"Daista Aceh"},2:{code:"SU",name:"Sumatera Utara"},3:{code:"SB",name:"Sumatera Barat"},4:{code:"SI",name:"Riau"},5:{code:"JA",name:"Jambi"},6:{code:"SS",name:"Sumatera Selatan"},7:{code:"BE",name:"Bengkulu"},8:{code:"LA",name:"Lampung"},9:{code:"JK",name:"Dki Jakarta"},10:{code:"JB",name:"Jawa Barat"},11:{code:"JT",name:"Jawa Tengah"},12:{code:"DY",name:"Daista Yogyakarta"},13:{code:"JT",name:"Jawa Timur"},14:{code:"KB",name:"Kalimantan Barat"},15:{code:"KT",name:"Kalimantan Tengah"},16:{code:"KI",name:"Kalimantan Timur"},17:{code:"KS",name:"Kalimantan Selatan"},18:{code:"BA",name:"Bali"},19:{code:"NB",name:"Nusa Tenggara Barat"},20:{code:"NT",name:"Nusa Tenggara Timur"},21:{code:"SN",name:"Sulawesi Selatan"},22:{code:"ST",name:"Sulawesi Tengah"},23:{code:"SA",name:"Sulawesi Utara"},24:{code:"SG",name:"Sulawesi Tenggara"},25:{code:"MA",name:"Maluku"},26:{code:"MU",name:"Maluku Utara"},27:{code:"IJ",name:"Irian Jaya Timur"},28:{code:"IT",name:"Irian Jaya Tengah"},29:{code:"IB",name:"Irian Jawa Barat"},30:{code:"BT",name:"Banten"},31:{code:"BB",name:"Bangka Belitung"},32:{code:"GO",name:"Gorontalo"}},IR:{1:{code:"ARD",name:"Ardabil"},2:{code:"BSH",name:"Bushehr"},3:{code:"CMB",name:"Chahar Mahaal and Bakhtiari"},4:{code:"EAZ",name:"East Azarbaijan"},5:{code:"EFH",name:"Esfahan"},6:{code:"FAR",name:"Fars"},7:{code:"GIL",name:"Gilan"},8:{code:"GLS",name:"Golestan"},9:{code:"HMD",name:"Hamadan"},10:{code:"HRM",name:"Hormozgan"},11:{code:"ILM",name:"Ilam"},12:{code:"KBA",name:"Kohkiluyeh and Buyer Ahmad"},13:{code:"KRB",name:"Kerman"},14:{code:"KRD",name:"Kurdistan"},15:{code:"KRM",name:"Kermanshah"},16:{code:"KZT",name:"Khuzestan"},17:{code:"LRS",name:"Lorestan"},18:{code:"MKZ",name:"Markazi"},19:{code:"MZD",name:"Mazandaran"},20:{code:"NKH",name:"North Khorasan"},21:{code:"QAZ",name:"Qazvin"},22:{code:"QOM",name:"Qom"},23:{code:"RKH",name:"Razavi Khorasan"},24:{code:"SBL",name:"Sistan and Baluchistan"},25:{code:"SKH",name:"South Khorasan"},26:{code:"SMN",name:"Semnan"},27:{code:"TEH",name:"Tehran"},28:{code:"WEZ",name:"West Azarbaijan"},29:{code:"YZD",name:"Yazd"},30:{code:"ZAN",name:"Zanjan"}},IQ:{1:{code:"AB",name:"Al Anbar"},2:{code:"AL",name:"Arbil"},3:{code:"BA",name:"Al Basrah"},4:{code:"BB",name:"Babil"},5:{code:"BD",name:"Baghdad"},6:{code:"DH",name:"Dahuk"},7:{code:"DQ",name:"Dhi Qar"},8:{code:"DY",name:"Diyala"},9:{code:"KB",name:"Al Karbala"},10:{code:"MU",name:"Al Muthanna"},11:{code:"MY",name:"Maysan"},12:{code:"NJ",name:"An Najaf"},13:{code:"NN",name:"Ninawa"},14:{code:"QA",name:"Al Qadisyah"},15:{code:"SD",name:"Salah ad Din"},16:{code:"SL",name:"As Sulaymaniyah"},17:{code:"TM",name:"At Ta'mim"},18:{code:"WS",name:"Wasit"}},IE:{1:{code:"CA",name:"Carlow"},2:{code:"CV",name:"Cavan"},3:{code:"CL",name:"Clare"},4:{code:"CO",name:"Cork"},5:{code:"DO",name:"Donegal"},6:{code:"DU",name:"Dublin"},7:{code:"GA",name:"Galway"},8:{code:"KE",name:"Kerry"},9:{code:"KI",name:"Kildare"},10:{code:"KL",name:"Kilkenny"},11:{code:"LA",name:"Laois"},12:{code:"LE",name:"Leitrim"},13:{code:"LI",name:"Limerick"},14:{code:"LO",name:"Longford"},15:{code:"LU",name:"Louth"},16:{code:"MA",name:"Mayo"},17:{code:"ME",name:"Meath"},18:{code:"MO",name:"Monaghan"},19:{code:"OF",name:"Offaly"},20:{code:"RO",name:"Roscommon"},21:{code:"SL",name:"Sligo"},22:{code:"TI",name:"Tipperary"},23:{code:"WA",name:"Waterford"},24:{code:"WE",name:"Westmeath"},25:{code:"WX",name:"Wexford"},26:{code:"WI",name:"Wicklow"}},IL:{1:{code:"BS",name:"Be'er Sheva"},2:{code:"BH",name:"Bika'at Hayarden"},3:{code:"EA",name:"Eilat and Arava"},4:{code:"GA",name:"Galil"},5:{code:"HA",name:"Haifa"},6:{code:"JM",name:"Jehuda Mountains"},7:{code:"JE",name:"Jerusalem"},8:{code:"NE",name:"Negev"},10:{code:"SE",name:"Semaria"},11:{code:"SH",name:"Sharon"},12:{code:"TA",name:"Tel Aviv (Gosh Dan)"}},IT:{1:{code:"AG",name:"Agrigento"},2:{code:"AL",name:"Alessandria"},3:{code:"AN",name:"Ancona"},4:{code:"AO",name:"Aosta"},5:{code:"AR",name:"Arezzo"},6:{code:"AP",name:"Ascoli Piceno"},7:{code:"AT",name:"Asti"},8:{code:"AV",name:"Avellino"},9:{code:"BA",name:"Bari"},10:{code:"BL",name:"Belluno"},11:{code:"BN",name:"Benevento"},12:{code:"BG",name:"Bergamo"},13:{code:"BI",name:"Biella"},14:{code:"BO",name:"Bologna"},15:{code:"BZ",name:"Bolzano"},16:{code:"BS",name:"Brescia"},17:{code:"BR",name:"Brindisi"},18:{code:"CA",name:"Cagliari"},19:{code:"CL",name:"Caltanissetta"},20:{code:"CB",name:"Campobasso"},21:{code:"CE",name:"Caserta"},22:{code:"CT",name:"Catania"},23:{code:"CZ",name:"Catanzaro"},24:{code:"CH",name:"Chieti"},25:{code:"CO",name:"Como"},26:{code:"CS",name:"Cosenza"},27:{code:"CR",name:"Cremona"},28:{code:"KR",name:"Crotone"},29:{code:"CN",name:"Cuneo"},30:{code:"EN",name:"Enna"},31:{code:"FE",name:"Ferrara"},32:{code:"FI",name:"Firenze"},33:{code:"FG",name:"Foggia"},34:{code:"FO",name:"Forlì"},35:{code:"FR",name:"Frosinone"},36:{code:"GE",name:"Genova"},37:{code:"GO",name:"Gorizia"},38:{code:"GR",name:"Grosseto"},39:{code:"IM",name:"Imperia"},40:{code:"IS",name:"Isernia"},41:{code:"AQ",name:"Aquila"},42:{code:"SP",name:"La Spezia"},43:{code:"LT",name:"Latina"},44:{code:"LE",name:"Lecce"},45:{code:"LC",name:"Lecco"},46:{code:"LI",name:"Livorno"},47:{code:"LO",name:"Lodi"},48:{code:"LU",name:"Lucca"},49:{code:"MC",name:"Macerata"},50:{code:"MN",name:"Mantova"},51:{code:"MS",name:"Massa-Carrara"},52:{code:"MT",name:"Matera"},53:{code:"ME",name:"Messina"},54:{code:"MI",name:"Milano"},55:{code:"MO",name:"Modena"},56:{code:"NA",name:"Napoli"},57:{code:"NO",name:"Novara"},58:{code:"NU",name:"Nuoro"},59:{code:"OR",name:"Oristano"},60:{code:"PD",name:"Padova"},61:{code:"PA",name:"Palermo"},62:{code:"PR",name:"Parma"},63:{code:"PG",name:"Perugia"},64:{code:"PV",name:"Pavia"},65:{code:"PU",name:"Pesaro Urbino"},66:{code:"PE",name:"Pescara"},67:{code:"PC",name:"Piacenza"},68:{code:"PI",name:"Pisa"},69:{code:"PT",name:"Pistoia"},70:{code:"PN",name:"Pordenone"},71:{code:"PZ",name:"Potenza"},72:{code:"PO",name:"Prato"},73:{code:"RG",name:"Ragusa"},74:{code:"RA",name:"Ravenna"},75:{code:"RC",name:"Reggio Calabria"},76:{code:"RE",name:"Reggio Emilia"},77:{code:"RI",name:"Rieti"},78:{code:"RN",name:"Rimini"},79:{code:"RM",name:"Roma"},80:{code:"RO",name:"Rovigo"},81:{code:"SA",name:"Salerno"},82:{code:"SS",name:"Sassari"},83:{code:"SV",name:"Savona"},84:{code:"SI",name:"Siena"},85:{code:"SR",name:"Siracusa"},86:{code:"SO",name:"Sondrio"},87:{code:"TA",name:"Taranto"},88:{code:"TE",name:"Teramo"},89:{code:"TR",name:"Terni"},90:{code:"TO",name:"Torino"},91:{code:"TP",name:"Trapani"},92:{code:"TN",name:"Trento"},93:{code:"TV",name:"Treviso"},94:{code:"TS",name:"Trieste"},95:{code:"UD",name:"Udine"},96:{code:"VA",name:"Varese"},97:{code:"VE",name:"Venezia"},98:{code:"VB",name:"Verbania"},99:{code:"VC",name:"Vercelli"},100:{code:"VR",name:"Verona"},101:{code:"VV",name:"Vibo Valentia"},102:{code:"VI",name:"Vicenza"},103:{code:"VT",name:"Viterbo"},104:{code:"CI",name:"Carbonia-Iglesias"},105:{code:"VS",name:"Medio Campidano"},106:{code:"OG",name:"Ogliastra"},107:{code:"OT",name:"Olbia-Tempio"},108:{code:"MB",name:"Monza e Brianza"},109:{code:"FM",name:"Fermo"},110:{code:"BT",name:"Barletta-Andria-Trani"}},JM:{1:{code:"CLA",name:"Clarendon Parish"},2:{code:"HAN",name:"Hanover Parish"},3:{code:"KIN",name:"Kingston Parish"},4:{code:"MAN",name:"Manchester Parish"},5:{code:"POR",name:"Portland Parish"},6:{code:"AND",name:"Saint Andrew Parish"},7:{code:"ANN",name:"Saint Ann Parish"},8:{code:"CAT",name:"Saint Catherine Parish"},9:{code:"ELI",name:"Saint Elizabeth Parish"},10:{code:"JAM",name:"Saint James Parish"},11:{code:"MAR",name:"Saint Mary Parish"},12:{code:"THO",name:"Saint Thomas Parish"},13:{code:"TRL",name:"Trelawny Parish"},14:{code:"WML",name:"Westmoreland Parish"}},JP:{1:{code:"AI",name:"Aichi"},2:{code:"AK",name:"Akita"},3:{code:"AO",name:"Aomori"},4:{code:"CH",name:"Chiba"},5:{code:"EH",name:"Ehime"},6:{code:"FK",name:"Fukui"},7:{code:"FU",name:"Fukuoka"},8:{code:"FS",name:"Fukushima"},9:{code:"GI",name:"Gifu"},10:{code:"GU",name:"Gumma"},11:{code:"HI",name:"Hiroshima"},12:{code:"HO",name:"Hokkaido"},13:{code:"HY",name:"Hyogo"},14:{code:"IB",name:"Ibaraki"},15:{code:"IS",name:"Ishikawa"},16:{code:"IW",name:"Iwate"},17:{code:"KA",name:"Kagawa"},18:{code:"KG",name:"Kagoshima"},19:{code:"KN",name:"Kanagawa"},20:{code:"KO",name:"Kochi"},21:{code:"KU",name:"Kumamoto"},22:{code:"KY",name:"Kyoto"},23:{code:"MI",name:"Mie"},24:{code:"MY",name:"Miyagi"},25:{code:"MZ",name:"Miyazaki"},26:{code:"NA",name:"Nagano"},27:{code:"NG",name:"Nagasaki"},28:{code:"NR",name:"Nara"},29:{code:"NI",name:"Niigata"},30:{code:"OI",name:"Oita"},31:{code:"OK",name:"Okayama"},32:{code:"ON",name:"Okinawa"},33:{code:"OS",name:"Osaka"},34:{code:"SA",name:"Saga"},35:{code:"SI",name:"Saitama"},36:{code:"SH",name:"Shiga"},37:{code:"SM",name:"Shimane"},38:{code:"SZ",name:"Shizuoka"},39:{code:"TO",name:"Tochigi"},40:{code:"TS",name:"Tokushima"},41:{code:"TK",name:"Tokyo"},42:{code:"TT",name:"Tottori"},43:{code:"TY",name:"Toyama"},44:{code:"WA",name:"Wakayama"},45:{code:"YA",name:"Yamagata"},46:{code:"YM",name:"Yamaguchi"},47:{code:"YN",name:"Yamanashi"}},JO:{1:{code:"AM",name:"'Amman"},2:{code:"AJ",name:"Ajlun"},3:{code:"AA",name:"Al'Aqabah"},4:{code:"AB",name:"Al Balqa'"},5:{code:"AK",name:"Al Karak"},6:{code:"AL",name:"Al Mafraq"},7:{code:"AT",name:"At Tafilah"},8:{code:"AZ",name:"Az Zarqa'"},9:{code:"IR",name:"Irbid"},10:{code:"JA",name:"Jarash"},11:{code:"MA",name:"Ma'an"},12:{code:"MD",name:"Madaba"}},KZ:{1:{code:"AL",name:"Almaty"},2:{code:"AC",name:"Almaty City"},3:{code:"AM",name:"Aqmola"},4:{code:"AQ",name:"Aqtobe"},5:{code:"AS",name:"Astana City"},6:{code:"AT",name:"Atyrau"},7:{code:"BA",name:"Batys Qazaqstan"},8:{code:"BY",name:"Bayqongyr City"},9:{code:"MA",name:"Mangghystau"},10:{code:"ON",name:"Ongtustik Qazaqstan"},11:{code:"PA",name:"Pavlodar"},12:{code:"QA",name:"Qaraghandy"},13:{code:"QO",name:"Qostanay"},14:{code:"QY",name:"Qyzylorda"},15:{code:"SH",name:"Shyghys Qazaqstan"},16:{code:"SO",name:"Soltustik Qazaqstan"},17:{code:"ZH",name:"Zhambyl"}},KE:{1:{code:"CE",name:"Central"},2:{code:"CO",name:"Coast"},3:{code:"EA",name:"Eastern"},4:{code:"NA",name:"Nairobi Area"},5:{code:"NE",name:"North Eastern"},6:{code:"NY",name:"Nyanza"},7:{code:"RV",name:"Rift Valley"},8:{code:"WE",name:"Western"}},KI:{1:{code:"AG",name:"Abaiang"},2:{code:"AM",name:"Abemama"},3:{code:"AK",name:"Aranuka"},4:{code:"AO",name:"Arorae"},5:{code:"BA",name:"Banaba"},6:{code:"BE",name:"Beru"},7:{code:"bT",name:"Butaritari"},8:{code:"KA",name:"Kanton"},9:{code:"KR",name:"Kiritimati"},10:{code:"KU",name:"Kuria"},11:{code:"MI",name:"Maiana"},12:{code:"MN",name:"Makin"},13:{code:"ME",name:"Marakei"},14:{code:"NI",name:"Nikunau"},15:{code:"NO",name:"Nonouti"},16:{code:"ON",name:"Onotoa"},17:{code:"TT",name:"Tabiteuea"},18:{code:"TR",name:"Tabuaeran"},19:{code:"TM",name:"Tamana"},20:{code:"TW",name:"Tarawa"},21:{code:"TE",name:"Teraina"}},KP:{1:{code:"CHA",name:"Chagang-do"},2:{code:"HAB",name:"Hamgyong-bukto"},3:{code:"HAN",name:"Hamgyong-namdo"},4:{code:"HWB",name:"Hwanghae-bukto"},5:{code:"HWN",name:"Hwanghae-namdo"},6:{code:"KAN",name:"Kangwon-do"},7:{code:"PYB",name:"P'yongan-bukto"},8:{code:"PYN",name:"P'yongan-namdo"},9:{code:"YAN",name:"Ryanggang-do (Yanggang-do)"},10:{code:"NAJ",name:"Rason Directly Governed City"},11:{code:"PYO",name:"P'yongyang Special City"}},KR:{1:{code:"CO",name:"Ch'ungch'ong-bukto"},2:{code:"CH",name:"Ch'ungch'ong-namdo"},3:{code:"CD",name:"Cheju-do"},4:{code:"CB",name:"Cholla-bukto"},5:{code:"CN",name:"Cholla-namdo"},6:{code:"IG",name:"Inch'on-gwangyoksi"},7:{code:"KA",name:"Kangwon-do"},8:{code:"KG",name:"Kwangju-gwangyoksi"},9:{code:"KD",name:"Kyonggi-do"},10:{code:"KB",name:"Kyongsang-bukto"},11:{code:"KN",name:"Kyongsang-namdo"},12:{code:"PG",name:"Pusan-gwangyoksi"},13:{code:"SO",name:"Soul-t'ukpyolsi"},14:{code:"TA",name:"Taegu-gwangyoksi"},15:{code:"TG",name:"Taejon-gwangyoksi"}},KW:{1:{code:"AL",name:"Al'Asimah"},2:{code:"AA",name:"Al Ahmadi"},3:{code:"AF",name:"Al Farwaniyah"},4:{code:"AJ",name:"Al Jahra'"},5:{code:"HA",name:"Hawalli"}},KG:{1:{code:"GB",name:"Bishkek"},2:{code:"B",name:"Batken"},3:{code:"C",name:"Chu"},4:{code:"J",name:"Jalal-Abad"},5:{code:"N",name:"Naryn"},6:{code:"O",name:"Osh"},7:{code:"T",name:"Talas"},8:{code:"Y",name:"Ysyk-Kol"}},LA:{1:{code:"VT",name:"Vientiane"},2:{code:"AT",name:"Attapu"},3:{code:"BK",name:"Bokeo"},4:{code:"BL",name:"Bolikhamxai"},5:{code:"CH",name:"Champasak"},6:{code:"HO",name:"Houaphan"},7:{code:"KH",name:"Khammouan"},8:{code:"LM",name:"Louang Namtha"},9:{code:"LP",name:"Louangphabang"},10:{code:"OU",name:"Oudomxai"},11:{code:"PH",name:"Phongsali"},12:{code:"SL",name:"Salavan"},13:{code:"SV",name:"Savannakhet"},14:{code:"VI",name:"Vientiane"},15:{code:"XA",name:"Xaignabouli"},16:{code:"XE",name:"Xekong"},17:{code:"XI",name:"Xiangkhoang"},18:{code:"XN",name:"Xaisomboun"}},LV:{1:{code:"AIZ",name:"Aizkraukles Rajons"},2:{code:"ALU",name:"Aluksnes Rajons"},3:{code:"BAL",name:"Balvu Rajons"},4:{code:"BAU",name:"Bauskas Rajons"},5:{code:"CES",name:"Cesu Rajons"},6:{code:"DGR",name:"Daugavpils Rajons"},7:{code:"DOB",name:"Dobeles Rajons"},8:{code:"GUL",name:"Gulbenes Rajons"},9:{code:"JEK",name:"Jekabpils Rajons"},10:{code:"JGR",name:"Jelgavas Rajons"},11:{code:"KRA",name:"Kraslavas Rajons"},12:{code:"KUL",name:"Kuldigas Rajons"},13:{code:"LPR",name:"Liepajas Rajons"},14:{code:"LIM",name:"Limbazu Rajons"},15:{code:"LUD",name:"Ludzas Rajons"},16:{code:"MAD",name:"Madonas Rajons"},17:{code:"OGR",name:"Ogres Rajons"},18:{code:"PRE",name:"Preilu Rajons"},19:{code:"RZR",name:"Rezeknes Rajons"},20:{code:"RGR",name:"Rigas Rajons"},21:{code:"SAL",name:"Saldus Rajons"},22:{code:"TAL",name:"Talsu Rajons"},23:{code:"TUK",name:"Tukuma Rajons"},24:{code:"VLK",name:"Valkas Rajons"},25:{code:"VLM",name:"Valmieras Rajons"},26:{code:"VSR",name:"Ventspils Rajons"},27:{code:"DGV",name:"Daugavpils"},28:{code:"JGV",name:"Jelgava"},29:{code:"JUR",name:"Jurmala"},30:{code:"LPK",name:"Liepaja"},31:{code:"RZK",name:"Rezekne"},32:{code:"RGA",name:"Riga"},33:{code:"VSL",name:"Ventspils"}},LB:{1:{code:"BIN",name:"Bint Jbeil"},2:{code:"HAS",name:"Hasbaya"},3:{code:"MAR",name:"Marjeyoun"},4:{code:"NAB",name:"Nabatieh"},5:{code:"BAA",name:"Baalbek"},6:{code:"HER",name:"Hermel"},7:{code:"RAS",name:"Rashaya"},8:{code:"WES",name:"Western Beqaa"},9:{code:"ZAH",name:"Zahle"},10:{code:"AKK",name:"Akkar"},11:{code:"BAT",name:"Batroun"},12:{code:"BSH",name:"Bsharri"},13:{code:"KOU",name:"Koura"},14:{code:"MIN",name:"Miniyeh-Danniyeh"},15:{code:"TRI",name:"Tripoli"},16:{code:"ZGH",name:"Zgharta"},17:{code:"ALE",name:"Aley"},18:{code:"BAA",name:"Baabda"},19:{code:"BYB",name:"Byblos"},20:{code:"CHO",name:"Chouf"},21:{code:"KES",name:"Kesrwan"},22:{code:"MAT",name:"Matn"},23:{code:"JEZ",name:"Jezzine"},24:{code:"SID",name:"Sidon"},25:{code:"TYR",name:"Tyre"}},LS:{1:{code:"BE",name:"Berea"},2:{code:"BB",name:"Butha-Buthe"},3:{code:"LE",name:"Leribe"},4:{code:"MF",name:"Mafeteng"},5:{code:"MS",name:"Maseru"},6:{code:"MH",name:"Mohale's Hoek"},7:{code:"MK",name:"Mokhotlong"},8:{code:"QN",name:"Qacha's Nek"},9:{code:"QT",name:"Quthing"},10:{code:"TT",name:"Thaba-Tseka"}},LR:{1:{code:"BI",name:"Bomi"},2:{code:"BG",name:"Bong"},3:{code:"GB",name:"Grand Bassa"},4:{code:"CM",name:"Grand Cape Mount"},5:{code:"GG",name:"Grand Gedeh"},6:{code:"GK",name:"Grand Kru"},7:{code:"LO",name:"Lofa"},8:{code:"MG",name:"Margibi"},9:{code:"ML",name:"Maryland"},10:{code:"MS",name:"Montserrado"},11:{code:"NB",name:"Nimba"},12:{code:"RC",name:"River Cess"},13:{code:"SN",name:"Sinoe"}},LY:{1:{code:"AJ",name:"Ajdabiya"},2:{code:"AZ",name:"Al 'Aziziyah"},3:{code:"FA",name:"Al Fatih"},4:{code:"JA",name:"Al Jabal al Akhdar"},5:{code:"JU",name:"Al Jufrah"},6:{code:"KH",name:"Al Khums"},7:{code:"KU",name:"Al Kufrah"},8:{code:"NK",name:"An Nuqat al Khams"},9:{code:"AS",name:"Ash Shati'"},10:{code:"AW",name:"Awbari"},11:{code:"ZA",name:"Az Zawiyah"},12:{code:"BA",name:"Banghazi"},13:{code:"DA",name:"Darnah"},14:{code:"GD",name:"Ghadamis"},15:{code:"GY",name:"Gharyan"},16:{code:"MI",name:"Misratah"},17:{code:"MZ",name:"Murzuq"},18:{code:"SB",name:"Sabha"},19:{code:"SW",name:"Sawfajjin"},20:{code:"SU",name:"Surt"},21:{code:"TL",name:"Tarabulus (Tripoli)"},22:{code:"TH",name:"Tarhunah"},23:{code:"TU",name:"Tubruq"},24:{code:"YA",name:"Yafran"},25:{code:"ZL",name:"Zlitan"}},LI:{1:{code:"V",name:"Vaduz"},2:{code:"A",name:"Schaan"},3:{code:"B",name:"Balzers"},4:{code:"N",name:"Triesen"},5:{code:"E",name:"Eschen"},6:{code:"M",name:"Mauren"},7:{code:"T",name:"Triesenberg"},8:{code:"R",name:"Ruggell"},9:{code:"G",name:"Gamprin"},10:{code:"L",name:"Schellenberg"},11:{code:"P",name:"Planken"}},LT:{1:{code:"AL",name:"Alytus"},2:{code:"KA",name:"Kaunas"},3:{code:"KL",name:"Klaipeda"},4:{code:"MA",name:"Marijampole"},5:{code:"PA",name:"Panevezys"},6:{code:"SI",name:"Siauliai"},7:{code:"TA",name:"Taurage"},8:{code:"TE",name:"Telsiai"},9:{code:"UT",name:"Utena"},10:{code:"VI",name:"Vilnius"}},LU:{1:{code:"DD",name:"Diekirch"},2:{code:"DC",name:"Clervaux"},3:{code:"DR",name:"Redange"},4:{code:"DV",name:"Vianden"},5:{code:"DW",name:"Wiltz"},6:{code:"GG",name:"Grevenmacher"},7:{code:"GE",name:"Echternach"},8:{code:"GR",name:"Remich"},9:{code:"LL",name:"Luxembourg"},10:{code:"LC",name:"Capellen"},11:{code:"LE",name:"Esch-sur-Alzette"},12:{code:"LM",name:"Mersch"}},MO:{1:{code:"OLF",name:"Our Lady Fatima Parish"},2:{code:"ANT",name:"St. Anthony Parish"},3:{code:"LAZ",name:"St. Lazarus Parish"},4:{code:"CAT",name:"Cathedral Parish"},5:{code:"LAW",name:"St. Lawrence Parish"}},MK:{1:{code:"AER",name:"Aerodrom"},2:{code:"ARA",name:"Aračinovo"},3:{code:"BER",name:"Berovo"},4:{code:"BIT",name:"Bitola"},5:{code:"BOG",name:"Bogdanci"},6:{code:"BOG",name:"Bogovinje"},7:{code:"BOS",name:"Bosilovo"},8:{code:"BRV",name:"Brvenica"},9:{code:"BUT",name:"Butel"},10:{code:"ČAI",name:"Čair"},11:{code:"ČAš",name:"Čaška"},12:{code:"CEN",name:"Centar"},13:{code:"CEN",name:"Centar Župa"},14:{code:"Češ",name:"Češinovo-Obleš"},15:{code:"ČUČ",name:"Čučer-Sandevo"},16:{code:"DEB",name:"Debar"},17:{code:"DEB",name:"Debarca"},18:{code:"DEL",name:"Delčevo"},19:{code:"DEM",name:"Demir Hisar"},20:{code:"DEM",name:"Demir Kapija"},21:{code:"DOL",name:"Dolneni"},22:{code:"DRU",name:"Drugovo"},23:{code:"GAZ",name:"Gazi Baba"},24:{code:"GEV",name:"Gevgelija"},25:{code:"GJO",name:"Gjorče Petrov"},26:{code:"GOS",name:"Gostivar"},27:{code:"GRA",name:"Gradsko"},28:{code:"ILI",name:"Ilinden"},29:{code:"JEG",name:"Jegunovce"},30:{code:"KAR",name:"Karbinci"},31:{code:"KAR",name:"Karpoš"},32:{code:"KAV",name:"Kavadarci"},33:{code:"KIČ",name:"Kičevo"},34:{code:"KIS",name:"Kisela Voda"},35:{code:"KOč",name:"Kočani"},36:{code:"KON",name:"Konče"},37:{code:"KRA",name:"Kratovo"},38:{code:"KRI",name:"Kriva Palanka"},39:{code:"KRI",name:"Krivogaštani"},40:{code:"KRU",name:"Kruševo"},41:{code:"KUM",name:"Kumanovo"},42:{code:"LIP",name:"Lipkovo"},43:{code:"LOZ",name:"Lozovo"},44:{code:"MAK",name:"Makedonska Kamenica"},45:{code:"MAK",name:"Makedonski Brod"},46:{code:"MAV",name:"Mavrovo and Rostuša"},47:{code:"MOG",name:"Mogila"},48:{code:"NEG",name:"Negotino"},49:{code:"NOV",name:"Novaci"},50:{code:"NOV",name:"Novo Selo"},51:{code:"OHR",name:"Ohrid"},52:{code:"OSL",name:"Oslomej"},53:{code:"PEH",name:"Pehčevo"},54:{code:"PET",name:"Petrovec"},55:{code:"PLA",name:"Plasnica"},56:{code:"PRI",name:"Prilep"},57:{code:"PRO",name:"Probištip"},58:{code:"RAD",name:"Radoviš"},59:{code:"RAN",name:"Rankovce"},60:{code:"RES",name:"Resen"},61:{code:"ROS",name:"Rosoman"},62:{code:"SAR",name:"Saraj"},63:{code:"SOP",name:"Sopište"},64:{code:"STA",name:"Star Dojran"},65:{code:"STA",name:"Staro Nagoričane"},66:{code:"ŠTI",name:"Štip"},67:{code:"STR",name:"Struga"},68:{code:"STR",name:"Strumica"},69:{code:"STU",name:"Studeničani"},70:{code:"ŠUT",name:"Šuto Orizari"},71:{code:"SVE",name:"Sveti Nikole"},72:{code:"TEA",name:"Tearce"},73:{code:"TET",name:"Tetovo"},74:{code:"VAL",name:"Valandovo"},75:{code:"VAS",name:"Vasilevo"},76:{code:"VEL",name:"Veles"},77:{code:"VEV",name:"Vevčani"},78:{code:"VIN",name:"Vinica"},79:{code:"VRA",name:"Vraneštica"},80:{code:"VRA",name:"Vrapčište"},81:{code:"ZAJ",name:"Zajas"},82:{code:"ZEL",name:"Zelenikovo"},83:{code:"ŽEL",name:"Želino"},84:{code:"ZRN",name:"Zrnovci"}},MG:{1:{code:"AN",name:"Antananarivo"},2:{code:"AS",name:"Antsiranana"},3:{code:"FN",name:"Fianarantsoa"},4:{code:"MJ",name:"Mahajanga"},5:{code:"TM",name:"Toamasina"},6:{code:"TL",name:"Toliara"}},MW:{1:{code:"BLK",name:"Balaka"},2:{code:"BLT",name:"Blantyre"},3:{code:"CKW",name:"Chikwawa"},4:{code:"CRD",name:"Chiradzulu"},5:{code:"CTP",name:"Chitipa"},6:{code:"DDZ",name:"Dedza"},7:{code:"DWA",name:"Dowa"},8:{code:"KRG",name:"Karonga"},9:{code:"KSG",name:"Kasungu"},10:{code:"LKM",name:"Likoma"},11:{code:"LLG",name:"Lilongwe"},12:{code:"MCG",name:"Machinga"},13:{code:"MGC",name:"Mangochi"},14:{code:"MCH",name:"Mchinji"},15:{code:"MLJ",name:"Mulanje"},16:{code:"MWZ",name:"Mwanza"},17:{code:"MZM",name:"Mzimba"},18:{code:"NTU",name:"Ntcheu"},19:{code:"NKB",name:"Nkhata Bay"},20:{code:"NKH",name:"Nkhotakota"},21:{code:"NSJ",name:"Nsanje"},22:{code:"NTI",name:"Ntchisi"},23:{code:"PHL",name:"Phalombe"},24:{code:"RMP",name:"Rumphi"},25:{code:"SLM",name:"Salima"},26:{code:"THY",name:"Thyolo"},27:{code:"ZBA",name:"Zomba"}},MY:{1:{code:"Johor",name:"Johor"},2:{code:"Kedah",name:"Kedah"},3:{code:"Kelantan",name:"Kelantan"},4:{code:"Labuan",name:"Labuan"},5:{code:"Melaka",name:"Melaka"},6:{code:"Negeri Sembilan",name:"Negeri Sembilan"},7:{code:"Pahang",name:"Pahang"},8:{code:"Perak",name:"Perak"},9:{code:"Perlis",name:"Perlis"},10:{code:"Pulau Pinang",name:"Pulau Pinang"},11:{code:"Sabah",name:"Sabah"},12:{code:"Sarawak",name:"Sarawak"},13:{code:"Selangor",name:"Selangor"},14:{code:"Terengganu",name:"Terengganu"},15:{code:"Kuala Lumpur",name:"Kuala Lumpur"}},MV:{1:{code:"AAD",name:"Ari Atoll Dheknu"},2:{code:"AAU",name:"Ari Atoll Uthuru"},3:{code:"ADD",name:"Addu"},4:{code:"FAA",name:"Faadhippolhu"},5:{code:"FEA",name:"Felidhe Atoll"},6:{code:"FMU",name:"Fua Mulaku"},7:{code:"HAD",name:"Huvadhu Atoll Dhekunu"},8:{code:"HAU",name:"Huvadhu Atoll Uthuru"},9:{code:"HDH",name:"Hadhdhunmathi"},10:{code:"KLH",name:"Kolhumadulu"},11:{code:"MAA",name:"Male Atoll"},12:{code:"MAD",name:"Maalhosmadulu Dhekunu"},13:{code:"MAU",name:"Maalhosmadulu Uthuru"},14:{code:"MLD",name:"Miladhunmadulu Dhekunu"},15:{code:"MLU",name:"Miladhunmadulu Uthuru"},16:{code:"MUA",name:"Mulaku Atoll"},17:{code:"NAD",name:"Nilandhe Atoll Dhekunu"},18:{code:"NAU",name:"Nilandhe Atoll Uthuru"},19:{code:"THD",name:"Thiladhunmathi Dhekunu"},20:{code:"THU",name:"Thiladhunmathi Uthuru"}},ML:{1:{code:"GA",name:"Gao"},2:{code:"KY",name:"Kayes"},3:{code:"KD",name:"Kidal"},4:{code:"KL",name:"Koulikoro"},5:{code:"MP",name:"Mopti"},6:{code:"SG",name:"Segou"},7:{code:"SK",name:"Sikasso"},8:{code:"TB",name:"Tombouctou"},9:{code:"CD",name:"Bamako Capital District"}},MT:{1:{code:"ATT",name:"Attard"},2:{code:"BAL",name:"Balzan"},3:{code:"BGU",name:"Birgu"},4:{code:"BKK",name:"Birkirkara"},5:{code:"BRZ",name:"Birzebbuga"},6:{code:"BOR",name:"Bormla"},7:{code:"DIN",name:"Dingli"},8:{code:"FGU",name:"Fgura"},9:{code:"FLO",name:"Floriana"},10:{code:"GDJ",name:"Gudja"},11:{code:"GZR",name:"Gzira"},12:{code:"GRG",name:"Gargur"},13:{code:"GXQ",name:"Gaxaq"},14:{code:"HMR",name:"Hamrun"},15:{code:"IKL",name:"Iklin"},16:{code:"ISL",name:"Isla"},17:{code:"KLK",name:"Kalkara"},18:{code:"KRK",name:"Kirkop"},19:{code:"LIJ",name:"Lija"},20:{code:"LUQ",name:"Luqa"},21:{code:"MRS",name:"Marsa"},22:{code:"MKL",name:"Marsaskala"},23:{code:"MXL",name:"Marsaxlokk"},24:{code:"MDN",name:"Mdina"},25:{code:"MEL",name:"Melliea"},26:{code:"MGR",name:"Mgarr"},27:{code:"MST",name:"Mosta"},28:{code:"MQA",name:"Mqabba"},29:{code:"MSI",name:"Msida"},30:{code:"MTF",name:"Mtarfa"},31:{code:"NAX",name:"Naxxar"},32:{code:"PAO",name:"Paola"},33:{code:"PEM",name:"Pembroke"},34:{code:"PIE",name:"Pieta"},35:{code:"QOR",name:"Qormi"},36:{code:"QRE",name:"Qrendi"},37:{code:"RAB",name:"Rabat"},38:{code:"SAF",name:"Safi"},39:{code:"SGI",name:"San Giljan"},40:{code:"SLU",name:"Santa Lucija"},41:{code:"SPB",name:"San Pawl il-Bahar"},42:{code:"SGW",name:"San Gwann"},43:{code:"SVE",name:"Santa Venera"},44:{code:"SIG",name:"Siggiewi"},45:{code:"SLM",name:"Sliema"},46:{code:"SWQ",name:"Swieqi"},47:{code:"TXB",name:"Ta Xbiex"},48:{code:"TRX",name:"Tarxien"},49:{code:"VLT",name:"Valletta"},50:{code:"XGJ",name:"Xgajra"},51:{code:"ZBR",name:"Zabbar"},52:{code:"ZBG",name:"Zebbug"},53:{code:"ZJT",name:"Zejtun"},54:{code:"ZRQ",name:"Zurrieq"},55:{code:"FNT",name:"Fontana"},56:{code:"GHJ",name:"Ghajnsielem"},57:{code:"GHR",name:"Gharb"},58:{code:"GHS",name:"Ghasri"},59:{code:"KRC",name:"Kercem"},60:{code:"MUN",name:"Munxar"},61:{code:"NAD",name:"Nadur"},62:{code:"QAL",name:"Qala"},63:{code:"VIC",name:"Victoria"},64:{code:"SLA",name:"San Lawrenz"},65:{code:"SNT",name:"Sannat"},66:{code:"ZAG",name:"Xagra"},67:{code:"XEW",name:"Xewkija"},68:{code:"ZEB",name:"Zebbug"}},MH:{1:{code:"ALG",name:"Ailinginae"},2:{code:"ALL",name:"Ailinglaplap"},3:{code:"ALK",name:"Ailuk"},4:{code:"ARN",name:"Arno"},5:{code:"AUR",name:"Aur"},6:{code:"BKR",name:"Bikar"},7:{code:"BKN",name:"Bikini"},8:{code:"BKK",name:"Bokak"},9:{code:"EBN",name:"Ebon"},10:{code:"ENT",name:"Enewetak"},11:{code:"EKB",name:"Erikub"},12:{code:"JBT",name:"Jabat"},13:{code:"JLT",name:"Jaluit"},14:{code:"JEM",name:"Jemo"},15:{code:"KIL",name:"Kili"},16:{code:"KWJ",name:"Kwajalein"},17:{code:"LAE",name:"Lae"},18:{code:"LIB",name:"Lib"},19:{code:"LKP",name:"Likiep"},20:{code:"MJR",name:"Majuro"},21:{code:"MLP",name:"Maloelap"},22:{code:"MJT",name:"Mejit"},23:{code:"MIL",name:"Mili"},24:{code:"NMK",name:"Namorik"},25:{code:"NAM",name:"Namu"},26:{code:"RGL",name:"Rongelap"},27:{code:"RGK",name:"Rongrik"},28:{code:"TOK",name:"Toke"},29:{code:"UJA",name:"Ujae"},30:{code:"UJL",name:"Ujelang"},31:{code:"UTK",name:"Utirik"},32:{code:"WTH",name:"Wotho"},33:{code:"WTJ",name:"Wotje"}},MQ:{1:{code:"LAJ",name:"L'Ajoupa-Bouillon"},2:{code:"LES",name:"Les Anses-d'Arlet"},3:{code:"BAS",name:"Basse-Pointe"},4:{code:"BEL",name:"Bellefontaine"},5:{code:"LE",name:"Le Carbet"},6:{code:"CAS",name:"Case-Pilote"},7:{code:"LE",name:"Le Diamant"},8:{code:"DUC",name:"Ducos"},9:{code:"FON",name:"Fonds-Saint-Denis"},10:{code:"FOR",name:"Fort-De-France"},11:{code:"LE",name:"Le François"},12:{code:"GRA",name:"Grand'Rivière"},13:{code:"GRO",name:"Gros-Morne"},14:{code:"LE",name:"Le Lamentin"},15:{code:"LE",name:"Le Lorrain"},16:{code:"MAC",name:"Macouba"},17:{code:"LE",name:"Le Marigot"},18:{code:"LE",name:"Le Marin"},19:{code:"LE",name:"Le Morne-Rouge"},20:{code:"LE",name:"Le Morne-Vert"},21:{code:"LE",name:"Le Prêcheur"},22:{code:"RIV",name:"Rivière-Pilote"},23:{code:"RIV",name:"Rivière-Salée"},24:{code:"LE",name:"Le Robert"},25:{code:"SAI",name:"Sainte-Anne"},26:{code:"SAI",name:"Sainte-Luce"},27:{code:"SAI",name:"Sainte-Marie"},28:{code:"SAI",name:"Saint-Esprit"},29:{code:"SAI",name:"Saint-Joseph"},30:{code:"SAI",name:"Saint-Pierre"},31:{code:"SCH",name:"Schœlcher"},32:{code:"LA",name:"La Trinité"},33:{code:"LES",name:"Les Trois-Îlets"},34:{code:"LE",name:"Le Vauclin"}},MR:{1:{code:"AD",name:"Adrar"},2:{code:"AS",name:"Assaba"},3:{code:"BR",name:"Brakna"},4:{code:"DN",name:"Dakhlet Nouadhibou"},5:{code:"GO",name:"Gorgol"},6:{code:"GM",name:"Guidimaka"},7:{code:"HC",name:"Hodh Ech Chargui"},8:{code:"HG",name:"Hodh El Gharbi"},9:{code:"IN",name:"Inchiri"},10:{code:"TA",name:"Tagant"},11:{code:"TZ",name:"Tiris Zemmour"},12:{code:"TR",name:"Trarza"},13:{code:"NO",name:"Nouakchott"}},MU:{1:{code:"AG",name:"Agalega Islands"},2:{code:"BL",name:"Black River"},3:{code:"BR",name:"Beau Bassin-Rose Hill"},4:{code:"CC",name:"Cargados Carajos Shoals (Saint B)"},5:{code:"CU",name:"Curepipe"},6:{code:"FL",name:"Flacq"},7:{code:"GP",name:"Grand Port"},8:{code:"MO",name:"Moka"},9:{code:"PA",name:"Pamplemousses"},10:{code:"PL",name:"Port Louis"},11:{code:"PU",name:"Port Louis"},12:{code:"PW",name:"Plaines Wilhems"},13:{code:"QB",name:"Quatre Bornes"},14:{code:"RO",name:"Rodrigues"},15:{code:"RR",name:"Riviere du Rempart"},16:{code:"SA",name:"Savanne"},17:{code:"VP",name:"Vacoas-Phoenix"}},YT:{1:{code:"DZA",name:"Dzaoudzi"},2:{code:"PAM",name:"Pamandzi"},3:{code:"MAM",name:"Mamoudzou"},4:{code:"DEM",name:"Dembeni"},5:{code:"BAN",name:"Bandrele"},6:{code:"KAN",name:"Kani-Kéli"},7:{code:"BOU",name:"Bouéni"},8:{code:"CHI",name:"Chirongui"},9:{code:"SAD",name:"Sada"},10:{code:"OUA",name:"Ouangani"},11:{code:"CHI",name:"Chiconi"},12:{code:"TSI",name:"Tsingoni"},13:{code:"MTS",name:"M'Tsangamouji"},14:{code:"ACO",name:"Acoua"},15:{code:"MTS",name:"Mtsamboro"},16:{code:"BAN",name:"Bandraboua"},17:{code:"KOU",name:"Koungou"}},MX:{1:{code:"AGU",name:"Aguascalientes"},2:{code:"BCN",name:"Baja California Norte"},3:{code:"BCS",name:"Baja California Sur"},4:{code:"CAM",name:"Campeche"},5:{code:"CHP",name:"Chiapas"},6:{code:"CHH",name:"Chihuahua"},7:{code:"COA",name:"Coahuila de Zaragoza"},8:{code:"COL",name:"Colima"},9:{code:"DIF",name:"Distrito Federal"},10:{code:"DUR",name:"Durango"},11:{code:"GUA",name:"Guanajuato"},12:{code:"GRO",name:"Guerrero"},13:{code:"HID",name:"Hidalgo"},14:{code:"JAL",name:"Jalisco"},15:{code:"MEX",name:"Mexico"},16:{code:"MIC",name:"Michoacan de Ocampo"},17:{code:"MOR",name:"Morelos"},18:{code:"NAY",name:"Nayarit"},19:{code:"NLE",name:"Nuevo Leon"},20:{code:"OAX",name:"Oaxaca"},21:{code:"PUE",name:"Puebla"},22:{code:"QUE",name:"Queretaro de Arteaga"},23:{code:"ROO",name:"Quintana Roo"},24:{code:"SLP",name:"San Luis Potosi"},25:{code:"SIN",name:"Sinaloa"},26:{code:"SON",name:"Sonora"},27:{code:"TAB",name:"Tabasco"},28:{code:"TAM",name:"Tamaulipas"},29:{code:"TLA",name:"Tlaxcala"},30:{code:"VER",name:"Veracruz-Llave"},31:{code:"YUC",name:"Yucatan"},32:{code:"ZAC",name:"Zacatecas"}},FM:{1:{code:"C",name:"Chuuk"},2:{code:"K",name:"Kosrae"},3:{code:"P",name:"Pohnpei"},4:{code:"Y",name:"Yap"}},MD:{1:{code:"GA",name:"Gagauzia"},2:{code:"CU",name:"Chisinau"},3:{code:"BA",name:"Balti"},4:{code:"CA",name:"Cahul"},5:{code:"ED",name:"Edinet"},6:{code:"LA",name:"Lapusna"},7:{code:"OR",name:"Orhei"},8:{code:"SO",name:"Soroca"},9:{code:"TI",name:"Tighina"},10:{code:"UN",name:"Ungheni"},11:{code:"SN",name:"Stânga Nistrului"}},MC:{1:{code:"FV",name:"Fontvieille"},2:{code:"LC",name:"La Condamine"},3:{code:"MV",name:"Monaco-Ville"},4:{code:"MC",name:"Monte-Carlo"}},MN:{1:{code:"1",name:"Ulanbaatar"},2:{code:"035",name:"Orhon"},3:{code:"037",name:"Darhan uul"},4:{code:"039",name:"Hentiy"},5:{code:"041",name:"Hovsgol"},6:{code:"043",name:"Hovd"},7:{code:"046",name:"Uvs"},8:{code:"047",name:"Tov"},9:{code:"049",name:"Selenge"},10:{code:"051",name:"Suhbaatar"},11:{code:"053",name:"Omnogovi"},12:{code:"055",name:"Ovorhangay"},13:{code:"057",name:"Dzavhan"},14:{code:"059",name:"DundgovL"},15:{code:"061",name:"Dornod"},16:{code:"063",name:"Dornogov"},17:{code:"064",name:"Govi-Sumber"},18:{code:"065",name:"Govi-Altay"},19:{code:"067",name:"Bulgan"},20:{code:"069",name:"Bayanhongor"},21:{code:"071",name:"Bayan-Olgiy"},22:{code:"073",name:"Arhangay"}},MS:{1:{code:"A",name:"Saint Anthony"},2:{code:"G",name:"Saint Georges"},3:{code:"P",name:"Saint Peter"}},MA:{1:{code:"AGD",name:"Agadir"},2:{code:"HOC",name:"Al Hoceima"},3:{code:"AZI",name:"Azilal"},4:{code:"BME",name:"Beni Mellal"},5:{code:"BSL",name:"Ben Slimane"},6:{code:"BLM",name:"Boulemane"},7:{code:"CBL",name:"Casablanca"},8:{code:"CHA",name:"Chaouen"},9:{code:"EJA",name:"El Jadida"},10:{code:"EKS",name:"El Kelaa des Sraghna"},11:{code:"ERA",name:"Er Rachidia"},12:{code:"ESS",name:"Essaouira"},13:{code:"FES",name:"Fes"},14:{code:"FIG",name:"Figuig"},15:{code:"GLM",name:"Guelmim"},16:{code:"IFR",name:"Ifrane"},17:{code:"KEN",name:"Kenitra"},18:{code:"KHM",name:"Khemisset"},19:{code:"KHN",name:"Khenifra"},20:{code:"KHO",name:"Khouribga"},21:{code:"LYN",name:"Laayoune"},22:{code:"LAR",name:"Larache"},23:{code:"MRK",name:"Marrakech"},24:{code:"MKN",name:"Meknes"},25:{code:"NAD",name:"Nador"},26:{code:"ORZ",name:"Ouarzazate"},27:{code:"OUJ",name:"Oujda"},28:{code:"RSA",name:"Rabat-Sale"},29:{code:"SAF",name:"Safi"},30:{code:"SET",name:"Settat"},31:{code:"SKA",name:"Sidi Kacem"},32:{code:"TGR",name:"Tangier"},33:{code:"TAN",name:"Tan-Tan"},34:{code:"TAO",name:"Taounate"},35:{code:"TRD",name:"Taroudannt"},36:{code:"TAT",name:"Tata"},37:{code:"TAZ",name:"Taza"},38:{code:"TET",name:"Tetouan"},39:{code:"TIZ",name:"Tiznit"},40:{code:"ADK",name:"Ad Dakhla"},41:{code:"BJD",name:"Boujdour"},42:{code:"ESM",name:"Es Smara"}},MZ:{1:{code:"CD",name:"Cabo Delgado"},2:{code:"GZ",name:"Gaza"},3:{code:"IN",name:"Inhambane"},4:{code:"MN",name:"Manica"},5:{code:"MC",name:"Maputo (city)"},6:{code:"MP",name:"Maputo"},7:{code:"NA",name:"Nampula"},8:{code:"NI",name:"Niassa"},9:{code:"SO",name:"Sofala"},10:{code:"TE",name:"Tete"},11:{code:"ZA",name:"Zambezia"}},MM:{1:{code:"AY",name:"Ayeyarwady"},2:{code:"BG",name:"Bago"},3:{code:"MG",name:"Magway"},4:{code:"MD",name:"Mandalay"},5:{code:"SG",name:"Sagaing"},6:{code:"TN",name:"Tanintharyi"},7:{code:"YG",name:"Yangon"},8:{code:"CH",name:"Chin State"},9:{code:"KC",name:"Kachin State"},10:{code:"KH",name:"Kayah State"},11:{code:"KN",name:"Kayin State"},12:{code:"MN",name:"Mon State"},13:{code:"RK",name:"Rakhine State"},14:{code:"SH",name:"Shan State"}},NA:{1:{code:"CA",name:"Caprivi"},2:{code:"ER",name:"Erongo"},3:{code:"HA",name:"Hardap"},4:{code:"KR",name:"Karas"},5:{code:"KV",name:"Kavango"},6:{code:"KH",name:"Khomas"},7:{code:"KU",name:"Kunene"},8:{code:"OW",name:"Ohangwena"},9:{code:"OK",name:"Omaheke"},10:{code:"OT",name:"Omusati"},11:{code:"ON",name:"Oshana"},12:{code:"OO",name:"Oshikoto"},13:{code:"OJ",name:"Otjozondjupa"}},NR:{1:{code:"AO",name:"Aiwo"},2:{code:"AA",name:"Anabar"},3:{code:"AT",name:"Anetan"},4:{code:"AI",name:"Anibare"},5:{code:"BA",name:"Baiti"},6:{code:"BO",name:"Boe"},7:{code:"BU",name:"Buada"},8:{code:"DE",name:"Denigomodu"},9:{code:"EW",name:"Ewa"},10:{code:"IJ",name:"Ijuw"},11:{code:"ME",name:"Meneng"},12:{code:"NI",name:"Nibok"},13:{code:"UA",name:"Uaboe"},14:{code:"YA",name:"Yaren"}},NP:{1:{code:"BA",name:"Bagmati"},2:{code:"BH",name:"Bheri"},3:{code:"DH",name:"Dhawalagiri"},4:{code:"GA",name:"Gandaki"},5:{code:"JA",name:"Janakpur"},6:{code:"KA",name:"Karnali"},7:{code:"KO",name:"Kosi"},8:{code:"LU",name:"Lumbini"},9:{code:"MA",name:"Mahakali"},10:{code:"ME",name:"Mechi"},11:{code:"NA",name:"Narayani"},12:{code:"RA",name:"Rapti"},13:{code:"SA",name:"Sagarmatha"},14:{code:"SE",name:"Seti"}},NL:{1:{code:"DR",name:"Drenthe"},2:{code:"FL",name:"Flevoland"},3:{code:"FR",name:"Friesland"},4:{code:"GE",name:"Gelderland"},5:{code:"GR",name:"Groningen"},6:{code:"LI",name:"Limburg"},7:{code:"NB",name:"Noord Brabant"},8:{code:"NH",name:"Noord Holland"},9:{code:"OV",name:"Overijssel"},10:{code:"UT",name:"Utrecht"},11:{code:"ZE",name:"Zeeland"},12:{code:"ZH",name:"Zuid Holland"}},AN:{1:{code:"BON",name:"Bonaire"},2:{code:"CUR",name:"Curaçao"},3:{code:"SAB",name:"Saba"},4:{code:"SEU",name:"Sint Eustatius"},5:{code:"SMA",name:"Sint Maarten"}},NC:{1:{code:"L",name:"Iles Loyaute"},2:{code:"N",name:"Nord"},3:{code:"S",name:"Sud"}},NZ:{1:{code:"AUK",name:"Auckland"},2:{code:"BOP",name:"Bay of Plenty"},3:{code:"CAN",name:"Canterbury"},4:{code:"COR",name:"Coromandel"},5:{code:"GIS",name:"Gisborne"},6:{code:"FIO",name:"Fiordland"},7:{code:"HKB",name:"Hawke's Bay"},8:{code:"MBH",name:"Marlborough"},9:{code:"MWT",name:"Manawatu-Wanganui"},10:{code:"MCM",name:"Mt Cook-Mackenzie"},11:{code:"NSN",name:"Nelson"},12:{code:"NTL",name:"Northland"},13:{code:"OTA",name:"Otago"},14:{code:"STL",name:"Southland"},15:{code:"TKI",name:"Taranaki"},16:{code:"WGN",name:"Wellington"},17:{code:"WKO",name:"Waikato"},18:{code:"WAI",name:"Wairprarapa"},19:{code:"WTC",name:"West Coast"}},NI:{1:{code:"AN",name:"Atlantico Norte"},2:{code:"AS",name:"Atlantico Sur"},3:{code:"BO",name:"Boaco"},4:{code:"CA",name:"Carazo"},5:{code:"CI",name:"Chinandega"},6:{code:"CO",name:"Chontales"},7:{code:"ES",name:"Esteli"},8:{code:"GR",name:"Granada"},9:{code:"JI",name:"Jinotega"},10:{code:"LE",name:"Leon"},11:{code:"MD",name:"Madriz"},12:{code:"MN",name:"Managua"},13:{code:"MS",name:"Masaya"},14:{code:"MT",name:"Matagalpa"},15:{code:"NS",name:"Nuevo Segovia"},16:{code:"RS",name:"Rio San Juan"},17:{code:"RI",name:"Rivas"}},NE:{1:{code:"AG",name:"Agadez"},2:{code:"DF",name:"Diffa"},3:{code:"DS",name:"Dosso"},4:{code:"MA",name:"Maradi"},5:{code:"NM",name:"Niamey"},6:{code:"TH",name:"Tahoua"},7:{code:"TL",name:"Tillaberi"},8:{code:"ZD",name:"Zinder"}},NG:{1:{code:"AB",name:"Abia"},2:{code:"CT",name:"Abuja Federal Capital Territory"},3:{code:"AD",name:"Adamawa"},4:{code:"AK",name:"Akwa Ibom"},5:{code:"AN",name:"Anambra"},6:{code:"BC",name:"Bauchi"},7:{code:"BY",name:"Bayelsa"},8:{code:"BN",name:"Benue"},9:{code:"BO",name:"Borno"},10:{code:"CR",name:"Cross River"},11:{code:"DE",name:"Delta"},12:{code:"EB",name:"Ebonyi"},13:{code:"ED",name:"Edo"},14:{code:"EK",name:"Ekiti"},15:{code:"EN",name:"Enugu"},16:{code:"GO",name:"Gombe"},17:{code:"IM",name:"Imo"},18:{code:"JI",name:"Jigawa"},19:{code:"KD",name:"Kaduna"},20:{code:"KN",name:"Kano"},21:{code:"KT",name:"Katsina"},22:{code:"KE",name:"Kebbi"},23:{code:"KO",name:"Kogi"},24:{code:"KW",name:"Kwara"},25:{code:"LA",name:"Lagos"},26:{code:"NA",name:"Nassarawa"},27:{code:"NI",name:"Niger"},28:{code:"OG",name:"Ogun"},29:{code:"ONG",name:"Ondo"},30:{code:"OS",name:"Osun"},31:{code:"OY",name:"Oyo"},32:{code:"PL",name:"Plateau"},33:{code:"RI",name:"Rivers"},34:{code:"SO",name:"Sokoto"},35:{code:"TA",name:"Taraba"},36:{code:"YO",name:"Yobe"},37:{code:"ZA",name:"Zamfara"}},NU:{1:{code:"MAK",name:"Makefu"},2:{code:"TUA",name:"Tuapa"},3:{code:"NAM",name:"Namukulu"},4:{code:"HIK",name:"Hikutavake"},5:{code:"TOI",name:"Toi"},6:{code:"MUT",name:"Mutalau"},7:{code:"LAK",name:"Lakepa"},8:{code:"LIK",name:"Liku"},9:{code:"HAK",name:"Hakupu"},10:{code:"VAI",name:"Vaiea"},11:{code:"AVA",name:"Avatele"},12:{code:"TAM",name:"Tamakautoga"},13:{code:"ALO",name:"Alofi South"},14:{code:"ALO",name:"Alofi North"}},NF:{1:{code:"NOR",name:"Norfolk Island"}},MP:{1:{code:"N",name:"Northern Islands"},2:{code:"R",name:"Rota"},3:{code:"S",name:"Saipan"},4:{code:"T",name:"Tinian"}},NO:{1:{code:"AK",name:"Akershus"},2:{code:"AA",name:"Aust-Agder"},3:{code:"BU",name:"Buskerud"},4:{code:"FM",name:"Finnmark"},5:{code:"HM",name:"Hedmark"},6:{code:"HL",name:"Hordaland"},7:{code:"MR",name:"Møre og Romsdal"},8:{code:"NL",name:"Nordland"},9:{code:"NT",name:"Nord-Trøndelag"},10:{code:"OP",name:"Oppland"},11:{code:"OL",name:"Oslo"},12:{code:"RL",name:"Rogaland"},13:{code:"SJ",name:"Sogn og Fjordane"},14:{code:"ST",name:"Sør-Trøndelag"},15:{code:"SV",name:"Svalbard"},16:{code:"TM",name:"Telemark"},17:{code:"TR",name:"Troms"},18:{code:"VA",name:"Vest-Agder"},19:{code:"VF",name:"Vestfold"},20:{code:"OF",name:"Østfold"}},OM:{1:{code:"DA",name:"Ad Dakhiliyah"},2:{code:"BA",name:"Al Batinah"},3:{code:"WU",name:"Al Wusta"},4:{code:"SH",name:"Ash Sharqiyah"},5:{code:"ZA",name:"Az Zahirah"},6:{code:"MA",name:"Masqat"},7:{code:"MU",name:"Musandam"},8:{code:"ZU",name:"Zufar"}},PK:{1:{code:"B",name:"Balochistan"},2:{code:"T",name:"Federally Administered Tribal Ar"},3:{code:"I",name:"Islamabad Capital Territory"},4:{code:"N",name:"North-West Frontier"},5:{code:"P",name:"Punjab"},6:{code:"S",name:"Sindh"}},PW:{1:{code:"AM",name:"Aimeliik"},2:{code:"AR",name:"Airai"},3:{code:"AN",name:"Angaur"},4:{code:"HA",name:"Hatohobei"},5:{code:"KA",name:"Kayangel"},6:{code:"KO",name:"Koror"},7:{code:"ME",name:"Melekeok"},8:{code:"NA",name:"Ngaraard"},9:{code:"NG",name:"Ngarchelong"},10:{code:"ND",name:"Ngardmau"},11:{code:"NT",name:"Ngatpang"},12:{code:"NC",name:"Ngchesar"},13:{code:"NR",name:"Ngeremlengui"},14:{code:"NW",name:"Ngiwal"},15:{code:"PE",name:"Peleliu"},16:{code:"SO",name:"Sonsorol"}},PA:{1:{code:"BT",name:"Bocas del Toro"},2:{code:"CH",name:"Chiriqui"},3:{code:"CC",name:"Cocle"},4:{code:"CL",name:"Colon"},5:{code:"DA",name:"Darien"},6:{code:"HE",name:"Herrera"},7:{code:"LS",name:"Los Santos"},8:{code:"PA",name:"Panama"},9:{code:"SB",name:"San Blas"},10:{code:"VG",name:"Veraguas"}},PG:{1:{code:"BV",name:"Bougainville"},2:{code:"CE",name:"Central"},3:{code:"CH",name:"Chimbu"},4:{code:"EH",name:"Eastern Highlands"},5:{code:"EB",name:"East New Britain"},6:{code:"ES",name:"East Sepik"},7:{code:"EN",name:"Enga"},8:{code:"GU",name:"Gulf"},9:{code:"MD",name:"Madang"},10:{code:"MN",name:"Manus"},11:{code:"MB",name:"Milne Bay"},12:{code:"MR",name:"Morobe"},13:{code:"NC",name:"National Capital"},14:{code:"NI",name:"New Ireland"},15:{code:"NO",name:"Northern"},16:{code:"SA",name:"Sandaun"},17:{code:"SH",name:"Southern Highlands"},18:{code:"WE",name:"Western"},19:{code:"WH",name:"Western Highlands"},20:{code:"WB",name:"West New Britain"}},PY:{1:{code:"AG",name:"Alto Paraguay"},2:{code:"AN",name:"Alto Parana"},3:{code:"AM",name:"Amambay"},4:{code:"AS",name:"Asuncion"},5:{code:"BO",name:"Boqueron"},6:{code:"CG",name:"Caaguazu"},7:{code:"CZ",name:"Caazapa"},8:{code:"CN",name:"Canindeyu"},9:{code:"CE",name:"Central"},10:{code:"CC",name:"Concepcion"},11:{code:"CD",name:"Cordillera"},12:{code:"GU",name:"Guaira"},13:{code:"IT",name:"Itapua"},14:{code:"MI",name:"Misiones"},15:{code:"NE",name:"Neembucu"},16:{code:"PA",name:"Paraguari"},17:{code:"PH",name:"Presidente Hayes"},18:{code:"SP",name:"San Pedro"}},PE:{1:{code:"AM",name:"Amazonas"},2:{code:"AN",name:"Ancash"},3:{code:"AP",name:"Apurimac"},4:{code:"AR",name:"Arequipa"},5:{code:"AY",name:"Ayacucho"},6:{code:"CJ",name:"Cajamarca"},7:{code:"CL",name:"Callao"},8:{code:"CU",name:"Cusco"},9:{code:"HV",name:"Huancavelica"},10:{code:"HO",name:"Huanuco"},11:{code:"IC",name:"Ica"},12:{code:"JU",name:"Junin"},13:{code:"LD",name:"La Libertad"},14:{code:"LY",name:"Lambayeque"},15:{code:"LI",name:"Lima"},16:{code:"LO",name:"Loreto"},17:{code:"MD",name:"Madre de Dios"},18:{code:"MO",name:"Moquegua"},19:{code:"PA",name:"Pasco"},20:{code:"PI",name:"Piura"},21:{code:"PU",name:"Puno"},22:{code:"SM",name:"San Martin"},23:{code:"TA",name:"Tacna"},24:{code:"TU",name:"Tumbes"},25:{code:"UC",name:"Ucayali"}},PH:{1:{code:"ABR",name:"Abra"},2:{code:"ANO",name:"Agusan del Norte"},3:{code:"ASU",name:"Agusan del Sur"},4:{code:"AKL",name:"Aklan"},5:{code:"ALB",name:"Albay"},6:{code:"ANT",name:"Antique"},7:{code:"APY",name:"Apayao"},8:{code:"AUR",name:"Aurora"},9:{code:"BAS",name:"Basilan"},10:{code:"BTA",name:"Bataan"},11:{code:"BTE",name:"Batanes"},12:{code:"BTG",name:"Batangas"},13:{code:"BLR",name:"Biliran"},14:{code:"BEN",name:"Benguet"},15:{code:"BOL",name:"Bohol"},16:{code:"BUK",name:"Bukidnon"},17:{code:"BUL",name:"Bulacan"},18:{code:"CAG",name:"Cagayan"},19:{code:"CNO",name:"Camarines Norte"},20:{code:"CSU",name:"Camarines Sur"},21:{code:"CAM",name:"Camiguin"},22:{code:"CAP",name:"Capiz"},23:{code:"CAT",name:"Catanduanes"},24:{code:"CAV",name:"Cavite"},25:{code:"CEB",name:"Cebu"},26:{code:"CMP",name:"Compostela"},27:{code:"DNO",name:"Davao del Norte"},28:{code:"DSU",name:"Davao del Sur"},29:{code:"DOR",name:"Davao Oriental"},30:{code:"ESA",name:"Eastern Samar"},31:{code:"GUI",name:"Guimaras"},32:{code:"IFU",name:"Ifugao"},33:{code:"INO",name:"Ilocos Norte"},34:{code:"ISU",name:"Ilocos Sur"},35:{code:"ILO",name:"Iloilo"},36:{code:"ISA",name:"Isabela"},37:{code:"KAL",name:"Kalinga"},38:{code:"LAG",name:"Laguna"},39:{code:"LNO",name:"Lanao del Norte"},40:{code:"LSU",name:"Lanao del Sur"},41:{code:"UNI",name:"La Union"},42:{code:"LEY",name:"Leyte"},43:{code:"MAG",name:"Maguindanao"},44:{code:"MRN",name:"Marinduque"},45:{code:"MSB",name:"Masbate"},46:{code:"MIC",name:"Mindoro Occidental"},47:{code:"MIR",name:"Mindoro Oriental"},48:{code:"MSC",name:"Misamis Occidental"},49:{code:"MOR",name:"Misamis Oriental"},50:{code:"MOP",name:"Mountain"},51:{code:"NOC",name:"Negros Occidental"},52:{code:"NOR",name:"Negros Oriental"},53:{code:"NCT",name:"North Cotabato"},54:{code:"NSM",name:"Northern Samar"},55:{code:"NEC",name:"Nueva Ecija"},56:{code:"NVZ",name:"Nueva Vizcaya"},57:{code:"PLW",name:"Palawan"},58:{code:"PMP",name:"Pampanga"},59:{code:"PNG",name:"Pangasinan"},60:{code:"QZN",name:"Quezon"},61:{code:"QRN",name:"Quirino"},62:{code:"RIZ",name:"Rizal"},63:{code:"ROM",name:"Romblon"},64:{code:"SMR",name:"Samar"},65:{code:"SRG",name:"Sarangani"},66:{code:"SQJ",name:"Siquijor"},67:{code:"SRS",name:"Sorsogon"},68:{code:"SCO",name:"South Cotabato"},69:{code:"SLE",name:"Southern Leyte"},70:{code:"SKU",name:"Sultan Kudarat"},71:{code:"SLU",name:"Sulu"},72:{code:"SNO",name:"Surigao del Norte"},73:{code:"SSU",name:"Surigao del Sur"},74:{code:"TAR",name:"Tarlac"},75:{code:"TAW",name:"Tawi-Tawi"},76:{code:"ZBL",name:"Zambales"},77:{code:"ZNO",name:"Zamboanga del Norte"},78:{code:"ZSU",name:"Zamboanga del Sur"},79:{code:"ZSI",name:"Zamboanga Sibugay"}},PN:{1:{code:"PIT",name:"Pitcairn Island"}},PL:{1:{code:"DO",name:"Dolnośląskie"},2:{code:"KP",name:"Kujawsko-Pomorskie"},3:{code:"LL",name:"Lubelskie"},4:{code:"LU",name:"Lubuskie"},5:{code:"LO",name:"Łódzkie"},6:{code:"ML",name:"Małopolskie"},7:{code:"MZ",name:"Mazowieckie"},8:{code:"OP",name:"Opolskie"},9:{code:"PP",name:"Podkarpackie"},10:{code:"PL",name:"Podlaskie"},11:{code:"PM",name:"Pomorskie"},12:{code:"SL",name:"Śląskie"},13:{code:"SW",name:"Świętokrzyskie"},14:{code:"WM",name:"Warmińsko-Mazurskie"},15:{code:"WP",name:"Wielkopolskie"},16:{code:"ZA",name:"Zachodniopomorskie"}},PT:{1:{code:"AC",name:"Açores"},2:{code:"AV",name:"Aveiro"},3:{code:"BE",name:"Beja"},4:{code:"BR",name:"Braga"},5:{code:"BA",name:"Bragança"},6:{code:"CB",name:"Castelo Branco"},7:{code:"CO",name:"Coimbra"},8:{code:"EV",name:"évora"},9:{code:"FA",name:"Faro"},10:{code:"GU",name:"Guarda"},12:{code:"LE",name:"Leiria"},13:{code:"LI",name:"Lisboa"},14:{code:"ME",name:"Madeira"},15:{code:"PO",name:"Portalegre"},16:{code:"PR",name:"Porto"},17:{code:"SA",name:"Santarém"},18:{code:"SE",name:"SetÚbal"},19:{code:"VC",name:"Viana do Castelo"},20:{code:"VR",name:"Vila Real"},21:{code:"VI",name:"Viseu"}},PR:{1:{code:"A-A",name:"Añasco"},2:{code:"ADJ",name:"Adjuntas"},3:{code:"AGU",name:"Aguada"},4:{code:"AGU",name:"Aguadilla"},5:{code:"AGU",name:"Aguas Buenas"},6:{code:"AIB",name:"Aibonito"},7:{code:"ARE",name:"Arecibo"},8:{code:"ARR",name:"Arroyo"},9:{code:"BAR",name:"Barceloneta"},10:{code:"BAR",name:"Barranquitas"},11:{code:"BAY",name:"Bayamón"},12:{code:"CAB",name:"Cabo Rojo"},13:{code:"CAG",name:"Caguas"},14:{code:"CAM",name:"Camuy"},15:{code:"CAN",name:"Canóvanas"},16:{code:"CAR",name:"Carolina"},17:{code:"CAT",name:"Cataño"},18:{code:"CAY",name:"Cayey"},19:{code:"CEI",name:"Ceiba"},20:{code:"CIA",name:"Ciales"},21:{code:"CID",name:"Cidra"},22:{code:"COA",name:"Coamo"},23:{code:"COM",name:"Comerío"},24:{code:"COR",name:"Corozal"},25:{code:"CUL",name:"Culebra"},26:{code:"DOR",name:"Dorado"},27:{code:"FAJ",name:"Fajardo"},28:{code:"FLO",name:"Florida"},29:{code:"GUA",name:"Guayama"},30:{code:"GUA",name:"Guayanilla"},31:{code:"GUA",name:"Guaynabo"},32:{code:"GUR",name:"Gurabo"},33:{code:"GU¡",name:"Guánica"},34:{code:"HAT",name:"Hatillo"},35:{code:"HOR",name:"Hormigueros"},36:{code:"HUM",name:"Humacao"},37:{code:"ISA",name:"Isabela"},38:{code:"JAY",name:"Jayuya"},39:{code:"JUA",name:"Juana Díaz"},40:{code:"JUN",name:"Juncos"},41:{code:"LAJ",name:"Lajas"},42:{code:"LAR",name:"Lares"},43:{code:"LAS",name:"Las Marías"},44:{code:"LAS",name:"Las Piedras"},45:{code:"LOÕ",name:"Loíza"},46:{code:"LUQ",name:"Luquillo"},47:{code:"MAN",name:"Manatí"},48:{code:"MAR",name:"Maricao"},49:{code:"MAU",name:"Maunabo"},50:{code:"MAY",name:"Mayagüez"},51:{code:"MOC",name:"Moca"},52:{code:"MOR",name:"Morovis"},53:{code:"NAG",name:"Naguabo"},54:{code:"NAR",name:"Naranjito"},55:{code:"ORO",name:"Orocovis"},56:{code:"PAT",name:"Patillas"},57:{code:"PE-",name:"Peñuelas"},58:{code:"PON",name:"Ponce"},59:{code:"QUE",name:"Quebradillas"},60:{code:"RIN",name:"Rincón"},61:{code:"RIO",name:"Rio Grande"},62:{code:"SAB",name:"Sabana Grande"},63:{code:"SAL",name:"Salinas"},64:{code:"SAN",name:"San Germàn"},65:{code:"SAN",name:"San Juan"},66:{code:"SAN",name:"San Lorenzo"},67:{code:"SAN",name:"San Sebastiàn"},68:{code:"SAN",name:"Santa Isabel"},69:{code:"TOA",name:"Toa Alta"},70:{code:"TOA",name:"Toa Baja"},71:{code:"TRU",name:"Trujillo Alto"},72:{code:"UTU",name:"Utuado"},73:{code:"VEG",name:"Vega Alta"},74:{code:"VEG",name:"Vega Baja"},75:{code:"VIE",name:"Vieques"},76:{code:"VIL",name:"Villalba"},77:{code:"YAB",name:"Yabucoa"},78:{code:"YAU",name:"Yauco"}},QA:{1:{code:"DW",name:"Ad Dawhah"},2:{code:"GW",name:"Al Ghuwayriyah"},3:{code:"JM",name:"Al Jumayliyah"},4:{code:"KR",name:"Al Khawr"},5:{code:"WK",name:"Al Wakrah"},6:{code:"RN",name:"Ar Rayyan"},7:{code:"JB",name:"Jarayan al Batinah"},8:{code:"MS",name:"Madinat ash Shamal"},9:{code:"UD",name:"Umm Sa'id"},10:{code:"UL",name:"Umm Salal"}},RO:{1:{code:"AB",name:"Alba"},2:{code:"AR",name:"Arad"},3:{code:"AG",name:"Arges"},4:{code:"BC",name:"Bacau"},5:{code:"BH",name:"Bihor"},6:{code:"BN",name:"Bistrita-Nasaud"},7:{code:"BT",name:"Botosani"},8:{code:"BV",name:"Brasov"},9:{code:"BR",name:"Braila"},10:{code:"B",name:"Bucuresti"},11:{code:"BZ",name:"Buzau"},12:{code:"CS",name:"Caras-Severin"},13:{code:"CL",name:"Calarasi"},14:{code:"CJ",name:"Cluj"},15:{code:"CT",name:"Constanta"},16:{code:"CV",name:"Covasna"},17:{code:"DB",name:"Dimbovita"},18:{code:"DJ",name:"Dolj"},19:{code:"GL",name:"Galati"},20:{code:"GR",name:"Giurgiu"},21:{code:"GJ",name:"Gorj"},22:{code:"HR",name:"Harghita"},23:{code:"HD",name:"Hunedoara"},24:{code:"IL",name:"Ialomita"},25:{code:"IS",name:"Iasi"},26:{code:"IF",name:"Ilfov"},27:{code:"MM",name:"Maramures"},28:{code:"MH",name:"Mehedinti"},29:{code:"MS",name:"Mures"},30:{code:"NT",name:"Neamt"},31:{code:"OT",name:"Olt"},32:{code:"PH",name:"Prahova"},33:{code:"SM",name:"Satu-Mare"},34:{code:"SJ",name:"Salaj"},35:{code:"SB",name:"Sibiu"},36:{code:"SV",name:"Suceava"},37:{code:"TR",name:"Teleorman"},38:{code:"TM",name:"Timis"},39:{code:"TL",name:"Tulcea"},40:{code:"VS",name:"Vaslui"},41:{code:"VL",name:"Valcea"},42:{code:"VN",name:"Vrancea"}},RU:{1:{code:"AB",name:"Abakan"},2:{code:"AG",name:"Aginskoye"},3:{code:"AN",name:"Anadyr"},4:{code:"AR",name:"Arkahangelsk"},5:{code:"AS",name:"Astrakhan"},6:{code:"BA",name:"Barnaul"},7:{code:"BE",name:"Belgorod"},8:{code:"BI",name:"Birobidzhan"},9:{code:"BL",name:"Blagoveshchensk"},10:{code:"BR",name:"Bryansk"},11:{code:"CH",name:"Cheboksary"},12:{code:"CL",name:"Chelyabinsk"},13:{code:"CR",name:"Cherkessk"},14:{code:"CI",name:"Chita"},15:{code:"DU",name:"Dudinka"},16:{code:"EL",name:"Elista"},17:{code:"GO",name:"Gomo-Altaysk"},18:{code:"GA",name:"Gorno-Altaysk"},19:{code:"GR",name:"Groznyy"},20:{code:"IR",name:"Irkutsk"},21:{code:"IV",name:"Ivanovo"},22:{code:"IZ",name:"Izhevsk"},23:{code:"KA",name:"Kalinigrad"},24:{code:"KL",name:"Kaluga"},25:{code:"KS",name:"Kasnodar"},26:{code:"KZ",name:"Kazan"},27:{code:"KE",name:"Kemerovo"},28:{code:"KH",name:"Khabarovsk"},29:{code:"KM",name:"Khanty-Mansiysk"},30:{code:"KO",name:"Kostroma"},31:{code:"KR",name:"Krasnodar"},32:{code:"KN",name:"Krasnoyarsk"},33:{code:"KU",name:"Kudymkar"},34:{code:"KG",name:"Kurgan"},35:{code:"KK",name:"Kursk"},36:{code:"KY",name:"Kyzyl"},37:{code:"LI",name:"Lipetsk"},38:{code:"MA",name:"Magadan"},39:{code:"MK",name:"Makhachkala"},40:{code:"MY",name:"Maykop"},41:{code:"MO",name:"Moscow"},42:{code:"MU",name:"Murmansk"},43:{code:"NA",name:"Nalchik"},44:{code:"NR",name:"Naryan Mar"},45:{code:"NZ",name:"Nazran"},46:{code:"NI",name:"Nizhniy Novgorod"},47:{code:"NO",name:"Novgorod"},48:{code:"NV",name:"Novosibirsk"},49:{code:"OM",name:"Omsk"},50:{code:"OR",name:"Orel"},51:{code:"OE",name:"Orenburg"},52:{code:"PA",name:"Palana"},53:{code:"PE",name:"Penza"},54:{code:"PR",name:"Perm"},55:{code:"PK",name:"Petropavlovsk-Kamchatskiy"},56:{code:"PT",name:"Petrozavodsk"},57:{code:"PS",name:"Pskov"},58:{code:"RO",name:"Rostov-na-Donu"},59:{code:"RY",name:"Ryazan"},60:{code:"SL",name:"Salekhard"},61:{code:"SA",name:"Samara"},62:{code:"SR",name:"Saransk"},63:{code:"SV",name:"Saratov"},64:{code:"SM",name:"Smolensk"},65:{code:"SP",name:"St. Petersburg"},66:{code:"ST",name:"Stavropol"},67:{code:"SY",name:"Syktyvkar"},68:{code:"TA",name:"Tambov"},69:{code:"TO",name:"Tomsk"},70:{code:"TU",name:"Tula"},71:{code:"TR",name:"Tura"},72:{code:"TV",name:"Tver"},73:{code:"TY",name:"Tyumen"},74:{code:"UF",name:"Ufa"},75:{code:"UL",name:"Ul'yanovsk"},76:{code:"UU",name:"Ulan-Ude"},77:{code:"US",name:"Ust'-Ordynskiy"},78:{code:"VL",name:"Vladikavkaz"},79:{code:"VA",name:"Vladimir"},80:{code:"VV",name:"Vladivostok"},81:{code:"VG",name:"Volgograd"},82:{code:"VD",name:"Vologda"},83:{code:"VO",name:"Voronezh"},84:{code:"VY",name:"Vyatka"},85:{code:"YA",name:"Yakutsk"},86:{code:"YR",name:"Yaroslavl"},87:{code:"YE",name:"Yekaterinburg"},88:{code:"YO",name:"Yoshkar-Ola"}},RW:{1:{code:"BU",name:"Butare"},2:{code:"BY",name:"Byumba"},3:{code:"CY",name:"Cyangugu"},4:{code:"GK",name:"Gikongoro"},5:{code:"GS",name:"Gisenyi"},6:{code:"GT",name:"Gitarama"},7:{code:"KG",name:"Kibungo"},8:{code:"KY",name:"Kibuye"},9:{code:"KR",name:"Kigali Rurale"},10:{code:"KV",name:"Kigali-ville"},11:{code:"RU",name:"Ruhengeri"},12:{code:"UM",name:"Umutara"}},KN:{1:{code:"CCN",name:"Christ Church Nichola Town"},2:{code:"SAS",name:"Saint Anne Sandy Point"},3:{code:"SGB",name:"Saint George Basseterre"},4:{code:"SGG",name:"Saint George Gingerland"},5:{code:"SJW",name:"Saint James Windward"},6:{code:"SJC",name:"Saint John Capesterre"},7:{code:"SJF",name:"Saint John Figtree"},8:{code:"SMC",name:"Saint Mary Cayon"},9:{code:"CAP",name:"Saint Paul Capesterre"},10:{code:"CHA",name:"Saint Paul Charlestown"},11:{code:"SPB",name:"Saint Peter Basseterre"},12:{code:"STL",name:"Saint Thomas Lowland"},13:{code:"STM",name:"Saint Thomas Middle Island"},14:{code:"TPP",name:"Trinity Palmetto Point"}},LC:{1:{code:"AR",name:"Anse-la-Raye"},2:{code:"CA",name:"Castries"},3:{code:"CH",name:"Choiseul"},4:{code:"DA",name:"Dauphin"},5:{code:"DE",name:"Dennery"},6:{code:"GI",name:"Gros-Islet"},7:{code:"LA",name:"Laborie"},8:{code:"MI",name:"Micoud"},9:{code:"PR",name:"Praslin"},10:{code:"SO",name:"Soufriere"},11:{code:"VF",name:"Vieux-Fort"}},VC:{1:{code:"C",name:"Charlotte"},2:{code:"R",name:"Grenadines"},3:{code:"A",name:"Saint Andrew"},4:{code:"D",name:"Saint David"},5:{code:"G",name:"Saint George"},6:{code:"P",name:"Saint Patrick"}},WS:{1:{code:"AN",name:"A'ana"},2:{code:"AI",name:"Aiga-i-le-Tai"},3:{code:"AT",name:"Atua"},4:{code:"FA",name:"Fa'asaleleaga"},5:{code:"GE",name:"Gaga'emauga"},6:{code:"GF",name:"Gagaifomauga"},7:{code:"PA",name:"Palauli"},8:{code:"SA",name:"Satupa'itea"},9:{code:"TU",name:"Tuamasaga"},10:{code:"VF",name:"Va'a-o-Fonoti"},11:{code:"VS",name:"Vaisigano"}},SM:{1:{code:"AC",name:"Acquaviva"},2:{code:"BM",name:"Borgo Maggiore"},3:{code:"CH",name:"Chiesanuova"},4:{code:"DO",name:"Domagnano"},5:{code:"FA",name:"Faetano"},6:{code:"FI",name:"Fiorentino"},7:{code:"MO",name:"Montegiardino"},8:{code:"SM",name:"Citta di San Marino"},9:{code:"SE",name:"Serravalle"}},ST:{1:{code:"S",name:"Sao Tome"},2:{code:"P",name:"Principe"}},SA:{1:{code:"BH",name:"Al Bahah"},2:{code:"HS",name:"Al Hudud ash Shamaliyah"},3:{code:"JF",name:"Al Jawf"},4:{code:"MD",name:"Al Madinah"},5:{code:"QS",name:"Al Qasim"},6:{code:"RD",name:"Ar Riyad"},7:{code:"AQ",name:"Ash Sharqiyah (Eastern)"},8:{code:"AS",name:"'Asir"},9:{code:"HL",name:"Ha'il"},10:{code:"JZ",name:"Jizan"},11:{code:"ML",name:"Makkah"},12:{code:"NR",name:"Najran"},13:{code:"TB",name:"Tabuk"}},SN:{1:{code:"DA",name:"Dakar"},2:{code:"DI",name:"Diourbel"},3:{code:"FA",name:"Fatick"},4:{code:"KA",name:"Kaolack"},5:{code:"KO",name:"Kolda"},6:{code:"LO",name:"Louga"},7:{code:"MA",name:"Matam"},8:{code:"SL",name:"Saint-Louis"},9:{code:"TA",name:"Tambacounda"},10:{code:"TH",name:"Thies"},11:{code:"ZI",name:"Ziguinchor"}},SC:{1:{code:"AP",name:"Anse aux Pins"},2:{code:"AB",name:"Anse Boileau"},3:{code:"AE",name:"Anse Etoile"},4:{code:"AL",name:"Anse Louis"},5:{code:"AR",name:"Anse Royale"},6:{code:"BL",name:"Baie Lazare"},7:{code:"BS",name:"Baie Sainte Anne"},8:{code:"BV",name:"Beau Vallon"},9:{code:"BA",name:"Bel Air"},10:{code:"BO",name:"Bel Ombre"},11:{code:"CA",name:"Cascade"},12:{code:"GL",name:"Glacis"},13:{code:"GM",name:"Grand' Anse (on Mahe)"},14:{code:"GP",name:"Grand' Anse (on Praslin)"},15:{code:"DG",name:"La Digue"},16:{code:"RA",name:"La Riviere Anglaise"},17:{code:"MB",name:"Mont Buxton"},18:{code:"MF",name:"Mont Fleuri"},19:{code:"PL",name:"Plaisance"},20:{code:"PR",name:"Pointe La Rue"},21:{code:"PG",name:"Port Glaud"},22:{code:"SL",name:"Saint Louis"},23:{code:"TA",name:"Takamaka"}},SL:{1:{code:"E",name:"Eastern"},2:{code:"N",name:"Northern"},3:{code:"S",name:"Southern"},4:{code:"W",name:"Western"}},SK:{1:{code:"BA",name:"Banskobystricky"},2:{code:"BR",name:"Bratislavsky"},3:{code:"KO",name:"Kosicky"},4:{code:"NI",name:"Nitriansky"},5:{code:"PR",name:"Presovsky"},6:{code:"TC",name:"Trenciansky"},7:{code:"TV",name:"Trnavsky"},8:{code:"ZI",name:"Zilinsky"}},SI:{1:{code:"4",name:"Štajerska"},2:{code:"2A",name:"Gorenjska"},3:{code:"5",name:"Prekmurje"},4:{code:"3",name:"Koroška"},5:{code:"2B",name:"Notranjska"},6:{code:"1",name:"Primorska"},7:{code:"2C",name:"Dolenjska"},8:{code:"2C",name:"Bela Krajina"}},SB:{1:{code:"CE",name:"Central"},2:{code:"CH",name:"Choiseul"},3:{code:"GC",name:"Guadalcanal"},4:{code:"HO",name:"Honiara"},5:{code:"IS",name:"Isabel"},6:{code:"MK",name:"Makira"},7:{code:"ML",name:"Malaita"},8:{code:"RB",name:"Rennell and Bellona"},9:{code:"TM",name:"Temotu"},10:{code:"WE",name:"Western"}},SO:{1:{code:"AW",name:"Awdal"},2:{code:"BK",name:"Bakool"},3:{code:"BN",name:"Banaadir"},4:{code:"BR",name:"Bari"},5:{code:"BY",name:"Bay"},6:{code:"GA",name:"Galguduud"},7:{code:"GE",name:"Gedo"},8:{code:"HI",name:"Hiiraan"},9:{code:"JD",name:"Jubbada Dhexe"},10:{code:"JH",name:"Jubbada Hoose"},11:{code:"MU",name:"Mudug"},12:{code:"NU",name:"Nugaal"},13:{code:"SA",name:"Sanaag"},14:{code:"SD",name:"Shabeellaha Dhexe"},15:{code:"SH",name:"Shabeellaha Hoose"},16:{code:"SL",name:"Sool"},17:{code:"TO",name:"Togdheer"},18:{code:"WG",name:"Woqooyi Galbeed"}},ZA:{1:{code:"EC",name:"Eastern Cape"},2:{code:"FS",name:"Free State"},3:{code:"GT",name:"Gauteng"},4:{code:"KN",name:"KwaZulu-Natal"},5:{code:"LP",name:"Limpopo"},6:{code:"MP",name:"Mpumalanga"},7:{code:"NW",name:"North West"},8:{code:"NC",name:"Northern Cape"},9:{code:"WC",name:"Western Cape"}},ES:{1:{code:"CA",name:"La Coruña"},2:{code:"AL",name:"Álava"},3:{code:"AB",name:"Albacete"},4:{code:"AC",name:"Alicante"},5:{code:"AM",name:"Almeria"},6:{code:"AS",name:"Asturias"},7:{code:"AV",name:"Ávila"},8:{code:"BJ",name:"Badajoz"},9:{code:"IB",name:"Baleares"},10:{code:"BA",name:"Barcelona"},11:{code:"BU",name:"Burgos"},12:{code:"CC",name:"Cáceres"},13:{code:"CZ",name:"Cádiz"},14:{code:"CT",name:"Cantabria"},15:{code:"CL",name:"Castellón"},16:{code:"CE",name:"Ceuta"},17:{code:"CR",name:"Ciudad Real"},18:{code:"CD",name:"Córdoba"},19:{code:"CU",name:"Cuenca"},20:{code:"GI",name:"Gerona"},21:{code:"GD",name:"Granada"},22:{code:"GJ",name:"Guadalajara"},23:{code:"GP",name:"Guipúzcoa"},24:{code:"HL",name:"Huelva"},25:{code:"HS",name:"Huesca"},26:{code:"JN",name:"Jaén"},27:{code:"RJ",name:"La Rioja"},28:{code:"PM",name:"Las Palmas"},29:{code:"LE",name:"León"},30:{code:"LL",name:"Lérida"},31:{code:"LG",name:"Lugo"},32:{code:"MD",name:"Madrid"},33:{code:"MA",name:"Málaga"},34:{code:"ML",name:"Melilla"},35:{code:"MU",name:"Murcia"},36:{code:"NV",name:"Navarra"},37:{code:"OU",name:"Ourense"},38:{code:"PL",name:"Palencia"},39:{code:"PO",name:"Pontevedra"},40:{code:"SL",name:"Salamanca"},41:{code:"SC",name:"Santa Cruz de Tenerife"},42:{code:"SG",name:"Segovia"},43:{code:"SV",name:"Sevilla"},44:{code:"SO",name:"Soria"},45:{code:"TA",name:"Tarragona"},46:{code:"TE",name:"Teruel"},47:{code:"TO",name:"Toledo"},48:{code:"VC",name:"Valencia"},49:{code:"VD",name:"Valladolid"},50:{code:"VZ",name:"Vizcaya"},51:{code:"ZM",name:"Zamora"},52:{code:"ZR",name:"Zaragoza"}},LK:{1:{code:"CE",name:"Central"},2:{code:"EA",name:"Eastern"},3:{code:"NC",name:"North Central"},4:{code:"NO",name:"Northern"},5:{code:"NW",name:"North Western"},6:{code:"SA",name:"Sabaragamuwa"},7:{code:"SO",name:"Southern"},8:{code:"UV",name:"Uva"},9:{code:"WE",name:"Western"}},SH:{1:{code:"A",name:"Ascension"},2:{code:"S",name:"Saint Helena"},3:{code:"T",name:"Tristan da Cunha"}},PM:{1:{code:"P",name:"Saint Pierre"},2:{code:"M",name:"Miquelon"}},SD:{1:{code:"ANL",name:"A'ali an Nil"},2:{code:"BAM",name:"Al Bahr al Ahmar"},3:{code:"BRT",name:"Al Buhayrat"},4:{code:"JZR",name:"Al Jazirah"},5:{code:"KRT",name:"Al Khartum"},6:{code:"QDR",name:"Al Qadarif"},7:{code:"WDH",name:"Al Wahdah"},8:{code:"ANB",name:"An Nil al Abyad"},9:{code:"ANZ",name:"An Nil al Azraq"},10:{code:"ASH",name:"Ash Shamaliyah"},11:{code:"BJA",name:"Bahr al Jabal"},12:{code:"GIS",name:"Gharb al Istiwa'iyah"},13:{code:"GBG",name:"Gharb Bahr al Ghazal"},14:{code:"GDA",name:"Gharb Darfur"},15:{code:"GKU",name:"Gharb Kurdufan"},16:{code:"JDA",name:"Janub Darfur"},17:{code:"JKU",name:"Janub Kurdufan"},18:{code:"JQL",name:"Junqali"},19:{code:"KSL",name:"Kassala"},20:{code:"NNL",name:"Nahr an Nil"},21:{code:"SBG",name:"Shamal Bahr al Ghazal"},22:{code:"SDA",name:"Shamal Darfur"},23:{code:"SKU",name:"Shamal Kurdufan"},24:{code:"SIS",name:"Sharq al Istiwa'iyah"},25:{code:"SNR",name:"Sinnar"},26:{code:"WRB",name:"Warab"}},SR:{1:{code:"BR",name:"Brokopondo"},2:{code:"CM",name:"Commewijne"},3:{code:"CR",name:"Coronie"},4:{code:"MA",name:"Marowijne"},5:{code:"NI",name:"Nickerie"},6:{code:"PA",name:"Para"},7:{code:"PM",name:"Paramaribo"},9:{code:"SA",name:"Saramacca"},10:{code:"SI",name:"Sipaliwini"},11:{code:"WA",name:"Wanica"}},SZ:{1:{code:"H",name:"Hhohho"},2:{code:"L",name:"Lubombo"},3:{code:"M",name:"Manzini"},4:{code:"S",name:"Shishelweni"}},SE:{1:{code:"K",name:"Blekinge"},2:{code:"W",name:"Dalama"},3:{code:"I",name:"Gotland"},4:{code:"X",name:"Gävleborg"},5:{code:"N",name:"Halland"},6:{code:"Z",name:"Jämtland"},7:{code:"F",name:"Jönköping"},8:{code:"H",name:"Kalmar"},9:{code:"G",name:"Kronoberg"},10:{code:"BD",name:"Norrbotten"},11:{code:"M",name:"Skåne"},12:{code:"AB",name:"Stockholm"},13:{code:"D",name:"Södermanland"},14:{code:"C",name:"Uppsala"},15:{code:"S",name:"Värmland"},16:{code:"AC",name:"Västerbotten"},17:{code:"Y",name:"Västernorrland"},18:{code:"U",name:"Västmanland"},19:{code:"O",name:"Västra Götaland"},20:{code:"T",name:"Örebro"},21:{code:"E",name:"Östergötland"}},CH:{1:{code:"AG",name:"Aargau"},2:{code:"AR",name:"Appenzell Ausserrhoden"},3:{code:"AI",name:"Appenzell Innerrhoden"},4:{code:"BS",name:"Basel-Stadt"},5:{code:"BL",name:"Basel-Landschaft"},6:{code:"BE",name:"Bern"},7:{code:"FR",name:"Fribourg"},8:{code:"GE",name:"Genève"},9:{code:"GL",name:"Glarus"},10:{code:"GR",name:"Graubünden"},11:{code:"JU",name:"Jura"},12:{code:"LU",name:"Lucerne"},13:{code:"NE",name:"Neuchâtel"},14:{code:"NW",name:"Nidwalden"},15:{code:"OW",name:"Obwalden"},16:{code:"SG",name:"St. Gallen"},17:{code:"SH",name:"Schaffhausen"},18:{code:"SZ",name:"Schwyz"},19:{code:"SO",name:"Solothurn"},20:{code:"TG",name:"Thurgau"},21:{code:"TI",name:"Ticino"},22:{code:"UR",name:"Uri"},23:{code:"VS",name:"Valais"},24:{code:"VD",name:"Vaud"},25:{code:"ZG",name:"Zug"},26:{code:"ZH",name:"Zürich"}},SY:{1:{code:"HA",name:"Al Hasakah"},2:{code:"LA",name:"Al Ladhiqiyah"},3:{code:"QU",name:"Al Qunaytirah"},4:{code:"RQ",name:"Ar Raqqah"},5:{code:"SU",name:"As Suwayda"},6:{code:"DA",name:"Dara"},7:{code:"DZ",name:"Dayr az Zawr"},8:{code:"DI",name:"Dimashq"},9:{code:"HL",name:"Halab"},10:{code:"HM",name:"Hamah"},11:{code:"HI",name:"Hims"},12:{code:"ID",name:"Idlib"},13:{code:"RD",name:"Rif Dimashq"},14:{code:"TA",name:"Tartus"}},TW:{1:{code:"CH",name:"Chang-hua"},2:{code:"CI",name:"Chia-i"},3:{code:"HS",name:"Hsin-chu"},4:{code:"HL",name:"Hua-lien"},5:{code:"IL",name:"I-lan"},6:{code:"KH",name:"Kao-hsiung county"},7:{code:"KM",name:"Kin-men"},8:{code:"LC",name:"Lien-chiang"},9:{code:"ML",name:"Miao-li"},10:{code:"NT",name:"Nan-t'ou"},11:{code:"PH",name:"P'eng-hu"},12:{code:"PT",name:"P'ing-tung"},13:{code:"TG",name:"T'ai-chung"},14:{code:"TA",name:"T'ai-nan"},15:{code:"TP",name:"T'ai-pei county"},16:{code:"TT",name:"T'ai-tung"},17:{code:"TY",name:"T'ao-yuan"},18:{code:"YL",name:"Yun-lin"},19:{code:"CC",name:"Chia-i city"},20:{code:"CL",name:"Chi-lung"},21:{code:"HC",name:"Hsin-chu"},22:{code:"TH",name:"T'ai-chung"},23:{code:"TN",name:"T'ai-nan"},24:{code:"KC",name:"Kao-hsiung city"},25:{code:"TC",name:"T'ai-pei city"}},TJ:{1:{code:"GB",name:"Gorno-Badakhstan"},2:{code:"KT",name:"Khatlon"},3:{code:"SU",name:"Sughd"}},TZ:{1:{code:"AR",name:"Arusha"},2:{code:"DS",name:"Dar es Salaam"},3:{code:"DO",name:"Dodoma"},4:{code:"IR",name:"Iringa"},5:{code:"KA",name:"Kagera"},6:{code:"KI",name:"Kigoma"},7:{code:"KJ",name:"Kilimanjaro"},8:{code:"LN",name:"Lindi"},9:{code:"MY",name:"Manyara"},10:{code:"MR",name:"Mara"},11:{code:"MB",name:"Mbeya"},12:{code:"MO",name:"Morogoro"},13:{code:"MT",name:"Mtwara"},14:{code:"MW",name:"Mwanza"},15:{code:"PN",name:"Pemba North"},16:{code:"PS",name:"Pemba South"},17:{code:"PW",name:"Pwani"},18:{code:"RK",name:"Rukwa"},19:{code:"RV",name:"Ruvuma"},20:{code:"SH",name:"Shinyanga"},21:{code:"SI",name:"Singida"},22:{code:"TB",name:"Tabora"},23:{code:"TN",name:"Tanga"},24:{code:"ZC",name:"Zanzibar Central/South"},25:{code:"ZN",name:"Zanzibar North"},26:{code:"ZU",name:"Zanzibar Urban/West"}},TH:{1:{code:"Amnat Charoen",name:"Amnat Charoen"},2:{code:"Ang Thong",name:"Ang Thong"},3:{code:"Ayutthaya",name:"Ayutthaya"},4:{code:"Bangkok",name:"Bangkok"},5:{code:"Buriram",name:"Buriram"},6:{code:"Chachoengsao",name:"Chachoengsao"},7:{code:"Chai Nat",name:"Chai Nat"},8:{code:"Chaiyaphum",name:"Chaiyaphum"},9:{code:"Chanthaburi",name:"Chanthaburi"},10:{code:"Chiang Mai",name:"Chiang Mai"},11:{code:"Chiang Rai",name:"Chiang Rai"},12:{code:"Chon Buri",name:"Chon Buri"},13:{code:"Chumphon",name:"Chumphon"},14:{code:"Kalasin",name:"Kalasin"},15:{code:"Kamphaeng Phet",name:"Kamphaeng Phet"},16:{code:"Kanchanaburi",name:"Kanchanaburi"},17:{code:"Khon Kaen",name:"Khon Kaen"},18:{code:"Krabi",name:"Krabi"},19:{code:"Lampang",name:"Lampang"},20:{code:"Lamphun",name:"Lamphun"},21:{code:"Loei",name:"Loei"},22:{code:"Lop Buri",name:"Lop Buri"},23:{code:"Mae Hong Son",name:"Mae Hong Son"},24:{code:"Maha Sarakham",name:"Maha Sarakham"},25:{code:"Mukdahan",name:"Mukdahan"},26:{code:"Nakhon Nayok",name:"Nakhon Nayok"},27:{code:"Nakhon Pathom",name:"Nakhon Pathom"},28:{code:"Nakhon Phanom",name:"Nakhon Phanom"},29:{code:"Nakhon Ratchasima",name:"Nakhon Ratchasima"},30:{code:"Nakhon Sawan",name:"Nakhon Sawan"},31:{code:"Nakhon Si Thammarat",name:"Nakhon Si Thammarat"},32:{code:"Nan",name:"Nan"},33:{code:"Narathiwat",name:"Narathiwat"},34:{code:"Nong Bua Lamphu",name:"Nong Bua Lamphu"},35:{code:"Nong Khai",name:"Nong Khai"},36:{code:"Nonthaburi",name:"Nonthaburi"},37:{code:"Pathum Thani",name:"Pathum Thani"},38:{code:"Pattani",name:"Pattani"},39:{code:"Phangnga",name:"Phangnga"},40:{code:"Phatthalung",name:"Phatthalung"},41:{code:"Phayao",name:"Phayao"},42:{code:"Phetchabun",name:"Phetchabun"},43:{code:"Phetchaburi",name:"Phetchaburi"},44:{code:"Phichit",name:"Phichit"},45:{code:"Phitsanulok",name:"Phitsanulok"},46:{code:"Phrae",name:"Phrae"},47:{code:"Phuket",name:"Phuket"},48:{code:"Prachin Buri",name:"Prachin Buri"},49:{code:"Prachuap Khiri Khan",name:"Prachuap Khiri Khan"},50:{code:"Ranong",name:"Ranong"},51:{code:"Ratchaburi",name:"Ratchaburi"},52:{code:"Rayong",name:"Rayong"},53:{code:"Roi Et",name:"Roi Et"},54:{code:"Sa Kaeo",name:"Sa Kaeo"},55:{code:"Sakon Nakhon",name:"Sakon Nakhon"},56:{code:"Samut Prakan",name:"Samut Prakan"},57:{code:"Samut Sakhon",name:"Samut Sakhon"},58:{code:"Samut Songkhram",name:"Samut Songkhram"},59:{code:"Sara Buri",name:"Sara Buri"},60:{code:"Satun",name:"Satun"},61:{code:"Sing Buri",name:"Sing Buri"},62:{code:"Sisaket",name:"Sisaket"},63:{code:"Songkhla",name:"Songkhla"},64:{code:"Sukhothai",name:"Sukhothai"},65:{code:"Suphan Buri",name:"Suphan Buri"},66:{code:"Surat Thani",name:"Surat Thani"},67:{code:"Surin",name:"Surin"},68:{code:"Tak",name:"Tak"},69:{code:"Trang",name:"Trang"},70:{code:"Trat",name:"Trat"},71:{code:"Ubon Ratchathani",name:"Ubon Ratchathani"},72:{code:"Udon Thani",name:"Udon Thani"},73:{code:"Uthai Thani",name:"Uthai Thani"},74:{code:"Uttaradit",name:"Uttaradit"},75:{code:"Yala",name:"Yala"},76:{code:"Yasothon",name:"Yasothon"}},TG:{1:{code:"K",name:"Kara"},2:{code:"P",name:"Plateaux"},3:{code:"S",name:"Savanes"},4:{code:"C",name:"Centrale"},5:{code:"M",name:"Maritime"}},TK:{1:{code:"A",name:"Atafu"},2:{code:"F",name:"Fakaofo"},3:{code:"N",name:"Nukunonu"}},TO:{1:{code:"H",name:"Ha'apai"},2:{code:"T",name:"Tongatapu"},3:{code:"V",name:"Vava'u"}},TT:{1:{code:"CT",name:"Couva/Tabaquite/Talparo"},2:{code:"DM",name:"Diego Martin"},3:{code:"MR",name:"Mayaro/Rio Claro"},4:{code:"PD",name:"Penal/Debe"},5:{code:"PT",name:"Princes Town"},6:{code:"SG",name:"Sangre Grande"},7:{code:"SL",name:"San Juan/Laventille"},8:{code:"SI",name:"Siparia"},9:{code:"TP",name:"Tunapuna/Piarco"},10:{code:"PS",name:"Port of Spain"},11:{code:"SF",name:"San Fernando"},12:{code:"AR",name:"Arima"},13:{code:"PF",name:"Point Fortin"},14:{code:"CH",name:"Chaguanas"},15:{code:"TO",name:"Tobago"}},TN:{1:{code:"AR",name:"Ariana"},2:{code:"BJ",name:"Beja"},3:{code:"BA",name:"Ben Arous"},4:{code:"BI",name:"Bizerte"},5:{code:"GB",name:"Gabes"},6:{code:"GF",name:"Gafsa"},7:{code:"JE",name:"Jendouba"},8:{code:"KR",name:"Kairouan"},9:{code:"KS",name:"Kasserine"},10:{code:"KB",name:"Kebili"},11:{code:"KF",name:"Kef"},12:{code:"MH",name:"Mahdia"},13:{code:"MN",name:"Manouba"},14:{code:"ME",name:"Medenine"},15:{code:"MO",name:"Monastir"},16:{code:"NA",name:"Nabeul"},17:{code:"SF",name:"Sfax"},18:{code:"SD",name:"Sidi"},19:{code:"SL",name:"Siliana"},20:{code:"SO",name:"Sousse"},21:{code:"TA",name:"Tataouine"},22:{code:"TO",name:"Tozeur"},23:{code:"TU",name:"Tunis"},24:{code:"ZA",name:"Zaghouan"}},TR:{1:{code:"ADA",name:"Adana"},2:{code:"ADI",name:"Adiyaman"},3:{code:"AFY",name:"Afyonkarahisar"},4:{code:"AGR",name:"Agri"},5:{code:"AKS",name:"Aksaray"},6:{code:"AMA",name:"Amasya"},7:{code:"ANK",name:"Ankara"},8:{code:"ANT",name:"Antalya"},9:{code:"ARD",name:"Ardahan"},10:{code:"ART",name:"Artvin"},11:{code:"AYI",name:"Aydin"},12:{code:"BAL",name:"Balikesir"},13:{code:"BAR",name:"Bartin"},14:{code:"BAT",name:"Batman"},15:{code:"BAY",name:"Bayburt"},16:{code:"BIL",name:"Bilecik"},17:{code:"BIN",name:"Bingol"},18:{code:"BIT",name:"Bitlis"},19:{code:"BOL",name:"Bolu"},20:{code:"BRD",name:"Burdur"},21:{code:"BRS",name:"Bursa"},22:{code:"CKL",name:"Canakkale"},23:{code:"CKR",name:"Cankiri"},24:{code:"COR",name:"Corum"},25:{code:"DEN",name:"Denizli"},26:{code:"DIY",name:"Diyarbakir"},27:{code:"DUZ",name:"Duzce"},28:{code:"EDI",name:"Edirne"},29:{code:"ELA",name:"Elazig"},30:{code:"EZC",name:"Erzincan"},31:{code:"EZR",name:"Erzurum"},32:{code:"ESK",name:"Eskisehir"},33:{code:"GAZ",name:"Gaziantep"},34:{code:"GIR",name:"Giresun"},35:{code:"GMS",name:"Gumushane"},36:{code:"HKR",name:"Hakkari"},37:{code:"HTY",name:"Hatay"},38:{code:"IGD",name:"Igdir"},39:{code:"ISP",name:"Isparta"},40:{code:"IST",name:"Istanbul"},41:{code:"IZM",name:"Izmir"},42:{code:"KAH",name:"Kahramanmaras"},43:{code:"KRB",name:"Karabuk"},44:{code:"KRM",name:"Karaman"},45:{code:"KRS",name:"Kars"},46:{code:"KAS",name:"Kastamonu"},47:{code:"KAY",name:"Kayseri"},48:{code:"KLS",name:"Kilis"},49:{code:"KRK",name:"Kirikkale"},50:{code:"KLR",name:"Kirklareli"},51:{code:"KRH",name:"Kirsehir"},52:{code:"KOC",name:"Kocaeli"},53:{code:"KON",name:"Konya"},54:{code:"KUT",name:"Kutahya"},55:{code:"MAL",name:"Malatya"},56:{code:"MAN",name:"Manisa"},57:{code:"MAR",name:"Mardin"},58:{code:"MER",name:"Mersin"},59:{code:"MUG",name:"Mugla"},60:{code:"MUS",name:"Mus"},61:{code:"NEV",name:"Nevsehir"},62:{code:"NIG",name:"Nigde"},63:{code:"ORD",name:"Ordu"},64:{code:"OSM",name:"Osmaniye"},65:{code:"RIZ",name:"Rize"},66:{code:"SAK",name:"Sakarya"},67:{code:"SAM",name:"Samsun"},68:{code:"SAN",name:"Sanliurfa"},69:{code:"SII",name:"Siirt"},70:{code:"SIN",name:"Sinop"},71:{code:"SIR",name:"Sirnak"},72:{code:"SIV",name:"Sivas"},73:{code:"TEL",name:"Tekirdag"},74:{code:"TOK",name:"Tokat"},75:{code:"TRA",name:"Trabzon"},76:{code:"TUN",name:"Tunceli"},77:{code:"USK",name:"Usak"},78:{code:"VAN",name:"Van"},79:{code:"YAL",name:"Yalova"},80:{code:"YOZ",name:"Yozgat"},81:{code:"ZON",name:"Zonguldak"}},TM:{1:{code:"A",name:"Ahal Welayaty"},2:{code:"B",name:"Balkan Welayaty"},3:{code:"D",name:"Dashhowuz Welayaty"},4:{code:"L",name:"Lebap Welayaty"},5:{code:"M",name:"Mary Welayaty"}},TC:{1:{code:"AC",name:"Ambergris Cays"},2:{code:"DC",name:"Dellis Cay"},3:{code:"FC",name:"French Cay"},4:{code:"LW",name:"Little Water Cay"},5:{code:"RC",name:"Parrot Cay"},6:{code:"PN",name:"Pine Cay"},7:{code:"SL",name:"Salt Cay"},8:{code:"GT",name:"Grand Turk"},9:{code:"SC",name:"South Caicos"},10:{code:"EC",name:"East Caicos"},11:{code:"MC",name:"Middle Caicos"},12:{code:"NC",name:"North Caicos"},13:{code:"PR",name:"Providenciales"},14:{code:"WC",name:"West Caicos"}},TV:{1:{code:"NMG",name:"Nanumanga"},2:{code:"NLK",name:"Niulakita"},3:{code:"NTO",name:"Niutao"},4:{code:"FUN",name:"Funafuti"},5:{code:"NME",name:"Nanumea"},6:{code:"NUI",name:"Nui"},7:{code:"NFT",name:"Nukufetau"},8:{code:"NLL",name:"Nukulaelae"},9:{code:"VAI",name:"Vaitupu"}},UG:{1:{code:"KAL",name:"Kalangala"},2:{code:"KMP",name:"Kampala"},3:{code:"KAY",name:"Kayunga"},4:{code:"KIB",name:"Kiboga"},5:{code:"LUW",name:"Luwero"},6:{code:"MAS",name:"Masaka"},7:{code:"MPI",name:"Mpigi"},8:{code:"MUB",name:"Mubende"},9:{code:"MUK",name:"Mukono"},10:{code:"NKS",name:"Nakasongola"},11:{code:"RAK",name:"Rakai"},12:{code:"SEM",name:"Sembabule"},13:{code:"WAK",name:"Wakiso"},14:{code:"BUG",name:"Bugiri"},15:{code:"BUS",name:"Busia"},16:{code:"IGA",name:"Iganga"},17:{code:"JIN",name:"Jinja"},18:{code:"KAB",name:"Kaberamaido"},19:{code:"KML",name:"Kamuli"},20:{code:"KPC",name:"Kapchorwa"},21:{code:"KTK",name:"Katakwi"},22:{code:"KUM",name:"Kumi"},23:{code:"MAY",name:"Mayuge"},24:{code:"MBA",name:"Mbale"},25:{code:"PAL",name:"Pallisa"},26:{code:"SIR",name:"Sironko"},27:{code:"SOR",name:"Soroti"},28:{code:"TOR",name:"Tororo"},29:{code:"ADJ",name:"Adjumani"},30:{code:"APC",name:"Apac"},31:{code:"ARU",name:"Arua"},32:{code:"GUL",name:"Gulu"},33:{code:"KIT",name:"Kitgum"},34:{code:"KOT",name:"Kotido"},35:{code:"LIR",name:"Lira"},36:{code:"MRT",name:"Moroto"},37:{code:"MOY",name:"Moyo"},38:{code:"NAK",name:"Nakapiripirit"},39:{code:"NEB",name:"Nebbi"},40:{code:"PAD",name:"Pader"},41:{code:"YUM",name:"Yumbe"},42:{code:"BUN",name:"Bundibugyo"},43:{code:"BSH",name:"Bushenyi"},44:{code:"HOI",name:"Hoima"},45:{code:"KBL",name:"Kabale"},46:{code:"KAR",name:"Kabarole"},47:{code:"KAM",name:"Kamwenge"},48:{code:"KAN",name:"Kanungu"},49:{code:"KAS",name:"Kasese"},50:{code:"KBA",name:"Kibaale"},51:{code:"KIS",name:"Kisoro"},52:{code:"KYE",name:"Kyenjojo"},53:{code:"MSN",name:"Masindi"},54:{code:"MBR",name:"Mbarara"},55:{code:"NTU",name:"Ntungamo"},56:{code:"RUK",name:"Rukungiri"}},UA:{1:{code:"CK",name:"Cherkasy"},2:{code:"CH",name:"Chernihiv"},3:{code:"CV",name:"Chernivtsi"},4:{code:"CR",name:"Crimea"},5:{code:"DN",name:"Dnipropetrovs'k"},6:{code:"DO",name:"Donets'k"},7:{code:"IV",name:"Ivano-Frankivs'k"},8:{code:"KL",name:"Kharkiv Kherson"},9:{code:"KM",name:"Khmel'nyts'kyy"},10:{code:"KR",name:"Kirovohrad"},11:{code:"KV",name:"Kiev"},12:{code:"KY",name:"Kyyiv"},13:{code:"LU",name:"Luhans'k"},14:{code:"LV",name:"L'viv"},15:{code:"MY",name:"Mykolayiv"},16:{code:"OD",name:"Odesa"},17:{code:"PO",name:"Poltava"},18:{code:"RI",name:"Rivne"},19:{code:"SE",name:"Sevastopol"},20:{code:"SU",name:"Sumy"},21:{code:"TE",name:"Ternopil'"},22:{code:"VI",name:"Vinnytsya"},23:{code:"VO",name:"Volyn'"},24:{code:"ZK",name:"Zakarpattya"},25:{code:"ZA",name:"Zaporizhzhya"},26:{code:"ZH",name:"Zhytomyr"}},AE:{1:{code:"AZ",name:"Abu Zaby"},2:{code:"AJ",name:"'Ajman"},3:{code:"FU",name:"Al Fujayrah"},4:{code:"SH",name:"Ash Shariqah"},5:{code:"DU",name:"Dubayy"},6:{code:"RK",name:"R'as al Khaymah"},7:{code:"UQ",name:"Umm al Qaywayn"}},GB:{1:{code:"ABN",name:"Aberdeen"},2:{code:"ABNS",name:"Aberdeenshire"},3:{code:"ANG",name:"Anglesey"},4:{code:"AGS",name:"Angus"},5:{code:"ARY",name:"Argyll and Bute"},6:{code:"BEDS",name:"Bedfordshire"},7:{code:"BERKS",name:"Berkshire"},8:{code:"BLA",name:"Blaenau Gwent"},9:{code:"BRI",name:"Bridgend"},10:{code:"BSTL",name:"Bristol"},11:{code:"BUCKS",name:"Buckinghamshire"},12:{code:"CAE",name:"Caerphilly"},13:{code:"CAMBS",name:"Cambridgeshire"},14:{code:"CDF",name:"Cardiff"},15:{code:"CARM",name:"Carmarthenshire"},16:{code:"CDGN",name:"Ceredigion"},17:{code:"CHES",name:"Cheshire"},18:{code:"CLACK",name:"Clackmannanshire"},19:{code:"CON",name:"Conwy"},20:{code:"CORN",name:"Cornwall"},21:{code:"DNBG",name:"Denbighshire"},22:{code:"DERBY",name:"Derbyshire"},23:{code:"DVN",name:"Devon"},24:{code:"DOR",name:"Dorset"},25:{code:"DGL",name:"Dumfries and Galloway"},26:{code:"DUND",name:"Dundee"},27:{code:"DHM",name:"Durham"},28:{code:"ARYE",name:"East Ayrshire"},29:{code:"DUNBE",name:"East Dunbartonshire"},30:{code:"LOTE",name:"East Lothian"},31:{code:"RENE",name:"East Renfrewshire"},32:{code:"ERYS",name:"East Riding of Yorkshire"},33:{code:"SXE",name:"East Sussex"},34:{code:"EDIN",name:"Edinburgh"},35:{code:"ESX",name:"Essex"},36:{code:"FALK",name:"Falkirk"},37:{code:"FFE",name:"Fife"},38:{code:"FLINT",name:"Flintshire"},39:{code:"GLAS",name:"Glasgow"},40:{code:"GLOS",name:"Gloucestershire"},41:{code:"LDN",name:"Greater London"},42:{code:"MCH",name:"Greater Manchester"},43:{code:"GDD",name:"Gwynedd"},44:{code:"HANTS",name:"Hampshire"},45:{code:"HWR",name:"Herefordshire"},46:{code:"HERTS",name:"Hertfordshire"},47:{code:"HLD",name:"Highlands"},48:{code:"IVER",name:"Inverclyde"},49:{code:"IOW",name:"Isle of Wight"},50:{code:"KNT",name:"Kent"},51:{code:"LANCS",name:"Lancashire"},52:{code:"LEICS",name:"Leicestershire"},53:{code:"LINCS",name:"Lincolnshire"},54:{code:"MSY",name:"Merseyside"},55:{code:"MERT",name:"Merthyr Tydfil"},56:{code:"MLOT",name:"Midlothian"},57:{code:"MMOUTH",name:"Monmouthshire"},58:{code:"MORAY",name:"Moray"},59:{code:"NPRTAL",name:"Neath Port Talbot"},60:{code:"NEWPT",name:"Newport"},61:{code:"NOR",name:"Norfolk"},62:{code:"ARYN",name:"North Ayrshire"},63:{code:"LANN",name:"North Lanarkshire"},64:{code:"YSN",name:"North Yorkshire"},65:{code:"NHM",name:"Northamptonshire"},66:{code:"NLD",name:"Northumberland"},67:{code:"NOT",name:"Nottinghamshire"},68:{code:"ORK",name:"Orkney Islands"},69:{code:"OFE",name:"Oxfordshire"},70:{code:"PEM",name:"Pembrokeshire"},71:{code:"PERTH",name:"Perth and Kinross"},72:{code:"PWS",name:"Powys"},73:{code:"REN",name:"Renfrewshire"},74:{code:"RHON",name:"Rhondda Cynon Taff"},75:{code:"RUT",name:"Rutland"},76:{code:"BOR",name:"Scottish Borders"},77:{code:"SHET",name:"Shetland Islands"},78:{code:"SPE",name:"Shropshire"},79:{code:"SOM",name:"Somerset"},80:{code:"ARYS",name:"South Ayrshire"},81:{code:"LANS",name:"South Lanarkshire"},82:{code:"YSS",name:"South Yorkshire"},83:{code:"SFD",name:"Staffordshire"},84:{code:"STIR",name:"Stirling"},85:{code:"SFK",name:"Suffolk"},86:{code:"SRY",name:"Surrey"},87:{code:"SWAN",name:"Swansea"},88:{code:"TORF",name:"Torfaen"},89:{code:"TWR",name:"Tyne and Wear"},90:{code:"VGLAM",name:"Vale of Glamorgan"},91:{code:"WARKS",name:"Warwickshire"},92:{code:"WDUN",name:"West Dunbartonshire"},93:{code:"WLOT",name:"West Lothian"},94:{code:"WMD",name:"West Midlands"},95:{code:"SXW",name:"West Sussex"},96:{code:"YSW",name:"West Yorkshire"},97:{code:"WIL",name:"Western Isles"},98:{code:"WLT",name:"Wiltshire"},99:{code:"WORCS",name:"Worcestershire"},100:{code:"WRX",name:"Wrexham"}},US:{1:{code:"AL",name:"Alabama"},2:{code:"AK",name:"Alaska"},3:{code:"AS",name:"American Samoa"},4:{code:"AZ",name:"Arizona"},5:{code:"AR",name:"Arkansas"},6:{code:"AF",name:"Armed Forces Africa"},7:{code:"AA",name:"Armed Forces Americas"},8:{code:"AC",name:"Armed Forces Canada"},9:{code:"AE",name:"Armed Forces Europe"},10:{code:"AM",name:"Armed Forces Middle East"},11:{code:"AP",name:"Armed Forces Pacific"},12:{code:"CA",name:"California"},13:{code:"CO",name:"Colorado"},14:{code:"CT",name:"Connecticut"},15:{code:"DE",name:"Delaware"},16:{code:"DC",name:"District of Columbia"},17:{code:"FM",name:"Federated States Of Micronesia"},18:{code:"FL",name:"Florida"},19:{code:"GA",name:"Georgia"},20:{code:"GU",name:"Guam"},21:{code:"HI",name:"Hawaii"},22:{code:"ID",name:"Idaho"},23:{code:"IL",name:"Illinois"},24:{code:"IN",name:"Indiana"},25:{code:"IA",name:"Iowa"},26:{code:"KS",name:"Kansas"},27:{code:"KY",name:"Kentucky"},28:{code:"LA",name:"Louisiana"},29:{code:"ME",name:"Maine"},30:{code:"MH",name:"Marshall Islands"},31:{code:"MD",name:"Maryland"},32:{code:"MA",name:"Massachusetts"},33:{code:"MI",name:"Michigan"},34:{code:"MN",name:"Minnesota"},35:{code:"MS",name:"Mississippi"},36:{code:"MO",name:"Missouri"},37:{code:"MT",name:"Montana"},38:{code:"NE",name:"Nebraska"},39:{code:"NV",name:"Nevada"},40:{code:"NH",name:"New Hampshire"},41:{code:"NJ",name:"New Jersey"},42:{code:"NM",name:"New Mexico"},43:{code:"NY",name:"New York"},44:{code:"NC",name:"North Carolina"},45:{code:"ND",name:"North Dakota"},46:{code:"MP",name:"Northern Mariana Islands"},47:{code:"OH",name:"Ohio"},48:{code:"OK",name:"Oklahoma"},49:{code:"OR",name:"Oregon"},50:{code:"PW",name:"Palau"},51:{code:"PA",name:"Pennsylvania"},52:{code:"PR",name:"Puerto Rico"},53:{code:"RI",name:"Rhode Island"},54:{code:"SC",name:"South Carolina"},55:{code:"SD",name:"South Dakota"},56:{code:"TN",name:"Tennessee"},57:{code:"TX",name:"Texas"},58:{code:"UT",name:"Utah"},59:{code:"VT",name:"Vermont"},60:{code:"VI",name:"Virgin Islands"},61:{code:"VA",name:"Virginia"},62:{code:"WA",name:"Washington"},63:{code:"WV",name:"West Virginia"},64:{code:"WI",name:"Wisconsin"},65:{code:"WY",name:"Wyoming"}},UM:{1:{code:"BI",name:"Baker Island"},2:{code:"HI",name:"Howland Island"},3:{code:"JI",name:"Jarvis Island"},4:{code:"JA",name:"Johnston Atoll"},5:{code:"KR",name:"Kingman Reef"},6:{code:"MA",name:"Midway Atoll"},7:{code:"NI",name:"Navassa Island"},8:{code:"PA",name:"Palmyra Atoll"},9:{code:"WI",name:"Wake Island"}},UY:{1:{code:"AR",name:"Artigas"},2:{code:"CA",name:"Canelones"},3:{code:"CL",name:"Cerro Largo"},4:{code:"CO",name:"Colonia"},5:{code:"DU",name:"Durazno"},6:{code:"FS",name:"Flores"},7:{code:"FA",name:"Florida"},8:{code:"LA",name:"Lavalleja"},9:{code:"MA",name:"Maldonado"},10:{code:"MO",name:"Montevideo"},11:{code:"PA",name:"Paysandu"},12:{code:"RN",name:"Rio Negro"},13:{code:"RV",name:"Rivera"},14:{code:"RO",name:"Rocha"},15:{code:"SL",name:"Salto"},16:{code:"SJ",name:"San Jose"},17:{code:"SO",name:"Soriano"},18:{code:"TA",name:"Tacuarembo"},19:{code:"TT",name:"Treinta y Tres"}},UZ:{1:{code:"AN",name:"Andijon"},2:{code:"BU",name:"Buxoro"},3:{code:"FA",name:"Farg'ona"},4:{code:"JI",name:"Jizzax"},5:{code:"NG",name:"Namangan"},6:{code:"NW",name:"Navoiy"},7:{code:"QA",name:"Qashqadaryo"},8:{code:"QR",name:"Qoraqalpog'iston Republikasi"},9:{code:"SA",name:"Samarqand"},10:{code:"SI",name:"Sirdaryo"},11:{code:"SU",name:"Surxondaryo"},12:{code:"TK",name:"Toshkent City"},13:{code:"TO",name:"Toshkent Region"},14:{code:"XO",name:"Xorazm"}},VU:{1:{code:"MA",name:"Malampa"},2:{code:"PE",name:"Penama"},3:{code:"SA",name:"Sanma"},4:{code:"SH",name:"Shefa"},5:{code:"TA",name:"Tafea"},6:{code:"TO",name:"Torba"}},VE:{1:{code:"AM",name:"Amazonas"},2:{code:"AN",name:"Anzoategui"},3:{code:"AP",name:"Apure"},4:{code:"AR",name:"Aragua"},5:{code:"BA",name:"Barinas"},6:{code:"BO",name:"Bolivar"},7:{code:"CA",name:"Carabobo"},8:{code:"CO",name:"Cojedes"},9:{code:"DA",name:"Delta Amacuro"},10:{code:"DF",name:"Dependencias Federales"},11:{code:"DI",name:"Distrito Federal"},12:{code:"FA",name:"Falcon"},13:{code:"GU",name:"Guarico"},14:{code:"LA",name:"Lara"},15:{code:"ME",name:"Merida"},16:{code:"MI",name:"Miranda"},17:{code:"MO",name:"Monagas"},18:{code:"NE",name:"Nueva Esparta"},19:{code:"PO",name:"Portuguesa"},20:{code:"SU",name:"Sucre"},21:{code:"TA",name:"Tachira"},22:{code:"TR",name:"Trujillo"},23:{code:"VA",name:"Vargas"},24:{code:"YA",name:"Yaracuy"},25:{code:"ZU",name:"Zulia"}},VN:{1:{code:"AG",name:"An Giang"},2:{code:"BG",name:"Bac Giang"},3:{code:"BK",name:"Bac Kan"},4:{code:"BL",name:"Bac Lieu"},5:{code:"BC",name:"Bac Ninh"},6:{code:"BR",name:"Ba Ria-Vung Tau"},7:{code:"BN",name:"Ben Tre"},8:{code:"BH",name:"Binh Dinh"},9:{code:"BU",name:"Binh Duong"},10:{code:"BP",name:"Binh Phuoc"},11:{code:"BT",name:"Binh Thuan"},12:{code:"CM",name:"Ca Mau"},13:{code:"CT",name:"Can Tho"},14:{code:"CB",name:"Cao Bang"},15:{code:"DL",name:"Dak Lak"},16:{code:"DG",name:"Dak Nong"},17:{code:"DN",name:"Da Nang"},18:{code:"DB",name:"Dien Bien"},19:{code:"DI",name:"Dong Nai"},20:{code:"DT",name:"Dong Thap"},21:{code:"GL",name:"Gia Lai"},22:{code:"HG",name:"Ha Giang"},23:{code:"HD",name:"Hai Duong"},24:{code:"HP",name:"Hai Phong"},25:{code:"HM",name:"Ha Nam"},26:{code:"HI",name:"Ha Noi"},27:{code:"HT",name:"Ha Tay"},28:{code:"HH",name:"Ha Tinh"},29:{code:"HB",name:"Hoa Binh"},30:{code:"HC",name:"Ho Chin Minh"},31:{code:"HU",name:"Hau Giang"},32:{code:"HY",name:"Hung Yen"}},VI:{1:{code:"C",name:"Saint Croix"},2:{code:"J",name:"Saint John"},3:{code:"T",name:"Saint Thomas"}},WF:{1:{code:"A",name:"Alo"},2:{code:"S",name:"Sigave"},3:{code:"W",name:"Wallis"}},YE:{1:{code:"AB",name:"Abyan"},2:{code:"AD",name:"Adan"},3:{code:"AM",name:"Amran"},4:{code:"BA",name:"Al Bayda"},5:{code:"DA",name:"Ad Dali"},6:{code:"DH",name:"Dhamar"},7:{code:"HD",name:"Hadramawt"},8:{code:"HJ",name:"Hajjah"},9:{code:"HU",name:"Al Hudaydah"},10:{code:"IB",name:"Ibb"},11:{code:"JA",name:"Al Jawf"},12:{code:"LA",name:"Lahij"},13:{code:"MA",name:"Ma'rib"},14:{code:"MR",name:"Al Mahrah"},15:{code:"MW",name:"Al Mahwit"},16:{code:"SD",name:"Sa'dah"},17:{code:"SN",name:"San'a"},18:{code:"SH",name:"Shabwah"},19:{code:"TA",name:"Ta'izz"}},YU:{1:{code:"KOS",name:"Kosovo"},2:{code:"MON",name:"Montenegro"},3:{code:"SER",name:"Serbia"},4:{code:"VOJ",name:"Vojvodina"}},ZR:{1:{code:"BC",name:"Bas-Congo"},2:{code:"BN",name:"Bandundu"},3:{code:"EQ",name:"Equateur"},4:{code:"KA",name:"Katanga"},5:{code:"KE",name:"Kasai-Oriental"},6:{code:"KN",name:"Kinshasa"},7:{code:"KW",name:"Kasai-Occidental"},8:{code:"MA",name:"Maniema"},9:{code:"NK",name:"Nord-Kivu"},10:{code:"OR",name:"Orientale"},11:{code:"SK",name:"Sud-Kivu"}},ZM:{1:{code:"CE",name:"Central"},2:{code:"CB",name:"Copperbelt"},3:{code:"EA",name:"Eastern"},4:{code:"LP",name:"Luapula"},5:{code:"LK",name:"Lusaka"},6:{code:"NO",name:"Northern"},7:{code:"NW",name:"North-Western"},8:{code:"SO",name:"Southern"},9:{code:"WE",name:"Western"}},ZW:{1:{code:"BU",name:"Bulawayo"},2:{code:"HA",name:"Harare"},3:{code:"ML",name:"Manicaland"},4:{code:"MC",name:"Mashonaland Central"},5:{code:"ME",name:"Mashonaland East"},6:{code:"MW",name:"Mashonaland West"},7:{code:"MV",name:"Masvingo"},8:{code:"MN",name:"Matabeleland North"},9:{code:"MS",name:"Matabeleland South"},10:{code:"MD",name:"Midlands"}}},BFHTimePickerDelimiter=":",BFHTimePickerModes={am:"AM",pm:"PM"},BFHTimezonesList={AF:{"Asia/Kabul":"Kabul"},AL:{"Europe/Tirane":"Tirane"},DZ:{"Africa/Algiers":"Algiers"},AS:{"Pacific/Pago_Pago":"Pago Pago"},AD:{"Europe/Andorra":"Andorra"},AO:{"Africa/Luanda":"Luanda"},AI:{"America/Anguilla":"Anguilla"},AQ:{"Antarctica/Casey":"Casey","Antarctica/Davis":"Davis","Antarctica/DumontDUrville":"DumontDUrville","Antarctica/Macquarie":"Macquarie","Antarctica/Mawson":"Mawson","Antarctica/McMurdo":"McMurdo","Antarctica/Palmer":"Palmer","Antarctica/Rothera":"Rothera","Antarctica/South_Pole":"South Pole","Antarctica/Syowa":"Syowa","Antarctica/Vostok":"Vostok"},AG:{"America/Antigua":"Antigua"},AR:{"America/Argentina/Buenos_Aires":"Argentina / Buenos Aires","America/Argentina/Catamarca":"Argentina / Catamarca","America/Argentina/Cordoba":"Argentina / Cordoba","America/Argentina/Jujuy":"Argentina / Jujuy","America/Argentina/La_Rioja":"Argentina / La Rioja","America/Argentina/Mendoza":"Argentina / Mendoza","America/Argentina/Rio_Gallegos":"Argentina / Rio Gallegos","America/Argentina/Salta":"Argentina / Salta","America/Argentina/San_Juan":"Argentina / San Juan","America/Argentina/San_Luis":"Argentina / San Luis","America/Argentina/Tucuman":"Argentina / Tucuman","America/Argentina/Ushuaia":"Argentina / Ushuaia"},AM:{"Asia/Yerevan":"Yerevan"},AW:{"America/Aruba":"Aruba"},AU:{"Australia/Adelaide":"Adelaide","Australia/Brisbane":"Brisbane","Australia/Broken_Hill":"Broken Hill","Australia/Currie":"Currie","Australia/Darwin":"Darwin","Australia/Eucla":"Eucla","Australia/Hobart":"Hobart","Australia/Lindeman":"Lindeman","Australia/Lord_Howe":"Lord Howe","Australia/Melbourne":"Melbourne","Australia/Perth":"Perth","Australia/Sydney":"Sydney"},AT:{"Europe/Vienna":"Vienna"},AZ:{"Asia/Baku":"Baku"},BH:{"Asia/Bahrain":"Bahrain"},BD:{"Asia/Dhaka":"Dhaka"},BB:{"America/Barbados":"Barbados"},BY:{"Europe/Minsk":"Minsk"},BE:{"Europe/Brussels":"Brussels"},BZ:{"America/Belize":"Belize"},BJ:{"Africa/Porto-Novo":"Porto-Novo"},BM:{"Atlantic/Bermuda":"Bermuda"},BT:{"Asia/Thimphu":"Thimphu"},BO:{"America/La_Paz":"La Paz"},BA:{"Europe/Sarajevo":"Sarajevo"},BW:{"Africa/Gaborone":"Gaborone"},BR:{"America/Araguaina":"Araguaina","America/Bahia":"Bahia","America/Belem":"Belem","America/Boa_Vista":"Boa Vista","America/Campo_Grande":"Campo Grande","America/Cuiaba":"Cuiaba","America/Eirunepe":"Eirunepe","America/Fortaleza":"Fortaleza","America/Maceio":"Maceio","America/Manaus":"Manaus","America/Noronha":"Noronha","America/Porto_Velho":"Porto Velho","America/Recife":"Recife","America/Rio_Branco":"Rio Branco","America/Santarem":"Santarem","America/Sao_Paulo":"Sao Paulo"},VG:{"America/Tortola":"Tortola"},BN:{"Asia/Brunei":"Brunei"},BG:{"Europe/Sofia":"Sofia"},BF:{"Africa/Ouagadougou":"Ouagadougou"},BI:{"Africa/Bujumbura":"Bujumbura"},CI:{"Africa/Abidjan":"Abidjan"},KH:{"Asia/Phnom_Penh":"Phnom Penh"},CM:{"Africa/Douala":"Douala"},CA:{"America/Atikokan":"Atikokan","America/Blanc-Sablon":"Blanc-Sablon","America/Cambridge_Bay":"Cambridge Bay","America/Creston":"Creston","America/Dawson":"Dawson","America/Dawson_Creek":"Dawson Creek","America/Edmonton":"Edmonton","America/Glace_Bay":"Glace Bay","America/Goose_Bay":"Goose Bay","America/Halifax":"Halifax","America/Inuvik":"Inuvik","America/Iqaluit":"Iqaluit","America/Moncton":"Moncton","America/Montreal":"Montreal","America/Nipigon":"Nipigon","America/Pangnirtung":"Pangnirtung","America/Rainy_River":"Rainy River","America/Rankin_Inlet":"Rankin Inlet","America/Regina":"Regina","America/Resolute":"Resolute","America/St_Johns":"St Johns","America/Swift_Current":"Swift Current","America/Thunder_Bay":"Thunder Bay","America/Toronto":"Toronto","America/Vancouver":"Vancouver","America/Whitehorse":"Whitehorse","America/Winnipeg":"Winnipeg","America/Yellowknife":"Yellowknife"},CV:{"Atlantic/Cape_Verde":"Cape Verde"},KY:{"America/Cayman":"Cayman"},CF:{"Africa/Bangui":"Bangui"},TD:{"Africa/Ndjamena":"Ndjamena"},CL:{"America/Santiago":"Santiago","Pacific/Easter":"Easter"},CN:{"Asia/Chongqing":"Chongqing","Asia/Harbin":"Harbin","Asia/Kashgar":"Kashgar","Asia/Shanghai":"Shanghai","Asia/Urumqi":"Urumqi"},CO:{"America/Bogota":"Bogota"},KM:{"Indian/Comoro":"Comoro"},CG:{"Africa/Brazzaville":"Brazzaville"},CR:{"America/Costa_Rica":"Costa Rica"},HR:{"Europe/Zagreb":"Zagreb"},CU:{"America/Havana":"Havana"},CY:{"Asia/Nicosia":"Nicosia"},CZ:{"Europe/Prague":"Prague"},CD:{"Africa/Kinshasa":"Kinshasa","Africa/Lubumbashi":"Lubumbashi"},DK:{"Europe/Copenhagen":"Copenhagen"},DJ:{"Africa/Djibouti":"Djibouti"},DM:{"America/Dominica":"Dominica"},DO:{"America/Santo_Domingo":"Santo Domingo"},TP:{},EC:{"America/Guayaquil":"Guayaquil","Pacific/Galapagos":"Galapagos"},EG:{"Africa/Cairo":"Cairo"},SV:{"America/El_Salvador":"El Salvador"},GQ:{"Africa/Malabo":"Malabo"},ER:{"Africa/Asmara":"Asmara"},EE:{"Europe/Tallinn":"Tallinn"},ET:{"Africa/Addis_Ababa":"Addis Ababa"},FO:{"Atlantic/Faroe":"Faroe"},FK:{"Atlantic/Stanley":"Stanley"},FJ:{"Pacific/Fiji":"Fiji"},FI:{"Europe/Helsinki":"Helsinki"},MK:{"Europe/Skopje":"Skopje"},FR:{"Europe/Paris":"Paris"},GA:{"Africa/Libreville":"Libreville"},GE:{"Asia/Tbilisi":"Tbilisi"},DE:{"Europe/Berlin":"Berlin"},GH:{"Africa/Accra":"Accra"},GR:{"Europe/Athens":"Athens"},GL:{"America/Danmarkshavn":"Danmarkshavn","America/Godthab":"Godthab","America/Scoresbysund":"Scoresbysund","America/Thule":"Thule"},GD:{"America/Grenada":"Grenada"},GU:{"Pacific/Guam":"Guam"},GT:{"America/Guatemala":"Guatemala"},GN:{"Africa/Conakry":"Conakry"},GW:{"Africa/Bissau":"Bissau"},GY:{"America/Guyana":"Guyana"},HT:{"America/Port-au-Prince":"Port-au-Prince"},HN:{"America/Tegucigalpa":"Tegucigalpa"},HK:{"Asia/Hong_Kong":"Hong Kong"},HU:{"Europe/Budapest":"Budapest"},IS:{"Atlantic/Reykjavik":"Reykjavik"},IN:{"Asia/Kolkata":"Kolkata"},ID:{"Asia/Jakarta":"Jakarta","Asia/Jayapura":"Jayapura","Asia/Makassar":"Makassar","Asia/Pontianak":"Pontianak"},IR:{"Asia/Tehran":"Tehran"},IQ:{"Asia/Baghdad":"Baghdad"},IE:{"Europe/Dublin":"Dublin"},IL:{"Asia/Jerusalem":"Jerusalem"},IT:{"Europe/Rome":"Rome"},JM:{"America/Jamaica":"Jamaica"},JP:{"Asia/Tokyo":"Tokyo"},JO:{"Asia/Amman":"Amman"},KZ:{"Asia/Almaty":"Almaty","Asia/Aqtau":"Aqtau","Asia/Aqtobe":"Aqtobe","Asia/Oral":"Oral","Asia/Qyzylorda":"Qyzylorda"},KE:{"Africa/Nairobi":"Nairobi"},KI:{"Pacific/Enderbury":"Enderbury","Pacific/Kiritimati":"Kiritimati","Pacific/Tarawa":"Tarawa"},KW:{"Asia/Kuwait":"Kuwait"},KG:{"Asia/Bishkek":"Bishkek"},LA:{"Asia/Vientiane":"Vientiane"},LV:{"Europe/Riga":"Riga"},LB:{"Asia/Beirut":"Beirut"},LS:{"Africa/Maseru":"Maseru"},LR:{"Africa/Monrovia":"Monrovia"},LY:{"Africa/Tripoli":"Tripoli"},LI:{"Europe/Vaduz":"Vaduz"},LT:{"Europe/Vilnius":"Vilnius"},LU:{"Europe/Luxembourg":"Luxembourg"},MO:{"Asia/Macau":"Macau"},MG:{"Indian/Antananarivo":"Antananarivo"},MW:{"Africa/Blantyre":"Blantyre"},MY:{"Asia/Kuala_Lumpur":"Kuala Lumpur","Asia/Kuching":"Kuching"},MV:{"Indian/Maldives":"Maldives"},ML:{"Africa/Bamako":"Bamako"},MT:{"Europe/Malta":"Malta"},MH:{"Pacific/Kwajalein":"Kwajalein","Pacific/Majuro":"Majuro"},MR:{"Africa/Nouakchott":"Nouakchott"},MU:{"Indian/Mauritius":"Mauritius"},MX:{"America/Bahia_Banderas":"Bahia Banderas","America/Cancun":"Cancun","America/Chihuahua":"Chihuahua","America/Hermosillo":"Hermosillo","America/Matamoros":"Matamoros","America/Mazatlan":"Mazatlan","America/Merida":"Merida","America/Mexico_City":"Mexico City","America/Monterrey":"Monterrey","America/Ojinaga":"Ojinaga","America/Santa_Isabel":"Santa Isabel","America/Tijuana":"Tijuana"},FM:{"Pacific/Chuuk":"Chuuk","Pacific/Kosrae":"Kosrae","Pacific/Pohnpei":"Pohnpei"},MD:{"Europe/Chisinau":"Chisinau"},MC:{"Europe/Monaco":"Monaco"},MN:{"Asia/Choibalsan":"Choibalsan","Asia/Hovd":"Hovd","Asia/Ulaanbaatar":"Ulaanbaatar"},ME:{"Europe/Podgorica":"Podgorica"},MS:{"America/Montserrat":"Montserrat"},MA:{"Africa/Casablanca":"Casablanca"},MZ:{"Africa/Maputo":"Maputo"},MM:{"Asia/Rangoon":"Rangoon"},NA:{"Africa/Windhoek":"Windhoek"},NR:{"Pacific/Nauru":"Nauru"},NP:{"Asia/Kathmandu":"Kathmandu"},NL:{"Europe/Amsterdam":"Amsterdam"},AN:{},NZ:{"Pacific/Auckland":"Auckland","Pacific/Chatham":"Chatham"},NI:{"America/Managua":"Managua"},NE:{"Africa/Niamey":"Niamey"},NG:{"Africa/Lagos":"Lagos"},NF:{"Pacific/Norfolk":"Norfolk"},KP:{"Asia/Pyongyang":"Pyongyang"},MP:{"Pacific/Saipan":"Saipan"},NO:{"Europe/Oslo":"Oslo"},OM:{"Asia/Muscat":"Muscat"},PK:{"Asia/Karachi":"Karachi"},PW:{"Pacific/Palau":"Palau"},PA:{"America/Panama":"Panama"},PG:{"Pacific/Port_Moresby":"Port Moresby"},PY:{"America/Asuncion":"Asuncion"},PE:{"America/Lima":"Lima"},PH:{"Asia/Manila":"Manila"},PN:{"Pacific/Pitcairn":"Pitcairn"},PL:{"Europe/Warsaw":"Warsaw"},PT:{"Atlantic/Azores":"Azores","Atlantic/Madeira":"Madeira","Europe/Lisbon":"Lisbon"},PR:{"America/Puerto_Rico":"Puerto Rico"},QA:{"Asia/Qatar":"Qatar"},RO:{"Europe/Bucharest":"Bucharest"},RU:{"Asia/Anadyr":"Anadyr","Asia/Irkutsk":"Irkutsk","Asia/Kamchatka":"Kamchatka","Asia/Krasnoyarsk":"Krasnoyarsk","Asia/Magadan":"Magadan","Asia/Novokuznetsk":"Novokuznetsk","Asia/Novosibirsk":"Novosibirsk","Asia/Omsk":"Omsk","Asia/Sakhalin":"Sakhalin","Asia/Vladivostok":"Vladivostok","Asia/Yakutsk":"Yakutsk","Asia/Yekaterinburg":"Yekaterinburg","Europe/Kaliningrad":"Kaliningrad","Europe/Moscow":"Moscow","Europe/Samara":"Samara","Europe/Volgograd":"Volgograd"},RW:{"Africa/Kigali":"Kigali"},ST:{"Africa/Sao_Tome":"Sao Tome"},SH:{"Atlantic/St_Helena":"St Helena"},KN:{"America/St_Kitts":"St Kitts"},LC:{"America/St_Lucia":"St Lucia"},VC:{"America/St_Vincent":"St Vincent"},WS:{"Pacific/Apia":"Apia"},SM:{"Europe/San_Marino":"San Marino"},SA:{"Asia/Riyadh":"Riyadh"},SN:{"Africa/Dakar":"Dakar"},RS:{"Europe/Belgrade":"Belgrade"},SC:{"Indian/Mahe":"Mahe"},SL:{"Africa/Freetown":"Freetown"},SG:{"Asia/Singapore":"Singapore"},SK:{"Europe/Bratislava":"Bratislava"},SI:{"Europe/Ljubljana":"Ljubljana"},SB:{"Pacific/Guadalcanal":"Guadalcanal"},SO:{"Africa/Mogadishu":"Mogadishu"},ZA:{"Africa/Johannesburg":"Johannesburg"},GS:{"Atlantic/South_Georgia":"South Georgia"},KR:{"Asia/Seoul":"Seoul"},ES:{"Africa/Ceuta":"Ceuta","Atlantic/Canary":"Canary","Europe/Madrid":"Madrid"},LK:{"Asia/Colombo":"Colombo"},SD:{"Africa/Khartoum":"Khartoum"},SR:{"America/Paramaribo":"Paramaribo"},SZ:{"Africa/Mbabane":"Mbabane"},SE:{"Europe/Stockholm":"Stockholm"},CH:{"Europe/Zurich":"Zurich"},SY:{"Asia/Damascus":"Damascus"},TW:{"Asia/Taipei":"Taipei"},TJ:{"Asia/Dushanbe":"Dushanbe"},TZ:{"Africa/Dar_es_Salaam":"Dar es Salaam"},TH:{"Asia/Bangkok":"Bangkok"},BS:{"America/Nassau":"Nassau"},GM:{"Africa/Banjul":"Banjul"},TG:{"Africa/Lome":"Lome"},TO:{"Pacific/Tongatapu":"Tongatapu"},TT:{"America/Port_of_Spain":"Port of Spain"},TN:{"Africa/Tunis":"Tunis"},TR:{"Europe/Istanbul":"Istanbul"},TM:{"Asia/Ashgabat":"Ashgabat"},TC:{"America/Grand_Turk":"Grand Turk"},TV:{"Pacific/Funafuti":"Funafuti"},VI:{"America/St_Thomas":"St Thomas"},UG:{"Africa/Kampala":"Kampala"},UA:{"Europe/Kiev":"Kiev","Europe/Simferopol":"Simferopol","Europe/Uzhgorod":"Uzhgorod","Europe/Zaporozhye":"Zaporozhye"},AE:{"Asia/Dubai":"Dubai"},GB:{"Europe/London":"London"},US:{"America/Adak":"Adak","America/Anchorage":"Anchorage","America/Boise":"Boise","America/Chicago":"Chicago","America/Denver":"Denver","America/Detroit":"Detroit","America/Indiana/Indianapolis":"Indiana / Indianapolis","America/Indiana/Knox":"Indiana / Knox","America/Indiana/Marengo":"Indiana / Marengo","America/Indiana/Petersburg":"Indiana / Petersburg","America/Indiana/Tell_City":"Indiana / Tell City","America/Indiana/Vevay":"Indiana / Vevay","America/Indiana/Vincennes":"Indiana / Vincennes","America/Indiana/Winamac":"Indiana / Winamac","America/Juneau":"Juneau","America/Kentucky/Louisville":"Kentucky / Louisville","America/Kentucky/Monticello":"Kentucky / Monticello","America/Los_Angeles":"Los Angeles","America/Menominee":"Menominee","America/Metlakatla":"Metlakatla","America/New_York":"New York","America/Nome":"Nome","America/North_Dakota/Beulah":"North Dakota / Beulah","America/North_Dakota/Center":"North Dakota / Center","America/North_Dakota/New_Salem":"North Dakota / New Salem","America/Phoenix":"Phoenix","America/Shiprock":"Shiprock","America/Sitka":"Sitka","America/Yakutat":"Yakutat","Pacific/Honolulu":"Honolulu"},UY:{"America/Montevideo":"Montevideo"},UZ:{"Asia/Samarkand":"Samarkand","Asia/Tashkent":"Tashkent"},VU:{"Pacific/Efate":"Efate"},VA:{"Europe/Vatican":"Vatican"},VE:{"America/Caracas":"Caracas"},VN:{"Asia/Ho_Chi_Minh":"Ho Chi Minh"},EH:{"Africa/El_Aaiun":"El Aaiun"},YE:{"Asia/Aden":"Aden"},ZM:{"Africa/Lusaka":"Lusaka"},ZW:{"Africa/Harare":"Harare"}};
+function(a){"use strict";function b(a){var b=a.toString(16);return 1===b.length?"0"+b:b}function c(a,c,d){return"#"+b(a)+b(c)+b(d)}function d(){var b;a(f).each(function(c){return b=e(a(this)),b.hasClass("open")?(b.trigger(c=a.Event("hide.bfhcolorpicker")),c.isDefaultPrevented()?!0:(b.removeClass("open").trigger("hidden.bfhcolorpicker"),void 0)):!0})}function e(a){return a.closest(".bfh-colorpicker")}var f="[data-toggle=bfh-colorpicker]",g=function(b,c){this.options=a.extend({},a.fn.bfhcolorpicker.defaults,c),this.$element=a(b),this.initPopover()};g.prototype={constructor:g,initPalette:function(){var a,b,c;a=this.$element.find("canvas"),b=a[0].getContext("2d"),c=b.createLinearGradient(0,0,a.width(),0),c.addColorStop(0,"rgb(255, 255, 255)"),c.addColorStop(.1,"rgb(255,   0,   0)"),c.addColorStop(.25,"rgb(255,   0, 255)"),c.addColorStop(.4,"rgb(0,     0, 255)"),c.addColorStop(.55,"rgb(0,   255, 255)"),c.addColorStop(.7,"rgb(0,   255,   0)"),c.addColorStop(.85,"rgb(255, 255,   0)"),c.addColorStop(1,"rgb(255,   0,   0)"),b.fillStyle=c,b.fillRect(0,0,b.canvas.width,b.canvas.height),c=b.createLinearGradient(0,0,0,a.height()),c.addColorStop(0,"rgba(255, 255, 255, 1)"),c.addColorStop(.5,"rgba(255, 255, 255, 0)"),c.addColorStop(.5,"rgba(0,     0,   0, 0)"),c.addColorStop(1,"rgba(0,     0,   0, 1)"),b.fillStyle=c,b.fillRect(0,0,b.canvas.width,b.canvas.height)},initPopover:function(){var a,b;a="",b="","right"===this.options.align?b='<span class="input-group-addon"><span class="bfh-colorpicker-icon"></span></span>':a='<span class="input-group-addon"><span class="bfh-colorpicker-icon"></span></span>',this.$element.html('<div class="input-group bfh-colorpicker-toggle" data-toggle="bfh-colorpicker">'+a+'<input type="text" name="'+this.options.name+'" class="'+this.options.input+'" placeholder="'+this.options.placeholder+'" readonly>'+b+"</div>"+'<div class="bfh-colorpicker-popover">'+'<canvas class="bfh-colorpicker-palette" width="384" height="256"></canvas>'+"</div>"),this.$element.on("click.bfhcolorpicker.data-api touchstart.bfhcolorpicker.data-api",f,g.prototype.toggle).on("mousedown.bfhcolorpicker.data-api","canvas",g.prototype.mouseDown).on("click.bfhcolorpicker.data-api touchstart.bfhcolorpicker.data-api",".bfh-colorpicker-popover",function(){return!1}),this.initPalette(),this.$element.val(this.options.color)},updateVal:function(a,b){var d,e,f,g,h,i,j;h=5,d=this.$element.find("canvas"),e=d[0].getContext("2d"),f=a-d.offset().left,g=b-d.offset().top,f=Math.round(f/h)*h,g=Math.round(g/h)*h,0>f&&(f=0),f>=d.width()&&(f=d.width()-1),0>g&&(g=0),g>d.height()&&(g=d.height()),i=e.getImageData(f,g,1,1),j=c(i.data[0],i.data[1],i.data[2]),j!==this.$element.val()&&(this.$element.val(j),this.$element.trigger("change.bfhcolorpicker"))},mouseDown:function(){var b,c;b=a(this),c=e(b),a(document).on("mousemove.bfhcolorpicker.data-api",{colorpicker:c},g.prototype.mouseMove).one("mouseup.bfhcolorpicker.data-api",{colorpicker:c},g.prototype.mouseUp)},mouseMove:function(a){var b;b=a.data.colorpicker,b.data("bfhcolorpicker").updateVal(a.pageX,a.pageY)},mouseUp:function(b){var c;c=b.data.colorpicker,c.data("bfhcolorpicker").updateVal(b.pageX,b.pageY),a(document).off("mousemove.bfhcolorpicker.data-api"),c.data("bfhcolorpicker").options.close===!0&&d()},toggle:function(b){var c,f,g;if(c=a(this),f=e(c),f.is(".disabled")||void 0!==f.attr("disabled"))return!0;if(g=f.hasClass("open"),d(),!g){if(f.trigger(b=a.Event("show.bfhcolorpicker")),b.isDefaultPrevented())return!0;f.toggleClass("open").trigger("shown.bfhcolorpicker"),c.focus()}return!1}};var h=a.fn.bfhcolorpicker;a.fn.bfhcolorpicker=function(b){return this.each(function(){var c,d,e;c=a(this),d=c.data("bfhcolorpicker"),e="object"==typeof b&&b,this.type="bfhcolorpicker",d||c.data("bfhcolorpicker",d=new g(this,e)),"string"==typeof b&&d[b].call(c)})},a.fn.bfhcolorpicker.Constructor=g,a.fn.bfhcolorpicker.defaults={align:"left",input:"form-control",placeholder:"",name:"",color:"#000000",close:!0},a.fn.bfhcolorpicker.noConflict=function(){return a.fn.bfhcolorpicker=h,this};var i;a.valHooks.div&&(i=a.valHooks.div),a.valHooks.div={get:function(b){return a(b).hasClass("bfh-colorpicker")?a(b).find('input[type="text"]').val():i?i.get(b):void 0},set:function(b,c){if(a(b).hasClass("bfh-colorpicker"))a(b).find(".bfh-colorpicker-icon").css("background-color",c),a(b).find('input[type="text"]').val(c);else if(i)return i.set(b,c)}},a(document).ready(function(){a("div.bfh-colorpicker").each(function(){var b;b=a(this),b.bfhcolorpicker(b.data())})}),a(document).on("click.bfhcolorpicker.data-api",d)}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhcountries.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addCountries(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapCountries(),this.$element.is("span")&&this.displayCountry()};b.prototype={constructor:b,getCountries:function(){var b,c;if(this.options.available){if("string"==typeof this.options.available){c=[],this.options.available=this.options.available.split(",");for(b in BFHCountriesList)BFHCountriesList.hasOwnProperty(b)&&a.inArray(b,this.options.available)>=0&&(c[b]=BFHCountriesList[b])}else c=this.options.available;return c}return BFHCountriesList},addCountries:function(){var a,b,c;a=this.options.country,c=this.getCountries(),this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(b in c)c.hasOwnProperty(b)&&this.$element.append('<option value="'+b+'">'+c[b]+"</option>");this.$element.val(a)},addBootstrapCountries:function(){var a,b,c,d,e,f;d=this.options.country,a=this.$element.find('input[type="hidden"]'),b=this.$element.find(".bfh-selectbox-option"),c=this.$element.find("[role=option]"),f=this.getCountries(),c.html(""),this.options.blank===!0&&c.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(e in f)f.hasOwnProperty(e)&&(this.options.flags===!0?c.append('<li><a tabindex="-1" href="#" data-option="'+e+'"><i class="glyphicon bfh-flag-'+e+'"></i>'+f[e]+"</a></li>"):c.append('<li><a tabindex="-1" href="#" data-option="'+e+'">'+f[e]+"</a></li>"));this.$element.val(d)},displayCountry:function(){var a;a=this.options.country,this.options.flags===!0?this.$element.html('<i class="glyphicon bfh-flag-'+a+'"></i> '+BFHCountriesList[a]):this.$element.html(BFHCountriesList[a])}};var c=a.fn.bfhcountries;a.fn.bfhcountries=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhcountries"),f="object"==typeof c&&c,e||d.data("bfhcountries",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhcountries.Constructor=b,a.fn.bfhcountries.defaults={country:"",available:"",flags:!1,blank:!0},a.fn.bfhcountries.noConflict=function(){return a.fn.bfhcountries=c,this},a(document).ready(function(){a("form select.bfh-countries, span.bfh-countries, div.bfh-countries").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhcountries(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhcurrencies.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addCurrencies(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapCurrencies(),this.$element.is("span")&&this.displayCurrency()};b.prototype={constructor:b,getCurrencies:function(){var b,c;if(this.options.available){c=[],this.options.available=this.options.available.split(",");for(b in BFHCurrenciesList)BFHCurrenciesList.hasOwnProperty(b)&&a.inArray(b,this.options.available)>=0&&(c[b]=BFHCurrenciesList[b]);return c}return BFHCurrenciesList},addCurrencies:function(){var a,b,c;a=this.options.currency,c=this.getCurrencies(),this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(b in c)c.hasOwnProperty(b)&&this.$element.append('<option value="'+b+'">'+c[b].label+"</option>");this.$element.val(a)},addBootstrapCurrencies:function(){var a,b,c,d,e,f,g;d=this.options.currency,a=this.$element.find('input[type="hidden"]'),b=this.$element.find(".bfh-selectbox-option"),c=this.$element.find("[role=option]"),f=this.getCurrencies(),c.html(""),this.options.blank===!0&&c.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(e in f)f.hasOwnProperty(e)&&(this.options.flags===!0?(g=f[e].currencyflag?f[e].currencyflag:e.substr(0,2),c.append('<li><a tabindex="-1" href="#" data-option="'+e+'"><i class="glyphicon bfh-flag-'+g+'"></i>'+f[e].label+"</a></li>")):c.append('<li><a tabindex="-1" href="#" data-option="'+e+'">'+f[e].label+"</a></li>"));this.$element.val(d)},displayCurrency:function(){var a,b;a=this.options.currency,this.options.flags===!0?(b=BFHCurrenciesList[a].currencyflag?BFHCurrenciesList[a].currencyflag:a.substr(0,2),this.$element.html('<i class="glyphicon bfh-flag-'+b+'"></i> '+BFHCurrenciesList[a].label)):this.$element.html(BFHCurrenciesList[a].label)}};var c=a.fn.bfhcurrencies;a.fn.bfhcurrencies=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhcurrencies"),f="object"==typeof c&&c,e||d.data("bfhcurrencies",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhcurrencies.Constructor=b,a.fn.bfhcurrencies.defaults={currency:"",available:"",flags:!1,blank:!0},a.fn.bfhcurrencies.noConflict=function(){return a.fn.bfhcurrencies=c,this},a(document).ready(function(){a("form select.bfh-currencies, span.bfh-currencies, div.bfh-currencies").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhcurrencies(b.data())})})}(window.jQuery),+function(a){"use strict";function b(a,b){return new Date(b,a,0).getDate()}function c(a,b,c){return new Date(b,a,c).getDay()}function d(a,b,c,d){return b+=1,b=String(b),d=String(d),1===b.length&&(b="0"+b),1===d.length&&(d="0"+d),a.replace("m",b).replace("y",c).replace("d",d)}function e(a,b,c){var d,e,f;d=[{part:"m",position:a.indexOf("m")},{part:"y",position:a.indexOf("y")},{part:"d",position:a.indexOf("d")}],d.sort(function(a,b){return a.position-b.position}),f=b.match(/(\d+)/g);for(e in d)if(d.hasOwnProperty(e)&&d[e].part===c)return Number(f[e]).toString()}function f(){var b;a(h).each(function(c){return b=g(a(this)),b.hasClass("open")?(b.trigger(c=a.Event("hide.bfhdatepicker")),c.isDefaultPrevented()?!0:(b.removeClass("open").trigger("hidden.bfhdatepicker"),void 0)):!0})}function g(a){return a.closest(".bfh-datepicker")}var h="[data-toggle=bfh-datepicker]",i=function(b,c){this.options=a.extend({},a.fn.bfhdatepicker.defaults,c),this.$element=a(b),this.initCalendar()};i.prototype={constructor:i,setDate:function(){var a,b,c;a=this.options.date,c=this.options.format,""===a||"today"===a||void 0===a?(b=new Date,"today"===a&&this.$element.val(d(c,b.getMonth(),b.getFullYear(),b.getDate())),this.$element.data("month",b.getMonth()),this.$element.data("year",b.getFullYear())):(this.$element.val(a),this.$element.data("month",Number(e(c,a,"m")-1)),this.$element.data("year",Number(e(c,a,"y"))))},setDateLimit:function(a,b){var c,d;d=this.options.format,""!==a?(this.$element.data(b+"limit",!0),"today"===a?(c=new Date,this.$element.data(b+"day",c.getDate()),this.$element.data(b+"month",c.getMonth()),this.$element.data(b+"year",c.getFullYear())):(this.$element.data(b+"day",Number(e(d,a,"d"))),this.$element.data(b+"month",Number(e(d,a,"m")-1)),this.$element.data(b+"year",Number(e(d,a,"y"))))):this.$element.data(b+"limit",!1)},initCalendar:function(){var a,b,c;a="",b="",c="",""!==this.options.icon&&("right"===this.options.align?b='<span class="input-group-addon"><i class="'+this.options.icon+'"></i></span>':a='<span class="input-group-addon"><i class="'+this.options.icon+'"></i></span>',c="input-group"),this.$element.html('<div class="'+c+' bfh-datepicker-toggle" data-toggle="bfh-datepicker">'+a+'<input type="text" name="'+this.options.name+'" class="'+this.options.input+'" placeholder="'+this.options.placeholder+'" readonly>'+b+"</div>"+'<div class="bfh-datepicker-calendar">'+'<table class="calendar table table-bordered">'+"<thead>"+'<tr class="months-header">'+'<th class="month" colspan="4">'+'<a class="previous" href="#"><i class="glyphicon glyphicon-chevron-left"></i></a>'+"<span></span>"+'<a class="next" href="#"><i class="glyphicon glyphicon-chevron-right"></i></a>'+"</th>"+'<th class="year" colspan="3">'+'<a class="previous" href="#"><i class="glyphicon glyphicon-chevron-left"></i></a>'+"<span></span>"+'<a class="next" href="#"><i class="glyphicon glyphicon-chevron-right"></i></a>'+"</th>"+"</tr>"+'<tr class="days-header">'+"</tr>"+"</thead>"+"<tbody>"+"</tbody>"+"</table>"+"</div>"),this.$element.on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",h,i.prototype.toggle).on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",".bfh-datepicker-calendar > table.calendar .month > .previous",i.prototype.previousMonth).on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",".bfh-datepicker-calendar > table.calendar .month > .next",i.prototype.nextMonth).on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",".bfh-datepicker-calendar > table.calendar .year > .previous",i.prototype.previousYear).on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",".bfh-datepicker-calendar > table.calendar .year > .next",i.prototype.nextYear).on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",".bfh-datepicker-calendar > table.calendar td:not(.off)",i.prototype.select).on("click.bfhdatepicker.data-api touchstart.bfhdatepicker.data-api",".bfh-datepicker-calendar > table.calendar",function(){return!1}),this.setDate(),this.setDateLimit(this.options.min,"lower"),this.setDateLimit(this.options.max,"higher"),this.updateCalendar()},updateCalendarHeader:function(a,b,c){var d,e;for(a.find("table > thead > tr > th.month > span").text(BFHMonthsList[b]),a.find("table > thead > tr > th.year > span").text(c),d=a.find("table > thead > tr.days-header"),d.html(""),e=BFHDayOfWeekStart;e<BFHDaysList.length;e+=1)d.append("<th>"+BFHDaysList[e]+"</th>");for(e=0;BFHDayOfWeekStart>e;e+=1)d.append("<th>"+BFHDaysList[e]+"</th>")},checkMinDate:function(a,b,c){var d,e,f,g;return d=this.$element.data("lowerlimit"),d===!0&&(e=this.$element.data("lowerday"),f=this.$element.data("lowermonth"),g=this.$element.data("loweryear"),e>a&&b===f&&c===g||f>b&&c===g||g>c)?!0:!1},checkMaxDate:function(a,b,c){var d,e,f,g;return d=this.$element.data("higherlimit"),d===!0&&(e=this.$element.data("higherday"),f=this.$element.data("highermonth"),g=this.$element.data("higheryear"),a>e&&b===f&&c===g||b>f&&c===g||c>g)?!0:!1},checkToday:function(a,b,c){var d;return d=new Date,a===d.getDate()&&b===d.getMonth()&&c===d.getFullYear()?!0:!1},updateCalendarDays:function(a,d,e){var f,g,h,i,j,k,l;for(f=a.find("table > tbody").html(""),g=b(d,e),h=b(d+1,e),i=c(d,e,1),j=c(d,e,h),k="",l=0;(i-BFHDayOfWeekStart+7)%7>l;l+=1)k+='<td class="off">'+(g-(i-BFHDayOfWeekStart+7)%7+l+1)+"</td>";for(l=1;h>=l;l+=1)k+=this.checkMinDate(l,d,e)?'<td data-day="'+l+'" class="off">'+l+"</td>":this.checkMaxDate(l,d,e)?'<td data-day="'+l+'" class="off">'+l+"</td>":this.checkToday(l,d,e)?'<td data-day="'+l+'" class="today">'+l+"</td>":'<td data-day="'+l+'">'+l+"</td>",c(d,e,l)===(6+BFHDayOfWeekStart)%7&&(f.append("<tr>"+k+"</tr>"),k="");for(l=1;(7-(j+1-BFHDayOfWeekStart+7)%7)%7+1>=l;l+=1)k+='<td class="off">'+l+"</td>",l===(7-(j+1-BFHDayOfWeekStart+7)%7)%7&&f.append("<tr>"+k+"</tr>")},updateCalendar:function(){var a,b,c;a=this.$element.find(".bfh-datepicker-calendar"),b=this.$element.data("month"),c=this.$element.data("year"),this.updateCalendarHeader(a,b,c),this.updateCalendarDays(a,b,c)},previousMonth:function(){var b,c,d;return b=a(this),c=g(b),0===Number(c.data("month"))?(c.data("month",11),c.data("year",Number(c.data("year"))-1)):c.data("month",Number(c.data("month"))-1),d=c.data("bfhdatepicker"),d.updateCalendar(),!1},nextMonth:function(){var b,c,d;return b=a(this),c=g(b),11===Number(c.data("month"))?(c.data("month",0),c.data("year",Number(c.data("year"))+1)):c.data("month",Number(c.data("month"))+1),d=c.data("bfhdatepicker"),d.updateCalendar(),!1},previousYear:function(){var b,c,d;return b=a(this),c=g(b),c.data("year",Number(c.data("year"))-1),d=c.data("bfhdatepicker"),d.updateCalendar(),!1},nextYear:function(){var b,c,d;return b=a(this),c=g(b),c.data("year",Number(c.data("year"))+1),d=c.data("bfhdatepicker"),d.updateCalendar(),!1},select:function(b){var c,e,h,i,j,k;c=a(this),b.preventDefault(),b.stopPropagation(),e=g(c),h=e.data("bfhdatepicker"),i=e.data("month"),j=e.data("year"),k=c.data("day"),e.val(d(h.options.format,i,j,k)),e.trigger("change.bfhdatepicker"),h.options.close===!0&&f()},toggle:function(b){var c,d,e;if(c=a(this),d=g(c),d.is(".disabled")||void 0!==d.attr("disabled"))return!0;if(e=d.hasClass("open"),f(),!e){if(d.trigger(b=a.Event("show.bfhdatepicker")),b.isDefaultPrevented())return!0;d.toggleClass("open").trigger("shown.bfhdatepicker"),c.focus()}return!1}};var j=a.fn.bfhdatepicker;a.fn.bfhdatepicker=function(b){return this.each(function(){var c,d,e;c=a(this),d=c.data("bfhdatepicker"),e="object"==typeof b&&b,this.type="bfhdatepicker",d||c.data("bfhdatepicker",d=new i(this,e)),"string"==typeof b&&d[b].call(c)})},a.fn.bfhdatepicker.Constructor=i,a.fn.bfhdatepicker.defaults={icon:"glyphicon glyphicon-calendar",align:"left",input:"form-control",placeholder:"",name:"",date:"today",format:"m/d/y",min:"",max:"",close:!0},a.fn.bfhdatepicker.noConflict=function(){return a.fn.bfhdatepicker=j,this};var k;a.valHooks.div&&(k=a.valHooks.div),a.valHooks.div={get:function(b){return a(b).hasClass("bfh-datepicker")?a(b).find('input[type="text"]').val():k?k.get(b):void 0},set:function(b,c){if(a(b).hasClass("bfh-datepicker"))a(b).find('input[type="text"]').val(c);else if(k)return k.set(b,c)}},a(document).ready(function(){a("div.bfh-datepicker").each(function(){var b;b=a(this),b.bfhdatepicker(b.data())})}),a(document).on("click.bfhdatepicker.data-api",f)}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhfonts.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addFonts(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapFonts()};b.prototype={constructor:b,getFonts:function(){var b,c;if(this.options.available){c=[],this.options.available=this.options.available.split(",");for(b in BFHFontsList)BFHFontsList.hasOwnProperty(b)&&a.inArray(b,this.options.available)>=0&&(c[b]=BFHFontsList[b]);return c}return BFHFontsList},addFonts:function(){var a,b,c;a=this.options.font,c=this.getFonts(),this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(b in c)c.hasOwnProperty(b)&&this.$element.append('<option value="'+b+'">'+b+"</option>");this.$element.val(a)},addBootstrapFonts:function(){var a,b,c,d,e,f;d=this.options.font,a=this.$element.find('input[type="hidden"]'),b=this.$element.find(".bfh-selectbox-option"),c=this.$element.find("[role=option]"),f=this.getFonts(),c.html(""),this.options.blank===!0&&c.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(e in f)f.hasOwnProperty(e)&&c.append('<li><a tabindex="-1" href="#" style=\'font-family: '+f[e]+"' data-option=\""+e+'">'+e+"</a></li>");this.$element.val(d)}};var c=a.fn.bfhfonts;a.fn.bfhfonts=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhfonts"),f="object"==typeof c&&c,e||d.data("bfhfonts",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhfonts.Constructor=b,a.fn.bfhfonts.defaults={font:"",available:"",blank:!0},a.fn.bfhfonts.noConflict=function(){return a.fn.bfhfonts=c,this},a(document).ready(function(){a("form select.bfh-fonts, span.bfh-fonts, div.bfh-fonts").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhfonts(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhfontsizes.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addFontSizes(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapFontSizes()};b.prototype={constructor:b,getFontsizes:function(){var b,c;if(this.options.available){c=[],this.options.available=this.options.available.split(",");for(b in BFHFontSizesList)BFHFontSizesList.hasOwnProperty(b)&&a.inArray(b,this.options.available)>=0&&(c[b]=BFHFontSizesList[b]);return c}return BFHFontSizesList},addFontSizes:function(){var a,b,c;a=this.options.fontsize,c=this.getFontsizes(),this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(b in c)c.hasOwnProperty(b)&&this.$element.append('<option value="'+b+'">'+c[b]+"</option>");this.$element.val(a)},addBootstrapFontSizes:function(){var a,b,c,d,e,f;d=this.options.fontsize,a=this.$element.find('input[type="hidden"]'),b=this.$element.find(".bfh-selectbox-option"),c=this.$element.find("[role=option]"),f=this.getFontsizes(),c.html(""),this.options.blank===!0&&c.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(e in f)f.hasOwnProperty(e)&&c.append('<li><a tabindex="-1" href="#" data-option="'+e+'">'+f[e]+"</a></li>");this.$element.val(d)}};var c=a.fn.bfhfontsizes;a.fn.bfhfontsizes=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhfontsizes"),f="object"==typeof c&&c,e||d.data("bfhfontsizes",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhfontsizes.Constructor=b,a.fn.bfhfontsizes.defaults={fontsize:"",available:"",blank:!0},a.fn.bfhfontsizes.noConflict=function(){return a.fn.bfhfontsizes=c,this},a(document).ready(function(){a("form select.bfh-fontsizes, span.bfh-fontsizes, div.bfh-fontsizes").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhfontsizes(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhgooglefonts.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addFonts(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapFonts()};b.prototype={constructor:b,getFonts:function(){var b,c;if(c=[],this.options.subset)for(b in BFHGoogleFontsList.items)BFHGoogleFontsList.items.hasOwnProperty(b)&&a.inArray(this.options.subset,BFHGoogleFontsList.items[b].subsets)>=0&&(c[BFHGoogleFontsList.items[b].family]={info:BFHGoogleFontsList.items[b],index:parseInt(b,10)});else if(this.options.available){this.options.available=this.options.available.split(",");for(b in BFHGoogleFontsList.items)BFHGoogleFontsList.items.hasOwnProperty(b)&&a.inArray(BFHGoogleFontsList.items[b].family,this.options.available)>=0&&(c[BFHGoogleFontsList.items[b].family]={info:BFHGoogleFontsList.items[b],index:parseInt(b,10)})}else for(b in BFHGoogleFontsList.items)BFHGoogleFontsList.items.hasOwnProperty(b)&&(c[BFHGoogleFontsList.items[b].family]={info:BFHGoogleFontsList.items[b],index:parseInt(b,10)});return c},addFonts:function(){var a,b,c;a=this.options.font,c=this.getFonts(),this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(b in c)c.hasOwnProperty(b)&&this.$element.append('<option value="'+c[b].info.family+'">'+c[b].info.family+"</option>");this.$element.val(a)},addBootstrapFonts:function(){var a,b,c,d,e,f;d=this.options.font,a=this.$element.find('input[type="hidden"]'),b=this.$element.find(".bfh-selectbox-option"),c=this.$element.find("[role=option]"),f=this.getFonts(),c.html(""),this.options.blank===!0&&c.append('<li><a tabindex="-1" href="#" data-option="" style="background-image: none;"></a></li>');for(e in f)f.hasOwnProperty(e)&&c.append('<li><a tabindex="-1" href="#" style="background-position: 0 -'+(30*f[e].index-2)+'px;" data-option="'+f[e].info.family+'">'+f[e].info.family+"</a></li>");this.$element.val(d)}};var c=a.fn.bfhgooglefonts;a.fn.bfhgooglefonts=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhgooglefonts"),f="object"==typeof c&&c,e||d.data("bfhgooglefonts",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhgooglefonts.Constructor=b,a.fn.bfhgooglefonts.defaults={font:"",available:"",subset:"",blank:!0},a.fn.bfhgooglefonts.noConflict=function(){return a.fn.bfhgooglefonts=c,this},a(document).ready(function(){a("form select.bfh-googlefonts, span.bfh-googlefonts, div.bfh-googlefonts").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhgooglefonts(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhlanguages.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addLanguages(),this.$element.is("span")&&this.displayLanguage(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapLanguages()};b.prototype={constructor:b,getLanguages:function(){var a,b,c;if(this.options.available){c=[],this.options.available=this.options.available.split(",");for(b in this.options.available)this.options.available.hasOwnProperty(b)&&(-1!==this.options.available[b].indexOf("_")?(a=this.options.available[b].split("_"),c[a[0]]={name:BFHLanguagesList[a[0]],country:a[1]}):c[this.options.available[b]]=BFHLanguagesList[this.options.available[b]]);return c}return BFHLanguagesList},addLanguages:function(){var a,b,c;a=this.options.language,b=this.getLanguages(),this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(c in b)b.hasOwnProperty(c)&&(b[c].hasOwnProperty("name")?this.$element.append('<option value="'+c+"_"+b[c].country+'">'+b[c].name.toProperCase()+" ("+BFHCountriesList[b[c].country]+")</option>"):this.$element.append('<option value="'+c+'">'+b[c].toProperCase()+"</option>"));this.$element.val(a)},addBootstrapLanguages:function(){var a,b,c,d,e,f;d=this.options.language,a=this.$element.find('input[type="hidden"]'),b=this.$element.find(".bfh-selectbox-option"),c=this.$element.find("[role=option]"),e=this.getLanguages(),c.html(""),this.options.blank===!0&&c.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(f in e)e.hasOwnProperty(f)&&(e[f].hasOwnProperty("name")?this.options.flags===!0?c.append('<li><a tabindex="-1" href="#" data-option="'+f+"_"+e[f].country+'"><i class="glyphicon bfh-flag-'+e[f].country+'"></i>'+e[f].name.toProperCase()+"</a></li>"):c.append('<li><a tabindex="-1" href="#" data-option="'+f+"_"+e[f].country+'">'+e[f].name.toProperCase()+" ("+BFHCountriesList[e[f].country]+")</a></li>"):c.append('<li><a tabindex="-1" href="#" data-option="'+f+'">'+e[f]+"</a></li>"));this.$element.val(d)},displayLanguage:function(){var a;a=this.options.language,-1!==a.indexOf("_")?(a=a.split("_"),this.options.flags===!0?this.$element.html('<i class="glyphicon bfh-flag-'+a[1]+'"></i> '+BFHLanguagesList[a[0]].toProperCase()):this.$element.html(BFHLanguagesList[a[0]].toProperCase()+" ("+BFHCountriesList[a[1]]+")")):this.$element.html(BFHLanguagesList[a].toProperCase())}};var c=a.fn.bfhlanguages;a.fn.bfhlanguages=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhlanguages"),f="object"==typeof c&&c,e||d.data("bfhlanguages",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhlanguages.Constructor=b,a.fn.bfhlanguages.defaults={language:"",available:"",flags:!1,blank:!0},a.fn.bfhlanguages.noConflict=function(){return a.fn.bfhlanguages=c,this},a(document).ready(function(){a("form select.bfh-languages, span.bfh-languages, div.bfh-languages").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhlanguages(b.data())})}),String.prototype.toProperCase=function(){return this.replace(/\w\S*/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()})}}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhnumber.defaults,c),this.$element=a(b),this.initInput()};b.prototype={constructor:b,initInput:function(){this.options.buttons===!0&&(this.$element.wrap('<div class="input-group"></div>'),this.$element.parent().append('<span class="input-group-addon bfh-number-btn inc"><span class="glyphicon glyphicon-chevron-up"></span></span>'),this.$element.parent().append('<span class="input-group-addon bfh-number-btn dec"><span class="glyphicon glyphicon-chevron-down"></span></span>')),this.$element.on("change.bfhnumber.data-api",b.prototype.change),this.options.keyboard===!0&&this.$element.on("keydown.bfhnumber.data-api",b.prototype.keydown),this.options.buttons===!0&&this.$element.parent().on("mousedown.bfhnumber.data-api",".inc",b.prototype.btninc).on("mousedown.bfhnumber.data-api",".dec",b.prototype.btndec),this.formatNumber()},keydown:function(b){var c;if(c=a(this).data("bfhnumber"),c.$element.is(".disabled")||void 0!==c.$element.attr("disabled"))return!0;switch(b.which){case 38:c.increment();break;case 40:c.decrement()}return!0},mouseup:function(a){var b,c,d;b=a.data.btn,c=b.$element.data("timer"),d=b.$element.data("interval"),clearTimeout(c),clearInterval(d)},btninc:function(){var c,d;return c=a(this).parent().find(".bfh-number").data("bfhnumber"),c.$element.is(".disabled")||void 0!==c.$element.attr("disabled")?!0:(c.increment(),d=setTimeout(function(){var a;a=setInterval(function(){c.increment()},80),c.$element.data("interval",a)},750),c.$element.data("timer",d),a(document).one("mouseup",{btn:c},b.prototype.mouseup),!0)},btndec:function(){var c,d;return c=a(this).parent().find(".bfh-number").data("bfhnumber"),c.$element.is(".disabled")||void 0!==c.$element.attr("disabled")?!0:(c.decrement(),d=setTimeout(function(){var a;a=setInterval(function(){c.decrement()},80),c.$element.data("interval",a)},750),c.$element.data("timer",d),a(document).one("mouseup",{btn:c},b.prototype.mouseup),!0)},change:function(){var b;return b=a(this).data("bfhnumber"),b.$element.is(".disabled")||void 0!==b.$element.attr("disabled")?!0:(b.formatNumber(),!0)},increment:function(){var a;a=this.getValue(),a+=1,this.$element.val(a).change()},decrement:function(){var a;a=this.getValue(),a-=1,this.$element.val(a).change()},getValue:function(){var a;return a=this.$element.val(),"-1"!==a&&(a=String(a).replace(/\D/g,"")),0===String(a).length&&(a=this.options.min),parseInt(a)},formatNumber:function(){var a,b,c,d;if(a=this.getValue(),a>this.options.max&&(a=this.options.wrap===!0?this.options.min:this.options.max),a<this.options.min&&(a=this.options.wrap===!0?this.options.max:this.options.min),this.options.zeros===!0)for(b=String(this.options.max).length,c=String(a).length,d=c;b>d;d+=1)a="0"+a;a!==this.$element.val()&&this.$element.val(a)}};var c=a.fn.bfhnumber;a.fn.bfhnumber=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhnumber"),f="object"==typeof c&&c,e||d.data("bfhnumber",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhnumber.Constructor=b,a.fn.bfhnumber.defaults={min:0,max:9999,zeros:!1,keyboard:!0,buttons:!0,wrap:!1},a.fn.bfhnumber.noConflict=function(){return a.fn.bfhnumber=c,this},a(document).ready(function(){a('form input[type="text"].bfh-number, form input[type="number"].bfh-number').each(function(){var b;b=a(this),b.bfhnumber(b.data())})})}(window.jQuery),+function(a){"use strict";function b(a,b){var c,d,e,f;for(c="",b=String(b).replace(/\D/g,""),d=0,e=0;d<a.length;d+=1)/\d/g.test(a.charAt(d))?a.charAt(d)===b.charAt(e)?(c+=b.charAt(e),e+=1):c+=a.charAt(d):"d"!==a.charAt(d)?(""!==b.charAt(e)||"+"===a.charAt(d))&&(c+=a.charAt(d)):""===b.charAt(e)?c+="":(c+=b.charAt(e),e+=1);return f=a.charAt(c.length),"d"!==f&&(c+=f),c}function c(a){var b,c=0;return document.selection?(a.focus(),b=document.selection.createRange(),b.moveStart("character",-a.value.length),c=b.text.length):(a.selectionStart||0===a.selectionStart)&&(c=a.selectionStart),c}function d(a,b){var c;document.selection?(a.focus(),c=document.selection.createRange(),c.moveStart("character",-a.value.length),c.moveStart("character",b),c.moveEnd("character",0),c.select()):(a.selectionStart||0===a.selectionStart)&&(a.selectionStart=b,a.selectionEnd=b,a.focus())}var e=function(b,c){this.options=a.extend({},a.fn.bfhphone.defaults,c),this.$element=a(b),(this.$element.is('input[type="text"]')||this.$element.is('input[type="tel"]'))&&this.addFormatter(),this.$element.is("span")&&this.displayFormatter()
};e.prototype={constructor:e,addFormatter:function(){var b;""!==this.options.country&&(b=a(document).find("#"+this.options.country),0!==b.length?(this.options.format=BFHPhoneFormatList[b.val()],b.on("change",{phone:this},this.changeCountry)):this.options.format=BFHPhoneFormatList[this.options.country]),this.$element.on("keyup.bfhphone.data-api",e.prototype.change),this.loadFormatter()},loadFormatter:function(){var a;a=b(this.options.format,this.$element.val()),this.$element.val(a)},displayFormatter:function(){var a;""!==this.options.country&&(this.options.format=BFHPhoneFormatList[this.options.country]),a=b(this.options.format,this.options.number),this.$element.html(a)},changeCountry:function(b){var c,d;c=a(this),d=b.data.phone,d.$element.val(String(d.$element.val()).replace(/\+\d*/g,"")),d.options.format=BFHPhoneFormatList[c.val()],d.loadFormatter()},change:function(e){var f,g,h,i;return f=a(this).data("bfhphone"),f.$element.is(".disabled")||void 0!==f.$element.attr("disabled")?!0:(g=c(f.$element[0]),h=!1,g===f.$element.val().length&&(h=!0),8===e.which&&"d"!==f.options.format.charAt(f.$element.val().length)&&f.$element.val(String(f.$element.val()).substring(0,f.$element.val().length-1)),i=b(f.options.format,f.$element.val()),i===f.$element.val()?!0:(f.$element.val(i),h&&(g=f.$element.val().length),d(f.$element[0],g),!0))}};var f=a.fn.bfhphone;a.fn.bfhphone=function(b){return this.each(function(){var c,d,f;c=a(this),d=c.data("bfhphone"),f="object"==typeof b&&b,d||c.data("bfhphone",d=new e(this,f)),"string"==typeof b&&d[b].call(c)})},a.fn.bfhphone.Constructor=e,a.fn.bfhphone.defaults={format:"",number:"",country:""},a.fn.bfhphone.noConflict=function(){return a.fn.bfhphone=f,this},a(document).ready(function(){a('form input[type="text"].bfh-phone, form input[type="tel"].bfh-phone, span.bfh-phone').each(function(){var b;b=a(this),b.bfhphone(b.data())})})}(window.jQuery),+function(a){"use strict";function b(){var b;a(d).each(function(d){return b=c(a(this)),b.hasClass("open")?(b.trigger(d=a.Event("hide.bfhselectbox")),d.isDefaultPrevented()?!0:(b.removeClass("open").trigger("hidden.bfhselectbox"),void 0)):!0})}function c(a){return a.closest(".bfh-selectbox")}var d="[data-toggle=bfh-selectbox]",e=function(b,c){this.options=a.extend({},a.fn.bfhselectbox.defaults,c),this.$element=a(b),this.initSelectBox()};e.prototype={constructor:e,initSelectBox:function(){var b;b="",this.$element.find("div").each(function(){b=b+'<li><a tabindex="-1" href="#" data-option="'+a(this).data("value")+'">'+a(this).html()+"</a></li>"}),this.$element.html('<input type="hidden" name="'+this.options.name+'" value="">'+'<a class="bfh-selectbox-toggle '+this.options.input+'" role="button" data-toggle="bfh-selectbox" href="#">'+'<span class="bfh-selectbox-option"></span>'+'<span class="'+this.options.icon+' selectbox-caret"></span>'+"</a>"+'<div class="bfh-selectbox-options">'+'<div role="listbox">'+'<ul role="option">'+"</ul>"+"</div>"+"</div>"),this.$element.find("[role=option]").html(b),this.options.filter===!0&&this.$element.find(".bfh-selectbox-options").prepend('<div class="bfh-selectbox-filter-container"><input type="text" class="bfh-selectbox-filter form-control"></div>'),this.$element.val(this.options.value),this.$element.on("click.bfhselectbox.data-api touchstart.bfhselectbox.data-api",d,e.prototype.toggle).on("keydown.bfhselectbox.data-api",d+", [role=option]",e.prototype.keydown).on("mouseenter.bfhselectbox.data-api","[role=option] > li > a",e.prototype.mouseenter).on("click.bfhselectbox.data-api","[role=option] > li > a",e.prototype.select).on("click.bfhselectbox.data-api",".bfh-selectbox-filter",function(){return!1}).on("propertychange.bfhselectbox.data-api change.bfhselectbox.data-api input.bfhselectbox.data-api paste.bfhselectbox.data-api",".bfh-selectbox-filter",e.prototype.filter)},toggle:function(d){var e,f,g;if(e=a(this),f=c(e),f.is(".disabled")||void 0!==f.attr("disabled"))return!0;if(g=f.hasClass("open"),b(),!g){if(f.trigger(d=a.Event("show.bfhselectbox")),d.isDefaultPrevented())return!0;f.toggleClass("open").trigger("shown.bfhselectbox").find('[role=option] > li > [data-option="'+f.val()+'"]').focus()}return!1},filter:function(){var b,d,e;b=a(this),d=c(b),e=a("[role=option] li a",d),e.hide().filter(function(){return-1!==a(this).text().toUpperCase().indexOf(b.val().toUpperCase())}).show()},keydown:function(b){var f,g,h,i,j;return/(38|40|27)/.test(b.keyCode)?(f=a(this),b.preventDefault(),b.stopPropagation(),h=c(f),i=h.hasClass("open"),!i||i&&27===b.keyCode?(27===b.which&&h.find(d).focus(),f.click()):(g=a("[role=option] li:not(.divider) a:visible",h),g.length?(a("body").off("mouseenter.bfh-selectbox.data-api","[role=option] > li > a",e.prototype.mouseenter),j=g.index(g.filter(":focus")),38===b.keyCode&&j>0&&(j-=1),40===b.keyCode&&j<g.length-1&&(j+=1),j||(j=0),g.eq(j).focus(),a("body").on("mouseenter.bfh-selectbox.data-api","[role=option] > li > a",e.prototype.mouseenter),void 0):!0)):!0},mouseenter:function(){var b;b=a(this),b.focus()},select:function(d){var e,f;return e=a(this),d.preventDefault(),d.stopPropagation(),e.is(".disabled")||void 0!==e.attr("disabled")?!0:(f=c(e),f.val(e.data("option")),f.trigger("change.bfhselectbox"),b(),void 0)}};var f=a.fn.bfhselectbox;a.fn.bfhselectbox=function(b){return this.each(function(){var c,d,f;c=a(this),d=c.data("bfhselectbox"),f="object"==typeof b&&b,this.type="bfhselectbox",d||c.data("bfhselectbox",d=new e(this,f)),"string"==typeof b&&d[b].call(c)})},a.fn.bfhselectbox.Constructor=e,a.fn.bfhselectbox.defaults={icon:"caret",input:"form-control",name:"",value:"",filter:!1},a.fn.bfhselectbox.noConflict=function(){return a.fn.bfhselectbox=f,this};var g;a.valHooks.div&&(g=a.valHooks.div),a.valHooks.div={get:function(b){return a(b).hasClass("bfh-selectbox")?a(b).find('input[type="hidden"]').val():g?g.get(b):void 0},set:function(b,c){var d,e;if(a(b).hasClass("bfh-selectbox"))d=a(b),d.find("li a[data-option='"+c+"']").length>0?e=d.find("li a[data-option='"+c+"']").html():d.find("li a").length>0?e=d.find("li a").eq(0).html():(c="",e=""),d.find('input[type="hidden"]').val(c),d.find(".bfh-selectbox-option").html(e);else if(g)return g.set(b,c)}},a(document).ready(function(){a("div.bfh-selectbox").each(function(){var b;b=a(this),b.bfhselectbox(b.data())})}),a(document).on("click.bfhselectbox.data-api",b)}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhslider.defaults,c),this.$element=a(b),this.initSlider()};b.prototype={constructor:b,initSlider:function(){""===this.options.value&&(this.options.value=this.options.min),this.$element.html('<input type="hidden" name="'+this.options.name+'" value="">'+'<div class="bfh-slider-handle"><div class="bfh-slider-value"></div></div>'),this.$element.find('input[type="hidden"]').val(this.options.value),this.updateHandle(this.options.value),this.$element.on("mousedown.bfhslider.data-api",b.prototype.mouseDown)},updateHandle:function(a){var b,c,d,e;e=this.options.max-this.options.min,c=this.$element.width(),d=this.$element.position().left,b=Math.round((a-this.options.min)*(c-20)/e+d),this.$element.find(".bfh-slider-handle").css("left",b+"px"),this.$element.find(".bfh-slider-value").text(a)},updateVal:function(a){var b,c,d,e,f;return f=this.options.max-this.options.min,b=this.$element.width(),c=this.$element.offset().left,d=c+b,c>a&&(a=c),a+20>d&&(a=d),e=(a-c)/b,e=Math.ceil(e*f+this.options.min),e===this.$element.val()?!0:(this.$element.val(e),this.$element.trigger("change.bfhslider"),void 0)},mouseDown:function(){var c;return c=a(this),c.is(".disabled")||void 0!==c.attr("disabled")?!0:(a(document).on("mousemove.bfhslider.data-api",{slider:c},b.prototype.mouseMove).one("mouseup.bfhslider.data-api",{slider:c},b.prototype.mouseUp),void 0)},mouseMove:function(a){var b;b=a.data.slider,b.data("bfhslider").updateVal(a.pageX)},mouseUp:function(b){var c;c=b.data.slider,c.data("bfhslider").updateVal(b.pageX),a(document).off("mousemove.bfhslider.data-api")}};var c=a.fn.bfhslider;a.fn.bfhslider=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhslider"),f="object"==typeof c&&c,this.type="bfhslider",e||d.data("bfhslider",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhslider.Constructor=b,a.fn.bfhslider.defaults={name:"",value:"",min:0,max:100},a.fn.bfhslider.noConflict=function(){return a.fn.bfhslider=c,this};var d;a.valHooks.div&&(d=a.valHooks.div),a.valHooks.div={get:function(b){return a(b).hasClass("bfh-slider")?a(b).find('input[type="hidden"]').val():d?d.get(b):void 0},set:function(b,c){if(a(b).hasClass("bfh-slider"))a(b).find('input[type="hidden"]').val(c),a(b).data("bfhslider").updateHandle(c);else if(d)return d.set(b,c)}},a(document).ready(function(){a("div.bfh-slider").each(function(){var b;b=a(this),b.bfhslider(b.data())})})}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhstates.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addStates(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapStates(),this.$element.is("span")&&this.displayState()};b.prototype={constructor:b,addStates:function(){var b,c;b=this.options.country,""!==b&&(c=a(document).find("#"+b),0!==c.length&&(b=c.val(),c.on("change",{state:this},this.changeCountry))),this.loadStates(b)},loadStates:function(a){var b,c;b=this.options.state,this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(c in BFHStatesList[a])BFHStatesList[a].hasOwnProperty(c)&&this.$element.append('<option value="'+BFHStatesList[a][c].code+'">'+BFHStatesList[a][c].name+"</option>");this.$element.val(b)},changeCountry:function(b){var c,d,e;c=a(this),d=b.data.state,e=c.val(),d.loadStates(e)},addBootstrapStates:function(){var b,c;b=this.options.country,""!==b&&(c=a(document).find("#"+b),0!==c.length&&(b=c.find('input[type="hidden"]').val(),c.on("change.bfhselectbox",{state:this},this.changeBootstrapCountry))),this.loadBootstrapStates(b)},loadBootstrapStates:function(a){var b,c,d,e,f,g;e=this.options.state,f="",b=this.$element.find('input[type="hidden"]'),c=this.$element.find(".bfh-selectbox-option"),d=this.$element.find("[role=option]"),d.html(""),this.options.blank===!0&&d.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(g in BFHStatesList[a])BFHStatesList[a].hasOwnProperty(g)&&(d.append('<li><a tabindex="-1" href="#" data-option="'+BFHStatesList[a][g].code+'">'+BFHStatesList[a][g].name+"</a></li>"),BFHStatesList[a][g].code===e&&(f=BFHStatesList[a][g].name));this.$element.val(e)},changeBootstrapCountry:function(b){var c,d,e;c=a(this),d=b.data.state,e=c.val(),d.loadBootstrapStates(e)},displayState:function(){var a,b,c,d;a=this.options.country,b=this.options.state,c="";for(d in BFHStatesList[a])if(BFHStatesList[a].hasOwnProperty(d)&&BFHStatesList[a][d].code===b){c=BFHStatesList[a][d].name;break}this.$element.html(c)}};var c=a.fn.bfhstates;a.fn.bfhstates=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhstates"),f="object"==typeof c&&c,e||d.data("bfhstates",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhstates.Constructor=b,a.fn.bfhstates.defaults={country:"",state:"",blank:!0},a.fn.bfhstates.noConflict=function(){return a.fn.bfhstates=c,this},a(document).ready(function(){a("form select.bfh-states, span.bfh-states, div.bfh-states").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhstates(b.data())})})}(window.jQuery),+function(a){"use strict";function b(a,b){return a=String(a),1===a.length&&(a="0"+a),b=String(b),1===b.length&&(b="0"+b),a+BFHTimePickerDelimiter+b}function c(){var b;a(e).each(function(c){return b=d(a(this)),b.hasClass("open")?(b.trigger(c=a.Event("hide.bfhtimepicker")),c.isDefaultPrevented()?!0:(b.removeClass("open").trigger("hidden.bfhtimepicker"),void 0)):!0})}function d(a){return a.closest(".bfh-timepicker")}var e="[data-toggle=bfh-timepicker]",f=function(b,c){this.options=a.extend({},a.fn.bfhtimepicker.defaults,c),this.$element=a(b),this.initPopover()};f.prototype={constructor:f,setTime:function(){var a,c,d,e,f,g,h;a=this.options.time,g="",h="",""===a||"now"===a||void 0===a?(c=new Date,e=c.getHours(),f=c.getMinutes(),"12h"===this.options.mode&&(e>12?(e-=12,g=" "+BFHTimePickerModes.pm,h="pm"):(g=" "+BFHTimePickerModes.am,h="am")),"now"===a&&this.$element.find('.bfh-timepicker-toggle > input[type="text"]').val(b(e,f)+g),this.$element.data("hour",e),this.$element.data("minute",f),this.$element.data("mode",h)):(d=String(a).split(BFHTimePickerDelimiter),e=d[0],f=d[1],"12h"===this.options.mode&&(d=String(f).split(" "),f=d[0],h=d[1]===BFHTimePickerModes.pm?"pm":"am"),this.$element.find('.bfh-timepicker-toggle > input[type="text"]').val(a),this.$element.data("hour",e),this.$element.data("minute",f),this.$element.data("mode",h))},initPopover:function(){var b,c,d,g,h;b="",c="",d="",""!==this.options.icon&&("right"===this.options.align?c='<span class="input-group-addon"><i class="'+this.options.icon+'"></i></span>':b='<span class="input-group-addon"><i class="'+this.options.icon+'"></i></span>',d="input-group"),g="",h="23","12h"===this.options.mode&&(g='<td><div class="bfh-selectbox" data-input="'+this.options.input+'" data-value="am">'+'<div data-value="am">'+BFHTimePickerModes.am+"</div>"+'<div data-value="pm">'+BFHTimePickerModes.pm+"</div>"+"</div>",h="11"),this.$element.html('<div class="'+d+' bfh-timepicker-toggle" data-toggle="bfh-timepicker">'+b+'<input type="text" name="'+this.options.name+'" class="'+this.options.input+'" placeholder="'+this.options.placeholder+'" readonly>'+c+"</div>"+'<div class="bfh-timepicker-popover">'+'<table class="table">'+"<tbody>"+"<tr>"+'<td class="hour">'+'<input type="text" class="'+this.options.input+' bfh-number"  data-min="0" data-max="'+h+'" data-zeros="true" data-wrap="true">'+"</td>"+'<td class="separator">'+BFHTimePickerDelimiter+"</td>"+'<td class="minute">'+'<input type="text" class="'+this.options.input+' bfh-number"  data-min="0" data-max="59" data-zeros="true" data-wrap="true">'+"</td>"+g+"</tr>"+"</tbody>"+"</table>"+"</div>"),this.$element.on("click.bfhtimepicker.data-api touchstart.bfhtimepicker.data-api",e,f.prototype.toggle).on("click.bfhtimepicker.data-api touchstart.bfhtimepicker.data-api",".bfh-timepicker-popover > table",function(){return!1}),this.$element.find(".bfh-number").each(function(){var b;b=a(this),b.bfhnumber(b.data()),b.on("change",f.prototype.change)}),this.$element.find(".bfh-selectbox").each(function(){var b;b=a(this),b.bfhselectbox(b.data()),b.on("change.bfhselectbox",f.prototype.change)}),this.setTime(),this.updatePopover()},updatePopover:function(){var a,b,c;a=this.$element.data("hour"),b=this.$element.data("minute"),c=this.$element.data("mode"),this.$element.find(".hour input[type=text]").val(a).change(),this.$element.find(".minute input[type=text]").val(b).change(),this.$element.find(".bfh-selectbox").val(c)},change:function(){var b,c,e,f;return b=a(this),c=d(b),e=c.data("bfhtimepicker"),e&&"undefined"!==e&&(f="","12h"===e.options.mode&&(f=" "+BFHTimePickerModes[c.find(".bfh-selectbox").val()]),c.find('.bfh-timepicker-toggle > input[type="text"]').val(c.find(".hour input[type=text]").val()+BFHTimePickerDelimiter+c.find(".minute input[type=text]").val()+f),c.trigger("change.bfhtimepicker")),!1},toggle:function(b){var e,f,g;if(e=a(this),f=d(e),f.is(".disabled")||void 0!==f.attr("disabled"))return!0;if(g=f.hasClass("open"),c(),!g){if(f.trigger(b=a.Event("show.bfhtimepicker")),b.isDefaultPrevented())return!0;f.toggleClass("open").trigger("shown.bfhtimepicker"),e.focus()}return!1}};var g=a.fn.bfhtimepicker;a.fn.bfhtimepicker=function(b){return this.each(function(){var c,d,e;c=a(this),d=c.data("bfhtimepicker"),e="object"==typeof b&&b,this.type="bfhtimepicker",d||c.data("bfhtimepicker",d=new f(this,e)),"string"==typeof b&&d[b].call(c)})},a.fn.bfhtimepicker.Constructor=f,a.fn.bfhtimepicker.defaults={icon:"glyphicon glyphicon-time",align:"left",input:"form-control",placeholder:"",name:"",time:"now",mode:"24h"},a.fn.bfhtimepicker.noConflict=function(){return a.fn.bfhtimepicker=g,this};var h;a.valHooks.div&&(h=a.valHooks.div),a.valHooks.div={get:function(b){return a(b).hasClass("bfh-timepicker")?a(b).find('.bfh-timepicker-toggle > input[type="text"]').val():h?h.get(b):void 0},set:function(b,c){var d;if(a(b).hasClass("bfh-timepicker"))d=a(b).data("bfhtimepicker"),d.options.time=c,d.setTime(),d.updatePopover();else if(h)return h.set(b,c)}},a(document).ready(function(){a("div.bfh-timepicker").each(function(){var b;b=a(this),b.bfhtimepicker(b.data())})}),a(document).on("click.bfhtimepicker.data-api",c)}(window.jQuery),+function(a){"use strict";var b=function(b,c){this.options=a.extend({},a.fn.bfhtimezones.defaults,c),this.$element=a(b),this.$element.is("select")&&this.addTimezones(),this.$element.hasClass("bfh-selectbox")&&this.addBootstrapTimezones()};b.prototype={constructor:b,addTimezones:function(){var b,c;b=this.options.country,""!==b&&(c=a(document).find("#"+b),0!==c.length&&(b=c.val(),c.on("change",{timezone:this},this.changeCountry))),this.loadTimezones(b)},loadTimezones:function(a){var b,c;b=this.options.timezone,this.$element.html(""),this.options.blank===!0&&this.$element.append('<option value=""></option>');for(c in BFHTimezonesList[a])BFHTimezonesList[a].hasOwnProperty(c)&&this.$element.append('<option value="'+c+'">'+BFHTimezonesList[a][c]+"</option>");this.$element.val(b)},changeCountry:function(b){var c,d,e;c=a(this),d=b.data.timezone,e=c.val(),d.loadTimezones(e)},addBootstrapTimezones:function(){var b,c;b=this.options.country,""!==b&&(c=a(document).find("#"+b),0!==c.length&&(b=c.find('input[type="hidden"]').val(),c.on("change.bfhselectbox",{timezone:this},this.changeBootstrapCountry))),this.loadBootstrapTimezones(b)},loadBootstrapTimezones:function(a){var b,c,d,e,f;e=this.options.timezone,b=this.$element.find('input[type="hidden"]'),c=this.$element.find(".bfh-selectbox-option"),d=this.$element.find("[role=option]"),d.html(""),this.options.blank===!0&&d.append('<li><a tabindex="-1" href="#" data-option=""></a></li>');for(f in BFHTimezonesList[a])BFHTimezonesList[a].hasOwnProperty(f)&&d.append('<li><a tabindex="-1" href="#" data-option="'+f+'">'+BFHTimezonesList[a][f]+"</a></li>");this.$element.val(e)},changeBootstrapCountry:function(b){var c,d,e;c=a(this),d=b.data.timezone,e=c.val(),d.loadBootstrapTimezones(e)}};var c=a.fn.bfhtimezones;a.fn.bfhtimezones=function(c){return this.each(function(){var d,e,f;d=a(this),e=d.data("bfhtimezones"),f="object"==typeof c&&c,e||d.data("bfhtimezones",e=new b(this,f)),"string"==typeof c&&e[c].call(d)})},a.fn.bfhtimezones.Constructor=b,a.fn.bfhtimezones.defaults={country:"",timezone:"",blank:!0},a.fn.bfhtimezones.noConflict=function(){return a.fn.bfhtimezones=c,this},a(document).ready(function(){a("form select.bfh-timezones, div.bfh-timezones").each(function(){var b;b=a(this),b.hasClass("bfh-selectbox")&&b.bfhselectbox(b.data()),b.bfhtimezones(b.data())})})}(window.jQuery);


 $(document).on('page:load',function(){
 	console.log("country_state_form.js");
	 	// if($('#state') && $('#country'))
	 	// {
	 		console.log("state and country found.");
			$('#state').bfhstates({country:'US', state: 'NY' , blank: false});	
	   		$('#country').bfhcountries({country:'US', state:'NY', blank:false});
	    
	 	// }	
	 	// else
	 	// {
	 	// 	console.log("state and country NOT found.");
	 	// } 
    

    });
    
(function() {


}).call(this);
/*
	http://github.com/danpalmer/jquery.complexify.js

	This code is distributed under the WTFPL v2:
*/

(function ($) {

	$.fn.extend({
		complexify: function(options, callback) {

			var MIN_COMPLEXITY = 49; // 12 chars with Upper, Lower and Number
			var MAX_COMPLEXITY = 120; //  25 chars, all charsets
			var CHARSETS = [
				// Commonly Used
				////////////////////
				[0x0030, 0x0039], // Numbers
				[0x0041, 0x005A], // Uppercase
				[0x0061, 0x007A], // Lowercase
				[0x0021, 0x002F], // Punctuation
				[0x003A, 0x0040], // Punctuation
				[0x005B, 0x0060], // Punctuation
				[0x007B, 0x007E], // Punctuation
				// Everything Else
				////////////////////
				[0x0080, 0x00FF], // Latin-1 Supplement
				[0x0100, 0x017F], // Latin Extended-A
				[0x0180, 0x024F], // Latin Extended-B
				[0x0250, 0x02AF], // IPA Extensions
				[0x02B0, 0x02FF], // Spacing Modifier Letters
				[0x0300, 0x036F], // Combining Diacritical Marks
				[0x0370, 0x03FF], // Greek
				[0x0400, 0x04FF], // Cyrillic
				[0x0530, 0x058F], // Armenian
				[0x0590, 0x05FF], // Hebrew
				[0x0600, 0x06FF], // Arabic
				[0x0700, 0x074F], // Syriac
				[0x0780, 0x07BF], // Thaana
				[0x0900, 0x097F], // Devanagari
				[0x0980, 0x09FF], // Bengali
				[0x0A00, 0x0A7F], // Gurmukhi
				[0x0A80, 0x0AFF], // Gujarati
				[0x0B00, 0x0B7F], // Oriya
				[0x0B80, 0x0BFF], // Tamil
				[0x0C00, 0x0C7F], // Telugu
				[0x0C80, 0x0CFF], // Kannada
				[0x0D00, 0x0D7F], // Malayalam
				[0x0D80, 0x0DFF], // Sinhala
				[0x0E00, 0x0E7F], // Thai
				[0x0E80, 0x0EFF], // Lao
				[0x0F00, 0x0FFF], // Tibetan
				[0x1000, 0x109F], // Myanmar
				[0x10A0, 0x10FF], // Georgian
				[0x1100, 0x11FF], // Hangul Jamo
				[0x1200, 0x137F], // Ethiopic
				[0x13A0, 0x13FF], // Cherokee
				[0x1400, 0x167F], // Unified Canadian Aboriginal Syllabics
				[0x1680, 0x169F], // Ogham
				[0x16A0, 0x16FF], // Runic
				[0x1780, 0x17FF], // Khmer
				[0x1800, 0x18AF], // Mongolian
				[0x1E00, 0x1EFF], // Latin Extended Additional
				[0x1F00, 0x1FFF], // Greek Extended
				[0x2000, 0x206F], // General Punctuation
				[0x2070, 0x209F], // Superscripts and Subscripts
				[0x20A0, 0x20CF], // Currency Symbols
				[0x20D0, 0x20FF], // Combining Marks for Symbols
				[0x2100, 0x214F], // Letterlike Symbols
				[0x2150, 0x218F], // Number Forms
				[0x2190, 0x21FF], // Arrows
				[0x2200, 0x22FF], // Mathematical Operators
				[0x2300, 0x23FF], // Miscellaneous Technical
				[0x2400, 0x243F], // Control Pictures
				[0x2440, 0x245F], // Optical Character Recognition
				[0x2460, 0x24FF], // Enclosed Alphanumerics
				[0x2500, 0x257F], // Box Drawing
				[0x2580, 0x259F], // Block Elements
				[0x25A0, 0x25FF], // Geometric Shapes
				[0x2600, 0x26FF], // Miscellaneous Symbols
				[0x2700, 0x27BF], // Dingbats
				[0x2800, 0x28FF], // Braille Patterns
				[0x2E80, 0x2EFF], // CJK Radicals Supplement
				[0x2F00, 0x2FDF], // Kangxi Radicals
				[0x2FF0, 0x2FFF], // Ideographic Description Characters
				[0x3000, 0x303F], // CJK Symbols and Punctuation
				[0x3040, 0x309F], // Hiragana
				[0x30A0, 0x30FF], // Katakana
				[0x3100, 0x312F], // Bopomofo
				[0x3130, 0x318F], // Hangul Compatibility Jamo
				[0x3190, 0x319F], // Kanbun
				[0x31A0, 0x31BF], // Bopomofo Extended
				[0x3200, 0x32FF], // Enclosed CJK Letters and Months
				[0x3300, 0x33FF], // CJK Compatibility
				[0x3400, 0x4DB5], // CJK Unified Ideographs Extension A
				[0x4E00, 0x9FFF], // CJK Unified Ideographs
				[0xA000, 0xA48F], // Yi Syllables
				[0xA490, 0xA4CF], // Yi Radicals
				[0xAC00, 0xD7A3], // Hangul Syllables
				[0xD800, 0xDB7F], // High Surrogates
				[0xDB80, 0xDBFF], // High Private Use Surrogates
				[0xDC00, 0xDFFF], // Low Surrogates
				[0xE000, 0xF8FF], // Private Use
				[0xF900, 0xFAFF], // CJK Compatibility Ideographs
				[0xFB00, 0xFB4F], // Alphabetic Presentation Forms
				[0xFB50, 0xFDFF], // Arabic Presentation Forms-A
				[0xFE20, 0xFE2F], // Combining Half Marks
				[0xFE30, 0xFE4F], // CJK Compatibility Forms
				[0xFE50, 0xFE6F], // Small Form Variants
				[0xFE70, 0xFEFE], // Arabic Presentation Forms-B
				[0xFEFF, 0xFEFF], // Specials
				[0xFF00, 0xFFEF], // Halfwidth and Fullwidth Forms
				[0xFFF0, 0xFFFD]  // Specials
			];

			var defaults = {
				minimumChars: 8,
				strengthScaleFactor: 1,
        bannedPasswords: window.COMPLEXIFY_BANLIST || [],
				banmode: 'strict', // (strict|loose)
        evaluateOnInit: true
			};

			if($.isFunction(options) && !callback) {
				callback = options;
				options = {};
			}

			options = $.extend(defaults, options);

			function additionalComplexityForCharset(str, charset) {
				for (var i = str.length - 1; i >= 0; i--) {
					if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
						return charset[1] - charset[0] + 1;
					}
				}
        return 0;
			}
			
			function inBanlist(str) {
				if (options.banmode === 'strict') {
					for (var i = 0; i < options.bannedPasswords.length; i++) {
            if (options.bannedPasswords[i].indexOf(str) !== -1) {
              return true;
            }
					}
					return false;
				} else {
					return $.inArray(str, options.bannedPasswords) > -1 ? true : false;
				}
			}

      function evaluateSecurity() {
        var password = $(this).val();
        var complexity = 0, valid = false;
        
        // Reset complexity to 0 when banned password is found
        if (!inBanlist(password)) {
        
          // Add character complexity
          for (var i = CHARSETS.length - 1; i >= 0; i--) {
            complexity += additionalComplexityForCharset(password, CHARSETS[i]);
          }
          
        } else {
          complexity = 1;
        }
        
        // Use natural log to produce linear scale
        complexity = Math.log(Math.pow(complexity, password.length)) * (1/options.strengthScaleFactor);

        valid = (complexity > MIN_COMPLEXITY && password.length >= options.minimumChars);

        // Scale to percentage, so it can be used for a progress bar
        complexity = (complexity / MAX_COMPLEXITY) * 100;
        complexity = (complexity > 100) ? 100 : complexity;
        
        callback.call(this, valid, complexity);
      }

      if( options.evaluateOnInit ) {
        this.each(function () {
          evaluateSecurity.apply(this);
        });
      }

			return this.each(function () {
        $(this).bind('keyup focus', evaluateSecurity);
			});
			
		}
	});

})(jQuery);
/**
 * jQuery Geocoding and Places Autocomplete Plugin - V 1.4
 *
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */// # $.geocomplete()
// ## jQuery Geocoding and Places Autocomplete Plugin - V 1.4
//
// * https://github.com/ubilabs/geocomplete/
// * by Martin Kleppe <kleppe@ubilabs.net>
(function(a,b,c,d){function h(b,c){this.options=a.extend(!0,{},e,c),this.input=b,this.$input=a(b),this._defaults=e,this._name="geocomplete",this.init()}var e={bounds:!0,country:null,map:!1,details:!1,detailsAttribute:"name",location:!1,mapOptions:{zoom:14,scrollwheel:!1,mapTypeId:"roadmap"},markerOptions:{draggable:!1},maxZoom:16,types:["geocode"],blur:!1},f="street_address route intersection political country administrative_area_level_1 administrative_area_level_2 administrative_area_level_3 colloquial_area locality sublocality neighborhood premise subpremise postal_code natural_feature airport park point_of_interest post_box street_number floor room lat lng viewport location formatted_address location_type bounds".split(" "),g="id url website vicinity reference name rating international_phone_number icon formatted_phone_number".split(" ");a.extend(h.prototype,{init:function(){this.initMap(),this.initMarker(),this.initGeocoder(),this.initDetails(),this.initLocation()},initMap:function(){if(this.options.map){if("function"==typeof this.options.map.setCenter)return this.map=this.options.map,d;this.map=new google.maps.Map(a(this.options.map)[0],this.options.mapOptions),google.maps.event.addListener(this.map,"click",a.proxy(this.mapClicked,this))}},initMarker:function(){if(this.map){var b=a.extend(this.options.markerOptions,{map:this.map});b.disabled||(this.marker=new google.maps.Marker(b),google.maps.event.addListener(this.marker,"dragend",a.proxy(this.markerDragged,this)))}},initGeocoder:function(){var b={types:this.options.types,bounds:this.options.bounds===!0?null:this.options.bounds,componentRestrictions:this.options.componentRestrictions};this.options.country&&(b.componentRestrictions={country:this.options.country}),this.autocomplete=new google.maps.places.Autocomplete(this.input,b),this.geocoder=new google.maps.Geocoder,this.map&&this.options.bounds===!0&&this.autocomplete.bindTo("bounds",this.map),google.maps.event.addListener(this.autocomplete,"place_changed",a.proxy(this.placeChanged,this)),this.$input.keypress(function(a){return 13===a.keyCode?!1:d}),this.$input.bind("geocode",a.proxy(function(){this.find()},this)),this.options.blur===!0&&this.$input.blur(a.proxy(function(){this.find()},this))},initDetails:function(){function e(a){d[a]=b.find("["+c+"="+a+"]")}if(this.options.details){var b=a(this.options.details),c=this.options.detailsAttribute,d={};a.each(f,function(a,b){e(b),e(b+"_short")}),a.each(g,function(a,b){e(b)}),this.$details=b,this.details=d}},initLocation:function(){var b,a=this.options.location;if(a){if("string"==typeof a)return this.find(a),d;a instanceof Array&&(b=new google.maps.LatLng(a[0],a[1])),a instanceof google.maps.LatLng&&(b=a),b&&(this.map&&this.map.setCenter(b),this.marker&&this.marker.setPosition(b))}},find:function(a){this.geocode({address:a||this.$input.val()})},geocode:function(b){this.options.bounds&&!b.bounds&&(b.bounds=this.options.bounds===!0?this.map&&this.map.getBounds():this.options.bounds),this.options.country&&(b.region=this.options.country),this.geocoder.geocode(b,a.proxy(this.handleGeocode,this))},handleGeocode:function(a,b){if(b===google.maps.GeocoderStatus.OK){var c=a[0];this.$input.val(c.formatted_address),this.update(c),a.length>1&&this.trigger("geocode:multiple",a)}else this.trigger("geocode:error",b)},trigger:function(a,b){this.$input.trigger(a,[b])},center:function(a){a.viewport?(this.map.fitBounds(a.viewport),this.map.getZoom()>this.options.maxZoom&&this.map.setZoom(this.options.maxZoom)):(this.map.setZoom(this.options.maxZoom),this.map.setCenter(a.location)),this.marker&&(this.marker.setPosition(a.location),this.marker.setAnimation(this.options.markerOptions.animation))},update:function(a){this.map&&this.center(a.geometry),this.$details&&this.fillDetails(a),this.trigger("geocode:result",a)},fillDetails:function(b){var c={},d=b.geometry,e=d.viewport,f=d.bounds;a.each(b.address_components,function(a,b){var d=b.types[0];c[d]=b.long_name,c[d+"_short"]=b.short_name}),a.each(g,function(a,d){c[d]=b[d]}),a.extend(c,{formatted_address:b.formatted_address,location_type:d.location_type||"PLACES",viewport:e,bounds:f,location:d.location,lat:d.location.lat(),lng:d.location.lng()}),a.each(this.details,a.proxy(function(a,b){var d=c[a];this.setDetail(b,d)},this)),this.data=c},setDetail:function(a,b){b===d?b="":"function"==typeof b.toUrlValue&&(b=b.toUrlValue()),a.is(":input")?a.val(b):a.text(b)},markerDragged:function(a){this.trigger("geocode:dragged",a.latLng)},mapClicked:function(a){this.trigger("geocode:click",a.latLng)},resetMarker:function(){this.marker.setPosition(this.data.location),this.setDetail(this.details.lat,this.data.location.lat()),this.setDetail(this.details.lng,this.data.location.lng())},placeChanged:function(){var a=this.autocomplete.getPlace();a.geometry?this.update(a):this.find(a.name)}}),a.fn.geocomplete=function(b){var c="plugin_geocomplete";if("string"==typeof b){var d=a(this).data(c)||a(this).geocomplete().data(c),e=d[b];return"function"==typeof e?(e.apply(d,Array.prototype.slice.call(arguments,1)),a(this)):(2==arguments.length&&(e=arguments[1]),e)}return this.each(function(){var d=a.data(this,c);d||(d=new h(this,b),a.data(this,c,d))})}})(jQuery,window,document);
(function(h){h.fn.passStrengthify=function(a){var q=h(this),m,r=[[0,8,16,32,48,64,72],[0,16,32,48,64,78,92],[0,32,64,78,92,108,128]],s=["Very weak","Very weak","Weak","Weak","Moderate","Good","Strong","Very strong"],n=["gray","red","red","#C00000","orange","#0099FF","blue","green"],i=r[0],u=h("<span>").css("margin-left","1em"),t=[],e=0,v=0,w=false,B=function(b){var c=0,d={"[a-z]":26,"[A-Z]":26,"(\\d[^\\d])|(^\\d+$)":10,"[\\W_]":32};b=b.replace(/(.)(\1)(\1)+/gi,"$1$2");b=b.replace(/(a)(b(c(d(e(f(g(h(i(j(k(l(m(n(o(p(q(r(u(v(w(x(y(z)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?)?/gi,
"$1");b=b.replace(/(0)(1(2(3(4(5(6(7(8(9)?)?)?)?)?)?)?)?)?/g,"$1");b=b.replace(/(1)(2(3(4(5(6(7(8(9(0)?)?)?)?)?)?)?)?)?/g,"$1");b=b.replace(/([^\d])(\d)(\d)+$/,"$1$2");if(!b.length)return 0;for(var j in d)if(b.search(RegExp(j))!=-1)c+=d[j];if(!c)return 0;for(j=d=0;j<b.length;j++){var f;var k=b,o=j;f=c;var l=k.charAt(o),y=[0.08064249900208098,0.015373768624831691,0.026892340312538593,0.04328667139002636,0.1288623426065769,0.0244847137116921,0.019625534749730816,0.06098726796371807,0.06905550211598431,
0.0011176940633901926,0.006252182367878119,0.04101676132771116,0.02500971934780021,0.06984975410235668,0.07378315126621263,0.017031440203182008,0.0010648594165322703,0.06156572691936394,0.063817324270356,0.09024664994930598,0.0278568510204016,0.010257964235274787,0.021192261444145363,0.0016941732664605912,0.01806326249861108,9.695838238376564E-4],z=[0.11617102232902775,0.04708120556723741,0.035155702413137084,0.02673475518173626,0.020026033843997197,0.0378391909482327,0.01952538299789727,0.07241413837989387,
0.06294182437168319,0.006318213677781116,0.006908981676179033,0.027085210774006212,0.04379693601682187,0.02368078502052669,0.06272153799939922,0.025483128066486435,4.305597276459397E-4,0.016551516972063685,0.07765094623009913,0.16692700510663863,0.014889356163011918,0.006198057474717133,0.06669670571743266,5.0065084609993E-5,0.01622108741363773,5.0065084609993E-4],A=[2.835E-4,0.0228302,0.0369041,0.042629,0.0012216,0.0075739,0.0171385,0.0014659,0.0372661,2.353E-4,0.0110124,0.0778259,0.0260757,0.2145354,
5.459E-4,0.0195213,1.749E-4,0.110477,0.093429,0.131796,0.0098029,0.0306574,0.0088799,9.562E-4,0.0233701,0.0018701,0.0580027,0.0058699,7.91E-5,0.0022625,0.3416714,2.057E-4,4.272E-4,3.639E-4,0.0479084,0.0076894,0,0.115056,0.0012816,3.481E-4,0.0966553,1.58E-5,0,0.0740301,0.0226884,0.010743,0.1196127,0.001155,3.16E-5,0,0.0864502,0,0.1229841,2.71E-5,0.0215451,5.246E-4,0.1715916,9.0E-6,0,0.1701716,0.056549,0,0.0453966,0.0488879,0,3.62E-5,0.1759242,9.0E-6,0.0017185,0.0376812,0.0010492,0.0906756,0.0358361,
0,0,0,0.0041969,9.0E-6,0.0280345,5.057E-4,2.585E-4,0.0081086,0.1224833,6.799E-4,0.0054844,7.08E-4,0.0794902,3.484E-4,1.911E-4,0.0092662,0.0021466,0.0030456,0.0397283,1.63E-4,2.25E-5,0.0178918,0.0307037,9.159E-4,0.0178805,0.0027759,0.0013655,0,0.0076478,0,0.0545873,0.0012798,0.0224322,0.0843434,0.0317097,0.008564,0.0052834,0.0017762,0.0127186,2.605E-4,0.0010967,0.0339975,0.0186268,0.0815271,0.0032334,0.0101307,0.0021424,0.1307517,0.0712793,0.0241537,0.0014289,0.0157312,0.0070879,0.0105139,0.0125997,
1.831E-4,0.0638579,2.384E-4,3.179E-4,2.086E-4,0.0928264,0.0500293,1.99E-5,9.93E-5,0.0820576,0,1.99E-5,0.0266638,3.97E-5,8.94E-5,0.1545186,1.689E-4,9.9E-6,0.0825344,0.0039539,0.034194,0.0334986,9.9E-6,1.987E-4,0,0.00152,0,0.0592435,3.842E-4,5.205E-4,0.0020078,0.1482326,2.727E-4,0.0101631,0.1420108,0.0501091,2.48E-5,3.72E-5,0.0395122,0.002987,0.0127906,0.0573224,5.577E-4,0,0.0884686,0.0261142,0.0062466,0.0256309,3.72E-5,3.47E-4,0,0.003272,1.363E-4,0.1580232,7.737E-4,0.002046,5.185E-4,0.4597035,4.627E-4,
3.59E-5,7.18E-5,0.1252667,0,4.0E-6,0.0014278,0.0013042,0.0012922,0.0700557,4.39E-5,3.191E-4,0.0117178,0.0022056,0.0297253,0.0131497,0,0.001029,0,0.0072309,0,0.0166996,0.0069144,0.0486793,0.0363474,0.0480664,0.0271435,0.0307856,7.75E-5,4.826E-4,3.5E-6,0.0073125,0.0526842,0.0412929,0.2618995,0.0497818,0.0062698,4.333E-4,0.043762,0.1157982,0.1198384,7.01E-4,0.0235788,2.11E-5,0.001881,0,0.0032265,0.2106638,0,0,0,0.190642,0,0,0,4.353E-4,0,0,0,0,0,0.2644178,0,0,0,0,0,0.3299238,0,0,0,2.176E-4,0,0.0169234,
0.0011671,5.058E-4,0.0017118,0.3321662,0.0041628,4.669E-4,7.781E-4,0.1300965,0,3.112E-4,0.0185963,9.726E-4,0.100957,0.0113601,0.001206,0,4.279E-4,0.0613523,0.0022954,0.0029956,0,0.0041239,0,0.0086757,0,0.10168,5.515E-4,0.0020459,0.0668636,0.1657445,0.0134024,0.0011801,1.542E-4,0.1107889,1.19E-5,0.0053728,0.135518,0.0055389,9.726E-4,0.0826499,0.0022654,5.9E-6,0.0018443,0.0230153,0.0180635,0.0144461,0.004163,0.0025797,0,0.0968765,2.37E-5,0.1539307,0.0285939,1.653E-4,0.0025384,0.2496134,0.0017798,1.95E-5,
3.015E-4,0.0877464,1.95E-5,0,0.0015756,0.0221846,0.0029567,0.1098532,0.0485124,0,0.016991,0.0249954,8.461E-4,0.0385435,2.92E-5,1.167E-4,0,0.0505257,0,0.0240107,5.432E-4,0.0423173,0.1767352,0.0849166,0.0053036,0.1188694,0.0028799,0.0295789,0.0012223,0.0071353,0.0087755,6.582E-4,0.0085073,0.0653564,3.343E-4,9.716E-4,4.144E-4,0.0427003,0.0956004,0.0093814,0.00335,8.497E-4,3.343E-4,0.012115,1.288E-4,0.0083175,0.0072923,0.0127087,0.0203076,0.0029439,0.1135873,0.0060659,0.0018527,0.0087857,1.978E-4,0.0106912,
0.0268647,0.0580447,0.1459838,0.0330625,0.0138659,2.308E-4,0.1175433,0.032268,0.0492657,0.1337201,0.0164801,0.0488371,5.374E-4,0.0033923,8.571E-4,0.1284508,4.427E-4,4.427E-4,4.713E-4,0.2213542,1.428E-4,8.57E-5,0.0221226,0.0538854,2.86E-5,1.143E-4,0.0957597,0.0010854,5.856E-4,0.1212242,0.0607692,0,0.1362487,0.0222939,0.0408603,0.0270926,0,0.0011711,0,0.0042274,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.284E-4,2.284E-4,0,0.9949749,0,0,0,0,0,0.0733524,0.0032081,0.0116789,0.028407,0.234553,0.0056616,0.0107385,
0.0026432,0.0792432,4.35E-5,0.0087196,0.0117263,0.0192448,0.0221961,0.0919374,0.0048043,3.16E-5,0.0189406,0.0459213,0.0421561,0.0173721,0.0070603,0.0019873,4.0E-6,0.0284504,0.0055945,0.0349781,6.441E-4,0.0157796,0.0015208,0.1179849,0.0010558,4.688E-4,0.0569819,0.0506053,4.95E-5,0.005378,0.0114497,0.006552,0.0022488,0.0491264,0.0287844,8.309E-4,1.906E-4,0.0463897,0.1269191,0.0330152,8.0E-5,0.0053856,0,0.0020925,0,0.0393295,1.59E-4,0.0037195,6.74E-5,0.0892434,9.218E-4,4.04E-5,0.3352928,0.0666758,5.4E-6,
1.62E-5,0.0146273,9.11E-4,0.0011051,0.0913053,8.09E-5,2.7E-6,0.0310281,0.0245378,0.0171177,0.0185732,2.7E-6,0.0078702,0,0.0121422,2.776E-4,0.0261517,0.0181796,0.0459729,0.0223272,0.0308931,0.0058765,0.0505571,6.99E-5,0.0298191,8.7E-6,1.572E-4,0.1066327,0.0308669,0.1156002,0.002017,0.0448465,1.746E-4,0.1626908,0.1207345,0.1249869,3.49E-5,9.343E-4,2.008E-4,8.819E-4,2.969E-4,0.0010042,0.1022242,0,0,0.0049559,0.6796927,0,0,2.371E-4,0.1467561,0,0,1.423E-4,0,0.0128284,0.0429195,0,0,8.299E-4,3.083E-4,0,
0.0025847,5.928E-4,0,0,0.0038888,0,0.1832539,3.329E-4,2.984E-4,0.0018938,0.1605624,0.0013085,3.44E-5,0.1893372,0.1788924,0,5.05E-4,0.0089412,2.755E-4,0.0372798,0.0933831,8.03E-5,1.15E-5,0.0082066,0.0126485,0.0018135,0.0011707,0,3.214E-4,0,6.887E-4,0,0.0600144,0,0.1573582,0.001005,0.05542,0,1.436E-4,0.0132089,0.1122757,0,0,0.0014358,1.436E-4,0,0.0055994,0.2157933,0.0031587,0,0.0027279,0.2360373,0.0195262,0.0051687,1.436E-4,0.0093324,0.0020101,0,0.0072178,0.0039321,0.0011985,0.0020738,0.0562745,0.0015217,
3.097E-4,7.137E-4,0.0141393,1.35E-5,2.69E-5,0.0031914,0.0039051,0.0022488,0.1205478,0.0027875,0,0.0048882,0.0324935,0.0109613,5.925E-4,6.73E-5,0.0016025,1.347E-4,9.43E-5,2.02E-4,0.4219769,7.526E-4,0.0060211,0.0067737,0.3038133,0,0,5.018E-4,0.0709985,2.509E-4,0,0.0198194,0,0,0.0730055,0,0,2.509E-4,0.0017561,5.018E-4,0.0037632,0.0010035,0,0,0.0100351,0.026844],p={"1":"l","3":"e","4":"a","5":"s","7":"t","@":"a",$:"s"};if(typeof p[l]!="undefined")l=p[l];if(l.match(/^[a-zA-Z]$/)){l=l.toLowerCase().charCodeAt(0)-
"a".charCodeAt(0);var g=void 0;g=null;if(o){g=k.charAt(o-1);if(typeof p[g]!="undefined")g=p[g]}if(g!=null&&g.match(/^[a-zA-Z]$/)){k=void 0;k=g.toLowerCase().charCodeAt(0)-"a".charCodeAt(0);g=A[l+26*k]}else g=(o?y:z)[l];if(f>=26)g*=26/f;f=g}else f=1/f;d+=Math.max(-7,Math.log(f)/0.6931471805599453)}return-1*d},C=function(b){var c=0,d=0;d=B(b);if(i.length&&i[0]instanceof RegExp)jQuery.each(i,function(j,f){c+=b.search(f)!=-1});else for(e=0;e<i.length;e++){if(d<i[e])break;c=e+1}return[d,c]},x=function(){var b=
h(this).val(),c=!b.length||b.length<v,d;b=C(b);d=b[0];b=c?0:b[1];var j=t.length,f,k;k=c?a.labels.tooShort:w?Math.round(d*100)/100+" bits":s[b];f=n[b];c=n[b];d=n[0];u.text(k).css("color",f);for(e=0;e<j;e++)t[e].css("background-color",e<b?c:d)};if(typeof a=="undefined")a={};if(typeof a.labels==="undefined")a.labels={};a.labels=h.extend({tooShort:"Too short",passwordStrength:"Password strength:"},a.labels);m=h("<span>").css("display","inline-block").addClass("passStrengthify");return h(this).each(function(){a.element?
a.element.append(m):h(this).parent().append(m);if(a.minimum)v=a.minimum;if(typeof a.security=="undefined")a.security=1;if(a.security>=0&&a.security<r.length)i=r[a.security];if(!a.levels)a.levels=s;if(!a.colours)a.colours=n;if(!a.tests)a.tests=i;if(a.levels&&a.colours&&a.tests)if(a.levels.length==a.colours.length&&a.colours.length==a.tests.length+1){s=a.levels;n=a.colours;i=a.tests}if(a.rawEntropy)w=true;m.append(h("<div>").append(h("<span>").css("font-size","smaller").text(a.labels.passwordStrength).append(u)));
var b=Math.round((125-3*i.length)/i.length);for(e=0;e<i.length;e++){var c=h("<span>").css("height","3px").css("width",b+"px").css("margin-right","3px").css("max-height","3px").css("font-size","1px").css("float","left");t.push(c);m.append(c)}q.keypress(x);q.keyup(x);q.trigger("keyup")})}})(jQuery);
/*! jQuery Validation Plugin - v1.11.1 - 3/22/2013\n* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2013 Jörn Zaefferer; Licensed MIT */
(function(t){t.extend(t.fn,{validate:function(e){if(!this.length)return e&&e.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."),void 0;var i=t.data(this[0],"validator");return i?i:(this.attr("novalidate","novalidate"),i=new t.validator(e,this[0]),t.data(this[0],"validator",i),i.settings.onsubmit&&(this.validateDelegate(":submit","click",function(e){i.settings.submitHandler&&(i.submitButton=e.target),t(e.target).hasClass("cancel")&&(i.cancelSubmit=!0),void 0!==t(e.target).attr("formnovalidate")&&(i.cancelSubmit=!0)}),this.submit(function(e){function s(){var s;return i.settings.submitHandler?(i.submitButton&&(s=t("<input type='hidden'/>").attr("name",i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)),i.settings.submitHandler.call(i,i.currentForm,e),i.submitButton&&s.remove(),!1):!0}return i.settings.debug&&e.preventDefault(),i.cancelSubmit?(i.cancelSubmit=!1,s()):i.form()?i.pendingRequest?(i.formSubmitted=!0,!1):s():(i.focusInvalid(),!1)})),i)},valid:function(){if(t(this[0]).is("form"))return this.validate().form();var e=!0,i=t(this[0].form).validate();return this.each(function(){e=e&&i.element(this)}),e},removeAttrs:function(e){var i={},s=this;return t.each(e.split(/\s/),function(t,e){i[e]=s.attr(e),s.removeAttr(e)}),i},rules:function(e,i){var s=this[0];if(e){var r=t.data(s.form,"validator").settings,n=r.rules,a=t.validator.staticRules(s);switch(e){case"add":t.extend(a,t.validator.normalizeRule(i)),delete a.messages,n[s.name]=a,i.messages&&(r.messages[s.name]=t.extend(r.messages[s.name],i.messages));break;case"remove":if(!i)return delete n[s.name],a;var u={};return t.each(i.split(/\s/),function(t,e){u[e]=a[e],delete a[e]}),u}}var o=t.validator.normalizeRules(t.extend({},t.validator.classRules(s),t.validator.attributeRules(s),t.validator.dataRules(s),t.validator.staticRules(s)),s);if(o.required){var l=o.required;delete o.required,o=t.extend({required:l},o)}return o}}),t.extend(t.expr[":"],{blank:function(e){return!t.trim(""+t(e).val())},filled:function(e){return!!t.trim(""+t(e).val())},unchecked:function(e){return!t(e).prop("checked")}}),t.validator=function(e,i){this.settings=t.extend(!0,{},t.validator.defaults,e),this.currentForm=i,this.init()},t.validator.format=function(e,i){return 1===arguments.length?function(){var i=t.makeArray(arguments);return i.unshift(e),t.validator.format.apply(this,i)}:(arguments.length>2&&i.constructor!==Array&&(i=t.makeArray(arguments).slice(1)),i.constructor!==Array&&(i=[i]),t.each(i,function(t,i){e=e.replace(RegExp("\\{"+t+"\\}","g"),function(){return i})}),e)},t.extend(t.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:!0,errorContainer:t([]),errorLabelContainer:t([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(t){this.lastActive=t,this.settings.focusCleanup&&!this.blockFocusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,t,this.settings.errorClass,this.settings.validClass),this.addWrapper(this.errorsFor(t)).hide())},onfocusout:function(t){this.checkable(t)||!(t.name in this.submitted)&&this.optional(t)||this.element(t)},onkeyup:function(t,e){(9!==e.which||""!==this.elementValue(t))&&(t.name in this.submitted||t===this.lastElement)&&this.element(t)},onclick:function(t){t.name in this.submitted?this.element(t):t.parentNode.name in this.submitted&&this.element(t.parentNode)},highlight:function(e,i,s){"radio"===e.type?this.findByName(e.name).addClass(i).removeClass(s):t(e).addClass(i).removeClass(s)},unhighlight:function(e,i,s){"radio"===e.type?this.findByName(e.name).removeClass(i).addClass(s):t(e).removeClass(i).addClass(s)}},setDefaults:function(e){t.extend(t.validator.defaults,e)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:t.validator.format("Please enter no more than {0} characters."),minlength:t.validator.format("Please enter at least {0} characters."),rangelength:t.validator.format("Please enter a value between {0} and {1} characters long."),range:t.validator.format("Please enter a value between {0} and {1}."),max:t.validator.format("Please enter a value less than or equal to {0}."),min:t.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){function e(e){var i=t.data(this[0].form,"validator"),s="on"+e.type.replace(/^validate/,"");i.settings[s]&&i.settings[s].call(i,this[0],e)}this.labelContainer=t(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||t(this.currentForm),this.containers=t(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var i=this.groups={};t.each(this.settings.groups,function(e,s){"string"==typeof s&&(s=s.split(/\s/)),t.each(s,function(t,s){i[s]=e})});var s=this.settings.rules;t.each(s,function(e,i){s[e]=t.validator.normalizeRule(i)}),t(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ","focusin focusout keyup",e).validateDelegate("[type='radio'], [type='checkbox'], select, option","click",e),this.settings.invalidHandler&&t(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){return this.checkForm(),t.extend(this.submitted,this.errorMap),this.invalid=t.extend({},this.errorMap),this.valid()||t(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var t=0,e=this.currentElements=this.elements();e[t];t++)this.check(e[t]);return this.valid()},element:function(e){e=this.validationTargetFor(this.clean(e)),this.lastElement=e,this.prepareElement(e),this.currentElements=t(e);var i=this.check(e)!==!1;return i?delete this.invalid[e.name]:this.invalid[e.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),i},showErrors:function(e){if(e){t.extend(this.errorMap,e),this.errorList=[];for(var i in e)this.errorList.push({message:e[i],element:this.findByName(i)[0]});this.successList=t.grep(this.successList,function(t){return!(t.name in e)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){t.fn.resetForm&&t(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors(),this.elements().removeClass(this.settings.errorClass).removeData("previousValue")},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(t){var e=0;for(var i in t)e++;return e},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{t(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(e){}},findLastActive:function(){var e=this.lastActive;return e&&1===t.grep(this.errorList,function(t){return t.element.name===e.name}).length&&e},elements:function(){var e=this,i={};return t(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){return!this.name&&e.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.name in i||!e.objectLength(t(this).rules())?!1:(i[this.name]=!0,!0)})},clean:function(e){return t(e)[0]},errors:function(){var e=this.settings.errorClass.replace(" ",".");return t(this.settings.errorElement+"."+e,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=t([]),this.toHide=t([]),this.currentElements=t([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(t){this.reset(),this.toHide=this.errorsFor(t)},elementValue:function(e){var i=t(e).attr("type"),s=t(e).val();return"radio"===i||"checkbox"===i?t("input[name='"+t(e).attr("name")+"']:checked").val():"string"==typeof s?s.replace(/\r/g,""):s},check:function(e){e=this.validationTargetFor(this.clean(e));var i,s=t(e).rules(),r=!1,n=this.elementValue(e);for(var a in s){var u={method:a,parameters:s[a]};try{if(i=t.validator.methods[a].call(this,n,e,u.parameters),"dependency-mismatch"===i){r=!0;continue}if(r=!1,"pending"===i)return this.toHide=this.toHide.not(this.errorsFor(e)),void 0;if(!i)return this.formatAndAdd(e,u),!1}catch(o){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+e.id+", check the '"+u.method+"' method.",o),o}}return r?void 0:(this.objectLength(s)&&this.successList.push(e),!0)},customDataMessage:function(e,i){return t(e).data("msg-"+i.toLowerCase())||e.attributes&&t(e).attr("data-msg-"+i.toLowerCase())},customMessage:function(t,e){var i=this.settings.messages[t];return i&&(i.constructor===String?i:i[e])},findDefined:function(){for(var t=0;arguments.length>t;t++)if(void 0!==arguments[t])return arguments[t];return void 0},defaultMessage:function(e,i){return this.findDefined(this.customMessage(e.name,i),this.customDataMessage(e,i),!this.settings.ignoreTitle&&e.title||void 0,t.validator.messages[i],"<strong>Warning: No message defined for "+e.name+"</strong>")},formatAndAdd:function(e,i){var s=this.defaultMessage(e,i.method),r=/\$?\{(\d+)\}/g;"function"==typeof s?s=s.call(this,i.parameters,e):r.test(s)&&(s=t.validator.format(s.replace(r,"{$1}"),i.parameters)),this.errorList.push({message:s,element:e}),this.errorMap[e.name]=s,this.submitted[e.name]=s},addWrapper:function(t){return this.settings.wrapper&&(t=t.add(t.parent(this.settings.wrapper))),t},defaultShowErrors:function(){var t,e;for(t=0;this.errorList[t];t++){var i=this.errorList[t];this.settings.highlight&&this.settings.highlight.call(this,i.element,this.settings.errorClass,this.settings.validClass),this.showLabel(i.element,i.message)}if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(t=0;this.successList[t];t++)this.showLabel(this.successList[t]);if(this.settings.unhighlight)for(t=0,e=this.validElements();e[t];t++)this.settings.unhighlight.call(this,e[t],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return t(this.errorList).map(function(){return this.element})},showLabel:function(e,i){var s=this.errorsFor(e);s.length?(s.removeClass(this.settings.validClass).addClass(this.settings.errorClass),s.html(i)):(s=t("<"+this.settings.errorElement+">").attr("for",this.idOrName(e)).addClass(this.settings.errorClass).html(i||""),this.settings.wrapper&&(s=s.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.append(s).length||(this.settings.errorPlacement?this.settings.errorPlacement(s,t(e)):s.insertAfter(e))),!i&&this.settings.success&&(s.text(""),"string"==typeof this.settings.success?s.addClass(this.settings.success):this.settings.success(s,e)),this.toShow=this.toShow.add(s)},errorsFor:function(e){var i=this.idOrName(e);return this.errors().filter(function(){return t(this).attr("for")===i})},idOrName:function(t){return this.groups[t.name]||(this.checkable(t)?t.name:t.id||t.name)},validationTargetFor:function(t){return this.checkable(t)&&(t=this.findByName(t.name).not(this.settings.ignore)[0]),t},checkable:function(t){return/radio|checkbox/i.test(t.type)},findByName:function(e){return t(this.currentForm).find("[name='"+e+"']")},getLength:function(e,i){switch(i.nodeName.toLowerCase()){case"select":return t("option:selected",i).length;case"input":if(this.checkable(i))return this.findByName(i.name).filter(":checked").length}return e.length},depend:function(t,e){return this.dependTypes[typeof t]?this.dependTypes[typeof t](t,e):!0},dependTypes:{"boolean":function(t){return t},string:function(e,i){return!!t(e,i.form).length},"function":function(t,e){return t(e)}},optional:function(e){var i=this.elementValue(e);return!t.validator.methods.required.call(this,i,e)&&"dependency-mismatch"},startRequest:function(t){this.pending[t.name]||(this.pendingRequest++,this.pending[t.name]=!0)},stopRequest:function(e,i){this.pendingRequest--,0>this.pendingRequest&&(this.pendingRequest=0),delete this.pending[e.name],i&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(t(this.currentForm).submit(),this.formSubmitted=!1):!i&&0===this.pendingRequest&&this.formSubmitted&&(t(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(e){return t.data(e,"previousValue")||t.data(e,"previousValue",{old:null,valid:!0,message:this.defaultMessage(e,"remote")})}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(e,i){e.constructor===String?this.classRuleSettings[e]=i:t.extend(this.classRuleSettings,e)},classRules:function(e){var i={},s=t(e).attr("class");return s&&t.each(s.split(" "),function(){this in t.validator.classRuleSettings&&t.extend(i,t.validator.classRuleSettings[this])}),i},attributeRules:function(e){var i={},s=t(e),r=s[0].getAttribute("type");for(var n in t.validator.methods){var a;"required"===n?(a=s.get(0).getAttribute(n),""===a&&(a=!0),a=!!a):a=s.attr(n),/min|max/.test(n)&&(null===r||/number|range|text/.test(r))&&(a=Number(a)),a?i[n]=a:r===n&&"range"!==r&&(i[n]=!0)}return i.maxlength&&/-1|2147483647|524288/.test(i.maxlength)&&delete i.maxlength,i},dataRules:function(e){var i,s,r={},n=t(e);for(i in t.validator.methods)s=n.data("rule-"+i.toLowerCase()),void 0!==s&&(r[i]=s);return r},staticRules:function(e){var i={},s=t.data(e.form,"validator");return s.settings.rules&&(i=t.validator.normalizeRule(s.settings.rules[e.name])||{}),i},normalizeRules:function(e,i){return t.each(e,function(s,r){if(r===!1)return delete e[s],void 0;if(r.param||r.depends){var n=!0;switch(typeof r.depends){case"string":n=!!t(r.depends,i.form).length;break;case"function":n=r.depends.call(i,i)}n?e[s]=void 0!==r.param?r.param:!0:delete e[s]}}),t.each(e,function(s,r){e[s]=t.isFunction(r)?r(i):r}),t.each(["minlength","maxlength"],function(){e[this]&&(e[this]=Number(e[this]))}),t.each(["rangelength","range"],function(){var i;e[this]&&(t.isArray(e[this])?e[this]=[Number(e[this][0]),Number(e[this][1])]:"string"==typeof e[this]&&(i=e[this].split(/[\s,]+/),e[this]=[Number(i[0]),Number(i[1])]))}),t.validator.autoCreateRanges&&(e.min&&e.max&&(e.range=[e.min,e.max],delete e.min,delete e.max),e.minlength&&e.maxlength&&(e.rangelength=[e.minlength,e.maxlength],delete e.minlength,delete e.maxlength)),e},normalizeRule:function(e){if("string"==typeof e){var i={};t.each(e.split(/\s/),function(){i[this]=!0}),e=i}return e},addMethod:function(e,i,s){t.validator.methods[e]=i,t.validator.messages[e]=void 0!==s?s:t.validator.messages[e],3>i.length&&t.validator.addClassRules(e,t.validator.normalizeRule(e))},methods:{required:function(e,i,s){if(!this.depend(s,i))return"dependency-mismatch";if("select"===i.nodeName.toLowerCase()){var r=t(i).val();return r&&r.length>0}return this.checkable(i)?this.getLength(e,i)>0:t.trim(e).length>0},email:function(t,e){return this.optional(e)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(t)},url:function(t,e){return this.optional(e)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t)},date:function(t,e){return this.optional(e)||!/Invalid|NaN/.test(""+new Date(t))},dateISO:function(t,e){return this.optional(e)||/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(t)},number:function(t,e){return this.optional(e)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)},digits:function(t,e){return this.optional(e)||/^\d+$/.test(t)},creditcard:function(t,e){if(this.optional(e))return"dependency-mismatch";if(/[^0-9 \-]+/.test(t))return!1;var i=0,s=0,r=!1;t=t.replace(/\D/g,"");for(var n=t.length-1;n>=0;n--){var a=t.charAt(n);s=parseInt(a,10),r&&(s*=2)>9&&(s-=9),i+=s,r=!r}return 0===i%10},minlength:function(e,i,s){var r=t.isArray(e)?e.length:this.getLength(t.trim(e),i);return this.optional(i)||r>=s},maxlength:function(e,i,s){var r=t.isArray(e)?e.length:this.getLength(t.trim(e),i);return this.optional(i)||s>=r},rangelength:function(e,i,s){var r=t.isArray(e)?e.length:this.getLength(t.trim(e),i);return this.optional(i)||r>=s[0]&&s[1]>=r},min:function(t,e,i){return this.optional(e)||t>=i},max:function(t,e,i){return this.optional(e)||i>=t},range:function(t,e,i){return this.optional(e)||t>=i[0]&&i[1]>=t},equalTo:function(e,i,s){var r=t(s);return this.settings.onfocusout&&r.unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){t(i).valid()}),e===r.val()},remote:function(e,i,s){if(this.optional(i))return"dependency-mismatch";var r=this.previousValue(i);if(this.settings.messages[i.name]||(this.settings.messages[i.name]={}),r.originalMessage=this.settings.messages[i.name].remote,this.settings.messages[i.name].remote=r.message,s="string"==typeof s&&{url:s}||s,r.old===e)return r.valid;r.old=e;var n=this;this.startRequest(i);var a={};return a[i.name]=e,t.ajax(t.extend(!0,{url:s,mode:"abort",port:"validate"+i.name,dataType:"json",data:a,success:function(s){n.settings.messages[i.name].remote=r.originalMessage;var a=s===!0||"true"===s;if(a){var u=n.formSubmitted;n.prepareElement(i),n.formSubmitted=u,n.successList.push(i),delete n.invalid[i.name],n.showErrors()}else{var o={},l=s||n.defaultMessage(i,"remote");o[i.name]=r.message=t.isFunction(l)?l(e):l,n.invalid[i.name]=!0,n.showErrors(o)}r.valid=a,n.stopRequest(i,a)}},s)),"pending"}}}),t.format=t.validator.format})(jQuery),function(t){var e={};if(t.ajaxPrefilter)t.ajaxPrefilter(function(t,i,s){var r=t.port;"abort"===t.mode&&(e[r]&&e[r].abort(),e[r]=s)});else{var i=t.ajax;t.ajax=function(s){var r=("mode"in s?s:t.ajaxSettings).mode,n=("port"in s?s:t.ajaxSettings).port;return"abort"===r?(e[n]&&e[n].abort(),e[n]=i.apply(this,arguments),e[n]):i.apply(this,arguments)}}}(jQuery),function(t){t.extend(t.fn,{validateDelegate:function(e,i,s){return this.bind(i,function(i){var r=t(i.target);return r.is(e)?s.apply(r,arguments):void 0})}})}(jQuery);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*!
* jQuery Password Strength plugin for Twitter Bootstrap
*
* Copyright (c) 2008-2013 Tane Piper
* Copyright (c) 2013 Alejandro Blanco
* Dual licensed under the MIT and GPL licenses.
*/


(function (jQuery) {
// Source: src/rules.js




var rulesEngine = {};

try {
    if (!jQuery && module && module.exports) {
        var jQuery = require("jquery");
    }
} catch (ignore) {}

(function ($, rulesEngine) {
    "use strict";
    var validation = {};

    rulesEngine.forbiddenSequences = [
        "0123456789", "9876543210", "abcdefghijklmnopqrstuvxywz",
        "qwertyuiop", "asdfghjkl", "zxcvbnm"
    ];

    validation.wordNotEmail = function (options, word, score) {
        if (word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i)) {
            options.instances.errors.push(options.ui.spanError(options, "email_as_password"));
            return score;
        }
    };

    validation.wordLength = function (options, word, score) {
        var wordlen = word.length,
            lenScore = Math.pow(wordlen, options.rules.raisePower);
        if (wordlen < options.common.minChar) {
            lenScore = (lenScore + score);
            options.instances.errors.push(options.ui.spanError(options, "password_too_short"));
        }
        return lenScore;
    };

    validation.wordSimilarToUsername = function (options, word, score) {
        var username = $(options.common.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
            options.instances.errors.push(options.ui.spanError(options, "same_as_username"));
            return score;
        }
        return false;
    };

    validation.wordTwoCharacterClasses = function (options, word, score) {
        if (word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ||
                (word.match(/([a-zA-Z])/) && word.match(/([0-9])/)) ||
                (word.match(/(.[!,@,#,$,%,\^,&,*,?,_,~])/) && word.match(/[a-zA-Z0-9_]/))) {
            return score;
        }
        options.instances.errors.push(options.ui.spanError(options, "two_character_classes"));
        return false;
    };

    validation.wordRepetitions = function (options, word, score) {
        if (word.match(/(.)\1\1/)) {
            options.instances.errors.push(options.ui.spanError(options, "repeated_character"));
            return score;
        }
        return false;
    };

    validation.wordSequences = function (options, word, score) {
        var found = false,
            j;
        if (word.length > 2) {
            $.each(rulesEngine.forbiddenSequences, function (idx, sequence) {
                for (j = 0; j < (word.length - 3); j += 1) { //iterate the word trough a sliding window of size 3:
                    if (sequence.indexOf(word.toLowerCase().substring(j, j + 3)) > -1) {
                        found = true;
                    }
                }
            });
            if (found) {
                options.instances.errors.push(options.ui.spanError(options, "sequence_found"));
                return score;
            }
        }
        return false;
    };

    validation.wordLowercase = function (options, word, score) {
        return word.match(/[a-z]/) && score;
    };

    validation.wordUppercase = function (options, word, score) {
        return word.match(/[A-Z]/) && score;
    };

    validation.wordOneNumber = function (options, word, score) {
        return word.match(/\d+/) && score;
    };

    validation.wordThreeNumbers = function (options, word, score) {
        return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
    };

    validation.wordOneSpecialChar = function (options, word, score) {
        return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
    };

    validation.wordTwoSpecialChar = function (options, word, score) {
        return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
    };

    validation.wordUpperLowerCombo = function (options, word, score) {
        return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
    };

    validation.wordLetterNumberCombo = function (options, word, score) {
        return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
    };

    validation.wordLetterNumberCharCombo = function (options, word, score) {
        return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
    };

    rulesEngine.validation = validation;

    rulesEngine.executeRules = function (options, word) {
        var totalScore = 0;

        $.each(options.rules.activated, function (rule, active) {
            if (active) {
                var score = options.rules.scores[rule],
                    funct = rulesEngine.validation[rule],
                    result;

                if (!$.isFunction(funct)) {
                    funct = options.rules.extra[rule];
                }

                if ($.isFunction(funct)) {
                    result = funct(options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                }
            }
        });

        return totalScore;
    };
}(jQuery, rulesEngine));

try {
    if (module && module.exports) {
        module.exports = rulesEngine;
    }
} catch (ignore) {}

// Source: src/options.js




var defaultOptions = {};

defaultOptions.common = {};
defaultOptions.common.minChar = 6;
defaultOptions.common.usernameField = "#username";
defaultOptions.common.onLoad = undefined;
defaultOptions.common.onKeyUp = undefined;
defaultOptions.common.zxcvbn = false;

defaultOptions.rules = {};
defaultOptions.rules.extra = {};
defaultOptions.rules.scores = {
    wordNotEmail: -100,
    wordLength: -50,
    wordSimilarToUsername: -100,
    wordSequences: -50,
    wordTwoCharacterClasses: 2,
    wordRepetitions: -25,
    wordLowercase: 1,
    wordUppercase: 3,
    wordOneNumber: 3,
    wordThreeNumbers: 5,
    wordOneSpecialChar: 3,
    wordTwoSpecialChar: 5,
    wordUpperLowerCombo: 2,
    wordLetterNumberCombo: 2,
    wordLetterNumberCharCombo: 2
};
defaultOptions.rules.activated = {
    wordNotEmail: true,
    wordLength: true,
    wordSimilarToUsername: true,
    wordSequences: true,
    wordTwoCharacterClasses: false,
    wordRepetitions: false,
    wordLowercase: true,
    wordUppercase: true,
    wordOneNumber: true,
    wordThreeNumbers: true,
    wordOneSpecialChar: true,
    wordTwoSpecialChar: true,
    wordUpperLowerCombo: true,
    wordLetterNumberCombo: true,
    wordLetterNumberCharCombo: true
};
defaultOptions.rules.raisePower = 1.4;

defaultOptions.ui = {};
defaultOptions.ui.bootstrap2 = false;
defaultOptions.ui.showProgressBar = true;
defaultOptions.ui.showPopover = false;
defaultOptions.ui.showStatus = false;
defaultOptions.ui.spanError = function (options, key) {
    "use strict";
    var text = options.ui.errorMessages[key];
    return '<span style="color: #d52929">' + text + '</span>';
};
defaultOptions.ui.errorMessages = {
    password_too_short: "The Password is too short",
    email_as_password: "Do not use your email as your password",
    same_as_username: "Your password cannot contain your username",
    two_character_classes: "Use different character classes",
    repeated_character: "Too many repetitions",
    sequence_found: "Your password contains sequences"
};
defaultOptions.ui.verdicts = ["Weak", "Normal", "Medium", "Strong", "Very Strong"];
defaultOptions.ui.showVerdicts = true;
defaultOptions.ui.showVerdictsInsideProgressBar = false;
defaultOptions.ui.showErrors = false;
defaultOptions.ui.container = undefined;
defaultOptions.ui.viewports = {
    progress: undefined,
    verdict: undefined,
    errors: undefined
};
defaultOptions.ui.scores = [14, 26, 38, 50];

// Source: src/ui.js




var ui = {};

(function ($, ui) {
    "use strict";

    var barClasses = ["danger", "warning", "success"],
        statusClasses = ["error", "warning", "success"];

    ui.getContainer = function (options, $el) {
        var $container;

        $container = $(options.ui.container);
        if (!($container && $container.length === 1)) {
            $container = $el.parent();
        }
        return $container;
    };

    ui.findElement = function ($container, viewport, cssSelector) {
        if (viewport) {
            return $container.find(viewport).find(cssSelector);
        }
        return $container.find(cssSelector);
    };

    ui.getUIElements = function (options, $el) {
        var $container, result;

        if (options.instances.viewports) {
            return options.instances.viewports;
        }

        result = {};
        $container = ui.getContainer(options, $el);
        result.$progressbar = ui.findElement($container, options.ui.viewports.progress, "div.progress");
        if (!options.ui.showPopover) {
            if (options.ui.showVerdictsInsideProgressBar) {
                result.$verdict = result.$progressbar.find("span.password-verdict");
            } else {
                result.$verdict = ui.findElement($container, options.ui.viewports.verdict, "span.password-verdict");
            }
            result.$errors = ui.findElement($container, options.ui.viewports.errors, "ul.error-list");
        }

        options.instances.viewports = result;
        return result;
    };

    ui.initProgressBar = function (options, $el) {
        var $container = ui.getContainer(options, $el),
            progressbar = "<div class='progress'><div class='";

        if (!options.ui.bootstrap2) {
            progressbar += "progress-";
        }
        progressbar += "bar'>";
        if (options.ui.showVerdictsInsideProgressBar) {
            progressbar += "<span class='password-verdict'></span>";
        }
        progressbar += "</div></div>";

        if (options.ui.viewports.progress) {
            $container.find(options.ui.viewports.progress).append(progressbar);
        } else {
            $(progressbar).insertAfter($el);
        }
    };

    ui.initHelper = function (options, $el, html, viewport) {
        var $container = ui.getContainer(options, $el);
        if (viewport) {
            $container.find(viewport).append(html);
        } else {
            $(html).insertAfter($el);
        }
    };

    ui.initVerdict = function (options, $el) {
        ui.initHelper(options, $el, "<span class='password-verdict'></span>",
                        options.ui.viewports.verdict);
    };

    ui.initErrorList = function (options, $el) {
        ui.initHelper(options, $el, "<ul class='error-list'></ul>",
                        options.ui.viewports.errors);
    };

    ui.initPopover = function (options, $el, verdictText) {
        var placement = "auto top",
            html = "";

        if (options.ui.bootstrap2) { placement = "top"; }

        if (options.ui.showVerdicts && verdictText.length > 0) {
            html = "<h5><span class='password-verdict'>" + verdictText +
                "</span></h5>";
        }
        if (options.ui.showErrors) {
            html += "<div><ul class='error-list'>";
            $.each(options.instances.errors, function (idx, err) {
                html += "<li>" + err + "</li>";
            });
            html += "</ul></div>";
        }

        $el.popover("destroy");
        $el.popover({
            html: true,
            placement: placement,
            trigger: "manual",
            content: html
        });
        $el.popover("show");
    };

    ui.initUI = function (options, $el) {
        if (!options.ui.showPopover) {
            if (options.ui.showErrors) { ui.initErrorList(options, $el); }
            if (options.ui.showVerdicts && !options.ui.showVerdictsInsideProgressBar) {
                ui.initVerdict(options, $el);
            }
        }
        // The popover can't be initialized here, it requires to be destroyed
        // and recreated every time its content changes, because it calculates
        // its position based on the size of its content
        if (options.ui.showProgressBar) {
            ui.initProgressBar(options, $el);
        }
    };

    ui.possibleProgressBarClasses = ["danger", "warning", "success"];

    ui.updateProgressBar = function (options, $el, cssClass, percentage) {
        var $progressbar = ui.getUIElements(options, $el).$progressbar,
            $bar = $progressbar.find(".progress-bar"),
            cssPrefix = "progress-";

        if (options.ui.bootstrap2) {
            $bar = $progressbar.find(".bar");
            cssPrefix = "";
        }

        $.each(ui.possibleProgressBarClasses, function (idx, value) {
            $bar.removeClass(cssPrefix + "bar-" + value);
        });
        $bar.addClass(cssPrefix + "bar-" + barClasses[cssClass]);
        $bar.css("width", percentage + '%');
    };

    ui.updateVerdict = function (options, $el, text) {
        var $verdict = ui.getUIElements(options, $el).$verdict;
        $verdict.text(text);
    };

    ui.updateErrors = function (options, $el) {
        var $errors = ui.getUIElements(options, $el).$errors,
            html = "";
        $.each(options.instances.errors, function (idx, err) {
            html += "<li>" + err + "</li>";
        });
        $errors.html(html);
    };

    ui.updateFieldStatus = function (options, $el, cssClass) {
        var targetClass = options.ui.bootstrap2 ? ".control-group" : ".form-group",
            $container = $el.parents(targetClass).first();

        $.each(statusClasses, function (idx, css) {
            if (!options.ui.bootstrap2) { css = "has-" + css; }
            $container.removeClass(css);
        });

        cssClass = statusClasses[cssClass];
        if (!options.ui.bootstrap2) { cssClass = "has-" + cssClass; }
        $container.addClass(cssClass);
    };

    ui.percentage = function (score, maximun) {
        var result = Math.floor(100 * score / maximun);
        result = result < 0 ? 0 : result;
        result = result > 100 ? 100 : result;
        return result;
    };

    ui.updateUI = function (options, $el, score) {
        var cssClass, barPercentage, verdictText;

        if (score <= 0) {
            cssClass = 0;
            verdictText = "";
        } else if (score < options.ui.scores[0]) {
            cssClass = 0;
            verdictText = options.ui.verdicts[0];
        } else if (score < options.ui.scores[1]) {
            cssClass = 0;
            verdictText = options.ui.verdicts[1];
        } else if (score < options.ui.scores[2]) {
            cssClass = 1;
            verdictText = options.ui.verdicts[2];
        } else if (score < options.ui.scores[3]) {
            cssClass = 1;
            verdictText = options.ui.verdicts[3];
        } else {
            cssClass = 2;
            verdictText = options.ui.verdicts[4];
        }

        if (options.ui.showProgressBar) {
            barPercentage = ui.percentage(score, options.ui.scores[3]);
            ui.updateProgressBar(options, $el, cssClass, barPercentage);
        }
        if (options.ui.showStatus) {
            ui.updateFieldStatus(options, $el, cssClass);
        }
        if (options.ui.showPopover) {
            // Popover can't be updated, it has to be recreated
            ui.initPopover(options, $el, verdictText);
        } else {
            if (options.ui.showVerdictsInsideProgressBar || options.ui.showVerdicts) {
                ui.updateVerdict(options, $el, verdictText);
            }
            if (options.ui.showErrors) {
                ui.updateErrors(options, $el);
            }
        }
    };
}(jQuery, ui));

// Source: src/methods.js




var methods = {};

(function ($, methods) {
    "use strict";
    var onKeyUp, applyToAll;

    onKeyUp = function (event) {
        var $el = $(event.target),
            options = $el.data("pwstrength-bootstrap"),
            word = $el.val(),
            score;

        options.instances.errors = [];
        if (options.common.zxcvbn) {
            score = zxcvbn(word).entropy;
        } else {
            score = rulesEngine.executeRules(options, word);
        }
        ui.updateUI(options, $el, score);

        if ($.isFunction(options.common.onKeyUp)) {
            options.common.onKeyUp(event);
        }
    };

    methods.init = function (settings) {
        this.each(function (idx, el) {
            // Make it deep extend (first param) so it extends too the
            // rules and other inside objects
            var clonedDefaults = $.extend(true, {}, defaultOptions),
                localOptions = $.extend(true, clonedDefaults, settings),
                $el = $(el);

            localOptions.instances = {};
            $el.data("pwstrength-bootstrap", localOptions);
            $el.on("keyup", onKeyUp);
            ui.initUI(localOptions, $el);
            if ($.isFunction(localOptions.common.onLoad)) {
                localOptions.common.onLoad();
            }
        });

        return this;
    };

    methods.destroy = function () {
        this.each(function (idx, el) {
            var $el = $(el),
                options = $el.data("pwstrength-bootstrap"),
                elements = ui.getUIElements(options, $el);
            elements.$progressbar.remove();
            elements.$verdict.remove();
            elements.$errors.remove();
            $el.removeData("pwstrength-bootstrap");
        });
    };

    methods.forceUpdate = function () {
        this.each(function (idx, el) {
            var event = { target: el };
            onKeyUp(event);
        });
    };

    methods.addRule = function (name, method, score, active) {
        this.each(function (idx, el) {
            var options = $(el).data("pwstrength-bootstrap");

            options.rules.activated[name] = active;
            options.rules.scores[name] = score;
            options.rules.extra[name] = method;
        });
    };

    applyToAll = function (rule, prop, value) {
        this.each(function (idx, el) {
            $(el).data("pwstrength-bootstrap").rules[prop][rule] = value;
        });
    };

    methods.changeScore = function (rule, score) {
        applyToAll.call(this, rule, "scores", score);
    };

    methods.ruleActive = function (rule, active) {
        applyToAll.call(this, rule, "activated", active);
    };

    $.fn.pwstrength = function (method) {
        var result;

        if (methods[method]) {
            result = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength-bootstrap");
        }

        return result;
    };
}(jQuery, methods));
}(jQuery));
(function() {
  var App;

  App = Ember.Application.create({
    LOG_TRANSITIONS: true
  });

  App.Router.reopen({
    rootURL: '/home'
  });

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//







//= gecoding
//= jquery.passstrengthify
//= jquery.validation.min

;
