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
				  @click="Refresh"
				>
					{{ $t('table.Refresh') }}
				</el-button>
				<el-button
						class="filter-item"
						type="primary"
						size="small"
						style="width: 80px;"
						@click="Add"
				>
					{{ $t('table.Add') }}
				</el-button>
			</div>
	    </div>
		<div class="fenpei">
			<el-button
					class="filter-item"
					type="primary"
					size="small"
					:disabled="!multipleSelectionCSRY || !multipleSelectionCSRY.length"
					@click="fenpei"
			>
				{{ $t('table.Allocated') }}
			</el-button>
		</div>
		<el-table
		  v-loading="listLoading"
		  :data="list"
		  @selection-change="handleSelectionChange"
		  element-loading-text="Loading"
		  fit
		  highlight-current-row
		  style="padding-left: 20px;padding-top: 20px;"
		>
			<el-table-column
					type="selection"
					width="55">
			</el-table-column>
		  <el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :width="widget.width" align="left">
		    <template slot-scope="scope">
		      {{ scope.row[widget.key] }}
		    </template>
		  </el-table-column>
		  <el-table-column
		    :label="$t('table.actions')"
		    align="left"
		    width="200"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.detail') }}</el-button>
				<el-button size="mini" type="primary" @click="clickSendSms(row,$index)">{{ $t('table.send') }}</el-button>
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
		  :title="$t('table.detail')"
		  :visible.sync="ifShowDrawer"
		  direction="rtl"
		  width="800px"
		>
		   <page-form :formConfig="formConfig" :temp="temp"/>
		   <div class="modal_foot">
		    <div style="text-align: center;">
<!--               <el-button-->
<!--	    		type="primary"-->
<!--	    		size="mini"-->
<!--	    		@click="handleSubmit"-->
<!--	    	  >{{$t('table.save')}}</el-button>-->
	    	  <el-button @click="ifShowDrawer = false" size="mini">{{$t('tagsView.close')}}</el-button>
		    </div>
		  </div>
		</el-dialog>
		<el-dialog
				:title="$t('table.Add')"
				:visible.sync="isAddDrawer"
				direction="rtl"
				width="500px"
		>
			<div>
				<el-form ref="formCSRY" :rules="rulesCSRY" :model="formCSRY" label-width="80px">
					<el-form-item :label="$t('table.Mobile')" prop="Mobile">
						<el-input v-model="formCSRY.Mobile"></el-input>
					</el-form-item>
					<el-form-item :label="$t('table.CardID')" prop="CardID">
						<el-input v-model="formCSRY.CardID"></el-input>
					</el-form-item>
				</el-form>
<!--				<el-tree-->
<!--						:data="listCSRY"-->
<!--						show-checkbox-->
<!--						ref="tree"-->
<!--						node-key="id"-->
<!--						:props="defaultProps">-->
<!--				</el-tree>-->

			</div>
			<div class="modal_foot">
				<div style="text-align: center;">
					<el-button
							type="primary"
							size="mini"
							@click="handleSubmitAddWhite"
					>{{$t('table.save')}}</el-button>
					<el-button @click="clickCancelAddWhite" size="mini">{{$t('table.cancel')}}</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog
				:title="$t('table.Allocated')"
				:visible.sync="allocationDrawer"
				direction="rtl"
				width="500px"
		>
			<div>
