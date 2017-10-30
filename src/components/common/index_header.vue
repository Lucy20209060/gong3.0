<template>
	<div class="t-index-header">
			<t-header-top v-on:cartNumber="recievecartNum"></t-header-top>
			<div class="wrap-header-content">
				<div class="header-content">
					<div><router-link to="/"><img class="logo" src="/static/images/image.png" alt="安厨供应链" /></router-link></div>
					<div>
						<div class="search-area">
							<input type="text" 
								v-model="inputContent" 
								placeholder="输入商品/地区" 
								maxlength="15"
								@keydown.enter="search($event)" 
							/>
							<span class="iconfont icon-llhomesearch pointer" @click="search($event)"></span>
						</div>
						<div class="cart-area pointer">
							<router-link  :to="username? '/shopCart' : '/login' " @click.native="goShopCart()">
								<i 
									class="header-cart-num"
								>
									{{inputValue > 0 ? inputValue:carNum}}
								</i>

								<transition name="slide-tip">
					                <i 
										class="header-cart-num"
										v-if="animationShow"
									>
										{{inputValue > 0 ? inputValue:carNum}}
									</i>
					            </transition>



								<span class="iconfont icon-gouwuche"></span>
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<index-nav v-on:messages="recieveMessages"></index-nav>
	</div>
</template>

<script>
import tHeaderTop from '@/components/common/header_top'
import indexNav from '@/components/common/index_nav'
	export default {
  		name: 't-index-header',
		data(){
			return{
				username:this.$cookie.getCookie('a34ea2d96d4239d4d86803bb3cd99788'),
				inputContent:'',
				carNum:0,
				toClassifyInfo:'',
				 animationShow:false
			}
		},
		props: {
			inputValue: Number
		},
		components: {
			tHeaderTop,indexNav
		},
		created(){
			this.getCarNum();
		},
		methods:{
			goShopCart(){
				//购物车登录状态拦截标志，登录为0，未登录为1
				this.$store.state.shopcartShow = '/shopCart';
			},
			getCarNum(){
				const _this = this;
				$.ajax({
					type: "post",
					url: _this.$api.cart.cartnum,
					dataType: "json",
					success:function(res){
						if(res.data){
							_this.carNum = res.data;
						}else{
							_this.carNum = 0;
						}
					}
		      	});
			},
			// 购物车数量传递
			recievecartNum(value){
				// 详情页加入购物车 触发 添加动画
				const _this = this;
				_this.animationShow = false;
				setTimeout(function(){
					_this.animationShow = !_this.animationShow;
				},700);
			},

			recieveMessages(value){
				this.toClassifyInfo = value;
				if(this.toClassifyInfo.trim()){
					this.$emit('messages2', this.toClassifyInfo);
				}
				// console.log(value+'index-header')

			},
			search(e){
				dplus.track("搜索","搜索页面","搜索按钮");
				let keyValue = e.target.parentElement.childNodes[0].value
				if(keyValue != ''){
					this.$router.push({path:'/search?key=' + keyValue });
				}
				if(this.inputContent.trim()){
					this.$emit('message', this.inputContent);
				}
			}

		}
	}
</script>
<style scoped>

	/*动画*/
	.slide-tip-enter-active {
	  animation: moveball 1s;
	}

	@keyframes moveball {
	    0% {
	        transform: scale(2);
	        -o-transform: scale(2);
	        -ms-transform: scale(2);
	        -moz-transform: scale(2);
	        -webkit-transform: scale(2);

	    }
	    100% {
	        transform: scale(1);
	        -o-transform: scale(1);
	        -ms-transform: scale(1);
	        -moz-transform: scale(1);
	        -webkit-transform: scale(1);
	    }
	}





	.header-cart-num{
		width: 20px;
		height: 20px;
		border-radius: 10px;
		-moz-border-radius: 10px;
		-webkit-border-radius: 10px;
		background: #009e4d;
		position: absolute;
		text-align: center;
		line-height: 20px;
		top: 0;
		right: -6px;
		color: #fff;
		font-size: 14px;
	}
	.t-index-header{
		width: 100%;
		height: 100%;
		background: #fff;
	}
	.t-index-header .header-content{
		width: 1200px;
		margin: 0 auto;
		height: 110px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.t-index-header .header-content div:nth-child(2){
		display: flex;
		align-items: center;
	}
	
	.t-index-header .search-area{
		width: 400px;
		height: 40px;
		line-height: 43px;
		border-bottom: 1px solid #D1D1D1;
		display: flex;
		justify-content: space-between;
		color: #999;
	}
	.t-index-header .search-area input{
		width: 100%;
		height: 100%;
	}
	.t-index-header .icon-llhomesearch{
		width: 10%;
		text-align: center;
		font-size: 20px;
		color: #999;
	}
	.t-index-header .cart-area{
		width: 60px;
		position: relative;
		display: flex;
		justify-content: flex-end;
		padding-top: 6px;
	}
	.t-index-header .cart-area span{
		font-size: 26px;
		color: #999;
	}

	@media screen and (max-width: 1300px) {
		.t-index-header .header-content{
			width: 980px;
		}
	}
	
</style>