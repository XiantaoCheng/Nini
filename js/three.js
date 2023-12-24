/*
地址::文档/S应用/NiniJS/js/three.js
地址::文档/S应用/3D打印/js/three.js
+[保存文本](,ThreeJS)
+[J函数](,ThreeJS)
有什么

exportSTL
three(库)::https://stemkoski.github.io/Three.js/js/Three.js
OrbitControls(库)::https://stemkoski.github.io/Three.js/js/OrbitControls.js

Extrude
版本1:...
保存:...
https://unpkg.com/three/build/three.module.js
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { CSG } from 'three-csg-ts';


//import * as THREE from 'https://unpkg.com/three/build/three.module.js';
//import { ObritControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
//import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';


// MAIN

// standard global variables
// var container, scene, camera, renderer, controls, stats;


class Scene3D {
    constructor(ID='') {
        this.m_ID=ID;
        this.m_container='';
        this.m_scene='';
        this.m_objs='';
        this.m_mark='';
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
            this.m_ID="body";
            this.m_container=document.body;
        }
        if(this.m_container===null) {
            this.m_container=document.body;
        }

        // SCENE
        this.m_scene = new THREE.Scene();
//         this.m_scene.background = new THREE.Color( 0xa0a0a0 );
//         this.m_scene.fog = new THREE.Fog( 0xa0a0a0, 10, 3000 );
        let color_sky=0xa0e0ff;
        this.m_scene.background = new THREE.Color( color_sky );
        this.m_scene.fog = new THREE.Fog( color_sky, 10, 3000 );

        // Ground
        const ground = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb} ) );
        ground.rotation.x = - Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.m_scene.add( ground );

        // Obj
        this.m_objs = new THREE.Group();
        this.m_scene.add( this.m_objs );
        // Mark
        this.m_mark = new THREE.Group();
        this.m_scene.add( this.m_mark );

        // Grid
        const helper = new THREE.GridHelper( 2000, 100 );
        helper.position.y = 0;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        this.m_scene.add( helper );

/*
+[保存文本](,ThreeJS)
*/

        // CAMERA
    if (this.m_ID==="body") {
        var SCREEN_WIDTH = 1500;
        var SCREEN_HEIGHT = SCREEN_WIDTH/1.5;
    } else {
        var SCREEN_WIDTH = this.m_container.offsetWidth; 
        var SCREEN_HEIGHT = this.m_container.offsetHeight;
    }

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
//        this.m_renderer = new THREE.CanvasRenderer();
        this.m_renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.m_renderer.shadowMap.enabled = true;
        this.m_renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.m_container.appendChild( this.m_renderer.domElement );

/*
+[保存文本](,ThreeJS)
*/

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
/*
addPoly
参考GH::https://threejs.org/docs/#api/en/helpers/GridHelper
+[打开网页](,参考GH)
+[保存文本](,ThreeJS)
world_3D
*/
    addPlane(W,N,x,y,z,eulers=[0,0,0]) {
        var shape = new THREE.Mesh( new THREE.PlaneGeometry( W, W ), new THREE.MeshPhongMaterial( { color: 0xffff00} ) );
        shape.rotation.x = - Math.PI / 2;
        this.rotateInWorld(shape,[0,0,0],-90,'Y');

        this.rotateInWorld(shape,[0,0,0],eulers[2],'Y');
        this.rotateInWorld(shape,[0,0,0],eulers[1],'X');
        this.rotateInWorld(shape,[0,0,0],eulers[0],'Y');

        shape.m_eulers=eulers;

        shape.position.x = x;
        shape.position.y = y;
        shape.position.z = z;
        shape.material.opacity = 0.1;
        shape.material.transparent = true;
        shape.material.side = THREE.DoubleSide;
        this.m_mark.add( shape );

        var shape1 = new THREE.GridHelper(W,N);
        shape1.material.opacity = 0.5;
        shape1.material.transparent = true;
        shape1.rotation.x = - Math.PI / 2;
        shape.add( shape1 );
        return shape;
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
        this.m_objs.add( cube );
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
        this.m_objs.add( shape );
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
        this.m_objs.add( shape );
        return shape;
    }

/*
+[保存文本](,ThreeJS)
*/
    addTube(xs,ys,zs,r) {
        let points=[];
        for (let i in xs) {
            points.push(new THREE.Vector3(xs[i],ys[i],zs[i]));
        }
        var curve = new THREE.CatmullRomCurve3(points);
    
        var geometry = new THREE.TubeGeometry( curve, 200, r, 50 );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        material.side = THREE.DoubleSide;
    
        var shape = new THREE.Mesh( geometry, material );
        shape.castShadow = true;
        shape.receiveShadow = true;
        this.m_objs.add( shape );
        return shape;
    
    }

    moveTo(shape,x,y,z) {
        shape.position.set(x,y,z);
    }

    addRotation(xs,ys) {
        let points=[];
        for (let i in xs) {
            points.push(new THREE.Vector2(xs[i],ys[i]));
        }

        var geometry = new THREE.LatheGeometry( points ,100 );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        material.side = THREE.DoubleSide;
    
        var shape = new THREE.Mesh( geometry, material );
        shape.castShadow = true;
        shape.receiveShadow = true;
        this.m_objs.add( shape );
        return shape;
    
    }

