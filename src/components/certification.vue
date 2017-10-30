<template>
    <div class="certification">
    
        <div class="address-header">认证信息<span class="certfy">（{{proofInfo}}）</span></div>

        <!-- 认证成功，审核中 -->
        <div v-if="proofStatus == 1 ||proofStatus == -1" v-show="code != -1">
            <div class="operating-area">
 
                <el-row class="items">
                    <el-col :span="6" class="name">企业类型：</el-col>
                    <el-col :span="18" class="value">
                        <div class="value-bg" v-text="certification.authentication_type == 1?'线上企业':'线下企业'"></div>
                    </el-col>
                </el-row>

                <el-row class="items">
                    <el-col :span="6" class="name">经营类型：</el-col>
                    <el-col :span="18" class="value">
                        <div 
                            class="value-bg" 
                            v-text="manageType(certification.authentication_type,certification.management_type)"
                        >
                        </div>
                    </el-col>
                </el-row>

                <el-row class="items">
                    <el-col 
                        :span="6" 
                        class="name" 
                        v-text="certification.authentication_type ==1 ? '网店名称：' : '实体店名称：'"
                    >
                    </el-col>
                    <el-col :span="18" class="value">
                        <div 
                            class="value-bg" 
                            v-text="certification.merchant_name"
                        >
                        </div>
                    </el-col>
                </el-row>

                <el-row class="items">
                    <el-col 
                        :span="6" 
                        class="name" 
                        v-text="certification.authentication_type ==1 ? '网店链接：' : '实体店地址：'"
                    >
                    </el-col>
                    <el-col :span="18" class="value">
                        <div 
                            class="value-bg" 
                            v-text="certification.website"
                        >
                        </div>
                    </el-col>
                </el-row>

                <el-row class="items">
                    <el-col :span="6" class="name" >联系人姓名：</el-col>
                    <el-col :span="18" class="value">
                        <div class="value-bg" v-text="certification.contacts_name"></div>
                    </el-col>
                </el-row>

                <el-row class="items">
                    <el-col :span="6" class="name" >联系人手机：</el-col>
                    <el-col :span="18" class="value">
                        <div class="value-bg" v-text="certification.contacts_mobile"></div>
                    </el-col>
                </el-row>

                <el-row class="items">
                    <el-col :span="6" class="name">资质照片：</el-col>
                    <el-col :span="18" class="value">
                        <div v-if="photo.length ==1 && photo[0] == '' " class="value-bg">无</div>
                        <img 
                            v-for="(item,index) in photo" 
                            v-if="item != ''" 
                            :src="imgPre + item" 
                            :onerror="imgErr" 
                            class="value-img" 
                        />
                    </el-col>
                </el-row>

            </div>
        </div>

        <!-- 认证未查询到 -->
        <div v-if="proofStatus == -4 || proofStatus == -3 || code == -1" class="verify-fail-wrap">
            <p>
                <img src="/static/images/kongb.png" />
            </p>
            <p style="padding-top:20px;">
                <span>未查询到数据（未认证 或 认证失败），</span>
                <a href="/proof">请点击此处重新认证</a>
            </p>
        </div>

        <!-- 审核失败，重新认证 -->
        <div v-if="proofStatus == -2" class="audit-failure-wrap">
            <p class="audit-img">
                <img src="/static/images/certificationFail.png" />
            </p>
            <p class="audit-failtext">审核失败</p>
            <p class="audit-again">您的认证存在错误信息，请重新认证！</p>
            <p class="audit-phone">如有疑问，请咨询客服或拨打0571-28270936</p>
            <p class="audit-btn">
                <router-link to="/proof" tag="button">重新认证</router-link>
            </p>
        </div>


    </div>
</template>

