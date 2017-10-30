<template>
  <div class="my-indent">
  	<div class="kongb" v-if="orderInfo.orderList.length == 0 ">
  		<img src="/static/images/kongb.png" alt=""  />
  		<h4>没有找到相关的订单信息！</h4>
  	</div>
  	<div class="w-r-menu">
  		<ul>
  			<li 
  				v-for="(item, index) in tabName" 
  				:key="index" 
  				:class="{selec:indexNow == index}" 
  				@click="tabSwitch(index)"
  			>
  				{{ item.name }}({{ item.num }})
  			</li>
  		</ul>
		<div class="advanceSearch">
			<div class="searchLeft">
				<input maxlength="30" type="text" id="case_id" v-model="caseInfo" placeholder="输入商品名称" />				
				<button @click="findCase(1)">搜索</button>
			</div>
			<i @click="advanceBtn">{{!advanceShow ? '高级搜索' : '收起'}}</i>
		</div>
  	</div>
  	<div class="w-filter" v-show="advanceShow">
  		<p>
  			订单编号：<input type="text" id="indent_id" v-model="indentInfo" maxlength="20" />
  			手机号：<input type="text" id="phone_id" v-model="phoneInfo" maxlength="11" />
  			下单时间：<el-date-picker v-model="add_time_begin" type="datetime"  class="f_time" ></el-date-picker>
  			至<el-date-picker v-model="add_time_end" type="datetime"  class="l_time"></el-date-picker>
  		</p>
  		<p>
  			<button @click="findCase(2)">搜索</button>
  		</p>
  	</div>
  	<div class="case_list">
  		<div class="case" v-for="(item,w_myIndent) in orderInfo.orderList" key="w_myIndent">
  			<h3>
	  			下单时间：<span>{{goTime(item.add_time)}}</span>
	  			订单号：<span>{{item.order_sn}}</span>

	  			<!-- 联系客服 -->
	  			<i class="iconfont icon-weibiaoti1" @click="service(item)">联系客服</i>

  			</h3>
	  			<div class="case_info">
	  				<div class="f_info">
	  					<div v-for="(items,w_goodsIndex) in item.goods_list" key="w_goodsIndex">
			  				<router-link :to="{path:'/goodsDetails',query:{id:items.goods_id}}">
			  					<img :src="imgPre + items.image.image_url" :onerror="imgErr" />
			  				</router-link>
			  				<span><router-link :to="{path:'/goodsDetails',query:{id:items.goods_id}}">{{items.goods_name}}</router-link></span>
			  				<span>x{{items.goods_num}}</span>
			  				<span>{{items.goods_price}}</span>
			  				<span v-if="items.return.status==0" class="pointer"><router-link :to="{path:'refunds',query:{goods_id:items.goods_id,order_sn:item.order_sn,goods_spec:items.spec_key}}" >退款退货</router-link></span>
			  				<span v-if="items.return.status==1">申请中</span>
			  				<span v-if="items.return.status==3||items.return.status==2">{{items.return.type==0?"申请中":"请退货"}}</span>
			  				<span v-if="items.return.status==10">退货退款成功</span>
			  				<span v-if="items.return.status==11">退款失败</span>
			  				<span v-if="items.return.status==12">退款成功</span>
			  				<span v-if="items.return.status==9 || items.return.status==13">退货完成</span>
			  				<span v-if="items.return.status==14">申请中</span>

			  				<span class="myindent-sku">{{items.spec_key_name}}</span>
	  					</div>
	  				</div>

	  				<div class="r_info">
		  				<div class="xiaoji" :heis="item.goods_list.length*116" >
		  					<div>
		  						<span>{{item.total_amount}}</span><br />
		  						<i>运费：{{item.shipping_price}}</i>
		  					</div>
		  					
		  				</div>
		  				<div class="state">
		  					<div>
		  						<span>{{item.status_name}}</span>
		  					</div>
		  				</div>
		  				<div class="detail">
		  					<div>
		  						<p>
			  						<a href='javascript:;' 
					  					@click="goMoney(item.trade_sn,item.order_id)"
					  					v-if="item.status==0">
					  					<button>去付款</button>
				  					</a>	
		  						</p>

		  						<p>
			  						<router-link tag="button"
					  					:to="{path:'orderDetail',query:{id:item.order_id}}" 
					  					v-if="item.status!=0&&item.status!=2">
				  						查看详情
				  					</router-link>	
		  						</p>
			  					
			  					<p>
			  						<span v-if="item.status==0" 
				  					@click="outOrder(item.order_id,item.trade_sn)"
									class="outOrder pointer" >取消订单</span>
			  					</p>

			  					
								<p>
									<router-link tag="span" class="pointer"
					  					:to="{path:'orderDetail',query:{id:item.order_id}}" 
					  					v-if="item.status==0||item.status==2">查看详情
					  				</router-link>	
								</p>
			  					
								<p>
									<button class="quer" 
					  					v-if="item.status==2" 
					  					@click="goConfirm(item.order_id)">确认收货
				  					</button>	
								</p>
			  						
		  					</div>
		  					
		  				</div>
	  				</div>
	  			</div>
  		</div>
  		<div class="paginations" v-if="pagination.pagetotal>1">
  			<el-pagination
		      @current-change="handleCurrentChange"
		      layout="prev, pager, next"
		      :current-page = "pagination.page"
		      :page-count="pagination.pagetotal">
	    	</el-pagination>
  		</div>
  	</div>
  </div>
