<template>
	<div class="index-nav">
		
		<div class="header-bottom">
			<div 
				@mouseover="navEnter"
				@mouseleave="leave"
			>
				<span class="iconfont icon-fenlei"></span>
				<i>商品分类</i>

				<div class="nav-wrap" 
					:class="{
						nav_block:this.$route.name=='index',
						nav_width:classSign>0
					}"
					:style="{display:nav_none}"
					@mouseleave="leave"
					
				>

					<ul class="nav-one-floor">
						<li v-for="(item,index) in getlevel" 
							key="index" 
							@click="getClassifyId(item.id,item.type,item.name)" 
							@mouseenter="over(item.id,index)"
							v-bind:class="{active:index==classSign}">

							<router-link 
							:to="'/classify?id='+item.id+'&type='+item.type+'&name='+item.name">
								<span v-bind:class="item.image"></span>
								<i v-html="navword(item.name)"></i>
							</router-link>
						</li>
					</ul>

					<div class="nav-detail-wrap" v-if="msg == 2">
						<dl v-for="(item2,index) in getleve2" key="index">
							<dt>
								<router-link 
									v-text="item2.name"
									:to="'/classify?id='+item2.id+'&type=undefined&name='+item2.name"
									@click.native="getClassifyId(item2.id,'undefined',item2.name)">
								</router-link>
							</dt>
							<dd>
								<router-link
									v-for="(item3,index3) in item2.children" 
									:to="'/classify?id='+item3.id+'&type=undefined&name='+item3.name"
									@click.native="getClassifyId(item3.id,'undefined',item3.name)"
									key="index3" v-text="item3.name">
								</router-link>
							</dd>
						</dl>
					</div>

					<!-- 所有站点显示 -->

					<!-- <div class="nav-site-list" v-if="msg == 1">
						<router-link
							v-for="(site,index) in siteList"
							:to="'/classify?id='+site.id+'&type=site&name='+site.region"
							@click.native="getClassifyId(site.id,'site',site.region)" 
							key="index" v-text="site.region">
						</router-link>
					</div> -->

				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name:'index-nav',
		data () {
			return {
				msg: '',
				iconFont:{
					0:'iconfont icon-quanbushangpin',
					1:'iconfont icon-diaoweipin',
					2:'iconfont icon-liangyoufushi',
					3:'iconfont icon-rouqindanlei',
					4:'iconfont icon-jinkoulingshi',
					5:'iconfont icon-guochanshuiguo',
					6:'iconfont icon-shuichan',
					7:'iconfont icon-yangshengicon',
					8:'iconfont icon-shuichan',
					9:'iconfont icon-8shucai',
					10:'iconfont icon-bbgjiushui',
					11:'iconfont icon-zuhelaixi',
					926:'iconfont icon-diaoweipin',
					927:'iconfont icon-liangyoufushi',
					928:'iconfont icon-rouqindanlei',
					929:'iconfont icon-jinkoulingshi',
					930:'iconfont icon-guochanshuiguo',
					931:'iconfont icon-shuichan',
					932:'iconfont icon-yangshengicon',
					933:'iconfont icon-8shucai',
					934:'iconfont icon-bbgjiushui',
					935:'iconfont icon-cailanzi',
					1085:'iconfont icon-zuhelaixi'
				},
				getlevel:[],
				getleve2:[],
				toClassifyInfo:'',
				classSign:-1,
				siteList:[],
				nav_none:''
			}
		},
		created(){
			this.getlevels();
		},
		methods:{
			// 一级分类 中文之间的放置空格
			navword(value){
				if(value.length == 2){
					// 两个汉字相当于 6个&nbsp;
            		return value.slice(0,1)+'<i style="visibility:hidden;">安厨</i>'+value.slice(1,2);
				}else{
					return value;
				}
			},
			getClassifyId(id,Type,name){
				this.nav_none = "none"
				this.toClassifyInfo = id;

				if(this.toClassifyInfo.trim()){
					this.$emit('messages',id+','+Type+','+name);
				}
				// console.log(id+Type+name+'index-nav')
				// this.$router.push("/classify");
			},
			getlevels() {
		    	var _this = this;
		    	$.ajax({
			        type: "get",
			        url: _this.$api.home.getlevel1,
			        dataType: "json",
			        success:function(res){
			         	_this.getlevel = res.data;

			        	for(var i in _this.getlevel){
			        		_this.getlevel[0].name = '全部商品';
			        		_this.getlevel[0].id = '0';
			        		_this.getlevel[0].type = 'search';
			        		_this.getlevel[i].image = _this.iconFont[_this.getlevel[i].id];
			        	}
			        }
		    	});
		    },

		    // 鼠标滑过
		    over(id,index){

		    	this.classSign = index;
		    	const _this = this;

		    	if(index == 0){

		    		this.msg = 1;
		    		// 获取所有站点 现在不需要（2017/07/07）
			  		// $.ajax({
				   //      type: "post",
				   //      url: this.$store.state.apilink+"?s=api/site/getlist",
				   //      dataType: "json",
				   //      success:function(res){
				   //      	// 获取地域
				   //        _this.siteList = res.data;
				   //      }
				   //  });

		    	}else{

		    		this.msg = 2;
			    	$.ajax({
				        type: "get",
				        url: this.$api.home.getlevel1children,
				        data:{
				        	id:id
				        },
				        dataType: "json",
				        success:function(res){
				        	// console.log(res)
				         	_this.getleve2 = res.data;
				         	
				        }
			    	});
		    	}
		    	
		    },

		    navEnter(){
		    	if(this.$route.name !='index'){
		    		this.nav_none = "block"
		    	}
		    },

		    // 鼠标离开
		    leave(){
		    	this.msg = 3;
		    	this.classSign = -1;
		    	if(this.$route.name !='index'){
		    		this.nav_none = "none"
		    	}
		    	
		    }
		}
	}
