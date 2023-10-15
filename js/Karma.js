/*
地址::文档/S应用/NiniJS/js/Karma.js
+[保存文本](,Karma)
NetP(库)::文档/S应用/NiniJS/js/NetP.js

保存:...
[is]
'_re'

*/


class Karma {

    constructor(symbol) {
        this.m_symbol=symbol;
        symbol.m_master=this;
        this.m_creator='';
        this.m_map='';
        this.m_cause='';
        this.m_yese=[];
        this.m_noe=[];
        this.m_yesAnd=false;
        this.m_noAnd=false;
        this.m_eoi=0;
        this.m_clause=[];
        this.m_clauseAnd=true;

        this.m_clauseNew=[];
        this.m_clauseCollect=false;
        this.m_clauseOut=false;
        this.m_clauseIn=false;

        this.m_not=false;
        this.m_no=false;
        this.m_buildMode=false;

        this.m_listMP='';
        this.m_restricted=false;

        this.m_ranger='';
        this.m_rangType=false
        this.m_stage=0;
        this.m_reState='';
        this.m_choose=true;
        this.m_interp=false;
    }

    addKarma(karma,con_type='肯定') {
        
        while(karma.m_cause!='') {
            karma=karma.m_cause;
        }
        if(con_type=="clause" | con_type=="从句") {
            this.m_clause.push(karma);
        }
        
        else if(con_type=="no" | con_type=="否定") {
            this.m_noe.push(karma);
        }
        
        else {
            this.m_yese.push(karma);
        }
        karma.m_cause=this;
    }

    info_cause() {
        var info='';
        var karma=this;
        
        while(true) {
            if(karma.m_symbol!='') {
                info=karma.m_symbol.m_name+info;
            }
            if(karma.m_cause=='') {
                break;
            }
            if(karma.m_cause.m_yese.includes(karma)) {
                if(karma.m_no==true) {
                    info='=>'+info;
                }
                
                else {
                    info='->'+info;
                }
            }
            
            else if(karma.m_cause.m_noe.includes(karma)) {
                if(karma.m_no==true) {
                    info='=>>'+info;
                }
                
                else {
                    info='->>'+info;
                }
            }
            
            else if(karma.m_cause.m_clause.includes(karma)) {
                info='=='+info;
            }
            karma=karma.m_cause;
        }
        return info;
    }


