/*
地址::文档/S应用/NiniJS/js/StCore.js
+[保存文本](,StCore)
+[J函数](,StCore)

###
StParser(库)::文档/S应用/NiniJS/js/Parser.js
Karma(库)::文档/S应用/NiniJS/js/Karma.js
NetP(库)::文档/S应用/NiniJS/js/NetP.js

记住"Javascript"
clear
print
[m_name]
*/

function listFromPt(pt) {
    var list_pt=[];

    if(pt=='') {
        return list_pt;
    }

    for(var i=0;i<pt.m_con.length;i++) {
        if(pt.m_con[i].m_name=='的' & pt.m_con[i].m_db[1]!='' & pt.m_con[i].m_db[1]!=pt) {
            list_pt.push(pt.m_con[i].m_db[1]);
        }
    }
    return list_pt;
}


class StCore {
    constructor() {
        this.m_parser=new Parser();

        this.m_self='';
        this.m_lib='';
        this.m_idea='';
        this.m_hear='';
        this.m_speak='';
        this.m_world='';

        this.m_tmp=[];
    }

/*
+[保存文本](,StCore)
loadFCode
说
保存init:...
*/

    init(list_pt0) {
        var list_pt=[];

        for(var i in list_pt0) {
            var pt=list_pt0[i];
            if(pt.m_name==='Nini') {
                this.m_self=pt;
                pt.m_permission=0;
            }
        }
        //this.m_self=list_pt0[0];
        //this.m_self.m_permission=0;

        list_pt=listFromPt(this.m_self);

        for(var i in list_pt) {
            var pt=list_pt[i];
            if(pt.m_name==='m_lib') {
                this.m_lib=pt;
                pt.m_permission=0;
            }
            else if(pt.m_name==='m_idea') {
                this.m_idea=pt;
                pt.m_permission=0;
            }
            else if(pt.m_name==='听') {
                this.m_hear=pt;
                pt.m_permission=0;
            }
            else if(pt.m_name==='说') {
                this.m_speak=pt;
                pt.m_permission=0;
            }
            else if(pt.m_name==='世界') {
                this.m_world=pt;
                pt.m_permission=0;
            }
        }

        if(this.m_hear=='') {
            this.m_hear=new NetP('听');
            new NetP('的').con(this.m_self,this.m_hear);
            this.m_hear.m_permission=0;
        }
        if(this.m_speak=='') {
            this.m_speak=new NetP('说');
            new NetP('的').con(this.m_self,this.m_speak);
            this.m_speak.m_permission=0;
        }
        if(this.m_world=='') {
            this.m_world=new NetP('世界');
            new NetP('的').con(this.m_self,this.m_world);
            this.m_world.m_permission=0;
        }

        return list_pt;
    }

    do(code,pt_in='',list_global=[]) {
        var list_pt=listFromPt(pt_in)
        var list_new=[];
        var list_km=[];

        mergeArrays(list_pt,list_global);
        if(!list_pt.includes(pt_in) & pt_in!='') {
            list_pt.push(pt_in);
        }

        [code,list_km]=this.run_code(code,list_pt,list_new);
        list_new=this.operation(list_new);
        
        for(var i=0;i<list_new.length;i++) {
            var pt=list_new[i],pt_de;
            pt_de=new NetP('的');
            pt_de.con(pt_in,pt);
        }
    
        return [code,list_km];
    }

    make(code,pt_in='') {
        var list_pt=this.m_parser.buildPoints_tokener(code);
        if(pt_in==='') {
            return list_pt
        }
        for(var i in list_pt) {
            var pt=list_pt[i];
            new NetP('的').con(pt_in,pt);
        }
        return list_pt;
    }

/*
保存run_code_line:...
think
*/

