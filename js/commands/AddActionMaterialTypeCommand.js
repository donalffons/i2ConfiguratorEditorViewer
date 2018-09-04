
/**
 * @param object THREE.Object3D
 * @constructor
 */

var AddActionMaterialTypeCommand = function ( material, materialType, cb ) {
	Command.call( this );
	this.type = 'AddActionMaterialTypeCommand';

	this.material = material;
	this.materialType = materialType;
	this.callback = cb;
	if ( material !== undefined ) {
		this.name = 'Change material type of material ' + this.material.name + ' to ' + this.materialType;
	}
};

AddActionMaterialTypeCommand.prototype = {
	execute: async function () {
		let action = await this.editor.addActionMaterialType( this.material, this.materialType );
		this.callback(action);
	},

	undo: async function () {
		await this.editor.removeActionMaterialType( this.material.materialType_autoAction );
	},

	toJSON: function () {
	},

	fromJSON: function ( json ) {
	}

};
