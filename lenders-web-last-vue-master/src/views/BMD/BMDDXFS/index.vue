<template>
	<div class="cus-container">
		<div class="button_style">
			<el-upload
				style="float: left;margin-right: 10px;"
				class="upload-demo"
				action="/"
				:on-preview="handlePreview"
				:http-request="httpRequest"
				:show-file-list="false"
			>
				<el-button size="small" type="primary">{{ $t('table.UploadWhiteListExcel') }}</el-button>
			</el-upload>

			<!-- <el-button class="filter-item" type="primary" size="small" @click="WhiteListButton('sms')">{{ $t('table.UploadWhiteListExcel') }}</el-button> -->

			<el-button :disabled="Sent" class="filter-item" type="primary" size="small" @click="WhiteListButton('send')">
				{{ $t('table.SendCurrentDaySms') }}
			</el-button>
		
		</div>
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
		
		<el-table v-loading="listLoading" :data="list" @selection-change="handleSelectionChange"
			element-loading-text="Loading" fit highlight-current-row style="padding-left: 20px;padding-top: 20px;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index"></el-table-column>
			<el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :key="widget.key"
				align="left">
				<template slot-scope="scope">
					<span >{{ scope.row[widget.key] }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column :label="$t('table.actions')" align="left" width="300" class-name="">
				<template slot-scope="{row,$index}">
					<el-button size="mini" type="primary" @click="handleDetail(row, $index)">{{ $t('table.detail') }}
					</el-button>
				</template>
			</el-table-column> -->
			<template slot="empty">
				<img src="@/assets/cus_images/nodata.png" class="cus-img">
				<p class="cus-nodata">{{ $t('table.nodata') }}</p>
			</template>
		</el-table>
		<pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"
			@pagination="fetchData" />

	</div>
</template>

<script>
import searchBar from '@/components/Page/searchBar.vue'
import pageForm from '@/components/Page/form.vue'
import Pagination from '@/components/Pagination'
import { SearchSendedWhiteListSms, UploadWhiteListExcel, SendWhiteListSms } from '@/api/whitelist'

import i18n from '@/lang'
import { deepCopy } from "@/utils"; // internationalization
const searchConfig = [
	{ key: ['StartDate', 'EndDate'], name: ['开始时间', '开始时间'], type: 'daterange', value: '' }
]
const tableConfig = [
	{ key: 'Mobile', name: '手机号码'},
	{ key: 'AddTime', name: '发送时间'},
	{ key: 'SmsContent', name: '短信内容'},
	{ key: 'IsSuccess_Ch', name: '是否发送成功'},
]
const formConfig = [ 
	// [{ key: 'Mobile', name: '手机号', type: 'input', disabled: true }, 
	// { key: 'AddTime', name: '发送时间', type: 'input', disabled: true }]
	[{key:'excel',name:'文件',type:'upload',disabled:false,rules:[{ required: false, message: 'excel not null'}]}]	
];

//ng
const _searchConfig = [
	{ key: ['StartDate', 'EndDate'], name: ['StartDate', 'EndDate'], type: 'daterange', value: '' }
]
const _tableConfig = [
	{ key: 'Mobile', name: 'Mobile'},
	{ key: 'AddTime', name: 'Send Time'},
	{ key: 'SmsContent', name: 'SMS content'},
	{ key: 'IsSuccess', name: 'Sent successfully'},
]
const _formConfig = [
	// [{ key: 'Mobile', name: 'Mobile', type: 'input', disabled: true }, 
	// { key: 'AddTime', name: 'Send Time', type: 'input', disabled: true }]
	[{key:'excel',name:'excel',type:'upload',disabled:false,rules:[{ required: false, message: 'excel not null'}]}]	
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
			
			temp: [], //详情页数据
			
			multipleSelectionCSRY: [],
			checkedCSRY: [],
			
			Sent: false,
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
	},
	methods: {
		handlePreview(file){},
		httpRequest(file){
			var formData = new FormData();
			formData.append('excel', file.file);
			UploadWhiteListExcel(formData).then(res=>{
				if(res.error.ErrorCode === 0){
					this.$message({
						type: 'success',
              			message: res.data.result
					})
				}else{
					this.$message({
						type: 'error',
              			message: res.data.result
					})
				}
			}).catch(err => {
				this.$message({
					type: 'error',
					message: err
				})
			})
		},

		handleClose(){},
		

		sendSms(){
			SendWhiteListSms()
			.then(res => {
				// if(res.error.ErrorCode === 0){
					// this.$message({
					// 	type: 'success',
					// 	message: i18n.t('information.Success')
					// });
				// }
				// else{
				// 	this.$message({
				// 		type: 'error',
				// 		message: res.data.result
				// 	});
				// }
			})
			.catch( () => {
				// this.$message({
				// 	type: 'error',
				// 	message: i18n.t('information.Failed')
				// });
			})
		},
		WhiteListButton(type){
			this.Sent = true;
			if(type === 'send'){
				this.$confirm(this.language==='zh'?'此操作将发送当天白名单短信, 是否继续?':
				'This operation will send white list SMS of the day. Do you want to continue', this.language==='zh'?
				'提示': 'Tips', {
					confirmButtonText: i18n.t('permission.confirm'),
					cancelButtonText: i18n.t('permission.cancel'),
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: i18n.t('table.Sending')
					})
					this.sendSms();
				}).catch(() => {
					this.$message({
						type: 'success',
						message: i18n.t('permission.cancel') 
					});
					this.Sent = false;
				});
			}
		},

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
			SearchSendedWhiteListSms(this.listQuery).then(response => {
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
		},
		handleDetail(row) {
			this.temp = row;	
		},
		
		//重置
		resetInput() {
			this.$refs.searchbar.resetInput();
		},
		//搜索
		search(){
			this.fetchData()
		},
		handleSelectionChange(val) {
			this.multipleSelectionCSRY = val;
		},
		
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

	.button_style {
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
