<template>
	<div class="cus-container">
	    <div class="filter-container">
			<search-bar :searchConfig="searchConfig" ref="searchbar"/>
			<div style="padding-top: 3px;margin-left: 12px;float: left;">
				<el-button
				  class="filter-item"
				  type="primary"
				  size="small"
				  style="width: 80px;"
				  @click="search"
				>
				  {{ $t('table.search') }}
				</el-button>
				<el-button
				  class="filter-item"
				  size="small"
				  style="width: 80px;"
				  @click="resetInput"
				>
				  {{ $t('table.resetting') }}
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
		  v-loading="listLoading"
		  :data="list"
		  element-loading-text="Loading"
		  fit
		  highlight-current-row
		  style="padding-left: 20px;padding-top: 20px;"
		>
		  <el-table-column v-for="(widget, index) in tableConfig" :label="widget.name" :width="widget.width" align="left">
		    <template slot-scope="scope">
		      {{ scope.row[widget.key] }}
		    </template>
		  </el-table-column>
		  <el-table-column
		    :label="$t('table.actions')"
		    align="left"
		    width="150"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.edit') }}</el-button>
			  <el-button size="mini" type="danger" @click="handleDel(row,$index)">{{ $t('table.delete') }}</el-button>
		    </template>
		  </el-table-column>
		  <template slot="empty" >
		    <img src="@/assets/cus_images/nodata.png" class="cus-img">
		    <p class="cus-nodata">{{ $t('table.nodata') }}</p>
		  </template>
		</el-table>
		<pagination
		  v-show="total>0"
		  :total="total"
		  :page.sync="listQuery.pageIndex"
		  :limit.sync="listQuery.pageSize"
		  @pagination="fetchData"
		/>
		<el-dialog
		  :title="ifAdd ? $t('table.add') : $t('table.edit')"
		  v-if="ifShowDrawer"
		  :visible.sync="ifShowDrawer"
		  direction="rtl"
		  width="500px"
		>
		   <page-form :formConfig="formConfig" :temp="temp" ref="pageForm" v-on:submitForm='submitForm'/>
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
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
	import { AddSingleUser,DeleteSingelChannel,AddSingelChannel,UpdateSingelChannel } from '@/api/channel'
	
	import { deepCopy } from '@/utils'
	import i18n from '@/lang' // internationalization
	
	const apiPer = {
	  AddSingelChannel,
	  UpdateSingelChannel
	}
	const searchConfig=[
		{key:'ChannleName',name:'????????????',type:'input',value:''},
		{key:'ChannleNo',name:'?????????',type:'input',value:''}
	]
	const tableConfig=[
		{key:'ID',name:'??????ID'},
		{key:'ChannelName',name:'????????????'},
		{key:'ChannleNo',name:'?????????'},
		{key:'AddTime',name:'????????????'}
	]
	const formConfig=[
		[{key:'ChannelName',name:'????????????',type:'input',disabled:false,rules:[{ required: true, message: '????????????????????????'}]}],
		[{key:'ChannleNo',name:'?????????',type:'input',disabled:false,rules:[{ required: true, message: '?????????????????????'}]}],
	]
	//????????????
	const _searchConfig=[
		{key:'ChannleName',name:'ChannleName',type:'input',value:''},
		{key:'ChannleNo',name:'ChannleNo',type:'input',value:''}
	]
	const _tableConfig=[
		{key:'ID',name:'ID'},
		{key:'ChannelName',name:'ChannelName'},
		{key:'ChannleNo',name:'ChannleNo'},
		{key:'AddTime',name:'AddTime'}
	]
	const _formConfig=[
		[{key:'ChannelName',name:'ChannelName',type:'input',disabled:false,rules:[{ required: true, message: 'ChannelName cannot be empty'}]}],
		[{key:'ChannleNo',name:'ChannleNo',type:'input',disabled:false,rules:[{ required: true, message: 'ChannleNo cannot be empty'}]}],
	]
	export default {
		components:{ searchBar,pageForm,Pagination },
		data() {
		  return {
			  searchConfig:[],
			  tableConfig:[],
			  formConfig:[],
			  list: null,
			  listLoading: false,
			  listQuery: {
			    pageIndex: 1,
			    pageSize: 20
			  },
			  total: 10,
			  /* ?????? */
			  ifShowDrawer: false,
			  temp:{}, //???????????????
			  /* ?????? */
			  ifAdd: false
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
		  switchLanguage(val) {//???????????? ???????????? en/zh
			  if(val=='zh'){//???????????????
				  this.searchConfig=deepCopy(searchConfig)
				  this.tableConfig=deepCopy(tableConfig)
			      this.formConfig=deepCopy(formConfig)
			  }else if(val=='en'){//???????????????
				  this.searchConfig=deepCopy(_searchConfig)
				  this.tableConfig=deepCopy(_tableConfig)
				  this.formConfig=deepCopy(_formConfig)
			  }
		  },
		  fetchData() {
		    this.listLoading = true
			let searchData = this.$refs.searchbar.getData();
			this.listQuery = Object.assign(this.listQuery, searchData);
			AddSingleUser(this.listQuery).then(response => {
		      this.list = response.ChannelModel
		      this.total = response.tolal
		      this.listLoading = false
		    })
		  },
		  //???
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
		  //???
		  handleDetail(row){
		  	this.ifAdd = false
		    this.temp=Object.assign({}, row);
		    this.ifShowDrawer=true;
		  },
		  //??????
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
		  //????????????
		  handleSubmit(){
		  	this.$refs.pageForm.submitForm();
		  },
		  //??????
		  resetInput(){
			this.$refs.searchbar.resetInput();
		  },
		  //??????????????????????????????
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
				  this.$message({
					type: 'info',
					message: i18n.t('information.SubFailed')
				  })
			})
		  },
		  //??????
		  search(){
			this.fetchData()
		  }
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
}
</style>
