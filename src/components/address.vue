<template>
	<div class="address">

		<div class="address-header">{{addOredit ? '新增收货地址' : '编辑收货地址'}}</div>

		<div class="address-wrap">
			<!-- 新增地址 -->
			<p v-if="addOredit">
				<label>所在地区：</label>
				
				<!-- 
					编辑时改变省市区id时会触发change方法
					新增地址 使用change方法
					编辑地址 使用visible-change方法
				-->
                <el-select 
                    v-model="addform.selProvince" 
                    placeholder="请选择省"
                    @change="electCity"
                >
                    <el-option
                        v-for="(item,index1) in addform.province"
                        :label="ellipsis(item.name,10)"
                        :value="item.id"
                        key="index1" 
                    >
                    </el-option>
                </el-select>

                <el-select 
                    v-model="addform.selCity" 
                    placeholder="请选择市"
                    @change="electArea"
                >
                    <el-option
                        v-for="(item,index2) in addform.city"
                        :label="ellipsis(item.name,10)"
                        :value="item.id"
                        key="index2" 
                    >
                    </el-option>
                </el-select>

                <el-select v-model="addform.selArea" placeholder="请选择区/县">
                    <el-option
                        v-for="(item,index3) in addform.district"
                        :label="ellipsis(item.name,10)"
                        :value="item.id"
                        key="index3"
                    >
                    </el-option>
                </el-select>
			</p>
			
			<!-- 编辑地址 -->
			<p v-if="!addOredit">
				<label>所在地区：</label>
				
				<!-- 
					编辑时改变省市区id时会触发change方法
					新增地址 使用change方法
					编辑地址 使用visible-change方法
				-->
                <el-select 
                    v-model="editform.selProvince" 
                    placeholder="请选择省"
                    @visible-change="editCity"
                >
                    <el-option
                        v-for="(item,index1) in addform.province"
                        :label="ellipsis(item.name,10)"
                        :value="item.id"
                        key="index1" 
                    >
                    </el-option>
                </el-select>

                <el-select 
                    v-model="editform.selCity" 
                    placeholder="请选择市"
                    @visible-change="editArea"
                >
                    <el-option
                        v-for="(item,index2) in addform.city"
                        :label="ellipsis(item.name,10)"
                        :value="item.id"
                        key="index2" 
                    >
                    </el-option>
                </el-select>

                <el-select v-model="editform.selArea" placeholder="请选择区/县">
                    <el-option
                        v-for="(item,index3) in addform.district"
                        :label="ellipsis(item.name,10)"
                        :value="item.id"
                        key="index3"
                    >
                    </el-option>
                </el-select>
			</p>

			<p class="textarea">
                <label>详细地址：</label>
                <textarea 
	                maxlength="30" 
	                v-model="addform.address"
	                placeholder="建议您填写详细收货地址，如街道名称，街道门牌号，楼层和房间号等信息"
                ></textarea>
            </p>

            <p class="name">
                <label>收货人姓名：</label>
                <input 
                	type="text" 
                	maxlength="10" 
                	v-model="addform.consigneename" 
                	placeholder="请填写真实姓名，不能为昵称、X小姐、X先生等" 
                />
            </p>

            <p class="name">
                <label>联系方式：</label>
                <input 
	                type="text" 
	                maxlength="11" 
	                v-model="addform.phone"
	                placeholder="收货人的手机号码" 
                />
            </p>

            <p class="button">
                <button @click="saveAdd">保存</button>
                <button @click="emptyAdd">清空</button>
            </p>


		</div>

		<dl class="address-list" v-for="(item,index) in addressList" :key="index">
			<dt>
				<i v-text="ellipsis(item.consignee,6)">姓名</i>
				<i v-text="item.mobile">电话</i>
				<i v-text="ellipsis(item.province_name,3)">省</i>
				<i v-text="ellipsis(item.city_name,4)">市</i>
				<i v-text="ellipsis(item.district_name,4)">区</i>
				<i v-text="ellipsis(item.address,18)">详细地址</i>
			</dt>
			<dd v-if="item.is_default == 1"><em>默认地址</em></dd>
			<dd class="operation">
				<span v-if="item.is_default == 0" @click="toDefault(item.address_id,index)">设为默认地址</span>
				<i @click="editDress(index)">编辑</i>
				<i @click="deleteAddress(item.address_id,index)">删除</i>
			</dd>
		</dl>

	</div>
