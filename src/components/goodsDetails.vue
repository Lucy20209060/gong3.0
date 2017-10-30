<template>
  <div class="goodsDeyails"  @click="clickSelectAdd($event)">

    <tIndexHeader :inputValue="carNumber" ref="childMethod"></tIndexHeader>

    <section class="no-find-wrap" v-if="error==1">
        <img src="/static/images/not-find.png" />
        <p>抱歉，暂无商品信息<i>&nbsp;&nbsp;&nbsp;{{settimenum}} </i> 秒后跳转至首页</p>
    </section>

    <section class="details-goods-wrap" v-if="error == 0">
        <div class="goods-img-wrap">
            <!-- 大图 -->
            <div class="big-img-wrap">
              <img v-lazy="imgPre + bigImgUrl" />
            </div>
            <!-- 小图 -->
            <div class="small-img-wrap">
                <!-- left-button -->
                <div class="left-btn" @click="rightSlide">
                    <i class="iconfont icon-turnleft"></i>
                </div>
                
                <!-- 缩略图 -->
                <div class="small-img-list">
                    <ul class="small-img-list-ul" v-bind:style="{ width: ulWidth+'px'}">
                        <li 
                            v-for="(img,index) in bigImg" 
                            key="index" 
                            @click="detailclick(img)"
                        >
                            <img v-lazy="imgPre+img" />
                        </li>
                    </ul>
                </div>
                <!-- right-button -->
                <div class="right-btn" @click="leftSlide">
                    <i class="iconfont icon-turnleft"></i>
                </div>
            </div>
        </div>
        
        <!-- 商品信息部分 -->
        <dl class="goods-info-wrap">
            <dt v-text="goodsName"></dt>
            <dd class="goods-remark" v-text="goodsRemark"></dd>
            <!-- 价格 和 id -->
            <dd class="goods-id-price">
                <i>代发价 :</i>
                <em>
                    <span class="goods-price" v-if="price != -1">￥{{price}}</span>
                    <span class="goods-alert" v-if="price == -1">认证可见</span>
                </em>
            </dd>
            <dd class="goods-price-wrap">
                <i>商品ID :</i>
                <em>{{goodsId}}</em>
            </dd>
            <!-- 规格部分 -->
            <dd 
                class="infos-wrap standard-wrap" 
                v-if="filterSpec.label !== '默认'"
            >
                <i style="padding-top:11px;font-size:14px;">规&nbsp;&nbsp;&nbsp;格：</i>
                <p>
                    <a herf="javascrpt:;"
                        class="standard-btn" 
                        v-bind:class="{specActive:index==classSign}"
                        v-for="(spec,index) in filterSpec.items" 
                        key="index"
                        v-text="spec.item"
                        @click="choseSpec(index,spec.item_id)">规格
                    </a>
                </p>
            </dd>

            <!-- 配送区域 -->
            <dd class="infos-wrap infos-wrap-speci" style="font-size:14px;">
                <i>运&nbsp;&nbsp;&nbsp;费：</i>
                <div 
                    class="selected-address"
                    @mouseenter="mouseenter" 
                    @mouseleave="mouseleave"
                >

                    <div ref="addressDiv1" class="selected-address-div1">
                        <span>
                            <i v-text="ellipsis(selecedSite.proName,5)">**省</i>
                            <i v-text="ellipsis('/'+selecedSite.citName,5)">**市</i>
                            <i v-text="ellipsis('/'+selecedSite.disName,5)">**区</i>
                        </span>
                        <i ref="rotates"></i>
                    </div>

                    <b>{{freightInfo}}</b>
                    
                    <!-- 选择地址框 -->
                    <dl 
                        class="selected-address-div2" 
                        v-if="selectedStatus" 
                    >
                        <!-- 常用地址 -->
                        <dt 
                            @click="showExistingAdd" 
                            class="pointer"
                            v-if="addList.length != 0"
                        >
                            <span>常用地址</span>
                            <i ref="existing"></i>
                        </dt>
                        <dd 
                            class="own-add" 
                            v-for="(item,index) in addList" 
                            key="index"
                            :class="{existingAdd:index==existingSign}"
                            @click="selectExistingAddress(index)"
                            v-if="existingAddStatus"
                        >
                            {{item.province_name}}{{item.city_name}}{{item.district_name}}{{item.address}}
                        </dd>

                        <dt @click="showNewAdd" class="pointer">
                            <span>选择新地址</span>
                            <i ref="newAdd"></i>
                        </dt>
                        <dd class="select-wrap" v-if="newAddStatus">
                            <p class="select-wrap-a">
                                <a
                                    href="javascript:;" 
                                    v-text="selectNewAdd[0].name"
                                    v-if="NewAdd0Status"
                                    :class="{addActive:0==addActiveSign}"
                                    @click="selectAddress(0)"
                                >省份</a>

                                <a
                                    href="javascript:;" 
                                    v-text="selectNewAdd[1].name==''?'选择':selectNewAdd[1].name"
                                    v-if="NewAdd1Status"
                                    :class="{addActive:1==addActiveSign}"
                                    @click="selectAddress(1)"
                                >城市</a>

                                <a
                                    href="javascript:;" 
                                    v-text="selectNewAdd[2].name==''?'选择':selectNewAdd[2].name"
                                    v-if="NewAdd2Status"
                                    :class="{addActive:2==addActiveSign}"
                                    @click="selectAddress(2)"
                                >县区</a>

                            </p>
                            <p class="select-add-a">
                                <a 
                                    href="javascript:;" 
                                    v-for="(item,index) in showSelectNewAdd"
                                    key="index"
                                    v-if="showSelectNewAdd.length != 0"
                                >
                                    <span 
                                        class="site-span"
                                        v-text="ellipsis(item.name,4)"
                                        @click.stop="tapNewAdd(item)"
                                    >
                                    </span>
                                </a>

                                <i v-if="showSelectNewAdd.length == 0">没有更多地区</i>
                            </p>
                        </dd>
                    </dl>
                </div>
                 
            </dd>
            
            <dd class="infos-wrap" style="font-size:14px;margin-bottom:15px;">
                <i>数&nbsp;&nbsp;&nbsp;量：</i>
                <p>
                    <template>
                        <el-input-number size="small" v-model="num1" :min="1" :max="countNum">
                        </el-input-number>
                    </template>
                </p>
            </dd>
            <dd class="infos-wrap">
                
                <p>
                    <!-- 加入购物车按钮 -->
                    <a 
                        ref="addBtn"
                        id="details-add-btn" 
                        href="javascript:;"
                        @click="addcart"
                        v-if="countNum > 0 && is_on_sale != 0"
                    >
                        <i class="iconfont icon-gouwuche"></i>
                        <span>加入购物车</span>
                    </a>
                    <!-- 卖光光按钮显示 -->
                    <a 
                        style="cursor:not-allowed;" 
                        id="details-download-btn" 
                        href="javascript:;" 
                        v-if="countNum<=0 && is_on_sale != 0"
                    >
                       <i style="left:33%;">卖光光</i>
                    </a>
                    <!-- 已下架按钮显示 -->
                    <a 
                        style="cursor:not-allowed;" 
                        id="details-download-btn" 
                        href="javascript:;" 
                        v-if="is_on_sale == 0"
                    >
                        <i style="left:33%;">已下架</i>
                    </a>
                    <!-- 下载图片按钮 -->
                    <a  
                        id="details-download-btn" 
                        v-bind:href="downloadUrl" 
                        class="downTrigger" 
                        @click="downimg"
                    >
                        <i class="iconfont icon-xiazai-copy"></i>
                        <span>下载商品图片</span>
                    </a>

                </p>
            </dd>
        </dl>

        <div style="float:left;width: 500px;height:50px;padding-left: 62px;">
            
            <transition name="slide-fade">
                <div class="ball" v-if="animationShow">
                    <img v-lazy="imgPre + bigImgUrl" />
                </div>
            </transition>
        </div>




    </section>


    <dl class="word-info-wrap" v-if="error==0">
        <dt>
            <span>参数详情</span>
        </dt>
        <dd class="producing-area">

            <p>
                <span v-for="(item2,index) in detail.attrs" v-if="item2 != null">
                    <i class="iconfont" :class="attrsClass(index)"></i>
                    <i class="producing-area-i1" v-html="attrsWord(index)"></i>
                    <i class="producing-area-i2">{{item2}}</i>
                </span>
            </p>

        </dd>
    </dl>

    <dl class="word-info-wrap" v-if="error==0">
        <dt>
            <span>商品详情</span>
        </dt>
        <dd class="details-imgs-wrap" v-html="goodsContent"></dd>
    </dl>
    
    <!-- 悬浮导航 -->
      <fixedNav></fixedNav>

      <service :goodsInfo="detail" page="商品详情页"></service>

    <IndexFooter></IndexFooter>

  </div>
