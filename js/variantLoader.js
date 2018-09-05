function Load3DFile(filename, basefolder) {
    if (basefolder === undefined) {
        basefolder = getBaseFolder();
    }
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET",  getModelFolder()+filename);
    xhr.responseType = "blob";
    xhr.filename = filename;
    xhr.onload = function(params) {
        params.currentTarget.response.name = params.currentTarget.filename;
        editor.loader.loadFile( params.currentTarget.response, basefolder+"/WebGL Models/"+getCurrentModel().getPath()+"/" , params.currentTarget.objectAddPromise);
    }
    xhr.objectAddPromise = $.Deferred()
    var objectAddPromise = xhr.objectAddPromise;
    xhr.send();
    return objectAddPromise;
}

async function LoadModelVariant() {
    let filenames = await getCurrentModel().get3DFiles();
    var objectAddPromises = [];
    for(var i = 0; i < filenames.length; i++) {
        objectAddPromises.push(Load3DFile(filenames[i]));
    }

    $.when.apply($, objectAddPromises).done(async() => {
        let actions = await getCurrentVariant().getActions();
        if(actions !== undefined) {
            actions.forEach((action) => {
                if(action.getType() == "i2ActionObjectProperty" || action.getType() == "i2ActionAddObject") {
                    action.getObjectsSelector().setSceneRoot(editor.scene);
                } else if (action.getType() == "i2ActionMaterialType") {
                    action.getMaterialSelector().setMaterialCollection(editor.materials);
                    action.setSceneRoot(editor.scene);
                } else if (action.getType() == "i2ActionMaterialProperty") {
                    action.getMaterialSelector().setMaterialCollection(editor.materials);
                    let material = action.getMaterialSelector().getMaterial();// UGLY HACK!
                    material.overrides.materialColor_default = material.color.clone();
                }
                if(action.getTags().autoAction !== undefined) {
                    if(action.getTags().autoAction == "addObject") {
                        action.setOnObjectAdded(object => {
                            editor.addHelper(object);
                        });
                    }
                }
                action.execute();
                if( action.getTags().autoAction == "object.position" ||
                    action.getTags().autoAction == "object.rotation" ||
                    action.getTags().autoAction == "object.scale" ) {
                    object = action.getObjectsSelector().getObjects()[0];
                    if(action.getTags().autoAction == "object.position") {
                        object.overrides.position_overridden = true;
                        object.overrides.position_autoAction = action;
                    } else if(action.getTags().autoAction == "object.rotation") {
                        object.overrides.rotation_overridden = true;
                        object.overrides.rotation_autoAction = action;
                    } else if(action.getTags().autoAction == "object.scale") {
                        object.overrides.scale_overridden = true;
                        object.overrides.scale_autoAction = action;
                    }
                    editor.signals.objectChanged.dispatch(object);
                } else if (action.getTags().autoAction == "materialType") {
                    let material = action.getMaterialSelector().getMaterial();
					material.overrides.materialType_overridden = true;
                    material.overrides.materialType_autoAction = action;
                    material.overrides.materialType_autoAction.setSceneRoot(editor.scene);
                } else if (action.getTags().autoAction == "material.color") {
                    let material = action.getMaterialSelector().getMaterial();
					material.overrides.materialColor_overridden = true;
                    material.overrides.materialColor_autoAction = action;
                }
                editor.signals.sceneGraphChanged.dispatch();
            });
        }
    });
}

function getBaseFolder() {
    var baseurl = window.location.href.substring(0, window.location.href.indexOf("?"));
    var basefolder = baseurl.substring(0, baseurl.lastIndexOf("/"));
    basefolder = basefolder.substring(0, basefolder.lastIndexOf("/"));
    return basefolder;
}

function getModelFolder() {
    var basefolder = getBaseFolder();
    return basefolder+"/WebGL Models/"+getCurrentModel().getPath()+"/";
}

var currentVariant = {};
var currentModel = {};
async function setCurrentModelAndVariant(cb) {
    var modelid = getParameterByName("modelid");
    var variantid = getParameterByName("variantid");
    currentVariant = await i2VariantBuilder.getVariantByID(variantid);
    currentModel = await i2ModelBuilder.getModelByID(modelid);
    cb();
}

function getCurrentVariant() {
    return currentVariant;
}

function getCurrentModel() {
    return currentModel;
}

function LoadCurrentVariant() {
    LoadModelVariant(currentModel, currentVariant);
}