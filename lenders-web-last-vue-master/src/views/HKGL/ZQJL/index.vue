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
    import { QueryRenewList } from '@/api/exchange'

    const searchConfig=[
        {key:['StartDate','EndDate'],name:['????????????','????????????'],type:'daterange',value:''},
        {key:'Mobile',name:'?????????',type:'input',value:''},
        {key:'OrderId',name:'?????????',type:'input',value:''}
    ];
    const _searchConfig=[
        {key:['StartDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''},
        {key:'Mobile',name:'Mobile',type:'input',value:''},
        {key:'OrderId',name:'OrderId',type:'input',value:''}
    ];

    // ??????????????????????????????
    const tableConfig=[
        {key:'OrderId',name:'?????????'},
        {key:'Name',name:'??????'},
        {key:'Mobile',name:'?????????'},
        {key:'RenewDate',name:'????????????'},
        {key:'NextShouldRepaymentDate',name:'??????????????????'},
        {key:'RenewMoney',name:'????????????'},
    ];

    // ??????????????????????????????en
    const _tableConfig=[
        {key:'OrderId',name:'OrderId', nameCn: '?????????'},
        {key:'Name',name:'Name', nameCn: '??????'},
        {key:'Mobile',name:'Mobile', nameCn: '?????????'},
        {key:'RenewDate',name:'RenewDate', nameCn: '????????????'},
        {key:'NextShouldRepaymentDate',name:'NextShouldRepaymentDate', nameCn: '??????????????????'},
        {key:'RenewMoney',name:'RenewMoney', nameCn: '????????????'},
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
            switchLanguage(val) {//???????????? ???????????? en/zh
                if(val=='zh'){//???????????????
                    this.searchConfig=deepCopy(searchConfig);
                    this.tableConfig=deepCopy(tableConfig);
                    // this.formConfig=deepCopy(formConfig)
                }else if(val=='en'){//???????????????
                    this.searchConfig=deepCopy(_searchConfig);
                    this.tableConfig=deepCopy(_tableConfig);
                    // this.formConfig=deepCopy(_formConfig)
                }
            },
            fetchData() {
                this.listLoading = true;
                let searchData = this.$refs.searchbar.getData();
                this.listQuery = Object.assign(this.listQuery, searchData);
                QueryRenewList(this.listQuery).then(response => {
                    this.list = response.datas;
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
