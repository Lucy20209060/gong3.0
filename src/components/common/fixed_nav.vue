<template>
	<div class="fixed_nav" v-if="scrolled > 550">

		<router-link tag="p" :to="loginstatus? '/shopCart' : '/login' " @click.native="goShopCart()">
			<img src="../../assets/images/cart.png">
		</router-link>

		<p  @click="goTop">
			<img src="../../assets/images/top2.png">
		</p>

	</div>
</template>

<script>
export default {
	name: 'fixed_nav',
	data () {
		return {
			carNum:0,
			loginstatus:this.$cookie.getCookie('8e3c824e1d6254b74a013799c1565538'),
			scrolled:0
		}
	},
	created(){
		window.addEventListener('scroll', this.handleScroll);
	},
	methods:{
		goShopCart(){
			//购物车登录状态拦截标志，登录为0，未登录为1
			this.$store.state.shopcartShow = '/shopCart';
		},
	  	goTop(){
	  		//主页 回到顶部
		    $('body,html').animate({scrollTop:0},1000);
	  	},
	  	handleScroll(){
	      this.scrolled = document.documentElement.scrollTop || 
	      				window.pageYOffset || 
	      				document.body.scrollTop;
	    }
	}
}
</script>

<style scoped>
	.fixed_nav{
		position: fixed;
		top: 75%;
		right: 0;
		z-index: 99999;
		width: 46px;
		height: auto;
		background: #fff;
	}
	.fixed_nav p{
		background: #eee;
		width: 46px;
		height: 46px;
		padding-top: 14px;
		-moz-box-sizing: border-box;
	    -webkit-box-sizing: border-box;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box; 
		border-radius: 50%;
		text-align: center;
		cursor: pointer;
	}
	.fixed_nav p:first-child{
		margin-bottom: 8px;
	}
	.fixed_nav p img{
	}

</style>