    run_code_line(km,list_pt,list_ns) {
        var code,list_km,list_new,list_del=[];
        var karma,int_result=false;
        var pool=listPt2poolPt(list_pt);

        list_km=km.allEffects();
        
        list_km[0].m_stage=1;
        var change=true,change1;

        while(change) {
            change=false;
            for(var i=0;i<list_km.length;i++) {
                [change1,list_new]=list_km[i].Reason_oneStep(pool);
                karma=list_km[i];

//print(karma.info(),karma.m_interp);
                if(karma.m_interp) {
                    int_result=this.think(karma.m_map);
                    list_del.push(karma.m_map);
                    if(!int_result) {
                        karma.m_map='';
                    }
                }

                listPtIntoPoolPt(pool,list_new);
                mergeArrays(list_pt,list_new);
                mergeArrays(list_ns,list_new);
        
                if(change1 & !change) {
                    change=true;
                }
            }
        }

        for(var i=0;i<list_del.length;i++) {
            list_del[i].delete();
        }

        return true;
    }
    
    run_code(code0,list_pt,list_ns=[]) {
        var code1=code0,list_km;
        var parser=this.m_parser;

        list_km=parser.readSubCode_tokener(code0);

        for(var i in list_km) {
            this.run_code_line(list_km[i],list_pt,list_ns);
        }

        return [code0,list_km];
    }

    act(pt_code,pt) {
        var code1=pt_code.m_text;
        var list_km=[],list_new=[],result=false;
        var parser=this.m_parser;

        list_km=parser.readSubCode_tokener(code1);
//print(writeStdCode_karma(list_km[0],[]));
    
        list_km[0].m_listMP=[pt];
        list_km[0].m_restricted=true;

        result=this.run_code_line(list_km[0],[pt_code],list_new);
        if(result) {
            list_new=this.operation(list_new);
        }
        return result;
    }

    reorder_ops(list_pt) {
        list_pt.sort(function(a,b){return b.m_time-a.m_time;});
    }

    operation(list_pt) {
        var list_del=[];
        var list_new=[];
        this.reorder_ops(list_pt);
        for(var i=list_pt.length-1;i>=0;i--) {
            var pt=list_pt[i];
            var operated=false;
            var sbj=pt.m_db[0],obj=pt.m_db[1];
            pt.m_building=false;

            if(pt.m_name=='[del]' | pt.m_name=='[删除]') {
                this.opDel(pt,list_pt,list_del);
                operated=true;
            }
            else if(pt.m_name=='[左连]') {
                this.opConnect(sbj,obj,0);
                operated=true;
            }
            else if(pt.m_name=='[右连]') {
                this.opConnect(sbj,obj,1);
                operated=true;
            }

            else if(pt.m_name=='[消息窗口]') {
                this.opMsgWin(pt);
                operated=true;
            }
            else if(pt.m_name=='[显示]') {
                this.opPrint(obj,pt);
                operated=true;
            }
            else if(pt.m_name=='[修改内容]') {
                this.opWriteText(sbj,obj,pt);
                operated=true;
            }
            else if(pt.m_name=='[增加内容]') {
                this.opAddToText(sbj,obj,pt);
                operated=true;
            }
            else if(pt.m_name=='[标题]') {
                this.opName(sbj,pt);
                operated=true;
            }
            else if(pt.m_name=='[模板文本]') {
                this.opTempText(sbj,obj,pt);
                operated=true;
            }

            else if(pt.m_name=='[做]') {
                this.opDo(pt);
                operated=true;
            }
            else if(pt.m_name=='[JS]') {
                this.opJs(obj,pt);
                operated=true;
            }

            else if(pt.m_name=='[临时文本]') {
                operated=true;
            }

            else if(pt.m_name.length>1 & pt.m_name[0]=='[' & pt.m_name[pt.m_name.length-1]==']') {
                this.opLibDefined(pt);
                operated=true;
            }

            if(operated) {
                list_del.push(i);
                list_new=this.clear(list_new);
            }
        }

        list_pt=this.delActPts(list_pt,list_del);
        return list_pt;
    }

    delActPts(list_pt,list_del) {
        for (let i=0;i<list_del.length;i++) {
            let i_del=list_del[i];
            let pt_del=list_pt[i_del];
            list_pt.splice(i_del,1);
    
            for (let j in pt_del.m_con) {
                if (pt_del.m_con[j].m_name==="的") {
                    pt_del.m_con[j].delete();
                }
            }

            pt_del.delete();
        }
    
        return list_pt;
    }
    
