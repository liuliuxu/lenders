<template>
	<div class="cus-container">
<!-- 		<el-form
		  ref="dataForm"
		  :model="temp"
		  label-position="right"
		  label-width="120px"
		  style="margin-left:0px;margin-right:50px;"
		> -->
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
		   </el-row>
<!-- 		</el-form> -->
	</div>
</template>

<script>
	export default {
		props:['formConfig','temp'],
		data() {
		  return {
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
		}
	}
</script>

<style>
</style>
