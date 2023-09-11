/*
地址::文档/S应用/NiniJS/Parser.js
+[保存文本](,Parser)
+[J函数](,Parser)
*/



function writeStdCode_karma(karma,list_pt) {
    var karma_code='',text='';

    if(karma=='') {
        return [karma_code,list_pt];
    }
    if(!list_pt.includes(karma.m_symbol)) {
        list_pt.push(karma.m_symbol);
    }
    if(karma.m_buildMode==true) {
        karma_code+='+';
    }
    // var n=list_pt.indexOf(karma.m_symbol);
    // karma_code+=(list_pt.indexOf(karma.m_symbol)).toString();
    karma_code+=karma.m_symbol.info();
    if(karma.m_clause.length!=0) {
        if(karma.m_clauseAnd==false) {
            karma_code+='|';
        }
        karma_code+='{';
        
        for(var i=0;i<karma.m_clause.length;i++) {
            var clause=karma.m_clause[i];
            [text,list_pt]=writeStdCode_karma(clause,list_pt);
            karma_code+=text;
            if(clause!=karma.m_clause[karma.m_clause.length-1]) {
                karma_code+=',';
            }
        }
        karma_code+='}';
    }
    if(karma.m_yese.length+karma.m_noe.length>1) {
        if(karma.m_yesAnd==true) {
            karma_code+='&';
        }
        karma_code+=':';
    }
    
    for(var i=0;i<karma.m_yese.length;i++) {
        var end=karma.m_yese[i];
        if(end.m_no==false) {
            karma_code+='->';
        }
        
        else {
            karma_code+='=>';
        }
        [text,list_pt]=writeStdCode_karma(end,list_pt);
        karma_code+=text;
        if(end!=karma.m_yese[karma.m_yese.length-1]) {
            karma_code+=',';
        }
    }
    
    for(var i=0;i<karma.m_noe.length;i++) {
        var end=karma.m_noe[i];
        if (karma.m_yese.length!=0) {
            karma_code+=',';
        }
        if(end.m_no==false) {
            karma_code+='->>';
        }
        
        else {
            karma_code+='=>>';
        }
        [text,list_pt]=writeStdCode_karma(end,list_pt);
        karma_code+=text;
        if(end!=karma.m_noe[karma.m_noe.length-1]) {
            karma_code+=',';
        }
    }
    if(karma.m_yese.length+karma.m_noe.length>1) {
        karma_code+=';';
    }
    return [karma_code,list_pt];
}

/*
do
保存NetPStack:...
*/

class NetPStack {
    
    constructor() {
        this.m_builtStack=[{}];
        this.m_undefinedStack=[{}];
    }

    info() {
        var info='',info_stack='';
        
        info+='Built: ';
        for(var i in this.m_builtStack) {
            info_stack=''
            for(var key in this.m_builtStack[i]) {
                info_stack+=`${key}:${this.m_builtStack[i][key].info()},`;
            }
            info+=`{${info_stack}},`;
        }
        
        info+='<br>Undefined: ';
        for(var i in this.m_undefinedStack) {
            info_stack=''
            for(var key in this.m_undefinedStack[i]) {
                info_stack+=`${key}:${this.m_undefinedStack[i][key].info()},`;
            }
            info+=`{${info_stack}},`;
        }
        info+=`<br>`;
        return info;
    
    }

    popBuilt() {
        return this.m_builtStack.pop();
    }
    
    popUndefined() {
        return this.m_undefinedStack.pop();
    }
    
    pushBuilt(built) {
        this.m_builtStack.push(built);
    }
    
    pushUndefined(undefined_pt) {
        this.m_undefinedStack.push(undefined_pt);
    }
    
    enterClause() {
        var copy0={},copy1={};

        Object.assign(copy0,this.m_builtStack[this.m_builtStack.length-1]);
        this.m_builtStack.push(copy0);

        Object.assign(copy1,this.m_undefinedStack[this.m_undefinedStack.length-1]);
        this.m_undefinedStack.push(copy1);
    }