    stateSelf() {
        var name;

        if(this.m_interp==true) {
            return 'blue';
        }
        if(this.m_symbol=='' | this.m_map=='') {
            return 'yellow';
        }
        if(this.m_symbol.m_name=='[eq]' | this.m_symbol.m_name=='[同名]') {
            return this.stateSelf_eq();
        }
        
        else if(this.m_symbol.m_name=='[is]' | this.m_symbol.m_name=='[是]') {
            return this.stateSelf_is();
        }
        
        else if(this.m_symbol.m_name=='[那]') {
            return 'green';
        }
/*
+[保存文本](,Karma)
*/
        if(this.m_symbol.m_name=='_正则表达式' | this.m_symbol.m_name=='_re') {
            let pattern, match;
            try {
                pattern=new RegExp(this.m_symbol.m_text);
            } catch(e) {
                print('Invalid regular expression: ',this.m_symbol.m_text,'!');
                return 'red';
            }
            match=this.m_map.m_name;
            if(pattern.test(match)) {
                return 'green';
            }
            
            else {
                return 'red';
            }
        }
// _word or _[word]
        if(this.m_symbol.m_name!='' & this.m_symbol.m_name[0]=='_') {
            name=this.m_symbol.m_name.slice(1,this.m_symbol.m_name.length);
            var name_m=this.m_map.m_name;
            var text_1 = this.m_symbol.m_text;
            var text_2 = this.m_map.m_text;

            if(text_1!=='' & text_1!==text_2) {
                return 'red';
            }

            else if(name.length==0) {
                return 'green';
            }
            
            else if(name[0]=='[' & name[name.length-1]==']') {
                if(name_m.length>=2 & name_m[0]=='[' & name_m[name_m.length-1]==']') {
                    return 'green';
                }
                
                else {
                    return 'red';
                }
            }
            
            else {
                return 'green';
            }
        }

// [word] or +[word]
        if(this.m_symbol.m_name.length > 1 & this.m_symbol.m_name[0]=='[' & this.m_symbol.m_name[this.m_symbol.m_name.length-1]==']') {

            var name1=this.m_symbol.m_name.slice(1,this.m_symbol.m_name.length-1);
            var name2=this.m_symbol.m_name;

            if(this.m_interp==false & this.m_map.m_creator=='' & this.m_buildMode==false) {
                return 'red';
            }
            if(name1==this.m_map.m_name | name2==this.m_map.m_name) {
                return 'green';
            }
            
            else {
                return 'red';
            }
        }

// ~word
        if(this.m_symbol.m_name!='' & this.m_symbol.m_name[0]=='~') {
            name=this.m_symbol.m_name.slice(1,this.m_symbol.m_name.length);
            if(name==this.m_map.m_name) {
                return 'red';
            }
            
            else {
                return 'green';
            }
        }
        
// word
        else {
            name=this.m_map.m_name;

            if(name!='' & name[0]=='[' & name[name.length-1]==']') {
                name=name.slice(1,name.length-1);
            }
            if(name!=this.m_symbol.m_name) {
                return 'red';
            }
            
            else if(this.m_symbol.m_text!='' & this.m_symbol.m_text!=this.m_map.m_text) {
                return 'red';
            }
            
            else {
                return 'green';
            }
        }
    }


    stateSelf_eq() {
        var karmaL,karmaR;
        var nameL,nameR;

        if(this.m_map=='') {
            return 'yellow';
        }
        if(this.m_symbol.m_db[0]=='' | this.m_symbol.m_db[1]=='') {
            return 'red';
        }
        karmaL=this.m_symbol.m_db[0].m_master;
        karmaR=this.m_symbol.m_db[1].m_master;
        if(karmaL=='' | karmaR=='') {
            print('Error! [eq] doesn\'t have sbj | obj.');
            print('Sbj:',karmaL);
            print('Obj:',karmaR);
            return 'red';
        }
        if(karmaL.m_map=='' | karmaR.m_map=='') {
            return 'green';
        }
        
        else {
            nameL=karmaL.m_map.m_name;
            nameR=karmaR.m_map.m_name;
            if(karmaL.m_map.m_name.length>1 & karmaL.m_map.m_name[0]=='[' & karmaL.m_map.m_name[karmaL.m_map.m_name.length-1]==']') {
                nameL=karmaL.m_map.m_name.slice(1,karmaL.m_map.m_name.length-1);
            }
            if(karmaR.m_map.m_name.length>1 & karmaR.m_map.m_name[0]=='[' & karmaR.m_map.m_name[karmaR.m_map.m_name.length-1]==']') {
                nameR=karmaR.m_map.m_name.slice(1,karmaR.m_map.m_name.length-1);
            }
            if(nameL==nameR) {
                return 'green';
            }
            
            else {
                return 'red';
            }
        }
    }


    stateSelf_is() {
        var karmaL,karmaR;
        if(this.m_map=='') {
            return 'yellow';
        }
        if(this.m_symbol.m_db[0]=='' | this.m_symbol.m_db[1]=='') {
            return 'red';
        }
        karmaL=this.m_symbol.m_db[0].m_master;
        karmaR=this.m_symbol.m_db[1].m_master;
        if(karmaL.m_map=='' | karmaR.m_map=='') {
            return 'green';
        }
        
        else {
            if(karmaL.m_map==karmaR.m_map) {
                return 'green';
            }
            
            else {
                return 'red';
            }
        }
    }



