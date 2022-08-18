<template>
	<div class="cus-container">
		<template v-for="(widget, index) in searchConfig">
			<div class="cus-input" v-if="widget.type == 'input'">
				<label>{{ widget.name }}</label>
				<el-input v-model="widget.value" :placeholder="widget.name" style="width: 150px;padding-right:12px;"
					class="filter-item" size="small" @keyup.enter.native="search" />
			</div>
			<div class="cus-input" v-if="widget.type == 'radio'">
				<label>{{ widget.name }}</label>
				<el-radio-group v-model="widget.value">
					<el-radio v-for="item in widget.options" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</div>
			<div class="cus-input" v-if="widget.type == 'inputVal'">
				<label>{{ widget.name }}</label>
				<el-input v-model="widget.value" :placeholder="widget.name" style="width: 100px;" class="filter-item"
					size="small" @keyup.enter.native="search" />
				-
				<el-input v-model="widget.value1" :placeholder="widget.name" style="width: 100px;padding-right:12px;"
					class="filter-item" size="small" @keyup.enter.native="search" />
			</div>
			<div class="cus-input" v-if="widget.type == 'date'">
				<label>{{ widget.name }}</label>
				<el-date-picker v-model="widget.value" type="date" style="width: 150px;padding-right:12px;" size="small"
					:placeholder="$t('table.Selectdate')">
				</el-date-picker>
			</div>
			<div class="cus-input" v-if="widget.type == 'daterange'">
				<label>{{ $t('table.Time') }}</label>
				<el-date-picker v-model="widget.value" type="daterange" align="right" unlink-panels
					:range-separator="$t('table.To')" size="small" :start-placeholder="widget.name[0]"
					:end-placeholder="widget.name[1]" :picker-options="pickerOptions">
				</el-date-picker>
			</div>
			<div class="cus-input" v-if="widget.type == 'daterangecustme'">
				<label>{{ widget.keyName }}</label>
				<el-date-picker v-model="widget.value" type="daterange" align="right" unlink-panels
					:range-separator="$t('table.To')" size="small" :start-placeholder="widget.name[0]"
					:end-placeholder="widget.name[1]" :picker-options="pickerOptions">
				</el-date-picker>
			</div>
			<div class="cus-input" v-if="widget.type == 'select'">
				<label style="vertical-align: top;">{{ widget.name }}</label>
				<el-select size="small" :multiple="widget.multiple" v-model="widget.value"
					:placeholder="language === 'en' ? 'Please select' : '请选择'"
					style="min-width: 150px;padding-right:12px;">
					<el-option v-for="item in widget.options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
		</template>
	</div>
</template>

<script>
import { getNowFormatDate } from '@/utils/index'
const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
export default {
	props: ['searchConfig'],
	data() {
		return {
			pickerOptions: {
				shortcuts: [{
					text: 'one week',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: 'one month',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: 'three months',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
		}
	},
	created(){
		
	},
	computed: {
		language() {
			return this.$store.getters.language;
		}
	},
	watch: {
		language: function (val, oldVal) {
			this.switchLanguage(val);
		}
	},
	mounted() {
		// console.warn('语言', this.$store.getters.language);
	},
	methods: {
		switchLanguage(val) {//原始数据 应用数据 en/zh
			if (val == 'zh') {//切换成中文
				this.pickerOptions.shortcuts[0].text = '最近一周';
				this.pickerOptions.shortcuts[1].text = '最近一个月';
				this.pickerOptions.shortcuts[2].text = '最近三个月';
			} else if (val == 'en') {//切换成英文
				this.pickerOptions.shortcuts[0].text = 'one week';
				this.pickerOptions.shortcuts[1].text = 'one month';
				this.pickerOptions.shortcuts[2].text = 'three months';
			}
		},
		//重置
		resetInput() {
			this.searchConfig.forEach((item, index) => {
				item.value = '';
			})
		},
		//获取数据
		getData() {
			let data = {}
			this.searchConfig.forEach((item, index) => {
				switch (item.type) {
					case 'input':
						data[item.key] = item.value
						break;
					case 'radio':
						data[item.key] = item.value
						break;
					case 'inputVal':
						data[item.key] = item.value
						data[item.key1] = item.value1
						break;
					case 'select':
						data[item.key] = item.value
						break;
					case 'daterange':
						if (item.value.length > 0) {
							data[item.key[0]] = getNowFormatDate(item.value[0])
							data[item.key[1]] = getNowFormatDate(item.value[1])
						} else if (item.isInit) {
							item.value = [];
							item.value[0] = start;
							item.value[1] = end;
							data[item.key[0]] = getNowFormatDate(start)
							data[item.key[1]] = getNowFormatDate(end)
							this.$forceUpdate();
						} else {
							data[item.key[0]] = ''
							data[item.key[1]] = ''
						}
						break;
					case 'daterangecustme':
						if (item.value.length > 0) {
							data[item.key[0]] = getNowFormatDate(item.value[0])
							data[item.key[1]] = getNowFormatDate(item.value[1])
						} else {
							data[item.key[0]] = ''
							data[item.key[1]] = ''
						}
						break;
				}
			})
			return data
		},

	}
}
</script>

<style lang="scss" scoped>
.cus-container {
	.cus-input {
		float: left;
		margin-left: 10px;

		label {
			text-align: right;
			vertical-align: middle;
			font-size: 14px;
			color: #606266;
			line-height: 40px;
			padding: 0 5px 0 0;
			box-sizing: border-box;
		}
	}
}
</style>
