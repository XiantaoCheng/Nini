/*
地址::文档/S应用/NiniJS/js/NL_parser.js
+[保存文本](,NL_parser)
+[J函数](,NL_parser)
return
Karma
this.m_word_order
group

保存:...
+[新建阅读窗口](,保存)
fun_把字句
名词
*/


class NL_Parser {
    constructor() {
        this.m_word_order=0;

        this.m_dict_名词=['标记区域', '立方体', '波前', '波长', '圆柱体', '区域', '采样点', '截面分布', '参考面', '来源', '标记点', '类', '位置', '参数', 'Z方向', '成像示意图', '场强', '可见光', '函数', '方向', '衍射环', 'IP图像', 'X方向', '三维箭头', '二维函数', '光标', '变量', '平面', '红外线', '相位', '光强', '长度', 'Y坐标', '网格', '像', '多边形', '球体', '透镜组', '能谱', '倍率', '光栅压缩器', '反演', '光束传播图', '坐标', '顺序', '像距', '线段', 'X坐标', '范围', 'Javascript', '物', '光谱', '波包', '相机', '发射角分布', 'FROG', '圆形', '屏幕', 'Y方向', '程序流程图', '长方形'];

        this.m_dict_动词=['有', '玩耍', '替换', '相距', '到达', '离开', '挑衅', '获取', '进入', '复制', '拍摄', '查看', '准备', '添加', '到', '移动', '使用', '奔跑', '引用', '在', '反射', '裁剪', '转换', '吃', '修改', '为', '截取', '计算', '放映', '解析', '调换', '是', '清空', '旋转', '捕捉', '击败', '优化', '更新', '背向', '朝向', '显示', '分析', '跑', '结束', '距离'];
        this.m_dict_形容词=['所有', '什么样', '聪明', '勇敢', '单纯', '善良', '正义', '全部', '美丽', '天真'];

        this.m_dict_副词=['下', '右', '上', '都', '左', '中'];
        this.m_dict_数量词=['只', '号', '辆', '个'];
        this.m_dict_介词=['沿', '在', '绕', '从', '按', '根据'];
        this.m_dict_代词=[];
        this.m_dict_连词=['或者', '或', '和', '并且'];
        this.m_dict_助词=['把', '将', '的', '被'];
        this.m_dict_标点=[',', '\n', '，', '!', '。', '？', '.', '?', '！'];
    }
    
    fun_助词(code) {
        var n=this.word_in_dict(code,this.m_dict_助词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("助词").con(0,pt);
            return code.slice(n,code.length),pt0;
        }
        return [code,''];
    }
    