    insertPtIntotKarma_back(km0,netP) {
        var km_new=new Karma(netP),km;
        if(netP.m_name.length>1 & netP.m_name[0]=='+') {
            netP.m_name=netP.m_name.slice(1,netP.m_name.length);
            km_new.m_buildMode=true;
        }
        
        for(var i=0;i<km0.m_clause.length;i++) {
            km=km0.m_clause[i];
            km.m_cause=km_new;
        }
        
        for(var i=0;i<km0.m_yese.length;i++) {
            km=km0.m_yese[i];
            km.m_cause=km_new;
        }
        
        for(var i=0;i<km0.m_noe.length;i++) {
            km=km0.m_noe[i];
            km.m_cause=km_new;
        }
        km_new.m_clause=km0.m_clause;
        km_new.m_yese=km0.m_yese;
        km_new.m_noe=km0.m_noe;
        km0.m_yese=[km_new];
        km0.m_noe=[];
        km_new.m_cause=km0;
    }
    

    insertPtIntotKarma_front(km0,netP) {
        var i;
        var km_new=new Karma(netP);
        if(netP.m_name.length>1 & netP.m_name[0]=='+') {
            netP.m_name=netP.m_name.slice(1,netP.m_name.length);
            km_new.m_buildMode=true;
        }
        if(km0.m_cause!='') {
            var cause=km0.m_cause;
            km_new.m_cause=cause;
            if(cause.m_clause.includes(km0)) {
                i=cause.m_clause.indexOf(km0);
                cause.m_clause.splice(i,1);
                cause.m_clause.push(km_new);
            }
            
            else if(cause.m_yese.includes(km0)) {
                i=cause.m_yese.indexOf(km0);
                cause.m_yese.splice(i,1);
                cause.m_yese.push(km_new);
            }
            
            else if(cause.m_noe.includes(km0)) {
                i=cause.m_noe.indexOf(km0);
                cause.m_noe.splice(i,1);
                cause.m_noe.push(km_new);
            }
            
            else {
                print("Warning! The karma:"+km0.m_symbol.info()+", has a weird cause karma.");
            }
        }
        km0.m_cause=km_new;
        km_new.m_yese=[km0];
        if(km0.m_no==true) {
            km0.m_no=false;
            km_new.m_no=true;
        }
    }


    insertPtIntotKarma(km0,netP) {
        var otherP;
        if(km0.m_symbol.m_db[0]==netP) {
            otherP=km0.m_symbol.m_db[1];
        }
        
        else if(km0.m_symbol.m_db[1]==netP) {
            otherP=km0.m_symbol.m_db[0];
        }
        
        else {
            return;
        }

        if(km0.isType('新建') | km0.m_symbol.m_name=='[那]') {
            this.insertPtIntotKarma_back(km0,netP);
        }
        
        else if(km0.isType('普通非新建') | km0.m_symbol.m_name=='[is]') {
            if(otherP=='' | otherP.m_master=='') {
                this.insertPtIntotKarma_back(km0,netP);
            }
            
            else if(km0.allCauses().includes(otherP.m_master)) {
                this.insertPtIntotKarma_back(km0,netP);
            }
            
            else {
                this.insertPtIntotKarma_front(km0,netP);
            }
        }
        else if(km0.isType('引用')) {
        //else {
            this.insertPtIntotKarma_front(km0,netP);
        }
    }



    leaveClause() {
        var dict_len=0,dict_undef={};
        var dict_len2=0,dict_undef2={};
        var pt,km_head;
        if(this.m_undefinedStack.length==1) {
            dict_undef=this.m_undefinedStack[this.m_undefinedStack.length-1];
            dict_len=Object.keys(dict_undef).length;
            if(dict_len!=0) {
                for(var term in dict_undef) {
                    pt=dict_undef[term];
                    if(pt.m_master=='') {
                        km_head=pt.m_con[0].m_master;
                        this.insertPtIntotKarma(km_head,pt);
                    }
                }
            }
        }
        
        else {
            dict_undef=this.m_undefinedStack[this.m_undefinedStack.length-1];
            dict_len=Object.keys(dict_undef).length;

            dict_undef2=this.m_undefinedStack[this.m_undefinedStack.length-2];
            dict_len2=Object.keys(dict_undef2).length;

            if(dict_len>dict_len2) {
                for(var term in dict_undef) {
                    if(dict_undef2[term]==undefined) {
                        pt=dict_undef[term];
                        if(pt.m_master=='') {
                            km_head=pt.m_con[0].m_master;
                            this.insertPtIntotKarma(km_head,pt);
                        }
                    }
                }
            }
        }

        this.m_builtStack.pop();
        this.m_undefinedStack.pop();
    }
    