    opMsgWin(action) {
        var obj=action.m_db[1];
        var name,text;
        if(obj=='' & action.m_text=='') {
            return;
        }
        else if(obj!=='') {
            name=obj.info();
            text=obj.m_text;
        }
        else {
            name='消息';
            text=action.m_text;
        }
        alert(`${name}: ${text}`);
    }

/*
replace
*/

    opDo(action) {
        var con_de='';
        for(var i in action.m_con) {
            var con=action.m_con[i];
            if(con.m_name=='[code]' | con.m_name=='code') {
                if(con.m_db[1]!='' & con.m_db[1]!=action) {
                    con_de=con.m_db[1];
                }
            }
        }
        
        if(con_de!=='') {
            action.m_name='['+con_de.m_name+']';
            this.act(con_de,action);
        }
    }

/*
+[新建阅读窗口](,测试)
*/

    opJs(obj,action) {
        var code=action.m_text;
        var var_name='';
        var code_out=`\nvar outs_in_JS={`;
        var outs,outs_var={},outs_var_v={};
        
        for(var i in action.m_con) {
            var pt=action.m_con[i];
            if(pt.m_name=='code' | pt.m_name=='[code]') {
                if(pt.m_db[1]!='' & pt.m_db[1]!=action) {
                    code=pt.m_db[1].m_text;
                }
                break;
            }
        }
        
        if(obj!=='') {
            code_out+="'ans':`${ans}`,";
            outs_var['ans']=obj;
        }

        for(var i in action.m_con) {
            var pt=action.m_con[i];
            if(pt.m_name=='.' | pt.m_name=='[.]' | pt.m_name=='o' | pt.m_name=='[o]') {
                if(pt.m_db[1]!='' & pt.m_db[1]!=action) {
                    if(pt.m_text!='') {
                        var_name=pt.m_text;
                    }
                    else {
                        var_name=pt.m_db[1].m_name;
                    }
                    code=code.split('%'+var_name).join(pt.m_db[1].m_text);
                }
            }

            if(pt.m_name=='o' | pt.m_name=='[o]') {
                if(pt.m_db[1]!='' & pt.m_db[1]!=action) {
                    if(pt.m_text!='') {
                        var_name=pt.m_text;
                    }
                    else {
                        var_name=pt.m_db[1].m_name;
                    }
                    code_out+="'"+var_name+"':`${"+var_name+"}`,";
                    outs_var[var_name]=pt.m_db[1];
                }
            }
            else if(pt.m_name=='v' | pt.m_name=='[v]') {
                if(pt.m_db[1]!='' & pt.m_db[1]!=action) {
                    if(pt.m_text!='') {
                        var_name=pt.m_text;
                    }
                    else {
                        var_name=pt.m_db[1].m_name;
                    }
                    window[var_name]=pt.m_db[1].m_var;
                    outs_var_v[var_name]=pt.m_db[1];
                }
            }

        }
        code_out+='};outs_in_JS';

        "use strict";
        try {
            outs=eval(code+code_out);
            for(var key in outs) {
                outs_var[key].m_text=outs[key];
            }
            for(var key in outs_var_v) {
                outs_var_v[key].m_var=window[key];
            }
        } catch(e) {
            print(e);
        }

    }

    opPrint(obj,action) {
        var text='',con='';
        if(action.m_text==='') {
            text=obj.info();
        }
        else if(obj==='') {
            text=action.m_text;
        }
        else {
            con=obj.m_text;
            text=action.m_text+obj.info();
        }
        print(text);
    }

    opWriteText(sbj,obj,action) {
        if(obj==='') {
            return;
        }
        else if(obj.m_permission==0) {
            //print();
        }
        
        var text='',con='';
        if(sbj=='' & action.m_text==='') {
            return;
        }
        else if(action.m_text==='') {
            text=sbj.m_text;
        }
        else if(sbj==='') {
            text=action.m_text;
        }
        else {
            con=sbj.m_text;
            text=action.m_text+con;
        }
        obj.m_text=text;
    }