    stateRelation() {
        if(this.m_map=='' | this.m_symbol=='') {
            return true;
        }
        var cause=this.m_cause;
        
        while(cause!='') {
            if(cause.m_symbol==this.m_symbol.m_db[0]) {
                if(cause.m_map!=this.m_map.m_db[0]) {
                    return false;
                }
            }
            if(cause.m_symbol==this.m_symbol.m_db[1]) {
                if(cause.m_map!=this.m_map.m_db[1]) {
                    return false;
                }
            }

// For a function point, you should check the relation between the point through the function point selfstate()
            if(cause.m_symbol.m_db[0]==this.m_symbol) {
                if(cause.m_map.m_db[0]!=this.m_map | cause.stateSelf()=='red') {
                    return false;
                }
            }
            if(cause.m_symbol.m_db[1]==this.m_symbol) {
                if(cause.m_map.m_db[1]!=this.m_map | cause.stateSelf()=='red') {
                    return false;
                }
            }
            cause=cause.m_cause;
        }
        return true;
    }

/*
newMap存档:...
Reason_oneStep
delete
list_have
info_cause
setRangers
*/


    mapListFromRange() {
        var list_map=[];
        if(this.m_rangType==true) {
            if(this.m_ranger.m_map=='') {
                list_map=[];
            }
            
            else {
                list_map=[...this.m_ranger.m_map.m_con];
            }
        }
        
        else if(this.m_ranger.m_symbol.m_db[0]==this.m_symbol) {
            if(this.m_ranger.m_map.m_db[0]=='') {
                list_map=[];
            }
            
            else {
                list_map=[this.m_ranger.m_map.m_db[0]];
            }
        }
        
        else if(this.m_ranger.m_symbol.m_db[1]==this.m_symbol) {
            if(this.m_ranger.m_map.m_db[1]=='') {
                list_map=[];
            }
            
            else {
                list_map=[this.m_ranger.m_map.m_db[1]];
            }
        }
        
        else {
            print('Warning! Undefined situation.');
        }
        return list_map;
    }


    mapListFromPool_normal(pool) {
        var list_map=[];
        var name=this.m_symbol.m_name;

        if(name.length>0 & (name[0]=='_' | name[0]=='~')) {
            list_have=dictToList(pool);
            list_map=[];
            
            for(var i=0;i<list_have.length;i++) {
                var point=list_have[i];
                if(point.m_needed=='' | (point.m_needed!='' & point.m_creator!='')) {
                    list_map.push(point);
                }
            }
        }
        
        else {
// print(undefined===[])
            list_map=pool[this.m_symbol.m_name];
            if(list_map===undefined) {
                list_map=[];
            }
        }
        return list_map;
    }
    

    mapList_is(ranger,pool) {
        if(ranger.m_symbol.m_db[0]=='' | ranger.m_symbol.m_db[1]=='') {
            return this.mapListFromPool_normal(pool);
        }
        if(ranger.m_symbol.m_db[0]==this.m_symbol & ranger.m_map.m_db[1]!='') {
            return [ranger.m_map.m_db[1]];
        }
        if(ranger.m_symbol.m_db[1]==this.m_symbol & ranger.m_map.m_db[0]!='') {
            return [ranger.m_map.m_db[0]];
        }
        return this.mapListFromPool_normal(pool);
    }

    allCauses() {
        var cause=this;
        var list_km=[];
        
        while(cause.m_cause!='') {
            cause=cause.m_cause;
            list_km.push(cause);
        }
        return list_km;
    }

    mapList_that(ranger) {
        var list_cause=ranger.allCauses();
        var list_map=[];
        
        for(var i=0;i<list_cause.length;i++) {
            var cause=list_cause[i];
            var pt_map=cause.m_map;
            if(pt_map!='' & !list_map.includes(pt_map)) {
                list_map.push(pt_map);
            }
        }
        return list_map;
    }

