<template>
	<div class="cus-container">
	    <div class="filter-container">
			<div style="padding-top: 3px;margin-left: 12px;float: left;">
					<el-button
					  class="filter-item"
					  type="primary"
					  size="small"
					  style="width: 80px;"
					  @click="toggleRowExpansion(true)"
					>
					  {{ $t('table.expandall') }}
					</el-button>
					<el-button
					  class="filter-item"
					  size="small"
					  style="width: 80px;"
					  @click="toggleRowExpansion(false)"
					>
					  {{ $t('table.shrinkall') }}
					</el-button>
					<el-button
					  class="filter-item"
					  type="primary"
					  plain
					  size="small"
					  style="width: 80px;"
					  @click="handleDetail"
					>
					  {{ $t('table.edit') }}
					</el-button>
					<el-button
					  class="filter-item"
					  type="primary"
					  plain
					  size="small"
					  style="width: 80px;"
					  @click="handleInsert"
					>
					  {{ $t('table.add') }}
					</el-button>
			</div>
		</div>
		<el-table
		  ref="multipleTable"
		  v-loading="listLoading"
		  :data="treeData"
		  row-key="ID"
		  element-loading-text="Loading"
		  fit
		  highlight-current-row
		  style="padding-left: 20px;padding-top: 20px;"
		  default-expand-all
		  :tree-props="{children: 'children'}"
		  @selection-change="handleSelectionChange"
		  @select="select"
		>
		  <el-table-column
		        type="selection"
		        width="55">
		      </el-table-column>
		  <el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :width="widget.width" align="left">
		    <template slot-scope="scope">
		      {{ scope.row[widget.key] }}
		    </template>
		  </el-table-column>
		  <template slot="empty" >
		    <img src="@/assets/cus_images/nodata.png" class="cus-img">
		    <p class="cus-nodata">{{ $t('table.nodata') }}</p>
		  </template>
		</el-table>
	    <el-dialog
	      :title="ifAdd ? $t('table.add') : $t('table.edit')"
	      v-if="ifShowDrawer"
	      :visible.sync="ifShowDrawer"
	      direction="rtl"
	      width="800px"
	    >
		   <el-form
		     ref="dataForm"
		     :model="temp"
		     label-position="right"
		     label-width="120px"
		     style="margin-left:0px;margin-right:50px;"
		   >
			   <page-formrow :formConfig="formConfig" :temp="temp" ref="pageForm" v-on:submitForm='submitForm'/>
			   <el-form-item
				 :label="$t('table.superiormenu')"
				 prop="upDeptName"
			   >
				 <tree-selector
				   :treeData="treeData"
				   :dataProps="{
					 children: 'children',
					 label: 'menuname',
					 id: 'ID'
				   }"
				   :placeholder="$t('table.menuMsg')"
				   v-model="temp.ID"
				 ></tree-selector>
			   </el-form-item>
		  </el-form>
		   <div class="modal_foot">
	    	<div style="text-align: center;">
	    	  <el-button
	    		type="primary"
	    		size="mini"
	    		@click="handleSubmit"
	    	  >{{$t('table.save')}}</el-button>
	    	  <el-button @click="ifShowDrawer = false" size="mini">{{$t('table.cancel')}}</el-button>
	    	</div>
	      </div>
	    </el-dialog>
	</div>
