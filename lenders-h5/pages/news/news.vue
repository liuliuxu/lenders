<template>
	<view class="news-info">
		<rich-text :nodes="newsInfo.news_content"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsInfo: {},
				newsId: null
			};
		},
		onLoad(options) {
			console.log(options);
			this.newsId = options.id;
			this.initNewsInfo();
		},
		methods: {
			initNewsInfo() {
				if (!this.newsId) {
					return false;
				}
				this.sessionService.fetchNewsInfo(this.newsId).then(res => {
					console.log(res);
					this.newsInfo = res;
					uni.setNavigationBarTitle({
						title: res.news_title
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		max-width: 100%;
		overflow: hidden;
		padding: 20rpx;
	}
.news-info {
}
</style>