    //rangeList(pool,areaType,list_new) {
    rangeList(pool,list_new) {
        var list_map=[];

        if(this.m_listMP!=='') {
            return this.m_listMP;
        }
        
        else if(this.m_ranger!='') {
            var ranger=this.m_ranger;
            var nameR=this.m_ranger.m_symbol.m_name;
            if(nameR=='[is]') {
                list_map=this.mapList_is(this.m_ranger,pool);
            }
            
            else if(nameR=='[那]') {
                list_map=this.mapList_that(this.m_ranger);
            }
            
            else if(this.m_ranger.isType('非回答新建') &  this.m_symbol.m_con.includes(this.m_ranger.m_symbol)) {
                list_map=this.mapListFromPool_normal(pool);
            }
            
            else {
                list_map=this.mapListFromRange();
            }
        }
        
        else {
            list_map=this.mapListFromPool_normal(pool);
        }
        this.m_listMP=list_map;
        return list_map;
    }


    newMap(pool,areaType,list_new) {
    //newMap(list_map,areaType,list_new) {
        var list_map=this.rangeList(pool,list_new);

        // var list_map=[];
        var name;
        if(this.m_buildMode==false | areaType==false) {
            name=this.m_symbol.m_name;
            if(this.isPreDefined()) {
                if(this.m_map=='') {
                    point=new NetP(name,this.m_symbol.m_text);
                    point.m_needed=this;
                    point.m_creator=this;
                    this.map(point);
                }
                
                else {
                    this.m_map.delete();
                    delete this.m_map;
                    this.map('');
                }
                return;
            }
            // [A]
            else if(this.isFunctionPoint()==2) {
                if(this.m_map=='') {
                    point=new NetP(name,this.m_symbol.m_text);
                    point.m_needed=this;
                    this.map(point);
                }
                
                else {
                    this.map(this.m_map);
                }
                this.m_interp=true;
                return;
            }
            var list_have=list_map;
            var mp=this.m_map;
            this.map(this.nextInlist(mp,list_have));
            return;
        }
        
        else {
            name=this.m_symbol.m_name;
            if(name!='' & (name[0]!='[' | name[name.length-1]!=']')) {
                if(this.m_map!='') {
                    this.m_map.m_creator='';
                    if(this.m_map.m_needed=='') {
                        this.m_map.delete();
                        this.map('');
                        return;
                    }
                    
                    else {
                        this.m_map.m_name='['+this.m_map.m_name+']';
                    }
                }
                var list_need=[];
                
                for(var i=0;i<list_map.length;i++) {
                    var point=list_map[i];
                    if(point.m_creator=='' & point.m_needed!='') {
                        list_need.push(point);
                    }
                }

                point=this.m_map;
                this.map(this.nextInlist(point,list_need));
                if(this.m_map=='') {
                    if(this.m_restricted==true) {
                        this.map('');
                        return;
                    }
                    point=new NetP(this.m_symbol.m_name,this.m_symbol.m_text);
                    point.m_building=true;
                    this.map(point);
                }
                
                else {
                    this.m_map.m_building=true;
                    this.m_map.m_name=this.m_map.m_name.slice(1,this.m_map.m_name.length-1);
                }
                this.m_map.m_creator=this;
                return;
            }
            else {
                if(this.m_map=='') {
                    point=new NetP(name,this.m_symbol.m_text);
                    point.m_building=true;
                    point.m_needed=this;
                    this.map(point);
                    return;
                } else {
                    this.m_map.m_needed='';
                    this.m_map.delete();
                    this.map('');
                    return;
                }
            }
        } 

        this.map('');
    }
/*
+[J函数](,JS版本)
*/