</template>

<script>
import tIndexHeader from '@/components/common/index_header'
import IndexFooter from '@/components/common/index_footer'
import fixedNav from '@/components/common/fixed_nav'
import service from '@/components/common/service'

export default {
    name: 'goodsDeyails',
    data () {
        return {
            error:0,                                // 是否有该商品
            imgPre:this.$api.imgPre,
            classSign:0,
            detail:{},              // 商品详情
            bigImgUrl:[],           // 图片数组

            specKey:'',             // 选中的规格
            countNum:1000,          // 选中的规格对用的库存
            price:0,                // 选中的规格对用的价格
            string_goods_price:'',  // 所有的规格对应的 价格 库存
            num1:1,                 // 购买数量

            positionLeft:0,
            ulWidth:0,

            carNumber:0,                  // 购物车中的数量
            downloadUrl:'javascript:;',   // 图片下载链接

            selectedStatus:false,         // 选择地址是否出现 默认隐藏
            tapSelected:false,            // 是否点击过选择区域

            existingAddStatus:true,       // 常用地址显示 与 隐藏 默认显示
            existingSign:-1,              // 选择常用地址标志

            newAddStatus:true,            // 选择新地址 显示 与 隐藏 默认显示

            selecedSite:{                  // 选择完毕的地址 默为 浙江 杭州 滨江
                proId:'12596',
                proName:'浙江省',

                citId:'12597',
                citName:'杭州市',

                disId:'12652',
                disName:'滨江区'
            },

            NewAdd0Status:true,         // 省份 城市 县区 的 显示隐藏状态
            NewAdd1Status:true,
            NewAdd2Status:true,


            selectNewAdd:[                      // 正在选择的 新地址信息 暂存地址
                {
                    name:'浙江省',
                    id:'12596',
                    arr:[]
                },
                {
                    name:'杭州市',
                    id:'12597',
                    arr:[]
                },
                {
                    name:'滨江区',
                    id:'12652',
                    arr:[]
                }
            ],
            showSelectNewAdd:[],                // 展示的地址 可能是  省 市 区 
            addActiveSign:2,                   // 点击 省 市 区 标志

            is_matching:true,                  // 配送地址是否匹配

            goodsName:'',                      // 商品名
            goodsRemark:'',                    // 商品描述
            goodsId:'',                        // 商品ID
            filterSpec:[],                     // 商品规格
            is_on_sale:'',                     // 是否卖完
            goodsContent:'',                    // 商品图片描述
            bigImg: [],                         //图片列表

            addList:[],                        // 常用地址数组

            settimenum:5,                       //无商品时 倒计时

            freightInfo:'包邮',                  // 运费信息
            switch1: false,                     //轮播图开关
            picNum: 0,                           //缩略图数量
            clickNum: 0,                         //点击次数

            animationShow:false

        }
    },
    components: {
        tIndexHeader,
        IndexFooter,
        fixedNav,
        service
    },
    watch:{
        // 实时监听库存量 最大购买数量 <= 库存
        countNum:{
            handler(curval,oldval){
                if(curval < this.num1){
                    this.num1 = curval;
                }
            },
            deep:true
        },
        // 实时监听选择框 出现 隐藏 状态
        selectedStatus(curval,oldval){
            if(curval){
                this.$refs.rotates.setAttribute('class','rotatetransform');
                this.$refs.addressDiv1.style.borderBottom='0';
                // this.selectedAddress();
            }else{
                this.$refs.rotates.removeAttribute('class');
                this.$refs.addressDiv1.removeAttribute('style');

                // 隐藏后选择区域 初始化 常用地址 和 选择地址 让其下次出现
                this.existingAddStatus = true;
                this.newAddStatus = true;

                // // 地址选择后 匹配地址
                // this.isMatching();
            }
            deep:true
        },
        // 实时监听常用地址 出现 隐藏 状态
        existingAddStatus(curval,oldval){
            if(curval){
                this.$refs.existing.removeAttribute('class');
            }else{
                
                this.$refs.existing.setAttribute('class','rotatetransform');
            }
            deep:true
        },
        // 实时监听选择新地址 出现 隐藏 状态
        newAddStatus(curval,oldval){
            if(curval){
                this.$refs.newAdd.removeAttribute('class');
            }else{
                this.$refs.newAdd.setAttribute('class','rotatetransform');
            }
            deep:true
        }
    },
    mounted(){
        this.details();
        if(this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299') == 1){
            this.downloadUrl = this.$api.DownloadGoodsZip + '&goods_id=' + this.$route.query.id;
        }else{
            this.downloadUrl = 'javascript:;'
        }

        $('body,html').animate({scrollTop:0},10);
    },

    destroyed(){
        document.title = '安厨供应链-全国专业的农产品一站式供应平台';
    },

    methods:{

        // 获取运费
        getFreight(){
            const _this = this;
            $.ajax({
                type: "post",
                url: this.$api.goodsDetails.getShippingPrice,
                data:{
                    id:this.$route.query.id,
                    province:this.selecedSite.proId,
                    city:this.selecedSite.citId,
                    district:this.selecedSite.disId,
                },
                dataType: "json",
                success:function(res){

                    const data = res.data;

                    if(data.is_ship == -1){
                        _this.is_matching = false;
                    }else{
                        _this.is_matching = true;
                    }

                    _this.$nextTick(function(){

                        if(!_this.is_matching){

                            _this.$anchu_message({
                                message: '该地区无法送达，请注意下方的配送范围说明',
                                type: 'warn'
                            });

                            if(_this.countNum > 0 && _this.is_on_sale != 0){
                                if(_this.$refs.addBtn){
                                    _this.$refs.addBtn.setAttribute('class','addBtn-active');
                                }
                                
                            }

                        }else{
                            if(_this.$refs.addBtn){
                                _this.$refs.addBtn.removeAttribute('class');  
                            }
                            
                        }

                    })

                    if(data.is_free_shipping == 1){
                        _this.freightInfo = `包邮`;
                        return
                    }

                    let price = Number(data.sprice) + Number(data.add_sprice);

                    if( price > 0 ){
                        _this.freightInfo = `运费${Number(data.sprice)}元起(运费以实际价格结算为准)`;
                    }else if(price == 0){
                        _this.freightInfo = `包邮`;
                    }

                },
                error:function(err){
                    // console.log(err)
                }
            })
        },

        // 检测地址是否匹配
        isMatching(){
            let selectAdd_arr = [];
            // 去除选择地址数组中的空元素
            for(let value of this.selectNewAdd){
                value.id == '' ? '' : selectAdd_arr.push((value.id).toString());
                
            }
            // 地址匹配  true-地址匹配  false-地址不匹配
            if(this.detail.goods.shipping_area_ids == ''){

                this.is_matching = false;

            }else if(this.detail.goods.shipping_area_ids == 'all'){

                this.is_matching = true;

            }else{

                let arrTem1 = this.detail.goods.shipping_area_ids.split(",");

                // 合并数组 去重
                let arr = selectAdd_arr.concat(arrTem1);
                arr = [...new Set(arr)];
                // 数组没有相同元素 即不匹配
                arr.length == selectAdd_arr.length + arrTem1.length
                ?this.is_matching = false
                :this.is_matching = true;
            }


            this.$nextTick(function(){

                if(!this.is_matching){

                    this.$anchu_message({
                        message: '该地区无法送达，请注意下方的配送范围说明',
                        type: 'warn'
                    });

                    if(this.countNum > 0 && this.is_on_sale != 0){
                        if(this.$refs.addBtn){
                            this.$refs.addBtn.setAttribute('class','addBtn-active');
                        }
                        
                    }

                }else{
                    if(this.$refs.addBtn){
                        this.$refs.addBtn.removeAttribute('class');    
                    }
                    
                }

            })

        },

        // 点击下 选择框的出现 与 隐藏
        clickSelectAdd(e){

            if(!e.path){
                return false;
            }

            // 点击了常用地址
            if(e.path[0].className === 'own-add existingAdd' || e.path[0].className === 'own-add'){
                this.selectedStatus = false;
                // this.isMatching();
                return false;
            }

            for(let doc of e.path){

                if(doc.className === 'selected-address-div1'){
                    this.selectedStatus = true;
                    this.tapSelected = true;
                    return false;
                }
                else if(doc.className === 'selected-address-div2'){
                    this.selectedStatus = true;
                    this.tapSelected = true;
                    return false;
                }
                else{
                    // 如果点击过选择区域 点击外部区域 隐藏选择区域
                    if(this.tapSelected){
                        this.selectedStatus = false;
                        this.tapSelected = false;
                    }
                }
            }
        },

        // 点击 省份 城市 县区
        selectAddress(index){
            this.addActiveSign = index;

            if(index == 0){             // 点击了 '省份'

                this.getregion(0);
                this.NewAdd1Status = false;
                this.NewAdd2Status = false;

            }else if(index == 1){       // 点击了 '城市'

                this.getregion(this.selectNewAdd[0].id);
                this.NewAdd2Status = false;

            }else{                      // 点击了 '县区'
                this.getregion(this.selectNewAdd[1].id);
            }

        },

        // 点击选择省 市 区
        tapNewAdd(value){

            // 清除 默认地点的默认样式
            this.existingSign = -1;

            if(value.level == 1){           // 选择了某个 省

                this.selectNewAdd[0].name = value.name;
                this.selectNewAdd[0].id = value.id;
                this.getregion(value.id);               // 获取省对应的 市
                this.addActiveSign = 1;

                // 清空城市
                this.NewAdd1Status = true;
                this.selectNewAdd[1].name = '';
                this.selectNewAdd[1].id = '';

                // 清空 县区 并隐藏
                this.NewAdd2Status = false;
                this.selectNewAdd[2].name = '';
                this.selectNewAdd[2].id = '';



            }else if(value.level == 2){     // 选择了某个 市

                this.selectNewAdd[1].name = value.name;
                this.selectNewAdd[1].id = value.id;

                this.getregion(this.selectNewAdd[1].id);
                this.addActiveSign = 2;

                // 清空 县区 
                this.NewAdd2Status = true;
                this.selectNewAdd[2].name = '';
                this.selectNewAdd[2].id = '';


            }else if(value.level == 3){     // 选择了某个 区

                this.selectNewAdd[2].name = value.name;
                this.selectNewAdd[2].id = value.id;
                // 点击了 具体的 某个区
                this.selectedStatus = false;

                // this.selecedSite = this.selectNewAdd;


                this.selecedSite.proId = this.selectNewAdd[0].id;
                this.selecedSite.proName = this.selectNewAdd[0].name;

                this.selecedSite.citId = this.selectNewAdd[1].id;
                this.selecedSite.citName = this.selectNewAdd[1].name;

                this.selecedSite.disId = this.selectNewAdd[2].id;
                this.selecedSite.disName = this.selectNewAdd[2].name;

                // 获取运费
                this.getFreight();
            }
            
        },

        // 获取省 市 区
        getregion(id = this.selectNewAdd[1].id){
            const _this = this;
            $.ajax({
                type: "post",
                url: this.$api.goodsDetails.getregion,
                async:false,
                data:{
                    parent_id:id
                },
                dataType: "json",
                success:function(res){

                    if(res.data){
                        // 存储 省 市 区信息
                        _this.showSelectNewAdd = res.data;
                    }else{
                        _this.showSelectNewAdd = [];
                    }

                    
                },
                error:function(err){
                    // console.log(err)
                }
            })
        },

        // 显示 与 隐藏 常用地址
        showExistingAdd(){
            this.existingAddStatus = !this.existingAddStatus;
        },
        showNewAdd(){
            this.newAddStatus = !this.newAddStatus;
        },

        // 点击选择常用地址
        selectExistingAddress(index){
            this.existingSign = index;
            const   addTem = this.addList[index];
            
            this.selectNewAdd = [
                {
                    name:addTem.province_name,
                    id:addTem.province,
                    arr:[]
                },
                {
                    name:addTem.city_name,
                    id:addTem.city,
                    arr:[]
                },
                {
                    name:addTem.district_name,
                    id:addTem.district,
                    arr:[]
                }
            ];


            this.selecedSite.proId = this.selectNewAdd[0].id;
            this.selecedSite.proName = this.selectNewAdd[0].name;

            this.selecedSite.citId = this.selectNewAdd[1].id;
            this.selecedSite.citName = this.selectNewAdd[1].name;

            this.selecedSite.disId = this.selectNewAdd[2].id;
            this.selecedSite.disName = this.selectNewAdd[2].name;


            // 获取运费
            this.getFreight();
            // 地址选择后 匹配地址
            // this.isMatching();
            // 隐藏选择框
            this.selectedStatus = false;

            // 点击常用地址后 还原默认配置
            this.NewAdd0Status = true;
            this.NewAdd1Status = true;
            this.NewAdd2Status = true;
            this.addActiveSign = 2;
            this.getregion(this.selectNewAdd[1].id);
        },

        // 获取常用地址
        getAdd(){
            const _this = this;
            $.ajax({
                type: "post",
                url: this.$api.goodsDetails.getlist,
                dataType: "json",
                success:function(res){
                    if(res.data){
                        _this.addList = res.data;

                        for(let i in _this.addList){

                            let value = _this.addList[i];

                            if(value.is_default == 1){

                                _this.existingSign = i;

                                
                                _this.selectNewAdd = [
                                    {
                                        name:value.province_name,
                                        id:value.province,
                                        arr:[]
                                    },
                                    {
                                        name:value.city_name,
                                        id:value.city,
                                        arr:[]
                                    },
                                    {
                                        name:value.district_name,
                                        id:value.district,
                                        arr:[]
                                    }
                                ];


                                _this.selecedSite.proId = _this.selectNewAdd[0].id;
                                _this.selecedSite.proName = _this.selectNewAdd[0].name;

                                _this.selecedSite.citId = _this.selectNewAdd[1].id;
                                _this.selecedSite.citName = _this.selectNewAdd[1].name;

                                _this.selecedSite.disId = _this.selectNewAdd[2].id;
                                _this.selecedSite.disName = _this.selectNewAdd[2].name;


                            }
                        }
                    }else{
                        _this.addList = [];

                    }
                    _this.getregion();
                    _this.getFreight();
                    // _this.isMatching();
                },
                error:function(err){
                    // console.log(err)
                }
            })
        },

        // 省略过长字符串
        ellipsis(value,num){
            // 当没有选择的时候 返回空 去掉'/'
            if(value == '/'){
                return '';
            }
            if(value.length >num){
                return value.slice(0,num) + '...';
            }else{
                return value;
            }
        },

        // 滑入 出现选择
        mouseenter(){
            this.selectedStatus = true;
        },

        // 滑出 隐藏选择
        mouseleave(){
            if(!this.tapSelected){
                this.selectedStatus = false;
            }
        },

        // 返回规格参数对应的iconfont
        attrsClass(value){
            switch(value){
                case '配送范围':    return 'icon-spec-par-1';
                case '发货地点':    return 'icon-spec-par-2';
                case '温馨提示':    return 'icon-spec-par-3';
                case '储存方式':    return 'icon-spec-par-4';
                case '食用方法':    return 'icon-spec-par-5';
                case '保质期限':    return 'icon-spec-par-6';
                case '生产日期':    return 'icon-spec-par-7';
                case '规格':        return 'icon-spec-par-8';
                case '品名':        return 'icon-spec-par-9';
                default:            return 'icon-spec-par-8';
            }
        },

        // 中文之间的放置空格
        attrsWord(value){
            
            if(value.length == 2){
                // 两个汉字相当于 6个&nbsp;
                return value.slice(0,1)+'<i style="visibility:hidden;">安厨</i>'+value.slice(1,2);
            }else{
                return value;
            }

        },

        // 下载图片
        downimg(){
          if(this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299') != 1){

            this.$anchu_message({
                message: '请先认证登录',
                type: 'warn'
            });

            let nowHash = this.$route.fullPath;
            this.nowPath = nowHash;
            this.$store.state.previousPath = this.nowPath;
            this.$store.state.downPath = 0;
            this.$router.push('/login');

          }

        },

        // 选择规格
        choseSpec(index,id){
            this.classSign = index;
            // 选择的商品规格
            this.specKey = id;
            // 商品价格
            this.price = this.string_goods_price[id].price;
            // 商品剩余数量
            this.countNum = Number(this.string_goods_price[id].store_count);
        },

        // 加入购物车
        addcart(){
            
        	let _this = this;
        	$.ajax({
        		type: "get",
        		url: this.$api.cart.add,
        		data:{
        			goods_id:_this.$route.query.id,
        			goods_num:_this.num1,
        			goods_spec:_this.specKey,
                    province:this.selecedSite.proId,
                    city:this.selecedSite.citId,
                    district:this.selecedSite.disId
        		},

                beforeSend: function () {
                        
                    if(_this.$cookie.getCookie('b61a9d162ac1dfaa22d0f05bdc7f6299') != 1){
                        let nowHash = _this.$route.fullPath;
                        _this.nowPath = nowHash;
                        _this.$store.state.previousPath = _this.nowPath;
                        _this.$store.state.nextNum = 0;
                        _this.$router.push('/login');

                        _this.$anchu_message({
                            message: '请先认证登录',
                            type: 'warn'
                        });
                        return false;
                    };

                    if(!_this.is_matching){
                        return false;
                    }

                },
                dataType: "json",
                success:function(res){
                    switch(res.status){
                        case 1:
                            // 加入购物车动画
                            _this.animationShow = !_this.animationShow;

                            _this.$refs.childMethod.getCarNum();
                            _this.$refs.childMethod.recievecartNum();
                            
                            _this.string_goods_price[_this.specKey].store_count -= _this.num1;
                              break;
                            default:
                                _this.$anchu_message.error(res.msg);
                        }
                    }
                });

            // }
            
        },

        // 获取商品详情
        details(){
          var _this = this;
          $.ajax({
              type: "post",
              url: this.$api.goodsDetails.info,
              data:{
                id:_this.$route.query.id
              },
              dataType: "json",
              success:function(res){
                _this.detail = res.data;

                _this.error = res.error;

                if(res.error == 1){

                    let settime = setInterval(()=>{

                        if(_this.settimenum == 0){
                            clearInterval(settime)
                            _this.$router.push('/');
                        }else{
                            _this.settimenum --;
                        }

                    },1000);

                    return false;
                }

                // 获取常用地址 
                _this.getAdd();

                // 商品名
                _this.goodsName = res.data.goods.goods_name;
                // 将title设置为商品名
                document.title = _this.goodsName;

                // 商品描述
                _this.goodsRemark = res.data.goods.goods_remark;
                // 商品ID
                _this.goodsId = res.data.goods.goods_id;
                // 是否卖完
                _this.is_on_sale = res.data.goods.is_on_sale;
                // 商品图片描述
                _this.goodsContent = res.data.goods.goods_content;
                

                if(res.data.filter_spec.length != 0 ){
                  // 默认规格
                  _this.filterSpec = res.data.filter_spec[0];
                  _this.specKey = res.data.filter_spec[0].items[0].item_id;

                  // 规格不同对应的价格字符串
                  _this.string_goods_price = JSON.parse(res.data.spec_goods_price);

                  // 默认规格 默认价格
                  _this.price = _this.string_goods_price[_this.specKey].price;

                  // 默认数量
                  _this.countNum = Number(_this.string_goods_price[_this.specKey].store_count);
                }else{
                  _this.countNum = Number(res.data.goods.store_count);
                  _this.price = res.data.goods.price;
                }
                
                // 大图默认第一张图
                // _this.bigImgUrl = res.data.goods_images_list[0].image_url;

                //大图url
                _this.bigImgUrl = res.data.goods.original_img;

                //比对大图和小图,图片去重
                let imglist = res.data.goods_images_list;
                let bigimg = res.data.goods.original_img;
                for(var i = 0,len = imglist.length; i<len;i++) {                  
                    if(bigimg != imglist[i].image_url){
                        _this.bigImg.push(imglist[i].image_url);

                    }
                }
                _this.bigImg.unshift(bigimg);

                //设置图片外层宽度
                // _this.ulWidth = res.data.goods_images_list.length * 68; 
                _this.picNum  = _this.bigImg.length;
                _this.ulWidth = _this.bigImg.length * 68;
              }
          });
        },
        leftSlide(){
            var that = this;
                
                let $left = parseInt($('.small-img-list-ul').css('left')),
                $right = parseInt($('.small-img-list-ul').css('right'));

                if(that.ulWidth <= 384){
                   
                    return false;
                  }else if(that.clickNum < that.picNum - 5){
                    that.clickNum ++;
                    that.positionLeft -= 68;
                    $('.small-img-list-ul').animate({'left' : that.positionLeft + 'px'});
                    
                  }else{
                    that.switch1 = false;
                    $('.small-img-list-ul').animate({'left' : -(that.ulWidth-340)});
                  }
        },
        rightSlide(){
           
            var that = this;
            let $left = parseInt($('.small-img-list-ul').css('left')),
            $right = parseInt($('.small-img-list-ul').css('right'));
              if(that.ulWidth <= 384){
                return false;
              }else if(that.clickNum > 0 && that.clickNum <= that.picNum - 5 ){
                that.clickNum --;
                that.positionLeft += 68;
               
                $('.small-img-list-ul').animate({'left' : that.positionLeft + 'px'});

                
              }else{
                $('.small-img-list-ul').animate({'left' : 0});
              }
            

        },

        // 点击更换大图
        detailclick(url){
          this.bigImgUrl = url;
        }
    }
}

