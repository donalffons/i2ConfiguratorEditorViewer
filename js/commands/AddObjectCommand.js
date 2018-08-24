/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var AddObjectCommand = function ( object, customObject = false ) {

	Command.call( this );

	this.type = 'AddObjectCommand';
	this.customObject = customObject;

	this.object = object;
	if ( object !== undefined ) {

		this.name = 'Add Object: ' + object.name;

	}

};

AddObjectCommand.prototype = {

	execute: function () {

		if(!this.customObject) {
			this.object.overrides = {};
			this.object.overrides.position_default = this.object.position.clone();
			this.object.overrides.position_overridden = false;
			this.object.overrides.position_autoAction = undefined;
			this.object.overrides.rotation_default = this.object.rotation.clone();
			this.object.overrides.rotation_overridden = false;
			this.object.overrides.rotation_autoAction = undefined;
			this.object.overrides.scale_default = this.object.scale.clone();
			this.object.overrides.scale_overridden = false;
			this.object.overrides.scale_autoAction = undefined;
			this.object.traverse(function(o){
				o.overrides = {};
				o.overrides.position_default = o.position.clone();
				o.overrides.position_overridden = false;
				o.overrides.position_autoAction = undefined;
				o.overrides.rotation_default = o.rotation.clone();
				o.overrides.rotation_overridden = false;
				o.overrides.rotation_autoAction = undefined;
				o.overrides.scale_default = o.scale.clone();
				o.overrides.scale_overridden = false;
				o.overrides.scale_autoAction = undefined;
			});
		}

		this.editor.addObject( this.object, this.customObject );
		this.editor.select( this.object );

	},

	undo: function () {

		this.editor.removeObject( this.object );
		this.editor.deselect();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};