    nextInlist(point,list_pt) {
        var i;
        if(list_pt.length==0) {
            return '';
        }
        if(point=='') {
            return list_pt[0];
        }
        
        try {
            i=list_pt.lastIndexOf(point);
        } catch(e) {
            return '';
        }

        if(i+1>=list_pt.length) {
            return '';
        }
        else {
            return list_pt[i+1];
        }
    }

/*
+[J函数](,JS版本)
*/

    map(point) {
        var cause;
        this.clearAll();
        this.m_map=point;
        if(this.m_map!='') {
            cause=this.m_cause;
            
            while(cause!='') {
                if(cause.needBuildRelation()) {
                    if(cause.m_map.m_needed=='' | cause.m_map.m_needed==cause) {
                        if(cause.m_symbol.m_db[0]==this.m_symbol) {
                            cause.m_map.connect(this.m_map,0);
                        }
                        if(cause.m_symbol.m_db[1]==this.m_symbol) {
                            cause.m_map.connect(this.m_map,1);
                        }
                    }
                }
                if(this.needBuildRelation()) {
                    if(this.m_map.m_needed=='' | this.m_map.m_needed==this) {
                        if(this.m_symbol.m_db[0]==cause.m_symbol) {
                            this.m_map.connect(cause.m_map,0);
                        }
                        if(this.m_symbol.m_db[1]==cause.m_symbol) {
                            this.m_map.connect(cause.m_map,1);
                        }
                    }
                }
                cause=cause.m_cause;
            }
        }
    }

/*
+[J函数](,JS版本)
info(
*/

    clearAll() {
        this.m_map='';
        this.m_stage=0;
        this.m_interp=false;
        this.m_reState='';
        this.m_choose=true;
        this.m_eoi=0;
        if(this.m_restricted==false) {
            delete this.m_listMP;
            this.m_listMP='';
        }
        
        for(var i=0;i<this.m_clause.length;i++) {
            var clause=this.m_clause[i];
            clause.clearAll();
        }
        
        for(var i=0;i<this.m_noe.length;i++) {
            var end=this.m_noe[i];
            end.clearAll();
        }
        
        for(var i=0;i<this.m_yese.length;i++) {
            var end=this.m_yese[i];
            end.clearAll();
        }
    }


    needBuildRelation() {
        if(this.buildingNewMap()) {
            return true;
        }
        
        else if(this.isFunctionPoint()!=0) {
            return true;
        }
        return false;
    }



    buildingNewMap() {
        if(this.m_map=='') {
            return false;
        }
        
        else if(this.m_buildMode==false) {
            return false;
        }
        
        else {
            if(this.m_map.m_needed=='') {
                return true;
            }
        }
        return false;
    }



    isFunctionPoint() {
        if(this.m_symbol.m_name=='') {
            return 0;
        }
        
        else if(this.m_symbol.m_name=='[eq]' | this.m_symbol.m_name=='[同名]') {
            return 1;
        }
        
        else if(this.m_symbol.m_name=='[is]' | this.m_symbol.m_name=='[是]') {
            return 1;
        }
        
        else if(this.m_symbol.m_name=='[那]') {
            return 1;
        }
        
        else if(this.m_symbol.m_name=='[]') {
            return 1;
        }
        
        else if(this.m_symbol.m_name[0]=='[' & this.m_symbol.m_name[this.m_symbol.m_name.length-1]==']') {
            return 2;
        }
        return 0;
    }

/*
list_have
*/

    isPreDefined() {
        var name=this.m_symbol.m_name;
        if(name=='[is]' | name=='[eq]' | name=='[那]' | name=='[]') {
            return true;
        }
        
        else {
            return false;
        }
    }


    areaType() {
        return 0;
    }

/*
+[J函数](,JS版本)
length
newMap
*/

