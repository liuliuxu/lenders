<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	
	/*每个页面公共css */
	page {
	    // background: $uni-color-primary;
	    background: #fff;
	    font-size: 30upx;
	}
	
	image {
	    vertical-align: middle;
	}
	
	button {
	    padding: 16upx 28upx;
	    line-height: normal;
	    font-size: 28upx;
	
	    &[type='primary'] {
	        background: $uni-color-primary;
	    }
	
	    &.button-hover[type='primary'] {
	        background: $uni-color-primary;
	        color: #fff;
	    }
	
	    &.btn-primary {
	        background: $uni-color-primary;
	        color: #fff;
	    }
	
	    &.btn-primary[disabled][type='primary'] {
	        background: #f7f7f7;
	        color: rgba(0, 0, 0, 0.3);
	    }
	
	    &.btn-outline-primary {
	        color: $uni-color-primary;
	        border: 2upx solid $uni-color-primary;
	        background: #fff;
	        box-sizing: border-box;
	    }
	}
	
	.form-main {
	    padding: 0 20upx;
	    box-sizing: border-box;
	    overflow: hidden;
	
	    .form-group {
	        .form-title {
	            padding: 20upx;
	            font-weight: bold;
	        }
	    }
	
	    .from-for-item > .row,
	    > .row {
	        border-top: 2upx solid #eee;
	
	        > .col-auto {
	            padding: 25upx 30upx;
	
	            > view.text-color-red {
	                // box-sizing: border-box;
	                // padding-top: 5upx;
	                // height: 38upx;
	                // line-height: 38upx;
	                margin-right: 5upx;
	            }
	        }
	
	        > view.col {
	            text-align: right;
	            padding: 25upx 30upx;
	
	            .uni-input {
	                padding: 0;
	            }
	
	            .select-text {
	                color: #808080;
	            }
	
	            .icon-right {
	                margin-left: 5upx;
	            }
	        }
	
	        > view.col-100 {
	            padding: 25upx 30upx;
	
	            &.validate {
	                color: #f00;
	                padding-top: 0;
	                padding-bottom: 15upx;
	            }
	        }
	    }
	
	    .validate {
	        color: #f00;
	        padding-top: 0;
	        padding-bottom: 15upx;
	    }
	
	    .uni-input,
	    input,
	    textarea {
	        font-size: 28upx;
	    }
	
	    .textarea-form {
	        min-height: 180upx;
	        max-height: 300upx;
	        width: calc(100% - 80upx);
	        margin: 0 auto;
	        border: 1upx solid #ddd;
	        padding: 10upx;
	    }
	}
	
	.uni-picker-container,
	.uni-popup {
	    z-index: 9999999 !important;
	}
	
	.hide-input {
	    width: 100%;
	    padding: 14upx 28upx;
	    opacity: 0;
	    z-index: -1;
	    box-sizing: border-box;
	}
	
	.input-avatar {
	    .hide-input {
	        width: 100%;
	        height: 100%;
	    }
	}
	
	.text-decoration-underline {
		text-decoration: underline;
	}
	
	// uni-image > img {
	//     opacity: 1;
	// }
	
	/* flex布局 */
	
	.row {
	    display: flex;
	    flex-wrap: wrap;
	}
	
	.col {
	    flex-basis: 0;
	    flex-grow: 1;
	    max-width: 100%;
	}
	
	.col-auto {
	    flex: 0 0 auto;
	    width: auto;
	    max-width: none;
	}
	
	.col-20 {
	    flex: 0 0 20%;
	    max-width: 20%;
	}
	
	.col-25 {
	    flex: 0 0 25%;
	    max-width: 25%;
	}
	
	.col-30 {
	    flex: 0 0 30%;
	    max-width: 30%;
	}
	
	.col-100 {
	    flex: 0 0 100%;
	    max-width: 100%;
	}
	
	/* 上下垂直居中 */
	
	.align-items-center {
	    align-items: center;
	}
	
	/* 居上 */
	
	.align-items-start {
	    align-items: flex-start !important;
	}
	
	/* 居中 */
	
	.justify-content-content {
	    justify-content: content !important;
	}
	
	/* 默认居左 */
	
	.justify-content-start {
	    justify-content: flex-start !important;
	}
	
	/* 默认靠俩边 */
	
	.justify-content-space-between {
	    justify-content: space-between !important;
	}
	
	/* 块级  */
	
	.block {
	    display: block !important;
	}
	
	/* 行内块级  */
	
	.inline-block {
	    display: inline-block !important;
	}
	
	/* 行内  */
	
	.inline {
	    display: inline !important;
	}
	
	/* 消失元素不占地方 */
	
	.none {
	    display: none !important;
	}
	
	/* 消失元素占地方 */
	
	.visibility-hidden {
	    visibility: hidden;
	}
	
	.vertical-align-middle {
	    vertical-align: middle;
	}
	
	.border-none {
	    border: none !important;
	}
	
	.f-s-40 {
	    font-size: 40upx !important;
	}
	
	.f-s-38 {
	    font-size: 38upx !important;
	}
	
	.f-s-36 {
	    font-size: 36upx !important;
	}
	
	.f-s-32 {
	    font-size: 32upx !important;
	}
	
	.f-s-30 {
	    font-size: 30upx !important;
	}
	
	.f-s-28 {
	    font-size: 28upx !important;
	}
	
	.f-s-26 {
	    font-size: 26upx !important;
	}
	
	.f-s-24 {
	    font-size: 24upx !important;
	}
	
	.f-s-22 {
	    font-size: 22upx !important;
	}
	
	.f-s-20 {
	    font-size: 20upx !important;
	}
	
	.f-s-19 {
	    font-size: 19upx !important;
	}
	
	.f-s-18 {
	    font-size: 18upx !important;
	}
	
	/* 字体加粗 */
	
	.font-weight-bold {
	    font-weight: bold;
	}
	
	/* 文字居左 */
	
	.text-left {
	    text-align: left;
	}
	
	/* 文字居中 */
	
	.text-center {
	    text-align: center;
	}
	
	/* 文字居右 */
	
	.text-right {
	    text-align: right;
	}
	
	/* 文字主题色 */
	
	.text-color-primary {
	    color: $uni-color-primary;
	}
	
	/* 文字红色 错误信息 */
	
	.text-color-red {
	    color: $uni-color-error;
	}
	
	.text-color-positive-red {
	    color: #ff002a;
	}
	
	/* 文字灰色：用于跟输入框提示语一样的颜色 */
	
	.text-color-grey {
	    color: $uni-text-color-placeholder;
	}
	
	.bg-gray {
	    background: #f5f5f5;
	}
	
	/* 左浮动 */
	
	.float-left {
	    float: left;
	}
	
	/* 右浮动 */
	
	.float-right {
	    float: right;
	}
	
	.box-sizing-border-box {
	    box-sizing: border-box;
	}
	
	/* 外边距 */
	
	.m-0 {
	    margin: 0 !important;
	}
	
	.m-10 {
	    margin: 10upx !important;
	}
	
	.m-20 {
	    margin: 20upx !important;
	}
	
	.m-30 {
	    margin: 30upx !important;
	}
	
	.m-40 {
	    margin: 40upx !important;
	}
	
	.m-50 {
	    margin: 50upx !important;
	}
	
	.m-l-10 {
	    margin-left: 10upx !important;
	}
	
	.m-l-15 {
	    margin-left: 15upx !important;
	}
	
	.m-l-20 {
	    margin-left: 20upx !important;
	}
	
	.m-l-30 {
	    margin-left: 30upx !important;
	}
	
	.m-l-40 {
	    margin-left: 40upx !important;
	}
	
	.m-l-50 {
	    margin-left: 50upx !important;
	}
	
	.m-r-10 {
	    margin-right: 10upx !important;
	}
	
	.m-r-20 {
	    margin-right: 20upx !important;
	}
	
	.m-r-30 {
	    margin-right: 30upx !important;
	}
	
	.m-r-40 {
	    margin-right: 40upx !important;
	}
	
	.m-r-50 {
	    margin-right: 50upx !important;
	}
	
	.m-r-60 {
	    margin-right: 60upx !important;
	}
	
	.m-t-10 {
	    margin-top: 10upx !important;
	}
	
	.m-t-20 {
	    margin-top: 20upx !important;
	}
	
	.m-t-30 {
	    margin-top: 30upx !important;
	}
	
	.m-t-40 {
	    margin-top: 40upx !important;
	}
	
	.m-t-100 {
	    margin-top: 100upx !important;
	}
	
	.m-t-50 {
	    margin-top: 50upx !important;
	}
	
	.m-b-0 {
	    margin-bottom: 0upx !important;
	}
	
	.m-b-10 {
	    margin-bottom: 10upx !important;
	}
	
	.m-b-20 {
	    margin-bottom: 20upx !important;
	}
	
	.m-b-30 {
	    margin-bottom: 30upx !important;
	}
	
	.m-b-40 {
	    margin-bottom: 40upx !important;
	}
	
	.m-b-50 {
	    margin-bottom: 50upx !important;
	}
	
	/* 内边距 */
	
	.p-0 {
	    padding: 0 !important;
	}
	
	.p-10 {
	    padding: 10upx !important;
	}
	
	.p-20 {
	    padding: 20upx !important;
	}
	
	.p-30 {
	    padding: 30upx !important;
	}
	
	.p-40 {
	    padding: 40upx !important;
	}
	
	.p-50 {
	    padding: 50upx !important;
	}
	
	.p-l-0 {
	    padding-left: 0 !important;
	}
	
	.p-l-10 {
	    padding-left: 10upx !important;
	}
	
	.p-l-20 {
	    padding-left: 20upx !important;
	}
	
	.p-l-30 {
	    padding-left: 30upx !important;
	}
	
	.p-l-40 {
	    padding-left: 40upx !important;
	}
	
	.p-l-45 {
	    padding-left: 45upx !important;
	}
	
	.p-l-50 {
	    padding-left: 50upx !important;
	}
	
	.p-r-0 {
	    padding-right: 0 !important;
	}
	
	.p-r-10 {
	    padding-right: 10upx !important;
	}
	
	.p-r-20 {
	    padding-right: 20upx !important;
	}
	
	.p-r-30 {
	    padding-right: 30upx !important;
	}
	
	.p-r-35 {
	    padding-right: 35upx !important;
	}
	
	.p-r-40 {
	    padding-right: 40upx !important;
	}
	
	.p-r-50 {
	    padding-right: 50upx !important;
	}
	
	.p-r-60 {
	    padding-right: 60upx !important;
	}
	
	.p-t-0 {
	    padding-top: 0 !important;
	}
	
	.p-t-5 {
	    padding-top: 5upx !important;
	}
	
	.p-t-10 {
	    padding-top: 10upx !important;
	}
	
	.p-t-20 {
	    padding-top: 20upx !important;
	}
	
	.p-t-30 {
	    padding-top: 30upx !important;
	}
	
	.p-t-40 {
	    padding-top: 40upx !important;
	}
	
	.p-t-50 {
	    padding-top: 50upx !important;
	}
	
	.p-b-0 {
	    padding-bottom: 0 !important;
	}
	
	.p-b-10 {
	    padding-bottom: 10upx !important;
	}
	
	.p-b-20 {
	    padding-bottom: 20upx !important;
	}
	
	.p-b-30 {
	    padding-bottom: 30upx !important;
	}
	
	.p-b-40 {
	    padding-bottom: 40upx !important;
	}
	
	.p-b-50 {
	    padding-bottom: 50upx !important;
	}
	
	.no-data-main {
	    text-align: center;
	    padding-top: 120upx;
	    color: #979cbd;
	    font-size: 24upx;
	    width: 100%;
	}
	
	.no-data-main .no-data-img {
	    width: 200upx;
	    height: 200upx;
	    margin-bottom: 100upx;
	}
	
	/* loading 全局样式 */
	
	.loading-main {
	    width: 100%;
	    text-align: center;
	    padding: 20upx 0;
	
	    > view.inline-block {
	        color: #979cbd;
	        font-size: 24upx;
	        margin-left: 10upx;
	    }
	}
	
	.loading-main .icon-loading {
	    color: #979cbd;
	    animation-name: rotate;
	    /*动画的名称 */
	    animation-duration: 1200ms;
	    /*动画从开始到结束的时间*/
	    animation-timing-function: linear;
	    /*动画执行快慢的参数*/
	    animation-iteration-count: infinite;
	    /*动画执行多少次的参数*/
	    /*以下是兼容ios所需，参数意义与上相同*/
	    -webkit-animation-name: rotate;
	    -webkit-animation-duration: 1200ms;
	    -webkit-animation-timing-function: linear;
	    -webkit-animation-iteration-count: infinite;
	}
	
	@keyframes rotate {
	    /*开始转的角度*/
	
	    from {
	        transform: rotate(0deg);
	    }
	
	    /*结束的角度*/
	
	    to {
	        transform: rotate(360deg);
	    }
	}
	
	/*兼容ios*/
	
	@-webkit-keyframes rotate {
	    from {
	        transform: rotate(0deg);
	    }
	
	    to {
	        transform: rotate(360deg);
	    }
	}
	
	.bottom-line {
	    width: 100%;
	    padding: 0 0 30upx;
	    text-align: center;
	    margin-top: 30upx;
	    color: #979cbd;
	    font-size: 24upx;
	}
	
	/* loading 全局样式结束 */
</style>
