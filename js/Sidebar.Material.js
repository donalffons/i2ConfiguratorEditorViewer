/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Material = function ( editor ) {

	var overrideMapImageProperties = [];
	var overrideProperties = [];

	var signals = editor.signals;

	var currentObject;

	var currentMaterialSlot = 0;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// New / Copy / Paste

	var copiedMaterial;

	var managerRow = new UI.Row();

	// Current material slot

	var materialSlotRow = new UI.Row();

	materialSlotRow.add( new UI.Text( 'Slot' ).setWidth( '90px' ) );

	var materialSlotSelect = new UI.Select().setWidth( '170px' ).setFontSize( '12px' ).onChange( update );
	materialSlotSelect.setOptions( { 0: '' } ).setValue( 0 );
	materialSlotRow.add( materialSlotSelect );

	container.add( materialSlotRow );

	managerRow.add( new UI.Text( '' ).setWidth( '90px' ) );

	managerRow.add( new UI.Button( 'New' ).onClick( function () {

		var material = new THREE[ materialClass.getValue() ]();
		editor.execute( new SetMaterialCommand( currentObject, material, currentMaterialSlot ), 'New Material: ' + materialClass.getValue() );
		update();

	} ) );

	managerRow.add( new UI.Button( 'Copy' ).setMarginLeft( '4px' ).onClick( function () {

		copiedMaterial = currentObject.material;

		if ( Array.isArray( copiedMaterial ) ) {

			if ( copiedMaterial.length === 0 ) return;

			copiedMaterial = copiedMaterial[ currentMaterialSlot ];

		}

	} ) );

	managerRow.add( new UI.Button( 'Paste' ).setMarginLeft( '4px' ).onClick( function () {

		if ( copiedMaterial === undefined ) return;

		editor.execute( new SetMaterialCommand( currentObject, copiedMaterial, currentMaterialSlot ), 'Pasted Material: ' + materialClass.getValue() );
		refreshUI();
		update();

	} ) );

	container.add( managerRow );
	managerRow.dom.hidden = true;


	// type

	var materialClassRow = new UI.Row();
	var materialClass = new UI.Select().setOptions( {

		/*'LineBasicMaterial': 'LineBasicMaterial',
		'LineDashedMaterial': 'LineDashedMaterial',
		'MeshBasicMaterial': 'MeshBasicMaterial',
		'MeshDepthMaterial': 'MeshDepthMaterial',
		'MeshNormalMaterial': 'MeshNormalMaterial',*/
		'MeshLambertMaterial': 'MeshLambertMaterial',
		'MeshPhongMaterial': 'MeshPhongMaterial',
		'MeshStandardMaterial': 'MeshStandardMaterial',
		'MeshPhysicalMaterial': 'MeshPhysicalMaterial'/*,
		'ShaderMaterial': 'ShaderMaterial',
		'SpriteMaterial': 'SpriteMaterial'*/

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialClassRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	var materialClassOverride = new UI.Checkbox().onChange( function(){update();});
	materialClassRow.add( materialClassOverride );
	materialClassRow.add( materialClass );

	container.add( materialClassRow );
/*
	// uuid

	var materialUUIDRow = new UI.Row();
	var materialUUID = new UI.Input().setWidth( '102px' ).setFontSize( '12px' ).setDisabled( true );
	var materialUUIDRenew = new UI.Button( 'New' ).setMarginLeft( '7px' ).onClick( function () {

		materialUUID.setValue( THREE.Math.generateUUID() );
		update();

	} );

	materialUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	materialUUIDRow.add( materialUUID );
	materialUUIDRow.add( materialUUIDRenew );

	container.add( materialUUIDRow );
*/
	// name

	var materialNameRow = new UI.Row();
	var materialName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange(function(){
		editor.execute( new SetMaterialValueCommand( editor.selected, 'name', materialName.getValue(), currentMaterialSlot ) );
	} );

	materialNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	materialNameRow.add( materialName );

	container.add( materialNameRow );
	materialName.setEnabled(false);

	// program
/*
	var materialProgramRow = new UI.Row();
	materialProgramRow.add( new UI.Text( 'Program' ).setWidth( '90px' ) );

	var materialProgramInfo = new UI.Button( 'Info' );
	materialProgramInfo.setMarginLeft( '4px' );
	materialProgramInfo.onClick( function () {

		signals.editScript.dispatch( currentObject, 'programInfo' );

	} );
	materialProgramRow.add( materialProgramInfo );

	var materialProgramVertex = new UI.Button( 'Vertex' );
	materialProgramVertex.setMarginLeft( '4px' );
	materialProgramVertex.onClick( function () {

		signals.editScript.dispatch( currentObject, 'vertexShader' );

	} );
	materialProgramRow.add( materialProgramVertex );

	var materialProgramFragment = new UI.Button( 'Fragment' );
	materialProgramFragment.setMarginLeft( '4px' );
	materialProgramFragment.onClick( function () {

		signals.editScript.dispatch( currentObject, 'fragmentShader' );

	} );
	materialProgramRow.add( materialProgramFragment );

	container.add( materialProgramRow );
*/
	// color

	var materialColorRow = new UI.Row();
	var materialColor = new UI.Color().onChange( update );

	materialColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	var materialColorOverride = new UI.Checkbox().onChange( function(){update();});
	materialColorRow.add( materialColorOverride );
	materialColorRow.add( materialColor );

	container.add( materialColorRow );

	overrideProperties["color"] = {
		value: materialColor,
		override: materialColorOverride
	};

	// roughness

	var materialRoughnessRow = new UI.Row();
	var materialRoughness = new UI.Number( 0.5 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialRoughnessRow.add( new UI.Text( 'Roughness' ).setWidth( '90px' ) );
	var materialRoughnessOverride = new UI.Checkbox().onChange( function(){update();});
	materialRoughnessRow.add( materialRoughnessOverride );
	materialRoughnessRow.add( materialRoughness );

	container.add( materialRoughnessRow );

	overrideProperties["roughness"] = {
		value: materialRoughness,
		override: materialRoughnessOverride
	};

	// metalness

	var materialMetalnessRow = new UI.Row();
	var materialMetalness = new UI.Number( 0.5 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialMetalnessRow.add( new UI.Text( 'Metalness' ).setWidth( '90px' ) );
	var materialMetalnessOverride = new UI.Checkbox().onChange( function(){update();});
	materialMetalnessRow.add( materialMetalnessOverride );
	materialMetalnessRow.add( materialMetalness );

	container.add( materialMetalnessRow );

	overrideProperties["metalness"] = {
		value: materialMetalness,
		override: materialMetalnessOverride
	};

	// emissive

	var materialEmissiveRow = new UI.Row();
	var materialEmissive = new UI.Color().setHexValue( 0x000000 ).onChange( update );

	materialEmissiveRow.add( new UI.Text( 'Emissive' ).setWidth( '90px' ) );
	var materialEmissiveOverride = new UI.Checkbox().onChange( function(){update();});
	materialEmissiveRow.add( materialEmissiveOverride );
	materialEmissiveRow.add( materialEmissive );

	container.add( materialEmissiveRow );

	overrideProperties["emissive"] = {
		value: materialEmissive,
		override: materialEmissiveOverride
	};

	// specular

	var materialSpecularRow = new UI.Row();
	var materialSpecular = new UI.Color().setHexValue( 0x111111 ).onChange( update );

	materialSpecularRow.add( new UI.Text( 'Specular' ).setWidth( '90px' ) );
	var materialSpecularOverride = new UI.Checkbox().onChange( function(){update();});
	materialSpecularRow.add( materialSpecularOverride );
	materialSpecularRow.add( materialSpecular );

	container.add( materialSpecularRow );

	overrideProperties["specular"] = {
		value: materialSpecular,
		override: materialSpecularOverride
	};

	// shininess

	var materialShininessRow = new UI.Row();
	var materialShininess = new UI.Number( 30 ).onChange( update );

	materialShininessRow.add( new UI.Text( 'Shininess' ).setWidth( '90px' ) );
	var materialShininessOverride = new UI.Checkbox().onChange( function(){update();});
	materialShininessRow.add( materialShininessOverride );
	materialShininessRow.add( materialShininess );

	container.add( materialShininessRow );

	overrideProperties["shininess"] = {
		value: materialShininess,
		override: materialShininessOverride
	};

	// clearCoat

	var materialClearCoatRow = new UI.Row();
	var materialClearCoat = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialClearCoatRow.add( new UI.Text( 'ClearCoat' ).setWidth( '90px' ) );
	var materialClearCoatOverride = new UI.Checkbox().onChange( function(){update();});
	materialClearCoatRow.add( materialClearCoatOverride );
	materialClearCoatRow.add( materialClearCoat );

	container.add( materialClearCoatRow );

	overrideProperties["clearCoat"] = {
		value: materialClearCoat,
		override: materialClearCoatOverride
	};

	// clearCoatRoughness

	var materialClearCoatRoughnessRow = new UI.Row();
	var materialClearCoatRoughness = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialClearCoatRoughnessRow.add( new UI.Text( 'ClearCoat Roughness' ).setWidth( '90px' ) );
	var materialClearCoatRoughnessOverride = new UI.Checkbox().onChange( function(){update();});
	materialClearCoatRoughnessRow.add( materialClearCoatRoughnessOverride );
	materialClearCoatRoughnessRow.add( materialClearCoatRoughness );

	container.add( materialClearCoatRoughnessRow );

	overrideProperties["clearCoatRoughness"] = {
		value: materialClearCoatRoughness,
		override: materialClearCoatRoughnessOverride
	};

	// vertex colors

	var materialVertexColorsRow = new UI.Row();
	var materialVertexColors = new UI.Select().setOptions( {

		0: 'No',
		1: 'Face',
		2: 'Vertex'

	} ).onChange( update );

	materialVertexColorsRow.add( new UI.Text( 'Vertex Colors' ).setWidth( '90px' ) );
	var materialVertexColorsOverride = new UI.Checkbox().onChange( function(){update();});
	materialVertexColorsRow.add( materialVertexColorsOverride );
	materialVertexColorsRow.add( materialVertexColors );

	container.add( materialVertexColorsRow );

	overrideProperties["vertexColors"] = {
		value: materialVertexColors,
		override: materialVertexColorsOverride
	};

	// skinning

	var materialSkinningRow = new UI.Row();
	var materialSkinning = new UI.Checkbox( false ).onChange( update );

	materialSkinningRow.add( new UI.Text( 'Skinning' ).setWidth( '90px' ) );
	var materialSkinningOverride = new UI.Checkbox().onChange( function(){update();});
	materialSkinningRow.add( materialSkinningOverride );
	materialSkinningRow.add( materialSkinning );

	container.add( materialSkinningRow );

	overrideProperties["skinning"] = {
		value: materialSkinning,
		override: materialSkinningOverride
	};

	// map

	var materialMapRow = new UI.Row();
	var materialMap = new UI.ServerTexture().onChange( function() { update(); } );

	materialMapRow.add( new UI.Text( 'Map' ).setWidth( '90px' ) );
	var materialMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialMapRow.add( materialMapOverride );
	materialMapRow.add( materialMap );

	container.add( materialMapRow );

	overrideMapImageProperties["map"] = {
		value: materialMap,
		override: materialMapOverride
	};

	// alpha map

	var materialAlphaMapRow = new UI.Row();
	var materialAlphaMap = new UI.ServerTexture().onChange( update );

	materialAlphaMapRow.add( new UI.Text( 'Alpha Map' ).setWidth( '90px' ) );
	var materialAlphaMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialAlphaMapRow.add( materialAlphaMapOverride );
	materialAlphaMapRow.add( materialAlphaMap );

	container.add( materialAlphaMapRow );

	overrideMapImageProperties["alphaMap"] = {
		value: materialAlphaMap,
		override: materialAlphaMapOverride
	};

	// bump map

	var materialBumpMapRow = new UI.Row();
	var materialBumpMap = new UI.ServerTexture().onChange( update );
	var materialBumpScale = new UI.Number( 1 ).setWidth( '30px' ).onChange( update );

	materialBumpMapRow.add( new UI.Text( 'Bump Map' ).setWidth( '90px' ) );
	var materialBumpMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialBumpMapRow.add( materialBumpMapOverride );
	materialBumpMapRow.add( materialBumpMap );
	materialBumpMapRow.add( materialBumpScale );

	container.add( materialBumpMapRow );

	overrideMapImageProperties["bumpMap"] = {
		value: materialBumpMap,
		scaleValue: materialBumpScale,
		scaleKey: "bumpScale",
		override: materialBumpMapOverride
	};

	// normal map

	var materialNormalMapRow = new UI.Row();
	var materialNormalMap = new UI.ServerTexture().onChange( update );

	materialNormalMapRow.add( new UI.Text( 'Normal Map' ).setWidth( '90px' ) );
	var materialNormalMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialNormalMapRow.add( materialNormalMapOverride );
	materialNormalMapRow.add( materialNormalMap );

	container.add( materialNormalMapRow );

	overrideMapImageProperties["normalMap"] = {
		value: materialNormalMap,
		override: materialNormalMapOverride
	};

	// displacement map

	var materialDisplacementMapRow = new UI.Row();
	var materialDisplacementMap = new UI.ServerTexture().onChange( update );
	var materialDisplacementScale = new UI.Number( 1 ).setWidth( '30px' ).onChange( update );

	materialDisplacementMapRow.add( new UI.Text( 'Displace Map' ).setWidth( '90px' ) );
	var materialDisplacementMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialDisplacementMapRow.add( materialDisplacementMapOverride );
	materialDisplacementMapRow.add( materialDisplacementMap );
	materialDisplacementMapRow.add( materialDisplacementScale );

	container.add( materialDisplacementMapRow );

	overrideMapImageProperties["displacementMap"] = {
		value: materialDisplacementMap,
		scaleValue: materialDisplacementScale,
		scaleKey: "displacementScale",
		override: materialDisplacementMapOverride
	};

	// roughness map

	var materialRoughnessMapRow = new UI.Row();
	var materialRoughnessMap = new UI.ServerTexture().onChange( update );

	materialRoughnessMapRow.add( new UI.Text( 'Rough. Map' ).setWidth( '90px' ) );
	var materialRoughnessMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialRoughnessMapRow.add( materialRoughnessMapOverride );
	materialRoughnessMapRow.add( materialRoughnessMap );

	container.add( materialRoughnessMapRow );

	overrideMapImageProperties["roughnessMap"] = {
		value: materialRoughnessMap,
		override: materialRoughnessMapOverride
	};

	// metalness map

	var materialMetalnessMapRow = new UI.Row();
	var materialMetalnessMap = new UI.ServerTexture().onChange( update );

	materialMetalnessMapRow.add( new UI.Text( 'Metal. Map' ).setWidth( '90px' ) );
	var materialMetalnessMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialMetalnessMapRow.add( materialMetalnessMapOverride );
	materialMetalnessMapRow.add( materialMetalnessMap );

	container.add( materialMetalnessMapRow );

	overrideMapImageProperties["metalnessMap"] = {
		value: materialMetalnessMap,
		override: materialMetalnessMapOverride
	};

	// specular map

	var materialSpecularMapRow = new UI.Row();
	var materialSpecularMap = new UI.ServerTexture().onChange( update );

	materialSpecularMapRow.add( new UI.Text( 'Specular Map' ).setWidth( '90px' ) );
	var materialSpecularMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialSpecularMapRow.add( materialSpecularMapOverride );
	materialSpecularMapRow.add( materialSpecularMap );

	container.add( materialSpecularMapRow );

	overrideMapImageProperties["specularMap"] = {
		value: materialSpecularMap,
		override: materialSpecularMapOverride
	};

	// env map

	var materialEnvMapRow = new UI.Row();
	var materialEnvMap = new UI.Texture( THREE.SphericalReflectionMapping ).onChange( update );
	var materialReflectivity = new UI.Number( 1 ).setWidth( '30px' ).onChange( update );

	materialEnvMapRow.add( new UI.Text( 'Env Map' ).setWidth( '90px' ) );
	var materialEnvMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialEnvMapRow.add( materialEnvMapOverride );
	materialEnvMapRow.add( materialEnvMap );
	materialEnvMapRow.add( materialReflectivity );

	container.add( materialEnvMapRow );

	overrideMapImageProperties["envMap"] = {
		value: materialEnvMap,
		scaleValue: materialDisplacementScale,
		scaleKey: "reflectivity",
		override: materialEnvMapOverride
	};

	// light map

	var materialLightMapRow = new UI.Row();
	var materialLightMap = new UI.ServerTexture().onChange( update );

	materialLightMapRow.add( new UI.Text( 'Light Map' ).setWidth( '90px' ) );
	var materialLightMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialLightMapRow.add( materialLightMapOverride );
	materialLightMapRow.add( materialLightMap );

	container.add( materialLightMapRow );

	overrideMapImageProperties["lightMap"] = {
		value: materialLightMap,
		override: materialLightMapOverride
	};

	// ambient occlusion map

	var materialAOMapRow = new UI.Row();
	var materialAOMap = new UI.Texture().onChange( update );
	var materialAOScale = new UI.Number( 1 ).setRange( 0, 1 ).setWidth( '30px' ).onChange( update );

	materialAOMapRow.add( new UI.Text( 'AO Map' ).setWidth( '90px' ) );
	var materialAOMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialAOMapRow.add( materialAOMapOverride );
	materialAOMapRow.add( materialAOMap );
	materialAOMapRow.add( materialAOScale );

	container.add( materialAOMapRow );

	overrideMapImageProperties["aoMap"] = {
		value: materialAOMap,
		scaleValue: materialAOScale,
		scaleKey: "aoMapIntensity",
		override: materialAOMapOverride
	};

	// emissive map

	var materialEmissiveMapRow = new UI.Row();
	var materialEmissiveMap = new UI.ServerTexture().onChange( update );

	materialEmissiveMapRow.add( new UI.Text( 'Emissive Map' ).setWidth( '90px' ) );
	var materialEmissiveMapOverride = new UI.Checkbox().onChange( function(){update();});
	materialEmissiveMapRow.add( materialEmissiveMapOverride );
	materialEmissiveMapRow.add( materialEmissiveMap );

	container.add( materialEmissiveMapRow );

	overrideMapImageProperties["emissiveMap"] = {
		value: materialEmissiveMap,
		override: materialEmissiveMapOverride
	};

	// side

	var materialSideRow = new UI.Row();
	var materialSide = new UI.Select().setOptions( {

		0: 'Front',
		1: 'Back',
		2: 'Double'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialSideRow.add( new UI.Text( 'Side' ).setWidth( '90px' ) );
	var materialSideOverride = new UI.Checkbox().onChange( function(){update();});
	materialSideRow.add( materialSideOverride );
	materialSideRow.add( materialSide );

	container.add( materialSideRow );

	overrideProperties["side"] = {
		value: materialSide,
		override: materialSideOverride
	};

	// shading

	var materialShadingRow = new UI.Row();
	var materialShading = new UI.Checkbox(false).setLeft( '100px' ).onChange( update );

	materialShadingRow.add( new UI.Text( 'Flat Shaded' ).setWidth( '90px' ) );
	var materialShadingOverride = new UI.Checkbox().onChange( function(){update();});
	materialShadingRow.add( materialShadingOverride );
	materialShadingRow.add( materialShading );

	container.add( materialShadingRow );

	overrideProperties["flatShading"] = {
		value: materialShading,
		override: materialShadingOverride
	};

	// blending

	var materialBlendingRow = new UI.Row();
	var materialBlending = new UI.Select().setOptions( {

		0: 'No',
		1: 'Normal',
		2: 'Additive',
		3: 'Subtractive',
		4: 'Multiply',
		5: 'Custom'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialBlendingRow.add( new UI.Text( 'Blending' ).setWidth( '90px' ) );
	var materialBlendingOverride = new UI.Checkbox().onChange( function(){update();});
	materialBlendingRow.add( materialBlendingOverride );
	materialBlendingRow.add( materialBlending );

	container.add( materialBlendingRow );
	materialBlendingRow.dom.hidden = true;

	overrideProperties["blending"] = {
		value: materialBlending,
		override: materialBlendingOverride
	};

	// opacity

	var materialOpacityRow = new UI.Row();
	var materialOpacity = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialOpacityRow.add( new UI.Text( 'Opacity' ).setWidth( '90px' ) );
	var materialOpacityOverride = new UI.Checkbox().onChange( function(){update();});
	materialOpacityRow.add( materialOpacityOverride );
	materialOpacityRow.add( materialOpacity );

	container.add( materialOpacityRow );

	overrideProperties["opacity"] = {
		value: materialOpacity,
		override: materialOpacityOverride
	};

	// transparent

	var materialTransparentRow = new UI.Row();
	var materialTransparent = new UI.Checkbox().setLeft( '100px' ).onChange( update );

	materialTransparentRow.add( new UI.Text( 'Transparent' ).setWidth( '90px' ) );
	var materialTransparentOverride = new UI.Checkbox().onChange( function(){update();});
	materialTransparentRow.add( materialTransparentOverride );
	materialTransparentRow.add( materialTransparent );

	container.add( materialTransparentRow );

	overrideProperties["transparent"] = {
		value: materialTransparent,
		override: materialTransparentOverride
	};

	// alpha test

	var materialAlphaTestRow = new UI.Row();
	var materialAlphaTest = new UI.Number().setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialAlphaTestRow.add( new UI.Text( 'Alpha Test' ).setWidth( '90px' ) );
	var materialAlphaTestOverride = new UI.Checkbox().onChange( function(){update();});
	materialAlphaTestRow.add( materialAlphaTestOverride );
	materialAlphaTestRow.add( materialAlphaTest );

	container.add( materialAlphaTestRow );

	overrideProperties["alphaTest"] = {
		value: materialAlphaTest,
		override: materialAlphaTestOverride
	};

	// wireframe

	var materialWireframeRow = new UI.Row();
	var materialWireframe = new UI.Checkbox( false ).onChange( update );
	var materialWireframeLinewidth = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 100 ).onChange( update );

	materialWireframeRow.add( new UI.Text( 'Wireframe' ).setWidth( '90px' ) );
	var materialWireframeOverride = new UI.Checkbox().onChange( function(){update();});
	materialWireframeRow.add( materialWireframeOverride );
	materialWireframeRow.add( materialWireframe );
	var materialWireframeLinewidthOverride = new UI.Checkbox().onChange( function(){update();});
	materialWireframeRow.add( materialWireframeLinewidthOverride );
	materialWireframeRow.add( materialWireframeLinewidth );

	container.add( materialWireframeRow );
	materialWireframeRow.dom.hidden = true;

	//

	function update() {

		var object = currentObject;

		var geometry = object.geometry;

		var previousSelectedSlot = currentMaterialSlot;

		currentMaterialSlot = parseInt( materialSlotSelect.getValue() );

		if ( currentMaterialSlot !== previousSelectedSlot ) refreshUI( true );

		var material = editor.getObjectMaterial( currentObject, currentMaterialSlot );

		var textureWarning = false;
		var objectHasUvs = false;

		if ( object instanceof THREE.Sprite ) objectHasUvs = true;
		if ( geometry instanceof THREE.Geometry && geometry.faceVertexUvs[ 0 ].length > 0 ) objectHasUvs = true;
		if ( geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined ) objectHasUvs = true;

		if ( material ) {

			/*if ( material.uuid !== undefined && material.uuid !== materialUUID.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'uuid', materialUUID.getValue(), currentMaterialSlot ) );

			}*/

			if ( material.userData.overrides ) {
				if(materialClassOverride.dom.checked && (!material.userData.overrides["materialType"] || !material.userData.overrides["materialType"].overridden)) {
					editor.execute(new AddActionMaterialTypeCommand(material, materialClass.getValue(), (action) => {
						material.userData.overrides["materialType"].autoAction = action;
						refreshUI();
					}));
				} else if (!materialClassOverride.dom.checked && material.userData.overrides["materialType"] && material.userData.overrides["materialType"].overridden) {
					editor.execute(new RemoveActionMaterialTypeCommand(material.userData.overrides["materialType"].autoAction, () => {
						delete material.userData.overrides["materialType"].autoAction;
						refreshUI();
					}));
				}
				if(material.userData.overrides["materialType"] && material.userData.overrides["materialType"].overridden && material.userData.overrides["materialType"].autoAction) {
					material.userData.overrides["materialType"].autoAction.getValue().setValueData(materialClass.getValue());
					material.userData.overrides["materialType"].autoAction.execute();
				}

				for (let key in overrideProperties) {
					let value = overrideProperties[key].value.getValue();
					if(key == "vertexColors" || key == "side" || key == "blending") {
						value = parseInt(value);
					}
					if(overrideProperties[key].override.dom.checked && (!material.userData.overrides[key] || !material.userData.overrides[key].overridden)) {
						editor.execute(new AddActionMaterialPropertyCommand(material, key, value, (action) => {
							material.userData.overrides[key].autoAction = action;
							refreshUI();
						}));
					} else if (!overrideProperties[key].override.dom.checked && material.userData.overrides[key] && material.userData.overrides[key].overridden) {
						editor.execute(new RemoveActionMaterialPropertyCommand(material.userData.overrides[key].autoAction, () => {
							delete material.userData.overrides[key]
							refreshUI();
						}));
					}
					if(material.userData.overrides[key] && material.userData.overrides[key].overridden && material.userData.overrides[key].autoAction) {
						material.userData.overrides[key].autoAction.getValue().setValueData(value);
						material.userData.overrides[key].autoAction.execute();
					}
				}
				
				for (let key in overrideMapImageProperties) {
					let materialMapValue = overrideMapImageProperties[key].value.getValue();
					if(materialMapValue != null) {
						let fullPath = decodeURI(materialMapValue.image.src);
						let modelFolder = decodeURI(getModelFolder());
						let relativePath = fullPath.substr(modelFolder.length);
						materialMapValue = relativePath;
					}
					if(overrideMapImageProperties[key].override.dom.checked && (!material.userData.overrides[key] || !material.userData.overrides[key].overridden)) {
						editor.execute(new AddActionMaterialMapImageCommand(material, key, materialMapValue, (action) => {
							material.userData.overrides[key].autoAction = action;
							refreshUI();
						}));
						if(overrideMapImageProperties[key].scaleValue !== undefined) {
							editor.execute(new AddActionMaterialPropertyCommand(material, overrideMapImageProperties[key].scaleKey, overrideMapImageProperties[key].scaleValue.getValue(), (action) => {
								material.userData.overrides[overrideMapImageProperties[key].scaleKey].autoAction = action;
								refreshUI();
							}));
						}
					} else if (!overrideMapImageProperties[key].override.dom.checked && material.userData.overrides[key] && material.userData.overrides[key].overridden) {
						editor.execute(new RemoveActionMaterialMapImageCommand(material.userData.overrides[key].autoAction, () => {
							delete material.userData.overrides[key];
							refreshUI(true);
						}));
						if(overrideMapImageProperties[key].scaleValue !== undefined) {
							editor.execute(new RemoveActionMaterialPropertyCommand(material.userData.overrides[overrideMapImageProperties[key].scaleKey].autoAction, () => {
								delete material.userData.overrides[overrideMapImageProperties[key].scaleKey]
								refreshUI();
							}));
						}
					}
					if(material.userData.overrides[key] && material.userData.overrides[key].overridden && material.userData.overrides[key].autoAction) {
						material.userData.overrides[key].autoAction.getValue().setValueData(materialMapValue);
						material.userData.overrides[key].autoAction.execute();
					}
					if(overrideMapImageProperties[key].scaleValue !== undefined) {
						if(material.userData.overrides[overrideMapImageProperties[key].scaleKey] && material.userData.overrides[overrideMapImageProperties[key].scaleKey].overridden && material.userData.overrides[overrideMapImageProperties[key].scaleKey].autoAction) {
							material.userData.overrides[overrideMapImageProperties[key].scaleKey].autoAction.getValue().setValueData(overrideMapImageProperties[key].scaleValue.getValue());
							material.userData.overrides[overrideMapImageProperties[key].scaleKey].autoAction.execute();
						}
					}
				}
			} else if ( material instanceof THREE[ materialClass.getValue() ] === false ) {

				material = new THREE[ materialClass.getValue() ]();

				editor.execute( new SetMaterialCommand( currentObject, material, currentMaterialSlot ), 'New Material: ' + materialClass.getValue() );
				// TODO Copy other references in the scene graph
				// keeping name and UUID then.
				// Also there should be means to create a unique
				// copy for the current object explicitly and to
				// attach the current material to other objects.

			}

			/*if ( material.color !== undefined && material.color.getHex() !== materialColor.getHexValue() ) {

				editor.execute( new SetMaterialColorCommand( currentObject, 'color', materialColor.getHexValue(), currentMaterialSlot ) );

			}

			if ( material.roughness !== undefined && Math.abs( material.roughness - materialRoughness.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'roughness', materialRoughness.getValue(), currentMaterialSlot ) );

			}

			if ( material.metalness !== undefined && Math.abs( material.metalness - materialMetalness.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'metalness', materialMetalness.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.emissive !== undefined && material.emissive.getHex() !== materialEmissive.getHexValue() ) {

				editor.execute( new SetMaterialColorCommand( currentObject, 'emissive', materialEmissive.getHexValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.specular !== undefined && material.specular.getHex() !== materialSpecular.getHexValue() ) {

				editor.execute( new SetMaterialColorCommand( currentObject, 'specular', materialSpecular.getHexValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.shininess !== undefined && Math.abs( material.shininess - materialShininess.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'shininess', materialShininess.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.clearCoat !== undefined && Math.abs( material.clearCoat - materialClearCoat.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'clearCoat', materialClearCoat.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.clearCoatRoughness !== undefined && Math.abs( material.clearCoatRoughness - materialClearCoatRoughness.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'clearCoatRoughness', materialClearCoatRoughness.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.vertexColors !== undefined ) {

				var vertexColors = parseInt( materialVertexColors.getValue() );

				if ( material.vertexColors !== vertexColors ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'vertexColors', vertexColors, currentMaterialSlot ) );

				}

			}*/

			/*if ( material.skinning !== undefined && material.skinning !== materialSkinning.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'skinning', materialSkinning.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.map !== undefined ) {

				if ( objectHasUvs ) {

					var map = materialMap.getValue() ? materialMap.getValue() : null;
					if ( material.map !== map ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'map', map, currentMaterialSlot ) );

					}

				} else {

					if ( mapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.alphaMap !== undefined ) {

				if ( objectHasUvs ) {

					var alphaMap = mapEnabled ? materialAlphaMap.getValue() : null;
					if ( material.alphaMap !== alphaMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'alphaMap', alphaMap, currentMaterialSlot ) );

					}

				} else {

					if ( mapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.bumpMap !== undefined ) {

				if ( objectHasUvs ) {

					var bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;
					if ( material.bumpMap !== bumpMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'bumpMap', bumpMap, currentMaterialSlot ) );

					}

					if ( material.bumpScale !== materialBumpScale.getValue() ) {

						editor.execute( new SetMaterialValueCommand( currentObject, 'bumpScale', materialBumpScale.getValue(), currentMaterialSlot ) );

					}

				} else {

					if ( bumpMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.normalMap !== undefined ) {

				var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;
					if ( material.normalMap !== normalMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'normalMap', normalMap, currentMaterialSlot ) );

					}

				} else {

					if ( normalMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.displacementMap !== undefined ) {

				var displacementMapEnabled = materialDisplacementMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var displacementMap = displacementMapEnabled ? materialDisplacementMap.getValue() : null;
					if ( material.displacementMap !== displacementMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'displacementMap', displacementMap, currentMaterialSlot ) );

					}

					if ( material.displacementScale !== materialDisplacementScale.getValue() ) {

						editor.execute( new SetMaterialValueCommand( currentObject, 'displacementScale', materialDisplacementScale.getValue(), currentMaterialSlot ) );

					}

				} else {

					if ( displacementMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.roughnessMap !== undefined ) {

				if ( objectHasUvs ) {

					var roughnessMap = roughnessMapEnabled ? materialRoughnessMap.getValue() : null;
					if ( material.roughnessMap !== roughnessMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'roughnessMap', roughnessMap, currentMaterialSlot ) );

					}

				} else {

					if ( roughnessMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.metalnessMap !== undefined ) {

				if ( objectHasUvs ) {

					var metalnessMap = metalnessMapEnabled ? materialMetalnessMap.getValue() : null;
					if ( material.metalnessMap !== metalnessMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'metalnessMap', metalnessMap, currentMaterialSlot ) );

					}

				} else {

					if ( metalnessMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.specularMap !== undefined ) {

				if ( objectHasUvs ) {

					var specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;
					if ( material.specularMap !== specularMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'specularMap', specularMap, currentMaterialSlot ) );

					}

				} else {

					if ( specularMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.envMap !== undefined ) {

				var envMapEnabled = materialEnvMapEnabled.getValue() === true;

				var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

				if ( material.envMap !== envMap ) {

					editor.execute( new SetMaterialMapCommand( currentObject, 'envMap', envMap, currentMaterialSlot ) );

				}

			}

			if ( material.reflectivity !== undefined ) {

				var reflectivity = materialReflectivity.getValue();

				if ( material.reflectivity !== reflectivity ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'reflectivity', reflectivity, currentMaterialSlot ) );

				}

			}*/

			/*if ( material.lightMap !== undefined ) {

				if ( objectHasUvs ) {

					var lightMap = lightMapEnabled ? materialLightMap.getValue() : null;
					if ( material.lightMap !== lightMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'lightMap', lightMap, currentMaterialSlot ) );

					}

				} else {

					if ( lightMapEnabled ) textureWarning = true;

				}

			}*/

			if ( material.aoMap !== undefined ) {

				var aoMapEnabled = materialAOMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var aoMap = aoMapEnabled ? materialAOMap.getValue() : null;
					if ( material.aoMap !== aoMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'aoMap', aoMap, currentMaterialSlot ) );

					}

					if ( material.aoMapIntensity !== materialAOScale.getValue() ) {

						editor.execute( new SetMaterialValueCommand( currentObject, 'aoMapIntensity', materialAOScale.getValue(), currentMaterialSlot ) );

					}

				} else {

					if ( aoMapEnabled ) textureWarning = true;

				}

			}

			/*if ( material.emissiveMap !== undefined ) {

				if ( objectHasUvs ) {

					var emissiveMap = emissiveMapEnabled ? materialEmissiveMap.getValue() : null;
					if ( material.emissiveMap !== emissiveMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'emissiveMap', emissiveMap, currentMaterialSlot ) );

					}

				} else {

					if ( emissiveMapEnabled ) textureWarning = true;

				}

			}*/

			/*if ( material.side !== undefined ) {

				var side = parseInt( materialSide.getValue() );
				if ( material.side !== side ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'side', side, currentMaterialSlot ) );

				}


			}*/

			/*if ( material.flatShading !== undefined ) {

				var flatShading = materialShading.getValue();
				if ( material.flatShading != flatShading ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'flatShading', flatShading, currentMaterialSlot ) );

				}

			}*/

			/*if ( material.blending !== undefined ) {

				var blending = parseInt( materialBlending.getValue() );
				if ( material.blending !== blending ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'blending', blending, currentMaterialSlot ) );

				}

			}*/

			/*if ( material.opacity !== undefined && Math.abs( material.opacity - materialOpacity.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'opacity', materialOpacity.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.transparent !== undefined && material.transparent !== materialTransparent.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'transparent', materialTransparent.getValue(), currentMaterialSlot ) );

			}*/

			/*if ( material.alphaTest !== undefined && Math.abs( material.alphaTest - materialAlphaTest.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'alphaTest', materialAlphaTest.getValue(), currentMaterialSlot ) );

			}*/

			if ( material.wireframe !== undefined && material.wireframe !== materialWireframe.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'wireframe', materialWireframe.getValue(), currentMaterialSlot) );

			}

			if ( material.wireframeLinewidth !== undefined && Math.abs( material.wireframeLinewidth - materialWireframeLinewidth.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'wireframeLinewidth', materialWireframeLinewidth.getValue(), currentMaterialSlot ) );

			}

			if ( material.name !== undefined ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'name', materialName.getValue(), currentMaterialSlot ) );
				
			}

			refreshUI();

		}

		if ( textureWarning ) {

			console.warn( "Can't set texture, model doesn't have texture coordinates" );

		}

	}

	//

	function setRowVisibility() {

		var properties = {
			'name': materialNameRow,
			'color': materialColorRow,
			'roughness': materialRoughnessRow,
			'metalness': materialMetalnessRow,
			'emissive': materialEmissiveRow,
			'specular': materialSpecularRow,
			'shininess': materialShininessRow,
			'clearCoat': materialClearCoatRow,
			'clearCoatRoughness': materialClearCoatRoughnessRow,
			/*'vertexShader': materialProgramRow,*/
			'vertexColors': materialVertexColorsRow,
			'skinning': materialSkinningRow,
			'map': materialMapRow,
			'alphaMap': materialAlphaMapRow,
			'bumpMap': materialBumpMapRow,
			'normalMap': materialNormalMapRow,
			'displacementMap': materialDisplacementMapRow,
			'roughnessMap': materialRoughnessMapRow,
			'metalnessMap': materialMetalnessMapRow,
			'specularMap': materialSpecularMapRow,
			'envMap': materialEnvMapRow,
			'lightMap': materialLightMapRow,
			'aoMap': materialAOMapRow,
			'emissiveMap': materialEmissiveMapRow,
			'side': materialSideRow,
			'flatShading': materialShadingRow,
			'blending': materialBlendingRow,
			'opacity': materialOpacityRow,
			'transparent': materialTransparentRow,
			'alphaTest': materialAlphaTestRow,
			'wireframe': materialWireframeRow
		};

		var material = currentObject.material;

		if ( Array.isArray( material ) ) {

			materialSlotRow.setDisplay( '' );

			if ( material.length === 0 ) return;

			material = material[ currentMaterialSlot ];

		} else {

			materialSlotRow.setDisplay( 'none' );

		}

		for ( var property in properties ) {

			properties[ property ].setDisplay( material[ property ] !== undefined ? '' : 'none' );

		}

	}


	function refreshUI( resetTextureSelectors ) {

		if ( ! currentObject ) return;

		var material = currentObject.material;
		
		if(material.userData.overrides) {
			materialClassOverride.dom.hidden = false;
			materialClassOverride.dom.checked = material.userData.overrides["materialType"] ? material.userData.overrides["materialType"].overridden : false;
			materialClass.setEnabled(material.userData.overrides["materialType"] ? material.userData.overrides["materialType"].overridden : false);

			for (let key in overrideMapImageProperties) {
				overrideMapImageProperties[key].override.dom.hidden = false;
				overrideMapImageProperties[key].override.dom.checked = material.userData.overrides[key] ? material.userData.overrides[key].overridden : false;
				overrideMapImageProperties[key].value.setEnabled(material.userData.overrides[key] ? material.userData.overrides[key].overridden : false);
				if(overrideMapImageProperties[key].scaleValue !== undefined) {
					overrideMapImageProperties[key].scaleValue.dom.hidden = false;
					overrideMapImageProperties[key].scaleValue.setEnabled(material.userData.overrides[key] ? material.userData.overrides[key].overridden : false);
				}
			}
			
			for (let key in overrideProperties) {
				overrideProperties[key].override.dom.hidden = false;
				overrideProperties[key].override.dom.checked = material.userData.overrides[key] ? material.userData.overrides[key].overridden : false;
				overrideProperties[key].value.setEnabled(material.userData.overrides[key] ? material.userData.overrides[key].overridden : false);
			}
		} else {
			materialClassOverride.dom.hidden = true;
			materialClassOverride.dom.checked = false;
			materialClass.setEnabled(true);

			for (let key in overrideMapImageProperties) {
				overrideMapImageProperties[key].override.dom.hidden = false;
				overrideMapImageProperties[key].override.dom.checked = false;
				overrideMapImageProperties[key].value.setEnabled(true);
				if(overrideMapImageProperties[key].scaleValue !== undefined) {
					overrideMapImageProperties[key].scaleValue.dom.hidden = false;
					overrideMapImageProperties[key].scaleValue.setEnabled(true);
				}
			}

			for (let key in overrideProperties) {
				overrideProperties[key].override.dom.hidden = false;
				overrideProperties[key].override.dom.checked = false;
				overrideProperties[key].value.setEnabled(true);
			}
		}

		if ( Array.isArray( material ) ) {

			var slotOptions = {};

			currentMaterialSlot = Math.max( 0, Math.min( material.length, currentMaterialSlot ) );

			for ( var i = 0; i < material.length; i ++ ) {

				slotOptions[ i ] = String( i + 1 ) + ': ' + material[ i ].name;

			}

			materialSlotSelect.setOptions( slotOptions ).setValue( currentMaterialSlot );

		}

		material = editor.getObjectMaterial( currentObject, currentMaterialSlot );
/*
		if ( material.uuid !== undefined ) {

			materialUUID.setValue( material.uuid );

		}*/

		if ( material.name !== undefined ) {

			materialName.setValue( material.name );

		}

		materialClass.setValue( material.type );

		if ( material.color !== undefined ) {

			materialColor.setHexValue( material.color.getHexString() );

		}

		if ( material.roughness !== undefined ) {

			materialRoughness.setValue( material.roughness );

		}

		if ( material.metalness !== undefined ) {

			materialMetalness.setValue( material.metalness );

		}

		if ( material.emissive !== undefined ) {

			materialEmissive.setHexValue( material.emissive.getHexString() );

		}

		if ( material.specular !== undefined ) {

			materialSpecular.setHexValue( material.specular.getHexString() );

		}

		if ( material.shininess !== undefined ) {

			materialShininess.setValue( material.shininess );

		}

		if ( material.clearCoat !== undefined ) {

			materialClearCoat.setValue( material.clearCoat );

		}

		if ( material.clearCoatRoughness !== undefined ) {

			materialClearCoatRoughness.setValue( material.clearCoatRoughness );

		}

		if ( material.vertexColors !== undefined ) {

			materialVertexColors.setValue( material.vertexColors );

		}

		if ( material.skinning !== undefined ) {

			materialSkinning.setValue( material.skinning );

		}

		if ( material.map !== undefined ) {

			if ( material.map !== null || resetTextureSelectors ) {

				materialMap.setValue( material.map );

			}

		}

		if ( material.alphaMap !== undefined ) {

			if ( material.alphaMap !== null || resetTextureSelectors ) {

				materialAlphaMap.setValue( material.alphaMap );

			}

		}

		if ( material.bumpMap !== undefined ) {

			if ( material.bumpMap !== null || resetTextureSelectors ) {

				materialBumpMap.setValue( material.bumpMap );

			}

			materialBumpScale.setValue( material.bumpScale );

		}

		if ( material.normalMap !== undefined ) {

			if ( material.normalMap !== null || resetTextureSelectors ) {

				materialNormalMap.setValue( material.normalMap );

			}

		}

		if ( material.displacementMap !== undefined ) {

			if ( material.displacementMap !== null || resetTextureSelectors ) {

				materialDisplacementMap.setValue( material.displacementMap );

			}

			materialDisplacementScale.setValue( material.displacementScale );

		}

		if ( material.roughnessMap !== undefined ) {

			if ( material.roughnessMap !== null || resetTextureSelectors ) {

				materialRoughnessMap.setValue( material.roughnessMap );

			}

		}

		if ( material.metalnessMap !== undefined ) {

			if ( material.metalnessMap !== null || resetTextureSelectors ) {

				materialMetalnessMap.setValue( material.metalnessMap );

			}

		}

		if ( material.specularMap !== undefined ) {

			if ( material.specularMap !== null || resetTextureSelectors ) {

				materialSpecularMap.setValue( material.specularMap );

			}

		}

		if ( material.envMap !== undefined ) {

			if ( material.envMap !== null || resetTextureSelectors ) {

				materialEnvMap.setValue( material.envMap );

			}

		}

		if ( material.reflectivity !== undefined ) {

			materialReflectivity.setValue( material.reflectivity );

		}

		if ( material.lightMap !== undefined ) {

			if ( material.lightMap !== null || resetTextureSelectors ) {

				materialLightMap.setValue( material.lightMap );

			}

		}

		if ( material.aoMap !== undefined ) {

			materialAOMapEnabled.setValue( material.aoMap !== null );

			if ( material.aoMap !== null || resetTextureSelectors ) {

				materialAOMap.setValue( material.aoMap );

			}

			materialAOScale.setValue( material.aoMapIntensity );

		}

		if ( material.emissiveMap !== undefined ) {

			if ( material.emissiveMap !== null || resetTextureSelectors ) {

				materialEmissiveMap.setValue( material.emissiveMap );

			}

		}

		if ( material.side !== undefined ) {

			materialSide.setValue( material.side );

		}

		if ( material.flatShading !== undefined ) {

			materialShading.setValue( material.flatShading );

		}

		if ( material.blending !== undefined ) {

			materialBlending.setValue( material.blending );

		}

		if ( material.opacity !== undefined ) {

			materialOpacity.setValue( material.opacity );

		}

		if ( material.transparent !== undefined ) {

			materialTransparent.setValue( material.transparent );

		}

		if ( material.alphaTest !== undefined ) {

			materialAlphaTest.setValue( material.alphaTest );

		}

		if ( material.wireframe !== undefined ) {

			materialWireframe.setValue( material.wireframe );

		}

		if ( material.wireframeLinewidth !== undefined ) {

			materialWireframeLinewidth.setValue( material.wireframeLinewidth );

		}

		setRowVisibility();

	}

	// events

	signals.objectSelected.add( function ( object ) {

		var hasMaterial = false;

		if ( object && object.material ) {

			hasMaterial = true;

			if ( Array.isArray( object.material ) && object.material.length === 0 ) {

				hasMaterial = false;

			}

		}

		if ( hasMaterial ) {

			var objectChanged = object !== currentObject;

			currentObject = object;
			refreshUI( objectChanged );
			container.setDisplay( '' );

		} else {

			currentObject = null;
			container.setDisplay( 'none' );

		}

	} );

	signals.materialChanged.add( function () {

		refreshUI();

	} );

	return container;

};
