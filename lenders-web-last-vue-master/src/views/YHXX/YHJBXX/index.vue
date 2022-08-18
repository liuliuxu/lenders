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
				  size="small"
				  style="width: 80px;"
				  @click="ifShowDrawer=true"
				>
				  测试
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
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">查看</el-button>
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
		  title="查看"
		  :visible.sync="ifShowDrawer"
		  direction="rtl"
		  width="800px"
		  :before-close="handleClose"
		>
		     <el-tabs v-model="activeName">
			    <el-tab-pane label="基本信息" name="first" style="padding-top: 15px;">
				   <page-form v-if="activeName==='first'" :formConfig="formConfig" :temp="temp"/>
			    </el-tab-pane>
			   <el-tab-pane label="app列表" name="second" style="padding-top: 15px;">
				   <app-child v-if="activeName==='second'" :rowItem="rowItem"/>
			   </el-tab-pane>
			   <el-tab-pane label="通讯录列表" name="third" style="padding-top: 15px;">
				   <mail-child v-if="activeName==='third'" :rowItem="rowItem"/>
			   </el-tab-pane>
			   <el-tab-pane label="短信列表" name="fourth" style="padding-top: 15px;">
			       <msg-child v-if="activeName==='fourth'" :rowItem="rowItem"/>
			   </el-tab-pane>
			 </el-tabs>
		</el-dialog>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import appChild from './appChild'
	import mailChild from './mailChild'
	import msgChild from './msgChild'
	import { GetAppUserInfoList,GetAppUserInfo } from '@/api/user'
	import i18n from '@/lang'
	import {deepCopy} from "@/utils";
	const searchConfig=[
		{key:'Name',name:'姓名',type:'input',value:''},
		{key:'Mobile',name:'手机号',type:'input',value:''},
		{key:'DeviceNo',name:'设备号',type:'input',value:''},
		{key:'ChannelNo',name:'渠道号',type:'input',value:''},
		{key:'State',name:'状态',type:'select',options:[{
			value: -1,
			label: '全部'
		},{
			value: 0,
			label: '黑名单'
		},{
			value: 1,
			label: '白名单'
		}],value:-1},
		{key:['StartTime','EndTime'],name:['注册开始时间','注册结束时间'],type:'daterange',value:''}
	]
	const tableConfig=[
		{key:'ID',name:'用户ID',width:'80'},
		{key:'Name',name:'姓名',width:'120'},
		{key:'Mobile',name:'手机号',width:'150'},
		{key:'DeviceNo',name:'注册设备号',width:'100'},
		{key:'Education',name:'学历',width:'80'},
		{key:'RegDate',name:'注册时间'},
		{key:'RegType',name:'注册设备'},
		{key:'ChannelNo',name:'注册渠道'},
		{key:'Static',name:'状态'}
	]
	const formConfig=[
		[{key:'Name',name:'姓名',type:'input',disabled:true},{key:'Sex',name:'性别',type:'select',disabled:true,configs:[{value: 0,label: '女'},{value: 1,label: '男'}]}],
		[{key:'Age',name:'年龄',type:'input',disabled:true},{key:'Aadhaar',name:'阿大哈卡',type:'input',disabled:true}],
		[{key:'BankNo',name:'银行账户',type:'input',disabled:true},{key:'BankName',name:'所属银行',type:'input',disabled:true}],
	    [{key:'BankUserName',name:'用户银行卡姓名',type:'input',disabled:true},{key:'RegDate',name:'注册时间',type:'input',disabled:true}],
		[{key:'AadhaarAddress',name:'阿大哈卡地址',type:'input',disabled:true},{key:'Mobile',name:'手机号',type:'input',disabled:true}],
		[{key:'ApplyLocation',name:'GPS地址',type:'input',disabled:true},{key:'RegletReglng',name:'注册经纬度',type:'input',disabled:true}],
		[{key:'RegType',name:'注册终端',type:'input',disabled:true},{key:'ChannelNo',name:'渠道号',type:'input',disabled:true}],
		[{key:'Email',name:'个人电子邮箱地址',type:'input',disabled:true},{key:'Company',name:'公司名称',type:'input',disabled:true}],
	    [{key:'Occupation',name:'职业',type:'input',disabled:true},{key:'PersonalIncome',name:'个人收入',type:'input',disabled:true}],
	    [{key:'BankCert',name:'银行卡认证',type:'input',disabled:true},{key:'kycCert',name:'人脸识别认证',type:'input',disabled:true}],
		[{key:'personCert',name:'个人信息认证',type:'input',disabled:true},{key:'ContactCert',name:'紧急联系人认证',type:'input',disabled:true}]
	]

	//en
	const _searchConfig=[
		{key:'Name',name:'Name',type:'input',value:''},
		{key:'Mobile',name:'Mobile',type:'input',value:''},
		{key:'DeviceNo',name:'DeviceNo',type:'input',value:''},
		{key:'ChannelNo',name:'ChannelNo',type:'input',value:''},
		{key:'State',name:'State',type:'select',options:[{
			value: -1,
			label: 'All'
		},{
			value: 0,
			label: 'Blacklist'
		},{
			value: 1,
			label: 'Whitelist'
		}],value:-1},
		{key:['StartTime','EndTime'],name:['StartTime','EndTime'],type:'daterange',value:''}
	]
	const _tableConfig=[
		{key:'ID',name:'UserID',width:'80'},
		{key:'Name',name:'Name',width:'120'},
		{key:'Mobile',name:'Mobile',width:'150'},
		{key:'DeviceNo',name:'DeviceNo',width:'100'},
		{key:'Education',name:'Education',width:'80'},
		{key:'RegDate',name:'RegDate'},
		{key:'RegType',name:'RegType'},
		{key:'ChannelNo',name:'ChannelNo'},
		{key:'Static',name:'Static'}
	]
	const _formConfig=[
		[{key:'Name',name:'Name',type:'input',disabled:true},{key:'Sex',name:'Sex',type:'性别',disabled:true,configs:[{value: 0,label: 'female'},{value: 1,label: 'man'}]}],
		[{key:'Age',name:'Age',type:'input',disabled:true},{key:'Aadhaar',name:'Aadhaar',type:'input',disabled:true}],
		[{key:'BankNo',name:'BankNo',type:'input',disabled:true},{key:'BankName',name:'BankName',type:'input',disabled:true}],
	    [{key:'BankUserName',name:'BankUserName',type:'input',disabled:true},{key:'RegDate',name:'RegDate',type:'input',disabled:true}],
		[{key:'AadhaarAddress',name:'AadhaarAddress',type:'input',disabled:true},{key:'Mobile',name:'Mobile',type:'input',disabled:true}],
		[{key:'ApplyLocation',name:'ApplyLocation',type:'input',disabled:true},{key:'RegletReglng',name:'RegletReglng',type:'input',disabled:true}],
		[{key:'RegType',name:'RegType',type:'input',disabled:true},{key:'ChannelNo',name:'ChannelNo',type:'input',disabled:true}],
		[{key:'Email',name:'Email',type:'input',disabled:true},{key:'Company',name:'Company',type:'input',disabled:true}],
	    [{key:'Occupation',name:'Occupation',type:'input',disabled:true},{key:'PersonalIncome',name:'PersonalIncome',type:'input',disabled:true}],
	    [{key:'BankCert',name:'BankCert',type:'input',disabled:true},{key:'kycCert',name:'kycCert',type:'input',disabled:true}],
		[{key:'personCert',name:'personCert',type:'input',disabled:true},{key:'ContactCert',name:'ContactCert',type:'input',disabled:true}]
	]
	export default {
		components:{ searchBar,pageForm,Pagination,appChild,mailChild,msgChild },
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
			  activeName: 'first',

			  rowItem:{},
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
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			GetAppUserInfoList(this.listQuery).then(response => {
		      this.list = response.AppUserListModel || response.Data
		      this.total = response.tolal
		      this.listLoading = false
		    })
		  },
		  handleDetail(row){
			this.rowItem = row;
			let _ID=row.ID;
		    GetAppUserInfo({ID:_ID}).then(response => {
		      this.temp = response.AppUserInfoModel || response.Data;
		    })
			this.rowItem = row;
		    this.ifShowDrawer=true;
		  },
		  handleClose(){
			this.activeName = 'first';
		    this.ifShowDrawer = false;
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
	>>> .el-dialog__body {
		padding: 5px 20px;
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
