
/**
 * @param object THREE.Object3D
 * @constructor
 */

var RemoveActionMaterialMapImageCommand = function ( action, cb ) {
	Command.call( this );
	this.type = 'RemoveActionMaterialMapImageCommand';

	this.action = action;
	this.callback = cb;
	if ( action !== undefined ) {
		this.name = 'Remove action for property ' + action.getProperty();
	}
};

RemoveActionMaterialMapImageCommand.prototype = {
	execute: async function () {
		await this.editor.removeActionMaterialMapImage( this.action );
		this.callback();
	},

	undo: async function () {
		await this.editor.addActionMaterialMapImage( this.material, this.property, this.value );
	},

	toJSON: function () {
	},

	fromJSON: function ( json ) {
	}

};
