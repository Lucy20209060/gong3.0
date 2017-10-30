<template>
    <section class="index-footer">

        <div class="footerImg">
            <img src='/static/images/footer-img.png' />
        </div>

        <div class="footerLink">
            <dl class="index-footer-logo">
                <dd>{{contact.contactWay}}</dd>
                <dd>{{contact.contactTime}}</dd>
                <dt>
                    <p class="pointer" @click="service">
                        <i class="iconfont icon-xinxi"></i>
                        <span>联系在线客服</span>   
                    </p>
                </dt>
            </dl>

            <dl 
                class="index-footer-link" 
                v-for="(item,index) in footerLink" 
                key="index"
            >
                <dt>{{item.title}}</dt>
                <router-link 
                    tag="dd" 
                    v-for="(contents,index) in item.content" 
                    key="index" 
                    v-text="contents.subheading"
                    :to="contents.link"
                >
                </router-link>
            </dl>
        </div>

        <div class="footerInfo" v-text="footerInfo"></div>

    </section>
</template>

<script>
export default {
    name: 'index-footer',
    data () {
        return {
            footerInfo:'',
            contact:{
                contactWay:'0571-28270936',
                contactTime:'周一至周五：9:00-18:00',   
            },
            footerLink:[
                {
                    title:'品牌承诺',
                    content:[
                        {
                            subheading:'原产地直供',
                            link:'/help/origin'
                        },
                        {
                            subheading:'品质保证',
                            link:'/help/quality'
                        },
                        {
                            subheading:'闪电发货',
                            link:'/help/delivery'
                        },
                        {
                            subheading:'优质服务',
                            link:'/help/bestservice'
                        }
                    ]
                },
                {
                    title:'采购方须知',
                    content:[
                        {
                            subheading:'注册及认证',
                            link:'/help/registercertify'
                        },
                        {
                            subheading:'用户的权利和义务',
                            link:'/help/userrights'
                        },
                        {
                            subheading:'平台规则',
                            link:'/help/platformrules'
                        },
                        {
                            subheading:'服务条款',
                            link:'/help/termsofservice'
                        }
                    ]
                },
                {
                    title:'售后服务',
                    content:[
                        {
                            subheading:'服务承诺',
                            link:'/help/pledge'
                        },
                        {
                            subheading:'退货条款',
                            link:'/help/pledge'
                        },
                        {
                            subheading:'退换货流程',
                            link:'/help/returnprocess'
                        },
                        {
                            subheading:'发票制度',
                            link:'/help/invoice'
                        },
                        {
                            subheading:'常见问题',
                            link:'/help/problem'
                        }
                    ]
                },
                {
                    title:'关于我们',
                    content:[
                        {
                            subheading:'我们是谁',
                            link:'/help/weare'
                        },
                        {
                            subheading:'联系我们',
                            link:'/help/contactus'
                        }
                    ]
                }
            ],
            userInfo:{
                name:'未登录',
                address:'无',
                mobile:'无',
                orderNum:'无',
                orderSta:'无',
                orderTim:'无'
            }
        }
    },
    mounted(){
        let date = new Date,
            year = date.getFullYear(); 
        this.footerInfo = `©${year} 杭州安厨电子商务有限公司 版权所有 浙ICP备13026319号-1`;

        this.getUserInfo();
    },
    methods:{
        getUserInfo(){
            const _this  = this;
            // 获取用户信息
            $.ajax({
                type: "get",
                url: this.$api.service.getLastOrderByUser,
                dataType: "json",
                success:function(res){

                    if(res.data.mobile){

                        _this.userInfo.name = '供应链PC-登录';
                        _this.userInfo.mobile = res.data.mobile;
                        _this.userInfo.address = res.data.address;
                        _this.userInfo.orderNum = res.data.order_sn;
                        _this.userInfo.orderSta = _this.orderStatus(res.data.order_status);
                        _this.userInfo.orderTim = _this.orderTime(res.data.add_time);
                        
                    }else{

                        _this.userInfo.name = '供应链PC-未登录';
                        _this.userInfo.mobile = '无';
                        _this.userInfo.address = '无';
                        _this.userInfo.orderNum = '无';
                        _this.userInfo.orderSta = '无';
                        _this.userInfo.orderTim = '无';

                    }

                    // 11位随机数字 退出时 打开新窗口
                    const numSign = parseInt(Math.random()*(99999999999-10000000000))+10000000000;

                    // 初始化 个人信息 传递至客服窗口
                    try{ 
                        ysf.config({
                            uid:_this.userInfo.mobile > 0 ? _this.userInfo.mobile : numSign,
                            data:JSON.stringify([
                                {"key":"real_name", "value":_this.userInfo.name},
                                {"key":"mobile_phone", "value":_this.userInfo.mobile},
                                {"key":"email", "hidden":true},
                                {"index":2, "key":"account", "label":"默认地址","value":_this.userInfo.address},
                                {"index":5, "key":"account", "label":"最新订单", "value":_this.userInfo.orderNum},
                                {"index":6, "key":"account", "label":"(下单时间)", "value":_this.userInfo.orderTim},
                                {"index":7, "key":"account", "label":"(状态)", "value":_this.userInfo.orderSta}
                            ])
                        });
                        
                    }catch (e) { 
                        // console.log('catch')
                    } 

                }
            });
        },

        // 打开客服
        service(){
            ysf.open();
        },

        // 时间转换
        orderTime(value){
            const d = new Date();
            d.setTime(value*1000);
            return d.getFullYear()+"年"+(+d.getMonth()+1)+"月"+d.getDate()+"日"
        },
        
        // 订单状态
        orderStatus(value){
            switch(value){
                case '0': return '待付款';
                case '1': return '待发货';
                case '2': return '待收货';
                case '10': return '交易成功';
                default: return '交易关闭';
            }
        }
    }
}

</script>
<style scoped>
    .index-footer{
        font-size:14px;
        background:#fff;
        overflow: hidden;        
    }
    .footerImg{
        height: 44px;
        background:#fff;
        background-size: 50%;
        padding: 20px 0;
        text-align: center;
        width: 1200px;
        margin: 0 auto;
        border-bottom: 1px solid #efefef;
    }
    .footerImg img{
        display: inline-block;
        height: 100%;
        width: auto;

    }
    .footerLink{
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;
        padding: 30px 0;
    }
    .footerLink dl{
        width: 20%;
    }
    .index-footer-logo{
        float: left;
        padding-left: 60px;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -o-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;

    }
    .index-footer-logo dt{
        margin-top: 10px;
        color: #009e4d;
        text-align: center;
    }
    .index-footer-logo dt p{
        display: inline-block;
        border: 1px solid #009e4d;
        padding: 6px 10px;
    }
    .index-footer-logo dt p span{
        margin-left: 6px;
    }
    .index-footer-logo dd:nth-child(1){
        color: #8a8a8a;
        line-height: 30px;
        font-size: 24px;
    }
    .index-footer-logo dd:nth-child(2){
        color: #8a8a8a;
        font-size: 14px;
        margin: 2px 0 8px;
        text-indent: 13px;
    }
    .index-footer-link{
        float: left;
        padding-left: 100px;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -o-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;
    }
    .index-footer-link dt{
        line-height: 22px;
        font-weight: 900;
        font-size: 14px;
    }
    .index-footer-link dd{
        font-size: 12px;
        line-height: 26px;
        cursor: pointer;
    }
    .index-footer-link dd:hover{
        color: #009e4d;
    }
    .footerInfo{
        text-align:center;
        border-top: 1px solid #efefef;
        clear: both;
        line-height: 60px;
    }
</style>