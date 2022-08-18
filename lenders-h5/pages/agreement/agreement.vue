<template>
	<view class="agreement-info"><rich-text :nodes="agreementInfo.agreement_content"></rich-text></view>
</template>

<script>
export default {
	data() {
		return {
			agreementInfo: {},
			agreementId: null
		};
	},
	onLoad(options) {
		console.log(options);
		this.agreementId = options.id;
		this.initAgreementInfo();
	},
	methods: {
		initAgreementInfo() {
			if (!this.agreementId) {
				return false;
			}
			this.sessionService.fetchAgreementInfo(this.agreementId).then(res => {
				console.log(res);
				this.agreementInfo = res;
				uni.setNavigationBarTitle({
					title: res.agreement_title
				})
			});
		}
	}
};
</script>

<style lang="scss">
page {
	max-width: 100%;
	overflow: hidden;
	padding: 20rpx;
	.agreement-info {
	}
}
</style>
