/**
*
*       迭代后的api逐渐向该文件迁移 2017/9/15      
*
*/

import { environment } from '@/assets/js/function'

/*
*   接口前缀
*/
const apiPre = '/api.php';
// const apiPre ='/chenghf.php';
// const apiPre = '/pro.api.php';

/*
*   支付接口前缀 
*   线上 => 'http://b2bapi.anchumall.cc' | 测试 => 'http://dev.anchumall.cc' 'http://10.10.40.183'
*/
const payLinkfix = environment(location.host) == 'production' 
                ? 'http://b2bapi.anchumall.cc' 
                : 'http://dev.anchumall.cc';

/*
*   图片前缀 开发中使用
*/
const imgPrefix = process.env.NODE_ENV === 'production' 
                ? '' 
                : 'https://b2b.hzanchu.com';

// 接口
const Api = {

    payLink:payLinkfix,

    // 图片前缀
    imgPre: imgPrefix,

    DownloadGoodsZip:`${apiPre}?s=api/Api/DownloadGoodsZip`,

    // 页面 api
    uploadify:{
        upload_image:`${apiPre}?s=api/uploadify/upload_image`,
        remove_image:`${apiPre}?s=api/uploadify/remove_image`,
    },
    user:{
        getUserInfo:`${apiPre}?s=api/user/getUserInfo`,
        forget_pwd:`${apiPre}?s=api/User/forget_pwd`,
        user_is_verify:`${apiPre}?s=api/User/user_is_verify`,
        logout:`${apiPre}?s=api/User/logout`,
    },
    classify:{
        searchcategory:`${apiPre}?s=api/goods/searchcategory`,
    },
    login:{
        login:`${apiPre}?s=api/User/do_login`,
        is_login:`${apiPre}?s=api/User/is_login`
    },
    register:{
        send_validate_code:`${apiPre}?s=api/Api/send_validate_code`,
        reg:`${apiPre}?s=api/User/reg`
    },
    home:{
        getFeatureSite:`${apiPre}?s=api/site/getFeatureSite`,
        getAdList:`${apiPre}?s=api/ad/getAdList`,
        getlevel1:`${apiPre}?s=api/category/getlevel1`,
        category_products:`${apiPre}?s=api/index/category_products`,
        getlevel1children:`${apiPre}?s=api/category/getlevel1children`,
    },
    batch:{
        importOrders:`${apiPre}?s=api/ImportOrders/importOrders`,
        getFailExcel:`${apiPre}?s=api/ImportOrders/getFailExcel`,
        exportGoodsList:`${apiPre}?s=api/ExportExcel/exportGoodsList`,
        exportOrderTem:`${apiPre}?s=api/ExportExcel/exportOrderTem`
    },
    batchList:{
        getOrdersInfo:`${apiPre}?s=api/ImportOrders/getOrdersInfo`,
        getCartBatchs:`${apiPre}?s=api/CartBatch/getCartBatchs`,
        remove:`${apiPre}?s=api/CartBatch/remove`,
        getregion:`${apiPre}?s=api/address/getregion`,
        update:`${apiPre}?s=api/CartBatch/update`,
        updateRegion:`${apiPre}?s=api/CartBatch/updateRegion`,
    },
    batchOrder:{
        create:`${apiPre}?s=api/CartBatch/create`,
    },
    goodsDetails:{
        getlist:`${apiPre}?s=api/address/getlist`,
        getregion:`${apiPre}?s=api/address/getregion`,
        getShippingPrice:`${apiPre}?s=api/goods/getShippingPrice`,
        info:`${apiPre}?s=api/goods/info`,
    },
    subStation:{
         getlist:`${apiPre}?s=api/site/getlist`,
    },
    service:{
        getLastOrderByUser:`${apiPre}?s=api/order/getLastOrderByUser`
    },
    address:{
        create:`${apiPre}?s=api/address/create`,
        update:`${apiPre}?s=api/address/update`,
        delete:`${apiPre}?s=api/address/delete`,
        set_default:`${apiPre}?s=api/address/set_default`,
        get:`${apiPre}?s=api/address/get`,
    },
    cart:{
        update:`${apiPre}?s=api/cart/update`,
        getordercart:`${apiPre}?s=api/cart/getordercart`,
        add:`${apiPre}?s=api/cart/add`,
        cartnum:`${apiPre}?s=api/cart/cartnum`,
        getlist:`${apiPre}?s=api/cart/getlist`,
        remove:`${apiPre}?s=api/cart/remove`,
    },
    order:{
        create:`${apiPre}?s=api/order/create`,
        detail:`${apiPre}?s=api/order/detail`,
        cancel:`${apiPre}?s=api/order/cancel`,
        confirm:`${apiPre}?s=api/order/confirm`,
        return_cancel:`${apiPre}?s=api/order/return_cancel`,
        info:`${apiPre}?s=api/order/info`,
        getlist:`${apiPre}?s=api/order/getlist`,
        get_order_goods:`${apiPre}?s=api/order/get_order_goods`,
        return_goods:`${apiPre}?s=api/order/return_goods`,
        get_return_detail:`${apiPre}?s=api/order/get_return_detail`,
        return_delivery:`${apiPre}?s=api/order/return_delivery`,
    },
    payment:{
        wxqrcode:`${apiPre}?s=api/payment/wxqrcode`,
        checkUserBack:`${apiPre}?s=api/user/checkUserBack`,

        payRecharge:`${apiPre}?s=api/PayRecharge/wxqrcode`,       // 余额微信支付
        getCode:`${apiPre}?s=api/PayRecharge/getCode`,            // 余额支付宝、银联支付
        checkRechargeLast:`${apiPre}?s=api/recharge/checkRechargeLast`,

        payment:`${apiPre}?s=Home/Payment/getCode`,               // 余额支付订单
    },
    proof:{
        authentication_userinfo:`${apiPre}?m=Api&c=User&a=insert_authentication_userinfo`,
    },
    recharge:{
        info:`${apiPre}?s=Api/recharge/info`,     // 余额信息
    }
}

export default Api;