<script>
  export default {
    name: 'certification',
    data () {
        return {
            imgPre:this.$api.imgPre,
            imgErr:'this.src="/static/images/imgtem.png"',
            proofInfo:'认证信息',
            proofStatus:this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299'),
            certification:[],
            photo:[],
            code:-2,

        }
    },
    created(){
        if(this.proofStatus == 1){
            this.proofInfo = '审核成功';
        }else if(this.proofStatus == -1){
            this.proofInfo = '审核中';
        }else if(this.proofStatus == -2){
            this.proofInfo = '审核未通过';
        }else if(this.proofStatus == -3){
            this.proofInfo = '未查询到数据';
        }else if(this.proofStatus == -4){
            this.proofInfo = '未提交认证';
        }else{
            this.$router.push('/login');
        }
    },
  mounted(){
    this.getMsg()
  },
    methods:{

        // 经营类型
        manageType(type,val){
            if(type == 1){
                
                switch(val){
                    case 1: return '天猫';
                    case 2: return '淘宝';
                    case 3: return '京东';
                    case 4: return '一号店';
                    case 5: return '苏宁';
                    case 8: return '阿里巴巴';
                    case 13: return '拼多多';
                    case 14: return '有赞';
                    case 15: return '微店';
                    case 17: return '自营平台';
                    case 18: return '其他';
                    default: return '其他';
                }

            }else{

                switch(val){
                    case 1: return '门店';
                    case 2: return '企业采购';
                    case 3: return '其他';
                    default: return '其他';
                }

            }
        },

    getMsg(){
      let _this = this;
      $.ajax({
        url: this.$api.user.getUserInfo,
        data:{
          user_id:_this.$cookie.getCookie('a34ea2d96d4239d4d86803bb3cd99788')
        },
        dataType: "json",
        type: 'get',
        success: function (res) {
            if(res.code == -1){
                _this.code = res.code;
                return 
            }
            _this.certification = res.result;
            _this.photo = res.result.photo.split(',');
        },
        error:function (res) {
            _this.$anchu_message.error('网络繁忙');
          }
        });
    }
  }
}
</script>

<style scoped>
  .certification{
    min-height: 380px;
    background: #fff;
    float: left;
    position: relative;
    width: 1017px;
    padding: 0 0 98px 41px;
  }
  .certification .address-header{
    text-align: left;
    border-bottom: 1px solid #D8D8D8; 
    padding-bottom: 12px;
    font-weight: 900;
  }
  .certification .certfy{
    color: #009E4D;
  }
  .certification .operating-area{
    width: 600px;
    margin: 0 auto;
    font-size: 14px;
    
  }
  .certification .items{
    min-height: 35px;
    padding: 10px 0;
  }
  .certification .items:nth-of-type(1) {
    padding: 40px 0 14px 0;
  }
  .certification .items:nth-of-type(1) .value-bg{
    background: #fff;
    border:1px solid #fff;
    font-size: 14px;
    color: #333;
  } 
  .certification .name{
    text-align: right;
    min-height: 30px;
    line-height: 30px;
    color: #999;
  }
  .certification .value{
    text-align: left;
    padding: 0 10px;
    width: 420px;
    color: #666; 
  }
  .certification .value .value-bg{
    min-height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border:1px solid #d8d8d8;
    background: #f2f2f2;
  }
  .certification .value-img{
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .verify-fail-wrap{
    text-align: center;
    padding:50px 0 30px;
    font-size: 14px;
  }
  .verify-fail-wrap p a{
    text-decoration: underline;
    color: #009e4d;
  }
  .verify-fail-wrap p img{
    width: 110px;
    height:auto;
  }
  .audit-failure-wrap{
    text-align: center;
    padding:90px 0 30px;
    font-size: 16px;
  }
  .audit-failure-wrap .audit-failtext{
    margin-top: 48px;
    font-size: 20px;
    color: #009e4d;
  }
  .audit-failure-wrap .audit-again{
    color: #333;
    margin-top: 20px;
  }
  .audit-failure-wrap .audit-phone{
    color: #999;
    margin-top: 14px;
  }
  .audit-failure-wrap .audit-btn button{
    width: 200px;
    height: 42px;
    margin-top: 36px;
    font-size: 20px;
    background: #009E4D;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
  }
</style>