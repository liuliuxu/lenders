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
            <div class="table-title">{{ $t('table.TheOverallSituation') }}</div>
            <el-table
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
    import { GetOperateReportInfo } from '@/api/report';
    import moment from 'moment';

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
            }]}
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
            }]}
    ];

    // ??????????????????????????????
    const operateReportConfig = [
        {key:'NowDay',name:'??????'},
        {key:'RegCount',name:'????????????'},
        {key:'ApplyCount',name:'????????????'},
        {key:'ApproveCount',name:'????????????'},
        {key:'RecordCount',name:'????????????'},
        {key:'ApplyP',name:'?????????'},
        {key:'RecordP',name:'?????????'},
        {key:'OldApproveCount',name:'????????????'},
        {key:'OldRecordP',name:'?????????'}
    ];

    // ??????????????????????????????en
    const operateReportConfigEn = [
        {key:'NowDay',name:'Date'},
        {key:'RegCount',name:'The number of registrations'},
        {key:'ApplyCount',name:'The number of applications'},
        {key:'ApproveCount',name:'Pass the quantity'},
        {key:'RecordCount',name:'The amount of the loan'},
        {key:'ApplyP',name:'Application rate'},
        {key:'RecordP',name:'Pass rate'},
        {key:'OldApproveCount',name:'Number of compound loan documents'},
        {key:'OldRecordP',name:'Compound loan rate'}
    ];

    const operateReportTotalConfig = operateReportConfig.filter(item => {
        return item.key !== 'NowDay';
    });
    const operateReportTotalConfigEn = operateReportConfigEn.filter(item => {
        return item.key !== 'NowDay';
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
                    pageSize: 20
                },
                total: 10,
                operateReportDateList: [], // ?????????
                operateReportDateTotalList: [], // ?????????

            }
        },
        created() {
            this.switchLanguage(this.language);
        },
        mounted() {
            this.fetchData();
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
            },
            fetchData() {
                this.listLoading = true;
                let searchData = this.$refs.searchbar.getData();
                this.listQuery = Object.assign(this.listQuery, searchData);
                GetOperateReportInfo(this.listQuery).then(response => {
                    this.operateReportDateList = response.OperateReportList.map(item => {
                        const NowDay = moment(item.NowDay).format('YYYY-MM-DD');
                        return {
                            ...item,
                            NowDay
                        }
                    });
                    this.operateReportDateTotalList = [response.OperateReportModel];
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