    popUndefinedName(name) {
        
        for(var i=0;i<this.m_undefinedStack.length;i++) {
            var stack=this.m_undefinedStack[i];
            delete stack[name];
        }
    }
    
    buildNetP(name,con0_name='',con1_name='') {
        var recent=this.m_builtStack[this.m_builtStack.length-1];
        var undefined_pt=this.m_undefinedStack[this.m_undefinedStack.length-1];
        var point=undefined_pt[name];
        if(point==undefined) {
            var name0=name;
            point=new NetP(name.replace(/#.*$/,''));
            recent[name0]=point;
        }
        
        else {
            delete undefined_pt[name];
        }
        if(con1_name!='') {
            var con1=recent[con1_name];
            if(con1==undefined) {
                var con1_name0=con1_name;
                con1=new NetP(con1_name.replace(/#.*$/,''));
                recent[con1_name0]=con1;
                undefined_pt[con1_name0]=con1;
            }
            point.connect(con1,1);
        }
        if(con0_name!='') {
            var con0=recent[con0_name];
            if(con0==undefined) {
                var con0_name0=con0_name;
                con0=new NetP(con0_name.replace(/#.*$/,''));
                recent[con0_name0]=con0;
                undefined_pt[con0_name]=con0;
            }
            point.connect(con0,0);
        }
        return point;
    }




}



class Parser {

    readSubCode_tokener(code) {
        var list_karma=[];
        var karma,pointStack;
        var result=true;
        
        while(code!='') {
            code=code.replace(/^[ \t\n]+/,'');
            if(code=='') {
                break;
            }

            [code,result]=this.removeComment(code);
            if(result==true) {
                continue;
            }
            
            else {
                [code,karma,pointStack]=this.chainToken(code);
                pointStack.leaveClause();
                karma=karma.causeEnd();
                karma.setRangers();
                list_karma.push(karma);
                if(code!='' & code[0]==';') {
                    code=code.slice(1,code.length);
                }
            }
        }
        return list_karma;
    }

/*
buildNetP
*/

    buildPoints_tokener(code) {
        code=code.replace(/^[ \t\n\r]*/,'');

        var list_pt=[],netP;
        var pointStack=new NetPStack();

        while(code!='') {
            [code,netP,pointStack]=this.netPToken(code,pointStack);
            list_pt.push(netP);
            code=code.replace(/^\[-?\d+,-?\d+\]/,'');
            code=code.replace(/^[ \t\n\r;]*/,'');

        }
        return list_pt;
    }


    removeComment(code) {
        if(code.length==0) {
            return [code,false];
        }
        
        else if(code[0]=='#') {
            code=code.replace(/^#.*/,'');
        }
        
        else if(code.slice(0,3)=='"""') {
            code=code.slice(3,code.length);
            
            while(true) {
                if(code.length<3) {
                    code='';
                    break;
                }
                
                else if(code.slice(0,3)=='"""') {
                    break;
                }
                
                else {
                    code=code.replace(/^.*\n?/,'');
                }
            }
            code=code.slice(3,code.length);
        }
        
        else {
            return [code,false];
        }
        return [code,true];
    }


    chainToken(code,pointStack='') {
        var karma;
        if(pointStack=='') {
            pointStack=new NetPStack();
        }
        [code,karma,pointStack]=this.karmaToken(code,pointStack);
        if(code=='' | code[0]==';' | code[0]=='\n' | code[0]=='}') {
            return [code,karma,pointStack];
        }
        
        else if(code[0]==',') {
            return [code,karma,pointStack];
        }
        
        else if(code[0]==':') {
            code=code.slice(1,code.length);
            [code,karma,pointStack]=this.splitToken(code,karma,pointStack);
        }
        
        else if(code[0]=='|' | code[0]=='&') {
            var typeSub=code[0];
            code=code.slice(1,code.length);
            if(code!='' & code[0]==':') {
                if(typeSub=='|') {
                    karma.m_noAnd=false;
                    karma.m_yesAnd=false;
                }
                
                else {
                    karma.m_noAnd=true;
                    karma.m_yesAnd=true;
                }
                code=code.slice(1,code.length);
                [code,karma,pointStack]=this.splitToken(code,karma,pointStack);
            }
        }
        
        else {
            var typeCon,effect;
            [code,typeCon]=this.conToken(code);
            [code,effect,pointStack]=this.chainToken(code,pointStack);
            this.buildRelation(karma,typeCon,effect);
        }
        return [code,karma,pointStack];
    }


    conToken(code) {
        var typeCon;
        while(code.length>3 & code.slice(0,3)=='...') {
            code=code.replace(/^\.\.\..*[\n\t ]*/,'');
        }
        code=code.replace(/^[ \t]*/,'');
        if(code.length>2 & code.slice(0,3)=='->>') {
            typeCon=code.slice(0,3);
            code=code.slice(3,code.length);
        }
        
        else if(code.length>2 & code.slice(0,3)=='=>>') {
            typeCon=code.slice(0,3);
            code=code.slice(3,code.length);
        }
        
        else if(code.length>1 & code.slice(0,2)=='->') {
            typeCon=code.slice(0,2);
            code=code.slice(2,code.length);
        }
        
        else if(code.length>1 & code.slice(0,2)=='=>') {
            typeCon=code.slice(0,2);
            code=code.slice(2,code.length);
        }
        
        else {
            print('\n\n\nIllegal connection symbol!\nCode:',code);
            throw 'Illegal connection symbol!';
        }
        code=code.replace(/^[ \t]*/,'');
        return [code,typeCon];
    }


    clauseToken(code,karma,pointStack) {
        pointStack.enterClause();
        var clause;

        while(true) {
            code=code.replace(/^[ \t\n]*/,'');
            if(code=='') {
                throw 'Error! Unbalanced bracket!';
            }
            
            else if(code[0]=='}') {
                break;
            }
            
            else {
                [code,clause,pointStack]=this.chainToken(code,pointStack);
                karma.m_clause.push(clause);
                clause.m_cause=karma;
                if(code!='' & code[0]!=',') {
                    break;
                }
                
                else if(code!='') {
                    code=code.slice(1,code.length);
                }
            }
        }
//print(pointStack.info());
        pointStack.leaveClause();
        return [code,karma,pointStack];
    }

/*
leaveClause
*/

    splitToken(code,karma,pointStack) {
        var typeCon,effect;

        while(true) {
            code=code.replace(/^[ \t\n]*/,'');
            [code,typeCon]=this.conToken(code);
            [code,effect,pointStack]=this.chainToken(code,pointStack);
            this.buildRelation(karma,typeCon,effect);
            code=code.replace(/^[ \t\n]*/,'');
            if(code=='' | code[0]==';' | code[0]=='}') {
                break;
            }
            
            else if(code[0]!=',') {
                print('\n\n\n\nError! Ilegal splitting type!\nCode:',code);
                throw 'Error! Ilegal splitting type!';
            }
            
            else {
                code=code.slice(1,code.length);
            }
        }
        return [code,karma,pointStack];
    }



    karmaToken(code,pointStack) {
        if(code=='') {
            throw 'Error! Invalid karma detected!';
        }

        var buildType=false;
        var karma='';
        var netP;

        if(code[0]=='+') {
            buildType=true;
        }
        [code,netP,pointStack]=this.netPToken(code,pointStack);
        karma=new Karma(netP);
        if(buildType==true & netP.m_name!='+') {
            netP.m_name=netP.m_name.slice(1,netP.m_name.length);
            karma.m_buildMode=true;
        }

        if(code!='' & code[0]=='{') {
            code=code.slice(1,code.length);
            [code,karma,pointStack]=this.clauseToken(code,karma,pointStack);
            code=code.replace(/^[\n\t ]*/,'');
            if(code=='' | code[0]!='}') {
                print('\n\n\nError! Unbalanced bracket.\nCode:',code);
                throw 'Error! Unbalanced bracket.';
            }
            
            else {
                code=code.slice(1,code.length);
            }
        }

        return [code,karma,pointStack];
    }


    netPToken(code,pointStack) {
        var title=/^[\w\u3000\u3400-\u4DBF\u4E00-\u9FFF \[\]~#.+=\-^/*\\!<\']*|^\[>=?\]/;
        var name=code.match(title)[0];
        code=code.replace(title,'');
        if(name=='') {
            print('\n\n\nError! Invalid name.\nCode:',code);
            throw 'Error! Invalid name.';
        }


        if(name[name.length-1]=='=' | name[name.length-1]=='-') {
            if(code.length>0 & code[0]=='>') {
                code=name[name.length-1]+code;
                name=name.slice(0,name.length-1);
            }
        }

        var con0_name='';
        var con1_name='';
        var text='';
        if(code!='' & code[0]=='\"') {
            code=code.slice(1,code.length);
            [code,text]=this.textToken(code);
            if(code=='' | code[0]!='\"') {
                print(code);
                throw 'Error! Unbalanced quote!';
            }
            code=code.slice(1,code.length);
        }
        if(code!='' & code[0]=='(') {
            code=code.slice(1,code.length);
            con0_name=code.match(title)[0];
            code=code.replace(title,'');
            if(code=='' | code[0]!=',') {
                print(code);
                throw 'Error! Ilegal net point format. A net point must be title"text"(title,title)';
            }
            code=code.slice(1,code.length);
            con1_name=code.match(title)[0];
            code=code.replace(title,'');
            if(code=='' | code[0]!=')') {
                throw 'Error! Unbalanced bracket in a net point format!';
            }
            code=code.slice(1,code.length);
        }
        if(name=='') {
            print('Warning! There is a point without a name!');
        }
        var netP=pointStack.buildNetP(name,con0_name,con1_name);
        //var netP=new NetP(name,text);
        netP.m_text=text;
        return [code,netP,pointStack];
    }



    textToken(code) {
        var text='';
        var preEnd=true;
        
        while(true) {
            if(code=='') {
                break;
            }
            
            else if(code.length>1 & code.slice(0,2)=='\\"') {
                preEnd=false;
            }
            
            else if(code[0]=='\"' & preEnd==true) {
                break;
            }
            
            else {
                text+=code[0];
                preEnd=true;
            }
            code=code.slice(1,code.length);
        }
        return [code,text];
    }


    buildRelation(karma,typeCon,effect) {
        if(typeCon=='->') {
            karma.m_yese.push(effect);
        }
        
        else if(typeCon=='->>') {
            karma.m_noe.push(effect);
        }
        
        else if(typeCon=='=>') {
            karma.m_yese.push(effect);
            effect.m_no=true;
        }
        
        else if(typeCon=='=>>') {
            karma.m_noe.push(effect);
            effect.m_no=true;
        }
        
        else {
            throw 'Error! Ilegal connection type!';
        }
        effect.m_cause=karma;
    }

}


function info_PtList(list_pt) {
    var info_pt='';
    for(var i=0;i<list_pt.length;i++) {
        var pt=list_pt[i];
        info_pt+=pt.info()+','
    }

    return `[${info_pt}]`;
}


function info_PtPool(pool_pt) {
    var info_pt='';
    for(var key in pool_pt) {
        var list_pt=pool_pt[key];
        info_pt+=key+`: ${info_PtList(list_pt)},`;
    }

    return `{${info_pt}}`;
}

function printPtList(list_pt) {
    print(info_PtList(list_pt));
}

function printPtPool(pool_pt) {
    print(info_PtPool(pool_pt));
}


function mergeArrays(list0,list1) {
    for(var j=0;j<list1.length;j++) {
        if(!list0.includes(list1[j])) {
            list0.push(list1[j]);
        }
    }
}

/*
+[J函数](,JS版本)

保存run_code:...
*/

function run_code_line(km,list_pt) {
    var code,list_km,list_new;

    //[code,km]=parser.chainToken(code0);
    list_km=km.allEffects();
    
    list_km[0].m_stage=1;
    var change=true,change1;
    
    while(change) {
        change=false;
        for(var i=0;i<list_km.length;i++) {
            [change1,list_new]=list_km[i].Reason_oneStep(list_pt);
            karma=list_km[i];
            //print(karma.info(),list_new.length);
            mergeArrays(list_pt,list_new);
    
            if(change1 & !change) {
                change=true;
            }
        }
        //printPtList(list_pt);
        //print(change);
        //print();
    }
    return code;
}

function run_code(code0,list_pt) {
    var code1=code0;
    var parser=new Parser();
    list_km=parser.readSubCode_tokener(code0);

    for(var i in list_km) {
        run_code_line(list_km[i],list_pt);
    }

    return code0;
}



/*
readSubCode
+[J函数](,JS版本)
测试stdCode:...
测试Parser:...
测试:...
+[J函数](,测试)
+[新建阅读窗口](,测试)
*/