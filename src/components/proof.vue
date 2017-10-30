<template>
	<div class="proof">

		<!-- 头部 -->
		<login-header>用户认证</login-header>

		<!-- 中间内容区 -->
		<div class="content-wrap">
			<div class="content">

				<section class="title">
					<img src="/static/images/proof.png">
				</section>

				<p>立即认证，您将获得更多服务！</p>

				<!-- 企业类型 -->
				<section class="common-types common-top">
					<p class="common-types-p1">企业类型：</p>
					<p class="common-types-p2">
						<span 
							v-for="(items,index) in enterpriseTypes" 
							key="index"
							v-text="items.label"
							@click="choiceEnterpriseType(items)"
							:class="[
								info.authentication_type == items.value?'common-span-active':'',
							]"
						>
						</span>
					</p>
				</section>

				<!-- 经营类型  -->
				<section class="common-types">
					<p class="common-types-p1">经营类型：</p>
					<p class="common-types-p2">
						<el-select v-model="info.management_type.value" placeholder="请选择经营类型">
							<el-option
								v-for="(item,index) in manageOptions"
								key="index"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</p>
					<p 
						class="common-types-p3" 
						v-text="info.management_type.message"
						:class="[
							info.management_type.sign
							? 'iconfont icon-success'
							: ''
						]"
					>
					</p>
				</section>

				<!-- 网店名称 实体店名称 -->
				<section class="common-types">
					<p class="common-types-p1">{{info.authentication_type == 1?"网店名称：":"实体店名称："}}</p>
					<p class="common-types-p2">
						<el-input 
							v-model="info.merchant_name.value" 
							:placeholder="info.authentication_type == 1?'请填写网店名称':'请填写实体店名称'" 
							:maxlength=30
						/>
					</p>
					<p 
						class="common-types-p3" 
						v-text="info.merchant_name.message "
						:class="[
							info.merchant_name.sign
							? 'iconfont icon-success'
							: ''
						]"
					>
					</p>
				</section>

				<!-- 线下企业认证 实体店地址 -->
				<section class="common-types" v-if="info.authentication_type == 2">
					<p class="common-types-p1">实体店地址：</p>
					<p class="common-types-p2">
						<el-input 
							v-model="info.contact_address.value" 
							placeholder="请填写实体店地址" 
							:maxlength=40 
						/>
					</p>
					<p 
						class="common-types-p3" 
						v-text="info.contact_address.message"
						:class="[
							info.contact_address.sign
							? 'iconfont icon-success'
							: ''
						]"
					>
					</p>
				</section>

				<!-- 线上企业认证 网店链接 -->
				<section class="common-types" v-if="info.authentication_type == 1">
					<p class="common-types-p1">网店链接：</p>
					<p class="common-types-p2">
						<el-input 
							v-model="info.website.value" 
							placeholder="请填写网址" 
							:maxlength=200 
						/>
					</p>
					<p 
						class="common-types-p3" 
						v-text="info.website.message"
						:class="[
							info.website.sign
							? 'iconfont icon-success'
							: ''
						]"
					>
					</p>
				</section>

				<!-- 线上企业认证 联系人姓名 -->
				<section class="common-types">
					<p class="common-types-p1">联系人姓名：</p>
					<p class="common-types-p2">
						<el-input 
							v-model="info.contacts_name.value" 
							placeholder="请填写真实姓名（不能为昵称，X先生，X女士）" 
							:maxlength=6
						/>
					</p>
					<p 
						class="common-types-p3" 
						v-text="info.contacts_name.message"
						:class="[
							info.contacts_name.sign
							? 'iconfont icon-success'
							: ''
						]"
					>
					</p>
				</section>

				<!-- 线上企业认证 联系人手机 -->
				<section class="common-types">
					<p class="common-types-p1">联系人手机：</p>
					<p class="common-types-p2">
						<el-input 
							v-model="info.contacts_mobile.value" 
							placeholder="请填写11位手机号码" 
							:maxlength=11
							@focus="contacts_mobile_focus"
							@blur="contacts_mobile_blur(info.contacts_mobile.value)"
						/>
					</p>
					<p 
						class="common-types-p3" 
						v-text="info.contacts_mobile.message"
						:class="[
							info.contacts_mobile.sign
							? 'iconfont icon-success'
							: ''
						]"
					>
					</p>
				</section>

				<!-- 资质照片 -->
				<section class="common-types">
					<p class="common-types-p1 p1-special">资质照片：</p>
					<p class="common-types-p2 p2-special">
						<el-upload
							class="upload-Other"
							:action="upload"
							:data="{'path':'user'}"
							accept="image/jpeg,image/jpg,image/png"
							:on-success="onSuccess_aptitude"
							:before-upload="beforeUpload_aptitude"
							:on-remove="removeImg_aptitude"
							list-type="picture"
							:file-list="pictureList"
						>
							<el-button size="small">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">请提供该网站/网店为您所有的凭证，如后台截屏、认证截屏等，单张照片不超过2M，支持jpg、png格式</div>
						</el-upload>
					</p>
					<p class="common-types-p3"></p>
				</section>

				<section class="common-types">
					<input 
						class="common-button" 
						type="button" 
						value="提交"
						@click="proofSubmit"
					/>
				</section>

			</div>
		</div><!-- <div class="content-wrap"> -->
		
		<!-- 底部 -->
		<index-footer></index-footer>

	</div><!-- <div class="proof"> -->
