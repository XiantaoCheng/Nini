/*
地址::文档/S应用/NiniJS/js/NL_parser.js
+[保存文本](,NL_parser)
+[J函数](,NL_parser)
+[打开文件夹]"文档/S应用/NiniJS/js"
+[显示](,地址)

StCore(库)::文档/S应用/NiniJS/js/StCore.js
StParser(库)::文档/S应用/NiniJS/js/Parser.js
Karma(库)::文档/S应用/NiniJS/js/Karma.js
NetP(库)::文档/S应用/NiniJS/js/NetP.js
有什么

原始版本:...
保存:...

规则:...
自动parser:...
加上
自动parser有什么

组成
伸出
*/


function word_pat_token(code,i,pat) {
    var text='';

//    pat=pat.replace('\\','\\\\');
    var code1=code.slice(i,code.length);
    var a=code1.match("^"+pat)
    if (a===null) {
        state=false;
    } else {
        a=a[0];
        var di=a.length;
        var output_txt=code.slice(i,i+di);
        i=i+di;
        state=true;
        var text=output_txt;
    }
    
    return [state,i,text];
}


function parser_token_后缀(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    [state,i,text]=word_pat_token(code,i,', ');
    var pt0=new NetP("逗号",text);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var pt1;
        [state,i,pt1,list_pt]=parser_token_补语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
    }
    //if state0==False:
    //    try:
    //        pt0=pt1
    //    except:
    //        pt0=None
    if (state0===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt1;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_副词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("后缀:",state);
        return [false,i0,''];
    }
    else {
//        print("后缀:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_关联词(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    [state,i,text]=word_pat_token(code,i,'因为|所以|同时|但是|如果|那么|否则|其中|而且|且|并且');
    var pt0=new NetP("关联词",text);
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("关联词:",state);
        return [false,i0,''];
    }
    else {
//        print("关联词:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_前缀组(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_介宾短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        [state,i,text]=word_pat_token(code,i,'为');
        var pt1=new NetP("补语",text);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var pt2;
            [state,i,pt2,list_pt]=parser_token_主语2(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
        }
        if (state===true) {
            list_new.push(pt1);
        }
        
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
        if (state===true) {
            [state,i,text]=word_pat_token(code,i,', ');
            if (state===true) {
                var i2=i;
                var state2=true;
                var list_new2=[...list_new];
                // list_new=[];
                var pt2;
                [state,i,pt2,list_pt]=parser_token_前缀组(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
                if (state===false) {
                    i=i2;
                    list_new=[...list_new2];
                    state=true;
                    state2=false;
                }
                
            }
        }
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_关联词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            var i0=i;
            var state0=true;
            var list_new0=[...list_new];
            // list_new=[];
            [state,i,text]=word_pat_token(code,i,', ');
            if (state===false) {
                i=i0;
                list_new=[...list_new0];
                state=true;
                state0=false;
            }
            
            if (state===true) {
                var i1=i;
                var state1=true;
                var list_new1=[...list_new];
                // list_new=[];
                var pt1;
                [state,i,pt1,list_pt]=parser_token_前缀组(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt1.con(pt0,0);
                } else {
                    pt1=pt0;
                }
                if (state===false) {
                    i=i1;
                    list_new=[...list_new1];
                    state=true;
                    state1=false;
                }
                
            }
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("前缀组:",state);
        return [false,i0,''];
    }
    else {
//        print("前缀组:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_前缀(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_前缀组(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("前缀:",state);
        return [false,i0,''];
    }
    else {
//        print("前缀:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_介宾短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_介词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        var i0=i;
        var state0=true;
        var list_new0=[...list_new];
        // list_new=[];
        [state,i,text]=word_pat_token(code,i,'着');
        if (state===false) {
            i=i0;
            list_new=[...list_new0];
            state=true;
            state0=false;
        }
        
        if (state===true) {
            var i1=i;
            var list_new1=[...list_new];
            var pt1;
            [state,i,pt1,list_pt]=parser_token_并列短语3(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1=new NetP("宾").con(0,pt1);
            }
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===true) {
                list_new.push(pt1);
            }
            if (state===false) {
                i=i1;
                list_new=[...list_new1];
            
                var pt1;
                [state,i,pt1,list_pt]=parser_token_名词短语2(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt1=new NetP("宾").con(0,pt1);
                }
                if (state===true) {
                    pt1.con(pt0,0);
                } else {
                    pt1=pt0;
                }
                if (state===true) {
                    list_new.push(pt1);
                }
            }
            
            if (state===true) {
                var i2=i;
                var state2=true;
                var list_new2=[...list_new];
                // list_new=[];
                var pt2;
                [state,i,pt2,list_pt]=parser_token_副词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
                if (state===false) {
                    i=i2;
                    list_new=[...list_new2];
                    state=true;
                    state2=false;
                }
                
            }
        }
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("介宾短语:",state);
        return [false,i0,''];
    }
    else {
//        print("介宾短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_名词短语2(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_数量词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_定语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
        
            var pt1;
            [state,i,pt1,list_pt]=parser_token_并列短语2(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===true) {
                [state,i,text]=word_pat_token(code,i,'的');
            }
        }
        
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
        if (state===true) {
            var pt2;
            [state,i,pt2,list_pt]=parser_token_名词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
        }
    }
    if (state===true) {
        pt_out=pt2;
    }
    
    

    if (state===false) {
//        print("名词短语2:",state);
        return [false,i0,''];
    }
    else {
//        print("名词短语2:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_主谓短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_偏正短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("主谓短语").con(0,pt0);
    }
    if (state===true) {
        var i1=i;
        var list_new1=[...list_new];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_动词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
        
            var pt1;
            [state,i,pt1,list_pt]=parser_token_副词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
        }
        
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_名词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt0=new NetP("主谓短语").con(0,pt0);
        }
        if (state===true) {
            var i1=i;
            var list_new1=[...list_new];
            var pt1;
            [state,i,pt1,list_pt]=parser_token_动词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===false) {
                i=i1;
                list_new=[...list_new1];
            
                var pt1;
                [state,i,pt1,list_pt]=parser_token_副词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt1.con(pt0,0);
                } else {
                    pt1=pt0;
                }
            }
            
        }
        if (state===true) {
            list_new.push(pt0);
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("主谓短语:",state);
        return [false,i0,''];
    }
    else {
//        print("主谓短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_述补短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_动词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("述补短语").con(0,pt0);
    }
    if (state===true) {
        var pt1;
        [state,i,pt1,list_pt]=parser_token_形容词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("述补短语:",state);
        return [false,i0,''];
    }
    else {
//        print("述补短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_述宾短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_谓语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("述宾短语").con(0,pt0);
    }
    if (state===true) {
        var pt1;
        [state,i,pt1,list_pt]=parser_token_名词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var state2=true;
            var list_new2=[...list_new];
            // list_new=[];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_副词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
                state=true;
                state2=false;
            }
            
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("述宾短语:",state);
        return [false,i0,''];
    }
    else {
//        print("述宾短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_偏正短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_形容词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("偏正短语").con(0,pt0);
    }
    if (state===true) {
        var i0=i;
        var state0=true;
        var list_new0=[...list_new];
        // list_new=[];
        [state,i,text]=word_pat_token(code,i,'的');
        if (state===false) {
            i=i0;
            list_new=[...list_new0];
            state=true;
            state0=false;
        }
        
        if (state===true) {
            var pt1;
            [state,i,pt1,list_pt]=parser_token_名词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("偏正短语:",state);
        return [false,i0,''];
    }
    else {
//        print("偏正短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_并列短语3b(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_名词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("个体").con(0,pt0);
    }
    if (state===true) {
        [state,i,text]=word_pat_token(code,i,'和|或者|或|并且|以及');
        var pt1=new NetP("连词",text);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语3b(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2=new NetP("个体").con(0,pt2);
                }
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
                if (state===true) {
                    list_new.push(pt2);
                }
            }
            
        }
        if (state===true) {
            list_new.push(pt1);
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("并列短语3b:",state);
        return [false,i0,''];
    }
    else {
//        print("并列短语3b:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_并列短语3(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_名词短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("个体").con(0,pt0);
    }
    if (state===true) {
        [state,i,text]=word_pat_token(code,i,'和|或者|或|并且|以及');
        var pt1=new NetP("连词",text);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语3(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词短语(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2=new NetP("个体").con(0,pt2);
                }
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
                if (state===true) {
                    list_new.push(pt2);
                }
            }
            
        }
        if (state===true) {
            list_new.push(pt1);
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("并列短语3:",state);
        return [false,i0,''];
    }
    else {
//        print("并列短语3:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_并列短语2(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_名词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("个体").con(0,pt0);
    }
    if (state===true) {
        [state,i,text]=word_pat_token(code,i,'和|或者|或|并且|以及|, ');
        var pt1=new NetP("连词",text);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2=new NetP("个体").con(0,pt2);
                }
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
                if (state===true) {
                    list_new.push(pt2);
                }
            }
            
        }
        if (state===true) {
            list_new.push(pt1);
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("并列短语2:",state);
        return [false,i0,''];
    }
    else {
//        print("并列短语2:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_并列短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_名词短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("个体").con(0,pt0);
    }
    if (state===true) {
        [state,i,text]=word_pat_token(code,i,'和|或者|或|并且|以及|, ');
        var pt1=new NetP("连词",text);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词短语(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2=new NetP("个体").con(0,pt2);
                }
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
                if (state===true) {
                    list_new.push(pt2);
                }
            }
            
        }
        if (state===true) {
            list_new.push(pt1);
        }
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("并列短语:",state);
        return [false,i0,''];
    }
    else {
//        print("并列短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_名词短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_数量词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_定语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
        if (state===true) {
            var pt2;
            [state,i,pt2,list_pt]=parser_token_名词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
        }
    }
    if (state===true) {
        pt_out=pt2;
    }
    
    

    if (state===false) {
//        print("名词短语:",state);
        return [false,i0,''];
    }
    else {
//        print("名词短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_短语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_主谓短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_述补短语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_述宾短语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_介宾短语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("短语:",state);
        return [false,i0,''];
    }
    else {
//        print("短语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_补语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var list_new0=[...list_new];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_形容词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_数量词(code,i);
        list_new=list_new.concat(list_pt);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_代词(code,i);
        list_new=list_new.concat(list_pt);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_介宾短语(code,i);
        list_new=list_new.concat(list_pt);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_并列短语(code,i);
        list_new=list_new.concat(list_pt);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_述宾短语(code,i);
        list_new=list_new.concat(list_pt);
    }
    
    if (state===true) {
        pt0=new NetP("补语").con(0,pt0);
    }
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_助词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("补语:",state);
        return [false,i0,''];
    }
    else {
//        print("补语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_状语2(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_副词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("状语").con(0,pt0);
    }
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_状语2(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("状语2:",state);
        return [false,i0,''];
    }
    else {
//        print("状语2:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_状语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var list_new0=[...list_new];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_介宾短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_副词(code,i);
        list_new=list_new.concat(list_pt);
    }
    
    if (state===true) {
        pt0=new NetP("状语").con(0,pt0);
    }
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_状语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("状语:",state);
        return [false,i0,''];
    }
    else {
//        print("状语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_定语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_短语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("定语").con(0,pt0);
    }
    if (state===true) {
        [state,i,text]=word_pat_token(code,i,'的');
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var i0=i;
        var list_new0=[...list_new];
        var pt0;
        [state,i,pt0,list_pt]=parser_token_偏正短语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            var i1=i;
            var state1=true;
            var list_new1=[...list_new];
            // list_new=[];
            var pt1;
            [state,i,pt1,list_pt]=parser_token_副词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===false) {
                i=i1;
                list_new=[...list_new1];
                state=true;
                state1=false;
            }
            
        }
        if (state===false) {
            i=i0;
            list_new=[...list_new0];
        
            var pt0;
            [state,i,pt0,list_pt]=parser_token_名词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                var i1=i;
                var state1=true;
                var list_new1=[...list_new];
                // list_new=[];
                var pt1;
                [state,i,pt1,list_pt]=parser_token_副词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt1.con(pt0,0);
                } else {
                    pt1=pt0;
                }
                if (state===false) {
                    i=i1;
                    list_new=[...list_new1];
                    state=true;
                    state1=false;
                }
                
            }
        }
        
        if (state===true) {
            pt0=new NetP("定语").con(0,pt0);
        }
        if (state===true) {
            [state,i,text]=word_pat_token(code,i,'的');
        }
        if (state===true) {
            list_new.push(pt0);
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_形容词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt0=new NetP("定语").con(0,pt0);
        }
        if (state===true) {
            var i0=i;
            var state0=true;
            var list_new0=[...list_new];
            // list_new=[];
            [state,i,text]=word_pat_token(code,i,'的');
            if (state===false) {
                i=i0;
                list_new=[...list_new0];
                state=true;
                state0=false;
            }
            
        }
        if (state===true) {
            list_new.push(pt0);
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("定语:",state);
        return [false,i0,''];
    }
    else {
//        print("定语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_宾语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_数量词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_定语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
        
            var pt1;
            [state,i,pt1,list_pt]=parser_token_并列短语2(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1=new NetP("定语").con(0,pt1);
            }
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===true) {
                [state,i,text]=word_pat_token(code,i,'的');
            }
            if (state===true) {
                list_new.push(pt1);
            }
        }
        
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
            }
            
        }
    }
    if (state===true) {
        pt_out=pt2;
    }
    
    

    if (state===false) {
//        print("宾语:",state);
        return [false,i0,''];
    }
    else {
//        print("宾语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_谓语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_状语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        var pt1;
        [state,i,pt1,list_pt]=parser_token_动词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var state2=true;
            var list_new2=[...list_new];
            // list_new=[];
            [state,i,text]=word_pat_token(code,i,'着|了');
            var pt2=new NetP("副词",text);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
                state=true;
                state2=false;
            
                pt2=pt1;
            }
            
            if (state2===true) {
                list_new.push(pt2);
            }
        }
    }
    if (state===true) {
        pt_out=pt1;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_状语2(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            var pt1;
            [state,i,pt1,list_pt]=parser_token_动词(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
        }
        if (state===true) {
            pt_out=pt1;
        }
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_动词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            var i1=i;
            var state1=true;
            var list_new1=[...list_new];
            // list_new=[];
            [state,i,text]=word_pat_token(code,i,'着|了');
            var pt1=new NetP("副词",text);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===false) {
                i=i1;
                list_new=[...list_new1];
                state=true;
                state1=false;
            
                pt1=pt0;
            }
            
            if (state1===true) {
                list_new.push(pt1);
            }
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("谓语:",state);
        return [false,i0,''];
    }
    else {
//        print("谓语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_主语2(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_数量词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_定语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
        
            var pt1;
            [state,i,pt1,list_pt]=parser_token_并列短语3b(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1=new NetP("定语").con(0,pt1);
            }
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===true) {
                [state,i,text]=word_pat_token(code,i,'的');
            }
            if (state===true) {
                list_new.push(pt1);
            }
        }
        
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语3(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
            }
            
        }
    }
    if (state===true) {
        pt_out=pt2;
    }
    
    

    if (state===false) {
//        print("主语2:",state);
        return [false,i0,''];
    }
    else {
//        print("主语2:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_主语(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_数量词(code,i);
    list_new=list_new.concat(list_pt);
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_定语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
        
            var pt1;
            [state,i,pt1,list_pt]=parser_token_并列短语2(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1=new NetP("定语").con(0,pt1);
            }
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===true) {
                [state,i,text]=word_pat_token(code,i,'的');
            }
            if (state===true) {
                list_new.push(pt1);
            }
        }
        
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
        if (state===true) {
            var i2=i;
            var list_new2=[...list_new];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_并列短语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
            
                var pt2;
                [state,i,pt2,list_pt]=parser_token_名词(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt2.con(pt1,0);
                } else {
                    pt2=pt1;
                }
            }
            
        }
    }
    if (state===true) {
        pt_out=pt2;
    }
    
    

    if (state===false) {
//        print("主语:",state);
        return [false,i0,''];
    }
    else {
//        print("主语:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_宾语句子(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_宾语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_名词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            var i1=i;
            var state1=true;
            var list_new1=[...list_new];
            // list_new=[];
            [state,i,text]=word_pat_token(code,i,'的');
            var pt1=new NetP("物主",text);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===false) {
                i=i1;
                list_new=[...list_new1];
                state=true;
                state1=false;
            
                pt1=pt0;
            }
            
            if (state1===true) {
                list_new.push(pt1);
            }
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("宾语句子:",state);
        return [false,i0,''];
    }
    else {
//        print("宾语句子:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_主语句子(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_主语(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_名词(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            var i1=i;
            var state1=true;
            var list_new1=[...list_new];
            // list_new=[];
            [state,i,text]=word_pat_token(code,i,'的');
            var pt1=new NetP("物主",text);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
            if (state===false) {
                i=i1;
                list_new=[...list_new1];
                state=true;
                state1=false;
            
                pt1=pt0;
            }
            
            if (state1===true) {
                list_new.push(pt1);
            }
        }
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("主语句子:",state);
        return [false,i0,''];
    }
    else {
//        print("主语句子:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_把字句(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_前缀(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("前缀").con(0,pt0);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_主语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1=new NetP("主语").con(0,pt1);
        }
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        
            pt1=pt0;
        }
        
        if (state===true) {
            var i2=i;
            var state2=true;
            var list_new2=[...list_new];
            // list_new=[];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_状语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2=new NetP("状语").con(0,pt2);
            }
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
                state=true;
                state2=false;
            
                pt2=pt1;
            }
            
            if (state===true) {
                [state,i,text]=word_pat_token(code,i,'[把让将]');
                var pt3=new NetP("句子类型",text);
                if (state===true) {
                    pt3.con(pt2,0);
                } else {
                    pt3=pt2;
                }
                if (state===true) {
                    var pt4;
                    [state,i,pt4,list_pt]=parser_token_宾语(code,i);
                    list_new=list_new.concat(list_pt);
                    if (state===true) {
                        pt4=new NetP("宾语").con(0,pt4);
                    }
                    if (state===true) {
                        pt4.con(pt3,0);
                    } else {
                        pt4=pt3;
                    }
                    if (state===true) {
                        var i4=i;
                        var state4=true;
                        var list_new4=[...list_new];
                        // list_new=[];
                        [state,i,text]=word_pat_token(code,i,', ');
                        if (state===false) {
                            i=i4;
                            list_new=[...list_new4];
                            state=true;
                            state4=false;
                        }
                        
                        if (state===true) {
                            var pt5;
                            [state,i,pt5,list_pt]=parser_token_谓语(code,i);
                            list_new=list_new.concat(list_pt);
                            if (state===true) {
                                pt5=new NetP("谓语").con(0,pt5);
                            }
                            if (state===true) {
                                pt5.con(pt4,0);
                            } else {
                                pt5=pt4;
                            }
                            if (state===true) {
                                var i6=i;
                                var state6=true;
                                var list_new6=[...list_new];
                                // list_new=[];
                                var pt6;
                                [state,i,pt6,list_pt]=parser_token_补语(code,i);
                                list_new=list_new.concat(list_pt);
                                if (state===true) {
                                    pt6=new NetP("后缀").con(0,pt6);
                                }
                                if (state===true) {
                                    pt6.con(pt5,0);
                                } else {
                                    pt6=pt5;
                                }
                                if (state===false) {
                                    i=i6;
                                    list_new=[...list_new6];
                                    state=true;
                                    state6=false;
                                
                                    pt6=pt5;
                                }
                                
                                if (state6===true) {
                                    list_new.push(pt6);
                                }
                            }
                            if (state===true) {
                                list_new.push(pt5);
                            }
                        }
                    }
                    if (state===true) {
                        list_new.push(pt4);
                    }
                }
                if (state===true) {
                    list_new.push(pt3);
                }
            }
            //if state2==False:
            //    try:
            //        pt2=pt3
            //    except:
            //        pt2=None
            if (state2===true) {
                list_new.push(pt2);
            }
        }
        //if state1==False:
        //    try:
        //        pt1=pt2
        //    except:
        //        pt1=None
        if (state1===true) {
            list_new.push(pt1);
        }
    }
    //if state0==False:
    //    try:
    //        pt0=pt1
    //    except:
    //        pt0=None
    if (state0===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt5;
    }
    
    

    if (state===false) {
//        print("把字句:",state);
        return [false,i0,''];
    }
    else {
//        print("把字句:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_被动句(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_前缀(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("前缀").con(0,pt0);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_宾语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1=new NetP("宾语").con(0,pt1);
        }
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        
            pt1=pt0;
        }
        
        if (state===true) {
            var i2=i;
            var state2=true;
            var list_new2=[...list_new];
            // list_new=[];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_状语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2=new NetP("状语").con(0,pt2);
            }
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
                state=true;
                state2=false;
            
                pt2=pt1;
            }
            
            if (state===true) {
                [state,i,text]=word_pat_token(code,i,'被');
                var pt3=new NetP("句子类型",text);
                if (state===true) {
                    pt3.con(pt2,0);
                } else {
                    pt3=pt2;
                }
                if (state===true) {
                    var pt4;
                    [state,i,pt4,list_pt]=parser_token_主语(code,i);
                    list_new=list_new.concat(list_pt);
                    if (state===true) {
                        pt4=new NetP("主语").con(0,pt4);
                    }
                    if (state===true) {
                        pt4.con(pt3,0);
                    } else {
                        pt4=pt3;
                    }
                    if (state===true) {
                        var i4=i;
                        var state4=true;
                        var list_new4=[...list_new];
                        // list_new=[];
                        [state,i,text]=word_pat_token(code,i,', ');
                        if (state===false) {
                            i=i4;
                            list_new=[...list_new4];
                            state=true;
                            state4=false;
                        }
                        
                        if (state===true) {
                            var pt5;
                            [state,i,pt5,list_pt]=parser_token_谓语(code,i);
                            list_new=list_new.concat(list_pt);
                            if (state===true) {
                                pt5=new NetP("谓语").con(0,pt5);
                            }
                            if (state===true) {
                                pt5.con(pt4,0);
                            } else {
                                pt5=pt4;
                            }
                            if (state===true) {
                                var i6=i;
                                var state6=true;
                                var list_new6=[...list_new];
                                // list_new=[];
                                var pt6;
                                [state,i,pt6,list_pt]=parser_token_补语(code,i);
                                list_new=list_new.concat(list_pt);
                                if (state===true) {
                                    pt6=new NetP("后缀").con(0,pt6);
                                }
                                if (state===true) {
                                    pt6.con(pt5,0);
                                } else {
                                    pt6=pt5;
                                }
                                if (state===false) {
                                    i=i6;
                                    list_new=[...list_new6];
                                    state=true;
                                    state6=false;
                                
                                    pt6=pt5;
                                }
                                
                                if (state6===true) {
                                    list_new.push(pt6);
                                }
                            }
                            if (state===true) {
                                list_new.push(pt5);
                            }
                        }
                    }
                    if (state===true) {
                        list_new.push(pt4);
                    }
                }
                if (state===true) {
                    list_new.push(pt3);
                }
            }
            //if state2==False:
            //    try:
            //        pt2=pt3
            //    except:
            //        pt2=None
            if (state2===true) {
                list_new.push(pt2);
            }
        }
        //if state1==False:
        //    try:
        //        pt1=pt2
        //    except:
        //        pt1=None
        if (state1===true) {
            list_new.push(pt1);
        }
    }
    //if state0==False:
    //    try:
    //        pt0=pt1
    //    except:
    //        pt0=None
    if (state0===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt5;
    }
    
    

    if (state===false) {
//        print("被动句:",state);
        return [false,i0,''];
    }
    else {
//        print("被动句:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_普通句2(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_前缀(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("前缀").con(0,pt0);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var pt1;
        [state,i,pt1,list_pt]=parser_token_谓语(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1=new NetP("谓语").con(0,pt1);
        }
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===true) {
            var i2=i;
            var state2=true;
            var list_new2=[...list_new];
            // list_new=[];
            var pt2;
            [state,i,pt2,list_pt]=parser_token_宾语句子(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2=new NetP("宾语").con(0,pt2);
            }
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===false) {
                i=i2;
                list_new=[...list_new2];
                state=true;
                state2=false;
            
                pt2=pt1;
            }
            
            if (state===true) {
                var i3=i;
                var state3=true;
                var list_new3=[...list_new];
                // list_new=[];
                var pt3;
                [state,i,pt3,list_pt]=parser_token_后缀(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt3=new NetP("后缀").con(0,pt3);
                }
                if (state===true) {
                    pt3.con(pt2,0);
                } else {
                    pt3=pt2;
                }
                if (state===false) {
                    i=i3;
                    list_new=[...list_new3];
                    state=true;
                    state3=false;
                
                    pt3=pt2;
                }
                
                if (state3===true) {
                    list_new.push(pt3);
                }
            }
            //if state2==False:
            //    try:
            //        pt2=pt3
            //    except:
            //        pt2=None
            if (state2===true) {
                list_new.push(pt2);
            }
        }
        if (state===true) {
            list_new.push(pt1);
        }
    }
    //if state0==False:
    //    try:
    //        pt0=pt1
    //    except:
    //        pt0=None
    if (state0===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt1;
    }
    
    

    if (state===false) {
//        print("普通句2:",state);
        return [false,i0,''];
    }
    else {
//        print("普通句2:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_普通句(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var i0=i;
    var state0=true;
    var list_new0=[...list_new];
    // list_new=[];
    var pt0;
    [state,i,pt0,list_pt]=parser_token_前缀(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("前缀").con(0,pt0);
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
        state=true;
        state0=false;
    }
    
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        var pt1;
        [state,i,pt1,list_pt]=parser_token_主语句子(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt1=new NetP("主语").con(0,pt1);
        }
        if (state===true) {
            pt1.con(pt0,0);
        } else {
            pt1=pt0;
        }
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        
            pt1=pt0;
        }
        
        if (state===true) {
            var pt2;
            [state,i,pt2,list_pt]=parser_token_谓语(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt2=new NetP("谓语").con(0,pt2);
            }
            if (state===true) {
                pt2.con(pt1,0);
            } else {
                pt2=pt1;
            }
            if (state===true) {
                var i3=i;
                var state3=true;
                var list_new3=[...list_new];
                // list_new=[];
                var pt3;
                [state,i,pt3,list_pt]=parser_token_宾语句子(code,i);
                list_new=list_new.concat(list_pt);
                if (state===true) {
                    pt3=new NetP("宾语").con(0,pt3);
                }
                if (state===true) {
                    pt3.con(pt2,0);
                } else {
                    pt3=pt2;
                }
                if (state===false) {
                    i=i3;
                    list_new=[...list_new3];
                    state=true;
                    state3=false;
                
                    pt3=pt2;
                }
                
                if (state===true) {
                    var i4=i;
                    var state4=true;
                    var list_new4=[...list_new];
                    // list_new=[];
                    var pt4;
                    [state,i,pt4,list_pt]=parser_token_后缀(code,i);
                    list_new=list_new.concat(list_pt);
                    if (state===true) {
                        pt4=new NetP("后缀").con(0,pt4);
                    }
                    if (state===true) {
                        pt4.con(pt3,0);
                    } else {
                        pt4=pt3;
                    }
                    if (state===false) {
                        i=i4;
                        list_new=[...list_new4];
                        state=true;
                        state4=false;
                    
                        pt4=pt3;
                    }
                    
                    if (state4===true) {
                        list_new.push(pt4);
                    }
                }
                //if state3==False:
                //    try:
                //        pt3=pt4
                //    except:
                //        pt3=None
                if (state3===true) {
                    list_new.push(pt3);
                }
            }
            if (state===true) {
                list_new.push(pt2);
            }
        }
        //if state1==False:
        //    try:
        //        pt1=pt2
        //    except:
        //        pt1=None
        if (state1===true) {
            list_new.push(pt1);
        }
    }
    //if state0==False:
    //    try:
    //        pt0=pt1
    //    except:
    //        pt0=None
    if (state0===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt2;
    }
    
    

    if (state===false) {
//        print("普通句:",state);
        return [false,i0,''];
    }
    else {
//        print("普通句:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_句子(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_被动句(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt_out=pt0;
    }
    
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_把字句(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_普通句(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    if (state===false) {
        i=i0;
        list_new=[...list_new0];
    
        var pt0;
        [state,i,pt0,list_pt]=parser_token_普通句2(code,i);
        list_new=list_new.concat(list_pt);
        if (state===true) {
            pt_out=pt0;
        }
    }
    

    if (state===false) {
//        print("句子:",state);
        return [false,i0,''];
    }
    else {
//        print("句子:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_段落(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_句子(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("句子").con(0,pt0);
    }
    if (state===true) {
        var i1=i;
        var state1=true;
        var list_new1=[...list_new];
        // list_new=[];
        [state,i,text]=word_pat_token(code,i,'\. ');
        if (state===true) {
            var pt1;
            [state,i,pt1,list_pt]=parser_token_段落(code,i);
            list_new=list_new.concat(list_pt);
            if (state===true) {
                pt1.con(pt0,0);
            } else {
                pt1=pt0;
            }
        }
        
        if (state===false) {
            i=i1;
            list_new=[...list_new1];
            state=true;
            state1=false;
        }
        
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("段落:",state);
        return [false,i0,''];
    }
    else {
//        print("段落:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}

function parser_token_文章(code,i) {
    var i0=i;
    var state, text, list_pt,pt_out;
    var list_new=[];
    var list_new0=[...list_new];

    var pt0;
    [state,i,pt0,list_pt]=parser_token_段落(code,i);
    list_new=list_new.concat(list_pt);
    if (state===true) {
        pt0=new NetP("^起点").con(0,pt0);
    }
    if (state===true) {
        list_new.push(pt0);
    }
    if (state===true) {
        pt_out=pt0;
    }
    
    

    if (state===false) {
//        print("文章:",state);
        return [false,i0,''];
    }
    else {
//        print("文章:",state,pt_out.info());
        return [true,i,pt_out,list_new];
    }
}




function parser_text2pts(code) {
    var list_pt0=[],list_pt=[];
    var state,i,pt;
    [state,i,pt,list_pt0]=parser_token_文章(code,0);

    for (var j in list_pt0) {
        pt=list_pt0[j];
        if (pt!='') {
            list_pt.push(pt);
            if (!list_pt0.includes(pt.m_db[0])) {
                pt.con("",0);
            }
            if (!list_pt0.includes(pt.m_db[1])) {
                pt.con(0,"");
            }
        }
    }

    return list_pt;
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




/*
+[J函数](,临时文本)
*/

var dict_动词=['替换', '相同', '合并', '积分', '分给', '垂直', '相切', '分到', '提取', '思考', '减去', '化简', '叫做', '描述', '显示', '加上', '背向', '清空', '封印', '除以', '截取', '增加', '运行', '挑衅', '有', '乘以', '微分', '在', '旋转', '是', '添加', '观察', '打开', '实行', '解析', '朝向', '相距', '偏转', '标记', '做', '偏微分', '画出', '为', '记作', '使用', '追逐', '复制', '历遍', '保存', '优化', '指代', '奔跑', '跑', '执行', '更新', '运动', '移动', '构成', '平移', '固定', '击败', '捕捉', '关闭', '修改', '反射', '相交', '离开', '存在', '组成', '伸出', '拍摄', '引用', '导出', '进入', '对齐', '吃', '交换', '获取', '结束', '到', '到达', '设置', '连接', '分析', '求解', '放映', '查看', '挖掉', '代入', '置顶', '挖', '距离', '围绕', '平行', '玩耍', '穿过', '调换', '计算', '出现', '定义', '经过', '转换', '接触', '看', '裁剪', '整理', '输入', '召唤', '准备', '记住', '回忆'];

var dict_名词=['采样点', '长方形', '光强', '成像示意图', '屏幕', '场强', '变量', '光束传播图', '波包', 'Javascript', '线段', '透镜组', '红外线', '光标', 'X坐标', '发射角分布', '参数', '波长', '衍射环', '圆形', '范围', '区域', '坐标', 'Z方向', '标记区域', '光谱', '顺序', '来源', '球体', '网格', '二维函数', '能谱', '物', '平面', 'Y坐标', '方向', '和式', '截面分布', '距离', '反演', '长度', 'IP图像', 'Y方向', '光栅压缩器', '参考面', '立方体', '相位', '位置', '可见光', '三维箭头', '程序流程图', '多边形', 'FROG', '像', '相机', '类', '函数', '像距', '圆柱体', '波前', 'X方向', '倍率', '标记点'];

var dict_形容词=['美丽', '聪明', '全部', '善良', '所有', '正义', '什么样', '天真', '那个', '勇敢', '单纯', '什么', '哪些'];

var dict_数量词=['颗', '号', '只', '辆', '个'];

var dict_副词=['中', '不', '同时', '分别', '下面', '依次', '也', '可以', '都', '上面', '就', '里', '平均', '一下', '重新'];

var dict_介词=['以', '由', '从', '按照', '于', '对', '沿', '有', '存在', '绕', '按', '在', '根据'];

var dict_代词=[];

var dict_连词=['并且', '或', '和', '或者'];

var dict_助词=['了', '被', '把', '着', '将', '的'];

/*
+[J函数](,默认定义)
记住"Python"
print(dict_副词)
range
*/

function word_in_dict(code,words) {
    var n=Math.min(20,code.length);
    for (var i=0;i<n;i++) {
        if (words.includes(code.slice(0,n-i))) {
            return n-i;
        }
    }
    return 0;
}

function parser_token_助词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_助词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("助词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}


function parser_token_连词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_连词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("连词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}


function parser_token_介词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_介词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("介词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}


function parser_token_数量词(code,i) {
    var i0=i, list_pt=[], pt, pt0;
    var n_type=0;
    var text=code.slice(i);
    if (text.length>0 && text[0]=='第') {
        i+=1;
        n_type=1;
        text=text.slice(1);
    }
    var result=text.match('^[\d一二两三四五六七八九十百千万亿兆]+|几|多少');
    if (result===null) {
        return [false,i0,'',list_pt];
    }
    result=result.group();
    var 数目=new NetP(result);
    i+=result.length;
    var n=word_in_dict(code.slice(i),dict_数量词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("数量词").con(数目,pt);
        if (n_type==1) {
            pt0.m_text="第";
        }
        list_pt.push(pt);
        list_pt.push(pt0);
        list_pt.push(数目);
        return [true,i,pt0,list_pt];
    }
    return [false,i0,'',list_pt];
}


function parser_token_副词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_副词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("副词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}

function parser_token_代词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_代词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("代词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}


function parser_token_形容词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_形容词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("形容词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}

function parser_token_动词(code,i) {
    var list_pt=[], pt, pt0;
    var n=word_in_dict(code.slice(i),dict_动词);
    if (n!=0) {
        pt=new NetP(code.slice(i,i+n));
        i=i+n;
        pt0=new NetP("动词").con(0,pt);
        list_pt.push(pt);
        list_pt.push(pt0);
        return [true,i,pt0,list_pt];
    }
    return [false,i,'',list_pt];
}


function parser_token_名词(code,i) {
    var list_pt=[];
    var text,pt
    text,pt=fun_名词(code.slice(i));
    if (pt=='') {
        return [false,i,'',list_pt];
    }
    list_pt.push(pt);
    list_pt.push(pt.m_db[1]);
    i+=pt.m_db[1].m_name.length;
    return [true,i,pt,list_pt];
}


/*
+[J函数](,默认定义)
*/

function fun_名词(code) {
    if (code.length==0) {
        return '','';
    }

    var n,i,pt,pt0;
    var name='';
    var type_char='';
    for (var i=0;i<code.length;i++) {
        n=word_in_dict(code.slice(i),dict_动词)+word_in_dict(code.slice(i),dict_助词)+word_in_dict(code.slice(i),dict_连词)+word_in_dict(code.slice(i),dict_介词)+word_in_dict(code.slice(i),dict_副词)+word_in_dict(code.slice(i),[', ','，']);
        if (n!=0) {
            if (i!=0) {
                name=code.slice(0,i);
                break;
            }
            else {
                n=word_in_dict(code.slice(i),dict_名词);
                if (n!=0) {
                    i=n;
                    name=code.slice(0,i);
                    break;
                }
                else {
                    return code,'';
                }
            }
        }
        if (code[i]==='\"' || code[i]==='\'' || code[i]==='(' || code[i]==='（' || code[i]==='“') {
            if (i==0) {
                name="临时文本";
            }
            else {
                name=code.slice(0,i);
            }
            type_char=code[i];
            break;
        }
    }
    if (name=='') {
        name=code;
    }
    code=code.slice(i);
    var text='';
    if (type_char=='(') {
        pat1='\([^)]+\)';
    }
    else if (type_char=='\'') {
        pat1="'[^']+'";
    }
    else if (type_char=='“') {
        pat1='“[^”]+”';
    }
    else if (type_char=='（') {
        pat1='（[^）]+）';
    }
    else {
        pat1='"[^"]+"';
    }
    var result=code.match(pat1);
    if (result!==null) {
        result=result[0];
        if (type_char=='\'' && name=='临时文本') {
            name=result.slice(1,result.length-1);
        }
        else {
            text=result.slice(1,result.length-1);
        }
        n=result.length;
        code=code.slice(n);
    }
    pt=new NetP(name,text);
    pt0=new NetP("名词").con(0,pt);
    return code,pt0;
}


/*
沿
测试(J函数):...
+[保存文本](,NL_parser)
+[新建阅读窗口](,测试)
*/