    opAddToText(sbj,obj,action) {
        if(obj=='') {
            return;
        }
        else if(obj.m_permission==0) {
            //obj.print();
        }
    
        var text,con;
        if(sbj=='' & action.m_text=='') {
            return;
        }
        else if(action.m_text=='') {
            text=sbj.m_text;
        }
        else if(sbj=='') {
            text=action.m_text;
        }
        else {
            con=sbj.m_text;
            text=action.m_text+con;
        }
        obj.m_text+=text;
    }

    opName(sbj,action) {
        if(sbj==='') {
            return
        }
        action.m_text=sbj.m_name;
    }

    opTempText(sbj,obj,action) {
        var text=action.m_text;
        var text_name;
        
        if(sbj!='') {
            text=sbj.m_text;
        }
        else {
            for(var i in action.m_con) {
                var pt=action.m_con[i];
                if(pt.m_name=='code' | pt.m_name=='[code]') {
                    if(pt.m_db[1]!='' & pt.m_db[1]!=action) {
                        text=pt.m_db[1].m_text;
                    }
                    break;
                }
            }
        }
        
        for(var i in action.m_con) {
            var pt=action.m_con[i];
            if(pt.m_name=='.' | pt.m_name=='[.]') {
                if(pt.m_db[1]!='' & pt.m_db[1]!=action) {
                    if(pt.m_text!='') {
                        text_name=pt.m_text;
                    }
                    else {
                        text_name=pt.m_db[1].m_name;
                    }
                    text=text.split('%'+text_name).join(pt.m_db[1].m_text);
                }
            }
        }
        obj.m_text=text;
    }
    
    opDel(action,list_pt,list_del) {
        if(action.m_db[1]=='') {
            return;
        }
        var pt_del=action.m_db[1];
        pt_del.delete()

        if(pt_del in list_del) {
            return;
        }
        else {
            list_del.push(list_pt.indexOf(pt_del));
        }
    }

    opConnect(sbj,obj,i) {
        if(sbj=='') {
            return;
        }
        sbj.disconnect_i(i);
        sbj.connect(obj,i);
    }

    opLibDefined(action) {
        var list_pt=listFromPt(this.m_lib);
        var name=action.m_name.slice(1,action.m_name.length-1);
        var result=false;

        for(let i in list_pt) {
            let pt=list_pt[i];
            if(name===list_pt[i].m_name) {
                result=this.act(pt,action);
                if(result) {
                    break;
                }
            }
        }
    }

    think(question) {
        var result=false;
        var list_pt=listFromPt(this.m_idea);
        var name=question.m_name.slice(1,question.m_name.length-1);
    
        for(var i in list_pt) {
            var pt=list_pt[i];
            if(name===list_pt[i].m_name) {
                result=this.match(list_pt[i],question);
                if(result) {
                    return true;
                }
            }
        }
        result=this.termBuiltin(question);
        return result;
    }
/*
+[保存文本](,StCore)
*/
    clear(list_ns) {
        let list_new=this.m_tmp;
        var list_pt=[];
        for (let i in list_new) {
            let pt=list_new[i];
            if (pt.m_project===false) {
                pt.delete();
            }
            else {
                list_pt.push(pt);
            }
        }
        this.m_tmp=[];

        list_pt=this.operation(list_pt);
        list_ns=list_ns.concat(list_pt);
        return list_ns;
    }
    
    match(pt_A,pt_Q) {
        var code1=pt_A.m_text;
        var list_km=[],list_new=[],result=false;
        var parser=this.m_parser;
        var list_pt=[];

        list_km=parser.readSubCode_tokener(code1);
    
        list_pt=listFromPt(pt_A);
        list_pt.push(pt_A);
        list_km[0].m_listMP=[pt_Q];
        list_km[0].m_restricted=true;
        this.run_code_line(list_km[0],list_pt,list_new);

        this.m_tmp=this.m_tmp.concat(list_new);

        if(list_km[0].m_reState==='dark green') {
            result=true;
        }
        else {
            result=false;
        }

        return result;
    }
    