</template>

<script>
	import loginHeader from '@/components/common/login_header'
	import IndexFooter from '@/components/common/index_footer'
	export default {
		name: 'proof',
		data () {
			return {
				pictureList:[],
				upload:this.$api.uploadify.upload_image,
				enterpriseTypes:[							// 企业类型
					{ value:1, label:'线上企业认证' },
					{ value:2, label:'线下企业认证' }
				],
				onlineType: [								// 经营类型(线上企业)
					{ value:1, label:'天猫' },
					{ value:2, label:'淘宝' },
					{ value:3, label:'京东' },
					{ value:4, label:'一号店' },
					{ value:5, label:'苏宁' },
					{ value:8, label:'阿里巴巴' },
					{ value:13, label:'拼多多' },
					{ value:14, label:'有赞' },
					{ value:15, label:'微店' },
					{ value:17, label:'自营平台' },
					{ value:18, label:'其他' }
				],
				outlineType: [								// 经营类型(线下企业)
					{ value:1, label:'门店' },
					{ value:2, label:'企业采购' },
					{ value:3, label:'其他' }
				],
				manageOptions: [],							// 经营类型数组 取值onlineType/outlineType

				// 线上 线下 所有的信息 数组
				info:{
					user_id:this.$cookie.getCookie('a34ea2d96d4239d4d86803bb3cd99788'),
					authentication_type:1,					// 企业类型
					management_type:{						// 经营类型
						value:'',
						message:'',
						sign:false
					},
					merchant_name:{							// 网店名称
						value:'',
						message:'',
						sign:false
					},
					website:{								// 网店链接
						value:'',
						message:'',
						sign:false
					},
					contacts_name:{							// 联系人姓名
						value:'',
						message:'',
						sign:false
					},
					contacts_mobile:{						// 联系人手机号码
						value:'',
						message:'',
						sign:false
					},
					contact_address:{						// 联系地址
						value:'',
						message:'',
						sign:false
					},

					fileList_aptitude:[],					// 资质照片					

				},
			}
		},

		components:{
			loginHeader,
			IndexFooter
		},

		beforeCreate(){
			let proof  = this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299');

	        if(proof == 1){            // 成功

	        	this.$router.push('/verify');

	        }else if(proof == -1){     // 审核中

	        	this.$router.push('/verify');
	            
	        }else if(proof == -2||proof == -3||proof == -4){     // 审核没通过，未查询到数据，未认证
	            
	        }else{
	        	this.$router.push('/login');
	        }

		},

		mounted(){
			// 经营类型 默认线上企业的经营类型
			this.manageOptions = this.onlineType;
		},

		watch:{


	        // 监听 经营类型
	        'info.management_type.value'(curval,oldval){
	        	if(curval.length == ''){
	            	this.info.management_type.sign = false;
	            	this.info.management_type.message = '请选择经营类型';
	            }else{
	            	this.info.management_type.sign = true;
	            	this.info.management_type.message = '';
	            }
	        },

	        /*
	        *	监听 网店名称 实体店名称
	        *	出现提示时 切换线上 线下 也要切换提示
	        */ 
	        'info.merchant_name.value'(curval,oldval){
	        	if(curval == ''){
	        		this.info.merchant_name.message = '请填写网店/实体店名称';
	        		this.info.merchant_name.sign = false;
	        	}else{
	        		this.info.merchant_name.message = '';
	        		this.info.merchant_name.sign = true;
	        	}
	        },

	        // 监听 实体店地址
	        'info.contact_address.value'(curval,oldval){
	        	if(curval == ''){
	        		this.info.contact_address.message = '请填写实体店地址';
	        		this.info.contact_address.sign = false;
	        	}else{
	        		this.info.contact_address.message = '';
	        		this.info.contact_address.sign = true;
	        	}
	        },

	        // 监听 网店链接
	        'info.website.value'(curval,oldval){
	        	if(curval == ''){
	        		this.info.website.message = '请填写网店链接';
	        		this.info.website.sign = false;
	        	}else{
	        		this.info.website.message = '';
	        		this.info.website.sign = true;
	        	}
	        },

	        // 监听 联系人姓名
	        'info.contacts_name.value'(curval,oldval){
	        	if(curval == ''){
	        		this.info.contacts_name.message = '请填写联系人姓名';
	        		this.info.contacts_name.sign = false;
	        	}else{
	        		this.info.contacts_name.message = '';
	        		this.info.contacts_name.sign = true;
	        	}
	        },

	        // 监听 联系人手机
	        'info.contacts_mobile.value'(curval,oldval){

	        	let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/i;

	            if(curval.length > 0 && curval.substring(0,1) != 1){
	            	this.info.contacts_mobile.message = '首位不为1';
	            	this.info.contacts_mobile.sign = false;
	                return;
	            }else if( curval.length > 0 && curval.length < 11){
	            	this.info.contacts_mobile.message = '';
	            	this.info.contacts_mobile.sign = false;
	                return;
	            }
	            if(curval.length == 11 && reg.test(curval)){
	                this.info.contacts_mobile.message = '';
	            	this.info.contacts_mobile.sign = true;
	                return;
	            }
	            if(curval.length == 11 && !reg.test(curval)){
	                this.info.contacts_mobile.message = '手机号格式错误';
	            	this.info.contacts_mobile.sign = false;
	                return;
	            }
	            if(curval.length == 0){
	                this.info.contacts_mobile.message = '请填写联系人手机号码';
	                this.info.contacts_mobile.sign = false;
	            }
	        	
	        },
	        // 监听 企业类型
	        'info.authentication_type'(curval,oldval){
            	/*
				*	切换 经营类型
            	*/ 
	            if(curval == 1){
	            	this.manageOptions = this.onlineType;
	            }else{
	            	this.manageOptions = this.outlineType;
	            }

	            // 清空各个输入框数据
	            this.info.fileList_aptitude = [];
	            this.pictureList = [];

	            this.info.management_type.value = '';
	            // this.info.management_type.message = '';
	            
				this.info.merchant_name.value = '';
				// this.info.merchant_name.message = '';

				this.info.website.value = '';
				// this.info.website.message = '';

				this.info.contacts_name.value = '';
				// this.info.contacts_name.message = '';

				this.info.contacts_mobile.value = '';
				// this.info.contacts_mobile.message = '';

				this.info.contact_address.value = '';
				// this.info.contact_address.message = '';
	        },

	    },

		methods:{

			/**
			*	线上企业 上传照片 资质照片
			*
			*/

			beforeUpload_aptitude(file){
				if(this.info.fileList_aptitude.length > 2 ){
					this.$anchu_message.warn('最多只能传三张图片');
					return false;
				}

				for(let i in this.info.fileList_aptitude){
					if(file.name == this.info.fileList_aptitude[i].name){
						this.$anchu_message.warn('请勿重复上传');
						return false;
					}
					
				}
				// 格式检测
				return this.fileCheck(file);
				
			},
			onSuccess_aptitude(response, file, fileList){
				// console.log(file)
				if(response.code > 0){  // 上传成功

					this.$anchu_message.success(response.msg);
					this.info.fileList_aptitude.push({
						name:file.name,
						url:response.url
					});
					// console.log('imgArr',this.info.fileList_aptitude);

		        }else{  // 上传服务器失败
		        	this.$anchu_message.error('上传失败，请重新上传');
		        }
			},
			removeImg_aptitude(file,fileList){
				// for(let i in this.info.fileList_aptitude){
				// 	if(file.name == this.info.fileList_aptitude[i].name){
				// 		this.info.fileList_aptitude.splice(i,1);
				// 	}
				// }
				// console.log(this.info.fileList_aptitude)

				// this.$anchu_message.success('删除成功');

				this.removeImgFile(file,fileList);
			},

			

			// 图片格式 大小检测
			fileCheck(file){
				const sign_type = (file.type == 'image/jpeg') || 
								  (file.type == 'image/jpg') || 
								  (file.type == 'image/png');

				if (!sign_type) {
					this.$anchu_message.error('上传图片只能是JPG或者PNG格式');
					return
				}
				// 图片大小检测
				const sign_2MB = file.size / 1024 / 1024 < 2;
				if(!sign_2MB){
					this.$anchu_message.error('上传图片大小不能超过 2MB');
					return
				}

				return sign_type && sign_2MB;

			},

			// 删除图片
			removeImgFile(file,fileList){

				let _this = this;
				$.ajax({
					url: this.$api.uploadify.remove_image,
					data: {
						path: file.response.url
					},
					type: 'post',
					dataType:"json",
					success: function (res) {
						
						if (res.code == 1) {

							for(let i in _this.info.fileList_aptitude){
								if(file.name == _this.info.fileList_aptitude[i].name){
									_this.info.fileList_aptitude.splice(i,1);
								}
							}
							// console.log(_this.info.fileList_aptitude)

							_this.$anchu_message.success('删除成功');

						}else{
							_this.$anchu_message.error('图片删除失败');
						}
					},
					error:function (err) {
						_this.$anchu_message(errs.msg);
					}
				});
			},

			/**
			*	上传照片 相关函数 结束
			*
			*/


			// 提交按钮 开关
			submitSwitch(){
				this.info.management_type.message = this.info.management_type.sign
													? ''
													: '请选择经营类型';

				this.info.merchant_name.message = this.info.merchant_name.sign
													? ''
													: '请填写网店/实体店名称';

				this.info.website.message = this.info.website.sign
													? ''
													: '请填写网店链接';

				this.info.contact_address.message = this.info.contact_address.sign
													? ''
													: '请填写实体店地址';

				this.info.contacts_name.message = this.info.contacts_name.sign
													? ''
													: '请填写联系人姓名称';
				
				this.info.contacts_mobile.message = this.info.contacts_mobile.sign
													? ''
													: '请填写正确的手机号码';

				switch(this.info.authentication_type){

					// 线上企业
					case 1: return 	this.info.management_type.sign && 
									this.info.merchant_name.sign && 
									this.info.website.sign && 
									this.info.contacts_name.sign && 
									this.info.contacts_mobile.sign;

					// 线下企业
					case 2: return 	this.info.management_type.sign && 
									this.info.merchant_name.sign && 
									this.info.contact_address.sign && 
									this.info.contacts_name.sign && 
									this.info.contacts_mobile.sign;
				}
			},

			// 联系人手机号码 聚焦
			contacts_mobile_focus(){
				if(!this.info.contacts_mobile.sign){
					this.info.contacts_mobile.message = '';
				}
			},

			// 联系人手机号码 失焦
			contacts_mobile_blur(curval){

				let reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/i;

	            if(curval.length > 0 && curval.substring(0,1) != 1){
	            	this.info.contacts_mobile.message = '首位不为1';
	            	this.info.contacts_mobile.sign = false;
	                return;
	            }else if( curval.length > 0 && curval.length < 11){
	            	this.info.contacts_mobile.message = '手机号格式错误';
	            	this.info.contacts_mobile.sign = false;
	                return;
	            }
	            if(curval.length == 11 && reg.test(curval)){
	                this.info.contacts_mobile.message = '';
	            	this.info.contacts_mobile.sign = true;
	                return;
	            }
	            if(curval.length == 11 && !reg.test(curval)){
	                this.info.contacts_mobile.message = '手机号格式错误';
	            	this.info.contacts_mobile.sign = false;
	                return;
	            }
	            if(curval.length == 0){
	                this.info.contacts_mobile.message = '请填写联系人手机号码';
	                this.info.contacts_mobile.sign = false;
	            }
			},

			// 点击选择 线上 线下 企业
			choiceEnterpriseType(item){
				this.info.authentication_type = item.value;
				this.info.management_type.value = '';					// 选择企业类型后 清空已选择的经营类型
			},

			// 提交
			proofSubmit(){

				if(!this.submitSwitch()){
					return
				}

				const _this = this;
				const phone = [];

				// 收集图片
				for(let i in this.info.fileList_aptitude){
					phone.push(this.info.fileList_aptitude[i].url)
				}
				// 线上 线下 ajax data
				const dataTem = this.info.authentication_type == 1 
								?{
									authentication_type:this.info.authentication_type,
									management_type: 	this.info.management_type.value,
									merchant_name: 		this.info.merchant_name.value,
									website: 			this.info.website.value,
									contacts_name: 		this.info.contacts_name.value,
									contacts_mobile: 	this.info.contacts_mobile.value,
									photo: 				phone,
									user_id: 			this.info.user_id
								}
								:{
									authentication_type:this.info.authentication_type,
									management_type: 	this.info.management_type.value,
									merchant_name: 		this.info.merchant_name.value,
									website: 	this.info.contact_address.value,
									contacts_name: 		this.info.contacts_name.value,
									contacts_mobile: 	this.info.contacts_mobile.value,
									photo: 				phone,
									user_id: 			this.info.user_id
								};

				$.ajax({
					url: this.$api.proof.authentication_userinfo,
					data:dataTem,
					dataType: "json",
					type: 'post',
					success: function (res) {

						if(res.code == 1){
							_this.$cookie.setCookie('b61a9d162ac1dfaa22d0f05bdc7f6299','-1','d1');
							_this.$router.push({path:'/verify'});
						}else{
							_this.$anchu_message.success(res.msg);
						}

					},
					error:function (err) {
						_this.$anchu_message.error(err);
					}
				});


			},
		}
	}