    Reason_oneStep(pool) {
        var list_new=[];
        // var areaType=areaType.concat(this.areaType());
        var areaType=true;
        var change=false;
        var keep=true;

        if(this.m_stage==0) {
            if(this.m_cause!='') {
                if(this.m_cause.m_clause.includes(this)) {
                    if(this.m_cause.m_stage==2) {
                        this.m_stage=1;
                        change=true;
                    }
                }
            }
        }

        if(this.m_stage==1) {
            
            while(true) {
                if(this.stateSelf()!='blue') {
                    this.newMap(pool,areaType,list_new);
                }
                else {
                    this.m_interp=false;
                }

                change=true;
                if(this.stateRelation()==false) {
                    continue;
                }
                
                else if(this.stateSelf()=='red') {
                    continue;
                }
                
                else if(this.stateSelf()=='yellow') {
                    this.m_stage=5;
                    if(this.m_no==false) {
                        this.m_reState='dark yellow';
                        return [change,list_new];
                    }
                    
                    else {
                        this.m_reState='dark green';
                        return [change,list_new];
                    }
                }
                
                else if(this.stateSelf()=='blue') {
                    this.m_stage=1;
                    return [change,list_new];
                }
                
                else {
                    this.m_stage=2;
                    break;
                }
            }
        }

        if(this.m_stage==2) {

            if(this.m_clause.length==0) {
                this.m_choose=true;
                this.m_stage=3;
                change=true;
            }
            
            else {
                this.m_choose=this.m_clauseAnd;
                keep=false;
            }

            
            for(var i=0;i<this.m_clause.length;i++) {
                var clause=this.m_clause[i];
                if(this.m_clauseAnd==true) {
                    if(clause.m_reState=='dark yellow') {
                        this.m_choose=false;
                        this.m_stage=3;
                        change=true;
                        this.m_clauseOut=true;
                        break;
                    }
                    
                    else if(clause.m_reState=='') {
                        keep=true;
                    }
                }
                
                else {
                    if(clause.m_reState=='dark green') {
                        this.m_choose=true;
                        this.m_stage=3;
                        change=true;
                        this.m_clauseOut=true;
                        break;
                    }
                    
                    else if(clause.m_reState=='') {
                        keep=true;
                    }
                }
            }

            if(this.m_clause.length!=0 & keep==false) {
                this.m_stage=3;
                change=true;
                this.m_clauseOut=true;
            }
        }


        if(this.m_stage==3) {
            if(this.m_choose==false) {
                if(this.m_noe.length==0) {
                    this.m_stage=1;
                    change=true;
                    return [change,list_new];
                }
                i=this.m_eoi;
                var end=this.m_noe[i];
                if(end.m_stage==0) {
                    end.m_stage=1;
                    change=true;
                }
                
                else if(end.m_reState=='dark yellow') {
                    if(this.m_noAnd==true) {
                        this.m_stage=1;
                        change=true;
                    }
                    
                    else {
                        i+=1;
                        change=true;
                        if(i==this.m_noe.length) {
                            this.m_stage=1;
                            this.m_eoi=0;
                        }
                        
                        else {
                            this.m_eoi=i;
                        }
                    }
                }
                
                else if(end.m_reState=='dark green') {
                    if(this.m_noAnd!=true) {
                        this.m_stage=4;
                        change=true;
                    }
                    
                    else {
                        i+=1;
                        change=true;
                        if(i==this.m_noe.length) {
                            this.m_stage=4;
                            this.m_eoi=0;
                        }
                        
                        else {
                            this.m_eoi=i;
                        }
                    }
                }
            }
            
            else {
                if(this.m_yese.length==0 & this.m_noe.length==0) {
                    this.m_stage=4;
                    change=true;
                }
                
                else if(this.m_yese.length==0) {
                    this.m_stage=1;
                    change=true;
                    return [change,list_new];
                }
                
                else {
                    i=this.m_eoi;
                    end=this.m_yese[i];
                    if(end.m_stage==0) {
                        end.m_stage=1;
                        change=true;
                    }
                    
                    else if(end.m_reState=='dark yellow') {
                        if(this.m_yesAnd==true) {
                            this.m_stage=1;
                            change=true;
                        }
                        
                        else {
                            i+=1;
                            change=true;
                            if(i==this.m_yese.length) {
                                this.m_stage=1;
                                this.m_eoi=0;
                            }
                            
                            else {
                                this.m_eoi=i;
                            }
                        }
                    }
                    
                    else if(end.m_reState=='dark green') {
                        if(this.m_yesAnd!=true) {
                            this.m_stage=4;
                            change=true;
                        }
                        
                        else {
                            i+=1;
                            change=true;
                            if(i==this.m_yese.length) {
                                this.m_stage=4;
                                this.m_eoi=0;
                            }
                            
                            else {
                                this.m_eoi=i;
                            }
                        }
                    }
                }
            }
        }


        if(this.m_stage==4) {
            if(this.m_clauseNew.length!=0 | this.m_clauseOut==true) {
                this.m_clauseCollect=true;
            }
            if((this.m_buildMode==true | this.isFunctionPoint()==1) & this.m_map!='' & !list_new.includes(this.m_map)) {
                list_new.push(this.m_map);
            }
            this.m_stage=5;
            if(this.m_no==true) {
                this.m_reState='dark yellow';
                change=true;
                return [change,list_new];
            }
            
            else {
                this.m_reState='dark green';
                change=true;
                return [change,list_new];
            }
        }
        return [change,list_new];
    }