</script>

<style scoped>
/*加入购物车动画*/
.ball{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    opacity: 0;
}
.ball img{
    display: inline-block;
    width: 100%;
    height: 100%;
}

.slide-fade-enter-active {
  transition: all .3s linear;
  animation: moveball-in 1s;
}

.slide-fade-leave-active{
    transition: all .3s linear;
    animation: moveball-in 1s;
}

@keyframes moveball-in {
    0% {
        transform: translate(30px,-30px) scale(1);
        -ms-transform: translate(30px,-30px) scale(1);
        -moz-transform: translate(30px,-30px) scale(1);
        -webkit-transform: translate(30px,-30px) scale(1);
        -o-transform: translate(30px,-30px) scale(1);
        opacity:1;
    }
/*    50% {
        transform: translate(350px,-400px) scale(1.3);
        opacity:1;
    }*/
    100% {
        transform: translate(700px,-550px) scale(.3);
    }
}

/* 2.0版 注释 */
.goods-price-wrap{
    margin-top: 12px;
}
.goods-price-wrap i{
    height: 42px;
    line-height: 38px;
    margin-top: 10px;
    position: relative;
    overflow: visible!important;
    color: #999;
    font-size: 14px;
}
.goods-price-wrap em{
    color: #999;
    padding-left: 26px;
}
.no-find-wrap{
    width: 100%;
    text-align: center;
    padding: 80px 0 200px;
    color: #333;
    font-size: 14px;
}
.no-find-wrap i{
    color: #009e4d;
    font-size: 30px;
    font-weight: 900;
}
.no-find-wrap img{
    padding-bottom: 40px;
    display: inline-block;

}
.select-wrap-a{
    position: relative;
    border-left: 1px solid #d8d8d8;
    overflow: hidden;
}
.select-wrap-a:after{
    content:".";
    display:block;
    height:0;
    clear:both;
    overflow:hidden;
    visibility:hidden;
}
.select-wrap-a:before{
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    background: #d8d8d8;
    right: 0;
    bottom: 0;
    z-index: -1;
}

