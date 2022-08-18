<template>
	<div class="cus-container">
	    <div class="filter-container">
			<!-- <search-bar :searchConfig="searchConfig" ref="searchbar"/> -->
			<div style="padding-top: 3px;margin-left: 12px;float: left;">
				<!-- <el-button
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
				</el-button> -->
				<el-button
				  class="filter-item"
				  type="primary"
				  plain
				  size="small"
				  style="width: 80px;"
				  @click="handleInsert"
				>
				  {{ $t('table.add') }}
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
				<img style="width:30px;height:30px;" v-if="widget.type==='upload'" :src="scope.row[widget.key]" alt="">
				<div v-else>
					{{ scope.row[widget.key] }}
				</div>
		      
		    </template>
		  </el-table-column>
		  <el-table-column
		    :label="$t('table.actions')"
		    align="left"
		    width="150"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.edit') }}</el-button>
			  <el-button size="mini" type="danger" @click="handleDel(row,$index)">{{ $t('table.delete') }}</el-button>
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
		  :title="ifAdd ? $t('table.add') : $t('table.edit')"
		  v-if="ifShowDrawer"
		  :visible.sync="ifShowDrawer"
		  direction="rtl"
		  width="500px"
		>
		   <page-form :formConfig="formConfig" :temp="temp" ref="pageForm" v-on:submitForm='submitForm'/>
		   <div class="modal_foot">
			<div style="text-align: center;">
			  <el-button type="primary" size="mini" @click="handleSubmit" >{{$t('table.save')}}</el-button>
			  <el-button @click="ifShowDrawer = false" size="mini">{{$t('table.cancel')}}</el-button>
			</div>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { UpdateProduct,
	AddProduct, DeleteProduct, CheckProduct  } from '@/api/channel'
	
	import { deepCopy } from '@/utils'
	import i18n from '@/lang' // internationalization
	
	const apiPer = {
	  AddProduct,
	  UpdateProduct
	}
	const searchConfig=[
		{key:'ChannleName',name:'渠道商名',type:'input',value:''},
		{key:'ChannleNo',name:'渠道号',type:'input',value:''}
	]
	const tableConfig=[
		{key:'name',name:'名字'},
		{key:'logo',name:'logo',type:'upload'},
		{key:'content',name:'内容'},
		{key:'link',name:'跳转地址'}
	]
	const formConfig=[
		[{key:'name',name:'名字',type:'input',disabled:false,rules:[{ required: true, message: '名字不能为空'}]}],
		[{key:'logo',name:'logo',type:'upload',disabled:false,rules:[{ required: false, message: 'logo不能为空'}]}],		
		[{key:'content',name:'内容',type:'textarea',disabled:false,rules:[{ required: true, message: '内容不能为空'}]}],
		[{key:'link',name:'跳转地址',type:'input',disabled:false,rules:[{ required: true, message: '跳转地址不能为空'}]}],
	]
	//新增英文
	const _searchConfig=[
		{key:'name',name:'name',type:'input',value:''},
		{key:'logo',name:'logo',type:'upload',value:''},
		{key:'content',name:'content',type:'textarea',value:''},
		{key:'link',name:'link',type:'input',value:''},
	]
	const _tableConfig=[
		{key:'name',name:'name'},
		{key:'logo',name:'logo',type:'upload'},
		{key:'content',name:'content'},
		{key:'link',name:'link'}
	]
	const _formConfig=[
		[{key:'name',name:'name',type:'input',disabled:false,rules:[{ required: true, message: 'name cannot be empty'}]}],
		[{key:'logo',name:'logo',type:'upload',disabled:false,rules:[{ required: true, message: 'logo cannot be empty'}]}],
		[{key:'content',name:'content',type:'textarea',disabled:false,rules:[{ required: true, message: 'content cannot be empty'}]}],
		[{key:'link',name:'link',type:'input',disabled:false,rules:[{ required: true, message: 'link cannot be empty'}]}],
	]
	export default {
		components:{ searchBar,pageForm,Pagination },
		data() {
		  return {
			  searchConfig:[],
			  tableConfig:[],
			  formConfig:[],
			  list: null,
			  listLoading: false,
			  listQuery: {
			    pageIndex: 1,
			    pageSize: 20
			  },
			  total: 10,
			  /* 抽屉 */
			  ifShowDrawer: false,
			  temp:{}, //详情页数据
			  /* 增改 */
			  ifAdd: false
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
		    this.listLoading = true
			// let searchData = this.$refs.searchbar.getData();
			// this.listQuery = Object.assign(this.listQuery, searchData);
			this.listQuery = Object.assign(this.listQuery);
			CheckProduct(this.listQuery).then(response => {
		      this.list = response.data;
		      this.total = response.tolal
		      this.listLoading = false
		    })
		  },
		  //增
		  handleInsert(){
			this.ifAdd = true
			this.formConfig.forEach((item,index) => {
				item.forEach((_item,index) => {
					this.temp[_item.key]=''
				})
			})
			this.temp = { ...{} }
			this.ifShowDrawer=true
		  },
		  //改
		  handleDetail(row){
		  	this.ifAdd = false
			console.log('修改',row)
		    this.temp=Object.assign({}, row);
		    this.ifShowDrawer=true;
		  },
		  //删除
		  handleDel(row) {
			  this.$confirm(i18n.t('information.deleteConfirm'), i18n.t('information.tips'), {
			    confirmButtonText: i18n.t('permission.delete'),
			    cancelButtonText: i18n.t('permission.cancel'),
			    type: 'warning'
			  })
			    .then(() => {
			      DeleteProduct({id:row.id})
			        .then(res => {
			          this.$message({
			            type: 'success',
			            message: i18n.t('permission.DelSuccess')
			          })
			          this.fetchData()
			        })
			        .catch(err => {
			          this.$message.error(i18n.t('permission.DelFailed'))
			        })
			    })
			    .catch(() => {
			      this.$message({
			        type: 'info',
			        message: i18n.t('information.Cancelled')
			      })
			    })
		  },
		  //保存触发
		  handleSubmit(){
		  	this.$refs.pageForm.submitForm();
		  },
		  //重置
		  resetInput(){
			this.$refs.searchbar.resetInput();
		  },
		  //保存之后，子组件回调
		  submitForm(data){
			var formData = new FormData();
			formData.append('name', data.name);
			formData.append('logo', data.logo);
			formData.append('content', data.content);
			formData.append('link', data.link);
			if(!this.ifAdd){
				formData.append('id', this.temp.id);
			}
			apiPer[this.ifAdd ? 'AddProduct' : 'UpdateProduct'](formData)
			  .then(res => {
				  this.$message({
					type: 'success',
					message: i18n.t('information.SubSuccess')
				  })
				  this.fetchData()
				  this.ifShowDrawer = false
			}).catch(err => {
				  this.$message({
					type: 'info',
					message: i18n.t('information.SubFailed')
				  })
			})
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
