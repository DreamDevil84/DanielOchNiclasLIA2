/// <reference path="babylon.js"/>
"use strict";

var canvas;
var engine;
var scene;

document.addEventListener("DOMContentLoaded", startBabylonJS, false);

function startBabylonJS() {
    if (BABYLON.Engine.isSupported()) {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);

        scene = new BABYLON.Scene(engine);

        // var cam = new BABYLON.FreeCamera("freecam", new BABYLON.Vector3(0, 2, -10), scene);
        var cam = new BABYLON.ArcRotateCamera("arcCam", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        cam.attachControl(canvas);
        cam.checkCollisions = true;
        cam.applyGravity = true;

        // var mySimpleMesh = new BABYLON.Mesh("myMesh", scene);
        // var myPlane = CreatePlane(2);
        // myPlane.applyToMesh(mySimpleMesh);

        // var plane = BABYLON.Mesh.CreatePlane("myPlane", 2, scene)

        // var cube = BABYLON.Mesh.CreateBox("myCube", 2, scene);
        // cube.position.y += 2;
        // cube.checkCollisions = true;

        var light = new BABYLON.PointLight("pLight", new BABYLON.Vector3(10, 10, 10), scene);
        light.diffuse = BABYLON.Color3.Purple();

        var hemi = new BABYLON.HemisphericLight("hLight", BABYLON.Vector3.Zero(), scene);
        // var ground = BABYLON.Mesh.CreateGround("floor", 24, 24, 24, scene);
        // ground.checkCollisions = true;

        var mySimpleMeshTest = new BABYLON.Mesh("testMesh", scene);
        var myModel = getModelFromJSON("TestCube.json", mySimpleMeshTest);



        // ONce the scene is loaded just registrer a render loop to render it
        // engine.runRenderLoop(function () {
        //     // engine.clear(new BABYLON.Color3(0.2, 0.2, 0.3), true);
        //     // cube.rotation.x += 0.01;
        //     // cube.rotation.y += 0.01;
        //     // myModel.rotation.x += 0.01;
        //     scene.render();
        // });
    };
}

function CreateTest() {
    var vertexModelData = new BABYLON.VertexData();

    var mmPositions = [-5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3];
    var mmIndices = [0, 1, 2, 3, 4, 5];
    var mmNormals = [];

    BABYLON.VertexData.ComputeNormals(mmPositions, mmIndices, mmNormals);

    vertexModelData.indices = mmIndices;
    vertexModelData.positions = mmPositions;
    vertexModelData.normals = mmNormals;
    // vertexModelData.normals =
    //     [
    //         0, 0, 1,
    //         0, 0, 1,
    //         0, 0, 1,
    //         0, 0, -1,
    //         0, 0, -1,
    //         0, 0, -1
    //     ];
    // vertexModelData.uvs = mUvs;

    console.log(vertexModelData)
    // vertexModelData.applyToMesh(mesh);
    return vertexModelData;
}

function CreatePlane(size) {
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];

    size = size || 1;

    // Vertices

    var halfSize = size / 2.0;
    positions.push(-halfSize, -halfSize, 0);
    normals.push(0, 0, -1.0);
    uvs.push(0.0, 0.0);

    positions.push(halfSize, -halfSize, 0);
    normals.push(0, 0, -1.0);
    uvs.push(1.0, 0.0);

    positions.push(halfSize, halfSize, 0);
    normals.push(0, 0, -1.0);
    uvs.push(1.0, 1.0);

    positions.push(-halfSize, halfSize, 0);
    normals.push(0, 0, -1.0);
    uvs.push(0.0, 1.0);

    // Indices
    indices.push(0);
    indices.push(1);
    indices.push(2);

    indices.push(0);
    indices.push(2);
    indices.push(3);

    // Result
    var vertexData = new BABYLON.VertexData();

    vertexData.indices = indices;
    vertexData.positions = positions;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    console.log(vertexData)
    return vertexData;
}

function getModelFromJSON(path, mesh, exists) {
    var request = new XMLHttpRequest();
    var modelData = [];
    console.log("Fetching JSON");
    request.open("GET", path);
    request.send();
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            console.log("JSON Aquired")
            modelData = JSON.parse(this.responseText);
            console.log(modelData);

            var mIndices = [];
            var mPositions = [];
            var mNormals = [];
            // var mUvs = [];
            var indicesInc = 0;

            for (var i = 0; i < modelData.length; i++) {
                for (var j = 0; j < modelData[i].length; j++) {
                    for (var k = 0; k < modelData[i][j].length; k++) {
                        var value = modelData[i][j][k];
                        console.log(value)
                        mPositions.push(value);
                    }
                    mIndices.push(indicesInc);
                    indicesInc++;
                }
            }



            var vertexModelData = new BABYLON.VertexData();

            var mat = new BABYLON.StandardMaterial("mat", scene);
            //#####################
            //FOR DEBUGGING - Remove when Done
            mat.backFaceCulling = false;
            //#####################



            BABYLON.VertexData.ComputeNormals(mPositions, mIndices, mNormals);

            vertexModelData.indices = mIndices;
            vertexModelData.positions = mPositions;
            vertexModelData.normals = mNormals;
            mesh.material = mat;
            // vertexModelData.uvs = mUvs;

            console.log(vertexModelData)
            vertexModelData.applyToMesh(mesh);
            engine.runRenderLoop(function () {
                // engine.clear(new BABYLON.Color3(0.2, 0.2, 0.3), true);
                // cube.rotation.x += 0.01;
                // cube.rotation.y += 0.01;
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
                scene.render();
            });
            return vertexModelData;
        }
    }
}
