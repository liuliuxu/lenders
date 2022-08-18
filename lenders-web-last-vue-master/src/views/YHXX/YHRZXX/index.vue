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
					<el-button size="mini" type="primary" @click="handleDetail(row, $index)">详情</el-button>
				</template>
			</el-table-column>
			<template slot="empty">
				<img src="@/assets/cus_images/nodata.png" class="cus-img">
				<p class="cus-nodata">{{ $t('table.nodata') }}</p>
			</template>
		</el-table>
		<pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"
			@pagination="fetchData" />
		<el-dialog title="详情" :visible.sync="ifShowDrawer" direction="rtl" width="800px">
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
	</div>
</template>

<script>
import searchBar from '@/components/Page/searchBar.vue'
import pageForm from '@/components/Page/form.vue'
import Pagination from '@/components/Pagination'
import { GetCertInfoList } from '@/api/user'
import i18n from '@/lang'
import { deepCopy } from "@/utils";
const searchConfig = [
	{ key: 'Name', name: '姓名', type: 'input', value: '' },
	{ key: 'Mobile', name: '手机号', type: 'input', value: '' },
	{ key: 'BankCert', name: '银行卡是否认证', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'kycCert', name: '人脸识别是否认证', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'personCert', name: '个人信息是否认证', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'ContactCert', name: '紧急联系人是否认证', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'AppIsUpLoad', name: ' 用户App是否上传', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'MailIsUpLoad', name: '用户通讯录是否上传', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'MsgIsUpLoad', name: '用户短信上传', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: ['AddTimeStart', 'AddTimeEnd'], name: ['注册时间(开始)', '注册时间(结束)'], type: 'daterangecustme', value: '', keyName: '注册时间' },
]
const tableConfig = [
	{ key: 'Name', name: '姓名', width: '120' },
	{ key: 'Mobile', name: '手机号', width: '150' },
	{ key: 'BankCert', name: '银行卡认证', width: '150' },
	{ key: 'kycCert', name: '人脸识别认证' },
	{ key: 'personCert', name: '个人信息认证' },
	{ key: 'ContactCert', name: '紧急联系人认证' },
	{ key: 'AddTime', name: '注册时间' },
	{ key: 'AppIsUpLoad', name: '用户App是否上传' },
	{ key: 'MailIsUpLoad', name: '用户通讯录是否上传' },
	{ key: 'MsgIsUpLoad', name: '用户短信上传' }
]
const formConfig = [
	[{ key: 'Name', name: '姓名', type: 'input', disabled: true }, { key: 'Mobile', name: '手机号', type: 'input', disabled: true }],
	[{ key: 'BankCert', name: '银行卡认证', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }, { key: 'kycCert', name: '人脸识别认证', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }],
	[{ key: 'personCert', name: '个人信息认证', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }, { key: 'ContactCert', name: '紧急联系人认证', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }],
	[{ key: 'AppIsUpLoad', name: '用户App是否上传', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }, { key: 'MailIsUpLoad', name: '用户通讯录是否上传', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }],
	[{ key: 'MsgIsUpLoad', name: '用户短信上传', type: 'select', disabled: true, configs: [{ value: 0, label: '否' }, { value: 1, label: '是' }] }]
]
//en
const _searchConfig = [
	{ key: 'Name', name: 'Name', type: 'input', value: '' },
	{ key: 'Mobile', name: 'Mobile', type: 'input', value: '' },
	{ key: 'BankCert', name: 'BankCert', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'kycCert', name: 'kycCert', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'personCert', name: 'personCert', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'ContactCert', name: 'ContactCert', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'AppIsUpLoad', name: ' AppIsUpLoad', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'MailIsUpLoad', name: 'MailIsUpLoad', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: 'MsgIsUpLoad', name: 'MsgIsUpLoad', type: 'select', options: [{ value: 0, label: '否' }, { value: 1, label: '是' }], value: '' },
	{ key: ['AddTimeStart', 'AddTimeEnd'], name: ['AddTimeStart', 'AddTimeEnd'], type: 'daterangecustme', value: '', keyName: 'regtime' },
]
const _tableConfig = [
	{ key: 'Name', name: 'Name', width: '120' },
	{ key: 'Mobile', name: 'Mobile', width: '150' },
	{ key: 'BankCert', name: 'BankCert', width: '150' },
	{ key: 'kycCert', name: 'kycCert' },
	{ key: 'personCert', name: 'personCert' },
	{ key: 'ContactCert', name: 'ContactCert' },
	{ key: 'AddTime', name: 'AddTime' },
	{ key: 'AppIsUpLoad', name: 'AppIsUpLoad' },
	{ key: 'MailIsUpLoad', name: 'MailIsUpLoad' },
	{ key: 'MsgIsUpLoad', name: 'MsgIsUpLoad' }
]
const _formConfig = [
	[{ key: 'Name', name: 'Name', type: 'input', disabled: true }, { key: 'Mobile', name: 'Mobile', type: 'input', disabled: true }],
	[{ key: 'BankCert', name: 'BankCert', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }, { key: 'kycCert', name: 'kycCert', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }],
	[{ key: 'personCert', name: 'personCert', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }, { key: 'ContactCert', name: 'ContactCert', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }],
	[{ key: 'AppIsUpLoad', name: 'AppIsUpLoad', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }, { key: 'MailIsUpLoad', name: 'MailIsUpLoad', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }],
	[{ key: 'MsgIsUpLoad', name: 'MsgIsUpLoad', type: 'select', disabled: true, configs: [{ value: 0, label: 'no' }, { value: 1, label: 'yes' }] }]
]
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
			total: 10,
			ifShowDrawer: false,
			temp: [], //详情页数据
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
			//初始化-1
			for (let i in searchData) {
				if (i != "Name" && i != "Mobile") {
					if (searchData[i] === "") searchData[i] = "-1"
				}
			}
			this.listQuery = Object.assign(this.listQuery, searchData);
			GetCertInfoList(this.listQuery).then(response => {
				this.list = response.data;
				this.total = response.tolal;
				this.listLoading = false
			})
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
.cus-container {
	.filter-container {
		padding: 20px 0 0px 20px;
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
</style>
