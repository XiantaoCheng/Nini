/*
地址::文档/S应用/NiniJS/js/NetP.js
+[保存文本](,NetP)
+JS函数(NetP,)
*/

function arrayRemove(arr,value) {
    a=arr.filter(function(ele) {
            return ele!=value;
        }
    );
    return a;
}


var global_counter=0;

class NetP {
    constructor(name,text='') {
        this.m_master='';
        this.m_needed='';
        this.m_creator='';
        this.m_dev='';
        this.m_var='';
        this.m_building=false;
        this.m_project=false;
        this.m_time=global_counter;
        global_counter+=1;

        this.m_permission=4;


        this.m_name=name;
        this.m_text=text;
        this.m_db=['',''];
        this.m_con=[];
    }

    connect(con,index) {
        if(index>1 | index<0) {
            return
        }
        else {
            this.disconnect_i(index)
            this.m_db[index]=con
            if(con!='') {
                if(!con.m_con.includes(this)) {
                    con.m_con.push(this)
                }
            }
        }
    }

/*
+[J函数](,JS版本)
*/

    disconnect_i(index) {
        var con;
        if(index==0 | index==1) {
            con=this.m_db[index];
            this.m_db[index]=''
            if(con!='' & con!=this.m_db[1-index]) {
                for(var i=0;i<con.m_con.length;i++) {
                    if(con.m_con[i]==this) {
                        con.m_con.splice(i,1);
                    }
                }
            }
        }
    }

/*
+[保存文本](,NetP)
*/
    delete() {
        this.disconnect_i(0);
        this.disconnect_i(1);
        var cons=this.m_con.slice();
        for(var i=0;i<cons.length;i++) {
            var point=cons[i];
            if(point.m_db[0]===this) {
                point.disconnect_i(0);
            }
            if(point.m_db[1]===this) {
                point.disconnect_i(1);
            }
        }
    }

    con(con0,con1) {
        if(con0!==0) {
            this.disconnect_i(0);
            this.connect(con0,0);
        }
        if(con1!==0) {
            this.disconnect_i(1);
            this.connect(con1,1);
        }
        return this
    }

    info() {
        var str_info, str_d, str_b;
        if (this.m_db[0]=='') {
            str_d='';
        } else {
            str_d=this.m_db[0].m_name;
        }

        if (this.m_db[1]=='') {
            str_b='';
        }
        else {
            str_b=this.m_db[1].m_name;
        }
        
        str_info=`${this.m_name}(${str_d},${str_b})`;

        return str_info;
    }
}


/*
记住"Matlab"
Nini, 打开动作(库)
Nini, 打开JS编译器(文件)
+[J函数](,JS版本)

测试:...
+[新建阅读窗口](,测试)
*/