    fun_连词(code) {
        var n=this.word_in_dict(code,this.m_dict_连词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("连词").con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    fun_介词(code) {
        var n=this.word_in_dict(code,this.m_dict_介词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("介词").con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    
    fun_数量词(code) {
        var n_type=0;
        if(code.length>0 & code[0]=='第') {
            n_type=1;
            code=code.slice(1,code.length);
        }
        var result=code.match('\d+|几');
        if(result==null) {
            return [code,''];
        }
        var 数目=new NetP(result.group());
        //code=code[result.span()[1]:];
        var n=this.word_in_dict(code,this.m_dict_数量词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n)).con(数目,0);
            var pt0=new NetP("数量词").con(0,数目);
            new NetP("的").con(pt0,pt);
            if(n_type==1) {
                var pt1=new NetP('第').con(数目,0);
                new NetP("的").con(pt0,pt1);
            }
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    fun_副词(code) {
        var n=this.word_in_dict(code,this.m_dict_副词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("副词").con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    fun_代词(code) {
        var n=this.word_in_dict(code,this.m_dict_代词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("代词").con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    fun_形容词(code) {
        var n=this.word_in_dict(code,this.m_dict_形容词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("形容词").con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    fun_名词(code) {
        if(code.length==0) {
            return ['',''];
        }
        
        var name='',n,head_type='no';
        
        for(var i=0;i<code.length;i++) {
            n=this.word_in_dict(code.slice(i,code.length),this.m_dict_动词)+this.word_in_dict(code.slice(i,code.length),this.m_dict_助词)+this.word_in_dict(code.slice(i,code.length),this.m_dict_连词)+this.word_in_dict(code.slice(i,code.length),this.m_dict_介词)+this.word_in_dict(code.slice(i,code.length),this.m_dict_副词)+this.word_in_dict(code.slice(i,code.length),this.m_dict_标点);
            if(n!=0) {
                if(i!=0) {
                    name=code.slice(0,i);
                    break;
                }
                
                else {
                    return [code,''];
                }
            }
            if(code[i]=='"' | code[i]=='(' | code[i]=='“' | code[i]=='（') {
                head_type=code[i];
                if(i==0) {
                    name="临时文本";
                }
                
                else {
                    name=code.slice(0,i);
                }
                break;
            }
        }
        if(name=='') {
            name=code;
        }
        code=code.slice(i,code.length);
        var text='';
        var result=null;
        if(head_type==='"') {
            result=code.match(/^"[^"]+"/);
        }
        else if(head_type==='“') {
            result=code.match(/^“[^”]+”/);
        }
        else if(head_type==='(') {
            result=code.match(/^\([^)]+\)/);
        }
        else if(head_type==='（') {
            result=code.match(/^（[^）]+）/);
        }

        if(result!==null) {
            result=result[0];
            n=result.length;
            text=result.slice(1,result.length-1);
            code=code.slice(n,code.length);
        }

        var pt=new NetP(name,text);
        var pt0=new NetP("名词").con(0,pt);
        new NetP("的").con(pt0,new NetP("序号",`${this.m_word_order}`));
        this.m_word_order+=1;
        return [code,pt0];
    }
    
    fun_dict(code,dict_words,type_word) {
        var n=this.word_in_dict(code,dict_words);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP(type_word).con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }
    
    word_in_dict(code,words) {
        var n=Math.min(20,code.length);
        
        for(var i=0;i<n;i++) {
            if(words.includes(code.slice(0,n-i))) {
                return n-i;
            }
        }
        return 0;
    }
    
    fun_动词(code) {
        var n=this.word_in_dict(code,this.m_dict_动词);
        if(n!=0) {
            var pt=new NetP(code.slice(0,n));
            var pt0=new NetP("动词").con(0,pt);
            return [code.slice(n,code.length),pt0];
        }
        return [code,''];
    }


    fun_谓语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 状语,动词,谓语,被;

        var sent_type=0;
        [code,状语]=this.fun_状语(code);
        if(code.length>0 & code[0]=='被') {
            [code,动词]=this.fun_动词(code.slice(1,code.length));
            sent_type=1;
        }
        
        else {
            [code,动词]=this.fun_动词(code);
        }
        if(动词=='') {
            状语='';
            [code,动词]=this.fun_动词(code_save);
        }
        if(动词=='') {
            return [code,''];
        }
        谓语=new NetP("谓语");
        谓语.m_db[1]=动词.m_db[1];
        new NetP('的').con(谓语,动词);
        if(sent_type==1) {
            被=new NetP('被').con('',动词);
            new NetP('的').con(谓语,被);
        }
        if(状语!='') {
            new NetP('的').con(谓语,状语);
            状语.m_db[1].con(动词.m_db[1],0);
        }
        return [code,谓语];
    }

/*
fun_把字句
*/

    fun_主语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 定语,名词,主语;

        [code,定语]=this.fun_定语(code);

        if(定语!='') {
            [code,名词]=this.fun_名词(code);
            if(名词!='') {
                主语=new NetP("主语");
                主语.m_db[1]=名词.m_db[1];

                if(this.m_dict_动词.includes(定语.m_db[1].m_name)) {
                    if(定语.m_db[1].m_db[0]!='') {
                        定语.m_db[1].con(0,名词.m_db[1]);
                    }
                    
                    else {
                        定语.m_db[1].con(名词.m_db[1],0);
                    }
                }
                
                else if(this.m_dict_副词.includes(定语.m_db[1].m_name)) {
                    if(定语.m_db[1].m_db[0]!='') {
                        定语.m_db[1].con(0,名词.m_db[1]);
                    }
                    
                    else {
                        定语.m_db[1].con(名词.m_db[1],0);
                    }
                }
                
                else {
                    定语.m_db[1].con(名词.m_db[1],0);
                }
                new NetP('的').con(主语,定语);
                new NetP('的').con(主语,名词);

                return [code,主语];
            }
        }

        code=code_save;
        [code,名词]=this.fun_名词(code);
        if(名词!='') {
            主语=new NetP("主语");
            主语.m_db[1]=名词.m_db[1];

            new NetP('的').con(主语,名词);
            return [code,主语];
        }
        code=code_save;
        return [code,''];
    }

/*
+[新建阅读窗口](,保存)
*/

    sent_pat(code,pat0) {
        var pat=pat0.replace(/%\[句子[^\[^\]]*\]/,'(.+)');
        var result=code.match(pat);
        if(result==null) {
            return false;
        }
        
        else {
            return true;
        }
    }
    
    fun_复句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;

        if(this.sent_pat(code,"因为%[句子], 所以%[句子]")) {
            [code,复句]=this.fun_因果复句(code);
            return [code,复句];
        }
        
        else if(this.sent_pat(code,"当%[句子], %[句子]")) {
            [code,复句]=this.fun_状语复句(code);
            return [code,复句];
        }
        
        else if(this.sent_pat(code,"%[句子], 然后, %[句子]")) {
            [code,复句]=this.fun_然后复句(code);
            return [code,复句];
        }
        return [code,''];
    }
    
    fun_因果复句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        if(code.slice(0,2)=='因为') {
            [code,句子1]=this.fun_句子(code.slice(2,code.length));
        }
        
        else {
            return [code_save,''];
        }
        if(code.slice(0,4)==', 所以') {
            [code,句子2]=this.fun_句子(code.slice(4,code.length));
        }
        
        else {
            return [code_save,''];
        }
        if(句子1=='' | 句子2=='') {
            return [code_save,''];
        }
        因果句=new NetP('因果复句');
        因为=new NetP('因为').con(因果句,句子1);
        所以=new NetP('所以').con(因果句,句子2);
        new NetP('的').con(因果句,句子1);
        new NetP('的').con(因果句,句子2);
        return [code,因果句];
    }
    
    fun_状语复句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        if(code[0]=='当') {
            [code,句子1]=this.fun_句子(code.slice(1,code.length));
        }
        
        else {
            return [code_save,''];
        }
        if(code.slice(0,2)==', ') {
            [code,句子2]=this.fun_句子(code.slice(2,code.length));
        }
        
        else {
            return [code_save,''];
        }
        if(句子1=='' | 句子2=='') {
            return [code_save,''];
        }
        复句=new NetP('状语复句');
        条件=new NetP('条件').con(复句,句子1);
        结果=new NetP('结果').con(复句,句子2);
        new NetP('的').con(复句,句子1);
        new NetP('的').con(复句,句子2);
        return [code,复句];
    }
    
    fun_然后复句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        [code,句子1]=this.fun_单句(code);
        if(code.slice(0,6)==', 然后, ') {
            [code,句子2]=this.fun_单句(code.slice(6,code.length));
        }
        
        else {
            return [code_save,''];
        }
        if(句子1=='' | 句子2=='') {
            return [code_save,''];
        }
        复句=new NetP('然后复句');
        之前=new NetP('之前').con(复句,句子1);
        之后=new NetP('之后').con(复句,句子2);
        new NetP('的').con(复句,句子1);
        new NetP('的').con(复句,句子2);
        return [code,复句];
    }
    
    fun_句子(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
var 句子;
        
        this.m_word_order=0;
        [code,句子]=this.fun_复句(code);
        if(句子!='') {
            return [code,句子];
        }
        
        try {
            [code,句子]=this.fun_被动句(code);
        } catch(e) {
            code=code_save;
            句子='';
        }
        if(句子!='') {
            return [code,句子];
        }
        
        try {
            [code,句子]=this.fun_把字句(code);
        } catch(e) {
            code=code_save;
            句子='';
        }
        if(句子!='') {
            return [code,句子];
        }
        
        try {
            [code,句子]=this.fun_普通句(code);
        } catch(e) {
            code=code_save;
            句子='';
        }
        return [code,句子];
    }
    
    fun_单句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code, 句子;
        
        this.m_word_order=0;
        
        try {
            [code,句子]=this.fun_被动句(code);
        } catch(e) {
            code=code_save;
            句子='';
        }
        if(句子!='') {
            return [code,句子];
        }
        
        try {
            [code,句子]=this.fun_把字句(code);
        } catch(e) {
            code=code_save;
            句子='';
        }
        if(句子!='') {
            return [code,句子];
        }
        
        try {
            [code,句子]=this.fun_普通句(code);
        } catch(e) {
            code=code_save;
            句子='';
        }
        return [code,句子];
    }

/*
fun_句子
+[新建阅读窗口](,保存)
*/
    
    fun_普通句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 介宾短语,主语,谓语,句子,宾语,副词,补语;
        var code1;

        [code1,介宾短语]=this.fun_介宾短语(code);
        if(介宾短语!='') {
            if(code1.slice(0,2)==', ') {
                code=code1.slice(2,code1.length);
            }
            
            else {
                介宾短语='';
            }
        }
        [code1,主语]=this.fun_主语(code);
        [code1,谓语]=this.fun_谓语(code1);
        if(谓语!='') {
            code=code1;
        }
        
        else {
            主语='';
            [code,谓语]=this.fun_谓语(code);
        }
        [code,宾语]=this.fun_宾语(code);
        if(谓语=='') {
            return [code,''];
        }
        句子=new NetP("句子");
        句子.m_db[1]=谓语.m_db[1];
        new NetP('的').con(句子,谓语);
        if(介宾短语!='') {
            介宾短语.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,介宾短语);
            new NetP('的').con(谓语,介宾短语);
        }
        if(主语!='') {
            谓语.m_db[1].con(主语.m_db[1],0);
            new NetP('的').con(句子,主语);
        }
        if(宾语!='') {
            谓语.m_db[1].con(0,宾语.m_db[1]);
            new NetP('的').con(句子,宾语);
        }
        [code1,副词]=this.fun_副词(code);
        if(副词!='') {
            副词.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,副词);
            new NetP('的').con(谓语,副词);
            return [code1,句子];
        }
        [code1,补语]=this.fun_补语(code);
        if(补语!='') {
            补语.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,补语);
            new NetP('的').con(谓语,补语);
            return [code1,句子];
        }
        return [code,句子];
    }
    
    fun_被动句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var code1,状语,状语2,宾语,主语,谓语,副词,补语,句子;

        [code1,状语]=this.fun_介宾短语(code);
        if(状语!='') {
            if(code1.slice(0,2)==', ') {
                code=code1.slice(2,code1.length);
            }
            
            else {
                状语='';
            }
        }
        [code,宾语]=this.fun_宾语(code);
        [code,状语2]=this.fun_状语(code);
        if(code[0]!='被') {
            return [code_save,''];
        }
        
        else {
            code=code.slice(1,code.length);
        }
        [code,主语]=this.fun_主语(code);
        [code,谓语]=this.fun_谓语(code);
        if(谓语=='') {
            return [code,''];
        }
        句子=new NetP("句子");
        句子.m_db[1]=谓语.m_db[1];
        new NetP('的').con(句子,谓语);
        new NetP('被').con(谓语,谓语.m_db[1]);
        if(状语!='') {
            状语.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,状语);
            new NetP('的').con(谓语,状语);
        }
        if(状语2!='') {
            状语2.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,状语2);
            new NetP('的').con(谓语,状语2);
            状语2.m_name='状语';
        }
        if(主语!='') {
            谓语.m_db[1].con(主语.m_db[1],0);
            new NetP('的').con(句子,主语);
        }
        if(宾语!='') {
            谓语.m_db[1].con(0,宾语.m_db[1]);
            new NetP('的').con(句子,宾语);
        }
        [code1,副词]=this.fun_副词(code);
        if(副词!='') {
            副词.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,副词);
            new NetP('的').con(谓语,副词);
            return [code1,句子];
        }
        [code1,补语]=this.fun_补语(code);
        if(补语!='') {
            补语.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,补语);
            new NetP('的').con(谓语,补语);
            return [code1,句子];
        }
        return [code,句子];
    }