<!--				<el-tree-->
<!--						:data="listCSRY"-->
<!--						show-checkbox-->
<!--						ref="tree"-->
<!--						node-key="id"-->
<!--						:props="defaultProps">-->
<!--				</el-tree>-->
				<el-checkbox-group
						v-model="checkedCSRY"
						:max="1">
					<el-checkbox v-for="city in listCSRY" :label="city.Id" :key="city.Id">{{city.Name}}{{city.Phone}}</el-checkbox>
				</el-checkbox-group>
				<pagination
						v-show="listCSRYTotal>0"
						:total="listCSRYTotal"
						:page.sync="listCSRYQuery.pageIndex"
						:limit.sync="listCSRYQuery.pageSize"
						@pagination="fetchCSRYData"
				/>
			</div>
			<div class="modal_foot">
				<div style="text-align: center;">
					<el-button
							type="primary"
							size="mini"
							@click="fenpeiSave"
					>{{$t('table.save')}}</el-button>
					<el-button @click="allocationDrawer = false" size="mini">{{$t('table.cancel')}}</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { GetAllWhiteUserList,UpdateWhiteUser,AddWhiteSinge,CollectionAllot } from '@/api/whitelist'
	import { GetCollectionManListBMD, SendLoanQuality } from '@/api/user'

	import i18n from '@/lang'
	import {deepCopy} from "@/utils"; // internationalization
	const searchConfig=[
		{key:['StartDate','EndDate'],name:['开始日期','结束日期'],type:'daterange',value:''},
		{key:'Mobile',name:'手机号',type:'input',value:''},
		{key:'CardId',name:'身份证',type:'input',value:''},
		{key:'IsAllocated',type:'select', name:'是否分配',value: 0, multiple: false,options:[{
				value: 0,
				label: '全部'
			},{
				value: 1,
				label: '未分配'
			},{
				value: 2,
				label: '已分配'
			}]},
		{key:'IsRegister',name:'是否注册',type:'select',options:[{
				value: -1,
				label: '全部'
			},{
				value: 0,
				label: '否'
			},{
				value: 1,
				label: '是'
			}],value: -1},
	];
	const tableConfig=[
		{key:'UserID',name:'用户ID',width:'120'},
		{key:'Mobile',name:'手机号',width:'150'},
		{key:'CardID',name:'身份证'},
		{key:'AddDate',name:'申请时间'},
		{key:'IsRegister_Ch',name:'是否注册'},
		{key:'IsAllocated_Ch',name:'是否分配'}
	];
	const formConfig=[
		[{key:'UserID',name:'用户ID',type:'input',disabled:true},{key:'Mobile',name:'手机号',type:'input',disabled:true}],
		[{key:'CardID',name:'身份证',type:'input',disabled:true},{key:'AddDate',name:'申请时间',type:'input',disabled:true}],
		[{key:'IsRegister',name:'是否注册',type:'select',disabled:true,configs:[{value: 1,label: '是'},{value: 0,label: '否'}]}, {key:'IsAllocated',name:'是否分配',type:'select',disabled:true,configs:[]}]
	];

	//ng
	const _searchConfig=[
		{key:['StartDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''},
		{key:'Mobile',name:'Mobile',type:'input',value:''},
		{key:'CardId',name:'CardId',type:'input',value:''},
		{key:'IsAllocated',type:'select', name:'IsAllocated',value: 0, multiple: false,options:[{
				value: 0,
				label: 'all'
			},{
				value: 1,
				label: 'unallocated'
			},{
				value: 2,
				label: 'allocated'
			}]},
		{key:'IsRegister',name:'IsRegister',type:'select',options:[{
				value: -1,
				label: 'All'
			},{
				value: 0,
				label: 'No'
			},{
				value: 1,
				label: 'Yes'
			}],value: -1},
	];
	const _tableConfig=[
		{key:'UserID',name:'UserID',width:'120'},
		{key:'Mobile',name:'Mobile',width:'150'},
		{key:'CardID',name:'CardID'},
		{key:'AddDate',name:'AddDate'},
		{key:'IsRegister',name:'IsRegister'},
		{key:'IsAllocated',name:'IsAllocated'}
	];
	const _formConfig=[
		[{key:'UserID',name:'UserID',type:'input',disabled:true},{key:'Mobile',name:'Mobile',type:'input',disabled:true}],
		[{key:'CardId',name:'CardId',type:'input',disabled:true},{key:'AddTime',name:'AddTime',type:'input',disabled:true}],
		[{key:'IsRegister',name:'IsRegister',type:'select',disabled:true,configs:[{value: 1,label: 'YES'},{value: 0,label: 'NO'}]},{key:'IsAllocated',name:'IsAllocated',type:'select',disabled:true,configs:[]}]
	];
	export default {
		components:{ searchBar,pageForm,Pagination },
		data() {
		  return {
			  searchConfig:searchConfig,
			  tableConfig:tableConfig,
			  formConfig:formConfig,
			  list: null,
			  listCSRY: null,
			  listLoading: false,
			  listQuery: {
			    pageIndex: 1,
			    pageSize: 20
			  },
			  listCSRYQuery: {
				  pageIndex: 1,
				  pageSize: 20
			  },
			  listCSRYTotal: 0,
			  total: 10,
			  ifShowDrawer: false,
			  isAddDrawer: false,
			  allocationDrawer: false,
			  temp:[], //详情页数据
			  defaultProps: {
				  children: 'children',
				  label: 'Phone',
				  disabled: true
			  },
			  multipleSelectionCSRY: [],
			  checkedCSRY: [],
			  formCSRY: {
				  CardID: '',
				  Mobile: ''
			  },
			  rulesCSRY: {
				  Mobile: [
					  { required: true, message: '请输入手机号', trigger: 'blur' },
				  ],
				  CardID: [
					  { required: false, message: '请输入身份证号', trigger: 'blur' },
				  ],
			  }
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
			GetAllWhiteUserList(this.listQuery).then(response => {
		      this.list = response.data
		      this.total = response.tolal
		      this.listLoading = false
		    });
			this.fetchCSRYData();
		  },
			fetchCSRYData() {
				GetCollectionManListBMD(this.listCSRYQuery).then(response => {
					this.listCSRY = response.data.map(item => {
						return {
							...item,
							id: item.Phone,
							name: item.Name
						}
					});
					this.listCSRYTotal = response.tolal
				});
			},
		  Refresh(){
			this.listLoading = true
			UpdateWhiteUser({}).then(response => {
			  this.fetchData()
			})
		  },
			Add() {
				this.isAddDrawer = true;
			},
		  handleDetail(row){
		    this.temp=row;
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
			handleSubmitAddWhite() {
				console.log(this.formCSRY);
				this.$refs.formCSRY.validate((valid) => {
					if (valid) {
						console.log(this.formCSRY);
						AddWhiteSinge({Mobile: this.formCSRY.Mobile, CardID: this.formCSRY.CardID}).then(response => {
							this.isAddDrawer = false;
							this.fetchData()
							this.$message({
								type: 'success',
								message: i18n.t('information.SubSuccess')
							})
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			clickCancelAddWhite() {
				this.isAddDrawer = false;
				this.$refs.formCSRY.resetFields();
			},
			handleSelectionChange(val) {
				console.log(val);
				this.multipleSelectionCSRY = val;
			},
			fenpei() {
				this.allocationDrawer = true;
			},
			fenpeiSave() {
				// const arrSelectedUser = this.$refs.tree.getCheckedKeys();
				// console.warn(this.$refs.tree.getCheckedKeys());
				// if (!arrSelectedUser || !arrSelectedUser.length) {
				// 	return false;
				// }
				// if (arrSelectedUser && arrSelectedUser.length) {
				// 	arrSelectedUser.forEach((item, index) => {
				// 		AddWhiteSinge({Mobile: item}).then(response => {
				// 			if (index === arrSelectedUser.length - 1) {
				// 				this.allocationDrawer = false;
				// 			}
				// 		})
				// 	});
				// }
				// console.warn(this.checkedCSRY);
				const ids = this.multipleSelectionCSRY.map(item => {
					return item.ID;
				});
				CollectionAllot({
					"WhiteIDList": ids,
					"CollectionMemberID": this.checkedCSRY[0]
				}).then(response => {
					this.$message({
						type: 'success',
						message: i18n.t('information.SubSuccess')
					});
					this.allocationDrawer = false;
					this.fetchData();
				}).catch(err => {
					console.log(err);
					this.$message({
						type: 'info',
						message: i18n.t('information.SubFailed')
					})
				})
			},
			clickSendSms(row, index) {
				const data = {
					Mobile: row.Mobile
				};
				SendLoanQuality(data).then(res => {
					this.$message({
						type: 'success',
						message: i18n.t('information.SubSuccess')
					});
				}).catch(err => {
					this.$message({
						type: 'info',
						message: i18n.t('information.SubFailed')
					})
				});
			},
		  //保存之后，子组件回调
		  submitForm(data){
			UpdateWhiteUser(data)
			  .then(res => {
				  this.$message({
					type: 'success',
					message: i18n.t('information.SubSuccess')
				  })
				  this.fetchData()
				  this.ifShowDrawer = false
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
		overflow: hidden;
		box-sizing: border-box;
	}
	.fenpei {
		padding: 20px 0 0 20px;
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
/deep/ .el-checkbox-group {
	.el-checkbox {
		display: block;
		margin-bottom: 5px;
	}
}
</style>
