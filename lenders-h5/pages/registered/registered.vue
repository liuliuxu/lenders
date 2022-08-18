<template>
	<view class="registered-main">
		<image class="background-img" src="../../static/reg-background.png" mode="scaleToFill"></image>
		<view class="login-main">
			<view class="login-from-main">
				<view class="row">
					<view class="col">
						<input type="text" placeholder="Please enter Mobile Number" v-model="phone"/>
					</view>
				</view>
				<view class="row align-items-center">
					<view class="col">
						<input type="text" placeholder="Please enter OPT" v-model="code"/>
					</view>
					<view class="col-auto">
						<button class="btn-outline-primary" type="primary" @click="clickFetchCode">
							{{ sendVerifySecond >= 0 ? sendVerifySecond + 's Get OPT' : 'Get OPT' }}
						</button>
						
					</view>
				</view>
			</view>
			<view class="submit-btn">
				<button class="btn-primary" @click="clickLogin">Make money now</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				code: '',
				sendVerifySecond: -1, // 发送验证的秒数
			};
		},
		onShow() {
			
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: 'registered'
			})
		},
		mounted() {
			// var a = document.getElementsByClassName('uni-page-head-hd')[0]
			// a.style.display = 'none';
		},
		methods: {
			clickFetchCode() {
				const that = this;
				let errorInfo = null;
				if (!that.phone) {
					errorInfo = `Please enter Mobile Number！`;
				}
				// else if (!/^1[\d]{10}$/.test(that.phone)) {
				// 	errorInfo = `请填写正确的手机号码!`;
				// }
				if (errorInfo) {
					return this.http.showToast(errorInfo);
				}
				if (that.sendVerifySecond >= 0) {
					return;
				}
				that.sendVerifySecond = 60;
				const timer = setInterval(() => {
					if (that.sendVerifySecond >= 0) {
						that.sendVerifySecond -= 1;
					} else {
						clearInterval(timer);
					}
				}, 1000);
				const data = {
					phone: that.phone
				}
				this.sessionService.sendCellphoneVerfiyCode(data, (res) => {
					console.log(res);
					uni.showToast({
						title: 'OPT was sent successfully',
						duration: 800,
						mask: true,
					});
				}, (fail) => {
					console.log(fail);
				});
			},
			clickLogin() {
				console.log(this.phone, this.code);
				const that = this;
				let errorInfo = null;
				if (!that.phone) {
					errorInfo = `Please enter Mobile Number！`;
					// else if (!/^1[\d]{10}$/.test(that.phone)) {
					// 	errorInfo = `请填写正确的手机号码!`;
					// 	return this.http.showToast(errorInfo);
					// }
				} else if (!that.code || !/^[\d]{6}$/.test(that.code)) {
					errorInfo = `Please enter correct OPT!`;
				}
				if (errorInfo) {
					return this.http.showToast(errorInfo);
				}
				const data = {
					phone: that.phone,
					verification_code: that.code
				};
				this.sessionService.login(data).then(res => {
					uni.navigateTo({
						url: '/pages/download-app/download-app'
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100vw;
		// height: 100vh;
		font-size: 28rpx;
		.registered-main {
			width: 100%;
			// max-height: 100vh;
			height: 100vh;
			overflow: hidden;
			position: relative;
			image.background-img {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
			.login-main {
				position: absolute;
				left: 6%;
				bottom: 0%;
				width: 88%;
				padding-bottom: 8%;
				.login-from-main {
					background: #fff;
					border-radius: 10rpx;
					box-sizing: border-box;
					.btn-outline-primary {
						border-color: $uni-color-primary;
						padding: 10rpx 20rpx;
						font-size: 24rpx;
						border-radius: 30rpx;
					}
					view.row {
						padding: 10rpx 20rpx;
						&:first-child {
							border-bottom: 2rpx solid #ddd;
							// padding: 20rpx 30rpx;
							// margin: 0 -10rpx;
						}
						input {
							font-size: 28rpx;
							padding: 10rpx;
						}
					}
				}
				.submit-btn {
					margin-top: 40rpx;
					.btn-primary {
						border-radius: 50rpx;
						background: #FDBB37;
						color: #fff;
					}
				}
			}
		}
	}
</style>
