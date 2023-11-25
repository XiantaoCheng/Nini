/*
地址::文档/S应用/NiniJS/js/draw.js
+[保存文本](,画板代码)
+[J函数](,画板代码)
Nini, 打开ThreeJS(文件)
gridOn
*/


class Scene2D {
    constructor() {
        this.m_pt0=[0,0];
        this.m_size=[100,100];
        this.m_ratio=1;
        this.m_container='';
        this.m_scene='';
        this.m_objs='';

        this.m_gridOn=true;
        this.m_axis=[];
    }


    init(W=1500,H=700,ID='') {
        let ele;
        if(ID!=="") {
            ele = document.getElementById(ID);
            W=ele.offsetWidth; 
            H=ele.offsetHeight; 
        }
        else {
            ele=document.body;
        }
        if(ele===null) {
            ele=document.body;
        } 

        this.m_container=ele;
        this.createSVG(W,H,ele);

        this.m_size=[W,H];
    }
/*
记住"Javascript"
+[保存文本](,画板代码)
*/
    createSVG(W,H,ele) {
        let pt0=this.m_pt0;

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('style', 'border: 1px solid black');
        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        svg.setAttribute('viewBox', [pt0[0]-W/2,pt0[1]-H/2,W,H]);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute('onmousedown','loadDragFunc2(this)');
        svg.addEventListener('wheel',this.changeRatio);

        svg.m_world=this;
        ele.appendChild(svg);
        this.m_scene = svg;
    }

/*
wheel::https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
*/

    changeRatio(e) {
//        print(e.deltaY);
        let ratio=this.m_world.m_ratio;
        let pt0=this.m_world.m_pt0;
        if (e.deltaY>0) {
            this.m_world.setWindow(pt0,ratio*1.1);
        } else {
            this.m_world.setWindow(pt0,ratio*0.9);
        }
    }

    grid(dW=60,color="#555555") {
        let pt0=this.m_pt0;
        let ratio=this.m_ratio;
        let W=this.m_size[0]*ratio;
        let H=this.m_size[1]*ratio;

        let n=parseInt(Math.log(ratio)/Math.log(1.5));
        dW=dW*1.5**n;

        let Nx=W/dW+1;
        let Ny=H/dW+1;
        let Nx0=parseInt((pt0[0]-W/2)/dW);
        let Ny0=parseInt((pt0[1]-H/2)/dW);

        for (let i=0;i<Ny;i++) {
            var shape=document.createElementNS("http://www.w3.org/2000/svg",'line');
            shape.setAttribute('x1',pt0[0]-W/2);
            shape.setAttribute('x2',pt0[0]+W/2);
            shape.setAttribute('y1',(Ny0+i)*dW);
            shape.setAttribute('y2',(Ny0+i)*dW);
            shape.setAttribute('stroke',color);
            shape.setAttribute('stroke-width',"0.1%");
//            this.m_scene.appendChild(shape);
            this.m_scene.insertBefore(shape,this.m_scene.firstChild);

            this.m_axis.push(shape);
        }

        for (let i=0;i<Nx;i++) {
            var shape=document.createElementNS("http://www.w3.org/2000/svg",'line');
            shape.setAttribute('y1',pt0[1]-H/2);
            shape.setAttribute('y2',pt0[1]+H/2);
            shape.setAttribute('x1',(Nx0+i)*dW);
            shape.setAttribute('x2',(Nx0+i)*dW);
            shape.setAttribute('stroke',color);
            shape.setAttribute('stroke-width',"0.1%");
            this.m_scene.insertBefore(shape,this.m_scene.firstChild);
//            this.m_scene.appendChild(shape);

            this.m_axis.push(shape);
        }
    }

    background (color="#ffffff") {
        let pt0=this.m_pt0;
        let ratio=this.m_ratio;
        let W=this.m_size[0]*ratio;
        let H=this.m_size[1]*ratio;

        var shape=document.createElementNS("http://www.w3.org/2000/svg",'rect');
        shape.setAttribute('x',pt0[0]-W/2);
        shape.setAttribute('y',pt0[1]-H/2);
        shape.setAttribute('width',W);
        shape.setAttribute('height',H);
        shape.setAttribute('fill',color);
        shape.setAttribute('stroke-width',"0.3%");
        this.m_scene.insertBefore(shape,this.m_scene.firstChild);
        this.m_axis.push(shape);

    }