.select-wrap-a a{
    float: left;
    width: 70px;
    height: 26px;
    border: 1px solid #d8d8d8;
    border-left-color: transparent;
    text-align: center;
    line-height: 26px;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
}
.select-wrap-a .addActive{
    border-top: 2px solid #009e4d;
    border-bottom-color:#fff;
}
.select-add-a{
    overflow: hidden;
    padding-top: 8px;
}
.select-add-a i{
    display: inline-block;
    width: 100%;
    text-align: center;
    padding: 10px 0;
}
.select-add-a a{
    float: left;
    width: 25%;
    height: 26px;
    overflow: hidden;
}
.select-add-a a span:hover{
    background: #009e4d;
    color: #fff;
}
.selected-address-div2 .existingAdd{
    color: #009e4d;
}
.own-add{
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.selected-address-div2 dd{
    width:100%;
    font-size: 14px;
    color: #666;
    line-height: 28px;
    float: left;
}
.selected-address .selected-address-div2 dt{
    font-size: 18px;
    color: #999;
    line-height: 36px;
    float: left;
    width: 100%;
}
.selected-address-div2 dt span{
    float: left;
    font-weight: 100;
}
.selected-address-div2 dt i{
    float: right;
    width: 20px;
    height: 36px;
    background:url('/static/images/arr-open.png') no-repeat center;
    transition: .2s ease;
    -ms-transition: .2s ease;
    -moz-transition: .2s ease;
    -webkit-transition: .2s ease;
    -o-transition: .2s ease;

    transform-origin:50% 50%;
    -ms-transform-origin:50% 50%;
    -moz-transform-origin:50% 50%;
    -webkit-transform-origin:50% 50%;
    -o-transform-origin:50% 50%;
}

.goods-info-wrap .infos-wrap-speci{
    height: 42px;
    line-height: 38px;
    margin: 10px 0 5px;
    position: relative;
    overflow: visible!important;
}

.selected-address-div2{
    position: absolute;
    width: 362px;
    left: 0;
    top: 28px;
    z-index: 99;
    border:1px solid #d8d8d8;
    background: #fff;
    padding: 8px;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box; 
}
.selected-address-div1{
    border:1px solid #d8d8d8;
    display: inline-block;
    height: 20px;
    line-height: 20px;
    margin: auto 0;
    padding: 0 10px;
    cursor: pointer;
    position: relative;
    z-index: 999;
    background: #fff;
}

.selected-address div > i{
    display: inline-block;
    width: 20px;
    height: 10px;
    background:url('/static/images/arr-close.png') no-repeat center;

    transition: .2s ease;
    -ms-transition: .2s ease;
    -moz-transition: .2s ease;
    -webkit-transition: .2s ease;
    -o-transition: .2s ease;

    transform-origin:50% 50%;
    -ms-transform-origin:50% 50%;
    -moz-transform-origin:50% 50%;
    -webkit-transform-origin:50% 50%;
    -o-transform-origin:50% 50%;
}
.rotatetransform{
    transform:rotate(180deg);
    -ms-transition:rotate(180deg);
    -moz-transition:rotate(180deg);
    -webkit-transition:rotate(180deg);
    -o-transition:rotate(180deg);
}
.selected-address b{
    margin-left: 10px;
}


/* 1.*版 注释 */
.details-imgs-wrap p img{
  width: 100%;
  height: auto;
}
.details-over{
    cursor: not-allowed;
}
.goods-addselect{
    border: 1px solid #d8d8d8;
    height: 24px;
    width: 80px;
}
.details-goods-wrap{
  width:1200px;
  height:auto;
  margin:30px auto 74px;
}
.details-goods-wrap:after{
    content:".";
    display:block;
    height:0;
    clear:both;
    overflow:hidden;
    visibility:hidden;
}
.goods-img-wrap{
  float:left;
  width:400px;
}
.big-img-wrap{
  width:100%;
  height:400px;
  border:1px solid #eee;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box; 
}
.big-img-wrap img{
  width:100%;
  height:100%;
}
.small-img-wrap{
  margin-top:15px;
  width:100%;
  height:60px;
  backgound:#333;
}
.left-btn,.right-btn{
  cursor:pointer;
}
.left-btn{
  float:left;
  width:26px;
  height:100%;
  border:1px solid #eee;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box; 
  position:relative;
}
.left-btn i{
  position:absolute;
  top:37%;
  left:10%;
  color: #999;
}
.right-btn i{
  position:absolute;
  top:29%;
  left:14%;
  color: #999;
  transform:rotate(180deg);
  -ms-transform:rotate(180deg);
  -moz-transform:rotate(180deg);
  -webkit-transform:rotate(180deg); 
  -o-transform:rotate(180deg); 
}
.small-img-list{
  float:left;
  width:-moz-calc(100% - 52px);
  width:-webkit-calc(100% - 52px);
  width:calc(100% - 52px);
  height:100%;
  overflow:hidden;
  position:relative;
}
.small-img-list ul{
  float:left;
  height:100%;
  position:absolute;
  top:0;
  left:0;
}
.small-img-list li{
  width:60px;
  height:60px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box; 
  float:left;
  margin-left:8px;
  border:1px solid #eee;
  cursor: pointer;
}
.small-img-list li img{
  width:100%;
  height:100%;
}
.right-btn{
  position:relative;
  float:left;
  width:26px;
  height:100%;
  border:1px solid #eee;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box; 
}
.goods-info-wrap{
  float:left;
  padding-left: 62px;
  width:-moz-calc(100% - 450px);
  width:-webkit-calc(100% - 450px);
  width:calc(100% - 450px);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  text-align:left;
}
.goods-info-wrap dt{
  font-size:20px;
  line-height:44px;
  font-weight: 900;
}
.goods-remark{
  color:#999;
  margin-bottom:14px;
  font-size: 14px;
  line-height: 24px;
}
.goods-id{
  margin-left: 10px;
}
.goods-id-price{
    overflow: hidden;
    height: 40px;
}
.goods-id-price i{
    color:#999;
    font-size: 14px;
    float: left;
    height: 100%;
    line-height: 50px;
}
.goods-id-price em{
    float: left;
    margin-top: 8px;
}
.goods-info-wrap .goods-price{
    color:#009448;
    font-size:30px;
    margin: 0 10px 0 36px;
    text-align: left;
}
.goods-info-wrap .goods-alert{
  display: inline-block;
  border: 1px solid #009e4d;
  background: #fff;
  padding: 0 10px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  font-size: 14px;
  color: #009e4d;
  border-radius:4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  margin: 0 10px 0 32px;
}
.goods-info-wrap .goods-id{
    color:#333;
}
.infos-wrap{
    height:auto;
    line-height:38px;
    margin-top:2px;
    overflow:hidden;
}
.infos-wrap b{
    font-weight: 100;
    color: #999;
}
.infos-wrap>i{
    width:80px;
    float:left;
    height:38px;
}
.goods-info-wrap .selected-address{
    float:left;
    margin:0;
    position: relative;
}
.goods-info-wrap .infos-wrap p .el-input-number{
  margin-top: 7px;
}
.standard-wrap .standard-btn{
    border:1px solid #999;
    float:left;
    padding:0;
    background:#fff;
    height:30px;
    line-height: 30px;
    margin:14px 14px 0 0;
    padding: 0 10px;
    text-align:center;
    color:#333;
    font-size: 14px;
    cursor:pointer;
    min-width: 50px;
}
.standard-wrap .specActive{
    border: 1px solid #009e4d;
    background: url("/static/images/chose_yes.png") no-repeat right bottom;
}
.el-input-number {
    width: 100px !important;
}
#details-add-btn,#details-download-btn{
    position: relative;
    display: inline-block;
    width:150px;
    height:40px;
    overflow:hidden;
    cursor:pointer;
    margin:10px 30px 0 0;
    outline: none;
}
#details-add-btn{
  background: #009e4d;
  font-size:20px;
}
.addBtn-active{
    background: #f2f2f2!important;
    cursor:not-allowed!important;
}
.addBtn-active span,.addBtn-active .iconfont{
    color: #999!important; 
}
#details-add-btn .iconfont{
    position: absolute;
    display: inline;
    color:#fff;
    top: 2%;
    left: 12%;
}
#details-add-btn span{
  position: absolute;
  top: 0;
  right: 12%;
  color: #fff;
  font-size: 18px;
}
#details-download-btn{
    background: #f2f2f2;
    border:1px solid #d8d8d8;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
}
#details-download-btn i{
  position: absolute;
  display: inline;
  color:#333;
  top: 0;
  left: 6%;
  font-size:20px;
}
#details-download-btn span{
  position: absolute;
  top: 0;
  right: 6%;
  color: #333;
  font-size:18px;
}
.el-select {
    width: 90px;
    margin:0 10px;
}
.word-info-wrap{
    width:1200px;
    min-height:20px;
    margin:0 auto 30px;
    text-align:left;
}
.word-info-wrap dt{
    border-bottom:1px solid #d8d8d8;
    line-height:40px;
}
.word-info-wrap dt span{
    margin-left:16px;
    padding-left:16px;
    font-size:18px;
    position: relative;
}
.word-info-wrap dt span:after{
    position: absolute;
    content: '';
    width: 2px;
    height: 20px;
    background: #009e4d;
    left: 0;
    top: 14%;
}
.word-info-wrap dd{
    padding:20px 46px;
    overflow: hidden;
}
.word-info-wrap dd p{
    display: block;
    overflow: hidden;
}
.word-info-wrap dd p span{
    float: left;
    width: 50%;
    text-align:left;
    line-height:38px;
    position: relative;
}
.word-info-wrap .iconfont{
    position: absolute;
    left: 0;
    top: 2px;
}
.word-info-wrap .producing-area-i1{
    float: left;
    width: 100px;
    padding-left: 30px;
}
.word-info-wrap .producing-area-i2{
  width: 416px;
  float: left;
  font-size: 14px;
  color: #999;
}
.producing-area{
    position:relative;
    font-size: 14px;
}
.word-info-wrap .details-imgs-wrap{
    width:1200px;
    height:auto;
    margin:0 auto 30px;
    text-align:center;
    overflow:hidden;
    padding: 20px 0 0;
}
.details-imgs-wrap p{
  line-height: 1px;
}
.details-imgs-wrap img{
    display:inline-block;
    width:98%;
    height:auto;
}
</style>