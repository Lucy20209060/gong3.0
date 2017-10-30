<template>
	<div class="t-header-top">
		<div class="header-top">
			<div>欢迎来到安厨供应链！</div>
			<div>
				<router-link v-if="loginstatus"  to="/mine/myIndent">{{username}}</router-link>
				<span v-if="loginstatus" class="pointer" @click="tosignout">退出登录</span>
				<router-link v-if="!loginstatus" to="/login" @click.native="preLogin()">[请登录]</router-link>
				<router-link v-if="!loginstatus" to="/register">[免费注册]</router-link>
				<span class="iconfont icon-shuxian"></span>
				<router-link to="/mine/myIndent" @click.native="nextMine()">个人中心</router-link>
				<!-- <span @click="goMine" class="pointer">个人中心</span>  -->
				<span class="iconfont icon-shuxian"></span>
				<router-link tag="span" to="/mine/myIndent" class="pointer" @click.native="nextMine()">我的订单</router-link>
				
				<!-- <span @click="goMine" class="pointer">我的订单</span>  -->
				<span class="iconfont icon-shuxian"></span>

				<!-- <span class="pointer">帮助</span> -->
				<router-link class="pointer" tag="span" to="/help/origin">帮助</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 't-header-top',
		data(){
			return {
				username:this.$cookie.getCookie('8e3c824e1d6254b74a013799c1565538'),
				loginstatus:false,
				nowPath:''
			}
		},
		mounted(){
			//保存当前页面的路由
			let nowHash = this.$route.fullPath;
			this.nowPath = nowHash;

			if(this.username){
				this.loginstatus = true;
			}else{
				this.loginstatus = false;
			}
		},
		methods:{
			preLogin() {
			    this.$store.state.previousPath = this.nowPath;   
			},
			nextMine() {
				this.$store.state.nextMinePath = '/mine/myIndent'
			},
			tosignout() {
				let _this = this;
				$.ajax({
					url: _this.$api.user.logout,
					dataType: "json",
					type: 'post',
					success: function (res) {
						if (res.code == 1){
							// 删除userId
                            _this.$cookie.delCookie('a34ea2d96d4239d4d86803bb3cd99788');
                            // 删除电话号码
                            _this.$cookie.delCookie('8e3c824e1d6254b74a013799c1565538');
                            // 删除认证状态
                            _this.$cookie.delCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');
                            // 删除PHPSESSID
                            _this.$cookie.delCookie('PHPSESSID');

                            _this.username= null;
							_this.loginstatus = false;

							_this.$store.state.nextNum = 1;

							_this.$router.go(0);
							
						}else{
							_this.$anchu_message.info(res.error_msg);
						}
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			}
			 
		}
	}
</script>

<style scoped>
	.t-header-top{
		width: 100%;
		background: #F8F8F8;
	}
	.t-header-top .header-top{
		font-size: 14px;
		width: 1200px;
		margin: 0 auto;
		height: 28px;
		line-height: 28px;
		display: flex;
		justify-content: space-between;
	}
</style>