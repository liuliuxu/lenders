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
		<!-- <div class="fenpei">
			<el-button class="filter-item" type="primary" size="small"
				:disabled="!multipleSelectionCSRY || !multipleSelectionCSRY.length" @click="fenpei">
				{{ $t('table.Allocated') }}
			</el-button>
		</div> -->
		<el-table v-loading="listLoading" :data="list" @selection-change="handleSelectionChange"
			element-loading-text="Loading" fit highlight-current-row style="padding-left: 20px;padding-top: 20px;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<!-- <el-table-column type="index" width="75" label="序号"></el-table-column> -->
			<el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :width="widget.width"
				align="left">
				<template slot-scope="scope">
					<!-- <span v-if="widget.key === 'Mobile'">
						<span style="cursor:pointer;" v-if="!scope.row.isShowPhone"
							@click="switchPhoneShowStatus(scope.row)">************</span>
						<span class="" v-else>{{ scope.row[widget.key] }}</span>
					</span> -->
					<!-- <span v-if="widget.key === 'IsRegister'">
						<span v-if="language === 'en'">{{scope.row.IsRegister}}</span>
						<span v-else>{{scope.row.IsRegister_Ch}}</span>
					</span> -->
					<span >{{ scope.row[widget.key] }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('table.actions')" align="left" width="300" class-name="">
				<template slot-scope="{row,$index}">
					<!-- <el-button size="mini" type="primary" @click="clickSendSms(row, $index)">{{ $t('table.send') }}
					</el-button> -->
					<el-button size="mini" type="primary" @click="handleDetail(row, $index)">{{ $t('table.detail') }}
					</el-button>
					<!-- <el-button size="mini" type="primary" @click="registration(row, $index)">{{ $t('table.remarks') }}
					</el-button> -->
				</template>
			</el-table-column>
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
		<el-dialog :title="$t('table.registration')" :visible.sync="registrationDrawer" direction="rtl" width="500px">
			<div>
				<el-form ref="registrationForm" :rules="registrationRules" :model="registrationForm"
					label-width="100px">
					<!--					<el-form-item :label="$t('table.Mobile')" prop="Mobile">-->
					<!--						<el-input v-model="registrationForm.Mobile"></el-input>-->
					<!--					</el-form-item>-->
					<!--					<el-form-item :label="$t('table.CardID')" prop="CardID">-->
					<!--						<el-input v-model="registrationForm.CardID"></el-input>-->
					<!--					</el-form-item>-->
					<el-form-item :label="language === 'en' ? 'Is called' : '是否打电话'" prop="IsRegister">
						<el-radio-group v-model="registrationForm.IsRegister">
							<el-radio :label="language === 'en' ? 'yes' : '是'"></el-radio>
							<el-radio :label="language === 'en' ? 'no' : '否'"></el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item :label="language === 'en' ? 'Remark' : '备注'" prop="Remark">
						<el-input type="textarea" v-model="registrationForm.Remark"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div class="modal_foot">
				<div style="text-align: center;">
					<el-button type="primary" size="mini" @click="handleSubmitAddRegistration">{{ $t('table.save') }}
					</el-button>
					<el-button @click="clickCancelRegistration" size="mini">{{ $t('table.cancel') }}</el-button>
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
	</div>
</template>

<script>
import searchBar from '@/components/Page/searchBar.vue'
import pageForm from '@/components/Page/form.vue'
import Pagination from '@/components/Pagination'
import { GetWhiteListAllotList, CollectionAllot, CollectionRemarkWhiteList, WightClick } from '@/api/whitelist'
import { GetCollectionManListBMD, SendLoanQuality } from '@/api/user';

import i18n from '@/lang'
import { deepCopy } from "@/utils"; // internationalization
const searchConfig = [
	{ key: ['StartDate', 'EndDate'], name: ['开始时间', '开始时间'], type: 'daterange', value: '' },
	{ key: 'Mobile', name: '手机号', type: 'input', value: '' },
	{ key: 'IsRegister',name:'是否注册',type:'select',options:
		[
			{ value: -1, label: '全部' },
			{ value: 0, label: '否' },
			{ value: 1, label: '是' }
		],value: -1
	},
]
const tableConfig = [
	{ key: 'Mobile', name: '手机号码'},
	{ key: 'IsRegister_Ch', name: '是否注册'},
	{ key: 'AddTime', name: '插入白名单时间'}
]
const formConfig = [ 
	[{ key: 'Mobile', name: '手机号', type: 'input', disabled: true }, { key: 'AddTime', name: '时间', type: 'input', disabled: true }],
	[{ key: 'IsRegister', name: '是否注册', type: 'select', disabled: true, configs: [{ value: 1, label: '是' }, { value: 0, label: '否' }] }]
];

//ng
const _searchConfig = [
	{ key: ['StartDate', 'EndDate'], name: ['StartDate', 'EndDate'], type: 'daterange', value: '' },
	{ key: 'Mobile', name: 'Mobile', type: 'input', value: '' },
	{ key: 'IsRegister',name:'IsRegister',type:'select',options:
		[
			{ value: -1, label: 'All' },
			{ value: 0, label: 'No' },
			{ value: 1, label: 'Yes' }
		],value: -1
	},
]
const _tableConfig = [
	{ key: 'Mobile', name: 'Mobile'},
	{ key: 'IsRegister', name: 'IsRegister'},
	{ key: 'AddTime', name: 'Add whiteList Time'}
]
const _formConfig = [
	[{ key: 'Mobile', name: 'Mobile', type: 'input', disabled: true }, { key: 'AddTime', name: 'AddTime', type: 'input', disabled: true }],
	[{ key: 'IsRegister', name: 'IsRegister', type: 'select', disabled: true, configs: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] }]
]
export default {
	components: { searchBar, pageForm, Pagination },
	data() {
		return {
			searchConfig: searchConfig,
			tableConfig: tableConfig,
			formConfig: formConfig,
			list: null,
			listCSRY: null,
			listLoading: false,
			listQuery: {
				pageIndex: 1,
				pageSize: 20
			},
			total: 10,
			listCSRYQuery: {
				pageIndex: 1,
				pageSize: 20
			},
			listCSRYTotal: 0,
			ifShowDrawer: false,
			temp: [], //详情页数据
			selectedRow: null,
			multipleSelectionCSRY: [],
			checkedCSRY: [],
			allocationDrawer: false,
			registrationDrawer: false,
			registrationForm: {
				CardID: '',
				Mobile: '',
				IsRegister: '否',
				Remark: '',
				ID: null
			},
			registrationRules: {
				Mobile: [
					{ required: false, message: '请输入手机号', trigger: 'change' },
				],
				CardID: [
					{ required: false, message: '请输入身份证号', trigger: 'change' },
				],
				IsRegister: [
					{ required: true, message: '请选择是否注册', trigger: 'change' }
				],
				Remark: [
					{ required: true, message: '请输入备注', trigger: 'change' },
				]
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
			if (val == 'zh') {//切换成中文
				this.searchConfig = deepCopy(searchConfig)
				this.tableConfig = deepCopy(tableConfig)
				this.formConfig = deepCopy(formConfig)
			} else if (val == 'en') {//切换成英文
				this.searchConfig = deepCopy(_searchConfig)
				this.tableConfig = deepCopy(_tableConfig)
				this.formConfig = deepCopy(_formConfig)
			}
		},
		fetchData() {
			this.listLoading = true;
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			GetWhiteListAllotList(this.listQuery).then(response => {
				this.list = response.data.map(item => {
					return {
						...item,
						isShowPhone: true
					}
				});
				this.total = response.tolal;
				this.listLoading = false;
			}).catch(()=>{
				this.listLoading = false;
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
				this.listCSRYTotal = response.tolal;
			});
		},
		handleDetail(row) {
			this.temp = row;
			this.ifShowDrawer = true;
		},
		collection(row) {
			this.listLoading = true
			CollectionAllot({
				"WhiteIDList": [row.ID],
				"CollectionMemberID": 0
			}).then(response => {
				this.$message({
					type: 'success',
					message: i18n.t('information.SubSuccess')
				})
				this.fetchData()
			}).catch(err => {
				console.log(err)
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
		// 登记
		registration(row, index) {
			this.selectedRow = row;
			console.log(row);
			this.registrationForm.Mobile = row.Mobile;
			this.registrationForm.CardID = row.CardID;
			this.registrationForm.ID = row.ID;
			this.registrationForm.Remark = row.Remark;
			this.registrationForm.IsRegister = row.IsCallPhone.indexOf('未拨打') >= 0 ? '否' : '是';
			this.registrationDrawer = true;
		},
		clickCancelRegistration() {
			this.registrationDrawer = false;
			this.$refs.registrationForm.resetFields();
		},
		handleSubmitAddRegistration() {
			this.$refs.registrationForm.validate((valid) => {
				if (valid) {
					console.log(this.registrationForm);
					CollectionRemarkWhiteList({
						Id: this.registrationForm.ID,
						Remark: this.registrationForm.Remark,
						IsCallPhone: this.registrationForm.IsRegister === '是' ? 1 : 0
					}).then(response => {
						this.registrationDrawer = false;
						this.fetchData();
						this.$refs.registrationForm.resetFields();
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
		//重置
		resetInput() {
			this.$refs.searchbar.resetInput();
		},
		//搜索
		search() {
			this.fetchData()
		},
		handleSelectionChange(val) {
			this.multipleSelectionCSRY = val;
		},
		fenpei() {
			this.allocationDrawer = true;
		},
		fenpeiSave() {
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
		switchPhoneShowStatus(row) {
			// this.list.forEach(item => {
			// 	item.isShowPhone = false;
			// });
			row.isShowPhone = !row.isShowPhone;
			WightClick(row.ID).then();
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