/*
被动句
*/
    
    fun_把字句(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 状语,状语2,主语,宾语,谓语,句子,副词,补语;
        var code1;

        [code1,状语]=this.fun_介宾短语(code);
        if(状语!='') {
            if(code1.slice(0,2)==', ') {
                code=code1.slice(2,code1.length);
            }
            
            else {
                状语='';
            }
        }

        [code,主语]=this.fun_主语(code);
        [code,状语2]=this.fun_状语(code);
        if(code[0]!='把' & code[0]!='将') {
            return [code_save,''];
        }
        
        else {
            code=code.slice(1,code.length);
        }


        [code,宾语]=this.fun_宾语(code);
        [code,谓语]=this.fun_谓语(code);
        if(谓语=='') {
            return [code,''];
        }
        句子=new NetP("句子");
        句子.m_db[1]=谓语.m_db[1];
        new NetP('的').con(句子,谓语);
        new NetP('把').con(谓语,谓语.m_db[1]);
        if(状语!='') {
            状语.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,状语);
            new NetP('的').con(谓语,状语);
        }
        if(状语2!='') {
            状语2.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,状语2);
            new NetP('的').con(谓语,状语2);
            状语2.m_name='状语';
        }
        if(主语!='') {
            谓语.m_db[1].con(主语.m_db[1],0);
            new NetP('的').con(句子,主语);
        }
        if(宾语!='') {
            谓语.m_db[1].con(0,宾语.m_db[1]);
            new NetP('的').con(句子,宾语);
        }
        [code1,副词]=this.fun_副词(code);
        if(副词!='') {
            副词.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,副词);
            new NetP('的').con(谓语,副词);
            return [code1,句子];
        }
        [code1,补语]=this.fun_补语(code);
        if(补语!='') {
            补语.m_db[1].con(谓语.m_db[1],0);
            new NetP('的').con(句子,补语);
            new NetP('的').con(谓语,补语);
            return [code1,句子];
        }
        return [code,句子];
    }

