<template>
	<div class="process">

		<mineHeader></mineHeader>

		<div class="img-wrap">
			<img src="http://om5zrrquj.bkt.clouddn.com/batch.png" />
			<a href="/mine/batch"></a>
		</div>

		<IndexFooter></IndexFooter>

	</div>
</template>
<script>
	import mineHeader from '@/components/common/mine_header'
	import IndexFooter from '@/components/common/index_footer'

	export default {
		components:{
			mineHeader,
			IndexFooter
		},
	}
</script>
<style scoped>
	.img-wrap{
		width: 60%;
		margin: 0 auto;
		position: relative;
		overflow: hidden;
	}
	.img-wrap img{
		width: 100%;
		float: left;
		line-height: 1;
	}
	.img-wrap a{
		position: absolute;
	    bottom: 1%;
	    width: 24%;
	    height: 3%;
	    left: 39%;
	}

</style>