</script>

<style scoped>
	.proof{
		width: 100%;
    	height: 100%;
	}
	.content-wrap{
		width: 100%;
		overflow: hidden;
	    background: #F5F5F5;
	    padding: 30px 0;

	}
	.content{
		width: 900px;
		min-height: 100px;
		overflow: hidden;
		margin: 0 auto;
	    background: #fff;
	    text-align: center;
	    padding-bottom: 70px;
	}
	.title{
		padding: 40px 0 25px;
    	width: 100%;
	}
	.common-top{
		margin-top: 45px;
	}
	.common-types{
		padding: 10px 0;
		position: relative;
		line-height: 40px;
	}
	.common-types:after{
		clear: both;
        content: '.';
        display: block;
        height: 0;
        line-height: 0;
        overflow: hidden;
	}
	.common-types-p1{
		float: left;
	    width: 30%;
	    height: 40px;
	    text-align: right;
	    margin-right: 10px;
	}
	.common-types-p1:before{
		content: '*';
		color: red;
		vertical-align: middle;
		padding-right: 3px;

	}
	.p1-special:before{
		content: '';
	}
	.common-types-p2{
		float: left;
		text-align: left;
		width: 400px;
		height: 40px;
		line-height: 40px;
	}
	.p2-special{
		height: auto;
		
	}
	.p2-special .el-upload__tip{
		line-height: 20px;
	}
	.common-types-p3{
		float: left;
		text-align: left;
		padding-left: 10px;
		font-size: 14px;
		color: red;
	}
	.common-types-p2 > span{
		border: 1px solid rgb(191, 217, 206);
		width: 140px;
	    height: 32px;
	    line-height: 32px;
	    cursor: pointer;
	    margin-right: 20px;
	    text-align: center;
	    display: inline-block;
	    color: #999;
	}
	.common-types-p2 .common-span-active{
		border: 1px solid #009e4d;
		background: url('/static/images/selectaddress.png') right bottom no-repeat;
		background-size: 12% auto;
    	color: #009e4d;
	}
	.common-types-p3{
		height: 40px;
	}
	.common-button{
		width: 402px;
	    height: 42px;
	    background: #009E4D;
	    border-radius: 4px;
	    color: #fff;
	    font-size: 20px;
	    margin-left: 58px;
	}
	.icon-success:before{
		padding-left: 30px;
		color: #009e4d;
		font-size: 20px;
	}

</style>

<style>
    /*去除输入框 圆角*/
	.common-types-p2 .el-input__inner{
		border-radius: 0;
	}
	.common-types-p2 .el-icon-close{
		position: absolute;
	    right: 10px;
	    top: 0;
	    line-height: inherit;
	}
</style>