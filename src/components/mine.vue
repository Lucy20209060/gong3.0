<template>
    <div class="mine">

        <mine-header></mine-header>

        <div class="content">

            <w-menu></w-menu>
            <router-view></router-view>

        </div>

        <index-footer></index-footer>

    </div>
</template>

<script>
import mineHeader from '@/components/common/mine_header'
import IndexFooter from '@/components/common/index_footer'
import wMenu from '@/components/w_menu'
import myIndent from '@/components/myIndent'

export default {
  name: 'mine',
  data () {
    return {
      msg: ''
    }
  },
  components:{
  	wMenu,
  	mineHeader,
  	IndexFooter,
  	myIndent
  }
}
</script>

<style scoped>
	.mine{
		background-color: #fff;
    min-width: 1210px;
	}
	.mine .content{
		overflow: hidden;
		width:1200px;
		margin:17px auto 29px;
    background-color: #fff
	}
</style>