    termBuiltin(question) {
        var sbj,obj;
        sbj=question.m_db[0];
        obj=question.m_db[1];
        
        if(question.m_name=='[m_name]') {
            return this.tpName(sbj,obj,question);
        }
        else if(question.m_name=='[m_text]') {
            return this.tpText(sbj,obj,question);
        }
        else if(question.m_name=='[==]') {
            return this.tpEqual(sbj,obj,question);
        }
        else if(question.m_name=='[想]') {
            return this.tpThink(question);
        }
        else if(question.m_name=='[说]') {
            return this.tpSay(obj,question);
        }
        else if(question.m_name=='[投影]') {
            return this.tpProject(obj,question);
        }
        
        return false;
    }
    
    tpThink(question) {
        var pt_A="",result=false;
        
        for (var i in question.m_con) {
            var con=question.m_con[i];
            if (con.m_name==="code" | con.m_name==="[code]") {
                if (con.m_db[0]===question & con.m_db[1]!=='') {
                    pt_A=con.m_db[1];
                    question.m_name='['+pt_A.m_name+']';
                }
            }
        }
        if (pt_A!=="") {
            result=this.match(pt_A,question);
        }
        question.m_name='想';
        return result;
    }

    tpName(sbj,obj,question) {
        if(question.m_db[0]==='' | question.m_db[1]==='') {
            return false;
        }
        var name=question.m_db[0].m_name;
    
        if(name[0]==='[' & name[name.length-1]===']') {
            name=name.slice(1,name.length-1);
        }
        if(name==='') {
            print('Error! Name can\'t be empty');
            return false;
        }

        if(question.m_db[1].m_building==true) {
            question.m_db[1].m_name=name;
        }
        else {
            print("Error! [m_name] can only set a new point's m_name.",question.m_db[1].info(),"isn't a new point.");
        }
        this.answerQuestion(question);
        return true;
    }
    
    tpText(sbj,obj,question) {
        var text="";
        if(question.m_db[1]==='') {
            return false;
        }
        else if(question.m_db[0]==='') {
            text=question.m_text;
        }
        else {
            text=question.m_db[0].m_text;
        }
    
        if(question.m_db[1].m_building==true) {
            question.m_db[1].m_text=text;
        }
        else {
            print("Error! [m_text] can only set a new point's m_text.",question.m_db[1].info(),"isn't a new point.");
        }

        this.answerQuestion(question);
        return true;
    }
    
    tpSay(obj,question) {
        var text="";
        if(question.m_db[1]==='' & question.m_text==='') {
            return false;
        }
        else if(question.m_text==='') {
            text=question.m_db[1].info();
        }
        else if(question.m_db[1]==='') {
            text=question.m_text;
        }
        else {
            text=question.m_text+question.m_db[1].info();
        }
        print(text);

        this.answerQuestion(question);
        return true;
    }
    
    tpProject(obj,question) {
        if(question.m_db[1]==='') {
            return false;
        }
        question.m_db[1].m_project=true;
        this.answerQuestion(question);
        return true;
    }

    tpEqual(sbj,obj,question) {
        if(obj==='') {
            return false;
        }
        if(sbj==='') {
            if(obj.m_text===question.m_text) {
                this.answerQuestion(question);
                return true;
            }
        }
        else if(obj.m_text===sbj.m_text) {
            this.answerQuestion(question);
            return true;
        }
        return false;
    }

    answerQuestion(question) {
        var name=question.m_name;
        if(name.length<2) {
            return false;
        }
        if(name[0]==='[' & name[name.length-1]===']') {
            question.m_name=name.slice(1,name.length-1);
            question.m_creator='Nini';
        }
        return true;
    }

}

function listPt2poolPt(list_pt) {
    var pool={};
    
    for(var i=0;i<list_pt.length;i++) {
        var pt=list_pt[i];
        var name=pt.m_name;
        
        if(pool[name]===undefined) {
            pool[name]=[pt];
        }
        else {
            pool[name].push(pt);
        }
    }

    return pool;
}

