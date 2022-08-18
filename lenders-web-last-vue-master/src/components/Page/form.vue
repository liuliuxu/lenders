<template>
	<div class="cus-container">
		<el-form
		  ref="dataForm"
		  :model="temp"
		  label-position="right"
		  label-width="128px"
		  style="margin-left:0px;margin-right:50px;"
		>
		   <el-row v-for="(widget, index) in formConfig">
				<el-col :span="24/widget.length" v-for="(_widget,_index) in widget" v-if="_widget.type == 'input'">
					<el-form-item
						:label="_widget.name"
						:rules="_widget.rules"
						:prop="_widget.key"
					>
						<el-input size="middle" v-model="temp[_widget.key]" :disabled="_widget.disabled"/>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-for="(_widget,_index) in widget" v-if="_widget.type == 'textarea'">
					<el-form-item
						:label="_widget.name"
						:rules="_widget.rules"
						:prop="_widget.key"
					>
						<el-input size="middle"
								type="textarea"
								v-model="temp[_widget.key]" :disabled="_widget.disabled"/>
					</el-form-item>
				</el-col>
				
				<el-col :span="24/widget.length" v-for="(_widget,_index) in widget" v-if="_widget.type == 'select'">
					<el-form-item
						:label="_widget.name"
					>
						<el-select size="middle" v-model="temp[_widget.key]" :disabled="_widget.disabled">
							<el-option
							v-for="item in _widget.configs"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24/widget.length" v-for="(_widget,_index) in widget" v-if="_widget.type == 'upload'">
					<el-form-item
						:label="_widget.name"
						:rules="_widget.rules"
						:prop="_widget.key"
					>
						<el-upload
							:limit="1"
							class="upload-demo"
							action="/"
							:http-request="(file => {return httpRequest(file,_widget)})"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:file-list="fileList"
							:disabled="_widget.disabled"
							:on-change="onChange"
							list-type="picture">
							<el-button size="small" type="primary">点击上传</el-button>
							<!-- <div style="width:60px;height:50px;"><img style="width:100%;height:100%;" :src="temp[_widget.key]" alt=""></div> -->
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
						<!-- <el-input size="middle" 
							v-model="temp[_widget.key]" :disabled="_widget.disabled"/> -->
					</el-form-item>
				</el-col>

		   </el-row>
			
		</el-form>
	</div>
</template>

<script>
	export default {
		props:['formConfig','temp'],
		data() {
		  return {
			fileList:[],
		  }
		},
		created() {
		},
		methods:{
			submitForm() {
				this.$refs['dataForm'].validate((valid) => {
				  if (valid) {
					this.$emit('submitForm',this.temp)
				  } else {
					console.log('error submit!!');
					return false;
				  }
				});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				// console.log(file);
			},
			onChange(file){
				console.log(file);
			},
			async httpRequest(file, _widget){
				// const base64 = await this.getBase64(file);
				this.formConfig.forEach( e => {
					e.forEach( (i, index) => {
						if(i.type === "upload" && i.key === _widget.key){
							this.temp[i.key] = file.file
						}
					})
				});
			},
			//base64编码转换方法
			getBase64(file){
				return new Promise((resolve,reject)=>{
					let reader = new FileReader()	//定义方法读取文件
					reader.readAsDataURL(file.file)	//开始读文件  本身是图片的二进制数据 进行base64加密形成字符串
					reader.onload = (e)=> resolve(e.target.result)//成功返回对应的值 reader.result可以直接放在img标签中使用
					reader.onerror = ()=> reject(error)//失败返回失败信息
				})
			},
		}
	}
</script>

<style>
</style>
