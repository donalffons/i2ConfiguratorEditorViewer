
/**
 * @param object THREE.Object3D
 * @constructor
 */

var AddActionMaterialMapImageCommand = function ( material, property, value, cb ) {
	Command.call( this );
	this.type = 'AddActionMaterialMapImageCommand';

	this.material = material;
	this.property = property;
	this.value = value;
	this.callback = cb;
	if ( material !== undefined ) {
		this.name = 'Add action for property ' + property + ' to material ' + material.name;
	}
};

AddActionMaterialMapImageCommand.prototype = {
	execute: async function () {
		let action = await this.editor.addActionMaterialMapImage( this.material, this.property, this.value );
		this.callback(action);
	},

	undo: async function () {
		await this.editor.removeActionMaterialMapImage( this.material, this.property, this.value );
	},

	toJSON: function () {
	},

	fromJSON: function ( json ) {
	}

};