function listPtIntoPoolPt(pool,list_pt) {
    for(var i=0;i<list_pt.length;i++) {
        var pt=list_pt[i];
        var name=pt.m_name;
        
        if(pool[name]===undefined) {
            pool[name]=[pt];
        }
        else if(!pool[name].includes(pt)) {
            pool[name].push(pt);
        }
    }

    return pool;
}

function poolPt2listPt(pool) {
    var list_pt=[];
    
    for(var key in pool) {
        list_pt=[...list_pt,...pool[key]];
    }
    
    return list_pt;
}

/*
消息窗口
+[保存文本](,StCore)
*/


function loadFCode(fcode) {
    var list_pt=[];
    var list_del=[];
    var code=fcode;
    code=code.replaceAll("\r\n","\n");

//    if (code.slice(0,7)!="### 节点\n") {
    if (code.slice(0,4)!="### ") {
        throw new Error("错误! 没有检测到节点段落. ");
    }
    code=code.slice(7);
    // print("开始输入节点... ");
    i=-2;
    while (true) {
        code=code.slice(i+2);
        if (code=='') {
            break;
        }
        else if (code[0]=='\n') {
            code=code.slice(1);
            break;
        }
        i=code.search(", ");
        if (i==-1) {
            throw new Error("错误! 节点段落没有恰当地终止! ");
        }
        list_pt.push(new NetP(code.slice(0,i)));
    }

//    if (code.slice(0,7)!="### 关联\n") {
    if (code.slice(0,4)!="### ") {
        throw new Error("错误! 没有检测到关联段落. ");
    }
    code=code.slice(7);
    i=-2;
    n=-1;
    while (true) {
        n+=1;
        code=code.slice(i+2);
        if (code=='') {
            break;
        }
        else if (code[0]=='\n') {
            code=code.slice(1);
            break;
        }
        i=code.search(", ");
        if (i==-1) {
            throw new Error("错误! 关联段落没有恰当地终止! ");
        }
        con=code.slice(0,i);
        j=con.search('#');
        if (j==-1) {
            // print("警告! 第%d个节点关联的格式有误, 该节点将被删除! "%(n));
            list_del.push(n);
            continue;
        }
        num0=con.slice(0,j);
        num1=con.slice(j+1);
        if (num0=="del" || num1=="del") {
            list_del.push(n);
            continue;
        }
        con0='';
        if (num0!='') {
            try {
                con0=list_pt[parseInt(num0)];
            } catch(e) {
                list_del.push(n);
                continue;
            }
        }
        con1='';
        if (num1!='') {
            try {
                con1=list_pt[parseInt(num1)];
            } catch(e) {
                list_del.push(n);
                continue;
            }
        }
        list_pt[n].con(con0,con1);
    }
    // print("构建关联完成! ");
    // print("开始读取内容... ");
//    if (code.slice(0,7)!="### 内容\n") {
    if (code.slice(0,4)!="### ") {
        throw new Error("错误! 没有检测到内容段落. ");
    }
    code=code.slice(7);
    while (true) {
        re=/^#([\d]*), ([\d]*):\n/g;
        result=re.exec(code);
        if (result==null) {
//            if (code!='' && code=="### 结束") {
            if (code!='' && code.slice(0,6)=="### 结束") {
                break;
            }
            else {
                throw new Error("错误! 内容的格式不正确. ");
            }
        }
        n=parseInt(result[1]);
        length=parseInt(result[2]);
        i=result[0].length;
        code=code.slice(i);
        text=code.slice(0,length);
        list_pt[n].m_text=text;
        code=code.slice(length);
        if (code.slice(0,8)!='\n## end\n') {
            throw new Error("错误! 内容的格式不正确");
        }
        code=code.slice(8);
    }
    // print("内容读取完成! ");
    if (list_del.length>0) {
        // print(`There are ${list_del.length} invalid points!`);
        list_del.reverse();
    }
    return list_pt;
}


var Nini=new StCore();


/*
+[保存文本](,StCore)
+[J函数](,StCore)
测试:...
+[新建阅读窗口](,测试)
*/