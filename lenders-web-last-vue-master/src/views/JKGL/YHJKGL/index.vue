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
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.detail') }}</el-button>
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
<!-- 		      <el-button
		        type="primary"
		        @click="handleSubmit"Please enter the correct user name

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
	import { GetApplyMoneyList } from '@/api/exchange'
	import i18n from '@/lang'
	import {deepCopy} from "@/utils";
	const searchConfig=[
		{key:'Name',name:'姓名',type:'input',value:''},
		{key:'Mobile',name:'手机号',type:'input',value:''},
		{key:'OrderId',name:'借款订单号',type:'input',value:''},
		{key:'IsApply',type:'select', name:'申请结果',value: [], multiple: true,options:[{
				value: 0,
				label: '审核中'
			},{
				value: 1,
				label: '审核通过'
			},{
				value: 2,
				label: '放款中'
			},{
				value: 3,
				label: '放款完成'
			},{
				value: 4,
				label: '拒绝放款'
			},{
				value: 5,
				label: '还款中'
			},{
				value: 6,
				label: '已完成'
			}]},
		{key:['StartDate','EndDate'],name:['开始日期','结束日期'],type:'daterange',value:''}
	];
	const tableConfig=[
		{key:'Name',name:'姓名',width:'120'},
		{key:'Mobile',name:'手机号',width:'150'},
		{key:'LoanMoney',name:'合同金额'},
		{key:'LoanDay',name:'贷款期限'},
		{key:'AddTime',name:'申请时间',width:'150'},
		{key:'ServiceCharge',name:'服务费'},
		{key:'GSTRevenue',name:'GST税费'},
		{key:'Interest',name:'利息'},
		{key:'IsApply_Ch',name:'申请结果'},
		{key:'Reason',name:'审核备注'},
		{key:'Score_Ch',name:'风控评分'},
		{key:'State_Ch',name:'借款状态',width:'120'}
	];
	//en
	const formConfig=[
		[{key:'Name',name:'姓名',type:'input',disabled:true},{key:'Mobile',name:'手机号',type:'input',disabled:true}],
		[{key:'LoanMoney',name:'合同金额',type:'input',disabled:true},{key:'LoanDay',name:'贷款期限',type:'input',disabled:true}],
		[{key:'AddTime',name:'申请时间',type:'input',disabled:true},{key:'ServiceCharge',name:'服务费',type:'input',disabled:true}],
		[{key:'GSTRevenue',name:'GST税费',type:'input',disabled:true},{key:'Interest',name:'利息',type:'input',disabled:true}],
		[{key:'IsApply',name:'申请结果',type:'input',disabled:true},{key:'Reason',name:'审核备注',type:'input',disabled:true}],
		[{key:'Score',name:'风控评分',type:'input',disabled:true},{key:'State',name:'借款状态',type:'input',disabled:true}]
	];
	const _searchConfig=[
		{key:'Name',name:'Name',type:'input',value:''},
		{key:'Mobile',name:'Mobile',type:'input',value:''},
		{key:'OrderId',name:'OrderId',type:'input',value:''},
		{key:'IsApply',type:'select', name:'IsApply',value: [], multiple: true,options:[{
				value: 0,
				label: 'Under review'
			},{
				value: 1,
				label: 'Approved'
			},{
				value: 2,
				label: 'On loan'
			},{
				value: 3,
				label: 'Loan completion'
			},{
				value: 4,
				label: 'Refuse to lend'
			},{
				value: 5,
				label: 'Repayment in progress'
			},{
				value: 6,
				label: 'Completed'
			}]},
		{key:['StartDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''}
	];
	const _tableConfig=[
		{key:'Name',name:'Name',width:'120'},
		{key:'Mobile',name:'Mobile',width:'150'},
		{key:'LoanMoney',name:'LoanMoney'},
		{key:'LoanDay',name:'LoanDay'},
		{key:'AddTime',name:'AddTime',width:'150'},
		{key:'ServiceCharge',name:'ServiceCharge'},
		{key:'GSTRevenue',name:'GSTRevenue'},
		{key:'Interest',name:'Interest'},
		{key:'IsApply',name:'IsApply'},
		{key:'Reason',name:'Reason'},
		{key:'Score',name:'Score'},
		{key:'State',name:'State',width:'120'}
	]
	const _formConfig=[
		[{key:'Name',name:'Name',type:'input',disabled:true},{key:'Mobile',name:'Mobile',type:'input',disabled:true}],
		[{key:'LoanMoney',name:'LoanMoney',type:'input',disabled:true},{key:'LoanDay',name:'LoanDay',type:'input',disabled:true}],
		[{key:'AddTime',name:'AddTime',type:'input',disabled:true},{key:'ServiceCharge',name:'ServiceCharge',type:'input',disabled:true}],
		[{key:'GSTRevenue',name:'GSTRevenue',type:'input',disabled:true},{key:'Interest',name:'Interest',type:'input',disabled:true}],
		[{key:'IsApply',name:'IsApply',type:'input',disabled:true},{key:'Reason',name:'Reason',type:'input',disabled:true}],
		[{key:'Score',name:'Score',type:'input',disabled:true},{key:'State',name:'State',type:'input',disabled:true}]
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
		    this.listLoading = true
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
		    GetApplyMoneyList(this.listQuery).then(response => {
		      this.list = response.datas
		      this.total = response.tolal
		      this.listLoading = false
		    })
		  },
		  handleDetail(row){
		    console.log(row)
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
