<template>
	<div class="verify">

		<login-header>用户认证</login-header>

		<div class="verify-wrap">
			<div class="content">
				<p class="title">
					<img src="/static/images/proof.png">
				</p>

				<p>认证通过后，您将获得更多服务！</p>

				<ul>
					<li><img src="/static/images/verify_check.png" /></li>
					<li><p>等待审核</p></li>
					<li><p>我们将在24小时内完成审核（工作时间9:00-18:00内）</p></li>
					<li><router-link to="/" class="verify-btn">完成</router-link></li>
				</ul>

			</div>
		</div>

		<indexFooter></indexFooter>

	</div>
</template>
<script >

	import loginHeader from "@/components/common/login_header"
	import indexFooter from "@/components/common/index_footer"

	export default {
		name:'verify',
		data(){
			return {
                proofInfo:this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299')
            }
		},
		components:{
			loginHeader,indexFooter
		},
		created(){
			// 正在审核中 -1 才能进入该页面
			if(this.proofInfo != -1){
				this.$router.push('/');
			}
		}
	}

</script>

<style scoped>
	.verify{
		width:100%;
		height:100%
	}
	.verify-wrap{
		height:auto;
		width:100%;
		background:#F5F5F5;
		text-align:center;
		padding: 30px 0;
	}
	.content{
		width: 900px;
	    min-height: 100px;
	    overflow: hidden;
	    margin: 0 auto;
	    background: #fff;
	    text-align: center;
	    padding-bottom: 30px;
	}
	.title{
		padding: 40px 0 25px;
    	width: 100%;
	}
	.verify .content ul{
		width:400px;
		display:inline-block;
		padding:70px 250px;
		background:#fff;
		font-size: 16px;
	}
	.verify .content ul li:nth-child(1){
		height:100px;
		line-height:100px
	}
	.verify .content ul li:nth-child(2){
		margin-top:50px;
		color: #009e4d;
	}
	.verify .content ul li:nth-child(3){
		margin-top:14px;
		color: #999;
	}
	.verify .btn-verify{
		float:right;
		color:#009448!important
	}
	.verify .content ul li a{
		background: #009e4d;
		display: inline-block;
		width: 400px;
		height: 42px;
		border-radius: 4px;
		line-height: 42px;
		color: #fff;
		font-size: 20px;
		margin-top:36px;

	}
</style>