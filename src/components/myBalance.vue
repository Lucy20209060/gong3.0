<template>
	<div class="myBalance">
		<h3>
			<span>我的余额</span>
		</h3>
		<div class="step">
			<ul>
				<li>我的可用余额（元）</li>
				<li style="color:#333">{{available_balance}}</li>
			</ul>

			<ul>
				<li>账户余额（元）</li>
				<li>{{user_money}}</li>
			</ul>

			<ul>
				<li>冻结余额（元）</li>
				<li>{{frozen_money}}</li>
			</ul>

			<ul class="button">
				<li>账户状态：{{status==0?'有效':'无效'}}</li>
				<router-link 
					tag="li" 
					:to="status==0 ? '/recharge' : ''"
					:class="[
						status==0 ? '':'rechargeStatus'
					]"
				>充值</router-link>
			</ul>

			<ul class="alert">
				<li></li>
				<li>对账户余额有疑问，请联系客服或拨打0571-28270936进行咨询</li>
			</ul>
		</div>

		<h4>收支明细</h4>

		<dl class="myBalance-recharge">
			<dt>
				<i>日期</i>
				<i>金额</i>
				<i>操作</i>
				<i>备注</i>
			</dt>
			
			<!-- 暂无记录 -->
			<dd class="no-record" v-if=" currList.length == 0 ">暂无记录...</dd>
			<!-- 记录列表 -->
			<dd v-for="(item,index) in currList" key="index">
				<span>{{item.time}}</span>
				<span>{{item.account}}</span>
				<span>{{item.type}}</span>
				<span :title="item.remark">{{item.remark}}</span>
			</dd>
		</dl>
		
		<!-- 分页 -->
		<div class="pagination" v-if=" currList.length != 0 ">
			<span 
				@click="previousOrNext('previous')"
				:class="[
					currentPage <= 1 ? 'notAllowed' : ''
				]"
			>上一页</span>

			<i>{{currentPage}}</i>

			<span 
				@click="previousOrNext('next')"
				:class="[
					currentPage >= totalPage ? 'notAllowed' : ''
				]"
			>下一页</span>

			<em>共{{totalPage}}页,共{{totalRecord}}条记录</em>
		</div>
		
		<!-- 客服 -->
		<service></service>
	</div>
</template>

<script>
import service from '@/components/common/service'
export default {
	name: 'batch',
	data () {
		return {
			currentPage:1,
			totalPage:1,
			totalRecord:0,

			available_balance:'0.00', 	// 可用余额
			frozen_money:'0.00',		// 冻结金额
			user_money:'0.00',			// 金额
			status:0,			// 账户状态

			balanceList:[],				// 所有充值记录
			currList:[],				// 当前页记录



		}
	},
	components: { service },
	mounted(){
		this.getBalance();
	},
	methods:{
		// 选择当前页数
	    choicePage(index) {
	    	// 截取截取当前页数据     所有站点列表中的数据 ==> 当前页面列表
	    	const numberTem = 10*(index-1);								// 截取起始点
	    	this.currList =  this.balanceList.slice(numberTem,numberTem + 10);		// 截取当前页 数据    	
	    },

		// 上一页 或 下一页
		previousOrNext(val){
			if(val == 'previous' && this.currentPage > 1)
			{
				this.currentPage -- ;
			}
			else if(val == 'next' && this.currentPage < this.totalPage)
			{
				this.currentPage ++ ;
			}
			else{
				return false;
			}
			this.choicePage(this.currentPage);
		},

		// 获取充值余额记录
		getBalance(){
			const _this = this;
			$.ajax({
				type:"post",
				url:this.$api.recharge.info,
				dataType:"json",
				success:function(res){
					const data = res.data;

					console.log(data)

					_this.available_balance = data.available_balance;
					_this.frozen_money = data.frozen_money;
					_this.user_money = data.user_money;
					_this.status = data.status;

					// 所有充值记录
					_this.balanceList = data.list;

					// 加载第一页数据
					_this.choicePage(1);

					// 总条数
					_this.totalRecord = data.list.length;

					// 总页数 (总数/每页个数 向上取整)
		            _this.totalPage = Math.ceil(data.list.length/10);
				}
			});
		}



		
	}
}
</script>

<style lang="scss" scoped>
	
	.myBalance{
		width:1018px;
		float: left;
		padding:0 0 80px 41px;
		background-color:#fff;
		min-height: 500px;
	}
	.myBalance h3{
		color:#333;
		text-align: left;
		padding-bottom:15px;
		font-size: 16px;
		border-bottom: 1px solid #D8D8D8;
		margin-bottom: 40px;
		font-weight: 900;
	}
	.step{
		padding-left: 20px;
		overflow: hidden;
		ul{
			float: left;
			color: #999;
			width: 210px;
			&:first-child{
				margin-left:0;
			}
			li:first-child{
				padding-bottom:35px;
				color: #333;
			}
			li:last-of-type{
				line-height: 38px;
				color: #999;
				font-size: 32px;
			}
		}
		.button{
			width: 136px;
			li:last-of-type{
				background:#009e4d;
				color: #fff;
				font-size: 16px;
				text-align: center;
				border-radius: 4px;
				cursor: pointer;
			}
			.rechargeStatus{
				background: #999!important;
			}
		}
		.alert{
			margin-left: 15px;
			width: 208px;
			li:last-of-type{
				line-height: 20px;
				font-size:14px;
				padding-top: 18px;
			}
		}
	}
	h4{
		font-weight: 900;
		padding: 80px 0 20px;
	}
	.myBalance-recharge{
			color: #999;
			font-size: 14px;
			height: 426px;
		dt{
			background: #f7f7f7;
			line-height: 34px;
			overflow: hidden;
			i{
				text-align: center;
				float: left;
				&:nth-child(1){
					width:20%;
				}
				&:nth-child(2){
					width:15%;
				}
				&:nth-child(3){
					width:15%;
				}
				&:nth-child(4){
					width:50%;
				}
			}
		}
		dd{
			padding-top: 20px;
			overflow: hidden;
			span{
				text-align: center;
				float: left;
				font-size: 14px;
				
				&:nth-child(1){
					width:20%;
				}
				&:nth-child(2){
					width:15%;
				}
				&:nth-child(3){
					width:15%;
				}
				&:nth-child(4){
					width:50%;
					text-align: left;
					text-indent: 30px;
					white-space: nowrap;
				    overflow: hidden;
				    text-overflow: ellipsis;
				    -moz-box-sizing: border-box;
				    -webkit-box-sizing: border-box;
				    -o-box-sizing: border-box;
				    -ms-box-sizing: border-box;
				    box-sizing: border-box;
				}
			}
		}
		.no-record{
			text-align: center;
			padding-top: 30px;
		}
	}
	.pagination{
		padding-top: 50px;
		text-align: right;
		font-size: 14px;
		span{
			width: 70px;
			height: 32px;
			border: 1px solid #999;
			display: inline-block;
			line-height: 32px;
			text-align: center;
			cursor: pointer;
			user-select: none;
			-moz-user-select: -moz-none;
			-khtml-user-select: none;
			-webkit-user-select: none;
		}
		i{
			width: 32px;
			height: 32px;
			border: 1px solid #999;
			display: inline-block;
			line-height: 32px;
			text-align: center;
		}
		em{
			color: #000;
			padding-left: 10px;
		}
		.notAllowed{
			cursor: not-allowed;
			color: #999;
		}
	}
	
</style>