    isVirtual() {
        var name=this.m_symbol.m_name;
        if(name.length>1 & name[0]=='[' & name[name.length-1]==']') {
            return true;
        }
        
        else {
            return false;
        }
    }


    isSpecialRanger() {
        var name=this.m_symbol.m_name;
        if(name=='[is]' | name=='[那]') {
            return true;
        }
        return false;
    }

    isType(str_type) {
        var name=this.m_symbol.m_name;
        if(infoInStr('引用',str_type)) {
            if(!this.isVirtual() | this.m_buildMode==true) {
                return false;
            }
        }
        if(infoInStr('新建',str_type)) {
            if(infoInStr('非新建',str_type)) {
                if(this.m_buildMode==true) {
                    return false;
                }
            }
            
            else if(this.m_buildMode==false) {
                return false;
            }
        }
        if(infoInStr('动作',str_type)) {
            if(!this.isVirtual() | this.m_buildMode==false) {
                return false;
            }
        }
        if(infoInStr('内置',str_type)) {
            if(!this.isPreDefined()) {
                return false;
            }
        }
        if(infoInStr('特殊范围',str_type)) {
            if(!this.isSpecialRanger()) {
                return false;
            }
        }
        if(infoInStr('否定',str_type)) {
            if(name=='' | name[0]!='~') {
                return false;
            }
        }
        if(infoInStr('通用',str_type)) {
            if(name=='' | name[0]!='_') {
                return false;
            }
        }
        if(infoInStr('普通',str_type)) {
            if(this.isVirtual()) {
                return false;
            }
        }
        if(infoInStr('端点',str_type)) {
            if(infoInStr('非端点',str_type)) {
                if(this.m_ranger=='') {
                    return false;
                }
            }
            
            else if(this.m_ranger!='') {
                return false;
            }
        }
        if(infoInStr('回答',str_type)) {
            var an_type=true;
            if(this.m_map=='' | this.m_map.m_needed==this | this.m_map.m_needed=='') {
                an_type=false;
            }
            if(infoInStr('非回答',str_type)) {
                if(an_type) {
                    return false;
                }
            }
            
            else if(!an_type) {
                return false;
            }
        }
        if(infoInStr('限制',str_type)) {
            if(this.m_restricted==false) {
                return false;
            }
        }
        return true;
    }


