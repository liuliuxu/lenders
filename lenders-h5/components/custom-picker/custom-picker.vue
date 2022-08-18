<template>
	<view>
		<!-- v-if="showCustomPicker" -->
		<view class="row align-items-center" @tap="clickSelected">
			<view class="col">
				<view class="uni-input select-text" v-if="!selectedList || !selectedList.length">请选择</view>
				<view class="text-overflow-hidden" v-if="selectedList && selectedList.length">
					<text v-for="(item, index) in selectedList" :key="index">
						<text>{{ item.name }}</text>
						<text v-if="index !== selectedList.length - 1">,</text>
					</text>
				</view>
			</view>
			<view class="col-auto"><view class="icon icon-right"></view></view>
		</view>
		<uni-popup ref="popup" type="bottom" :maskClick="true">
			<view class="custom-picker-main">
				<view class="custom-picker-header" catchtouchmove="true">
					<view class="row">
						<view class="col p-30 text-center">{{ typeName }}</view>
					</view>
					<view class="save-btn text-color-primary" @tap="submit">保存</view>
				</view>
				<view class="custom-picker-content">
					<view class="custom-picker-content-selected row" v-if="selectedList && selectedList.length > 0" catchtouchmove="true">
						<view class="col-auto text-color-grey p-t-20">已选</view>
						<view class="col">
							<view class="inline-block selected-style m-r-20" v-for="(item, index) in selectedList" :key="item.id">
								{{ item.name }}
								<view class="icon icon-close" @tap="onClickCloseItem(item, index)"></view>
							</view>
						</view>
					</view>
					<view class="row custom-picker-content-select-list" v-if="selectedOneItem && selectedOneItem.id" catchtouchmove="true">
						<view class="col-auto p-t-20" :class="selectedOneLeval ? 'selected-border' : ''" @tap="onClickSelectedOneLeval">{{ selectedOneItem.name }}</view>
						<view
							class="col-auto p-t-20"
							:class="selectedTwoLeval ? 'selected-border' : ''"
							v-if="selectedTwoItem && selectedTwoItem.id"
							@tap="onClickSelectedTwoLeval"
						>
							{{ selectedTwoItem.name }}
						</view>
						<view class="col-auto p-t-20" :class="selectedTwoLeval ? 'selected-border' : ''" v-if="!selectedTwoItem || !selectedTwoItem.id">请选择</view>
						<view class="col-auto p-t-20" :class="selectedThreeLeval ? 'selected-border' : ''" v-if="selectedThreeLeval">请选择</view>
					</view>
					<scroll-view scroll-y="true" enable-back-to-top="true" scroll-with-animation="true">
						<view class="custom-picker-content-list">
							<view class="row" v-if="showListLeval === 1" v-for="(item, index) in initList" :key="item.id">
								<view class="col" @tap="onClickItem(item)">{{ item.name }}</view>
								<view class="col-auto" @tap="onClickSelectedItem(item)">
									<view
										class="icon"
										:class="item.selected ? 'icon-check-box-selected-copy' : 'icon-check-box-empty-copy'"
									></view>
								</view>
							</view>
							<view class="row" v-if="showListLeval === 2" v-for="(item, index) in selectedOneItem.children" :key="item.id">
								<view class="col" @tap="onClickItem(item)">{{ item.name }}</view>
								<view class="col-auto" v-if="!item.children || !item.children.length || item.leval !== 1" @tap="onClickSelectedItem(item)">
									<view
										class="icon"
										:class="item.selected ? 'icon-check-box-selected-copy' : 'icon-check-box-empty-copy'"
									></view>
								</view>
							</view>
							<view class="row" v-if="showListLeval === 3" v-for="(item, index) in selectedTwoItem.children" :key="item.id">
								<view class="col" @tap="onClickItem(item)">{{ item.name }}</view>
								<view class="col-auto" v-if="!item.children || !item.children.length || item.leval !== 1" @tap="onClickSelectedItem(item)">
									<view
										class="icon"
										:class="item.selected ? 'icon-check-box-selected-copy' : 'icon-check-box-empty-copy'"
									></view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		<!-- <view class='modal-mask' catchtouchmove="true" v-if=" showCustomPicker " @tap='onClickCloseCustomPicker'></view>
		<view class='custom-picker-main' v-if="showCustomPicker" animation="{{animationData}}">
			<view class='custom-picker-header' catchtouchmove="true">
				<view class='row'>
					<view class='col p-30 text-center'>{{typeName}}</view>
				</view>
				<view class='save-btn text-color-primary' @tap='_submit'>
					保存
				</view>
			</view>
			<view class='custom-picker-content'>
				<view class='custom-picker-content-selected row' v-if="selectedList && selectedList.length>0" catchtouchmove="true">
					<view class='col-auto text-color-grey p-t-20'>已选</view>
					<view class='col'>
						<view class='inline-block selected-style m-r-20' wx:for="{{selectedList}}" wx:key="selectedList">
							{{item.name}}
							<view class='icon icon-close' data-index='{{index}}' data-id='{{item.id}}' @tap='onClickCloseItem'></view>
						</view>
					</view>
				</view>
				<view class='row custom-picker-content-select-list' v-if="selectedOneItem && selectedOneItem.id" catchtouchmove="true">
					<view class="col-auto p-t-20 {{selectedOneLeval ? 'selected-border' : ''}}" catchtap='onClickSelectedOneLeval'>{{selectedOneItem.name}}</view>
					<view class="col-auto p-t-20 {{selectedTwoLeval ? 'selected-border' : ''}}" v-if="selectedTwoItem && selectedTwoItem.id"
					 catchtap='onClickSelectedTwoLeval'>{{selectedTwoItem.name}}</view>
					<view class="col-auto p-t-20 {{selectedTwoLeval ? 'selected-border' : ''}}" v-if="!selectedTwoItem || !selectedTwoItem.id">请选择</view>
					<view class="col-auto p-t-20 {{selectedThreeLeval ? 'selected-border' : ''}}" v-if="selectedThreeLeval">请选择</view>
				</view>
				<scroll-view scroll-y="true" enable-back-to-top="true" scroll-with-animation="true">
					<view class='custom-picker-content-list'>
						<view class='row' v-if="showListLeval === 1" wx:for="{{industryList}}" wx:key="{{industryList}}">
							<view class='col' catchtap='onClickItem' data-leval='1' data-index='{{index}}'>{{item.name}}</view>
							<view class='col-auto' v-if="!item.children || !item.children.length || item.leval !== 1">
								<view catchtap='onClickSelectedIndustry' data-leval='1' data-index='{{index}}' class="icon {{item.selected?'icon-check-box-selected-copy':'icon-check-box-empty-copy'}}"></view>
							</view>
						</view>
						<view class='row' v-if="showListLeval === 2" wx:for="{{selectedOneItem.children}}" wx:key="{{selectedOneItem}}">
							<view class='col' catchtap='onClickItem' data-leval='2' data-index='{{index}}'>{{item.name}}</view>
							<view class='col-auto' v-if="!item.children || !item.children.length || item.leval !== 1">
								<view catchtap='onClickSelectedIndustry' data-leval='2' data-index='{{index}}' class="icon {{item.selected?'icon-check-box-selected-copy':'icon-check-box-empty-copy'}}"></view>
							</view>
						</view>
						<view class='row' v-if="showListLeval === 3" wx:for="{{selectedTwoItem.children}}" wx:key="{{selectedTwoItem}}">
							<view class='col' catchtap='onClickItem' data-leval='3' data-index='{{index}}'>{{item.name}}</view>
							<view class='col-auto' v-if="!item.children || !item.children.length || item.leval !== 1">
								<view catchtap='onClickSelectedIndustry' data-leval='3' data-index='{{index}}' class="icon {{item.selected?'icon-check-box-selected-copy':'icon-check-box-empty-copy'}}"></view>
							</view>
						</view>
					</view>
				</scroll-view>

			</view>
		</view> -->
	</view>
