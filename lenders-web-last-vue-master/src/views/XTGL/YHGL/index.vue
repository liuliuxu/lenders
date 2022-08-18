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
		    width="150"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.edit') }}</el-button>
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
		  width="800px"
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
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { GetUserList,AddSingleUser,UpdateSingleUser, GetConnectionGroupyList } from '@/api/user'
	import { GetRoleList } from '@/api/role'
	import { deepCopy } from '@/utils'
	import i18n from '@/lang' // internationalization
	const apiPer = {
	  AddSingleUser,
	  UpdateSingleUser
	};
	let roleList = [];
	const searchConfig=[
		{key:'RegName',name:'注册名',type:'input',value:''},
		{key:'Phone',name:'联系电话',type:'input',value:''},
		{key:'AdminNo',name:'工号',type:'input',value:''},
		{key:'State',name:'状态',type:'select',options:[{
			value: -1,
			label: '全部'
		},{
			value: 0,
			label: '停用'
		},{
			value: 1,
			label: '启用'
		}],value:-1},
    {key:'CollectionGroupId',name:'催收组',type:'select',options:[],value:''}
	]
	const tableConfig=[
		{key:'UserName',name:'登录名',width:'120'},
		{key:'RegDate',name:'注册时间',width:'150'},
		{key:'RegName',name:'注册名',width:'150'},
		{key:'Phone',name:'手机号'},
		{key:'AdminNo',name:'工号'},
		{key:'RoleName',name:'角色名称'},
    {key:'CollectionGroupName',name:'催收组'},
    {key:'isCollectionGroupAdmin',name:'是否催收管理员'},
		{key:'stateName',name:'状态'}
	]
	const formConfig=[
		// [{key:'ID',name:'主键Id',type:'input',disabled:true},{key:'RoleID',name:'角色ID',type:'input',disabled:true}],
		[{key:'RegDate',name:'注册时间',type:'input',disabled:true},{key:'Addtime',name:'添加时间',type:'input',disabled:true}],
		[{key:'UserName',name:'登录名',type:'input',disabled:false},{key:'UserPsw',name:'密码',type:'input',disabled:false}],
		[{key:'AdminNo',name:'工号',type:'input',disabled:false},{key:'RegName',name:'注册名',type:'input',disabled:false}],
		[{key:'Phone',name:'联系电话',type:'input',disabled:false},{key:'State',name:'状态',type:'select',disabled:false,configs:[{value: 1,label: '启用'},{value: 0,label: '停用'}]}],
    [{key:'CollectionGroupId',name:'催收组',type:'select',disabled:false, configs: []},{key:'isCollectionGroupAdmin',name:'是否催收管理员',type:'select',disabled:false,configs:[{value: 1,label: '是'},{value: 0,label: '否'}]}],
				[{key:'RoleID',name:'角色ID',type:'select',disabled:false, configs: roleList}]
	]
	const _searchConfig=[
		{key:'RegName',name:'RegName',type:'input',value:''},
		{key:'Phone',name:'Phone',type:'input',value:''},
		{key:'AdminNo',name:'AdminNo',type:'input',value:''},
		{key:'State',name:'State',type:'select',options:[{
			value: -1,
			label: 'All'
		},{
			value: 0,
			label: 'enabled'
		},{
			value: 1,
			label: 'disabled'
		}],value:-1},
    {key:'CollectionGroupId',name:'CollectionGroup',type:'select',options:[],value:''}
	]
	const _tableConfig=[
		{key:'UserName',name:'UserName',width:'120'},
		{key:'RegDate',name:'RegDate',width:'150'},
		{key:'RegName',name:'RegName',width:'150'},
		{key:'Phone',name:'Phone'},
		{key:'AdminNo',name:'AdminNo'},
		{key:'RoleName',name:'RoleName'},
    {key:'CollectionGroupName',name:'CollectionGroup'},
    {key:'isCollectionGroupAdmin',name:'isCollectionGroupAdmin'},
		{key:'stateName',name:'state'}
	]
	const _formConfig=[
		// [{key:'ID',name:'IDId',type:'input',disabled:true},{key:'RoleID',name:'RoleID',type:'input',disabled:true}],
		[{key:'RegDate',name:'RegDate',type:'input',disabled:true},{key:'Addtime',name:'Addtime',type:'input',disabled:true}],
		[{key:'UserName',name:'UserName',type:'input',disabled:false},{key:'UserPsw',name:'UserPsw',type:'input',disabled:false}],
		[{key:'AdminNo',name:'AdminNo',type:'input',disabled:false},{key:'RegName',name:'RegName',type:'input',disabled:false}],
		[{key:'Phone',name:'Phone',type:'input',disabled:false},{key:'State',name:'State',type:'select',disabled:false,configs:[{value: 1,label: 'Enable'},{value: 0,label: 'Deactivity'}]}],
    [{key:'CollectionGroupId',name:'CollectionGroup',type:'select',disabled:false, configs: []},{key:'isCollectionGroupAdmin',name:'isCollectionGroupAdmin',type:'select',disabled:false,configs:[{value: 1,label: 'Yes'},{value: 0,label: 'No'}]}],
			[{key:'RoleID',name:'RoleID',type:'select',disabled:false, configs: roleList}]
	];
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
			  /* 抽屉 */
			  ifShowDrawer: false,
			  temp:{}, //详情页数据
			  /* 增改 */
			  ifAdd: false,
			  roleList: [],
        userGroupList: []
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
		  this.fetchData();
		  this.getRoleList();
		  this.getUSerGroupList();
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
        this.setCollectionOpt();
		  },
      getUSerGroupList() {
        GetConnectionGroupyList().then(res => {
          const userGroupList = res.Collections.map(item => {
            return {
              value: item.CollectionId,
              label: item.CollectionName
            }
          });
          this.setCollectionOpt();
          this.userGroupList = userGroupList;
          formConfig[formConfig.length - 2][0].configs = userGroupList;
          _formConfig[_formConfig.length - 2][0].configs = userGroupList;
        });
      },
      setCollectionOpt() {
        const collection = this.searchConfig.find(item => item.key === 'CollectionGroupId');
        if (collection) {
          collection.options = this.userGroupList;
        }
      },
		  fetchData() {
		    this.listLoading = true
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			GetUserList(this.listQuery).then(response => {
			  if (response.sysAdministratorReqs) {
          this.list = response.sysAdministratorReqs.map(item => {
            return {
              ...item,
              // RoleID: {
              // 	RoleID: 0,
              // 	RoleName: "",
              // 	value: item.RoleID,
              // 	label: item.RoleName
              // },
              isCollectionGroupAdmin: item.isCollectionGroupAdmin && item.isCollectionGroupAdmin > 0 ? this.language === 'en' ? 'Yes' : '是' : this.language === 'en' ? 'No' : '否',
              stateName: item.State ? this.language === 'en' ? 'Enable' : '启用' : this.language === 'en' ? 'Deactivity' : '停用'
            }
          });
        }
		      this.total = response.tolal;
		      this.listLoading = false
		    })
		  },
			getRoleList() {
				GetRoleList({
					pageIndex: 1,
					pageSize: 99999
				}).then(response => {
					roleList = response.SysRoleModuleList.map(item => {
						return {
							value: item.ID,
							label: item.RoleName
						}
					});
					this.roleList = roleList;
					formConfig[formConfig.length - 1][0].configs = roleList;
					_formConfig[_formConfig.length - 1][0].configs = roleList;
					// console.warn(formConfig, _formConfig);
					this.switchLanguage(this.language)
				});
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
			if(!data.UserName){
				this.$message({
					type: 'info',
					message: i18n.t('information.UserNameNUll')
				})
				return false;
			}if(!data.AdminNo){
				this.$message({
					type: 'info',
					message: i18n.t('information.AdminNoNUll')
				})
				return false;
			}if(!data.RegName){
				this.$message({
					type: 'info',
					message: i18n.t('information.RegNameNUll')
				})
				return false;
			}
			if(data.UserName !== data.AdminNo || data.UserName !== data.RegName || data.AdminNo !== data.RegName){
				this.$message({
					type: 'info',
					message: i18n.t('information.NameNUllequal')
				})
				return false;
			}
			apiPer[this.ifAdd ? 'AddSingleUser' : 'UpdateSingleUser'](data)
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