</template>

<script>
	export default {
		name: 'address',
		data () {
			return {
				addressList:[],			// 地址列表
				addOredit:true, 		// 新增true 编辑false 状态

				addform:{
					province:[],
					city:[],
					district:[],

					selProvince:'',				// 新增地址 省id
					selCity:'',					// 新增地址 市id
					selArea:'',					// 新增地址 区id

					address:'',                 // 添加地址 详细地址 
	                consigneename:'',           // 添加地址 收货人 
	                phone:''                    // 添加地址 收货人电话号码
				},

				editform:{
					id:'',	        			// 地址id

					// 以下数据 与 addform 共用
					// province:[],
					// city:[],
					// district:[],

					selProvince:'',				// 新增地址 省id
					selCity:'',					// 新增地址 市id
					selArea:'',					// 新增地址 区id

					// 以下数据 与 addform 共用
					// address:'',                 // 添加地址 详细地址 
				    // consigneename:'',           // 添加地址 收货人 
				    // phone:''                    // 添加地址 收货人电话号码
				}
			}
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
		},
		mounted(){
			this.getAddressList();
			this.selectAddressInfo();
		},
		methods:{
			// 新增地址
			saveAdd(){
				if(!this.addOredit){
					this.addressEdit();
					return false;
				}
				let _this = this;
				$.ajax({
					url: this.$api.address.create,
					data:{
						province: 	this.addform.selProvince,
					 	city: 		this.addform.selCity,
					 	district: 	this.addform.selArea, 
					 	address: 	this.addform.address, 
					 	consignee: 	this.addform.consigneename, 
					 	mobile: 	this.addform.phone
					},
					dataType: "json",
					type: 'post',
					beforeSend:function(){

						if (_this.addform.selProvince =='' || _this.addform.selCity == '' || _this.addform.selArea == '') {
							_this.$anchu_message.warn('请填写完整的地址信息');
							return false;
						}

						if (_this.addform.address == '') {
							_this.$anchu_message.warn('请填写详细地址');
							return false;
						}

						if (_this.addform.consigneename == '') {
							_this.$anchu_message.warn('请填写收货人姓名');
							return false;
						}

						if (_this.addform.phone == '') {
							_this.$anchu_message.warn('请填写联系方式');
							return false;
						}

						// 手机号验证
	                    const reg = /^1(3|4|5|7|8)\d{9}$/; //验证手机正则(输入前7位至11位)
	                    if(!reg.test(_this.addform.phone)){
	                        _this.$anchu_message.error('手机号码格式错误');
	                        return false;
	                    }
					},
					success: function (res) {
						if (res.error_code == 'FAILED') {
							_this.$anchu_message.error(res.error_msg);
						}else{
							_this.$anchu_message.success('创建成功');
							_this.emptyAdd();
							_this.getAddressList();
						}
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			// 地址编辑
	        addressEdit(){
	            let _this = this;
	            let Data = {
	                id: 		this.editform.id,

	                province: 	this.editform.selProvince, 
	                city: 		this.editform.selCity,
	                district: 	this.editform.selArea, 

	                address: 	this.addform.address, 
	                consignee: 	this.addform.consigneename,
	                mobile: 	this.addform.phone
	            };


	            $.ajax({
	                type: "post",
	                url: this.$api.address.update,
	                data:Data,
	                dataType: "json",
	                beforeSend: function (res) {

	                	if(_this.editform.id = ''){
	                		_this.$anchu_message.warn('请选择编辑地址');
							return false;
	                	}

	                    if (_this.editform.selProvince =='' || _this.editform.selCity == '' || _this.editform.selArea == '') {
							_this.$anchu_message.warn('请填写完整的地址信息');
							return false;
						}

						if (_this.addform.address == '') {
							_this.$anchu_message.warn('请填写详细地址');
							return false;
						}

						if (_this.addform.consigneename == '') {
							_this.$anchu_message.warn('请填写收货人姓名');
							return false;
						}

						if (_this.addform.phone == '') {
							_this.$anchu_message.warn('请填写联系方式');
							return false;
						}

						// 手机号验证
	                    const reg = /^1(3|4|5|7|8)\d{9}$/; //验证手机正则(输入前7位至11位)
	                    if(!reg.test(_this.addform.phone)){
	                        _this.$anchu_message.error('手机号码格式错误');
	                        return false;
	                    }
	                    
	                },
	                success:function(res){
	                    let errMess = res.error_msg;
	                    if(errMess){
	                        _this.$anchu_message.warn(errMess);
	                    }else{
	                        _this.$anchu_message.success('地址编辑成功');
	                    }
	                    _this.getAddressList();

	                    // 切换为新增转态 清空输入框
	                    _this.addOredit = true;
	                    _this.emptyAdd();
	                    
	                }
	            })
	        },

			// 获取地址 省 市 区
	        selectAddressInfo(id = 0){
	            let _this = this;
	            $.ajax({
	                url: this.$api.batchList.getregion,
	                data:{
	                    parent_id:id
	                },
	                dataType:"json",
	                type: 'get',
	                success: function (res) {
	                    let sitData = res.data;
	                    if(!sitData){
	                    	// 地址选择没有分类了
	                    	_this.$anchu_message.error('抱歉，该地址下，商品暂时无法送达');
	                    	return false
	                    }

	                    switch(sitData[0].level){
	                        case 1:
	                            _this.addform.province = sitData;
	                            break;
	                        case 2:
	                            _this.addform.city = sitData;
	                            break;
	                        case 3:
	                            _this.addform.district = sitData;
	                            break;
	                    }
	                }
	            })
	        },

	        // 地址编辑按钮
	        editDress(index){
	        	this.addOredit = false;
	        	const data = this.addressList[index];

	        	// 编辑 获取 市 区
	        	this.selectAddressInfo(data.city);
	        	this.selectAddressInfo(data.province);

	        	// 地址id 省 市 区 id赋值
	        	this.editform.id = data.address_id; 
	        	this.editform.selProvince = Number(data.province);
	        	this.editform.selCity = Number(data.city);
	        	this.editform.selArea = Number(data.district);

	        	// 详细地址 收货人姓名 联系地址
	        	this.addform.address = data.address;
	        	this.addform.consigneename = data.consignee;
	        	this.addform.phone = data.mobile;
	        },

	        // 删除地址
	        deleteAddress(id,index){
				let _this = this;
				$.ajax({
					url: this.$api.address.delete,
					data:{id:id},
					dataType: "json",
					type: 'post',
					success: function (res) {
						if (res.error == 0) {
							_this.$anchu_message.success('删除成功');
							_this.addressList.splice(index,1);
						}else{
							_this.$anchu_message.success('删除失败');
						}
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

	        // 设为默认地址
	        toDefault(id,index){
				let _this = this;
				$.ajax({
					url: this.$api.address.set_default,
					data:{id:id},
					dataType: "json",
					type: 'post',
					success: function (res) {
						if (res.error == 0) {
							_this.$anchu_message.success('修改成功');
							for (let i = 0; i < _this.addressList.length; i++) {
								_this.addressList[i].is_default = 0;
							}
							_this.addressList[index].is_default = 1;
						}
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

	        // 获取地址列表
	        getAddressList(){
				let _this = this;
				$.ajax({
					url: this.$api.goodsDetails.getlist,
					dataType: "json",
					type: 'get',
					success: function (res) {
						_this.addressList = res.data;
					},
					error:function (res) {
						_this.$anchu_message.error('网络繁忙');
					}
				});
			},

			// 清空地址
			emptyAdd(){
				this.addform.selProvince = '';
				this.addform.selCity = '';
				this.addform.selArea = ''; 
				this.addform.address = ''; 
				this.addform.consigneename = ''; 
				this.addform.phone = '';
				this.addform.city = [];
				this.addform.district = [];
				this.addOredit = true;
			},

			// 新增地址 根据省id 获取所有市
	        electCity(value){
	        	if(value == ''){
	        		return false
	        	}
	        	this.selectAddressInfo(value);

	        	// 改变省 清空市 区 的 id 及其数组
	        	this.addform.selCity = '';
	        	this.addform.city = [];
					
	        	this.addform.selArea = '';
	        	this.addform.district = [];
	        },
	        // 新增地址 根据市id 获取所有区
	        electArea(value){
	        	if(value == ''){
	        		return false
	        	}
	        	this.selectAddressInfo(value);
	        	// 改变市 清空区 的 id 及其数组
	        	this.addform.selArea = '';
	        	this.addform.district = [];
	        },

	        // 编辑地址 根据省id 获取所有市 value=false 下拉收起时触发
	        editCity(value){
	        	if(!value){
	        		this.selectAddressInfo(this.editform.selProvince);

	        		// 改变省 清空市 区 的 id 及其数组 （数组 与 新增地址 共用）
	        		this.editform.selCity = '';
	        		this.addform.city = [];

	        		this.editform.selArea = '';
	        		this.addform.district = [];
	        	}
	        },
	        // 编辑地址 根据市id 获取所有区 value=false 下拉收起时触发
	        editArea(value){
	        	if(!value){
	        		this.selectAddressInfo(this.editform.selCity);

	        		// 改变市 清空区 的 id 及其数组 （数组 与 新增地址 共用）
	        		this.editform.selArea = '';
	        		this.addform.district = [];
	        	}
	        },

	        // 详细地址省略过多字符
	        ellipsis(world,n){

	            if(world && world.length > n){
	                return world.slice(0,n) + "..."
	            }else{
	                return world;
	            }
	        }
		}
	}
</script>

<style lang="scss" scoped>
	$class-pre:'address';
	.#{$class-pre}{
		min-height: 380px;
	    background: #fff;
	    float: left;
	    position: relative;
	    width: 1017px;
	    padding: 0 0 98px 41px;
		&-header{
			text-align: left;
		    border-bottom: 1px solid #d8d8d8;
		    padding-bottom: 12px;
		    font-weight: 900;
		}
		&-wrap{
			padding-top: 10px;
			vertical-align: top;
			p{
				padding: 10px 0;
				padding-left: 128px;
				-o-box-sizing: border-box;
			    -ms-box-sizing: border-box;
			    box-sizing: border-box;
			    position: relative;
				label{
					width: 128px;
					display: inline-block;
					text-align: right;
					position: absolute;
					top: 16px;
					left: 0;
					&:before{
						content:'*';
						color: red;
					}
				}
				button{
					border: 1px solid #d8d8d8;
				    background: #f2f2f2;
				    padding: 5px 15px;
				    margin-right: 10px;
				    cursor: pointer;
				    &:focus {
					    outline: 0;
					}
				}
			}
			.name{
				input{
					border: 1px solid #d8d8d8;
				    width: 656px;
				    height: 35px;
				    padding: 0 10px;
				    -o-box-sizing: border-box;
				    -ms-box-sizing: border-box;
				    box-sizing: border-box;
				}
			}
		}
		&-list{
			overflow: hidden;
			line-height: 40px;
		    margin-top: 8px;
		    -o-box-sizing: border-box;
		    -ms-box-sizing: border-box;
		    box-sizing: border-box;
		    border: 2px solid #f3f3f3;
		    cursor: pointer;
			dt{
				float: left;
				margin-right: 20px;
				i{
					margin-left: 10px;
				}
			}
			dd{
				float: left;
				margin-left: 10px;
				i,span{
					margin-right: 10px;
					color: #009e4d;
				}
				span{
				    display: inline-block;
				    height: 25px;
				    line-height: 25px;
				    padding: 0 5px;
				    background: #ebebeb;
				}
				em{
					color: #999;
				    display: inline-block;
				    height: 25px;
				    line-height: 25px;
				    padding: 0 5px;
				    background: #ebebeb;
				    cursor: text;
				}
			}
			.operation{
				display: none;
			}
			&:hover .operation{
				display: block;
			}
		}
	}

	.textarea{
		textarea{
			border: 1px solid #d8d8d8;
		    resize: none;
		    width: 656px;
		    height: 96px;
		    padding: 10px;
		    -o-box-sizing: border-box;
		    -ms-box-sizing: border-box;
		    box-sizing: border-box;
		}
	}
</style>

<style>
    /*重置 选择地址 选择框样式*/
    .address-wrap .el-input__inner{
        height: 35px;
        width: 200px;
        border: 1px solid #d8d8d8;
        font-size: 12px;
        -moz-border-radius: 0;
        -webkit-border-radius: 0;
        border-radius: 0;
        padding-right: 30px!important;
    }
</style>


	