</template>

<script>
import { UniPopup } from '../uni-popup/uni-popup.vue';
const app = getApp();
export default {
	components: {
		UniPopup
	},
	name: 'CustomPicker',
	props: {
		showCustomPicker: {
			type: Boolean,
			value: null,
			default() {
				return false;
			}
		},
		maxCanSelectedNum: {
			type: Number,
			value: null,
			default() {
				return 5;
			}
		},
		imid: {
			type: Number,
			value: null,
			default() {
				return null;
			}
		},
		itemid: {
			type: Number,
			value: null,
			default() {
				return null;
			}
		},
		typeName: {
			type: String,
			value: null,
			default() {
				return '';
			}
		},
		list: {
			type: Array,
			value: null,
			default() {
				return [];
			}
		},
		selectList: {
			type: Array,
			value: null,
			default() {
				return [];
			},
			observer: function(newVal, oldVal) {
				// if (newVal && newVal.length > 0) {
				// 	this.setData({
				// 		selectedList: newVal
				// 	});
				// }
				// const desiredPositionList = this.data.industryList;
				// if (desiredPositionList && desiredPositionList.length > 0 && newVal && newVal.length > 0) {
				// 	newVal.forEach(item => {
				// 		if (item.id === 0) {
				// 			this.setData({
				// 				isCanSelectedOther: false
				// 			});
				// 		}
				// 		desiredPositionList.forEach(itm => {
				// 			if (item.id === itm.id) {
				// 				itm.selected = true;
				// 				item.parent = itm.parent;
				// 			}
				// 			if (itm.children && itm.children.length > 0) {
				// 				itm.children.forEach(im => {
				// 					if (item.id === im.id) {
				// 						im.selected = true;
				// 						item.parent = im.parent;
				// 					}
				// 					if (im.children && im.children.length > 0) {
				// 						im.children.forEach(m => {
				// 							if (item.id === m.id) {
				// 								m.selected = true;
				// 								item.parent = m.parent;
				// 							}
				// 						});
				// 					}
				// 				});
				// 			}
				// 		});
				// 	});
				// 	console.log(desiredPositionList);
				// 	this.setData({
				// 		desiredPositionList: desiredPositionList
				// 	});
				// }
			}
		}
	},
	data() {
		return {
			// showCustomPicker: false,
			initList: [], // 初始列表
			selectedList: [], // 选择的列表
			value: '', // 提交的value
			isCanSelectedOther: true, // 是否可以选择其他项
			selectedOneItem: {}, // 选择的某一项一级
			selectedTwoItem: {}, // 选择的某一项二级
			showListLeval: 1, // 显示的列表等级
			selectedOneLeval: false, // 选择的等级1是否要加上选择效果
			selectedTwoLeval: false, // 选择的等级2是否要加上选择效果
			selectedThreeLeval: false // 选择的等级3是否要加上选择效果
		};
	},
	created() {
		// this.$set(this.list);
	},
	methods: {
		/** 点击选中某一项 de NAME
		 * @param {Object} item
		 */
		onClickItem(item) {
			if (!this.isCanSelectedOther) {
				return false;
			}
			if (item.level === 1 && item.children && item.children.length) {
				this.showListLeval = 2;
				this.selectedOneItem = item;
				this.selectedTwoLeval = true;
				this.selectedOneLeval = false;
			} else if (item.level === 2 && item.children && item.children.length) {
				this.showListLeval = 3;
				this.selectedTwoItem = item;
				this.selectedTwoLeval = false;
				this.selectedThreeLeval = true;
			}
		},
		/** 点击选中的复选框
		 * @param {Object} item
		 */
		onClickSelectedItem(item) {
			if (item.level === 1 && item.name === '不限') {
				this.isCanSelectedOther = false;
				this.selectList.forEach(item => {
					this.delectSelectedStatus(this.initList, item);
				});
				this.selectedList = [];
				item.selected = !item.selected;
				if (item.selected) {
					this.selectedList.push(item);
				} else {
					const has = this.selectedList.find(im => im.id === item.id);
					const idx = this.selectedList.indexOf(has);
					this.selectedList.splice(idx, 1);
					this.isCanSelectedOther = true;
				}
				console.log(item, this.initList);
				return false;
			}
			if (!this.isCanSelectedOther) {
				return false;
			}
			if (item.selected) {
				item.selected = false;
				const has = this.selectedList.find(im => im.id === item.id);
				const idx = this.selectedList.indexOf(has);
				this.selectedList.splice(idx, 1);
				return;
			}
			if (this.selectedList.length >= this.maxCanSelectedNum) {
				return this.http.showToast(`最多只能选择${this.maxCanSelectedNum}项`);
			}
			this.delectOtherSelectedStatus(this.initList);
			item.selected = !item.selected;
			if (item.selected) {
				this.selectedList = [];
				this.selectedList.push(item);
				this.value = '' + item.id;
			} else {
				const has = this.selectedList.find(im => im.id === item.id);
				const idx = this.selectedList.indexOf(has);
				this.selectedList.splice(idx, 1);
			}
		},
		/** 删除已选中的
		 * @param {Object} e
		 * @param {Object} index
		 */
		onClickCloseItem(e, index) {
			// console.log(e, index);
			this.selectedList.splice(index, 1);
			this.delectSelectedStatus(this.initList, e);
		},
		/** 删除其余选中状态
		 * @param {Object} list
		 */
		delectOtherSelectedStatus(list) {
			list.forEach(item => {
				item.selected = false;
				if (item.children && item.children.length) {
					this.delectOtherSelectedStatus(item.children);
				}
			});
		},
		/** 删除选中状态
		 * @param {Object} list
		 * @param {Object} e
		 */
		delectSelectedStatus(list, e) {
			list.forEach(item => {
				if (item.id === e.id) {
					item.selected = false;
				}
				if (item.children && item.children.length) {
					this.delectSelectedStatus(item.children, e);
				}
			});
		},
		/** 更新选中状态
		 * @param {Object} list
		 * @param {Object} e
		 */
		updateSelectedStatus(list, e) {
			list.forEach(item => {
				if (item.id === e.id) {
					item.selected = true;
				}
				if (item.children && item.children.length) {
					this.updateSelectedStatus(item.children, e);
				}
			});
		},
		/**
		 * 当点击一级的时候
		 */
		onClickSelectedOneLeval(e) {
			this.selectedOneLeval = true;
			this.showListLeval = 1;
			this.selectedTwoLeval = false;
			this.selectedThreeLeval = false;
		},
		/**
		 * 当点击二级的时候
		 */
		onClickSelectedTwoLeval(e) {
			this.selectedTwoLeval = true;
			this.showListLeval = 2;
			this.selectedOneLeval = false;
			this.selectedThreeLeval = false;
		},
		/**
		 * 当点击三级的时候
		 */
		onClickSelectedThreeLeval(e) {
			this.selectedThreeLeval = true;
			this.selectedTwoLeval = false;
			this.selectedOneLeval = false;
			this.showListLeval = 3;
		},
		clickSelected() {
			this.showPopup();
		},
		showPopup() {
			this.$refs.popup.open();
		},
		closePopup(e) {
			this.$refs.popup.close();
			// this.$emit('close', true);
		},
		submit() {
			this.$emit('submit', {
				imid: this.imid,
				itemid: this.itemid,
				value: this.value
			});
			this.closePopup();
		}
	},
	watch: {
		typeName(e){
			console.error(e);
		},
		showCustomPicker(e) {
			console.log(e);
			if (e) {
				this.showPopup();
			} else {
				this.closePopup();
			}
		},
		list: {
			handler(newValue, oldValue) {
				// console.error(newValue);
				this.initList = newValue;
			},
			immediate: true,
			deep: true
		},
		selectList(e) {
			this.selectedList = e;
			this.selectList.forEach(item => {
				this.updateSelectedStatus(this.list, item);
			});
		}
	}
};
</script>