</template>
<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageFormrow from '@/components/Page/formRow.vue'
	import treeSelector from './common/treeSelector'
	import { AddSingleMenu,DeleteSingleMenu,UpdateSingleMenu,GetAllMenuList } from '@/api/menu'

	import { deepCopy } from '@/utils'
	import i18n from '@/lang' // internationalization
	import moment from 'moment';

	const apiPer = {
	  AddSingleMenu,
	  UpdateSingleMenu
	}
	const tableConfig=[
		{key:'menuname',name:'菜单名称',width:'350'},
		{key:'ID',name:'主键ID',width:'200'},
		{key:'menucode',name:'菜单编号',width:'300'},
		{key:'Addtime',name:'添加时间'}
	]
	const formConfig=[
		[{key:'ID',name:'主键Id',type:'input',disabled:true},{key:'Addtime',name:'添加时间',type:'input',disabled:true}],
		[{key:'url',name:'菜单地址',type:'input',disabled:false},{key:'text',name:'菜单描述',type:'input',disabled:false}],
		[{key:'menucode',name:'菜单编号',type:'input',disabled:false},{key:'menuname',name:'菜单名称',type:'input',disabled:false}],
	    [{key:'icon',name:'菜单图标',type:'input',disabled:false}]
	]
	const _tableConfig=[
		{key:'menuname',name:'menuname',width:'350'},
		{key:'ID',name:'ID',width:'200'},
		{key:'menucode',name:'menucode',width:'300'},
		{key:'Addtime',name:'AddTime'}
	]
	const _formConfig=[
		[{key:'ID',name:'ID',type:'input',disabled:true},{key:'Addtime',name:'Addtime',type:'input',disabled:true}],
		[{key:'url',name:'url',type:'input',disabled:false},{key:'text',name:'text',type:'input',disabled:false}],
		[{key:'menucode',name:'menucode',type:'input',disabled:false},{key:'menuname',name:'menuname',type:'input',disabled:false}],
	    [{key:'icon',name:'icon',type:'input',disabled:false}]
	]
	export default {
		components:{ searchBar,pageFormrow,treeSelector },
		data() {
		  return {
			  tableConfig:[],
			  formConfig:[],
			  list: null,
			  listLoading: false,
			  listQuery: {
			    pageIndex: 1,
			    pageSize: 20
			  },
			  total: 10,
			  /* 抽屉 */
			  ifShowDrawer: false,
			  temp:{}, //详情页数据
			  /* 增改 */
			  ifAdd: false,
			  treeData:[],
			  selectedList: [], // 选中数据
			  /* 抽屉的上级选择框 */
			  depSel: []
		  }
		},
		computed: {
		  language() {
		    return this.$store.getters.language
		  }
		},
		watch: {
			language: function (val, oldVal) {
			  this.switchLanguage(val)
			}
		},
		created() {
		   this.switchLanguage(this.language)
		},
		mounted() {
		  this.fetchData()
		},
		methods: {
		  switchLanguage(val) {//原始数据 应用数据 en/zh
			  if(val=='zh'){//切换成中文
				  this.tableConfig=deepCopy(tableConfig)
				  this.formConfig=deepCopy(formConfig)
			  }else if(val=='en'){//切换成英文
				  this.tableConfig=deepCopy(_tableConfig)
				  this.formConfig=deepCopy(_formConfig)
			  }
		  },
		  toggleRowExpansion(isExpansion){
			this.toggleRowExpansion_forAll(this.treeData,isExpansion);
		  },
		  toggleRowExpansion_forAll(data,isExpansion){
			 data.forEach(item=>{
				 this.$refs.multipleTable.toggleRowExpansion(item,isExpansion);
				 if(item.children != undefined && item.children != null){
					 this.toggleRowExpansion_forAll(item.children,isExpansion);
				 }
			 })
		  },
		  // 当用户手动勾选数据行的 Checkbox 时触发的事件,确保只能选中一项数据
		  select(selection, row){
			this.selectedList =row;
			this.$refs.multipleTable.clearSelection();
			if(selection.length == 0) return ;
			this.$refs.multipleTable.toggleRowSelection(row, true);
		  },
		  // 当选择项发生变化时会触发该事件，进行赋值
		  handleSelectionChange(row) {
			//this.selectedList =row;
		  },
		  fetchData() {
		    this.listLoading = true
			GetAllMenuList().then(response => {
		      this.list = response.sysMenuList
			  this.generaMenu(this.treeData,this.list)
			  console.log(this.treeData)
		      this.listLoading = false
		    })
		  },
		  //增
		  handleInsert(){
			this.ifAdd = true
			this.formConfig.forEach((item,index) => {
				item.forEach((_item,index) => {
					this.temp[_item.key]=''
				})
			})
			this.temp = { ...{} }
			this.ifShowDrawer=true
		  },
		  //改
		  handleDetail(){
		  	this.ifAdd = false
		    this.temp=Object.assign({}, this.selectedList);
		  	console.log(this.temp)
		    this.ifShowDrawer=true;
		  },
		  //删除
		  handleDel(row) {
			  this.$confirm(i18n.t('information.deleteConfirm'), i18n.t('information.tips'), {
			    confirmButtonText: i18n.t('permission.delete'),
			    cancelButtonText: i18n.t('permission.cancel'),
			    type: 'warning'
			  })
			    .then(() => {
			      DeleteSingelChannel({id:row.ID})
			        .then(res => {
			          this.$message({
			            type: 'success',
			            message: i18n.t('permission.DelSuccess')
			          })
			          this.getUser()
			        })
			        .catch(err => {
			          this.$message.error(i18n.t('permission.DelFailed'))
			        })
			    })
			    .catch(() => {
			      this.$message({
			        type: 'info',
			        message: i18n.t('information.Cancelled')
			      })
			    })
		  },
		  //保存触发
		  handleSubmit(){
		  	this.$refs.pageForm.submitForm();
		  },
		  //重置
		  resetInput(){
			this.$refs.searchbar.resetInput();
		  },
		  //保存之后，子组件回调
		  submitForm(data){
			apiPer[this.ifAdd ? 'AddSingelChannel' : 'UpdateSingelChannel'](data)
			  .then(res => {
				  this.$message({
					type: 'success',
					message: i18n.t('information.SubSuccess')
				  })
				  this.fetchData()
				  this.ifShowDrawer = false
			}).catch(err => {
				  console.log(err)
				  this.$message({
					type: 'info',
					message: i18n.t('information.SubFailed')
				  })
			})
		  },
		  //搜索
		  search(){
			this.fetchData()
		  },
		  //处理菜单数据
		  generaMenu(treeData,data,pid) {
		    data.forEach(item => {
		      let menu
		      if (item.sysMenuLists) {
		        menu = {
					Addtime: moment(item.Addtime).format('YYYY-MM-DD HH:mm:ss'),
					ID: item.ID,
					pid: '',
					icon: item.icon,
					menucode: item.menucode,
					menuname: item.menuname,
					parentId: item.parentId,
					children: [],
					text: item.text,
					url: item.url
		        }
		      } else {
		        menu = {
		          Addtime: moment(item.Addtime).format('YYYY-MM-DD HH:mm:ss'),
		          ID: item.ID,
				  pid: pid,
		          icon: item.icon,
		          menucode: item.menucode,
		          menuname: item.menuname,
		          parentId: item.parentId,
		          text: item.text,
		          url: item.url
		        }
		      }
		      if (item.sysMenuLists) {
		        this.generaMenu(menu.children,item.sysMenuLists,item.ID)
		      }
		      treeData.push(menu)
		    })
		  },
		}
	}
</script>

<style lang="scss" scoped>
.cus-container {
	.filter-container{
		padding: 20px 0 0px 20px;
	}
    >>> .el-table__empty-text {
      line-height: 1;
    }
    .cus-img{
      height: 40px;
      margin-top:60px;
    }
    .cus-nodata{
      line-height: inherit!important;
      margin-bottom: 60px;
    }
	/*隐藏表头复选框*/
	>>> .has-gutter {
		   .el-checkbox__inner{
			   display:none
		   }
	}
}
</style>
