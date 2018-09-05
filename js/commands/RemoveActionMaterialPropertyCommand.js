
/**
 * @param object THREE.Object3D
 * @constructor
 */

var RemoveActionMaterialPropertyCommand = function ( action, cb ) {
	Command.call( this );
	this.type = 'RemoveActionMaterialPropertyCommand';

	this.action = action;
	this.callback = cb;
	if ( action !== undefined ) {
		this.name = 'Remove action for property ' + action.getProperty();
	}
};

RemoveActionMaterialPropertyCommand.prototype = {
	execute: async function () {
		await this.editor.removeActionMaterialProperty( this.action );
		this.callback();
	},

	undo: async function () {
		await this.editor.addActionMaterialProperty( this.material, this.property, this.value );
	},

	toJSON: function () {
	},

	fromJSON: function ( json ) {
	}

};
