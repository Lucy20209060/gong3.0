<template>
	<div class="payway-weixin">
		<mineHeader></mineHeader>
		<div class="paymentcenter">
			<indentStatus v-if=" account == '' ">
				<span slot="indentName">微信支付</span>
			</indentStatus>
			<div 
				class="payway-area"
				:class="[
					account == ''?'':'payway-area-account'
				]"
			>
				<div class="indentinfo">
					<h4 v-if=" account == '' ">请及时付款！交易单号：{{order_sn}}</h4>
					<p class="paytotast">
						<i class="iconfont icon-tishi1"></i>
						请您在提交订单成功后24小时内完成支付，否则订单将被自动取消
					</p>
				</div>
				<div class="weixinsaoyisao">
					<ul  class="pay-detail">
						<li>
							<img src="/static/images/wechat2.png" />
						</li>
						<li style="border-bottom: 2px solid #D5D5D5;height: 70px;">
							应付金额：￥<span style="font-size: 36px;color: #666666">{{paid_money}}</span>
						</li>
						<li >
							<a href="javascript:;" @click="goMoney()"><div class="paid_money"><返回支付方式页面</div></a>
						</li>
					</ul>
					<div>
						<div class="erweima">
							<img v-lazy="imgerweima" />
						</div>
						<img src="/static/images/saoyisaotishi.png">
					</div>
					<img src="/static/images/saoyisao.png" class="phone" />
				</div>
			</div>
		</div>
		<index-footer></index-footer>
	</div>
</template>