    setRangers(causes='') {
        var connecting='';
        var connected='';
        var caseNo=100;
        if(causes=='') {
            causes=[];
        }
        
        else if(this.isType('非新建普通链节')) {
            
            for(var i=0;i<causes.length;i++) {
                var cause=causes[i];
                if(cause.m_symbol.m_db[0]==this.m_symbol | cause.m_symbol.m_db[1]==this.m_symbol) {
                    if(cause.isType('特殊范围')) {
                        connected=cause;
                        break;
                    }
                    
                    else if(cause.isType('普通非新建') & caseNo>3) {
                        connected=cause;
                        caseNo=3;
                    }
                    
                    else if(cause.isType('新建') & caseNo>5) {
                        connected=cause;
                        caseNo=5;
                    }
                }
                
                else if(this.m_symbol.m_db[0]==cause.m_symbol | this.m_symbol.m_db[1]==cause.m_symbol) {
                    if(cause.isType('引用') & caseNo>2) {
                        connecting=cause;
                        caseNo=2;
                    }
                    
                    else if(cause.isType('普通非新建') & caseNo>4) {
                        connecting=cause;
                        caseNo=4;
                    }
                    
                    else if(cause.isType('新建') & caseNo>6) {
                        connecting=cause;
                        caseNo=6;
                    }
                }
            }
            if(connected!='') {
                this.m_ranger=connected;
            }
            
            else if(connecting!='') {
                this.m_ranger=connecting;
                this.m_rangType=true;
            }
        }
        causes=[...causes,this];
        
        for(var i=0;i<this.m_clause.length;i++) {
            var con=this.m_clause[i];
            con.setRangers(causes);
        }
        
        for(var i=0;i<this.m_yese.length;i++) {
            var end=this.m_yese[i];
            end.setRangers(causes);
        }
        
        for(var i=0;i<this.m_noe.length;i++) {
            var end=this.m_noe[i];
            end.setRangers(causes);
        }
    }

    allEffects() {
        var list_effects=[this];
        
        for(var i=0;i<this.m_clause.length;i++) {
            var karma=this.m_clause[i];
            list_effects=list_effects.concat(karma.allEffects());
        }
        
        for(var i=0;i<this.m_noe.length;i++) {
            var karma=this.m_noe[i];
            list_effects=list_effects.concat(karma.allEffects());
        }
        
        for(var i=0;i<this.m_yese.length;i++) {
            var karma=this.m_yese[i];
            list_effects=list_effects.concat(karma.allEffects());
        }
        return list_effects;
    }


    causeEnd() {
        var cause=this;
        
        while(cause.m_cause!='') {
            cause=cause.m_cause;
        }
        return cause;
    }


    info() {
        var map,str_info;
        if(this.m_map!='') {
            map=this.m_map.info();
        }
        else {
            map='(None)';
        }
        var map_info,name_info;
        
        if(this.m_reState=='dark green') {
            name_info=`<span style="background-color:green;color:white;">${this.m_symbol.info()}</span>`;
        }
        else if(this.m_reState=='dark yellow') {
            name_info=`<span style="background-color:yellow;color:black;">${this.m_symbol.info()}</span>`;
        }
        else {
            name_info=`<span>${this.m_symbol.info()}</span>`;
        }
        
        if(this.stateSelf()=='yellow') {
            map_info=`<span style="background-color:${this.stateSelf()};">${map}</span>`;
        }
        else {
            map_info=`<span style="background-color:${this.stateSelf()};color:white;">${map}</span>`;
        }
        
        str_info=`${name_info}:${map_info},stage(${this.m_stage})`;
        return str_info;
    }


}


function infoInStr(string,str_info) {
    a=str_info.includes(string);
    return a;
}


function dictToList(dict_pt) {
    var list_pt=[];
    
    for(var i=0;i<dict_pt.length;i++) {
        var term=dict_pt[i];
        list_pt=[...list_pt,dict_pt[term]];
    }
    return list_pt;
}




/*
oneStep

stateRelation
setRangers
nextInlist
concat
测试(J函数):...
+[新建阅读窗口](,测试)
*/