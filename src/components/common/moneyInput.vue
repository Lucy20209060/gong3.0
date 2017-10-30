<template>

	<div 
		class="divInput" 
		:class="[
			divInputSign ? 'divInputSign' : '',
			className
		]"
	>
		{{inputVal}}

		<i 
			v-if="placeholder !='' && inputVal =='' " 
			class="placeholder"
		>{{placeholder}}</i>
		<input class="modelInput" v-model="modelInputValue" @input="divkeyup($event)" @focus="inputFocus" @blur="inputBlur" />
	</div>
</template>

<script>
export default {
	name: 'divInput',
	data () {
		return {
			divInputSign:false,
			inputArr:[],
			inputValue:'',
			modelInputValue:''
		}
	},
	props: {
        placeholder:{
            type:String,
            default:''
        },
        length:{
        	type:Number,
            default:'8'
        },
        className:{
        	type:String,
            default:''
        }
    },
	computed:{
		inputVal(){
			// 截取掉首位的 0
			if(this.inputArr.length >=2 && this.inputArr[0] == 0 && this.inputArr[1] != '.'){
				this.inputArr.shift();
			}


			this.inputValue = this.inputArr.join('');
			this.modelInputValue = this.inputValue;
			this.$emit('change',this.inputValue);
			return this.inputValue;
		}
	},
	mounted(){

		const _this = this;

		// document.onmouseup = function(e){

		// 	if(
		// 		(e.target.className.indexOf('divInput') != -1) ||
		// 		(e.target.className.indexOf('placeholder') != -1)
		// 	){
		// 		_this.divInputSign = true;
		// 	}else{
		// 		_this.divInputSign = false;

		// 		// 失焦

		// 		if(_this.inputArr[_this.inputArr.length-1] == '.'){
		// 			_this.inputArr.push('0');
		// 			_this.inputArr.push('0');
		// 		}

		// 		// const ev = window.event || e;
		// 		// window.event ? ev.returnValue = true : '';
		// 	}
		// }

		// document.onkeyup = function(e){

		// 	// if(e.target.type){
		// 	// 	e.returnValue = true
		// 	// }else{
		// 	// 	e.returnValue = false
		// 	// }
		// 	// 	console.log(e)

		// 	// e.returnValue = true
		// 	// console.log(e.returnValue)

		// 	// 是否选中输入框
		// 	if(!_this.divInputSign) {
				
		// 		return false;
		// 	}
		// 	// const ev = window.event || e;
		// 	// console.log(window.event)

		// 	// 键盘 Backspace 删除
		// 	if(e.key == 'Backspace'){
		// 		_this.inputArr.pop();




		// 		234324234
		// 		// 关闭浏览器
		// 		// const ev = window.event || e;
		// 		// window.event ? ev.returnValue = false : '';
		// 	}

		// 	// 过滤输入字符 允许 数字 及 .
		// 	if(!(e.key >=0 || e.key == '.')){
		// 		return false;
		// 	}

		// 	console.log(e.key)

		// 	const inputArrLen = _this.inputArr.length;

		// 	// 首位不为 .
		// 	if(inputArrLen == 0 && e.key == '.'){
		// 		return false;
		// 	}

		// 	// 限制输入过多的 0 
		// 	if(inputArrLen == 1 && _this.inputArr[0] == 0 && e.key == '0'){
		// 		return false;
		// 	}

		// 	// 存在 . 不能再次输入
		// 	if(_this.spot() > 0 && e.key == '.'){
		// 		return false;
		// 	}

		// 	// ++++++++++++++++++++++++++++++++++++++++++++++++++++

		// 	// 小数点后只能输入两位
		// 	if(_this.spot() > 0 && inputArrLen > (Number(_this.spot())+2) ){
		// 		return false;
		// 	}


		// 	// 位数满足 数字 无小数点
		// 	if(inputArrLen == _this.length && e.key != '.' && _this.spot() == -1){
		// 		return false;
		// 	}

		// 	// +++++++++++++++++++++++++++++++++++++++++++++++++++++

		// 	_this.inputArr.push(e.key=='。'?'.':e.key)
		// }

	},
	methods:{
		spot(){
			let tem;
			for(let i in this.inputArr){
				if(this.inputArr[i] == '.'){
					tem = i;
				}
			}

			return tem || -1;
		},
		inputFocus(){
			this.divInputSign = true;
		},
		inputBlur(){
			this.divInputSign = false;
		},
		divkeyup(e){
			const _this = this;
			console.log(e)

			// 是否选中输入框
			if(!_this.divInputSign) {
				
				return false;
			}

			let data;

			if(e.path){
				// data = e.data;
				data = e.target.value.charAt(e.target.value.length-1);
				

			}else{
				data = e.target.value.charAt(e.target.value.length-1);
				if(e.target.uniqueNumber == '2611'){
					_this.inputArr.pop();
					
				}
			}



			// console.log(e.target.uniqueNumber)


			// 键盘 Backspace 删除
			if(e.inputType == 'deleteContentBackward'){
				_this.inputArr.pop();
			}

			console.log(_this.inputArr)

			if(data == null){
				return false;
			}

			if(data == ' '){
				return false;
			}
			if(data == ''){
				return false;
			}

			if(data >10){
				return false;
			}

			// 过滤输入字符 允许 数字 及 .
			if(!(data >=0 || data == '.')){
				return false;
			}

			const inputArrLen = _this.inputArr.length;

			// 首位不为 .
			if(inputArrLen == 0 && data == '.'){
				return false;
			}

			// 限制输入过多的 0 
			if(inputArrLen == 1 && _this.inputArr[0] == 0 && data == '0'){
				return false;
			}

			// 存在 . 不能再次输入
			if(_this.spot() > 0 && data == '.'){
				return false;
			}

			// ++++++++++++++++++++++++++++++++++++++++++++++++++++

			// 小数点后只能输入两位
			if(_this.spot() > 0 && inputArrLen > (Number(_this.spot())+2) ){
				return false;
			}


			// 位数满足 数字 无小数点
			if(inputArrLen == _this.length && data != '.' && _this.spot() == -1){
				return false;
			}

			// +++++++++++++++++++++++++++++++++++++++++++++++++++++

			_this.inputArr.push(data=='。'?'.':data)

			// console.log(_this.inputArr)
		}
		
	}
}
</script>

<style lang="scss" scoped>
	.modelInput{
		color: transparent;
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		z-index: 999;
		background: transparent;
		user-select: none;
		-moz-user-select: -moz-none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		padding-left: 184px;
	}
	.divInput{
		color: #333;
		display: inline-block;
		padding: 0 10px;
		height: 30px;
		width: 150px;
		border: 2px solid #999;
		position: relative;
		cursor: text;
		font-size: 16px;
		line-height: 30px;
		user-select: none;
		-moz-user-select: -moz-none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		i{
			position: absolute;
			top: -1px;
			left: 10px;
		}

	}
	.divInputSign{
		border: 2px solid #009e4d!important;
		&:after{
			content:' ';
			position: absolute;
			top: 5px;
			width: 1px;
			height: 20px;
			background: #000;
			animation:twinkling 1s infinite ease-in-out;
		}
	}

	@keyframes twinkling{ /*透明度由0到1*/
		0%{
			opacity:1; /*透明度为0*/
		}
		100%{
			opacity:0; /*透明度为1*/
		}
	}

	.placeholder{
		position: absolute;
		top: 2px;
		left: 0;
		color: #999;
	}
</style>