    axes(dW=60,color="#ffffff") {
        let pt0=this.m_pt0;
        let ratio=this.m_ratio;
        let W=this.m_size[0]*ratio;
        let H=this.m_size[1]*ratio;

        var shape=document.createElementNS("http://www.w3.org/2000/svg",'line');
        shape.setAttribute('x1',pt0[0]-W/2);
        shape.setAttribute('x2',pt0[0]+W/2);
        shape.setAttribute('y1',0);
        shape.setAttribute('y2',0);
        shape.setAttribute('stroke',color);
        shape.setAttribute('stroke-width',"0.3%");
        this.m_scene.insertBefore(shape,this.m_scene.firstChild);
        this.m_axis.push(shape);

        var shape=document.createElementNS("http://www.w3.org/2000/svg",'line');
        shape.setAttribute('y1',pt0[1]-H/2);
        shape.setAttribute('y2',pt0[1]+H/2);
        shape.setAttribute('x1',0);
        shape.setAttribute('x2',0);
        shape.setAttribute('stroke',color);
        shape.setAttribute('stroke-width',"0.3%");
        this.m_scene.insertBefore(shape,this.m_scene.firstChild);
        this.m_axis.push(shape);

    }
/*
+[保存文本](,画板代码)
*/

    tick(dW=60) {
        let pt0=this.m_pt0;
        let ratio=this.m_ratio;
        let W=this.m_size[0]*ratio;
        let H=this.m_size[1]*ratio;

        let n=parseInt(Math.log(ratio)/Math.log(1.5));
        ratio=1.5**n;
        dW=dW*1.5**n;

        let Nx=W/dW;
        let Ny=H/dW;
        let Nx0=parseInt((pt0[0]-W/2)/dW);
        let Ny0=-parseInt((pt0[1]+H/2)/dW);

        for (let i=0;i<Ny;i++) {
            var shape=document.createElementNS("http://www.w3.org/2000/svg",'text');
            shape.textContent=`${Math.round((Ny0+i)*dW)}`;
            shape.setAttribute('x',0);
            shape.setAttribute('y',-(Ny0+i)*dW);
            shape.setAttribute('fill','black');
            shape.setAttribute('font-size',15*ratio);
            this.m_scene.insertBefore(shape,this.m_scene.firstChild);
//            this.m_scene.appendChild(shape);

            this.m_axis.push(shape);
        }
/*
+[保存文本](,画板代码)
*/

        for (let i=0;i<Nx;i++) {
            var shape=document.createElementNS("http://www.w3.org/2000/svg",'text');
            shape.textContent=`${Math.round((Nx0+i)*dW)}`;
            shape.setAttribute('y',0);
            shape.setAttribute('x',(Nx0+i)*dW);
            shape.setAttribute('fill','black');
            shape.setAttribute('font-size',15*ratio);
            this.m_scene.insertBefore(shape,this.m_scene.firstChild);
//            this.m_scene.appendChild(shape);

            this.m_axis.push(shape);
        }
    }

    gridOn() {
        for (let i in this.m_axis) {
            this.m_axis[i].remove();
        }
        this.m_axis=[];
        this.m_gridOn=true;

        this.tick(100);
        this.axes(100,"#000000");
        this.grid(10,"#eeeeee");
        this.grid(100,"#888888");
        this.background();
    }

    gridOff() {
        for (let i in this.m_axis) {
            this.m_axis[i].remove();
        }
        this.m_axis=[];
        this.m_gridOn=false;
    }

    axis(axis_) {
        let pt0=[(axis_[0]+axis_[1])/2,-(axis_[2]+axis_[3])/2];
        let ratio;
        if(axis_[1]-axis_[0]>axis_[3]-axis_[2]) {
            ratio=(axis_[1]-axis_[0])/this.m_size[0];
        } else {
            ratio=(axis_[3]-axis_[2])/this.m_size[1];
        }
        this.setWindow(pt0,ratio);
    }

/*
grid
+[保存文本](,画板代码)
*/

    setWindow(pt0,ratio=1) {
        let svg=this.m_scene;
        let W=this.m_size[0]*ratio;
        let H=this.m_size[1]*ratio;

        this.m_ratio=ratio;
        this.m_pt0=[pt0[0],pt0[1]];
        svg.setAttribute('viewBox', [pt0[0]-W/2,pt0[1]-H/2,W,H]);

        if (this.m_gridOn) {
            this.gridOn();
        }
    }