/*
set
参考Extrude::https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry
+[打开网页](,参考Extrude)
*/

    addExtrude(xs,ys,H,x=0,y=0,z=0) {
        let points=[];
        for (let i in xs) {
            points.push(new THREE.Vector2(xs[i],ys[i]));
        }

        let shape1 = new THREE.Shape(points);
        let geometry = new THREE.ExtrudeGeometry( shape1, {bevelEnabled: false } );
        let material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    
        var shape = new THREE.Mesh( geometry, material );
        shape.position.set(x,y,z);
        shape.scale.z=H;
        shape.castShadow = true;
        shape.receiveShadow = true;
        this.m_objs.add( shape );
        return shape;
    
    }

/*
setExtrudePoly
+[保存文本](,ThreeJS)
*/
    addExtrudePolygon(shx,shy,height,x=0,y=0,z=0,eulers=[0,0,0]) {
        const shape = new THREE.Shape();
        for (var i=0;i<shx.length;i++) {
            if(i==0) {
                shape.moveTo(shx[i],shy[i]);
            }
            else {
                shape.lineTo(shx[i],shy[i]);
            }
        }
    
        const extrudeSettings = { bevelEnabled: false, steps:1 };

        const geometry = new THREE.ExtrudeGeometry( shape , extrudeSettings );
        const material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        const mesh = new THREE.Mesh( geometry, material ) ;

        if (height<0) {
            mesh.position.z+=height
            mesh.scale.z=-height;
        } else {
            mesh.scale.z=height;
        }

        this.rotateInWorld(mesh,[0,0,0],-90,'X');
        this.rotateInWorld(mesh,[0,0,0],-90,'Y');
        this.rotateInWorld(mesh,[0,0,0],eulers[2],'Y');
        this.rotateInWorld(mesh,[0,0,0],eulers[1],'X');
        this.rotateInWorld(mesh,[0,0,0],eulers[0],'Y');

        mesh.m_eulers=eulers;

//        mesh.position.set(mesh.position.x+x,mesh.position.y+y,mesh.position.z+z);
        mesh.position.x+=x;
        mesh.position.y+=y;
        mesh.position.z+=z;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.m_objs.add(mesh);
        
        return mesh;
    }
/*
world_3D
+[保存文本](,ThreeJS)
*/
    addExtrudePolyline(shx,shy,height,x=0,y=0,z=0,eulers=[0,0,0]) {
        const shape = new THREE.Shape();
        for (var i=0;i<shx.length;i++) {
            if(i==0) {
                shape.moveTo(shx[i],shy[i]);
            }
            else {
                shape.lineTo(shx[i],shy[i]);
            }
        }
        for (var i=shx.length-1;i>=0;i--) {
            shape.lineTo(shx[i],shy[i]);
        }
    
        const extrudeSettings = { bevelEnabled: false, steps:1 };

        const geometry = new THREE.ExtrudeGeometry( shape , extrudeSettings );
        const material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        material.side = THREE.DoubleSide;
        const mesh = new THREE.Mesh( geometry, material ) ;

        if (height<0) {
            mesh.position.z+=height
            mesh.scale.z=-height;
        } else {
            mesh.scale.z=height;
        }

        this.rotateInWorld(mesh,[0,0,0],-90,'X');
        this.rotateInWorld(mesh,[0,0,0],-90,'Y');
        this.rotateInWorld(mesh,[0,0,0],eulers[2],'Y');
        this.rotateInWorld(mesh,[0,0,0],eulers[1],'X');
        this.rotateInWorld(mesh,[0,0,0],eulers[0],'Y');

        mesh.m_eulers=eulers;

        mesh.position.x+=x;
        mesh.position.y+=y;
        mesh.position.z+=z;

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.m_objs.add(mesh);
        
        return mesh;
    }


/*
addEx
*/
    clearMark() {
        for( let i = this.m_mark.children.length - 1; i >= 0; i--) { 
            let obj = this.m_mark.children[i];
            obj.geometry.dispose();
            obj.material.dispose();
            this.m_mark.remove(obj); 
        }
    }

    addMark(xs,ys,zs='',plane=0) {
        let points=[];
        for (let i in xs) {
            if (zs===""){
                if (plane===0) {
                    points.push(new THREE.Vector3(ys[i],0,xs[i]));
                } else {
                    points.push(new THREE.Vector3(xs[i],ys[i],0));
                }
            } else {
                points.push(new THREE.Vector3(xs[i],ys[i],zs[i]));
            }
        }
    
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var material = new THREE.LineBasicMaterial( {color: 0x000000} );
    
        var shape = new THREE.Line( geometry, material );
//        shape.castShadow = false;
        if (plane===0) {
            this.m_mark.add( shape );
        } else {
            plane.add( shape );
        }

        return shape;
    }