<style lang="scss">
.custom-picker-main {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #fff;
	z-index: 501;
	transition: transform 160ms linear 0ms;
	transform: translateY(0px);
	transform-origin: 50% 50% 0px;
	min-height: 650upx;
	font-size: 28upx;
	text-align: left;
}

.custom-picker-main .custom-picker-header {
	position: relative;
	font-size: 32upx;
}

.custom-picker-main .custom-picker-header .save-btn {
	position: absolute;
	right: 30upx;
	top: 30upx;
}

.custom-picker-main .custom-picker-content .custom-picker-content-selected .col,
.custom-picker-main .custom-picker-content .custom-picker-content-selected .col-auto {
	padding: 10upx 10upx 0 30upx;
}

.custom-picker-main .custom-picker-content .selected-style {
	background: #deeeff;
	color: #007aff;
	margin-bottom: 10upx;
	padding: 10upx;
}

.custom-picker-main .custom-picker-content .custom-picker-content-select-list .col-auto {
	border-bottom: 2upx solid #fff;
	padding: 20upx 0 20upx 0;
	margin-left: 20upx;
}

.custom-picker-main .custom-picker-content .custom-picker-content-select-list .selected-border {
	border-bottom: 2upx solid #007aff;
}

.custom-picker-main .custom-picker-content .custom-picker-content-list {
	border-top: 2upx solid #f1f1f1;
	max-height: 650upx;
	overflow-y: auto;
	padding-right: 20upx;
	.row {
		.col,
		.col-auto {
			padding: 20upx 30upx;
		}
	}
}
.icon-check-box-selected-copy {
	color: #007aff;
}

.icon-check-box-empty-copy {
	color: #808080;
}
.icon-close {
	font-size: 24upx;
	margin-left: 10upx;
}
.text-overflow-hidden {
	max-width: 310upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
	// height: 46upx;
	// line-height: 46upx;
}
</style>
