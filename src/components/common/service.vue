<template>
	<div class="service-wrap" @click="service">
		<img src="../../assets/images/info.png">
		<p>
			<span>在</span>
			<span>线</span>
			<span>客</span>
			<span>服</span>
		</p>
	</div>
</template>

<script>
export default {
	name: 'fixed_nav',
	data () {
		return {
			
		}
	},
	props: {
		page:{
			type:String,
			default:'其他页面'
		},
		goodsInfo:{
			type:Object,
			default: function () {
		        return {}
		    }
		},
		orderInfo:{
			type:Object,
			default: function () {
		        return {}
		    }
		}
	},
	mounted(){
		// console.log(this.page)

	},
	methods:{
		service(){
			const _this = this;

	  		var Href;
			if(!window.location.origin){
			    Href =  window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}else{
			    Href = window.location.origin;
			}
			Href = process.env.NODE_ENV === 'development' ? 'http://dev.anchumall.cc:9546' : Href;

			// 商品详情页
			if(this.goodsInfo.goods){
				const imgUrl = Href + _this.goodsInfo.goods.original_img;
				ysf.product({
	                show : 0,											// 1 访客可见自动发送的信息
	                title : _this.goodsInfo.goods.goods_name,
	                desc : _this.goodsInfo.goods.goods_remark,
	                picture : imgUrl,
	                note : '点击查看该商品',
	                url : 'https://b2b.hzanchu.com/goodsDetails?id=' + _this.goodsInfo.goods.goods_id
	            })
			}

			// 订单详情
			if(this.orderInfo.order_sn){
				const imgUrl = Href + this.orderInfo.goods_list[0].image.image_url;
		  		ysf.product({
		            show : 0,											// 1 访客可见自动发送的信息
		            title : '订单号：' + _this.orderInfo.order_sn,
		            desc : '合计：￥' + _this.orderInfo.total_amount,
		            picture : imgUrl,
		            note : _this.orderInfo.status_name,
		            url : 'http://b2bapi.anchumall.cc/index.php/Admin/Index/index.html?id=' + _this.orderInfo.order_sn 
		        })
			}

	        ysf.open();
		}
	}
}
</script>

<style scoped>
	.service-wrap{
		width: 46px;
		height: 120px;
		background: #eee;
		position: fixed;
		top: 50%;
		right: 0;
		z-index: 99999;
		text-align: center;
		cursor: pointer;
	}
	.service-wrap img{
		display: inline-block;
		padding: 9px 0 8px;
	}
	.service-wrap p{
		width: 100%;
		overflow: hidden;
	}
	.service-wrap p span{
		float: left;
		text-align: center;
		width: 100%;
		line-height: 1;
		color: #666;
	}
</style>