/*
fun_偏正短语
*/

    fun_宾语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 定语,名词,宾语;

        [code,定语]=this.fun_定语(code);
        if(定语!='') {
            [code,名词]=this.fun_名词(code);
            if(名词!='') {
                宾语=new NetP("宾语");
                宾语.m_db[1]=名词.m_db[1];

                if(this.m_dict_动词.includes(定语.m_db[1].m_name)) {
                    if(定语.m_db[1].m_db[0]!='') {
                        定语.m_db[1].con(0,名词.m_db[1]);
                    }
                    
                    else {
                        定语.m_db[1].con(名词.m_db[1],0);
                    }
                }
                
                else if(this.m_dict_副词.includes(定语.m_db[1].m_name)) {
                    if(定语.m_db[1].m_db[0]!='') {
                        定语.m_db[1].con(0,名词.m_db[1]);
                    }
                    
                    else {
                        定语.m_db[1].con(名词.m_db[1],0);
                    }
                }
                
                else {
                    定语.m_db[1].con(名词.m_db[1],0);
                }
                new NetP('的').con(宾语,定语);
                new NetP('的').con(宾语,名词);
                return [code,宾语];
            }
        }
        code=code_save;
        [code,名词]=this.fun_名词(code);
        if(名词!='') {
            宾语=new NetP("宾语");
            宾语.m_db[1]=名词.m_db[1];

            new NetP('的').con(宾语,名词);
            return [code,宾语];
        }
        code=code_save;
        return [code,''];
    }

