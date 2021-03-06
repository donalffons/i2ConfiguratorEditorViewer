/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Object = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay( 'none' );

	// Actions

	var objectActions = new UI.Select().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Reset Position': 'Reset Position',
		'Reset Rotation': 'Reset Rotation',
		'Reset Scale': 'Reset Scale'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		var object = editor.selected;

		switch ( this.getValue() ) {

			case 'Reset Position':
				editor.execute( new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ) );
				break;

			case 'Reset Rotation':
				editor.execute( new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ) );
				break;

			case 'Reset Scale':
				editor.execute( new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) );
				break;

		}

		this.setValue( 'Actions' );

	} );
	// container.addStatic( objectActions );

	// type

	var objectTypeRow = new UI.Row();
	var objectType = new UI.Text();

	objectTypeRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	objectTypeRow.add( objectType );

	container.add( objectTypeRow );

	// uuid

	/*var objectUUIDRow = new UI.Row();
	var objectUUID = new UI.Input().setWidth( '102px' ).setFontSize( '12px' ).setDisabled( true );
	var objectUUIDRenew = new UI.Button( 'New' ).setMarginLeft( '7px' ).onClick( function () {

		objectUUID.setValue( THREE.Math.generateUUID() );

		editor.execute( new SetUuidCommand( editor.selected, objectUUID.getValue() ) );

	} );

	objectUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	objectUUIDRow.add( objectUUID );
	objectUUIDRow.add( objectUUIDRenew );

	container.add( objectUUIDRow );*/

	// name

	/*var objectNameRow = new UI.Row();
	var objectName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetValueCommand( editor.selected, 'name', objectName.getValue() ) );

	} );

	objectNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );*/

	// position

	var objectPositionRow = new UI.Row();
	var objectPositionX = new UI.Number().setPrecision( 3 ).setWidth( '50px' ).onChange( update );
	var objectPositionY = new UI.Number().setPrecision( 3 ).setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UI.Number().setPrecision( 3 ).setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
	var objectPositionOverride = new UI.Checkbox().onChange( function(){update();});
	objectPositionRow.add( objectPositionOverride );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	container.add( objectPositionRow );

	// rotation

	var objectRotationRow = new UI.Row();
	var objectRotationX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	var objectRotationY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	var objectRotationZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
	var objectRotationOverride = new UI.Checkbox().onChange( function(){update();});
	objectRotationRow.add( objectRotationOverride );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	container.add( objectRotationRow );

	// scale

	var objectScaleRow = new UI.Row();
	var objectScaleLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var objectScaleX = new UI.Number( 1 ).setPrecision( 3 ).setRange( 0.001, Infinity ).setWidth( '50px' ).onChange( updateScaleX );
	var objectScaleY = new UI.Number( 1 ).setPrecision( 3 ).setRange( 0.001, Infinity ).setWidth( '50px' ).onChange( updateScaleY );
	var objectScaleZ = new UI.Number( 1 ).setPrecision( 3 ).setRange( 0.001, Infinity ).setWidth( '50px' ).onChange( updateScaleZ );

	objectScaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
	var objectScaleOverride = new UI.Checkbox().onChange( function(){update();});
	objectScaleRow.add( objectScaleOverride );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );
	objectScaleRow.add( objectScaleLock );

	container.add( objectScaleRow );

	// fov

	var objectFovRow = new UI.Row();
	var objectFov = new UI.Number().onChange( update );

	objectFovRow.add( new UI.Text( 'Fov' ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );

	// near

	var objectNearRow = new UI.Row();
	var objectNear = new UI.Number().onChange( update );

	objectNearRow.add( new UI.Text( 'Near' ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new UI.Row();
	var objectFar = new UI.Number().onChange( update );

	objectFarRow.add( new UI.Text( 'Far' ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );

	// intensity

	var objectIntensityRow = new UI.Row();
	var objectIntensity = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectIntensityRow.add( new UI.Text( 'Intensity' ).setWidth( '90px' ) );
	objectIntensityRow.add( objectIntensity );

	container.add( objectIntensityRow );

	// color

	var objectColorRow = new UI.Row();
	var objectColor = new UI.Color().onChange( update );

	objectColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	objectColorRow.add( objectColor );

	container.add( objectColorRow );

	// ground color

	var objectGroundColorRow = new UI.Row();
	var objectGroundColor = new UI.Color().onChange( update );

	objectGroundColorRow.add( new UI.Text( 'Ground color' ).setWidth( '90px' ) );
	objectGroundColorRow.add( objectGroundColor );

	container.add( objectGroundColorRow );

	// distance

	var objectDistanceRow = new UI.Row();
	var objectDistance = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDistanceRow.add( new UI.Text( 'Distance' ).setWidth( '90px' ) );
	objectDistanceRow.add( objectDistance );

	container.add( objectDistanceRow );

	// angle

	var objectAngleRow = new UI.Row();
	var objectAngle = new UI.Number().setPrecision( 3 ).setRange( 0, Math.PI / 2 ).onChange( update );

	objectAngleRow.add( new UI.Text( 'Angle' ).setWidth( '90px' ) );
	objectAngleRow.add( objectAngle );

	container.add( objectAngleRow );

	// penumbra

	var objectPenumbraRow = new UI.Row();
	var objectPenumbra = new UI.Number().setRange( 0, 1 ).onChange( update );

	objectPenumbraRow.add( new UI.Text( 'Penumbra' ).setWidth( '90px' ) );
	objectPenumbraRow.add( objectPenumbra );

	container.add( objectPenumbraRow );

	// decay

	var objectDecayRow = new UI.Row();
	var objectDecay = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDecayRow.add( new UI.Text( 'Decay' ).setWidth( '90px' ) );
	objectDecayRow.add( objectDecay );

	container.add( objectDecayRow );

	// shadow

	var objectShadowRow = new UI.Row();

	objectShadowRow.add( new UI.Text( 'Shadow' ).setWidth( '90px' ) );

	var objectCastShadow = new UI.THREE.Boolean( false, 'cast' ).onChange( update );
	objectShadowRow.add( objectCastShadow );

	var objectReceiveShadow = new UI.THREE.Boolean( false, 'receive' ).onChange( update );
	objectShadowRow.add( objectReceiveShadow );

	var objectShadowRadius = new UI.Number( 1 ).onChange( update );
	objectShadowRow.add( objectShadowRadius );

	container.add( objectShadowRow );

	// visible

	var objectVisibleRow = new UI.Row();
	var objectVisible = new UI.Checkbox().onChange( update );

	objectVisibleRow.add( new UI.Text( 'Visible' ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );

	// frustumCulled

	var objectFrustumCulledRow = new UI.Row();
	var objectFrustumCulled = new UI.Checkbox().onChange( update );

	objectFrustumCulledRow.add( new UI.Text( 'Frustum Cull' ).setWidth( '90px' ) );
	objectFrustumCulledRow.add( objectFrustumCulled );

	container.add( objectFrustumCulledRow );

	// renderOrder

	var objectRenderOrderRow = new UI.Row();
	var objectRenderOrder = new UI.Integer().setWidth( '50px' ).onChange( update );

	objectRenderOrderRow.add( new UI.Text( 'Render Order' ).setWidth( '90px' ) );
	objectRenderOrderRow.add( objectRenderOrder );

	container.add( objectRenderOrderRow );

	// user data

	/*var timeout;

	var objectUserDataRow = new UI.Row();
	var objectUserData = new UI.TextArea().setWidth( '150px' ).setHeight( '40px' ).setFontSize( '12px' ).onChange( update );
	objectUserData.onKeyUp( function () {

		try {

			JSON.parse( objectUserData.getValue() );

			objectUserData.dom.classList.add( 'success' );
			objectUserData.dom.classList.remove( 'fail' );

		} catch ( error ) {

			objectUserData.dom.classList.remove( 'success' );
			objectUserData.dom.classList.add( 'fail' );

		}

	} );

	objectUserDataRow.add( new UI.Text( 'User data' ).setWidth( '90px' ) );
	objectUserDataRow.add( objectUserData );

	container.add( objectUserDataRow );*/


	//

	function updateScaleX() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue( objectScaleY.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleY() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleZ() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleY.setValue( objectScaleY.getValue() * scale );

		}

		update();

	}

	function update() {

		var object = editor.selected;

		if ( object !== null ) {

			var newPosition = new THREE.Vector3( objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue() );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {
				editor.execute( new SetPositionCommand( object, newPosition ) );
			}

			if(object.userData.overrides) {
				if(objectPositionOverride.dom.checked && (!object.userData.overrides["position"] || !object.userData.overrides["position"].overridden)) {
					editor.execute(new AddActionObjectPropertyCommand(object, "position", object.position, (action) => {object.userData.overrides["position"].autoAction = action;}));
				} else if (!objectPositionOverride.dom.checked && object.userData.overrides["position"] && object.userData.overrides["position"].overridden) {
					editor.execute(new RemoveActionObjectPropertyCommand(object.userData.overrides["position"].autoAction, () => {delete object.userData.overrides["position"].autoAction;}));
				}
			}

			var newRotation = new THREE.Euler( objectRotationX.getValue() * THREE.Math.DEG2RAD, objectRotationY.getValue() * THREE.Math.DEG2RAD, objectRotationZ.getValue() * THREE.Math.DEG2RAD );
			if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {
				editor.execute( new SetRotationCommand( object, newRotation ) );
			}
			
			if(object.userData.overrides) {
				if(objectRotationOverride.dom.checked && (!object.userData.overrides["rotation"] || !object.userData.overrides["rotation"].overridden)) {
					editor.execute(new AddActionObjectPropertyCommand(object, "rotation", object.rotation, (action) => {object.userData.overrides["rotation"].autoAction = action;}));
				} else if (!objectRotationOverride.dom.checked && object.userData.overrides["rotation"] && object.userData.overrides["rotation"].overridden) {
					editor.execute(new RemoveActionObjectPropertyCommand(object.userData.overrides["rotation"].autoAction, () => {delete object.userData.overrides["rotation"].autoAction;}));
				}
			}

			var newScale = new THREE.Vector3( objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue() );
			if ( object.scale.distanceTo( newScale ) >= 0.01 ) {
				editor.execute( new SetScaleCommand( object, newScale ) );
			}
			
			if(object.userData.overrides) {
				if(objectScaleOverride.dom.checked && (!object.userData.overrides["scale"] || !object.userData.overrides["scale"].overridden)) {
					editor.execute(new AddActionObjectPropertyCommand(object, "scale", object.scale, (action) => {object.userData.overrides["scale"].autoAction = action;}));
				} else if (!objectScaleOverride.dom.checked && object.userData.overrides["scale"] && object.userData.overrides["scale"].overridden) {
					editor.execute(new RemoveActionObjectPropertyCommand(object.userData.overrides["scale"].autoAction, () => {delete object.userData.overrides["scale"].autoAction;}));
				}
			}

			if ( object.fov !== undefined && Math.abs( object.fov - objectFov.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'fov', objectFov.getValue() ) );
				object.updateProjectionMatrix();

			}

			if ( object.near !== undefined && Math.abs( object.near - objectNear.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'near', objectNear.getValue() ) );

			}

			if ( object.far !== undefined && Math.abs( object.far - objectFar.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'far', objectFar.getValue() ) );

			}

			if ( object.intensity !== undefined && Math.abs( object.intensity - objectIntensity.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'intensity', objectIntensity.getValue() ) );

			}

			if ( object.color !== undefined && object.color.getHex() !== objectColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'color', objectColor.getHexValue() ) );

			}

			if ( object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'groundColor', objectGroundColor.getHexValue() ) );

			}

			if ( object.distance !== undefined && Math.abs( object.distance - objectDistance.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'distance', objectDistance.getValue() ) );

			}

			if ( object.angle !== undefined && Math.abs( object.angle - objectAngle.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'angle', objectAngle.getValue() ) );

			}

			if ( object.penumbra !== undefined && Math.abs( object.penumbra - objectPenumbra.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'penumbra', objectPenumbra.getValue() ) );

			}

			if ( object.decay !== undefined && Math.abs( object.decay - objectDecay.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'decay', objectDecay.getValue() ) );

			}

			if ( object.visible !== objectVisible.getValue() ) {

				editor.execute( new SetValueCommand( object, 'visible', objectVisible.getValue() ) );

			}

			if ( object.frustumCulled !== objectFrustumCulled.getValue() ) {

				editor.execute( new SetValueCommand( object, 'frustumCulled', objectFrustumCulled.getValue() ) );

			}

			if ( object.renderOrder !== objectRenderOrder.getValue() ) {

				editor.execute( new SetValueCommand( object, 'renderOrder', objectRenderOrder.getValue() ) );

			}

			if ( object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue() ) {

				editor.execute( new SetValueCommand( object, 'castShadow', objectCastShadow.getValue() ) );

			}

			if ( object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue() ) {

				editor.execute( new SetValueCommand( object, 'receiveShadow', objectReceiveShadow.getValue() ) );
				object.material.needsUpdate = true;

			}

			if ( object.shadow !== undefined ) {

				if ( object.shadow.radius !== objectShadowRadius.getValue() ) {

					editor.execute( new SetValueCommand( object.shadow, 'radius', objectShadowRadius.getValue() ) );

				}

			}

			/*try {

				var userData = JSON.parse( objectUserData.getValue() );
				if ( JSON.stringify( object.userData ) != JSON.stringify( userData ) ) {

					editor.execute( new SetValueCommand( object, 'userData', userData ) );

				}

			} catch ( exception ) {

				console.warn( exception );

			}*/

		}

	}

	function updateRows( object ) {

		var properties = {
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow,
			'intensity': objectIntensityRow,
			'color': objectColorRow,
			'groundColor': objectGroundColorRow,
			'distance' : objectDistanceRow,
			'angle' : objectAngleRow,
			'penumbra' : objectPenumbraRow,
			'decay' : objectDecayRow,
			'castShadow' : objectShadowRow,
			'receiveShadow' : objectReceiveShadow,
			'shadow': objectShadowRadius
		};

		for ( var property in properties ) {

			properties[ property ].setDisplay( object[ property ] !== undefined ? '' : 'none' );

		}

	}

	function updateTransformRows( object ) {

		if ( object instanceof THREE.Light ||
		   ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {

			objectRotationRow.setDisplay( 'none' );
			objectScaleRow.setDisplay( 'none' );

		} else {

			objectRotationRow.setDisplay( '' );
			objectScaleRow.setDisplay( '' );

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		if(object.userData.overrides) {
			if(object.userData.overrides["position"] && object.userData.overrides["position"].autoAction !== undefined && object.userData.overrides["position"].autoAction != null) {
				object.userData.overrides["position"].autoAction.setValue(new i2Value(object.position));
			}
			if(object.userData.overrides["rotation"] && object.userData.overrides["rotation"].autoAction !== undefined && object.userData.overrides["rotation"].autoAction != null) {
				object.userData.overrides["rotation"].autoAction.setValue(new i2Value(object.rotation));
			}
			if(object.userData.overrides["scale"] && object.userData.overrides["scale"].autoAction !== undefined && object.userData.overrides["scale"].autoAction != null) {
				object.userData.overrides["scale"].autoAction.setValue(new i2Value(object.scale));
			}
		}

		updateUI( object );

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	signals.transformModeChanged.add( function ( mode ) {
		updateTransformControlsVisibility(editor.selected);
	});

	function updateTransformControlsVisibility(object) {
		if( !object.userData.overrides ||
		   ((viewport.transformControls.getMode() == "translate" && object.userData.overrides["position"] && object.userData.overrides["position"].overridden) ||
			(viewport.transformControls.getMode() == "rotate" && object.userData.overrides["rotation"] && object.userData.overrides["rotation"].overridden) ||
			(viewport.transformControls.getMode() == "scale" && object.userData.overrides["scale"] && object.userData.overrides["scale"].overridden))) {
			viewport.transformControls.attach(object);
		} else {
			viewport.transformControls.detach();
		}
		editor.signals.objectChanged.dispatch(viewport.transformControls);
	}

	function updateUI( object ) {
		updateTransformControlsVisibility(object);

		objectType.setValue( object.type );

		//objectUUID.setValue( object.uuid );
		//objectName.setValue( object.name );

		if(object.userData.overrides) {
			objectPositionOverride.dom.hidden = false;
			objectPositionOverride.dom.checked = object.userData.overrides["position"] ? object.userData.overrides["position"].overridden : false;
			objectPositionX.setEnabled(objectPositionOverride.dom.checked);
			objectPositionY.setEnabled(objectPositionOverride.dom.checked);
			objectPositionZ.setEnabled(objectPositionOverride.dom.checked);

			objectRotationOverride.dom.hidden = false;
			objectRotationOverride.dom.checked = object.userData.overrides["rotation"] ? object.userData.overrides["rotation"].overridden : false;
			objectRotationX.setEnabled(objectRotationOverride.dom.checked);
			objectRotationY.setEnabled(objectRotationOverride.dom.checked);
			objectRotationZ.setEnabled(objectRotationOverride.dom.checked);

			objectScaleOverride.dom.hidden = false;
			objectScaleOverride.dom.checked = object.userData.overrides["scale"] ? object.userData.overrides["scale"].overridden : false;
			objectScaleX.setEnabled(objectScaleOverride.dom.checked);
			objectScaleY.setEnabled(objectScaleOverride.dom.checked);
			objectScaleZ.setEnabled(objectScaleOverride.dom.checked);
		} else {
			objectPositionOverride.dom.checked = false;
			objectPositionOverride.dom.hidden = true;
			objectPositionX.setEnabled(true);
			objectPositionY.setEnabled(true);
			objectPositionZ.setEnabled(true);

			objectRotationOverride.dom.checked = false;
			objectRotationOverride.dom.hidden = true;
			objectRotationX.setEnabled(true);
			objectRotationY.setEnabled(true);
			objectRotationZ.setEnabled(true);

			objectScaleOverride.dom.checked = false;
			objectScaleOverride.dom.hidden = true;
			objectScaleX.setEnabled(true);
			objectScaleY.setEnabled(true);
			objectScaleZ.setEnabled(true);
		}
		objectRotationX.setValue( object.rotation.x * THREE.Math.RAD2DEG );
		objectRotationY.setValue( object.rotation.y * THREE.Math.RAD2DEG );
		objectRotationZ.setValue( object.rotation.z * THREE.Math.RAD2DEG );
		objectPositionX.setValue( object.position.x );
		objectPositionY.setValue( object.position.y );
		objectPositionZ.setValue( object.position.z );
		objectScaleX.setValue( object.scale.x );
		objectScaleY.setValue( object.scale.y );
		objectScaleZ.setValue( object.scale.z );

		if(object.userData.overrides) {
			objectNearRow.dom.hidden = true;
			objectFarRow.dom.hidden = true;
			objectIntensityRow.dom.hidden = true;
			objectColorRow.dom.hidden = true;
			objectGroundColorRow.dom.hidden = true;
			objectDistanceRow.dom.hidden = true;
			objectAngleRow.dom.hidden = true;
			objectPenumbraRow.dom.hidden = true;
			objectDecayRow.dom.hidden = true;
			objectShadowRow.dom.hidden = true;
			objectVisibleRow.dom.hidden = true;
			objectFrustumCulledRow.dom.hidden = true;
			objectRenderOrderRow.dom.hidden = true;
		} else {
			objectFovRow.dom.hidden = false;
			objectNearRow.dom.hidden = false;
			objectFarRow.dom.hidden = false;
			objectIntensityRow.dom.hidden = false;
			objectColorRow.dom.hidden = false;
			objectGroundColorRow.dom.hidden = false;
			objectDistanceRow.dom.hidden = false;
			objectAngleRow.dom.hidden = false;
			objectPenumbraRow.dom.hidden = false;
			objectDecayRow.dom.hidden = false;
			objectShadowRow.dom.hidden = false;
			objectVisibleRow.dom.hidden = false;
			objectFrustumCulledRow.dom.hidden = false;
			objectRenderOrderRow.dom.hidden = false;

			if ( object.fov !== undefined ) {

				objectFov.setValue( object.fov );

			}

			if ( object.near !== undefined ) {

				objectNear.setValue( object.near );

			}

			if ( object.far !== undefined ) {

				objectFar.setValue( object.far );

			}

			if ( object.intensity !== undefined ) {

				objectIntensity.setValue( object.intensity );

			}

			if ( object.color !== undefined ) {

				objectColor.setHexValue( object.color.getHexString() );

			}

			if ( object.groundColor !== undefined ) {

				objectGroundColor.setHexValue( object.groundColor.getHexString() );

			}

			if ( object.distance !== undefined ) {

				objectDistance.setValue( object.distance );

			}

			if ( object.angle !== undefined ) {

				objectAngle.setValue( object.angle );

			}

			if ( object.penumbra !== undefined ) {

				objectPenumbra.setValue( object.penumbra );

			}

			if ( object.decay !== undefined ) {

				objectDecay.setValue( object.decay );

			}

			if ( object.castShadow !== undefined ) {

				objectCastShadow.setValue( object.castShadow );

			}

			if ( object.receiveShadow !== undefined ) {

				objectReceiveShadow.setValue( object.receiveShadow );

			}

			if ( object.shadow !== undefined ) {

				objectShadowRadius.setValue( object.shadow.radius );

			}
		}

		objectVisible.setValue( object.visible );
		objectFrustumCulled.setValue( object.frustumCulled );
		objectRenderOrder.setValue( object.renderOrder );

		/*try {

			objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

		} catch ( error ) {

			console.log( error );

		}

		objectUserData.setBorderColor( 'transparent' );
		objectUserData.setBackgroundColor( '' );*/

		updateTransformRows( object );

	}

	return container;

};
