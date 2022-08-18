<template>
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
		<div class="fenpei">
			<el-button class="filter-item" type="primary" size="small"
				:disabled="!multipleSelectionCSRY || !multipleSelectionCSRY.length" @click="fenpei">
				{{ $t('table.Allocated') }}
			</el-button>
		</div>
		<div class="fenpei" style="font-size: 14px" v-if="multipleSelectionCSRY && multipleSelectionCSRY.length">
			已选择{{ multipleSelectionCSRY.length }}条</div>
		<el-table v-loading="listLoading" :data="list" @selection-change="handleSelectionChange"
			element-loading-text="Loading" fit highlight-current-row @sort-change="tableSortChange"
			style="padding-left: 20px;padding-top: 10px;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column :label="$t('table.actions')" align="left" width="300" class-name="">
				<template slot-scope="{row,$index}">
					<div>
						<el-button size="mini" type="primary" @click="handleDetail(row, $index)">{{ $t('table.detail')
						}}
						</el-button>
						<el-button size="mini" type="primary" :disabled="row.isDisabled"
							@click="clickSendSms(row, $index)">{{ $t('table.send') }} <span v-if="row.sendmsgcount">({{
									row.sendmsgcount
							}})</span> </el-button>
					</div>
					<div style="margin-top: 10px;">
						<el-button size="mini" type="primary" @click="clickAddRemarks(row, $index)">{{
								$t('table.addRemarks')
						}}</el-button>
						<el-button size="mini" type="primary" @click="clickViewRemarks(row, $index)">{{
								$t('table.viewRemarks')
						}}</el-button>
					</div>
				</template>
			</el-table-column>
			<template v-for="(widget, index) in tableConfig">
				<!--                widget.key==='LastRepaymentDate'-->
				<!--                || widget.key==='ShouldRepaymentDate'-->
				<!--                ||-->
				<el-table-column
					v-if="widget.key === 'Addtime' || widget.key === 'OverDueDays' || widget.key === 'ShouldRepaymentDate'"
					:label="widget.name" :width="widget.width" :prop="widget.key" sortable="custom" align="left">
					<template slot-scope="scope">
						{{ scope.row[widget.key] }}
					</template>
				</el-table-column>
				<el-table-column v-else :label="widget.name" :width="widget.width" align="left">
					<!--                    <template slot-scope="scope">-->
					<!--                        {{ scope.row[widget.key] }}-->
					<!--                    </template>-->
					<template slot-scope="scope">
						<span v-if="widget.key === 'Mobile'">
							<span style="cursor:pointer;" v-if="!scope.row.isShowPhone"
								@click="switchPhoneShowStatus(scope.row)">************</span>
							<span class="" v-else>{{ scope.row[widget.key] }}</span>
						</span>
						<span v-else>{{ scope.row[widget.key] }}</span>
					</template>
				</el-table-column>
			</template>
			<template slot="empty">
				<img src="@/assets/cus_images/nodata.png" class="cus-img">
				<p class="cus-nodata">{{ $t('table.nodata') }}</p>
			</template>
		</el-table>
		<pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"
			@pagination="fetchData" />
		<el-dialog :title="$t('table.detail')" :visible.sync="ifShowDrawer" direction="rtl" width="800px">
			<page-form :formConfig="formConfig" :temp="temp" />
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
		<el-dialog :title="$t('table.Allocated')" :visible.sync="allocationDrawer" direction="rtl" width="500px">
			<div>
				<el-checkbox-group v-model="checkedCSRY" :max="1">
					<el-checkbox v-for="city in listCSRY" :label="city.Id" :key="city.Id">{{ city.Name }}{{ city.Phone
					}}
					</el-checkbox>
				</el-checkbox-group>
				<pagination v-show="listCSRYTotal > 0" :total="listCSRYTotal" :page.sync="listCSRYQuery.pageIndex"
					:limit.sync="listCSRYQuery.pageSize" @pagination="fetchCSRYData" />
			</div>
			<div class="modal_foot">
				<div style="text-align: center;">
					<el-button type="primary" size="mini" @click="fenpeiSave">{{ $t('table.save') }}</el-button>
					<el-button @click="allocationDrawer = false" size="mini">{{ $t('table.cancel') }}</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog :title="$t('table.remarks')" :visible.sync="addRemarksShowModal" direction="rtl" width="800px">
			<div>
				<el-form ref="formRemarks" :rules="rulesRemarks" :model="formRemarks" label-width="150px">
					<!--                    <el-form-item :label="$t('table.remarks')" prop="remarks">-->
					<!--                        <el-input type="textarea" :rows="5" v-model="formRemarks.remarks"></el-input>-->
					<!--                    </el-form-item>-->
					<el-form-item v-if="false" :label="language === 'en' ? 'Is called' : '是否打电话'" prop="IsRegister">
						<el-radio-group v-model="formRemarks.IsRegister">
							<el-radio :label="$t('table.Yes')"></el-radio>
							<el-radio :label="$t('table.No')"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item :label="language === 'en' ? 'Is connected' : '电话是否已接通'" prop="IsConnected">
						<el-radio-group v-model="formRemarks.IsConnected">
							<el-radio :label="$t('table.Yes')"></el-radio>
							<el-radio :label="$t('table.No')"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item :label="'Tag'" prop="TagKey">
						<el-radio-group v-model="formRemarks.TagKey">
							<el-radio v-for="(tag, index) in collectionTags" :label="tag.TagKey"
								style="margin-bottom: 10px;">
								{{ language === 'en' ? tag.TagName_En : tag.TagName_Cn }}
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item :label="$t('table.remarks')" prop="Remark">
						<el-input type="textarea" :rows="5" v-model="formRemarks.remarks"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div class="modal_foot">
				<div style="text-align: center;">
					<el-button type="primary" size="mini" @click="handleSubmitAddRemarks">{{ $t('table.save') }}
					</el-button>
					<el-button @click="clickCancelAddRemarks" size="mini">{{ $t('table.cancel') }}</el-button>
				</div>
			</div>
		</el-dialog>
		<el-dialog :title="$t('table.viewRemarks')" :visible.sync="viewRemarksShowModal" direction="rtl" width="800px">
			<div style="margin-bottom: 20px;">
				<el-table v-loading="viewRemarksLoading" :data="viewRemarksList" element-loading-text="Loading" fit
					highlight-current-row>
					<el-table-column v-for="(widget, index) in remarksConfig" :label="widget.name" :width="widget.width"
						align="left">
						<template slot-scope="scope">
							{{ scope.row[widget.key] }}
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="modal_foot">
				<div style="text-align: center;">
					<el-button @click="viewRemarksShowModal = false" size="mini">{{ $t('tagsView.close') }}</el-button>
				</div>
			</div>
		</el-dialog>
		<BorrowingInfo v-if="showDetail" :selectedItem="selectedItem" :showDetail="showDetail"
			@closeDetails="closeDetails()" />
	</div>