/*
printPtList
*/

    fun_定语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 短语,助词,定语,形容词,数量词,名词;

        [code,短语]=this.fun_短语(code);
        if(短语!='') {
            //print(短语,code);
            [code,助词]=this.fun_dict(code,['的'],'助词');
            if(助词!='') {
                定语=new NetP("定语");
                定语.m_db[1]=短语.m_db[1];
                new NetP('的').con(定语,短语);
                new NetP('的').con(定语,助词);
                return [code,定语];
            }
        }
        code=code_save;
        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            定语=new NetP("定语");
            定语.m_db[1]=形容词.m_db[1];
            new NetP('的').con(定语,形容词);
            [code,助词]=this.fun_dict(code,['的'],'助词');
            if(助词!='') {
                new NetP('的').con(定语,助词);
            }
            return [code,定语];
        }
        code=code_save;
        [code,数量词]=this.fun_数量词(code);
        if(数量词!='') {
            定语=new NetP("定语");
            定语.m_db[1]=数量词.m_db[1];
            //new Karma(定语.m_db[1]);
            new NetP('的').con(定语,数量词);
            return [code,定语];
        }
        code=code_save;
        [code,名词]=this.fun_名词(code);
        if(名词!='') {
            [code,助词]=this.fun_dict(code,['的'],'助词');
            if(助词!='') {
                定语=new NetP("定语");
                定语.m_db[1]=名词.m_db[1];
                //new Karma(定语.m_db[1]);
                new NetP('的').con(定语,名词);
                new NetP('的').con(定语,助词);
                return [code,定语];
            }
        }
        code=code_save;
        return [code,''];
    }

/*
fun_把字句
*/

    fun_状语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 并列短语,状语,介宾短语,副词,形容词,代词;

        [code,并列短语]=this.fun_并列短语(code);
        if(并列短语!='') {
            状语=new NetP("状语");
            状语.m_db[1]=并列短语.m_db[1];
            new NetP('的').con(状语,并列短语);
            return [code,状语];
        }
        code=code_save;
        [code,介宾短语]=this.fun_介宾短语(code);
        if(介宾短语!='') {
            状语=new NetP("状语");
            状语.m_db[1]=介宾短语.m_db[1];
            new NetP('的').con(状语,介宾短语);
            return [code,状语];
        }
        code=code_save;
        [code,副词]=this.fun_副词(code);
        if(副词!='') {
            状语=new NetP("状语");
            状语.m_db[1]=副词.m_db[1];
            new NetP('的').con(状语,副词);
            return [code,状语];
        }
        code=code_save;
        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            状语=new NetP("状语");
            状语.m_db[1]=形容词.m_db[1];
            new NetP('的').con(状语,形容词);
            return [code,状语];
        }
        code=code_save;
        [code,代词]=this.fun_代词(code);
        if(代词!='') {
            状语=new NetP("状语");
            状语.m_db[1]=代词.m_db[1];
            new NetP('的').con(状语,代词);
            return [code,状语];
        }
        code=code_save;
        return [code,''];
    }
