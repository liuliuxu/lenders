<template>
	<div class="cus-container">
	    <div class="filter-container">
			<search-bar :searchConfig="searchConfig" ref="searchbar"/>
			<div style="padding-top: 3px;margin-left: 12px;float: left;">
				<el-button
				  class="filter-item"
				  type="primary"
				  size="small"
				  style="width: 80px;"
				  @click="search"
				>
					{{ $t('table.search') }}
				</el-button>
				<el-button
				  class="filter-item"
				  size="small"
				  style="width: 80px;"
				  @click="resetInput"
				>
					{{ $t('table.resetting') }}
				</el-button>
			</div>
	    </div>
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
		  <el-table-column
				  :label="$t('table.actions')"
		    align="left"
		    width="150"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">详情</el-button>
		    </template>
		  </el-table-column>
		  <template slot="empty" >
		    <img src="@/assets/cus_images/nodata.png" class="cus-img">
		    <p class="cus-nodata">{{ $t('table.nodata') }}</p>
		  </template>
		</el-table>
		<pagination
		  v-show="total>0"
		  :total="total"
		  :page.sync="listQuery.pageIndex"
		  :limit.sync="listQuery.pageSize"
		  @pagination="fetchData"
		/>
		<el-dialog
		  title="详情"
		  :visible.sync="ifShowDrawer"
		  direction="rtl"
		  width="800px"
		>
		   <page-form :formConfig="formConfig" :temp="temp"/>
		   <div class="modal_foot">
		    <div style="text-align: center;">
<!-- 		      <el-button
		        type="primary"
		        @click="handleSubmit"
		      >保存</el-button> -->
		      <!-- <el-button @click="ifShowDrawer = false">取消</el-button> -->
		    </div>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { GetCollectionManList } from '@/api/user'
	import i18n from '@/lang'
	import {deepCopy} from "@/utils";
	const searchConfig=[
		{key:'Name',name:'催收员姓名',type:'input',value:''},
		{key:'Phone',name:'手机号',type:'input',value:''},
		{key:'State',name:'状态',type:'select',options:[{
				value: '',
				label: '全部'
			},{
				value: 0,
				label: '停用'
			},{
				value: 1,
				label: '启用'
			}],value:''}
	]
	const tableConfig=[
		{key:'Name',name:'催收员姓名',width:'120'},
		{key:'Phone',name:'手机号',width:'150'},
		{key:'AddTime',name:'新增时间',width:'150'},
		{key:'State',name:'状态'}
	]
	const formConfig=[
		[{key:'Name',name:'催收员姓名',type:'input',disabled:true},{key:'Phone',name:'手机号',type:'input',disabled:true}],
		[{key:'AddTime',name:'新增时间',type:'input',disabled:true},{key:'State',name:'状态',type:'select',disabled:true,configs:[{value: 1,label: '启用'},{value: 0,label: '停用'}]}]
	]
	//en
	const _searchConfig=[
		{key:'Name',name:'Name',type:'input',value:''},
		{key:'Phone',name:'Phone',type:'input',value:''},
		{key:'State',name:'State',type:'select',options:[{
				value: '',
				label: 'ALL'
			},{
				value: 0,
				label: 'stop'
			},{
				value: 1,
				label: 'start'
			}],value:''}
	]
	const _tableConfig=[
		{key:'Name',name:'Name',width:'120'},
		{key:'Phone',name:'Phone',width:'150'},
		{key:'AddTime',name:'AddTime',width:'150'},
		{key:'State',name:'State'}
	]
	const _formConfig=[
		[{key:'Name',name:'Name',type:'input',disabled:true},{key:'Phone',name:'Phone',type:'input',disabled:true}],
		[{key:'AddTime',name:'AddTime',type:'input',disabled:true},{key:'State',name:'State',type:'select',disabled:true,configs:[{value: 1,label: 'start'},{value: 0,label: 'stop'}]}]
	]
	export default {
		components:{ searchBar,pageForm,Pagination },
		data() {
		  return {
			  searchConfig:searchConfig,
			  tableConfig:tableConfig,
			  formConfig:formConfig,
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
		computed: {
			language() {
				return this.$store.getters.language
			}
		},
		watch: {
			language: function (val, oldVal) {
				this.switchLanguage(val)
			}
		},
		created() {
			this.switchLanguage(this.language)
		},
		mounted() {
		  this.fetchData()
		},
		methods: {
			switchLanguage(val) {//原始数据 应用数据 en/zh
				if(val=='zh'){//切换成中文
					this.searchConfig=deepCopy(searchConfig)
					this.tableConfig=deepCopy(tableConfig)
					this.formConfig=deepCopy(formConfig)
				}else if(val=='en'){//切换成英文
					this.searchConfig=deepCopy(_searchConfig)
					this.tableConfig=deepCopy(_tableConfig)
					this.formConfig=deepCopy(_formConfig)
				}
			},
		  fetchData() {
		    this.listLoading = true;
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			  GetCollectionManList(this.listQuery).then(response => {
		      this.list = response.data;
		      this.total = response.tolal;
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
		padding: 20px 0 0px 20px;
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