/*
addExtrude
+[保存文本](,ThreeJS)
*/
    // Line
    addPath(xs,ys,zs='') {
        let points=[];
        for (let i in xs) {
            if (zs===""){
                points.push(new THREE.Vector3(xs[i],0,ys[i]));
            } else {
                points.push(new THREE.Vector3(xs[i],ys[i],zs[i]));
            }
        }
    
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var material = new THREE.LineBasicMaterial( {color: 0x000000} );
    
        var shape = new THREE.Line( geometry, material );
        shape.castShadow = true;
        this.m_objs.add(shape);

        return shape;
    }

    setPath(var_shape,xs,ys,zs='') {
        let points=[];
        for (let i in xs) {
            if (zs===""){
                points.push(new THREE.Vector3(xs[i],0,ys[i]));
            } else {
                points.push(new THREE.Vector3(xs[i],ys[i],zs[i]));
            }
        }
    
        var_shape.geometry.setFromPoints( points );    
    }

    setExtrudePoly(mesh,shx,shy,height,x=0,y=0,z=0,eulers=[0,0,0]) {
        const shape = new THREE.Shape();
        for (var i=0;i<shx.length;i++) {
            if(i==0) {
                shape.moveTo(shx[i],shy[i]);
            }
            else {
                shape.lineTo(shx[i],shy[i]);
            }
        }
        for (var i=shx.length-1;i>=0;i--) {
            shape.lineTo(shx[i],shy[i]);
        }
    
        const extrudeSettings = { bevelEnabled: false};

        if (height<0) {
            mesh.position.z+=height
            mesh.scale.z=-height;
        } else {
            mesh.scale.z=height;
        }

        mesh.position.x=0;
        mesh.position.y=0;
        mesh.position.z=0;

        mesh.setRotationFromEuler(new THREE.Euler(0,0,0,'XYZ'));
        this.rotateInWorld(mesh,[0,0,0],-90,'X');
        this.rotateInWorld(mesh,[0,0,0],-90,'Y');
        this.rotateInWorld(mesh,[0,0,0],eulers[2],'Y');
        this.rotateInWorld(mesh,[0,0,0],eulers[1],'X');
        this.rotateInWorld(mesh,[0,0,0],eulers[0],'Y');

        mesh.m_eulers=eulers;

        mesh.position.x+=x;
        mesh.position.y+=y;
        mesh.position.z+=z;
        
        return mesh;
    }


/*
记住"Javascript"
addPlane
+[保存文本](,ThreeJS)
*/
    setRotationByEuler(shape,alpha,beta,gamma) {
        let pt=[shape.position.x,shape.position.y,shape.position.z];

        shape.setRotationFromEuler(new THREE.Euler(0,0,0,'XYZ'));

        shape.rotation.x = - Math.PI / 2;
        this.rotateInWorld(shape,pt,-90,'Y');

        this.rotateInWorld(shape,pt,gamma,'Y');
        this.rotateInWorld(shape,pt,beta,'X');
        this.rotateInWorld(shape,pt,alpha,'Y');

        shape.m_eulers=[alpha,beta,gamma];

//        shape.rotateZ(alpha/180*Math.PI);
//        shape.rotateX(beta/180*Math.PI);
//        shape.rotateZ(gamma/180*Math.PI);
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

getEulers(shape) {
let eulers=[shape.rotation.x/Math.PI*180,shape.rotation.y/Math.PI*180,shape.rotation.z/Math.PI*180];
console.log(eulers);
print(eulers)
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

    removeObj(var_shape) {
        var_shape.geometry.dispose();
        var_shape.material.dispose();
        this.m_objs.remove(var_shape);
    }

/*
addExtrudePoly
+[保存文本](,ThreeJS)
*/

    subObjs(var_shape1,var_shape2) {
        let var_shape=var_shape1;
        var_shape1=CSG.subtract(var_shape,var_shape2);
        this.removeObj(var_shape);
        this.m_objs.add(var_shape1);
        return var_shape1;
    }

    intObjs(var_shape1,var_shape2) {
        let var_shape=var_shape1;
        var_shape1=CSG.intersect(var_shape,var_shape2);
        this.removeObj(var_shape);
        this.m_objs.add(var_shape1);
        return var_shape1;
    }

    uniObjs(var_shape1,var_shape2) {
        let var_shape=var_shape1;
        var_shape1=CSG.union(var_shape,var_shape2);
        this.removeObj(var_shape);
        this.m_objs.add(var_shape1);
        return var_shape1;
    }

    exportOBJ() {
        const exporter = new OBJExporter();
//        const data = exporter.parse( this.m_scene );
        const data = exporter.parse( this.m_objs );
//        console.log(data);
        this.downloadFile("model.obj", data );
    }

    exportSTL(obj=0) {
        const exporter = new STLExporter();
//        const data;
        if (obj==0) {
            const data = exporter.parse( this.m_objs );
            this.downloadFile("model.stl", data );
        } else {
            const data = exporter.parse( obj );
            this.downloadFile("model.stl", data );
        }
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
setposition
setRotation
subObjs
例子:...
测试:...
+[新建阅读窗口](,测试)
+[J函数](,ThreeJS)
*/