/*
print
*/

    fun_补语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 并列短语,补语,介宾短语,述宾短语,形容词,数量词,代词;

        [code,并列短语]=this.fun_并列短语(code);
        if(并列短语!='') {
            补语=new NetP("补语");
            补语.m_db[1]=并列短语.m_db[1];
            new NetP('的').con(补语,并列短语);
            return [code,补语];
        }
        code=code_save;
        [code,介宾短语]=this.fun_介宾短语(code);
        if(介宾短语!='') {
            补语=new NetP("补语");
            补语.m_db[1]=介宾短语.m_db[1];
            new NetP('的').con(补语,介宾短语);
            return [code,补语];
        }
        code=code_save;
        [code,述宾短语]=this.fun_述宾短语(code);
        if(述宾短语!='') {
            补语=new NetP("补语");
            补语.m_db[1]=述宾短语.m_db[1];
            new NetP('的').con(补语,述宾短语);
            return [code,补语];
        }
        code=code_save;
        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            补语=new NetP("补语");
            补语.m_db[1]=形容词.m_db[1];
            new NetP('的').con(补语,形容词);
            return [code,补语];
        }
        code=code_save;
        [code,数量词]=this.fun_数量词(code);
        if(数量词!='') {
            补语=new NetP("补语");
            补语.m_db[1]=数量词.m_db[1];
            new NetP('的').con(补语,数量词);
            return [code,补语];
        }
        code=code_save;
        [code,代词]=this.fun_代词(code);
        if(代词!='') {
            补语=new NetP("补语");
            补语.m_db[1]=代词.m_db[1];
            new NetP('的').con(补语,代词);
            return [code,补语];
        }
        code=code_save;
        return [code,''];
    }

/*
fun_主语
print
*/
    
    fun_短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 并列短语,偏正短语,介宾短语,述宾短语,述补短语,主谓短语;

        [code,并列短语]=this.fun_并列短语(code);
        if(并列短语!='') {
            //print('并列短语',code);
            return [code,并列短语];
        }
        code=code_save;
        [code,偏正短语]=this.fun_偏正短语(code);
        if(偏正短语!='') {
            //print('偏正短语',code);
            return [code,偏正短语];
        }
        code=code_save;
        [code,介宾短语]=this.fun_介宾短语(code);
        if(介宾短语!='') {
            //print('介宾短语',code);
            return [code,介宾短语];
        }
        code=code_save;
        [code,述宾短语]=this.fun_述宾短语(code);
        if(述宾短语!='') {
            return [code,述宾短语];
        }
        code=code_save;
        [code,述补短语]=this.fun_述补短语(code);
        if(述补短语!='') {
            //print('述补短语',code);
            return [code,述补短语];
        }
        code=code_save;
        [code,主谓短语]=this.fun_主谓短语(code);
        if(主谓短语!='') {
            //print('主谓短语',code);
            return [code,主谓短语];
        }
        code=code_save;
        return [code,''];
    }
    
    fun_并列短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 形容词,形容词_0,形容词_1,连词,并列短语,并列短语_0,名词,名词_0,名词_1;

        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            [code,连词]=this.fun_连词(code);
            if(连词!='') {
                [code,并列短语]=this.fun_并列短语(code);
                if(并列短语!='') {
                    并列短语_0=new NetP("并列短语");
                    连词.m_db[1].con(形容词.m_db[1],并列短语.m_db[1]);
                    并列短语_0.m_db[1]=形容词.m_db[1];
                    new NetP('的').con(并列短语_0,形容词);
                    new NetP('的').con(并列短语_0,连词);
                    new NetP('的').con(并列短语_0,并列短语);
                    return [code,并列短语_0];
                }
            }
        }
        code=code_save;
        [code,名词]=this.fun_名词(code);
        if(名词!='') {
            [code,连词]=this.fun_连词(code);
            if(连词!='') {
                [code,并列短语]=this.fun_并列短语(code);
                if(并列短语!='') {
                    并列短语_0=new NetP("并列短语");
                    连词.m_db[1].con(名词.m_db[1],并列短语.m_db[1]);
                    并列短语_0.m_db[1]=名词.m_db[1];
                    new NetP('的').con(并列短语_0,名词);
                    new NetP('的').con(并列短语_0,连词);
                    new NetP('的').con(并列短语_0,并列短语);
                    return [code,并列短语_0];
                }
            }
        }
        code=code_save;
        [code,名词_0]=this.fun_名词(code);
        if(名词_0!='') {
            [code,连词]=this.fun_连词(code);
            if(连词!='') {
                [code,名词_1]=this.fun_名词(code);
                if(名词_1!='') {
                    并列短语=new NetP("并列短语");
                    连词.m_db[1].con(名词_0.m_db[1],名词_1.m_db[1]);
                    并列短语.m_db[1]=名词_0.m_db[1];
                    new NetP('的').con(并列短语,名词_0);
                    new NetP('的').con(并列短语,连词);
                    new NetP('的').con(并列短语,名词_1);
                    return [code,并列短语];
                }
            }
        }
        code=code_save;
        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            [code,连词]=this.fun_连词(code);
            if(连词!='') {
                [code,名词]=this.fun_名词(code);
                if(名词!='') {
                    并列短语=new NetP("并列短语");
                    连词.m_db[1].con(形容词.m_db[1],名词.m_db[1]);
                    并列短语.m_db[1]=形容词.m_db[1];
                    new NetP('的').con(并列短语,形容词);
                    new NetP('的').con(并列短语,连词);
                    new NetP('的').con(并列短语,名词);
                    return [code,并列短语];
                }
            }
        }
        code=code_save;
        [code,名词]=this.fun_名词(code);
        if(名词!='') {
            [code,连词]=this.fun_连词(code);
            if(连词!='') {
                [code,形容词]=this.fun_形容词(code);
                if(形容词!='') {
                    并列短语=new NetP("并列短语");
                    连词.m_db[1].con(名词.m_db[1],形容词.m_db[1]);
                    并列短语.m_db[1]=名词.m_db[1];
                    new NetP('的').con(并列短语,名词);
                    new NetP('的').con(并列短语,连词);
                    new NetP('的').con(并列短语,形容词);
                    return [code,并列短语];
                }
            }
        }
        code=code_save;
        [code,形容词_0]=this.fun_形容词(code);
        if(形容词_0!='') {
            [code,连词]=this.fun_连词(code);
            if(连词!='') {
                [code,形容词_1]=this.fun_形容词(code);
                if(形容词_1!='') {
                    并列短语=new NetP("并列短语");
                    连词.m_db[1].con(形容词_0.m_db[1],形容词_1.m_db[1]);
                    并列短语.m_db[1]=形容词_0.m_db[1];
                    new NetP('的').con(并列短语,形容词);
                    new NetP('的').con(并列短语,连词);
                    new NetP('的').con(并列短语,形容词);
                    return [code,并列短语];
                }
            }
        }
        code=code_save;
        return [code,''];
    }

