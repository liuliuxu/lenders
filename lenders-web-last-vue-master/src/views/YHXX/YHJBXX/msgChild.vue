<template>
	<div class="cus-container">
	    <!-- <div class="filter-container">
			<search-bar :searchConfig="searchConfig" ref="searchbar"/>
			<div style="padding-top: 3px;margin-left: 12px;float: left;">
				<el-button
				  class="filter-item"
				  type="primary"
				  size="small"
				  style="width: 80px;"
				  @click="search"
				>
				  搜索
				</el-button>
				<el-button
				  class="filter-item"
				  size="small"
				  style="width: 80px;"
				  @click="resetInput"
				>
				  重置
				</el-button>
			</div>
	    </div> -->
		<el-table
		  v-loading="listLoading"
		  :data="list"
		  element-loading-text="Loading"
		  fit
		  highlight-current-row
		  style="padding-left: 20px;padding-top: 20px;"
		>
		  <el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :width="widget.width" align="left">
		    <template slot-scope="scope">
		      {{ scope.row[widget.key] }}
		    </template>
		  </el-table-column>
		  <template slot="empty" >
		    <img src="@/assets/cus_images/nodata.png" class="cus-img">
		    <p class="cus-nodata">暂无数据</p>
		  </template>
		</el-table>
		<pagination
		  v-show="total>0"
		  :total="total"
		  :page.sync="listQuery.pageIndex"
		  :limit.sync="listQuery.pageSize"
		  @pagination="fetchData"
		/>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { GetMsgUpLoadList } from '@/api/user'
	const searchConfig=[
		{key:'messagePhone',name:'短信手机号',type:'input',value:''},
		{key:'messageDate',name:'短信发送时间',type:'date',value:''},
		{key:'Mobile',name:'用户手机号',type:'input',value:''},
		{key:'messageType',name:'收发方',type:'input',value:'',options:[{
			value: '',
			label: '全部'
		},{
			value: 0,
			label: '手'
		},{
			value: 1,
			label: '发'
		}]},
	]
	const tableConfig=[
		{key:'messageContent',name:'短信内容'},
		{key:'messageDate',name:'短信发送时间'},
		{key:'messagePhone',name:'短信手机号'},
		{key:'messageType',name:'收发方(0收/1发)'}
	]
	export default {
		components:{ searchBar,pageForm,Pagination },
		props:{
			rowItem:{
				type: Object,
				default: null,
			}
		},
		data() {
		  return {
			  searchConfig:searchConfig,
			  tableConfig:tableConfig,
			  list: null,
			  listLoading: false,
			  listQuery: {
			    pageIndex: 1,
			    pageSize: 20
			  },
			  total: 10,
			  ifShowDrawer: false,
			  temp:[], //详情页数据
		  }
		},
		mounted() {
		  this.fetchData()
		},
		methods: {
		  fetchData() {
		    this.listLoading = true;
			this.listQuery.Mobile = this.rowItem.Mobile;
			// let searchData = this.$refs.searchbar.getData();
			// this.listQuery = Object.assign(this.listQuery, searchData);
			GetMsgUpLoadList(this.listQuery).then(response => {
		      this.list = response.AppMsgModelList || response.data;
		      this.total = response.tolal
		      this.listLoading = false
		    })
		  },
		  handleDetail(row){
		    this.temp=row;
		    this.ifShowDrawer=true;
		  },
		  //重置
		  resetInput(){
			this.$refs.searchbar.resetInput();
		  },
		  //搜索
		  search(){
			this.fetchData()
		  }
		}
    }
</script>

<style lang="scss" scoped>
.cus-container {
	.filter-container{
		padding: 0px 0 0px 20px;
	}
    >>> .el-table__empty-text {
      line-height: 1;
    }
    .cus-img{
      height: 40px;
      margin-top:60px;
    }
    .cus-nodata{
      line-height: inherit!important;
      margin-bottom: 60px;
    }
}
</style>
