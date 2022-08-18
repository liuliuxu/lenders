<template>
	<view class="download-app-main">
		<view class="download-contnt">
			<image src="../../static/registered-done.png" class="registered-done-img"></image>
		</view>
		<view class="download-footer">
			<button class="btn-primary">To make money</button>
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
			uni.setNavigationBarTitle({
				title: 'download'
			})
		},
	}
</script>

<style lang="scss">
page{
	.download-app-main {
		.download-contnt {
			text-align: center;
			padding: 200rpx 0 30rpx;
			.registered-done-img {
				width: 658rpx;
			}
		}
		.download-footer {
			padding: 40rpx;
			.btn-primary {
				border-radius: 30rpx;
				background-image: linear-gradient(to right, #FF635F 0%, #FF8F71 100%);
			}
		}
	}
	
}
</style>