</template>

<script>
export default {
	name: 'my-indent',
	data () {
		return {
			imgPre:this.$api.imgPre,
    		imgErr:'this.src="/static/images/imgtem.png"',

			tabName:[
				{
					name:'全部订单',
					num:0
				}, 
				{
					name:'待付款',
					num:0
				}, 
				{
					name:'待发货',
					num:0
				}, 
				{
					name:'待收货',
					num:0
				}, 
				{
					name:'退货退款',
					num:0
				}
			],

			pagination:{										// 分页信息
				page:1,											
				pagetotal:1
			},
			indexNow: 0, 			//切换tab时当前的index
			advanceShow: false, 	// 高级搜索

			// 订单状态需要的参数
			order_status:'',	
			return_status:'',

			// 下单时间
			add_time_begin:'',
			add_time_end:'',
			
			indentInfo: '', 	//订单名称
			phoneInfo: '', 		//手机号
			caseInfo: '', 		//商品名称

			orderInfo:{
				orderList:[],
				waitPayNum:0,		// 待付款
				waitDeliverNum:0, 	// 待发货
				waitConsignNum:0,	// 待收货
				returnNum:0,		// 退款退货
			},
    	}
	},
	beforeMount(){

		// 从何路由记录里获取上一个页面 当是orderDetail/goodsDetails 页面时
		if(
			this.$store.state.routerHistory[this.$store.state.routerHistory.length-2] == "orderDetail" || 
			this.$store.state.routerHistory[this.$store.state.routerHistory.length-2] == "goodsDetails"
		){
			const data = this.$store.state.myIndentInfo;
			this.indexNow = data.indexNow;
            this.advanceShow = data.advanceShow;
            this.order_status = data.order_status;    
            this.return_status = data.return_status;
            this.add_time_begin = data.add_time_begin;
            this.add_time_end = data.add_time_end;
            this.indentInfo = data.indentInfo;
           	this.phoneInfo = data.phoneInfo;
            this.caseInfo = data.caseInfo;
            this.pagination.page = data.page;
		}
		this.getOrderList();
	},
  methods:{
  	// 记录信息
  	myIndentInfo(){
  		this.$store.commit('setMyIndentInfo',{
  			indexNow: this.indexNow, 
            advanceShow: this.advanceShow,
            order_status:this.order_status,    
            return_status:this.return_status,
            add_time_begin:this.add_time_begin,
            add_time_end:this.add_time_end,
            indentInfo: this.indentInfo,
            phoneInfo: this.phoneInfo,
            caseInfo: this.caseInfo,
            page:this.pagination.page
  		});
  	},

  	//获取列表请求
  	getOrderList(){
  		let that = this;
  		$.ajax({
  			type:"post",
  			url:this.$api.order.getlist,
  			data:{
  				add_time_begin:this.changeTime(this.add_time_begin),
  				add_time_end:this.changeTime(this.add_time_end),
  				cur_page:this.pagination.page,
  				goods_name:this.caseInfo,
  				mobile:this.phoneInfo,
  				order_sn:this.indentInfo,
  				order_status:this.order_status,
  				return_status:this.return_status
  			},
  			dataType:'json',
  			success:function(data){

  				const dataTem = data.data;

				that.pagination.pagetotal = dataTem.page_num;
				that.orderInfo.orderList = dataTem.order_list;

				that.tabName[0].num = dataTem.total_count;
				that.tabName[1].num = dataTem.need_pay_count;
				that.tabName[2].num = dataTem.need_send_count;
				that.tabName[3].num = dataTem.need_get_count;
				that.tabName[4].num = dataTem.rufund_count;
  			}
  		})
  	},

  	//分页器方法
  	handleCurrentChange(e){
  		this.pagination.page = e;
  		this.getOrderList();
  		$('body,html').animate({scrollTop:0},50);

  		// 记录页面信息
  		this.myIndentInfo();
  	},

  	//切换状态列表
  	tabSwitch(index) {
  		
  		// 记录页面信息
  		this.myIndentInfo();

  		// 切换状态标志
  		this.indexNow = index;

  		// 切换状态 初始化信息
  		this.add_time_begin = '';
  		this.add_time_end = '';
  		this.phoneInfo = '';
  		this.indentInfo = '';
  		this.caseInfo = '';
  		this.pagination.page = 1;

		switch(index){
			case 0: 						// 全部订单
				this.order_status = '';
				this.return_status = '';
				break;

			case 1: 						// 待付款
				this.order_status = 0;
				this.return_status = '';
				break;
			case 2:  						// 待发货
				this.order_status = 1;
				this.return_status = '';
				break;
			case 3:   						// 待收货
				this.order_status = 2;
				this.return_status = '';
				break;
			case 4:   						// 退货退款
				this.order_status = '';
				this.return_status = 1;
				break;
			default:
				this.order_status = '';
				this.return_status = '';
		}
  		this.handleCurrentChange();
  	},

  	// 联系客服
  	service(value){
  		const _this = this;
  		// 与订单详情信息一样
  		let Href,imgUrl;
		if(!window.location.origin){
		    Href =  window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		}else{
		    Href = window.location.origin;
		}
		Href = process.env.NODE_ENV === 'development' ? 'http://dev.anchumall.cc:9546' : Href;

  		imgUrl = Href + value.goods_list[0].image.image_url;

  		ysf.product({
            show : 0,								// 1 访客可见自动发送的信息
            title : '订单号：' + value.order_sn,
            desc : '合计：￥' + value.total_amount,
            picture : imgUrl,
            note : value.status_name,
            url : 'http://b2bapi.anchumall.cc/index.php/Admin/Index/index.html?id=' + value.order_sn
        })

        ysf.open();
  	},

  	goMoney(trade_sn,order_id){
  		// 进入付款页标志
  		this.$cookie.setCookie('path2Sign','true','s10');

	    this.$router.push({
	    	path:'/payment',
	    	query:{
	    		trade_sn: trade_sn,
	    		order_id:order_id
	    	}
		});

  	},

  	//取消订单
  	outOrder(orderId,tradeSn){

		this.$anchu_messageBox.confirm('确定取消该订单？', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'cancelOrder'
	    }).then(() => {

	  		let that = this;
	  		$.ajax({
	  			type:"get",
	  			url:this.$api.order.cancel,
				data:{
					order_id:orderId,
					trade_sn:tradeSn
				},
	  			dataType:"json",
	  			success:function(data){
	  				if(data.error == 0){
		  				that.$anchu_message.success('取消订单成功');
		  				setTimeout(function(){
		  					that.$router.go(0);
		  				},1500)
	  				}else{
	  					that.$anchu_message.error('系统繁忙');
	  				}
	  			}
	  		})

	    }).catch(() => {
	    	// 取消   
		});

  	},
  	//确认收货
  	goConfirm(id){
  		let that = this;
  		// 没看懂 确认收货 之前为什么要传时间参数 删了 2017/9/22
  		let times = new Date().getTime();

		this.$anchu_messageBox.confirm('是否确认收货？', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'confirmReceipt'
	    }).then(() => {

	  		$.ajax({
	  			type:"get",
				url:this.$api.order.confirm,
	 			data:{
	 				id:id
	 			},
	  			dataType:"json",
	  			success:function(data){
	  				if(data.error == 0){
	  					that.$anchu_message.success('确认收货成功');
	  					setTimeout(function(){
		  					that.$router.go(0);
	  					},1500)
	  				}else{
	  					that.$anchu_message.error(data.error_code);
	  				}
	  			}
	  		});

	    }).catch(() => {
	    	// 取消   
		});


  	},
  	
  	//时间转换
  	goTime(s){
  		let d = new Date();
  		d.setTime(s*1000);
  		return d.getFullYear()+"年"+(+d.getMonth()+1)+"月"+d.getDate()+"日"
  	},

  	// 毫秒级转为秒
  	changeTime(time){
		if(time == ''){
  			return time
  		}else{
  			return new Date().setTime(time).toString().substring(0,10);
  		}	
  	},
  	
  	//搜索功能
  	findCase(index){

  		// 初始化信息
  		this.pagination.page = 1;

  		if(index == 1){						// 商品名搜索

  			if(this.caseInfo == ''){
  				this.$anchu_message.warn('请输入商品名称');
  				return false;
  			}

  			this.add_time_begin = '';
	  		this.add_time_end = '';
	  		this.phoneInfo = '';
	  		this.indentInfo = '';
  			this.handleCurrentChange();
  		}
  		else if(index == 2){				// 高级搜索

  			if(
  				this.add_time_begin == '' && 
  				this.add_time_end == '' && 
  				this.phoneInfo == '' && 
  				this.indentInfo == ''
  			){
  				this.$anchu_message.warn('请输入搜索条件');
  				return false;
  			}

  			if(
  				this.add_time_begin != '' && 
  				(this.add_time_end == '' || this.changeTime(this.add_time_begin) > this.changeTime(this.add_time_end))
  			){
  				this.$anchu_message.warn('请设置正确的时间段');
  				return false;
  			}
	  		this.caseInfo = '';
  			this.handleCurrentChange();
  		}
  		// 记录页面信息
  		this.myIndentInfo();
  	},
  	//高级搜索 收起
  	advanceBtn() {
  		return this.advanceShow = !this.advanceShow
  	}
  }
}
</script>

