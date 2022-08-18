<template>
	<view class="contact-customer-service-main">
		<view class="contact-customer-service-header">
			<view class="row">
				<view class="col-auto">Customer service email</view>
				<view class="col text-right">{{ customerService.email }}</view>
			</view>
			<view class="row">
				<view class="col-auto">Manual customer service</view>
				<view class="col text-right">{{ customerService.phone }}</view>
			</view>
			<view class="row m-b-5">
				<view class="col-auto">Service time</view>
				<view class="col text-right">{{ customerService.time }}</view>
			</view>
			<view class="title">The manual service may wait too long, please be patient</view>
		</view>
		<view class="line"></view>
		<view class="contact-customer-service-content">
			<view class="title-con">Online feedback</view>
			<view class="content">
				<view class="row title-con m-t-20">
					<view class="col-auto">
						Contact
					</view>
					<view class="col text-right">
						<input type="text" v-model="phone" placeholder="Please enter Mobile Number"/>
					</view>
				</view>
				<textarea v-model="content" placeholder="Please enter the feedback" />
			</view>
		</view>
		<view class="contact-customer-service-footer"><button type="primary" @click="submit">Submit feedback</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			token: '',
			customerService: {
				email: 'deagfa@daffws.com',
				phone: '400-898-8888',
				time: '9:00-21:00'
			},
			phone: '',
			content: ''
		};
	},
	onLoad(options) {
		const { token } = options;
		uni.setNavigationBarTitle({
			title: 'Contact service'
		});
		// console.log(options, token);
		if (token) {
			uni.setStorageSync(this.APP_CONFIG.tokenKey, token);
			this.getCustomerServiceInfo();
		}
	},
	methods: {
		getCustomerServiceInfo() {
			this.sessionService.fetchCustomerServiceInfo().then(res => {
				this.customerService = res;
			});
		},
		submit() {
			const that = this;
			let errorInfo = null;
			if (!that.phone) {
				errorInfo = `Please enter Mobile Number！`;
			} else if (!that.content) {
				errorInfo = `Please enter the feedback！`;
			}
			if (errorInfo) {
				return this.http.showToast(errorInfo);
			}
			const data = {
				feedback_content: this.content,
				contact_information: this.phone
			};
			this.sessionService.submitFeedback(data).then(res => {
				uni.showToast({
					title: 'Submit feedback success',
					duration: 800,
					mask: true,
				});
				this.phone = '';
				this.content = '';
			});
		}
	}
};
</script>

<style lang="scss">
page {
	color: #6c6f71;
	font-size: 28rpx;
	.contact-customer-service-main {
		.contact-customer-service-header {
			padding: 40rpx;
			> view.row {
				margin-bottom: 18rpx;
				&.m-b-5 {
					margin-bottom: 5rpx;
				}
			}
			.title {
				font-size: 24rpx;
			}
		}
		.line {
			height: 5rpx;
			background: #ddd;
		}
		.contact-customer-service-content {
			padding: 40rpx 30rpx;
			.title-con {
				padding-left: 10rpx;
			}
			.content {
				.row {
					input {
						font-size: 12px;
					}
				}
				textarea {
					font-size: 24rpx;
					background: #f9f9f9;
					width: 100%;
					border-radius: 10rpx;
					padding: 20rpx;
					margin-top: 25rpx;
					box-sizing: border-box;
					height: 500rpx;
				}
			}
		}
		.contact-customer-service-footer {
			padding: 40rpx;
			margin-top: 30rpx;
			// position: fixed;
			// left: 0;
			// bottom: 0;
			// width: 100%;
			box-sizing: border-box;
		}
	}
}
</style>
