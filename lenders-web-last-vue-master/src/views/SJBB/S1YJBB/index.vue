<template>
  <div class="XLYYBG-report-main">
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
    </div>
    <div style="padding: 0 20px">
      <el-button size="small" type="primary" @click="exportExcel()">{{ $t('excel.export') }}</el-button>
    </div>
    <div style="padding: 0 20px">
      <div class="table-title">{{ $t('table.TheOverallSituation') }}</div>
      <el-table
          class="table"
          v-loading="listLoading"
          :data="operateReportDateTotalList"
          element-loading-text="Loading"
          fit
          highlight-current-row
      >
        <el-table-column v-for="(widget, index) in operateReportTotalConfig" :label="widget.name" :width="widget.width" align="left">
          <template slot-scope="scope">
            {{ scope.row[widget.key] }}
          </template>
        </el-table-column>
        <template slot="empty" >
          <img src="@/assets/cus_images/nodata.png" class="cus-img">
          <p class="cus-nodata">{{ $t('table.nodata') }}</p>
        </template>
      </el-table>
      <div class="table-title" style="margin-top: 50px">{{ $t('table.DetailsSituation') }}</div>
      <el-table
          class="table1"
          v-loading="listLoading"
          :data="operateReportDateList"
          element-loading-text="Loading"
          fit
          highlight-current-row
      >
        <el-table-column v-for="(widget, index) in operateReportConfig" :label="widget.name" :width="widget.width" align="left">
          <template slot-scope="scope">
            {{ scope.row[widget.key] }}
          </template>
        </el-table-column>
        <template slot="empty" >
          <img src="@/assets/cus_images/nodata.png" class="cus-img">
          <p class="cus-nodata">{{ $t('table.nodata') }}</p>
        </template>
      </el-table>
    </div>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageIndex"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchData"
    />
  </div>
</template>

<script>
import searchBar from '@/components/Page/searchBar.vue'
import pageForm from '@/components/Page/form.vue'
import Pagination from '@/components/Pagination';
import i18n from '@/lang';
import {deepCopy} from "@/utils";
import { GetS1CollectionReportInfo } from '@/api/report';
import moment from 'moment';
import { GetCollectionManList } from '@/api/user';
import FileSaver from "file-saver";
import XLSX from "xlsx";

