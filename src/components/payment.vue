<template>
	<div class="payment">

		<mineHeader></mineHeader>

		<div class="paymentcenter">

			<indentStatus>
		  		<span slot="indentName">支付订单</span>
		  	</indentStatus>

			<div class="payway-area">
				<div class="paywaytop">
					<div class="indentinfo">
						<h4>提交订单成功，请立即完成支付！</h4>
						<p class="paytotast">
							<i class="iconfont icon-tishi1"></i>
							请您在提交订单成功后24小时内完成支付，否则订单将被自动取消
						</p>
					</div>

					<div class="indentinfo indentinfo2"><h4>选择支付方式</h4></div>
					<ul class="payway">
						<li v-for="(item,index) in payWays" key="index">
							<input 
								type="radio" 
								:id="item.name"  
								name="payment" 
								v-on:click="choicePayway(item.name)" 
							/>
							<label 
								:for="item.name" 
								:class="[
									payWay==item.name?'redlabel':''
								]"
							>
								<img :src="item.img" />
							</label>
						</li>
					</ul>
				
					<transition name="fade">
						<div class="indentinfo" v-if="balanceSign">
							<h4>余额支付</h4>
							<div class="balance-wrap">
								<div class="balance-left">
									<span>账户余额：</span>
									<i>{{available_balance}}</i>
								</div>

								<!-- 余额不足 显示充值入口 -->
								<div class="balance-center" v-if="available_balance < paid_money">
									<span>余额不足，请</span>
									<a href="/recharge">点击充值</a>
								</div>
								<div class="balance-rigth">
									<span>支付：</span>
									<i>{{paid_money}}</i>
								</div>
							</div>
							<!-- 余额不足将隐藏发送验证码 -->
							<h5>验证手机号</h5>
							<div 
								class="code-wrap"
								:class="[
									codeInputSign ? 'inputActive' : ''
								]"
							>
								<span>
									<em>
										<input 
											type="tel" 
											v-model="codeNum0" 
											ref="codeNum0" 
											maxlength="1"
											@focus="codeNumFocus(0)"
											@keydown.8="deleteCode($event,0)"
										/>
									</em>
									<em>
										<input 
											type="tel" 
											v-model="codeNum1" 
											ref="codeNum1" 
											maxlength="1"
											@focus="codeNumFocus(1)"
											@keydown.8="deleteCode($event,1)"
										/>
									</em>
									<em>
										<input 
											type="tel" 
											v-model="codeNum2" 
											ref="codeNum2" 
											maxlength="1"
											@focus="codeNumFocus(2)"
											@keydown.8="deleteCode($event,2)"
										/>
									</em>
									<em>
										<input 
											type="tel" 
											v-model="codeNum3" 
											ref="codeNum3" 
											maxlength="1"
											@focus="codeNumFocus(3)"
											@keydown.8="deleteCode($event,3)"
										/>
									</em>
								</span>
								<i v-text="sendText" @click="sendCode"></i>
							</div>
						</div>
					</transition>

				</div>

				<div v-model="paid_money" class="totalprice">应付金额：<span class="totalmoney">￥{{paid_money}}</span></div>

				<div class="paybtnarea">
					<input 
						type="button" 
						class="pay-submit"
						value="立即支付" 
						@click="paySubmit"/>
				</div>

				<el-dialog 
					v-model="dialogVisible" 
					size="tiny" 
					:close-on-click-modal='false' 
					:close-on-press-escape='false' 
					:show-close="false"
				>
					<div class="img-wrap">
						<img src="data:image/png;base64,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" />
					</div>
					<div class="checkbtnarea">
						<p>请尽快支付完成，否则订单会被取消！</p>
						<p class="checkbtnarea-p">如有疑问，请联系客服0571-28270936</p>
						<router-link to="/mine/myIndent">
							支付完成
						</router-link>
						<a href="javascript:;" v-on:click="dialogVisible = false" class="btn-repay">重新支付</a>
					</div>
				</el-dialog>
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
				orderNumber:this.$route.query.trade_sn,
				order_id:this.$route.query.order_id || '',
				imgerweima:'',
				dialogVisible:false,
				trade_sn:'',

				mobile: this.$cookie.getCookie('8e3c824e1d6254b74a013799c1565538') || '',

				payWays:[
					{
						name:'alipay',
						img:'/static/images/payment-alipay.png'
					},
					{
						name:'weixin',
						img:'/static/images/payment-weixin.png'
					},
					{
						name:'allinpay',
						img:'/static/images/payment-allinpay.png'
					},
					{
						name:'balance',
						img:'/static/images/payment-balance.png'
					}
				],
				payWay:'',
				balanceSign:false,							// 余额展开下面的操作
				available_balance:'0.00',					// 余额

				codeNum0:'',								// 四位验证码
				codeNum1:'',
				codeNum2:'',
				codeNum3:'',

				sendText:'发送验证码',
				codeInputSign:false,						// 验证码输入框高亮标志
				wait:60,									// 验证码倒计时
			}
		},
		computed: {
            code() {
                return this.codeNum0 + this.codeNum1 + this.codeNum2 + this.codeNum3
            }
        },
		watch:{
			codeNum0(a,b){
				// 只允许输入数字
				if(!(a >=0)){
					this.codeNum0 = '';
					return false;
				}
				if(a != '' && this.codeNum1 ==''){
					this.$refs.codeNum1.focus();
				}
			},
			codeNum1(a,b){
				if(!(a >=0)){
					this.codeNum1 = '';
					return false;
				}
				if(a != '' && this.codeNum2 ==''){
					this.$refs.codeNum2.focus();
				}
			},
			codeNum2(a,b){
				if(!(a >=0)){
					this.codeNum2 = '';
					return false;
				}
				if(a != '' && this.codeNum3 ==''){
					this.$refs.codeNum3.focus();
				}
			},
			codeNum3(a,b){
				if(!(a >=0)){
					this.codeNum3 = '';
					return false;
				}
			}
		},
		components:{
			mineHeader,
			IndexFooter,
			indentStatus
		},
		beforeCreate(){
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


	        // jh电脑 该页面获取不到cookie 还未找到原因
	        // 如果有order页面标志 才能进入payment页面 否则进入 我的订单 页面 		    
	        // if(this.$cookie.getCookie('path2Sign')){
	        //     return;
	        // }else{
	        // 	this.$router.push('/mine/myIndent');
	        // }	

		},
		mounted(){
			const _this = this;

			this.getOrderMsg(this.orderNumber);
			// 监听鼠标按压事件
			document.onmouseup = function(e){
				if(document.activeElement.type == 'tel'){
					_this.codeInputSign = true;
				}else{
					_this.codeInputSign = false;
				}
			}
		},
		// 时间过滤器 天-时-分-秒
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
			codeNumFocus(index){
				if(this[`codeNum${index}`] != ''){
					return false;
				}
				if(this.codeNum0 == ''){213
					this.$refs.codeNum0.focus();
					return false;
				}
				if(this.codeNum1 == ''){
					this.$refs.codeNum1.focus();
					return false;
				}
				if(this.codeNum2 == ''){
					this.$refs.codeNum2.focus();
					return false;
				}
				if(this.codeNum3 == ''){
					this.$refs.codeNum3.focus();
					return false;
				}
			},
			// 获取账户余额信息
			getBalanceInfo(){
				const _this = this;
				$.ajax({
					type:"post",
					url:this.$api.recharge.info,
					dataType:"json",
					success:function(res){
						const data = res.data;

						// 余额 即可用余额
						_this.available_balance = data.available_balance;
					}
				});
			},

			// 获取验证码
	        sendCode(){

	            const _this = this;

	            $.ajax({
	                url:this.$api.register.send_validate_code,
	                data:{
	                    mobile:this.mobile,
	                    scene:2,
	                    type:'mobile'
	                },
	                dataType: "json",
	                type: 'post',
	                beforeSend:function () {
	                    if(_this.sendText != "发送验证码"){

	                        return false;
	                    }
	                },
	                success: function (res) {
	                    if (res.status == 1) {

	                       _this.$anchu_message.success(res.msg);
	                       _this.countDown();

	                    }else{
	                        _this.$anchu_message.error(res.msg);
	                    }
	                },
	                error:function (res) {
	                    _this.$anchu_message.error(res.msg);
	                }
	            })
	        },

	        //  验证码 余额 倒计时
	        countDown(){
	            const _this = this;

	            if (_this.wait <= 0) {

	                _this.sendText = "发送验证码";
	                _this.wait = 60;

	            } else {
	                _this.sendText = "请等待" + _this.wait + "s";
	                _this.wait--;

	                let timeOut = setTimeout(function () {

	                    _this.countDown();

	                    if(_this.wait <= 0){
	                        clearTimeout(timeOut); 
	                    }
	                },1000);
	            }
	        },

			// 删除验证码
			deleteCode(e,index){
				if(index == 0){
					return false;
				}
				// 删除后 让前一个聚焦
				if(this.$data['codeNum'+index] == ''){
					this.$refs['codeNum' + (index-1)].focus();
				}
			},

			//获取订单信息
			getOrderMsg(trade_sn){
				let _this = this;
				$.ajax({
					url: this.$api.order.detail,
					data:{
						trade_sn:trade_sn,
						id:_this.order_id
					},
					dataType: "json",
					type: 'get',
					success: function (res) {
						_this.order_sn = res.data.order_sn;
						_this.trade_sn = res.data.trade_sn;
						_this.order_id = res.data.order_id;
						_this.paid_money = res.data.total_amount;
						_this.time(res.data.pay_remain_time);
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			// 倒计时更新
			time(o) {
				let _this = this;
				let second_time = parseInt(o);

				let SecondTime = setInterval(function(){
					
					// 计时结束 清除定时器
					if (second_time <= 0) {
						clearTimeout(SecondTime);
						_this.$anchu_message.error('订单超时请重新下单');
						_this.$router.push("/mine/orderDetail?id="+_this.orderNumber)
					}

					second_time--;
					_this.pay_remain_time = second_time;

					// 组件卸载后 清除定时器 防止在进入其他页面后 仍在执行
					if (_this && _this._isDestroyed){
						clearTimeout(SecondTime);
					}

				},1000);
			},

			// 选择支付方式
			choicePayway(e){
				this.payWay = e;
				if(e == 'weixin'){
					const _this = this;
					$.ajax({
						url: _this.$api.payment.wxqrcode,
						data:{
							trade_sn:_this.orderNumber
						},
						dataType: "json",
						type: 'get',
						success: function (res) {
							// console.log(res);
							_this.imgerweima = res.data
						},
						error:function (res) {
							_this.$anchu_message.error('网络繁忙');
						}
					})

				}else if(e == 'balance'){
					this.balanceSign = true;
					// 获取账户余额信息
					this.getBalanceInfo();
					return false;
				}

				this.balanceSign = false;
			},

			// 支付宝 银联支付
			postWindow(url,name1,name2,value1,value2){

				//创建表单对象
				let _form = $("<form></form>",{
					'id':'tempForm',
					'method':'post',
					'action':url,
					'target':'_blank',
					'style':'display:none'
				}).appendTo($('body'));

				//将隐藏域加入表单
				_form.append($("<input>",{'type':'hidden','name':name1,'value':value1}));
				_form.append($("<input>",{'type':'hidden','name':name2,'value':value2}));

				//触发提交事件
				_form.trigger('submit');

				//表单删除
				_form.remove();
			},

			// // 余额支付
			// postWindow(url,val1,val2,val3,val4){

			// 	//创建表单对象
			// 	let _form = $("<form></form>",{
			// 		'id':'tempForm',
			// 		'method':'post',
			// 		'action':url,
			// 		'target':'_blank',
			// 		'style':'display:none'
			// 	}).appendTo($('body'));

			// 	//将隐藏域加入表单
			// 	_form.append($("<input>",{'type':'hidden','name':'code','value':val1}));
			// 	_form.append($("<input>",{'type':'hidden','name':'mobile','value':val2}));
			// 	_form.append($("<input>",{'type':'hidden','name':'trade_sn','value':val3}));
			// 	_form.append($("<input>",{'type':'hidden','name':'pay_code','value':val4}));

			// 	//触发提交事件
			// 	_form.trigger('submit');

			// 	//表单删除
			// 	_form.remove();
			// },

		// 立即支付 按钮
		paySubmit(){

			if(this.payWay == ''){
				this.$anchu_message.warn('请选择支付方式');
				return false
			}

			const _this = this;
			$.ajax({
				url: this.$api.payment.checkUserBack,
				dataType: "json",
				type: 'get',
				async:false,
				success: function (res) {

					// 账号被拉黑
					if(res.error == 1){
						_this.$anchu_message.error(res.error_msg);
						return false;
					}else{

						if (_this.payWay == 'alipay') {

							// 进入paywaySuccess页面 标志 
			  				_this.$cookie.setCookie('path4Sign','true','h2');
							_this.postWindow(
								`${_this.$api.payLink}/index.php/Home/Payment/getCode`,
								'trade_sn',
								'pay_radio',
								_this.trade_sn,
								'pay_code=alipay',
							);

							_this.dialogVisible = true;

						}else if (_this.payWay == 'weixin'){

							// 进入paywayWeixin页面 标志 
			  				_this.$cookie.setCookie('path3Sign','true','s10');
							_this.$router.push({
						    	path:'/paywayWeixin',
						    	query:{
						    		'trade_sn': _this.trade_sn,
						    		'order_id':_this.order_id
						    	}
							});

							_this.dialogVisible = true;

							
						}else if(_this.payWay == 'allinpay'){

			                // 进入paywaySuccess页面 标志 
			  				_this.$cookie.setCookie('path4Sign','true','h2');

			                _this.postWindow(
			                	`${_this.$api.payLink}/api.php/Home/Payment/getCode.html`,
			                	'trade_sn',
			                	'pay_radio',
			                	_this.trade_sn,
			                	'pay_code=allinpay'
			                	);
			                _this.dialogVisible = true;
			        	}else if(_this.payWay == 'balance'){

			                if(_this.code.length != 4){
			                	_this.$anchu_message.warn('请输入正确的验证码');
			                	return false;
			                }

							$.ajax({
								url: _this.$api.payment.payment,
								data:{
									code:_this.code,
				                	mobile:_this.mobile,
				                	trade_sn:_this.trade_sn,
				                	pay_code:'wallet'
								},
								dataType: "json",
								type: 'post',
								success: function (res) {

									console.log(res)
									
									if(res.status == 0){
										_this.$anchu_message.success(res.message);
										_this.dialogVisible = true;
										_this.$router.push('/mine/myIndent');

									}else if(res.status == -1){
										_this.$anchu_message.error(res.msg);

									}else if(res.status == -2){
										_this.$anchu_message.error('余额不足，请及时充值，或选择其他方式支付');
									}
								},
								error:function (res) {
									_this.$anchu_message.error('网络繁忙');
								}
							})





			                
			        	}

					}
				},
				error:function (err) {
					_this.$anchu_message.error('网络繁忙');
				}
			});


        	
        	
        }
    }
}
</script>

<style>
	.payment .el-dialog__body{
		padding: 30px 0;
	}
 	.payment .el-dialog--tiny{
 		width:450px;
 		border-radius: 5px;
 		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
 	}
	.payment .el-dialog__header{
	  padding: 0;
	}

	.payment .img-wrap{
		text-align: center;
	}
	.img-wrap img{
		display: inline-block;
	}

</style>

<style lang="scss" scoped>

	.fade-enter-active {
	  transition: opacity .5s
	}
	.fade-leave-active{
		transition: opacity .2s
	}
	.fade-enter,.fade-leave-to{
	  opacity: 0;
	}
	.code-wrap{
		overflow: hidden;
		span{
			float: left;
			overflow: hidden;
			border: 1px solid #d8d8d8;
			border-right: 0;
			em{
				float: left;
				width: 36px;
				height: 36px;
				border-right: 1px solid #d8d8d8;
				input{
					display: inline-block;
					width: 100%;
					height: 100%;
					line-height: 36px;
					text-align: center;
					font-weight: 600;
					font-size: 16px;
				}
			}
		}
		i{
			float: left;
			line-height: 36px;
			margin-left: 12px;
			padding: 0 12px;
			background: #ebebeb;
			cursor: pointer;
			font-size: 14px;
		}

	}
	.inputActive{
		span{
			border: 1px solid #009e4d;
			border-right: 0;
			em{
				border-right: 1px solid #009e4d;
			}
		}
	}
	.balance-wrap{
		padding: 17px 15px;
		background: #fffcfb;
		border: 1px solid #e64346;
		margin-top: 15px;
		line-height: 24px;
		overflow: hidden;
	}
	.balance-left{
		color: #999;
		float: left;
		i{
			color: #333;
			&:after{
				content:'元';
			}
		}
	}
	.balance-center{
		float: left;
		margin-left: 15px;
		background: #f2f2f2;
		padding: 0 15px;
		border-radius: 14px;
		font-size: 14px;
		a{
			color: #009e4d;
			text-decoration: underline;

		}
	}
	.balance-rigth{
		float: right;
		color: #999;
		i{
			color: #e64346;
			&:after{
				color: #999;
				content:'元';
			}
		}
	}
	.payment{
		width: 100%;
		min-width: 1210px;
		background: #f5f5f5;
	}
	.payment .paymentcenter{
		width: 1200px;
		margin: 0 auto;
	}
	.payment .title{
		margin-bottom: 13px;
	}
	.payment .ordermsg{
		display: flex;
		justify-content: space-between;
		margin-bottom: 13px;
	}
	.payment .payway-area{
		background:#fff;
		width: 100%;
		height: auto;
		margin-bottom: 20px;
	}
	.payment .paywaytop{
		margin:0 50px 46px;
	}
	.payment .paybtnarea{
		margin: 18px 20px 0 50px ;
		padding-bottom: 30px;
	}
	.payment .payway{
		height: 130px;
		display: flex;
		align-items: center;
	}
	.payment .payway label{
		height: 50px;
		margin-left: 10px;
		display: inline-block;
		border:1px solid #D9D9D9;
	}
	.payment .payway label:hover{
		border:1px solid #E64346;
	}
	.payment .payway .redlabel{
		border:1px solid #E64346;
	}
	.payment .payway li{
		margin-right: 50px; 
		display: flex;
		align-items: center;
	}
	.payment .pay-submit{
		font-size: 20px;
		width: 150px;
		height: 50px;
		line-height: 50px;
		color: #fff;
		background: #E64346;
	}
	.payment .time{
		color: #E64346;
	}
	.payment .checkbtnarea{
		/*padding: 20px;*/
		text-align: center;
	}
	
	.payment .checkbtnarea p{
		margin-top: 10px;
		font-size:20px;
		font-weight: 700;
		transform: scale(.9);
        -o-transform: scale(.9);
        -ms-transform: scale(.9);
        -moz-transform: scale(.9);
        -webkit-transform: scale(.9);
		color: #333;
	}
	.payment .checkbtnarea .checkbtnarea-p{
		font-weight: 100;
		font-size: 18px;
		color: #999;
		margin: 14px 0 40px;
		transform: scale(1);
        -o-transform: scale(1);
        -ms-transform: scale(1);
        -moz-transform: scale(1);
        -webkit-transform: scale(1);
	}
	.indentinfo {
		padding-top: 30px;
		overflow: hidden;
		h5{
			padding: 30px 0 12px;
		}
	}
	.indentinfo2{
		border-top: 1px solid #ebebeb;
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
	.totalprice {
		margin: 0 50px;
		font-size: 16px;
	}
	.totalmoney {
		font-size: 20px;
		color: #E64346;
	}
	.checkbtnarea a{
		display: inline-block;
	    text-decoration: none;
	    color: #333;
	    font-size: 18px;
	    width: 140px;
	    padding: 8px 0;
	    border-radius: 5px;
	    outline: none;
	    line-height: 18px;
	    text-align: center;
	    -o-box-sizing: border-box;
	    -ms-box-sizing: border-box;
	    box-sizing: border-box;
	    border: 2px solid #009e4d;
	    background: #009e4d;
	    color: #fff;
	}
	.checkbtnarea .btn-repay{
		background: #fff;
		border: 2px solid #f3f3f3;
		margin-left: 18px;
		color: #333;
	}
</style>