    addRect(W,H,x,y) {
        var shape=document.createElementNS("http://www.w3.org/2000/svg",'rect');
        shape.setAttribute('width',W);
        shape.setAttribute('height',H);
        shape.setAttribute('x',x);
        shape.setAttribute('y',-y);

        shape.m_pos=[x,y];
        shape.m_world=this;
        shape.m_imType="rect";

        shape.setAttribute('fill','#ffffff');
        shape.setAttribute('stroke','#000000');
        shape.setAttribute('stroke-width',"0.1%");
        shape.setAttribute('onmousedown','loadDragFunc(this)');
        this.m_scene.appendChild(shape);
    
        return shape;
    }

    addCirc(R,x,y) {
        var shape=document.createElementNS("http://www.w3.org/2000/svg",'circle');
        shape.setAttribute('r',R);
        shape.setAttribute('cx',x);
        shape.setAttribute('cy',-y);

        shape.m_pos=[x,y];
        shape.m_world=this;
        shape.m_imType="circ";

        shape.setAttribute('fill','#ffffff');
        shape.setAttribute('stroke','#000000');
        shape.setAttribute('stroke-width',"0.1%");
        shape.setAttribute('onmousedown','loadDragFunc(this)');
        this.m_scene.appendChild(shape);
    
        return shape;
    }

    addElip(rx,ry,x,y) {
        var shape=document.createElementNS("http://www.w3.org/2000/svg",'ellipse');
        shape.setAttribute('rx',rx);
        shape.setAttribute('ry',ry);
        shape.setAttribute('cx',x);
        shape.setAttribute('cy',-y);

        shape.m_pos=[x,y];
        shape.m_world=this;
        shape.m_imType="elip";

        shape.setAttribute('fill','#ffffff');
        shape.setAttribute('stroke','#000000');
        shape.setAttribute('stroke-width',"0.1%");
        shape.setAttribute('onmousedown','loadDragFunc(this)');
        this.m_scene.appendChild(shape);
    
        return shape;
    }

/*
Nini, 打开花园(文件)
+[保存文本](,画板代码)
*/
    addPoly(pt0,x,y,angle=0,im_type="G") {
        if (im_type!=="L") {
            var shape=document.createElementNS("http://www.w3.org/2000/svg",'polygon');
            shape.setAttribute('fill','#ffffff');
        } else {
            var shape=document.createElementNS("http://www.w3.org/2000/svg",'polyline');
            shape.setAttribute('fill','none');
        }
        let pts=[];

        this.m_x=[];
        this.m_y=[];
        for (let i in x) {
            this.m_x.push(x[i]);
            this.m_y.push(y[i]);

            let xi,yi;
            xi=x[i]*Math.cos(angle/180*Math.PI)-y[i]*Math.sin(angle/180*Math.PI);
            yi=y[i]*Math.cos(angle/180*Math.PI)+x[i]*Math.sin(angle/180*Math.PI);
            pts.push([xi+pt0[0],-pt0[1]-yi]);
        }
        shape.setAttribute('points',pts);

        shape.m_pos=[pt0[0],pt0[1]];
        shape.m_world=this;
        shape.m_imType="poly";

        shape.setAttribute('stroke','#000000');
        shape.setAttribute('stroke-width',"0.1%");
        shape.setAttribute('onmousedown','loadDragFunc(this)');
        this.m_scene.appendChild(shape);
    
        return shape;
    }