<script>
	import mineHeader from '@/components/common/mine_header'
	import IndexFooter from '@/components/common/index_footer'
	import indentStatus from '@/components/common/indentStatus'
	export default {
		name: 'payment',
		data () {
			return {
				order_sn:'',
				paid_money:'',
				pay_remain_time:''*1,
				tradeSn:this.$route.query.trade_sn,
				orderId:this.$route.query.order_id || '',
				zhifubaochecked:false,
				weixinchecked:false,
				yinlianchecked:false,
				imgerweima:'',
				order_id: '',			 //订单id

				account:this.$route.query.account || '', 		// 余额 微信支付 总额
				userId: this.$cookie.getCookie('a34ea2d96d4239d4d86803bb3cd99788') || '',

				TSigin:'', // 余额 检测状态定时器
			}
		},
		components:{
			mineHeader,
			IndexFooter,
			indentStatus
		},
		beforeCreate(){
			// 如果有payment页面标志 才能进入paywayWeixin页面 否则进入 我的订单 页面 

			let proof  = this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');

	        if(proof == 1 ){

	        }else if(proof == -1){            // 审核中

	        	this.$anchu_message.warn('认证状态中，暂无权限访问该页面');
	        	this.$router.push('/');

	        }else if(proof == -2 || proof == -3 ){     // 审核没通过 未查询到数据

	        	this.$anchu_message.error('认证失败，请重新进行审核');
	            this.$router.push('/proof');

	        }else if(proof == -4 ){     // 未提交认证

	        	this.$anchu_message.warn('未提交认证，请先认证');
	            this.$router.push('/proof');
	        }else{
	        	this.$router.push('/login');
	        }

		    // if(this.$cookie.getCookie('path3Sign')){
	     //        return;
	     //    }else{
	     //    	this.$router.push('/mine/myIndent');
	     //    }


		},
		beforeMount(){
			if(this.account){
				this.paid_money = this.account;
				this.getBalanceErweima();
			}else{
				this.getOrderMsg(this.tradeSn,this.orderId)
				this.getWeixinErweima();
			}
		},
		destroyed(){
			clearInterval(this.TSigin);
		},
		filters:{
			timeStamp(second_time) {
				let time = parseInt(second_time) + "秒";
				if (parseInt(second_time) > 60) {
					let second = parseInt(second_time) % 60;
					let min = parseInt(second_time / 60);
					time = min + "分" + second + "秒";
					if (min > 60) {
						min = parseInt(second_time / 60) % 60;
						let hour = parseInt(parseInt(second_time / 60) / 60);
						time = hour + "小时" + min + "分" + second + "秒";
						if (hour > 24) {
							hour = parseInt(parseInt(second_time / 60) / 60) % 24;
							let day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
							time = day + "天" + hour + "小时" + min + "分" + second + "秒";
						}
					}
				}
				return time;
			},
		},

		methods:{
			getOrderMsg(trade_sn,order_id){
				let _this = this;
				$.ajax({
					url: this.$api.order.detail,
					data:{
						trade_sn:trade_sn,
						order_id: order_id || ''
					},
					dataType: "json",
					type: 'get',
					success: function (res) {
						_this.order_sn = res.data.trade_sn;
						_this.orderId = res.data.order_id;
						_this.paid_money = res.data.total_amount;
						_this.time(res.data.pay_remain_time);
						_this.checkpay();
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			time(o) {
				let _this = this;
				let second_time = parseInt(o);
				let T ;
				if (second_time <= 0) {
					clearTimeout(T);
					_this.$router.push("/mine/orderDetail?id="+_this.order_id)
				} else {
					second_time --;
					_this.pay_remain_time = second_time;
					T = setTimeout(function () {
						_this.time(second_time)
					},1000)
				}
			},

			checkpay() {
				let _this = this;
				$.ajax({
					url: this.$api.order.info,
					data:{
						trade_sn:_this.tradeSn
					},
					dataType: "json",
					type: 'get',
					success: function (res) {
						let T ;
						if (res.data.status == 0) {
							T = setTimeout(function () {
								_this.checkpay()
							},1000)

							// 组件卸载后 清除定时器 防止在进入其他页面后 仍在执行
							if (_this && _this._isDestroyed){
								clearInterval(T);
							}

						}else{
							clearTimeout(T);
							if(res.data.isBatch == 0){
								_this.order_id = res.data.order_id;
								_this.$router.push("/mine/orderDetail?id="+_this.orderId)
							}else{
								_this.$router.push("/mine/myIndent")
							}
						}
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			// 订单微信支付
			getWeixinErweima(){
				let _this = this;
				$.ajax({
					url: this.$api.payment.wxqrcode,
					data:{
						trade_sn:_this.tradeSn
					},
					dataType: "json",
					type: 'get',
					success: function (res) {
						_this.imgerweima = res.data;
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			// 余额微信支付
			getBalanceErweima(){
				
	            const _this = this;
				$.ajax({
					url: this.$api.payment.payRecharge,
					data:{
						account:this.paid_money,
						pay_code:'weixin',
						user_id:this.userId
					},
					dataType: "json",
					type: 'post',
					success: function (res) {
						_this.imgerweima = res.data;
						_this.checkRechargeLast();
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			// 检测余额支付状态
			checkRechargeLast(){
				const _this = this;
				$.ajax({
					url: this.$api.payment.checkRechargeLast,
					dataType: "json",
					type: 'post',
					success: function (res) {
						console.log(res)

						if(res.error == 0){
							clearInterval(_this.TSigin);
							_this.$router.push('/recharge');
							return false;
						}

						_this.TSigin = setTimeout(function () {
							_this.checkRechargeLast();
						},1000)


					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			goMoney() {

				if(this.account){
					this.$router.push({
				    	path:'/recharge',
				    	query:{
				    		account:this.account
				    	}
					});
					return false;
				}

		  		// 进入付款页标志
		  		this.$cookie.setCookie('path2Sign','true','s10');

			    this.$router.push({
			    	path:'/payment',
			    	query:{
			    		trade_sn: this.tradeSn,
			    		order_id:this.orderId
			    	}
				});
		  	}
		}
	}

</script>

<style scoped>
	.payway-area-account{
		margin-top: 30px;
	}
	.payway-weixin{
		width: 100%;
		min-width: 1210px;
		background: #f5f5f5;
		/*padding: 20px 0 380px 0;*/
	}
	.payway-weixin .paymentcenter{
		padding: 0 0 30px 0;
		width: 1200px;
		margin: 0 auto;
	}
	.payway-weixin .title{
		margin-bottom: 13px;
	}
	.payway-weixin .paid_money{
		color:#E64346;
	}
	.payway-weixin .ordermsg{
		display: flex;
		justify-content: space-between;
		margin-bottom: 13px;
	}
	.payway-weixin .payway-area{
		background:#fff;
		/*border:1px solid #BDBDBD;*/
		/*width: 100%;*/
		height: auto;
		padding: 0 24px;
	}
	.payway-weixin .pay-detail{
		width: 250px;
		height: 250px;
		margin-right: 80px;
		/*text-align: center;*/
	}
	.payway-weixin .pay-detail li{
		height: 60px;
		line-height: 60px;
		font-size: 14px;
	}
	.payway-weixin .time{
		color: #E64346;
	}
	.payway-weixin .weixinsaoyisao{
		padding: 56px 0 125px 0; 
		border-top: 1px solid #ebebeb;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.payway-weixin .erweima{
		border:1px solid #D9D9D9;
		width: 214px;
		height: 214px;
		padding: 10px;
		margin: 0 10px 10px 0;
	}
	.payway-weixin .erweima img{
		height: 100%;
		width: 100%;
	}
	.payway-weixin .phone{
		margin-top:22px;
	}
	.indentinfo {
		padding-top: 30px;
	}
	.indentinfo h4 {
		font-size: 16px;
		color: #333;
		font-weight: 900;
	}
	.indentinfo p {
		font-size: 14px;
		color: #999;
		margin: 20px 0 36px 0;
	}
	.indentinfo p i {
		font-size: 12px;
		background: #fff;
		color: #ffcd35;
	}
</style>
