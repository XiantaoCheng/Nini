/*
地址::文档/S应用/NiniJS/js/three.js
+[保存文本](,ThreeJS)
+[J函数](,ThreeJS)

world_3D
three(库)::https://stemkoski.github.io/Three.js/js/Three.js
OrbitControls(库)::https://stemkoski.github.io/Three.js/js/OrbitControls.js

render
版本1:...
https://unpkg.com/three/build/three.module.js
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

//import * as THREE from '../res/three/build/three.module.js';
//import { ObritControls } from '../res/three/examples/jsm/controls/OrbitControls.js';
//import { OBJLoader } from '../res/three/examples/jsm/loaders/OBJLoader.js';
//import { OBJExporter } from '../res/three/examples/jsm/exporters/OBJExporter.js';


// MAIN

// standard global variables
// var container, scene, camera, renderer, controls, stats;


class Scene3D {
    constructor(ID='') {
        this.m_ID=ID;
        this.m_container='';
        this.m_scene='';
        this.m_camera='';
        this.m_renderer='';
        this.m_controls='';
    }

    init(ID='') {
        if(ID!=="") {
            this.m_ID=ID;
            this.m_container = document.getElementById(this.m_ID);
        }
        else {
            this.m_container=document.body;
        }
        if(this.m_container===null) {
            this.m_container=document.body;
        }

        // SCENE
        this.m_scene = new THREE.Scene();
        this.m_scene.background = new THREE.Color( 0xa0a0a0 );
        this.m_scene.fog = new THREE.Fog( 0xa0a0a0, 10, 3000 );

        // Ground
        const ground = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb} ) );
        ground.rotation.x = - Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.m_scene.add( ground );

        // Grid
        const helper = new THREE.GridHelper( 2000, 100 );
        helper.position.y = 0;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        this.m_scene.add( helper );
    
        // CAMERA
        var SCREEN_WIDTH = this.m_container.offsetWidth; 
        var SCREEN_HEIGHT = SCREEN_WIDTH/1.5;
//        var SCREEN_HEIGHT = this.m_container.offsetHeight;

//        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        this.m_camera = new THREE.PerspectiveCamera( 45, 1.5, 0.1, 20000);
        this.m_scene.add(this.m_camera);
        this.m_camera.position.set(0,150,400);
        this.m_camera.lookAt(this.m_scene.position);

        //Light
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
        hemiLight.position.set( 0, 100, 0 );
        this.m_scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
        dirLight.position.set( - 0, 40, 50 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = - 25;
        dirLight.shadow.camera.left = - 25;
        dirLight.shadow.camera.right = 25;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 200;
        dirLight.shadow.mapSize.set( 1024, 1024 );
        this.m_scene.add( dirLight );

    
        //RENDER
        this.m_renderer = new THREE.WebGLRenderer( {antialias:true} );
        this.m_renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.m_renderer.shadowMap.enabled = true;
        this.m_renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.m_container.appendChild( this.m_renderer.domElement );

    
        // CONTROLS
        this.m_controls = new OrbitControls( this.m_camera, this.m_renderer.domElement );
//         this.m_controls.addEventListener( 'change', this.m_renderer);
//        this.m_controls.minDistance = 50;
//        this.m_controls.maxDistance = 200;
//        this.m_controls.enablePan = false;
//        this.m_controls.target.set( 0, 20, 0 );
//        this.m_controls.update();
    
    }

    update() {
        this.m_renderer.render( this.m_scene, this.m_camera );
//        this.m_controls.update();
    }

    addBox(L,W,H,x,y,z) {
//        var material = new THREE.MeshNormalMaterial();
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );

        var cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        var cube = new THREE.Mesh( cubeGeometry, material );
        cube.position.set(x,y,z);
        cube.scale.x=L;
        cube.scale.y=W;
        cube.scale.z=H;
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.m_scene.add( cube );
        return cube;
    }

    addCylinder(R,H,x,y,z) {
//        var material = new THREE.MeshNormalMaterial();
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );

        var geometry = new THREE.CylinderGeometry( 1,1,1,80,4 );
        var shape = new THREE.Mesh( geometry, material );
        shape.position.set(x, y, z);
        shape.scale.x=R;
        shape.scale.y=H;
        shape.scale.z=R;
        shape.castShadow = true;
        shape.receiveShadow = true;
        this.m_scene.add( shape );
        return shape;
    }

    addSphere(R,x,y,z) {
//        var material = new THREE.MeshNormalMaterial();
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );

        var geometry = new THREE.SphereGeometry( 1,32,16 );
        var shape = new THREE.Mesh( geometry, material );
        shape.scale.x=R;
        shape.scale.y=R;
        shape.scale.z=R;
        shape.castShadow = true;
        shape.receiveShadow = true;
        shape.position.set(x, y, z);
        this.m_scene.add( shape );
        return shape;
    }

    setRotationByEuler(shape,alpha,beta,gamma) {
        shape.setRotationFromEuler(new THREE.Euler(0,0,0,'XYZ'));
        shape.rotateZ(alpha/180*Math.PI);
        shape.rotateX(beta/180*Math.PI);
        shape.rotateZ(gamma/180*Math.PI);
        return shape;
    }

    rotateInWorld(shape,pt,angle,axis='Z') {
        var T=new THREE.Matrix4().identity();
        T=T.multiply(new THREE.Matrix4().makeTranslation(pt[0],pt[1],pt[2]));
        if(axis==='X') {
            T=T.multiply(new THREE.Matrix4().makeRotationX(angle/180*Math.PI));
        }
        else if(axis==='Y') {
            T=T.multiply(new THREE.Matrix4().makeRotationY(angle/180*Math.PI));
        }
        else if(axis==='Z') {
            T=T.multiply(new THREE.Matrix4().makeRotationZ(angle/180*Math.PI));
        }
        T=T.multiply(new THREE.Matrix4().makeTranslation(-pt[0],-pt[1],-pt[2]));
        
        shape.updateMatrix();
        shape.applyMatrix4(T);
        return shape;
    }

    lookAt_pt(shape,pt) {
        shape.lookAt(new THREE.Vector3(pt[0],pt[1],pt[2]));
        return shape;
    }

    lookAt(shape,shape0) {
        shape.lookAt(shape0.position);
        return shape;
    }

    cameraLookAt_pt(pt) {
        this.lookAt_pt(this.m_camera,pt);
        this.m_controls.center.x=pt[0];
        this.m_controls.center.y=pt[1];
        this.m_controls.center.z=pt[2];
    }

    cameraLookAt(shape) {
        this.lookAt(this.m_camera,shape);
        this.m_controls.center.x=shape.position.x;
        this.m_controls.center.y=shape.position.y;
        this.m_controls.center.z=shape.position.z;
    }

    exportOBJ() {
        const exporter = new OBJExporter();
        const data = exporter.parse( this.m_scene );
        console.log(data);
        this.downloadFile("model.obj", data );
    }

    downloadFile(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }

}

print("??????!!")
var world_3D=new Scene3D();
window.m_world3D=world_3D;

function animate_3D() {
    requestAnimationFrame(animate_3D);
    world_3D.update();
}

function printMatrix(matrix) {
    var list_val=matrix.elements;
    var str_line='';
    for(var i=0;i<4;i++) {
        for(var j=0;j<4;j++) {
            str_line+=`${list_val[j+i*4]}, `;
        }
        print(str_line);
        str_line='';
    }
    print();
}


/*
init
例子:...
测试:...
+[新建阅读窗口](,测试)
+[J函数](,ThreeJS)
*/
