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
		    width="240"
		    class-name=""
		  >
		    <template slot-scope="{row,$index}">
		      <el-button size="mini" type="primary" @click="handleDetail(row,$index)">{{ $t('table.viewFeedback') }}</el-button>
          <el-button size="mini" type="primary" :disabled="row.isCanSubmitReplyContent" @click="clickReply(row,$index)">{{ $t('table.reply') }}</el-button>
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
		  :title="$t('table.detail')"
		  :visible.sync="ifShowDrawer"
		  direction="rtl"
		  width="800px"
		>
      <page-form :formConfig="formConfig" :temp="temp"/>
		</el-dialog>
    <el-dialog
        :title="$t('table.addReply')"
        :visible.sync="addReplyShowModal"
        direction="rtl"
        width="800px"
    >
      <div>
        <el-form ref="formRemarks" :rules="rulesRemarks" :model="formRemarks" label-width="150px">
          <el-form-item :label="$t('table.reply')" prop="reply">
            <el-input type="textarea" :rows="5" v-model="formRemarks.reply"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="modal_foot">
        <div style="text-align: center;">
          <el-button
              type="primary"
              size="mini"
              @click="handleSubmitAddRemarks"
          >{{$t('table.save')}}</el-button>
          <el-button @click="clickCancelAddRemarks" size="mini">{{$t('table.cancel')}}</el-button>
        </div>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	import searchBar from '@/components/Page/searchBar.vue'
	import pageForm from '@/components/Page/form.vue'
	import Pagination from '@/components/Pagination'
  import {GetCertInfoList, GetFeedbackInfoList, AddReplyContent} from '@/api/user'
	import i18n from '@/lang'
	import {deepCopy} from "@/utils";
	const searchConfig=[
    {key:'Name',name:'投诉人姓名',type:'input',value:''},
    {key:'Mobile',name:'手机号',type:'input',value:''},
		{key:['StrDate','EndDate'],name:['开始日期','结束日期'],type:'daterange',value:''},
		{key:'IsReady',name:'是否解决',type:'select',options:[{
			value: '',
			label: '全部'
		},{
			value: 0,
			label: '否'
		},{
			value: 1,
			label: '是'
		}],value:''}
	]

	const tableConfig=[
		{key:'Name',name:'投诉人姓名',width:'180'},
		{key:'Mobile',name:'手机号',width:'150'},
		{key:'PanNo',name:'Pan No',width:'150'},
		{key:'Addtime',name:'添加日期'},
		{key:'IsReady',name:'是否解决'},
    {key:'FeedbackContent',name:'反馈内容'},
    {key:'ReplyContent',name:'投诉回复'}
	]
	const tableConfig2=[
		{key:'Name',name:'姓名',width:'120'},
		{key:'FeedbackInfo',name:'反馈内容'},
		{key:'Addtime',name:'反馈时间',width:'120'}
	]

	//en
	const _searchConfig=[
    {key:'Name',name:'Name',type:'input',value:''},
		{key:'Mobile',name:'Mobile',type:'input',value:''},
		{key:['StrDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''},
		{key:'IsReady',name:'IsReady',type:'select',options:[{
				value: '',
				label: 'ALL'
			},{
				value: 0,
				label: 'No'
			},{
				value: 1,
				label: 'Yes'
			}],value:''}
	]
	const _tableConfig=[
		{key:'Name',name:'name',width:'180'},
		{key:'Mobile',name:'Mobile',width:'150'},
		{key:'PanNo',name:'PanNo',width:'150'},
		{key:'Addtime',name:'Addtime'},
		{key:'IsReady_En',name:'IsReady'},
    {key:'FeedbackContent',name:'FeedbackContent'},
    {key:'ReplyContent',name:'ReplyContent'}
	]
	const _tableConfig2=[
		{key:'Name',name:'Name',width:'120'},
		{key:'FeedbackInfo',name:'FeedbackInfo'},
		{key:'Addtime',name:'Addtime',width:'120'}
	]
  const formConfig=[
    [{key:'Name',name:'投诉人姓名',type:'input',disabled:true},{key:'PanNo',name:'Pan No',type:'input',disabled:true}],
    [{key:'Mobile',name:'手机号',type:'input',disabled:true},{key:'IsReady',name:'是否解决',type:'input',disabled:true}],
    [{key:'Addtime',name:'添加日期',type:'input',disabled:true},{key:'FeedbackContent',name:'反馈内容',type:'textarea',disabled:true}]
  ];
  const _formConfig=[
    [{key:'Name',name:'Name',type:'input',disabled:true},{key:'PanNo',name:'PanNo',type:'input',disabled:true}],
    [{key:'Mobile',name:'Mobile',type:'input',disabled:true},{key:'IsReady_En',name:'IsReady',type:'input',disabled:true}],
    [{key:'Addtime',name:'Addtime',type:'input',disabled:true},{key:'FeedbackContent',name:'FeedbackContent',type:'textarea',disabled:true}]
  ];
	export default {
		components:{ searchBar,pageForm,Pagination },
		data() {
		  return {
			  searchConfig:searchConfig,
			  tableConfig:tableConfig,
			  tableConfig2:tableConfig2,
			  list: null,
			  list2: null,
			  listLoading: false,
			  listLoading2: false,
			  listQuery: {
			    pageIndex: 1,
			    pageSize: 20
			  },
			  total: 10,
			  ifShowDrawer: false,
			  temp:[], //详情页数据
        addReplyShowModal: false,
        formRemarks: {
          reply: ''
        },
        rulesRemarks: {
          reply: [
            { required: true, message: 'Please enter a reply', trigger: 'blur' },
          ]
        },
        selectedItem: null,
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
      clickCancelAddRemarks() {
        this.addReplyShowModal = false;
      },
      handleSubmitAddRemarks() {
        this.$refs.formRemarks.validate((valid) => {
          if (valid) {
            AddReplyContent({
              ReplyContent: this.formRemarks.reply,
              FeedBackID : this.selectedItem.FeedBackID,
            }).then(response => {
              this.addReplyShowModal = false;
              this.formRemarks.remarks = '';
              this.fetchData();
              this.$message({
                type: 'success',
                message: i18n.t('information.SubSuccess')
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
			switchLanguage(val) {//原始数据 应用数据 en/zh
				if(val=='zh'){//切换成中文
					this.searchConfig=deepCopy(searchConfig)
					this.tableConfig=deepCopy(tableConfig)
					this.formConfig=deepCopy(formConfig)
				}else if(val=='en'){//切换成英文
					this.searchConfig=deepCopy(_searchConfig)
					this.tableConfig=deepCopy(_tableConfig)
					this.formConfig=deepCopy(_formConfig)
				}
			},
		  fetchData() {
		    this.listLoading = true;
			let searchData = this.$refs.searchbar.getData();
			//初始化-1
			for(let i in searchData){
				if(i=="State"){
					if(searchData[i]=="") searchData[i]=-1
				}
			}
			this.listQuery = Object.assign(this.listQuery, searchData);
			  GetFeedbackInfoList(this.listQuery).then(response => {
		      this.list = response.data.map(item => {
		        return {
		          ...item,
              isCanSubmitReplyContent: !!item.ReplyContent
            }
          });
		      this.total = response.tolal;
		      this.listLoading = false
		    })
		  },
		  handleDetail(row){
		    const _ID = row.ID;
		    this.ifShowDrawer=true;
		    this.temp = row;
			// GetFeedbackInfoList({ID:_ID}).then(response => {
			//   this.list = response.data
			//   this.listLoading2 = false
			// })
		  },
      clickReply(row, index) {
        this.addReplyShowModal = true;
        this.selectedItem = row;
      },
		  //重置
		  resetInput(){
			this.$refs.searchbar.resetInput();
		  },
		  //搜索
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
