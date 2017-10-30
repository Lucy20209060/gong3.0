
export const transNumber = (value) => {
	return Number(value)
}

// 返回 当前环境
export const environment = function (host = 'b2b.hzanchu') {
    if(process.env.NODE_ENV ==='development'){
        return 'localhost'
    }
    else if(host.indexOf("pc.b2b") == -1){
        return 'production'
    }
    else{
        return 'development'
    }
}
