<template>
	<view class="download-app-main">
		<view class="download-contnt">
			<image src="../../static/download-app-bg2.png" class="download-app-bg-img"></image>
		</view>
		<view class="download-footer">
			<button class="btn-primary" @click="clickDownloadApp">INSTALL NOW</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {
		},
		methods: {
			/**
			 * 点击下载app
			 */
			clickDownloadApp() {
				window.location.href = 'https://h5.instantloan.ink/download/instantloan.apk';
			}
		}
	}
</script>

<style lang="scss">
page{
	min-height: 100vh;
	.download-app-main {
		min-height: 100vh;
		.download-contnt {
			text-align: center;
			height: 100vh;
			.download-app-bg-img {
				width: 100%;
				height: 100%;
			}
		}
		.download-footer {
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 0;
			height: 88rpx;
			.btn-primary {
				width: 100%;
				height: 88rpx;
				border-radius: 0;
				background: linear-gradient(180deg, rgba(211, 98, 33, 1) 0%, rgba(242, 173, 61, 1) 45.01%, rgba(242, 173, 61, 1) 100%);
			}
		}
	}
	
}
</style>
