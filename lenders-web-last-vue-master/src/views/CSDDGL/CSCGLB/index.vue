<template>
	<div class="XLYYBG-report-main">
		<div class="cus-container">
			<div class="filter-container">
				<search-bar :searchConfig="searchConfig" ref="searchbar" />
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
				<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row
					style="padding-left: 20px;padding-top: 20px;">
					<el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :width="widget.width"
						align="left">
						<template slot-scope="scope">
							{{ scope.row[widget.key] }}
						</template>
					</el-table-column>
					<el-table-column :label="$t('table.actions')" align="left" width="150" class-name="">
						<template slot-scope="{row,$index}">
							<el-button size="mini" type="primary" @click="handleDetail(row, $index)">{{ $t('table.detail') }}
							</el-button>
						</template>
					</el-table-column>
					<template slot="empty">
						<img src="@/assets/cus_images/nodata.png" class="cus-img">
						<p class="cus-nodata">{{ $t('table.nodata') }}</p>
					</template>
				</el-table>
			</div>
			
			<pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"
				@pagination="fetchData" />
			<el-dialog :title="$t('table.detail')" :visible.sync="ifShowDrawer" direction="rtl" width="800px">
				<page-form :formConfig="formConfig" :temp="temp" />
				<div class="modal_foot">
					<div style="text-align: center;">
						<!--<el-button type="primary" @click="handleSubmit">保存</el-button> -->
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
import { CollectionSucced, GetCollectionManList } from '@/api/user'
import i18n from '@/lang'
import { deepCopy } from "@/utils";
const searchConfig = [
	{ key: 'Name', name: '客户名称', type: 'input', value: '' },
	{ key: 'OrderId', name: '借款订单号', type: 'input', value: '' },
	{ key: 'Mobile', name: '客户手机号', type: 'input', value: '' },
	{ key: 'collectionID', type: 'select', name: '催收人员筛选', value: [], multiple: true, options: [] },
	{ key: ['ShouldRepaymentDateStart', 'ShouldRepaymentDateEnd'], name: ['开始日期', '结束日期'], type: 'daterangecustme', value: '', keyName: '计划还款时间' },
	{ key: ['LastRepaymentDateStart', 'LastRepaymentDateEnd'], name: ['开始日期', '结束日期'], type: 'daterangecustme', value: '', keyName: '实际还款时间' }
]
const tableConfig = [
	{ key: 'Name', name: '客户姓名', width: '120' },
	{ key: 'Mobile', name: '手机号', width: '150' },
	{ key: 'OrderID', name: '订单号' },
	{ key: 'CollectionNo', name: '催收员编号' },
	{ key: 'CollectionType', name: '催回类型' },
	{ key: 'ApplyTime', name: '申请时间', width: '150' },
	{ key: 'ShouldRepaymentMoney', name: '应还金额' },
	{ key: 'LastRepaymentMoney', name: '实际还款金额' },
	{ key: 'ShouldRepaymentDate', name: '计划还款时间' },
	{ key: 'LastRepaymentDate', name: '实际还款时间 ' }
];
const formConfig = [
	[{ key: 'Name', name: '客户姓名', type: 'input', disabled: true }, { key: 'OrderId', name: '借款单号', type: 'input', disabled: true }],
	[{ key: 'Mobile', name: '手机号', type: 'input', disabled: true }, { key: 'ShouldRepaymentMoney', name: '应还金额', type: 'input', disabled: true }],
	[{ key: 'ShouldRepaymentDate', name: '计划还款时间', type: 'input', disabled: true }, { key: 'LastRepaymentDate', name: '实际还款时间', type: 'input', disabled: true }],
	[{ key: 'OverDueDays', name: '逾期天数', type: 'input', disabled: true }, { key: 'OverDueFine', name: '逾期金额', type: 'input', disabled: true }],
	[{ key: 'collectionNo', name: '催收人编号', type: 'input', disabled: true }, { key: 'IsRepayment', name: '是否结清', type: 'select', disabled: true, configs: [{ value: 1, label: '是' }, { value: 0, label: '否' }] }]
];
const totalList = [
	{key:'tolal',name:'还款总单数'},
	{key:'RepaymentTotalAmount',name:'还款总金额'},
	{key:'ShouldRepaymentTotalAmount',name:'应还总金额'}
];
const _totalList = [
	{key:'tolal',name:'Total repayment orders'},
	{key:'RepaymentTotalAmount',name:'RepaymentTotalAmount'},
	{key:'ShouldRepaymentTotalAmount',name:'ShouldRepaymentTotalAmount'}
];
//en
const _searchConfig = [
	{ key: 'Name', name: 'Name', type: 'input', value: '' },
	{ key: 'OrderId', name: 'OrderId', type: 'input', value: '' },
	{ key: 'Mobile', name: 'Mobile', type: 'input', value: '' },
	{ key: 'collectionID', type: 'select', name: 'Collection personnel', value: [], multiple: true, options: [] },
	{ key: ['ShouldRepaymentDateStart', 'ShouldRepaymentDateEnd'], name: ['StartDate', 'EndDate'], type: 'daterangecustme', value: '', keyName: 'ShouldRepaymentDate' },
	{ key: ['LastRepaymentDateStart', 'LastRepaymentDateEnd'], name: ['StartDate', 'EndDate'], type: 'daterangecustme', value: '', keyName: 'LastRepaymentDate' }
];
const _tableConfig = [
	{ key: 'Name', name: 'Name', width: '120' },
	{ key: 'Mobile', name: 'Mobile', width: '150' },
	{ key: 'OrderID', name: 'OrderID' },
	{ key: 'CollectionNo', name: 'CollectionNo' },
	{ key: 'CollectionType', name: 'CollectionType' },
	{ key: 'ApplyTime', name: 'ApplyTime', width: '150' },
	{ key: 'ShouldRepaymentMoney', name: 'ShouldRepaymentMoney' },
	{ key: 'LastRepaymentMoney', name: 'Actual repayment amount' },
	{ key: 'ShouldRepaymentDate', name: 'ShouldRepaymentDate' },
	{ key: 'LastRepaymentDate', name: 'LastRepaymentDate ' }
];
const _formConfig = [
	[{ key: 'Name', name: 'Name', type: 'input', disabled: true }, { key: 'OrderId', name: 'OrderId', type: 'input', disabled: true }],
	[{ key: 'Mobile', name: 'Mobile', type: 'input', disabled: true }, { key: 'ShouldRepaymentMoney', name: 'ShouldRepaymentMoney', type: 'input', disabled: true }],
	[{ key: 'ShouldRepaymentDate', name: 'ShouldRepaymentDate', type: 'input', disabled: true }, { key: 'LastRepaymentDate', name: 'LastRepaymentDate', type: 'input', disabled: true }],
	[{ key: 'OverDueDays', name: 'OverDueDays', type: 'input', disabled: true }, { key: 'OverDueFine', name: 'OverdueAmount', type: 'input', disabled: true }],
	[{ key: 'collectionNo', name: 'collectionNo', type: 'input', disabled: true }, { key: 'IsRepayment', name: 'IsRepayment', type: 'select', disabled: true, configs: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] }]
];
export default {
	components: { searchBar, pageForm, Pagination },
	data() {
		return {
			searchConfig: searchConfig,
			tableConfig: tableConfig,
			formConfig: formConfig,
			list: null,
			listLoading: false,
			listQuery: {
				pageIndex: 1,
				pageSize: 20
			},
			listCSRYQuery: {
				pageIndex: 1,
				pageSize: 999,
				type: ''
			},
			listCSRYTotal: 0,
			listCSRY: null,
			total: 10,
			ifShowDrawer: false,
			temp: [], //详情页数据
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
			if (val == 'zh') {//切换成中文
				this.searchConfig = deepCopy(searchConfig)
				this.tableConfig = deepCopy(tableConfig)
				this.totalList=deepCopy(totalList)
				this.formConfig = deepCopy(formConfig)
			} else if (val == 'en') {//切换成英文
				this.searchConfig = deepCopy(_searchConfig)
				this.tableConfig = deepCopy(_tableConfig)
				this.totalList=deepCopy(_totalList)
				this.formConfig = deepCopy(_formConfig)
			}
			this.setCollectionOpt();
		},
		setCollectionOpt() {
			const collection = this.searchConfig.find(item => item.key === 'collectionID');
			if (collection) {
				collection.options = this.listCSRY;
			}
		},
		fetchData() {
			this.listLoading = true;
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			CollectionSucced(this.listQuery).then(response => {
				this.tolalListData = [{
					tolal: response.tolal,
					RepaymentTotalAmount: response.RepaymentTotalAmount,
					ShouldRepaymentTotalAmount: response.ShouldRepaymentTotalAmount,
				}];
				this.list = response.data;
				this.total = response.tolal;
				this.listLoading = false;
			});
			this.fetchCSRYData();
		},
		fetchCSRYData() {
			GetCollectionManList(this.listCSRYQuery).then(response => {
				this.listCSRY = response.data.map(item => {
					return {
						...item,
						id: item.Phone,
						name: item.Name,
						value: item.Id,
						label: item.Name + item.Phone
					}
				});
				this.setCollectionOpt();
				this.listCSRYTotal = response.tolal
			});
		},
		handleDetail(row) {
			this.temp = row;
			this.ifShowDrawer = true;
		},
		//重置
		resetInput() {
			this.$refs.searchbar.resetInput();
		},
		//搜索
		search() {
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
