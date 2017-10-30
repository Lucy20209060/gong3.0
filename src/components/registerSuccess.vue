<template>
  <div class="registerSuccess">
    <loginHeader>注册成功</loginHeader>
    <div class="register-content">
        <div class="register-wrap">
            <p class="register-img"><img src="/static/images/registerSuccess.png" /></p>
            <p class="register-title">注册成功</p>
            <p class="register-text">您已成为安厨供应链的用户，如果想独享低价，请完成认证呦！</p>
            <p class="register-btn">
                <router-link tag="button" to="/proof" class="go-certification">去认证</router-link>
                <router-link tag="button" to="/" class="go-home">去首页</router-link>
            </p>
        </div>
    </div>

    <index-footer></index-footer>

</div>
</template>

<script>
    import loginHeader from "@/components/common/login_header"
    import IndexFooter from "@/components/common/index_footer"
    export default {
        name: 'registerSuccess',
        data () {
        return {
            

        }
    },
    components:{
        loginHeader,IndexFooter
    },
    mounted(){
        //添加页面的认证和审核的校验

    },

    methods: {

    }
}

</script>

<style scoped>
    .registerSuccess{
        width:100%;
        height:100%;
    }
    .register-content{
        width:100%;
        background: #f2f2f2; 
        padding:30px 0 30px 0;
    }
    .register-wrap{
        width:1200px;
        padding:0 0 40px 0;
        margin:0 auto;
        min-height:550px; 
        background: #fff;
        text-align: center;
    }
    .register-img{
        padding-top: 88px;
    }
    .register-title{
        margin-top: 20px;
        font-size: 22px;
        color: #333;
    }
    .register-text{
        margin: 54px 0 44px 0;
        font-size: 16px;
        color: #666;
    }
    .register-btn .go-certification{
        width: 100px;
        height: 30px;
        line-height: 26px;
        background: #009e4d;
        color: #fff;
        border-radius: 3px;
    }
    .register-btn .go-home{
        width: 100px;
        height: 30px;
        line-height: 26px;
        color: #333;
        border:1px solid #f3f3f3;
        margin-left: 55px;
        border-radius: 3px;
    }
    .register-btn button{
        font-size: 16px
    }
</style>