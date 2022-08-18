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
        </div>
       
    </div>
</template>

<script>
    import searchBar from '@/components/Page/searchBar.vue'
    import pageForm from '@/components/Page/form.vue'
    import Pagination from '@/components/Pagination';
    import i18n from '@/lang';
    import {deepCopy} from "@/utils";
    import { GetRepaymentList } from '@/api/exchange'

    const searchConfig=[
        {key:['StartDate','EndDate'],name:['开始日期','结束日期'],type:'daterange',value:''},
        {key:'Mobile',name:'手机号',type:'input',value:''},
        {key:'OrderId',name:'订单号',type:'input',value:''}
    ];
    const _searchConfig=[
        {key:['StartDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''},
        {key:'Mobile',name:'Mobile',type:'input',value:''},
        {key:'OrderId',name:'OrderId',type:'input',value:''}
    ];

    // 获取还款记录报表配置
    const tableConfig=[
        {key:'OrderId',name:'订单号'},
        {key:'Name',name:'姓名',width:'150'},
        {key:'Mobile',name:'手机号',width:'150'},

        {key:'RecordDate',name:'放款成功时间'},
        {key:'RecordMoney',name:'放款金额',width:'150'},
        {key:'ShouldRepaymentDate',name:'应还时间'},
        {key:'ShouldRepaymentMoney',name:'应还金额'},
        {key:'RepaymentMoney',name:'实际还款金额'},
        {key:'RepaymentDate',name:'实际还款时间'},
        {key:'AddTime',name:'申请时间'},
        {key:'IsRenew_Ch',name:'是否还款'},
        {key:'AdminID_Ch',name:'是否分配催收'},
    ];

    // 获取还款记录报表配置en
    const _tableConfig=[
        {key:'OrderId',name:'OrderId', nameCn: '订单号'},
        {key:'Name',name:'Name',width:'150', nameCn: '姓名'},
        {key:'Mobile',name:'Mobile',width:'150', nameCn: '手机号'},
        {key:'RecordDate',name:'RecordDate', nameCn: '放款成功时间'},
        {key:'RecordMoney',name:'DisbursedMoney',width:'150', nameCn: '放款金额'},
        {key:'ShouldRepaymentDate',name:'ShouldRepaymentDate', nameCn: '应还时间'},
        {key:'ShouldRepaymentMoney',name:'ShouldRepaymentMoney', nameCn: '应还金额'},
        {key:'RepaymentMoney',name:'RepaymentMoney', nameCn: '实际还款金额'},
        {key:'RepaymentDate',name:'RepaymentDate', nameCn: '实际还款时间'},
        {key:'AddTime',name:'AddTime', nameCn: '申请时间'},
        {key:'IsRenew',name:'IsRenew', nameCn: '是否还款'},
        {key:'AdminID',name:'AdminID', nameCn: '是否分配催收'},
    ];

    export default {
        components:{ searchBar,pageForm,Pagination },
        data() {
            return {
                searchConfig,
                tableConfig,
                list: null,
                listLoading: false,
                listQuery: {
                    pageIndex: 1,
                    pageSize: 20
                },
                total: 10,
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
            switchLanguage(val) {//原始数据 应用数据 en/zh
                if(val=='zh'){//切换成中文
                    this.searchConfig=deepCopy(searchConfig);
                    this.tableConfig=deepCopy(tableConfig);
                    // this.formConfig=deepCopy(formConfig)
                }else if(val=='en'){//切换成英文
                    this.searchConfig=deepCopy(_searchConfig);
                    this.tableConfig=deepCopy(_tableConfig);
                    // this.formConfig=deepCopy(_formConfig)
                }
            },
            fetchData() {
                this.listLoading = true;
                let searchData = this.$refs.searchbar.getData();
                this.listQuery = Object.assign(this.listQuery, searchData);
                GetRepaymentList(this.listQuery).then(response => {
                    this.list = response.datas;
                    this.total = response.tolal;
                    this.listLoading = false;
                })
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

<style scoped lang="scss">
    .XLYYBG-report-main {
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
    }
</style>
