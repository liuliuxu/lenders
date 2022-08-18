<template>
	<div class="cus-container">
	    <div class="filter-container">
			<search-bar :searchConfig="searchConfig" ref="searchbar"/>
			<div style="padding-top: 3px;margin-left: 12px;float: left;">
				<!-- <el-button
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
		      {{ scope.row[widget.key] }}
		    </template>
		  </el-table-column>
		  <el-table-column
		    :label="$t('table.actions')"
		    align="left"
		    width="350"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.edit') }}</el-button>
			  <el-button size="mini" type="danger" @click="handleDelete(row,$index)">{{ $t('table.delete') }}</el-button>
			  <el-button size="mini" type="primary" @click="handleFen(row,$index)">{{ $t('table.asspermission') }}</el-button>
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
			  <el-button
				type="primary"
				size="mini"
				@click="handleSubmit"
			  >{{$t('table.save')}}</el-button>
			  <el-button @click="ifShowDrawer = false" size="mini">{{$t('table.cancel')}}</el-button>
			</div>
		  </div>
		</el-dialog>
		<el-dialog
		  :title="$t('table.asspermission')"
		  v-if="ifShowTree"
		  :visible.sync="ifShowTree"
		  direction="rtl"
		  width="800px"
		>
		   <tree :sysMenuList="sysMenuList" :temp="temp" ref="tree"/>
		   <el-row style="margin-top: 10px;text-align: right;">
		     <el-button type="primary" size="small" @click="handleSure">{{$t('table.confirm')}}</el-button>
		     <el-button @click="ifShowTree = false" size="small">{{$t('table.cancel')}}</el-button>
		   </el-row>
		</el-dialog>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import tree from './tree'
	import { GetRoleList,RoleAddMenuList,DeleteSingleRole,apiPer } from '@/api/role'
	import { GetAllMenuList } from '@/api/user' //获取所有菜单

	import { deepCopy } from '@/utils'
	import i18n from '@/lang' // internationalization

	const searchConfig=[];
	const tableConfig=[
		{key:'ID',name:'主键Id',width:'120'},
		{key:'RoleName',name:'角色名称',width:'150'},
		{key:'Remark',name:'备注'},
		{key:'Addtime',name:'新增时间'},
		{key:'updatetime',name:'修改时间'}
	]
	const formConfig=[
		[{key:'RoleName',name:'角色名称',type:'input',disabled:false,rules:[{ required: true, message: 'RoleName cannot be empty'}]}],
		[{key:'Remark',name:'备注',type:'input',disabled:false}]
	]
	const _searchConfig=[];
	const _tableConfig=[
		{key:'ID',name:'ID',width:'120'},
		{key:'RoleName',name:'RoleName',width:'150'},
		{key:'Remark',name:'Remark'},
		{key:'Addtime',name:'Addtime'},
		{key:'updatetime',name:'updatetime'}
	]
	const _formConfig=[
		[{key:'RoleName',name:'RoleName',type:'input',disabled:false,rules:[{ required: true, message: 'RoleName cannot be empty'}]}],
		[{key:'Remark',name:'Remark',type:'input',disabled:false}]
	]
	export default {
		components:{ searchBar,pageForm,Pagination,tree },
		data() {
		  return {
			  searchConfig:searchConfig,
			  tableConfig:tableConfig,
			  formConfig:formConfig,
			  list: null,
			  listLoading: false,
			  listQuery: {
				  RoleName: '',
				  StartDate:'',
				  EndDate:'',
			    pageIndex: 1,
			    pageSize: 20
			  },
			  total: 10,
			  /* 抽屉 */
			  ifShowDrawer: false,
			  temp:{}, //详情页数据
			  /* 增改 */
			  ifAdd: false,
			  /* 分配权限抽屉 */
			  ifShowTree:false,
			  /* 总菜单数据 */
			  sysMenuList:[]

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
		  this.getAllMenuList()
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
		  //获取所有菜单
		  getAllMenuList(){
			GetAllMenuList().then(response => {
			    this.sysMenuList=response.sysMenuList
			}).catch(() => {
				this.$message({
				  type: 'info',
				  message: i18n.t('information.SubFailed')
				})
			})
		  },
		  fetchData() {
		    this.listLoading = true
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
		    GetRoleList(this.listQuery).then(response => {
		      this.list = response.SysRoleModuleList
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
		    this.temp=Object.assign({}, row);
			console.log(this.temp)
		    this.ifShowDrawer=true;
		  },
		  //删除
		  handleDelete(row){
			this.$confirm(i18n.t('information.deleteConfirm'), i18n.t('information.tips'), {
			  confirmButtonText: i18n.t('permission.delete'),
			  cancelButtonText: i18n.t('permission.cancel'),
			  type: 'warning'
			})
			  .then(() => {
			    DeleteSingleRole(row)
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
		  //保存之后，子组件回调
		  submitForm(data){
			apiPer[this.ifAdd ? 'AddSingleRole' : 'UpdateSingleRole'](data)
			  .then(res => {
			  this.$message({
				type: 'success',
				message: i18n.t('information.SubSuccess')
			  })
	          this.fetchData()
			  this.ifShowDrawer = false
			  this.ifShowTree = false
			}).catch(err => {
              console.log(err)
              this.$message({
				type: 'info',
				message: i18n.t('information.SubFailed')
              })
            })
		  },
		  //分配权限
		  handleFen(row){
		  	console.log(row);
			this.ifAdd = false
			this.temp=Object.assign({}, row);
			this.ifShowTree = true
		  },
		  //确定树组件触发
		  handleSure(){
		  	const _data = this.$refs.tree.getCheckedKeys();
		  	console.warn(_data);
			// this.submitForm(_data);
			  RoleAddMenuList({
				  RoleId: _data.ID,
				  MenuIds: _data.MenuList,
				  originMenuKeys: _data.originMenuKeys
			  }).then((res)=>{
				  this.$message({
					  type: 'success',
					  message: i18n.t('information.SubSuccess')
				  })
				  this.fetchData();
				  this.ifShowDrawer = false;
				  this.ifShowTree = false;
			  }).catch(err => {
				  console.log(err)
				  this.$message({
					  type: 'info',
					  message: i18n.t('information.SubFailed')
				  })
			  })
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
	>>> .el-dialog__body{
		padding: 10px 20px;
	}
	>>> .el-dialog__header {
		border-bottom: 1px solid #e9e9e9;
	}
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