<style scoped>
	
	#indent_id,#phone_id{
		padding: 0 10px;
		-moz-box-sizing: border-box;
	  	-webkit-box-sizing: border-box;
	  	-o-box-sizing: border-box;
	  	-ms-box-sizing: border-box;
	  	box-sizing: border-box;
	}
	.my-indent{
		background-color:#fff;
		position:relative;
		float:left;
		width:1022px;
		padding:0 0 60px 38px;
	}
	.my-indent .w-r-menu {
		height: 38px;
		border-bottom: 1px solid #D8D8D8;
	}
	.my-indent .w-r-menu ul{
		float: left;
		height:36px;
		padding-top:2px;
		overflow: hidden;
	}
	.my-indent .w-r-menu ul li{
		cursor:pointer;
		float:left;
		height:37px;
		color:#333;
		padding:0 22px;
		-moz-box-sizing: border-box;
	  	-webkit-box-sizing: border-box;
	  	-o-box-sizing: border-box;
	  	-ms-box-sizing: border-box;
	  	box-sizing: border-box;
	  	font-weight: 900;
	}
	.my-indent .w-r-menu ul li:last-child{
		border-right:none;
	}
	.my-indent .w-r-menu span{
		cursor:pointer;
		position:absolute;
		left:538px;
		top:10px;
		color:#999;
		margin-top:16px;
		padding:0 25px;
		float:left;
	}
	.my-indent .w-filter{
		width:1022px;
		height:90px;
		padding:18px 0 0 0;
	}
	.my-indent .w-filter p{
		text-align: left;
		color:#333;
		font-size:14px;
		line-height:28px;
	}
	.my-indent .w-filter p:last-child{
		margin:26px 0 0 0;
		display: flex;
		align-items: center;
	}
	.my-indent .w-filter p input{
		display: inline-block;
		width:180px;
		height:28px;
		border:1px solid #D8D8D8;
	}
	.my-indent .w-filter p:first-child input{
		margin-right:20px;
	}
	.my-indent .w-filter p:first-child input:last-child{
		margin-right:0;
	}
	.my-indent .w-filter .f_time{
		width: 180px;
		margin-right:15px;

	}
	.my-indent .w-filter .l_time{
		width: 185px;
		margin:0 0 0 15px;
	}
	.my-indent .w-filter button{
		cursor: pointer;
		width:58px;
		height:26px;
		color:#333;
		margin-left: 490px;
		border:1px solid #D8D8D8;
		background-color:#F2F2F2;
	}
	.my-indent .case_list{
		margin-top:25px;
		min-height: 500px;
	}
	.my-indent .case_list .case{
		width:1020px;
		min-height:148px;
		border:1px solid #D8D8D8;
		position:relative;
		margin-bottom: 17px;
	}
	.my-indent .case_list .case h3{
		width:100%;
		height:35px;
		color:#999;
		font-size: 14px;
		line-height: 35px;
		text-align: left;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding-left:18px;
		border-bottom:1px solid #D8D8D8;
		background-color: #f7f7f7;
		overflow: hidden;
	}
	.case h3 .icon-weibiaoti1{
		float: right;
		margin-right: 18px;
		cursor: pointer;
		position: relative;
		padding-left: 30px;
		font-size: 14px;
	}
	.case h3 .icon-weibiaoti1:before{
		font-size: 20px;
		position: absolute;
		left: 2px;
		top: 1px;
	}
	.my-indent .case_list .case h3 span{
		color:#999;
		margin-right:88px;
	}
	.my-indent .case_info{
		overflow: hidden;
		position: relative;
		font-size: 14px;
	}
	.my-indent .case_info .xiaoji{
		box-sizing: border-box;
		color:#999;
		text-align: center;
	}
	.xiaoji div,.state div,.detail div{
		text-align: center;
		position: absolute;
		width: 100%;
		top: 50%;
		transform:translateY(-50%);
		-ms-transform:translateY(-50%);
		-moz-transform:translateY(-50%);
		-webkit-transform:translateY(-50%);
		-o-transform:translateY(-50%);
	}
	.my-indent .case_info .xiaoji i{
		color:#999;
		display: inline-block;
		margin-top:10px;
	}
	.my-indent .case_info .state{
		box-sizing: border-box;
		text-align: center;
	}
	.my-indent .case_info .detail{
		box-sizing:border-box;
		line-height:26px;
		text-align: center;
	}
	.my-indent .case_info .detail button{
		width:78px;
		height:28px;
		cursor:pointer;
		font-size:14px;
		border:1px solid #D8D8D8;
		background-color: #F2F2F2;
	}
	.my-indent .case_info div img{
		width:88px;
		height:88px;
		margin:10px 19px 0;
	}
	.my-indent .case_info .f_info{
		width:580px;
	}
	.my-indent .case_info .r_info{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 440px;
	}
	.r_info .xiaoji,.r_info .state,.r_info .detail {
		float: left;
		height: 100%;
		width: 33.3%;
		border-left: 1px solid #d8d8d8;
		position: relative;
	}
	.my-indent .case_info .f_info div{
		width:580px;
		height:115px;
		border-top:1px solid #D8D8D8;
		position:relative;
	}
	.my-indent .case_info .f_info div:nth-of-type(1){
		border:none;
	}
	.my-indent .case_info .f_info span{
		position:absolute;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.my-indent .case_info .f_info span:nth-of-type(1){
		width:155px;
		color:#333;
		left:125px;
		top:30px;
	}
	.my-indent .case_info .f_info span:nth-of-type(2){
		width:50px;
		color:#999;
		left:300px;
		top:30px;
	}
	.my-indent .case_info .f_info span:nth-of-type(3){
		width:60px;
		color:#999;
		left:370px;
		top:30px;
	}
	.my-indent .case_info .f_info span:nth-of-type(4){
		width:110px;
		/*cursor: pointer;*/
		color:#333;
		left:440px;
		top:30px;
		color:#009E4D
	}
	.my-indent .case_info .f_info span:nth-of-type(5),.my-indent .case_info .f_info span:nth-of-type(6),.my-indent .case_info .f_info span:nth-of-type(7){
		width:90px;
		cursor: pointer;
		color:#009E4D;
		left:440px;
		top: 30px;
	}
	.my-indent .case_info .f_info .myindent-sku{
		color: #666 !important;
		left:125px !important;
		top:60px !important;
	}
	.my-indent .paginations{
		margin-top:50px;
		text-align: center;
	}
	
	.my-indent .kongb{
		text-align: center;
		position: absolute;
		left:400px;
		top:270px;
	}
	.my-indent .kongb img{
		width: 50%;
	}
	.my-indent .kongb h4{
		color:#999;
		font-size: 14px;
		margin-top:10px;
	}
	.my-indent .quer{
		position:absolute;
		left:35px;
		top:35px;
	}
	.my-indent .w-r-menu ul .selec {
		color: #009e4d;
		position: relative;
		/*border-bottom: 3px solid #009E4D;*/
	}
	.selec:after{
		content: '';
		position: absolute;
		width: 100%;
		height: 3px;
		background: #009E4D;
		bottom: -1px;
		left: 0;
	}
	.my-indent .w-r-menu .advanceSearch {
		float: right;
		width: 287px;
		margin-left: 10px;
		height: 30px;
	}
	.my-indent .w-r-menu .advanceSearch .searchLeft {
		display: inline-block;
		height: 29px;
		line-height: 21px;
		border: 1px solid #dbdbdb;
	}
	.my-indent .w-r-menu .advanceSearch input {
		display: inline-block;
		padding-left: 8px;
		width: 150px;
		height: 29px;
	}
	.my-indent .w-r-menu .advanceSearch button {
		display: inline-block;
		width: 40px;
		text-align: center;
		height: 29px;
		color: #999;
		cursor: pointer;
		border-left:1px solid #dbdbdb;
	}
	.my-indent .w-r-menu .advanceSearch i {
		display: inline-block;
		width: 60px;
		margin-left: 16px;
		color: #333;
		font-size: 14px;
		text-align: right;
		cursor: pointer;
	}
	/*.sureBtn {
		display: inline-block;
		height: 30px;
		width: 100%;
		margin-top: 10px;
	}*/
	</style>
	<style>
		.my-indent .el-input__inner {
			border-radius: 1px !important;
			height: 31px;
	    	border-color: #dbdbdb;

		}
		.my-indent .el-input__icon {
			color: #999;
			border: 1px solid #dbdbdb;
			background: #eee;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-o-box-sizing: border-box;
			-ms-box-sizing: border-box;
			box-sizing: border-box;
		}		 
	</style>