</script>
<style scoped>
	.nav-site-list a:hover{
		color: #009e4d;
	}
	.active{
		background:#fff;
		width: 880px;
	}
	.index-nav{
		border-bottom: 2px solid #009448;
	}
	.index-nav .header-bottom{
		width: 1200px;
		margin: 0 auto;
		height: 40px;
		line-height: 40px;
		position:relative;
	}
	.header-bottom div > span{
		font-size: 18px;
		position: absolute;
		left: 34px;
		top: 2px;
	}
	.header-bottom div > i{
		padding-left: 24px;
		font-size: 18px;
	}
	.index-nav .header-bottom>div{
		text-align: center;
		width: 180px;
		height: 42px;
		line-height: 40px;
		background: #009e4d;
		color: #fff;
		display: flex;
		justify-content: center;
		cursor: pointer;
	}
	.index-nav .header-bottom .icon-fenlei{
		color: #fff;
	}
	.index-nav .header-bottom>div:hover .nav-wrap{
		display:block;
	}
	.index-nav .header-bottom .nav-wrap{
		position:absolute;
		padding-top:3px;
		bottom:-432px;
		left:0;
		width:180px;
		height:430px;
		z-index:999999999;
		display:none;
	}
	.index-nav .header-bottom .nav_none{
		display: none!important;
	}
	.index-nav .header-bottom .nav_block{
		display: block;
		width:180px;
	}
	.index-nav .header-bottom .nav_width{
		width:880px;
	}
	.nav-one-floor{
		float:left;
		height:100%;
		width:180px;
		background:rgba(255,255,255,0.95);
	}
	.nav-one-floor > li{
		height:9.09%;
		width:100%;
		font-size:14px;
	}
	.nav-one-floor > li a{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.nav-one-floor > li span{
		position: absolute;
		font-size:20px;
		top: -8px;
    	left: 0;
    	color: #555;
	}
	.nav-one-floor > li i{
		display: inline-block;
		width: 86px;
		height: 100%;
		padding-left: 22px;
	}
	.nav-detail-wrap{
		float:left;
		width:-moz-calc(100% - 182px);
		width:-webkit-calc(100% - 182px);
		width:calc(100% - 182px);
		height:100%;
		background:#fff;
	}
	.nav-site-list{
		float:left;
		margin:0 0 0 0;
		width:100px;
		height:100%;
		background: #fff;
	}
	.nav-site-list a{
		float: left;
		width: 100%;
		height:38px;
		line-height: 38px;
		font-size: 14px;
	}
	.nav-detail-wrap dl{
		float:left;
		margin:5px 24px 0 24px;
		width:300px;
		height:100px;
	}
	.nav-detail-wrap dl dt{
		text-align:left;
		border-bottom:1px solid #d8d8d8;
		color: #666;
		font-size: 14px;
		height: 36px;
	}
	.nav-detail-wrap dl dd a{
		float:left;
		font-size:14px;
		line-height:20px;
		padding:5px 10px 5px 0;
		color:#999;
	}
	.nav-detail-wrap dl dd a:hover{
		color:#009e4d;
	}


	@media screen and (max-width: 1300px) {
		.index-nav .header-bottom{
			width: 980px;
		}
	}
</style>