/*
fun_定语
*/
    
    fun_偏正短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 名词_0,名词_1,偏正短语,形容词,动词,pt_de;

        [code,名词_0]=this.fun_名词(code);
        if(名词_0!='') {
            [code,名词_1]=this.fun_名词(code);
            if(名词_1!='') {
                偏正短语=new NetP("偏正短语");
                偏正短语.m_db[1]=名词_1.m_db[1];

                pt_de=new NetP('的').con(名词_0.m_db[1],名词_1.m_db[1]);

                new NetP('的').con(偏正短语,名词_0);
                new NetP('的').con(偏正短语,pt_de);
                new NetP('的').con(偏正短语,名词_1);
                return [code,偏正短语];
            }
        }
        code=code_save;
        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            [code,动词]=this.fun_动词(code);
            if(动词!='') {
                偏正短语=new NetP("偏正短语");
                偏正短语.m_db[1]=动词.m_db[1];
                形容词.m_db[1].con(动词.m_db[1],0);
                //new Karma(动词.m_db[1]);
                //new Karma(形容词.m_db[1]);
                new NetP('的').con(偏正短语,形容词);
                new NetP('的').con(偏正短语,动词);
                return [code,偏正短语];
            }
        }
        code=code_save;
        [code,形容词]=this.fun_形容词(code);
        if(形容词!='') {
            [code,名词]=this.fun_名词(code);
            if(名词!='') {
                偏正短语=new NetP("偏正短语");
                偏正短语.m_db[1]=名词.m_db[1];
                形容词.m_db[1].con(名词.m_db[1],0);
                //new Karma(形容词.m_db[1]);
                //new Karma(名词.m_db[1]);
                new NetP('的').con(偏正短语,形容词);
                new NetP('的').con(偏正短语,名词);
                return [code,偏正短语];
            }
        }
        code=code_save;
        return [code,''];
    }
    
    fun_述宾短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 动词,名词,述宾短语;

        [code,动词]=this.fun_动词(code);
        if(动词!='') {
            [code,名词]=this.fun_名词(code);
            if(名词!='') {
                述宾短语=new NetP("述宾短语");
                述宾短语.m_db[1]=动词.m_db[1];
                动词.m_db[1].con(0,名词.m_db[1]);

                new NetP('的').con(述宾短语,动词);
                new NetP('的').con(述宾短语,名词);
                return [code,述宾短语];
            }
        }
        code=code_save;
        return [code,''];
    }
    
    fun_述补短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 动词,形容词,述补短语;

        [code,动词]=this.fun_动词(code);
        if(动词!='') {
            [code,形容词]=this.fun_形容词(code);
            if(形容词!='') {
                述补短语=new NetP("述补短语");
                述补短语.m_db[1]=动词.m_db[1];
                形容词.m_db[1].con(动词.m_db[1],0);
                //new Karma(动词.m_db[1]);
                //new Karma(形容词.m_db[1]);
                new NetP('的').con(述补短语,动词);
                new NetP('的').con(述补短语,形容词);
                return [code,述补短语];
            }
        }
        code=code_save;
        return [code,''];
    }
    
    fun_主谓短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 名词,主谓短语,动词,副词;

        [code,名词]=this.fun_名词(code);
        if(名词=='') {
            return [code_save,''];
        }
        主谓短语=new NetP("主谓短语");
        new NetP('的').con(主谓短语,名词);

        [code,动词]=this.fun_动词(code);
        if(动词!='') {
            动词.m_db[1].con(名词.m_db[1],0);
            主谓短语.m_db[1]=动词.m_db[1];

            new NetP('的').con(主谓短语,动词);
        }
        
        else {
            [code,副词]=this.fun_副词(code);
            if(副词!='') {
                副词.m_db[1].con(名词.m_db[1],0);
                主谓短语.m_db[1]=副词.m_db[1];

                new NetP('的').con(主谓短语,副词);
            }
            
            else {
                return [code_save,''];
            }
        }
        return [code,主谓短语];
    }
    
    fun_介宾短语(code) {
        if(code=="") {
            return [code,''];
        }
        var code_save=code;
        var 介词,宾语,介宾短语,副词;

        [code,介词]=this.fun_介词(code);
        [code,宾语]=this.fun_名词(code);
        介宾短语=new NetP("介宾短语");
        if(宾语!='' & 介词!='') {
            介宾短语.m_db[1]=介词.m_db[1];
            介词.m_db[1].con(0,宾语.m_db[1]);
            //new Karma(介词.m_db[1]);
            new NetP('的').con(介宾短语,宾语);
            new NetP('的').con(介宾短语,介词);
        }
        
        else {
            code=code_save;
            return [code,''];
        }
        [code,副词]=this.fun_副词(code);
        if(副词!='') {
            副词.m_db[1].con(介词.m_db[1],0);
            new NetP('的').con(介宾短语,副词);
        }
        return [code,介宾短语];
    }