const searchConfig=[
  {key:['StrDate','EndDate'],name:['????????????','????????????'],type:'daterange',value:'', isInit: true},
  {key:'Costomer',type:'select', name:'?????????',value: '', multiple: false,options:[{
      value: '',
      label: '??????'
    },{
      value: 0,
      label: '??????'
    },{
      value: 1,
      label: '??????'
    }]},
  {key:'collectionNos',type:'select', name:'??????????????????',value: [], multiple: true,options:[]},
  {
    key: 'showgrouptype', type: 'radio', name: '????????????', value: -1, multiple: false, options: [{
      value: -1,
      label: '???????????????'
    }, {
      value: 1,
      label: '????????????'
    }, {
      value: 2,
      label: '???????????????'
    }]
  }
];
const _searchConfig=[
  {key:['StrDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:'', isInit: true},
  {key:'Costomer',type:'select', name:'New and old guests',value: '', multiple: false,options:[{
      value: '',
      label: 'All'
    },{
      value: 0,
      label: 'New guests'
    },{
      value: 1,
      label: 'Old man'
    }]},
  {key:'collectionNos',type:'select', name:'Collection personnel',value: [], multiple: true,options:[]},
  {
    key: 'showgrouptype', type: 'radio', name: 'showGroupType', value: -1, multiple: false, options: [{
      value: -1,
      label: 'No need to aggregate'
    }, {
      value: 1,
      label: 'Date summary'
    }, {
      value: 2,
      label: 'Collector summary'
    }]
  }
];

// D0??????????????????
const operateReportConfig = [
  {key:'OrderDate',name:'?????????'},
  {key:'collectionNo',name:'?????????'},
  {key:'AmountInSstock',name:'????????????'},
  {key:'NumInSstock',name:'?????????'},
  {key:'RecallAmount',name:'????????????'},
  {key:'RecallNum',name:'????????????'},
  {key:'OrderRecallRate',name:'???????????????'},
  {key:'AmountRecallRate',name:'???????????????'},
  {key:'RemarkCount',name:'????????????'},
  {key:'ConnectOrder',name:'????????????'},
  // {key:'NoConnectOrder',name:'???????????????'},
  {key:'ConnectRate',name:'?????????'},
];

// D0??????????????????en
const operateReportConfigEn = [
  {key:'OrderDate',name:'Billing date'},
  {key:'collectionNo',name:'Collector'},
  {key:'AmountInSstock',name:'Amount in stock'},
  {key:'NumInSstock',name:'In stock'},
  {key:'RecallAmount',name:'Recall amount'},
  {key:'RecallNum',name:'Recall order'},
  {key:'OrderRecallRate',name:'Order recall rate'},
  {key:'AmountRecallRate',name:'Amount recall rate'},
  {key:'RemarkCount',name:'Number of remarks'},
  {key:'ConnectOrder',name:'Connect order'},
  // {key:'NoConnectOrder',name:'Unconnected order'},
  {key:'ConnectRate',name:'Connect rate'},
];

const operateReportTotalConfig = operateReportConfig.filter(item => {
  return item.key !== 'OrderDate' && item.key !== 'collectionNo';
});
const operateReportTotalConfigEn = operateReportConfigEn.filter(item => {
  return item.key !== 'OrderDate' && item.key !== 'collectionNo';
});

export default {
  components:{ searchBar,pageForm,Pagination },
  data() {
    return {
      searchConfig,
      operateReportConfig,
      operateReportTotalConfig,
      list: null,
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        type: 'S1'
      },
      total: 10,
      operateReportDateList: [], // ?????????
      operateReportDateTotalList: [], // ?????????
      listCSRYQuery: {
        pageIndex: 1,
        pageSize: 999,
        type: 'S1'
      },
      listCSRYTotal: 0,
      listCSRY: null,
      viewPageType: 'S1',
    }
  },
  created() {
    this.switchLanguage(this.language);
  },
  mounted() {
    this.fetchData();
    this.fetchCSRYData();
    this.setZDDtype();
  },
  computed: {
    language() {
      return this.$store.getters.language;
    }
  },
  watch: {
    language: function (val, oldVal) {
      console.warn(val);
      this.switchLanguage(val);
    }
  },
  methods: {
    exportExcel() {
      const nowDateStr = moment(new Date()).format('YYYYMMDDHHmmss');
      const title = this.language === 'en' ? this.$route.meta.titleEn : this.$route.meta.titleCn;
      // ???????????????Dom??????
      const elt1 = document.querySelector(".table1");
      const elt2 = document.querySelector(".table");
      // ????????????workbook
      const wb = XLSX.utils.book_new();
      // ???????????????sheet
      const sheet1 = XLSX.utils.table_to_sheet(elt1);
      const sheet2 = XLSX.utils.table_to_sheet(elt2);
      // ???sheet?????????workbook???
      XLSX.utils.book_append_sheet(wb,sheet1,`${i18n.t('table.DetailsSituation')}`);
      XLSX.utils.book_append_sheet(wb,sheet2, `${i18n.t('table.TheOverallSituation')}`);
      // ???????????????
      return XLSX.writeFile(wb, `${nowDateStr} ${title}.xlsx`);
    },
    setZDDtype() {
      if (this.$route.path === '/S2YJBB') {
        this.listCSRYQuery.type = 'S2';
        this.listQuery.type = 'S2';
        this.viewPageType = 'S2';
      }
    },
    fetchCSRYData() {
      GetCollectionManList(this.listCSRYQuery).then(response => {
        this.listCSRY = response.data.map(item => {
          return {
            ...item,
            id: item.AdminNo,
            name: item.Name,
            value: item.AdminNo,
            label: item.Name + item.Phone
          }
        });
        this.setCollectionOpt();
        this.listCSRYTotal = response.tolal
      });
    },
    setCollectionOpt() {
      const collection = this.searchConfig.find(item => item.key === 'collectionNos');
      if (collection) {
        collection.options = this.listCSRY;
      }
    },
    switchLanguage(val) {//???????????? ???????????? en/zh
      if(val=='zh'){//???????????????
        this.searchConfig=deepCopy(searchConfig);
        this.operateReportConfig=deepCopy(operateReportConfig);
        this.operateReportTotalConfig=deepCopy(operateReportTotalConfig);
        // this.tableConfig=deepCopy(tableConfig);
        // this.formConfig=deepCopy(formConfig)
      }else if(val=='en'){//???????????????
        this.searchConfig=deepCopy(_searchConfig);
        this.operateReportConfig=deepCopy(operateReportConfigEn);
        this.operateReportTotalConfig=deepCopy(operateReportTotalConfigEn);
        // this.tableConfig=deepCopy(_tableConfig);
        // this.formConfig=deepCopy(_formConfig)
      }
      this.setCollectionOpt();
    },
    fetchData() {
      this.listLoading = true;
      let searchData = this.$refs.searchbar.getData();
      this.listQuery = Object.assign(this.listQuery, searchData);
      GetS1CollectionReportInfo(this.listQuery).then(response => {
        this.operateReportDateList = response.CollectionPerforms.map(item => {
          const OrderDate = moment(item.OrderDate).format('YYYY-MM-DD');
          return {
            ...item,
            OrderDate
          }
        });
        this.operateReportDateTotalList = [response.TotalModel];
        this.total = response.tolal;
        this.listLoading = false;
      })
    },
    //??????
    resetInput(){
      this.$refs.searchbar.resetInput();
    },
    //??????
    search(){
      this.fetchData()
    }
  }
}
</script>

<style scoped lang="scss">
.XLYYBG-report-main {
  .cus-container {
    .filter-container{
      padding: 20px 0 0px 20px;
      overflow: hidden;
      box-sizing: border-box;
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
  .table-title {
    font-size: 14px;
    margin-left: 10px;
    margin-top: 20px;
    padding-left: 3px;
    border-left: 5px solid #409EFF;
  }
}
</style>