</template>

<script>
import searchBar from '@/components/Page/searchBar.vue'
import pageForm from '@/components/Page/form.vue'
import Pagination from '@/components/Pagination'
import BorrowingInfo from '@/components/BorrowingInfo/index';
import { DF1CollectionTotalList, GetCollectionManList, DMinus1AllotCollection, SendRepaymentLoans, SetCollRemark, SearchCollRemark, CollectionMobileClick } from '@/api/user';
import { GetCollectionTags } from '@/api/report';
import i18n from '@/lang'
import { deepCopy } from "@/utils";
import moment from 'moment';

const searchConfig = [
	{ key: 'OrderId', name: '借款单号', type: 'input', value: '' },
	{ key: 'Name', name: '借款人姓名', type: 'input', value: '' },
	{ key: 'OverDueDays', name: '逾期天数', type: 'inputVal', value: '', value1: '', key1: 'OverDueDays1' },
	{
		key: 'IsComplete', name: '是否催回', type: 'select', options: [{
			value: 2,
			label: '全部'
		}, {
			value: 0,
			label: '否'
		}, {
			value: 1,
			label: '是'
		}], value: 0
	},
	{
		key: 'IsColl', name: '是否已分配', type: 'select', options: [{
			value: 2,
			label: '全部'
		}, {
			value: 0,
			label: '否'
		}, {
			value: 1,
			label: '是'
		}], value: 2
	},
	{ key: 'collectionID', type: 'select', name: '催收人员筛选', value: [], multiple: true, options: [] },
	{ key: 'TagKey', type: 'select', name: '标签', value: '', options: [] },
	{
		key: 'Customer', type: 'select', name: '新老客', value: 2, multiple: false, options: [{
			value: 2,
			label: '全部'
		}, {
			value: 0,
			label: '新客'
		}, {
			value: 1,
			label: '老客'
		}]
	},
	{ key: ['StartTime', 'EndTime'], name: ['开始日期', '结束日期'], type: 'daterange', value: '' }
];
const tableConfig = [
	{ key: 'Remark', name: '备注' },
	{ key: 'TagName_Cn', name: '标签' },
	{ key: 'IsComplete_Ch', name: '是否催回' },
	{ key: 'IsColl_Ch', name: '是否已分配' },
	{ key: 'collectionNo', name: '催收人编号' },
	{ key: 'Name', name: '借款人姓名', width: '150' },
	{ key: 'OrderId', name: '借款单号', width: '150' },
	{ key: 'Mobile', name: '手机号' },
	{ key: 'ShouldRepaymentMoney', name: '应还金额' },
	{ key: 'ShouldRepaymentDate', name: '计划还款时间', width: '200' },
	{ key: 'RepaymentMoney', name: '实际还款金额', width: '150' },
	{ key: 'LastRepaymentDate', name: '实际还款时间', width: '200' },
	{ key: 'OverDueFine', name: '逾期金额' },
	{ key: 'OverDueDays', name: '逾期天数', width: '140' },
	{ key: 'Addtime', name: '添加时间', width: '200' }
];
const formConfig = [
	[{ key: 'Name', name: '借款人姓名', type: 'input', disabled: true }, { key: 'OrderId', name: '借款单号', type: 'input', disabled: true }],
	[{ key: 'Mobile1', name: '手机号', type: 'input', disabled: true }, { key: 'ShouldRepaymentMoney', name: '应还金额', type: 'input', disabled: true }],
	[{ key: 'ShouldRepaymentDate', name: '计划还款时间', type: 'input', disabled: true }, { key: 'LastRepaymentDate', name: '实际还款时间', type: 'input', disabled: true }],
	[{ key: 'OverDueDays', name: '逾期天数', type: 'input', disabled: true }, { key: 'OverDueFine', name: '逾期金额', type: 'input', disabled: true }],
	[{ key: 'collectionNo', name: '催收人编号', type: 'input', disabled: true }, { key: 'IsComplete', name: '是否催回', type: 'select', disabled: true, configs: [{ value: 1, label: '是' }, { value: 0, label: '否' }] }],
	[{ key: 'Addtime', name: '添加时间', type: 'input', disabled: true }]
];
const remarksConfig = [
	{ key: 'CollectionName', name: '备注人姓名', width: '150' },
	// {key:'IsCalled',name:'是否打电话',width:'120'},
	{ key: 'IsConnected', name: '电话是否已接通', width: '120' },
	{ key: 'TagName_Cn', name: '标签' },
	{ key: 'Remark', name: '备注内容', width: '220' },
	{ key: 'RemardDate', name: '备注时间' }
];
//en
const _searchConfig = [
	{ key: 'OrderId', name: 'OrderId', type: 'input', value: '' },
	{ key: 'Name', name: 'Name', type: 'input', value: '' },
	{ key: 'OverDueDays', name: 'OverDueDays', type: 'inputVal', value: '', value1: '', key1: 'OverDueDays1' },
	{
		key: 'IsComplete', name: 'IsComplete', type: 'select', options: [{
			value: 2,
			label: 'ALL'
		}, {
			value: 0,
			label: 'No'
		}, {
			value: 1,
			label: 'Yes'
		}], value: 0
	},
	{
		key: 'IsColl', name: 'IsAllocation', type: 'select', options: [{
			value: 2,
			label: 'ALL'
		}, {
			value: 0,
			label: 'No'
		}, {
			value: 1,
			label: 'Yes'
		}], value: 2
	},
	{ key: 'collectionID', type: 'select', name: 'Collection personnel', value: [], multiple: true, options: [] },
	{ key: 'TagKey', type: 'select', name: 'Tag', value: '', options: [] },
	{
		key: 'Customer', type: 'select', name: 'New and old guests', value: 2, multiple: false, options: [{
			value: 2,
			label: 'All'
		}, {
			value: 0,
			label: 'New guests'
		}, {
			value: 1,
			label: 'Old man'
		}]
	},
	{ key: ['StartTime', 'EndTime'], name: ['StartTime', 'EndTime'], type: 'daterange', value: '' }
];
const _tableConfig = [
	{ key: 'Remark', name: 'Remark' },
	{ key: 'TagName_En', name: 'Tag' },
	{ key: 'IsComplete', name: 'IsComplete' },
	{ key: 'IsColl', name: 'IsAllocation' },
	{ key: 'collectionNo', name: 'collectionNo' },
	{ key: 'Name', name: 'Name', width: '150' },
	{ key: 'OrderId', name: 'OrderId', width: '150' },
	{ key: 'Mobile', name: 'Mobile' },
	{ key: 'ShouldRepaymentMoney', name: 'ShouldRepaymentMoney' },
	{ key: 'ShouldRepaymentDate', name: 'ShouldRepaymentDate', width: '200' },
	{ key: 'RepaymentMoney', name: 'RepaymentMoney', width: '150' },
	{ key: 'LastRepaymentDate', name: 'LastRepaymentDate', width: '200' },
	{ key: 'OverDueFine', name: 'OverdueAmount' },
	{ key: 'OverDueDays', name: 'OverDueDays', width: '140' },
	{ key: 'Addtime', name: 'Addtime', width: '200' }
];
const _formConfig = [
	[{ key: 'Name', name: 'Name', type: 'input', disabled: true }, { key: 'OrderId', name: 'OrderId', type: 'input', disabled: true }],
	[{ key: 'Mobile1', name: 'Mobile', type: 'input', disabled: true }, { key: 'ShouldRepaymentMoney', name: 'ShouldRepaymentMoney', type: 'input', disabled: true }],
	[{ key: 'ShouldRepaymentDate', name: 'ShouldRepaymentDate', type: 'input', disabled: true }, { key: 'LastRepaymentDate', name: 'LastRepaymentDate', type: 'input', disabled: true }],
	[{ key: 'OverDueDays', name: 'OverDueDays', type: 'input', disabled: true }, { key: 'OverDueFine', name: 'OverdueAmount', type: 'input', disabled: true }],
	[{ key: 'collectionNo', name: 'collectionNo', type: 'input', disabled: true }, { key: 'IsComplete', name: 'IsComplete', type: 'select', disabled: true, configs: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] }],
	[{ key: 'Addtime', name: 'Addtime', type: 'input', disabled: true }]
];
const _remarksConfig = [
	{ key: 'CollectionName', name: 'CollectionName', width: '150' },
	// {key:'IsCalled',name:'IsCalled',width:'120'},
	{ key: 'IsConnected', name: 'IsConnected', width: '120' },
	{ key: 'TagName_En', name: 'Tag' },
	{ key: 'Remark', name: 'Remark', width: '220' },
	{ key: 'RemardDate', name: 'RemarkDate' }
];
export default {
	components: { searchBar, pageForm, Pagination, BorrowingInfo },
	data() {
		return {
			searchConfig: searchConfig,
			tableConfig: tableConfig,
			formConfig: formConfig,
			remarksConfig,
			list: null,
			listLoading: false,
			listQuery: {
				pageIndex: 1,
				pageSize: 20,
				CollectionTotalSorts: [
				]
			},
			total: 10,
			ifShowDrawer: false,
			temp: [], //详情页数据
			allocationDrawer: false,
			multipleSelectionCSRY: [],
			checkedCSRY: [],
			listCSRYQuery: {
				pageIndex: 1,
				pageSize: 999,
				type: 'D-1'
			},
			listCSRYTotal: 0,
			listCSRY: null,
			orderItem: null,
			addRemarksShowModal: false, // 添加备注的弹出框显示状态
			viewRemarksShowModal: false, // 查看备注的弹出框显示状态
			viewRemarksLoading: false, // 查看备注的加载状态
			viewRemarksList: null, // 查看备注的列表
			formRemarks: {
				remarks: '',
				IsRegister: i18n.t('table.No'),
				IsConnected: i18n.t('table.No'),
				TagKey: '',
			},
			rulesRemarks: {
				remarks: [
					{ required: true, message: 'Please enter a note', trigger: 'blur' },
				],
				IsRegister: [
					{ required: false, message: 'Please select Is called', trigger: 'change' }
				],
				IsConnected: [
					{ required: true, message: 'Please select Is Connected', trigger: 'change' }
				],
				TagKey: [
					{ required: false, message: 'Please select Tag', trigger: 'change' }
				]
			},
			showDetail: false,
			selectedItem: null,
			collectionTags: []
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
		this.fetchGetCollectionTags();
	},
	methods: {
		fetchGetCollectionTags() {
			GetCollectionTags().then(res => {
				console.warn(res);
				this.collectionTags = res.Tags.map(item => {
					return {
						...item,
						value: item.TagKey,
						label: this.language === 'en' ? item.TagName_En : item.TagName_Cn
					}
				});
				this.setTagOpt();
			});
		},
		setTagOpt() {
			const TagKey = this.searchConfig.find(item => item.key === 'TagKey');
			if (TagKey) {
				TagKey.options = this.collectionTags;
			}
		},
		closeDetails() {
			this.showDetail = false;
		},
		switchLanguage(val) {//原始数据 应用数据 en/zh
			if (val == 'zh') {//切换成中文
				this.searchConfig = deepCopy(searchConfig)
				this.tableConfig = deepCopy(tableConfig)
				this.formConfig = deepCopy(formConfig)
				this.remarksConfig = deepCopy(remarksConfig);
			} else if (val == 'en') {//切换成英文
				this.searchConfig = deepCopy(_searchConfig)
				this.tableConfig = deepCopy(_tableConfig)
				this.formConfig = deepCopy(_formConfig)
				this.remarksConfig = deepCopy(_remarksConfig);
			}
			this.setCollectionOpt();
			this.setTagOpt();
		},
		fetchData() {
			this.listLoading = true;
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			DF1CollectionTotalList(this.listQuery).then(response => {
				this.list = response.data.map(item => {
					const IsComplete_Ch = item.IsComplete ? '是' : '否';
					const IsComplete = item.IsComplete ? 'yes' : 'no';
					const ShouldRepaymentDate = moment(item.ShouldRepaymentDate).format('YYYY-MM-DD');
					let LastRepaymentDate = moment(item.LastRepaymentDate).format('YYYY-MM-DD');
					if (LastRepaymentDate === '0001-01-01') {
						LastRepaymentDate = '--';
					}
					return {
						...item,
						IsComplete,
						IsComplete_Ch,
						ShouldRepaymentDate,
						LastRepaymentDate,
						isShowPhone: false,
						sendmsgcount: item.sendmsgcount || 0,
						isDisabled: false
					}
				});
				this.total = response.tolal;
				this.listLoading = false
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
		setCollectionOpt() {
			const collection = this.searchConfig.find(item => item.key === 'collectionID');
			if (collection) {
				collection.options = this.listCSRY;
			}
		},
		handleDetail(row) {
			this.temp = row;
			// this.ifShowDrawer=true;
			this.selectedItem = row;
			this.showDetail = true;
		},
		//重置
		resetInput() {
			this.$refs.searchbar.resetInput();
		},
		//搜索
		search() {
			this.fetchData()
		},
		tableSortChange(column) {
			console.warn(column, prop, order);
			const { prop, order } = column;
			this.listQuery.CollectionTotalSorts = [];
			let Addtime = this.listQuery.CollectionTotalSorts.find(item => item.name === 'addtime');
			let OverDueDays = this.listQuery.CollectionTotalSorts.find(item => item.name === 'OverDueDays');
			let ShouldRepaymentDate = this.listQuery.CollectionTotalSorts.find(item => item.name === 'ShouldRepaymentDate');
			if (!Addtime) {
				Addtime = {
					name: 'addtime'
				};
			}
			if (!OverDueDays) {
				OverDueDays = {
					name: 'OverDueDays'
				};
			}
			if (!ShouldRepaymentDate) {
				ShouldRepaymentDate = {
					name: 'ShouldRepaymentDate'
				};
			}
			if (prop === 'Addtime' && order && order === 'descending') {
				Addtime.orderBy = 1;
			} else if (prop === 'Addtime' && order && order === 'ascending') {
				Addtime.orderBy = 0;
			}
			if (prop === 'OverDueDays' && order && order === 'descending') {
				OverDueDays.orderBy = 1;
			} else if (prop === 'OverDueDays' && order && order === 'ascending') {
				OverDueDays.orderBy = 0;
			}
			if (prop === 'ShouldRepaymentDate' && order && order === 'descending') {
				ShouldRepaymentDate.orderBy = 1;
			} else if (prop === 'ShouldRepaymentDate' && order && order === 'ascending') {
				ShouldRepaymentDate.orderBy = 0;
			}
			this.listQuery.CollectionTotalSorts = [];
			if (Addtime.hasOwnProperty('orderBy')) {
				this.listQuery.CollectionTotalSorts.push(Addtime);
			}
			if (OverDueDays.hasOwnProperty('orderBy')) {
				this.listQuery.CollectionTotalSorts.push(OverDueDays);
			}
			if (ShouldRepaymentDate.hasOwnProperty('orderBy')) {
				this.listQuery.CollectionTotalSorts.push(ShouldRepaymentDate);
			}
			this.fetchData();
		},
		handleSelectionChange(val) {
			console.log(val);
			this.multipleSelectionCSRY = val;
		},
		fenpei() {
			this.allocationDrawer = true;
		},
		fenpeiSave() {
			const ids = this.multipleSelectionCSRY.map(item => {
				return item.ID;
			});
			DMinus1AllotCollection({
				"ApplyAmountList": ids,
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
				});
			});
		},
		clickSendSms(row, index) {
			const data = {
				Mobile: row.Mobile
			};
			row.isDisabled = true;
			SendRepaymentLoans(data).then(res => {
				row.sendmsgcount += 1;
				setTimeout(() => {
					row.isDisabled = false;
				}, 5000);
				this.$message({
					type: 'success',
					message: i18n.t('information.SubSuccess')
				});
			}).catch(err => {
				row.isDisabled = false;
				this.$message({
					type: 'info',
					message: i18n.t('information.SubFailed')
				})
			});
		},
		clickAddRemarks(row, index) {
			this.addRemarksShowModal = true;
			this.orderItem = row;
		},
		clickViewRemarks(row, index) {
			this.orderItem = row;
			this.viewRemarksShowModal = true;
			this.fetchRemarksInfo();
		},
		fetchRemarksInfo() {
			this.viewRemarksLoading = true;
			const data = {
				RecordID: this.orderItem.ID,
				RemarkStatu: -1
			};
			SearchCollRemark(data).then(res => {
				this.viewRemarksList = res.collectionRemarkModelres.map(item => {
					return {
						...item,
						IsConnected: item.IsConnected === 1 ? i18n.t('table.Yes') : i18n.t('table.No'),
					}
				});
				this.viewRemarksLoading = false;
			});
		},
		clickCancelAddRemarks() {
			this.addRemarksShowModal = false;
		},
		handleSubmitAddRemarks() {
			this.$refs.formRemarks.validate((valid) => {
				if (valid) {
					console.log(this.formRemarks);
					SetCollRemark({
						Remark: this.formRemarks.remarks,
						// IsCalled: this.formRemarks.IsRegister === i18n.t('table.No') ? 0 : 1,
						IsConnected: this.formRemarks.IsConnected === i18n.t('table.No') ? 0 : 1,
						TagKey: this.formRemarks.TagKey,
						RecordID: this.orderItem.ID,
						RemarkStatu: -1
					}).then(response => {
						this.addRemarksShowModal = false;
						this.formRemarks.remarks = '';
						this.formRemarks.IsRegister = '';
						this.formRemarks.IsConnected = '';
						this.fetchData();
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
		switchPhoneShowStatus(row) {
			// this.list.forEach(item => {
			// 	item.isShowPhone = false;
			// });
			row.isShowPhone = !row.isShowPhone;
			CollectionMobileClick({ mobile: row.Mobile }).then();
		}
	}
}
</script>

<style lang="scss" scoped>
.cus-container {
	.filter-container {
		padding: 20px 0 0px 20px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.fenpei {
		padding: 20px 0 0 20px;
	}

	>>>.el-table__empty-text {
		line-height: 1;
	}

	.cus-img {
		height: 40px;
		margin-top: 60px;
	}

	.cus-nodata {
		line-height: inherit !important;
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
