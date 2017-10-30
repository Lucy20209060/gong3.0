import babelpolyfill from "babel-polyfill"
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(babelpolyfill);
Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        loginMsg: {
          islogin:false
        },

        orderGoodsInfo:[],

        orderMsg:{
          orderNumber:null,
        },

        fileLoadNum:{           // 批量下单上传文件 成功失败文件数量
            failNum:0,
            successNum:0
        },
        previousPath:'',        //返回上一个页面
        shopcartShow:{},        //购物车拦截标志,未登录1，登录0
        nextMinePath:{},        //个人中心拦截标志
        nextNum:1,              //加入购物车拦截标志,未登录1， 登录0
        downPath: 1,            //下载图片拦截标志，未登录1，登录0
        pageNum:0,              //地域选择页中当前页标志
        pageCurrList:'',        //地域选择页中当前页面

        routerHistory:[],           // 记录路由

        /*
            订单列表页的信息
            当页面从订单详情页回到订单列表页时
            需要这些参数回到当时的情景
        */
        myIndentInfo:{

            indexNow: 0,            //切换tab时当前的index
            advanceShow: false,     // 高级搜索
            page:1,                 // 当前页

            // 订单状态需要的参数
            order_status:'',    
            return_status:'',

            // 下单时间
            add_time_begin:'',
            add_time_end:'',
            
            indentInfo: '',     //订单名称
            phoneInfo: '',      //手机号
            caseInfo: '',       //商品名称
        }
    },
    mutations: {
        // 修改上传文件 成功 失败 数量
        setFileLoad:(state,value) => {
            state.fileLoadNum.failNum       = value.failed;
            state.fileLoadNum.successNum    = value.success;
        },
        // 记录路由
        setRouter:(state,value) => {
            state.routerHistory.push(value);
        },
        // 记录 myIndent页面信息
        setMyIndentInfo:(state,value) => {
            state.myIndentInfo.indexNow         = value.indexNow;
            state.myIndentInfo.advanceShow      = value.advanceShow;
            state.myIndentInfo.order_status     = value.order_status;
            state.myIndentInfo.return_status    = value.return_status;
            state.myIndentInfo.add_time_begin   = value.add_time_begin;
            state.myIndentInfo.add_time_end     = value.add_time_end;
            state.myIndentInfo.indentInfo       = value.indentInfo;
            state.myIndentInfo.phoneInfo        = value.phoneInfo;
            state.myIndentInfo.caseInfo         = value.caseInfo;
            state.myIndentInfo.page             = value.page;
        }
    },
  getters: {
    // 设置cookie
    // SetCookie (name,value) {
    //   if(name == 'userId'){
    //     cookieOperate.setCookie('a34ea2d96d4239d4d86803bb3cd99788',value,'d1');
    //   }else if(name == 'userNumber'){
    //     cookieOperate.setCookie('8e3c824e1d6254b74a013799c1565538',value,'d1');
    //   }else if(name == 'verifyStatus'){
    //     cookieOperate.setCookie('b61a9d162ac1dfaa22d0f05bdc7f6299',value,'d1');
    //   }
      
    // },
    // // 删除cookie
    // RemoveCookie(name){
    //   cookieOperate.delCookie(name)
    // },
    // // 获取cookie 的值
    // GetCookie (state,name) {
    //   return  cookieOperate.getCookie(name);
    // }
  }
});
 export default store;