/*
并列短语
*/

    collectPts(pt,list_pt='') {
        if(list_pt=='') {
            list_pt=[];
        }
        if(!list_pt.includes(pt)) {
            list_pt.push(pt);
        }
        
        for(var i=0;i<pt.m_con.length;i++) {
            var con=pt.m_con[i];
            if(con.m_db[0]==pt) {
                if(!list_pt.includes(con)) {
                    list_pt.push(con);
                }
                if(con.m_name=="的" & con.m_db[1]!='') {
                    this.collectPts(con.m_db[1],list_pt);
                }
            }
        }
        if(pt.m_db[0]!='') {
            if(!list_pt.includes(pt.m_db[0])) {
                list_pt.push(pt.m_db[0]);
            }
        }
        if(pt.m_db[1]!='') {
            if(!list_pt.includes(pt.m_db[1])) {
                list_pt.push(pt.m_db[1]);
            }
        }
        return list_pt;
    }

    sentStruct(pt) {
        var pt0=new NetP('^起点').con(0,pt);
        var list_pt0,list_pt;
        list_pt0=this.collectPts(pt);
        list_pt=[pt0,...list_pt0];
        return list_pt;
    }
    
    sent2Struct(sent) {
        var code,pt,list_pt;
        [code,pt]=this.fun_句子(sent);
        if(pt=='') {
            return [[],code];
        }
        else {
            list_pt=this.sentStruct(pt);
            return [list_pt,code];
        }
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

function printPtList(list_pt) {
    print(info_PtList(list_pt));
}

var NLP=new NL_Parser();


/*
fun_单句
测试(J函数):...
+[新建阅读窗口](,测试)
*/