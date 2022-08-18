<template>
	<div class="XLYYBG-report-main">
		<div class="cus-container">
			<div class="filter-container">
				<search-bar :searchConfig="searchConfig" ref="searchbar"/>
				<div style="padding-top: 3px;margin-left: 12px;float: left;">
					<el-button class="filter-item" type="primary" size="small" style="width: 80px;" @click="search">
						{{ $t('table.search') }}
					</el-button>
					<el-button class="filter-item" size="small" style="width: 80px;" @click="resetInput">
						{{ $t('table.resetting') }}
					</el-button>
				</div>
			</div>
			<div style="padding: 20px">
				<div class="table-title">{{ $t('table.totalMessage') }}</div>
				<el-table
						v-loading="listLoading"
						:data="tolalListData"
						element-loading-text="Loading"
						fit
						highlight-current-row
				>
					<el-table-column v-for="(widget, index) in totalList" :label="widget.name" :width="widget.width" align="left">
						<template slot-scope="scope">
							{{ scope.row[widget.key] }}
						</template>
					</el-table-column>
					<template slot="empty" >
						<img src="@/assets/cus_images/nodata.png" class="cus-img">
						<p class="cus-nodata">{{ $t('table.nodata') }}</p>
					</template>
				</el-table>
				<div class="table-title" style="margin-top: 50px">{{ $t('table.DetailsSituation') }}</div>
				<el-table
					v-loading="listLoading"
					:data="list"
					element-loading-text="Loading"
					fit
					highlight-current-row
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
			</div>
			
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
					@click="handleSubmit"
				>保存</el-button> -->
				<!-- <el-button @click="ifShowDrawer = false">取消</el-button> -->
				</div>
			</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { GetPayList } from '@/api/exchange'

	import i18n from '@/lang'
	import {deepCopy} from "@/utils"; // internationalization
	const searchConfig=[
		{key:['StartDate','EndDate'],name:['开始日期','结束日期'],type:'daterange',value:''},
		{key:'Name',name:'姓名',type:'input',value:''},
		{key:'Mobile',name:'手机号',type:'input',value:''},
		{key:'CardId',name:'身份证',type:'input',value:''},
		{key:'PayMoney',name:'收支金额',type:'input',value:''},
		{key:'PayType',name:'收支类型',type:'select',options:[{
				value: '',
				label: '全部'
			},{
				value: 0,
				label: '支出'
			},{
				value: 1,
				label: '收入'
			},{
				value: 2,
				label: '展期'
			}],value:''}
	]
	const tableConfig=[
		{key:'Name',name:'姓名'},
		{key:'Mobile',name:'手机号',width:'150'},
		{key:'CardId',name:'adahaar卡'},
		{key:'AddTime',name:'申请时间'},
		{key:'PayType',name:'收支类型'},
		{key:'PayMoney',name:'收支金额'}
	]
	const formConfig=[
		[{key:'Name',name:'姓名',type:'input',disabled:true},{key:'Mobile',name:'手机号',type:'input',disabled:true}],
		[{key:'CardId',name:'adahaar 卡',type:'input',disabled:true},{key:'AddTime',name:'申请时间',type:'input',disabled:true}],
		[{key:'PayType',name:'收支类型',type:'select',disabled:true,configs:[{value: 1,label: '收入'},{value: 0,label: '支出'}]},{key:'PayMoney',name:'收支金额',type:'input',disabled:true}]
	]
	const totalList = [
        {key:'TotalAmout',name:'汇总'},
        {key:'TotalPay',name:'支出'},
        {key:'TotalIncome',name:'收入'},
        {key:'TotalRenew',name:'展期'}
    ];
    const _totalList = [
        {key:'TotalAmout',name:'TotalAmout'},
        {key:'TotalPay',name:'TotalPay'},
        {key:'TotalIncome',name:'TotalIncome'},
        {key:'TotalRenew',name:'TotalRenew'}
    ];

	//ng
	const _searchConfig=[
		{key:['StartDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''},
		{key:'Name',name:'Name',type:'input',value:''},
		{key:'Mobile',name:'Mobile',type:'input',value:''},
		{key:'CardId',name:'adahaar card',type:'input',value:''},
		{key:'PayMoney',name:'PayMoney',type:'input',value:''},
		{key:'PayType',name:'PayType',type:'select',options:[{
				value: '',
				label: 'ALL'
			},{
				value: 0,
				label: 'Pay'
			},{
				value: 1,
				label: 'income'
			},{
				value: 2,
				label: 'renewal'
			}],value:''}
	]
	const _tableConfig=[
		{key:'Name',name:'Name'},
		{key:'Mobile',name:'Mobile',width:'150'},
		{key:'CardId',name:'CardId'},
		{key:'AddTime',name:'AddTime'},
		{key:'PayType',name:'PayType'},
		{key:'PayMoney',name:'PayMoney'}
	]
	const _formConfig=[
		[{key:'Name',name:'Name',type:'input',disabled:true},{key:'Mobile',name:'Mobile',type:'input',disabled:true}],
		[{key:'CardId',name:'adahaar card',type:'input',disabled:true},{key:'AddTime',name:'AddTime',type:'input',disabled:true}],
		[{key:'PayType',name:'PayType',type:'select',disabled:true,configs:[{value: 1,label: '收入'},{value: 0,label: 'Pay'}]},{key:'PayMoney',name:'PayMoney',type:'input',disabled:true}]
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
				tolalListData:[],  //顶部各项数据
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
					this.totalList=deepCopy(totalList)
					this.formConfig=deepCopy(formConfig)
				}else if(val=='en'){//切换成英文
					this.searchConfig=deepCopy(_searchConfig)
					this.tableConfig=deepCopy(_tableConfig)
					this.totalList=deepCopy(_totalList)
					this.formConfig=deepCopy(_formConfig)
				}
			},
		  fetchData() {
		    this.listLoading = true
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			GetPayList(this.listQuery).then(response => {
				this.tolalListData = [{
					TotalAmout: response.TotalAmount,
					TotalPay: response.TotalPay,
					TotalIncome: response.TotalIncome,
					TotalRenew: response.TotalRenew,
				}];
				this.list = response.datas;
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
.XLYYBG-report-main{
	
	.cus-container {
		.top-container{
			padding: 20px 0 0px 20px;
		}
		.filter-container{
			padding: 20px 0 0px 20px;
			overflow: hidden;
            box-sizing: border-box;
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
	.table-title {
		font-size: 14px;
		margin-left: 10px;
		margin-top: 20px;
		padding-left: 3px;
		border-left: 5px solid #409EFF;
	}
}
</style>
