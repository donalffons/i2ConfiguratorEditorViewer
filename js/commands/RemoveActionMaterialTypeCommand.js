
/**
 * @param object THREE.Object3D
 * @constructor
 */

var RemoveActionMaterialTypeCommand = function ( action, cb ) {
	Command.call( this );
	this.type = 'RemoveActionMaterialTypeCommand';

	this.action = action;
	this.callback = cb;
	if ( action !== undefined ) {
		this.name = 'Remove changed material';
	}
};

RemoveActionMaterialTypeCommand.prototype = {
	execute: async function () {
		await this.editor.removeActionMaterialType( this.action );
		this.callback();
	},

	undo: async function () {
		await this.editor.addActionMaterialType( this.action.getMaterialSelector().getMaterial(), typeof this.action.getMaterialSelector().getMaterial() );
	},

	toJSON: function () {
	},

	fromJSON: function ( json ) {
	}

};
