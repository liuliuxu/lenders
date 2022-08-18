<template>
    <view>
        <view class="input" ref="input" v-if="uploadFileType === 'file'">
            <view class="show-input" :class="loadding ? 'opacity' : ''">
                <text>{{ showText }}</text>
                <text class="icon icon-loading m-l-10" v-if="loadding"></text>
            </view>
        </view>
        <view
            class="input-avatar"
            ref="input"
            v-if="uploadFileType === 'avatar'"
        >
            <image
                class="avatar"
                :src="fileObj.showPath"
                v-if="fileObj.showPath"
            ></image>
        </view>
    </view>
</template>

<script>
import fly from 'flyio';
import APP_CONFIG from '../../app-config.js';
export default {
    props: {
        showText: {
            type: String,
            value: null,
            default() {
                return '上传附件';
            },
        },
        fileType: {
            type: Number,
            value: null,
            default() {
                return 10273;
            },
        },
        imid: {
            type: Number,
            value: null,
            default() {
                return null;
            },
        },
        itemid: {
            type: Number,
            value: null,
            default() {
                return null;
            },
        },
        uploadFileType: {
            type: String,
            value: null,
            default() {
                return 'file';
            },
        },
    },
    name: 'CustomInputFile',
    data() {
        return {
            fileObj: {},
            loadding: false,
        };
    },
    mounted() {
        // console.log(1);
        this.initInput();
    },
    methods: {
        initInput() {
            const that = this;
            // console.warn('input');
            const input = document.createElement('input');
            // input.style.display = 'none';
            input.type = 'file';
            input.setAttribute('class', 'hide-input');
            if (this.uploadFileType === 'avatar') {
                input.setAttribute('accept', 'image/jpeg,image/jpeg,image/png');
            }
            // console.error(input)
            // input.value = '上传文件';
            // console.warn(this.$refs);
            this.$refs.input.$el.appendChild(input);
            input.onchange = (event) => {
                // console.log(event);
                // console.warn('文件列表', event.target.files);
                const form = new FormData();
                form.append('formFile', event.target.files[0]);
                // console.log(form);
                that.loadding = true;
                fly.post(`${APP_CONFIG.domain}/UploadNoToken.aspx`, form).then(
                    (res) => {
                        that.loadding = false;
                        const resData = res.data ? JSON.parse(res.data) : {};
                        console.log(resData);
                        const file = resData.data.files[0];
                        console.log(file);

                        // "10272(头像)/10273(附件)"
                        const fileObj = {
                            iFileId: file.ifileid,
                            iType: that.fileType,
                            updatestatus: 1,
                            name: file.sname,
                            path: file.spath,
                            imid: this.imid,
                            itemid: this.itemid,
                            id: file.ifileid,
                            showPath: `${APP_CONFIG.domain}${file.spath}`,
                        };
                        this.fileObj = fileObj;
                        this.$emit('submitFile', fileObj);
                    },
                );
            };
        },
    },
};
</script>

<style lang="scss">
.input {
    background: #007aff;
    color: #fff;
    // padding: 14upx 28upx;
    line-height: normal;
    font-size: 28upx;
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    border-radius: 10upx;
    cursor: pointer;

    .show-input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 18upx 28upx;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        line-height: normal;
        font-size: 28upx;
        border-radius: 10upx;
    }
}
.input-avatar {
    width: 75px;
    height: 105px;
    border-radius: 0;

    /* width: 150upx; */
    /* height: 150upx; */
    margin: 0 auto;
    border: 2upx solid #f1f1f1;
    /* border-radius: 50%; */
    background: #f1f1f1;
    position: relative;
    .avatar {
        width: 75px;
        height: 105px;
        border-radius: 0;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
    }
}

.opacity {
    background: #469dfb;
}
.icon-loading {
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
</style>