    setRect(shape,W,H,x,y) {
        shape.setAttribute('width',W);
        shape.setAttribute('height',H);
        shape.setAttribute('x',x);
        shape.setAttribute('y',-y);
        shape.m_pos=[x,y];
    }
    setCirc(shape,R,x,y) {
        shape.setAttribute('r',R);
        shape.setAttribute('cx',x);
        shape.setAttribute('cy',-y);
        shape.m_pos=[x,y];
    }
    setElip(shape,rx,ry,x,y) {
        shape.setAttribute('rx',rx);
        shape.setAttribute('ry',ry);
        shape.setAttribute('cx',x);
        shape.setAttribute('cy',-y);
        shape.m_pos=[x,y];
    }
    setPoly(shape,pt0,x,y,angle=0,im_type="L") {
        let pts=[];
        this.m_x=[];
        this.m_y=[];
        for (let i in x) {
            this.m_x.push(x[i]);
            this.m_y.push(y[i]);
            let xi,yi;
            xi=x[i]*Math.cos(angle/180*Math.PI)-y[i]*Math.sin(angle/180*Math.PI);
            yi=y[i]*Math.cos(angle/180*Math.PI)+x[i]*Math.sin(angle/180*Math.PI);
            pts.push([xi+pt0[0],-pt0[1]-yi]);
        }
        shape.setAttribute('points',pts);
//        shape.setAttribute('points',[[0,0],[100,100]]);

        shape.m_pos=[pt0[0],pt0[1]];
    }
/*
+[保存文本](,画板代码)
*/

    moveTo(shape,x,y) {
        shape.m_pos=[x,y];

        if (shape.m_imType==="rect") {
            shape.setAttribute('x',x);
            shape.setAttribute('y',-y);
        } else if (shape.m_imType==="circ" || shape.m_imType==="elip") {
            shape.setAttribute('cx',x);
            shape.setAttribute('cy',-y);
        } else if (shape.m_imType==="poly") {
            this.setPoly(shape,[x,y],this.m_x,this.m_y);
        }
    }

    moveBy(shape,dx,dy) {
        let x=shape.m_pos[0]+dx;
        let y=shape.m_pos[1]+dy;
        shape.m_pos=[x,y];

        if (shape.m_imType==="rect") {
            shape.setAttribute('x',x);
            shape.setAttribute('y',-y);
        } else if (shape.m_imType==="circ" || shape.m_imType==="elip") {
            shape.setAttribute('cx',x);
            shape.setAttribute('cy',-y);
        } else if (shape.m_imType==="poly") {
            this.setPoly(shape,[x,y],this.m_x,this.m_y);
        }

//        shape.setAttribute('cx',x+dx);
//        shape.setAttribute('cy',-y-dy);
//        shape.setAttribute('x',x+dx);
//        shape.setAttribute('y',-y-dy);
    }

/*
输出png::https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser
输出svg::https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
+[打开网页](,输出png)
+[保存文本](,画板代码)
*/

    exportSVG() {
        var serializer = new XMLSerializer();
        const source = serializer.serializeToString(this.m_scene);
        this.downloadFile("picture.svg", source );
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



let doAction=function (e) {};
var currentMos=[0,0];
var currentPos=[0,0];
var currentClick=0;

function onmousedown_diy(e) {
    doAction(e);
}

document.body.addEventListener("mousedown", function(e) {
    currentMos[0]=e.clientX;
    currentMos[1]=e.clientY;
});
document.body.addEventListener("mousemove", onmousedown_diy);
document.body.addEventListener("mouseup", function(e) {
    currentClick=0;
    doAction=function(e) {};
});


function loadDragFunc(ele) {
    currentPos[0]=ele.m_pos[0];
    currentPos[1]=ele.m_pos[1];
    currentClick=1;

    doAction=function(e) {dragEle(e,ele)};
}

function loadDragFunc2(ele) {
    if (currentClick==1) {
        currentClick=0;
    } else {
        currentPos[0]=ele.m_world.m_pt0[0];
        currentPos[1]=ele.m_world.m_pt0[1];
        doAction=function(e) {dragEle2(e,ele)};
    }
}

function dragEle(e,pt_1) {
    let Dx=(e.clientX-currentMos[0]);
    let Dy=(e.clientY-currentMos[1]);

    let ratio=pt_1.m_world.m_ratio;
    Dx=Dx*ratio;
    Dy=-Dy*ratio;
    pt_1.m_world.moveTo(pt_1,Dx+currentPos[0],Dy+currentPos[1]);
}

function dragEle2(e,pt_1) {
    let Dx=(e.clientX-currentMos[0]);
    let Dy=(e.clientY-currentMos[1]);

    let ratio=pt_1.m_world.m_ratio;

    Dx=-Dx*ratio;
    Dy=-Dy*ratio;
    pt_1.m_world.setWindow([Dx+currentPos[0],Dy+currentPos[1]],ratio);
}


/*
print
测试:...
+[新建阅读窗口](,测试)
+[J函数](,画板代码)
*/