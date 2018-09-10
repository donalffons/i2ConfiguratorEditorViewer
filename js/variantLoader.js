function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

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
        manager = new THREE.LoadingManager();
        editor.loader.loadFile( params.currentTarget.response, manager, basefolder+"/WebGL Models/"+getCurrentModel().getPath()+"/" , params.currentTarget.objectAddPromise);
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
                    action.initialize();
                } else {
                    if (action.getType() == "i2ActionMaterialType") {
                        action.getMaterialSelector().setMaterialCollection(editor.materials);
                        action.setSceneRoot(editor.scene);
                    } else if (action.getType() == "i2ActionMaterialProperty") {
                        action.getMaterialSelector().setMaterialCollection(editor.materials);
                    }
                    action.initialize();
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
                    action.getObjectsSelector().getObjects().forEach((object) => {
                        object.userData.overrides[action.getProperty()].autoAction = action;
                        editor.signals.objectChanged.dispatch(object);
                    });
                } else if (action.getTags().autoAction == "materialType") {
                    let material = action.getMaterialSelector().getMaterial();
					material.userData.overrides["materialType"].overridden = true;
                    material.userData.overrides["materialType"].autoAction = action;
                    material.userData.overrides["materialType"].autoAction.setSceneRoot(editor.scene);
                } else if (action.getTags().autoAction == "material.color" || action.getTags().autoAction == "material.mapImage") {
                    let material = action.getMaterialSelector().getMaterial();
                    material.userData.overrides[action.getProperty()].autoAction = action;
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