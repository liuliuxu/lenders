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
                    :width="language === 'en' ? 700 : 600"
                    class-name=""
            >
                <template slot-scope="{row,$index}">
                    <el-button size="mini" type="primary" @click="clickViewDetail(row,$index)">{{ $t('table.detail') }}</el-button>
                    <el-button size="mini" type="primary"
                               :disabled="row.ApplyResult_Ch !== '审核中'"
                               @click="handleagree(row,$index)">{{ $t('table.agree') }}</el-button>
<!--                    :disabled="row.ApplyResult_Ch === '已还款' || row.ApplyResult_Ch === '放款成功' || row.ApplyResult === 'approve'"-->
                    <el-button size="mini" type="danger"
                               :disabled="row.ApplyResult_Ch !== '审核中'"
                               @click="clickReject(row,$index)">{{ $t('table.reject') }}</el-button>
<!--                    :disabled="row.ApplyResult_Ch === '已还款' || row.ApplyResult_Ch === '放款成功' || row.ApplyResult === 'approve'"-->
                    <el-button size="mini" type="danger"
                               :disabled="row.ApplyResult_Ch !== '还款中' && row.ApplyResult_Ch !== '放款完成'"
                               @click="clickWrittenOff(row,$index)">{{ $t('table.writtenOff') }}</el-button>
                    <el-button size="mini" type="danger"
                             @click="clickRenewalTime(row,$index)">{{ $t('table.renewal') }}</el-button>
                    <el-button size="mini" type="danger"
                             @click="clickExemption(row,$index)">{{ $t('table.exemption') }}</el-button>
                    <!-- <el-popover placement="left" width="50" trigger="click" style="margin-left: 10px">
                        <el-button type="text" size="mini" @click="chongQi(row,$index)">{{ $t('table.LoanStatus') }}</el-button>
                        <el-button type="text" size="mini" @click="chongZhi(row,$index)">{{ $t('table.RepaymentStatus') }}</el-button>
                        <el-button type="text" size="mini" @click="jinYong(row,$index)">{{ $t('table.EditStatus') }}</el-button>
                        <el-button slot="reference" size="mini" type="danger">更多</el-button>
                    </el-popover> -->
                    <el-dropdown style="margin-left: 10px" @command="handleCommand" @visible-change="moreDropdoen(row,$index)">
                        <el-button type="primary" size="mini">
                            {{ $t('table.moreButton') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="LoanStatus">{{ $t('table.LoanStatus') }}</el-dropdown-item>
                            <el-dropdown-item command="RepaymentStatus">{{ $t('table.RepaymentStatus') }}</el-dropdown-item>
                            <el-dropdown-item :disabled="row.Applyprogress==='Refused to lend'?false:true" command="EditStatus">{{ $t('table.EditStatus') }}</el-dropdown-item>
                            <el-dropdown-item :disabled="row.Applyprogress==='approve'?false:true" command="ChangeStatus">{{ $t('table.ChangeStatus') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
            <div class="modal_foot">
                <div style="text-align: center;">
                    <!-- 		      <el-button
                                    type="primary"
                                    @click="handleSubmit"
                                  >保存</el-button> -->
                    <!-- <el-button @click="ifShowDrawer = false">取消</el-button> -->
                </div>
            </div>
        </el-dialog>
        <BorrowingInfo
          v-if="showDetail"
          :selectedItem="selectedItem"
          :showDetail="showDetail"
          @closeDetails="closeDetails()" />
        <el-dialog
                :title="$t('table.writtenOff')"
                :visible.sync="isWrittenOff"
                direction="rtl"
                width="500px"
        >
            <div>
                <el-form ref="formWrittenOff" :rules="rulesWrittenOff" :model="formWrittenOff" label-width="80px">
                    <el-form-item :label="$t('table.LastRepaymentDate')" prop="LastRepaymentDate">
<!--                        <el-input v-model="formWrittenOff.LastRepaymentDate"></el-input>-->
                        <el-date-picker
                                style="width: 100%;"
                                v-model="formWrittenOff.LastRepaymentDate"
                                type="datetime"
                                placeholder="Select the date time">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('table.LastRepaymentMoney')" prop="LastRepaymentMoney">
                        <el-input v-model="formWrittenOff.LastRepaymentMoney"></el-input>
                    </el-form-item>
                </el-form>

            </div>
            <div class="modal_foot">
                <div style="text-align: center;">
                    <el-button
                            type="primary"
                            size="mini"
                            @click="clickSubmitWrittenOff"
                    >{{$t('table.save')}}</el-button>
                    <el-button @click="clickCancelWrittenOff" size="mini">{{$t('table.cancel')}}</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 展期 -->
        <el-dialog
                :title="$t('table.renewal')"
                :visible.sync="renewalShow"
                direction="rtl"
                width="500px"
                :before-close="clickCancelRenewalOff"
        >
            <div>
                <el-form ref="RenewalForm" :rules="rulesRenewalForm" :model="RenewalForm" label-width="80px">
                    <el-form-item :label="$t('table.RolloverAmount')" prop="RolloverAmount">
                        <el-input v-model="RenewalForm.RolloverAmount"></el-input>
                    </el-form-item>
                </el-form>

            </div>
            <div class="modal_foot">
                <div style="text-align: center;">
                    <el-button
                            type="primary"
                            size="mini"
                            @click="clickSubmitRenewalOff"
                    >{{$t('table.save')}}</el-button>
                    <el-button @click="clickCancelRenewalOff" size="mini">{{$t('table.cancel')}}</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            :title="$t('table.exemption')"
            :visible.sync="isExemption"
            direction="rtl"
            width="500px"
        >
            <div>
            <el-form ref="formExemption" :rules="rulesExemption" :model="formExemption" label-width="100px">
                <el-form-item :label="$t('table.DeductionDate')" prop="DeductionDate">
                <!--                        <el-input v-model="formWrittenOff.LastRepaymentDate"></el-input>-->
                <el-date-picker
                    style="width: 100%;"
                    v-model="formExemption.DeductionDate"
                    type="datetime"
                    placeholder="Select the date time">
                </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('table.DeductionAmount')" prop="DeductionAmount">
                <el-input type="number" v-model.number="formExemption.DeductionAmount"></el-input>
                </el-form-item>
                <el-form-item :label="$t('table.remarks')" prop="DeductionRemark">
                <el-input type="textarea" :rows="5" v-model="formExemption.DeductionRemark"></el-input>
                </el-form-item>
            </el-form>

            </div>
            <div class="modal_foot">
            <div style="text-align: center;">
                <el-button
                    type="primary"
                    size="mini"
                    @click="clickSubmitExemption"
                >{{$t('table.save')}}</el-button>
                <el-button @click="clickCancelExemption" size="mini">{{$t('table.cancel')}}</el-button>
            </div>
            </div>
        </el-dialog>

        <!-- 更多按钮弹窗 -->
        <el-dialog 
            :title="moreTitle==='LoanStatus' ? $t('table.LoanStatus') : $t('table.RepaymentStatus')"
            :visible.sync="moreDialog"
            width="70%">
            <el-table  
                v-loading="moreLoading"
                :data="moreData"
                element-loading-text="Loading"
                fit
                highlight-current-row
                style="padding-left: 20px;padding-top: 20px;">
            <el-table-column
                label="序号"  
                type="index" 
                width="50">
            </el-table-column>
            <el-table-column v-for="(widget, index) in moreTableList" :label="widget.name" :width="widget.width" align="center">
                <template slot-scope="scope">
                    {{ scope.row[widget.key] }}
                </template>
            </el-table-column>
            <template slot="empty" >
                <img src="@/assets/cus_images/nodata.png" class="cus-img">
                <p class="cus-nodata">{{ $t('table.nodata') }}</p>
            </template>
        </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import searchBar from '@/components/Page/searchBar.vue'
    import pageForm from '@/components/Page/form.vue'
    import Pagination from '@/components/Pagination';
    import BorrowingInfo from '@/components/BorrowingInfo';
    // import { CollectionWhiteList,CollectionAllot, CollectionRemarkWhiteList } from '@/api/whitelist'
    import { GetLoanAuditList, LoanAudit, ManualChargeOffs, Rollover, GetChangeDeductionInfo, ChangeDeductionAmount,
        QueryLoanPayment, QueryRepaymentList, ApplyRejectUpdateInReview, ApplyApprovedUpdateInReview } from '@/api/exchange';
    import { GetAppUserInfo } from '@/api/user'

    import i18n from '@/lang'
    import {deepCopy} from "@/utils"; // internationalization
    
    const searchConfig=[
        {key:['StartDate','EndDate'],name:['开始日期','结束日期'],type:'daterange',value:''},
        {key:'Name',name:'姓名',type:'input',value:''},
        {key:'Mobile',name:'手机号',type:'input',value:''},
        {key:'CardId',name:'Aadhaar',type:'input',value:''},
        {key:'OrderId',name:'订单',type:'input',value:''},
        {key:'Applyprogress',type:'select', name:'审核状态',value: [], multiple: true,options:[{
                value: '',
                label: '全部'
            },{
                value: 0,
                label: '审核中'
            },{
                value: 1,
                label: '审核通过'
            },{
                value: 2,
                label: '放款中'
            },{
                value: 3,
                label: '放款完成'
            },{
                value: 4,
                label: '拒绝放款'
            },{
                value: 5,
                label: '还款中'
            },{
                value: 6,
                label: '已完成'
            }]},
        {key:'ApplyResult',type:'select', name:'申请结果',value: [], multiple: true,options:[{
                value: 0,
                label: '审核中'
            },{
                value: 1,
                label: '审核通过'
            },{
                value: 2,
                label: '放款中'
            },{
                value: 3,
                label: '放款完成'
            },{
                value: 4,
                label: '拒绝放款'
            },{
                value: 5,
                label: '还款中'
            },{
                value: 6,
                label: '已完成'
            }]},
      {key:'Customer',type:'select', name:'新老客',value: '', multiple: false,options:[{
          value: '',
          label: '全部'
        },{
          value: 0,
          label: '新客'
        },{
          value: 1,
          label: '老客'
        }]}
    ];
    const tableConfig=[
        {key:'OrderId',name:'订单号',width:'120'},
        {key:'Name',name:'姓名',width:'150'},
        {key:'Mobile',name:'手机号',width:'150'},
        {key:'CardID',name:'Aadhaar 卡',width:'140'},
        {key:'RecordDate',name:'放款时间',width:'140'},
        {key:'AddTime',name:'申请时间',width:'150'},
        {key:'LoanMoney',name:'合同金额',width:'120'},
        {key:'ShouldRepaymentMoney',name:'应还金额',width:'120'},
        {key:'Customer',name:'申请结果'},
        {key:'ApplyResult_Ch',name:'申请结果'},
        {key:'Applyprogress_Ch',name:'审核进度'}
    ];
    const formConfig=[
        [{key:'ID',name:'用户ID',type:'input',disabled:true},{key:'Mobile',name:'手机号',type:'input',disabled:true}],
        [{key:'CardID',name:'Aadhaar 卡',type:'input',disabled:true},{key:'Addtime',name:'申请时间',type:'input',disabled:true}],
        [{key:'IsRegister',name:'是否注册',type:'select',disabled:true,configs:[{value: 1,label: '是'},{value: 0,label: '否'}]}]
    ];
    const RepaymentList = [
        {key:'ApiOrderAmount',name:'接口传参金额'},
        {key:'CreateDate',name:'创建时间'},
        {key:'PayoutId',name:'商户订单号'},
        {key:'RealOrderAmount',name:'真实付款金额'},
        {key:'RepaymentMethod',name:'支付方式'},
        {key:'Status',name:'支付状态'},
    ]
    const PaymentList = [
        {key:'OrderAmount',name:'接口传参金额'},
        {key:'PayoutId',name:'商户订单号'},
        {key:'Status',name:'支付状态'},
    ]

    //ng
    const _searchConfig=[
        {key:['StartDate','EndDate'],name:['StartDate','EndDate'],type:'daterange',value:''},
        {key:'Name',name:'Name',type:'input',value:''},
        {key:'Mobile',name:'Mobile',type:'input',value:''},
        {key:'CardId',name:'CardId',type:'input',value:''},
      {key:'OrderId',name:'OrderId',type:'input',value:''},
        {key:'Applyprogress',type:'select', name:'Applyprogress',value: [], multiple: true,options:[{
                value: '',
                label: 'all'
            },{
                value: 0,
                label: 'Under review'
            },{
                value: 1,
                label: 'The audit is approved'
            },{
                value: 2,
                label: 'in the loan'
            },{
                value: 3,
                label: 'The loan is complete'
            },{
                value: 4,
                label: 'Refuse to make a loan'
            },{
                value: 5,
                label: 'repayments'
            },{
                value: 6,
                label: 'Completed'
            }]},
        {key:'ApplyResult',type:'select', name:'ApplyResult',value: [], multiple: true,options:[{
                value: 0,
                label: 'Under review'
            },{
                value: 1,
                label: 'Approved'
            },{
                value: 2,
                label: 'On loan'
            },{
                value: 3,
                label: 'Loan completion'
            },{
                value: 4,
                label: 'Refuse to lend'
            },{
                value: 5,
                label: 'Repayment in progress'
            },{
                value: 6,
                label: 'Completed'
            }]},
      {key:'Customer',type:'select', name:'New and old guests',value: '', multiple: false,options:[{
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
    const _tableConfig=[
        {key:'OrderId',name:'OrderId',width:'120', nameCn: '订单号'},
        {key:'Name',name:'Name',width:'150', nameCn: '姓名'},
        {key:'Mobile',name:'Mobile',width:'150', nameCn: '手机号'},
        {key:'CardID',name:'Aadhaar',width:'140', nameCn: '身份证'},
        {key:'RecordDate',name:'RecordDate',width:'140', nameCn: '放款时间'},
        {key:'AddTime',name:'AddTime',width:'150', nameCn: '申请时间'},
        {key:'LoanMoney',name:'LoanMoney',width:'120', nameCn: '申请借款金额'},
        {key:'ShouldRepaymentMoney',name:'ShouldRepaymentMoney',width:'120'},
        {key:'Customer_En',name:'Customer'},
        {key:'ApplyResult',name:'ApplyResult', nameCn: '申请结果'},
        {key:'Applyprogress',name:'Applyprogress', nameCn: '审核进度'}
    ];
    const _formConfig=[
        [{key:'UserID',name:'UserID',type:'input',disabled:true},{key:'Mobile',name:'Mobile',type:'input',disabled:true}],
        [{key:'CardId',name:'Aadhaar',type:'input',disabled:true},{key:'AddTime',name:'AddTime',type:'input',disabled:true}],
        [{key:'IsRegister',name:'IsRegister',type:'select',disabled:true,configs:[{value: 1,label: 'YES'},{value: 0,label: 'NO'}]}]
    ];
    const appUserInfoNameConfig = {
        AADHAAR_FRONT: {nameCn: 'Aadhaar正面', nameEn: 'AADHAAR_FRONT'},
        AADHAAR_BACK: {nameCn: 'Aadhaar反面', nameEn: 'AADHAAR_BACK'},
        PAN_FRONT: {nameCn: 'PAN卡图片', nameEn: 'PAN_FRONT'},
        LIVENESS: {nameCn: '人脸识别图片', nameEn: 'LIVENESS'},
        Name: {nameCn: '姓名', nameEn: 'Name'},
        Sex: {nameCn: '性别', nameEn: 'Sex'},
        Age: {nameCn: '年龄', nameEn: 'Age'},
        Aadhaar: {nameCn: '阿大哈卡', nameEn: 'Aadhaar'},
        BankNo: {nameCn: '银行账户', nameEn: 'BankNo'},
        BankName: {nameCn: '所属银行', nameEn: 'BankName'},
        BankUserName: {nameCn: '用户银行卡姓名', nameEn: 'BankUserName'},
        RegDate: {nameCn: '注册时间', nameEn: 'RegDate'},
        AadhaarAddress: {nameCn: '阿大哈卡地址', nameEn: 'AadhaarAddress'},
        Mobile: {nameCn: '手机号', nameEn: 'Mobile'},
      ContactDatas: {nameCn: '紧急联系人', nameEn: 'Emergency contact'},
        ApplyLocation: {nameCn: 'GPS地址', nameEn: 'ApplyLocation'},
        RegletReglng: {nameCn: '注册经纬度', nameEn: 'RegletReglng'},
        RegType: {nameCn: '注册终端', nameEn: 'RegType'},
        ChannelNo: {nameCn: '渠道号', nameEn: 'ChannelNo'},
        Email: {nameCn: '个人电子邮箱', nameEn: 'Email'},
        Company: {nameCn: '公司名称', nameEn: 'Company'},
        Occupation: {nameCn: '职业', nameEn: 'Occupation'},
        PersonalIncome: {nameCn: '个人收入', nameEn: 'PersonalIncome'},
        // PersonalIncome: {nameCn: '-紧急联系人信息', nameEn: 'PersonalIncome'},
        BankCert: {nameCn: '银行卡认证', nameEn: 'BankCert'},
        kycCert: {nameCn: '人脸识别认证', nameEn: 'kycCert'},
        personCert: {nameCn: '个人信息认证', nameEn: 'personCert'},
        ContactCert: {nameCn: '紧急联系人认证', nameEn: 'ContactCert'},
    };
    const _RepaymentList = [
        {key:'ApiOrderAmount',name:'ApiOrderAmount'},
        {key:'CreateDate',name:'CreateDate'},
        {key:'PayoutId',name:'PayoutId'},
        {key:'RealOrderAmount',name:'RealOrderAmount'},
        {key:'RepaymentMethod',name:'RepaymentMethod'},
        {key:'Status',name:'Status'},
    ]
    const _PaymentList = [
        {key:'OrderAmount',name:'OrderAmount'},
        {key:'PayoutId',name:'PayoutId'},
        {key:'Status',name:'Status'},
    ]
    export default {
        components:{ searchBar,pageForm,Pagination,BorrowingInfo },
        data() {
            var checkNumber = (rule, value, callback) => {
                let reg = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/;
                if (!value) {
                    return callback(new Error('展期金额不能为空'));
                }else{
                    if(!reg.test(value)){
                        return callback(new Error('请输入正确的金额格式'));
                    }else{
                        callback();
                    }
                }
            };
            return {
                searchConfig:searchConfig,
                tableConfig:tableConfig,
                tableConfigEn:_tableConfig,
                formConfig:formConfig,
                appUserInfoNameConfig,
                list: null,
                listLoading: false,
                listQuery: {
                    pageIndex: 1,
                    pageSize: 20
                },
                total: 10,
                ifShowDrawer: false,
                temp:[], //详情页数据
                showDetail: false,
                showAppUserImgDetail: false,
                selectedItem: null,
                selectedRow: null,
                registrationDrawer: false,
                registrationForm: {
                    CardID: '',
                    Mobile: '',
                    IsRegister: '否',
                    Remark: '',
                    ID: null
                },
                registrationRules: {
                    Mobile: [
                        { required: false, message: '请输入手机号', trigger: 'change' },
                    ],
                    CardID: [
                        { required: false, message: '请输入身份证号', trigger: 'change' },
                    ],
                    IsRegister: [
                        { required: true, message: '请选择是否注册', trigger: 'change' }
                    ],
                    Remark: [
                        { required: true, message: '请输入备注', trigger: 'change' },
                    ]
                },
                appUserInfo: null,
                appUserImgUrl: null,
                JKSHItem: null,
                isExemption: false,
                formExemption: {
                    DeductionAmount: null,
                    DeductionDate: null,
                    DeductionRemark: null,
                },
                rulesExemption: {
                    // 减免金额  减免时间 减免备注
                    DeductionDate: [
                    { required: true, message: 'Please select the exemption time', trigger: 'blur' },
                    ],
                    DeductionAmount: [
                    { required: true, message: 'Please enter the deduction amount', trigger: 'blur' },
                    ],
                    DeductionRemark: [
                    { required: true, message: 'Please enter a note', trigger: 'blur' },
                    ],
                },
                isWrittenOff: false,
                exemptionItem: null,
                formWrittenOff: {
                    LastRepaymentDate: null,
                    LastRepaymentMoney: ''
                },
                rulesWrittenOff: {
                    //还款金额   还款时间
                    LastRepaymentDate: [
                        { required: true, message: '请选择还款时间', trigger: 'blur' },
                    ],
                    LastRepaymentMoney: [
                        { required: true, message: '请输入还款金额', trigger: 'blur' },
                    ]
                },

                RenewalForm: {
                    RolloverAmount: null,
                },
                rulesRenewalForm: {
                    RolloverAmount: [
                        { required: true, validator: checkNumber, trigger: 'blur' },
                    ],
                },
                ZQItem: null,
                renewalShow: false,  //展期显示

                moreDialog: false,
                moreItem: '',
                moreTitle:'',
                moreTableList: [],
                moreData:[],
                moreLoading: false,
                PaymentList: PaymentList,   //放款状态列表 
                RepaymentList: RepaymentList,//还款状态列表
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
            handleCommand(command) {  
                this.moreData = [];
                if(command === 'LoanStatus'){
                    this.moreDialog = true;
                    this.moreTitle = 'LoanStatus';
                    this.moreTableList = this.PaymentList;
                    this.moreLoading = true;
                    QueryLoanPayment({
                        OrderId: this.moreItem.OrderId,
                        Mobile: this.moreItem.Mobile
                    }).then(res => {
                        this.moreData = res.data;
                        this.moreLoading = false;
                    }).catch(()=>{
                        this.moreLoading = false;
                    })
                }
                else if(command === 'RepaymentStatus'){
                    this.moreDialog = true;
                    this.moreTitle = 'RepaymentStatus';
                    this.moreTableList = this.RepaymentList;
                    this.moreLoading = true;
                    QueryRepaymentList({
                        OrderId: this.moreItem.OrderId,
                        Mobile: this.moreItem.Mobile
                    }).then(res => {
                        this.moreData = res.data;
                        this.moreLoading = false;
                    }).catch(()=>{
                        this.moreLoading = false;
                    })
                }
                else if(command === 'EditStatus'){
                    this.$confirm('此操作将拒绝支付改为审核中, 是否继续?', '提示', {
                        confirmButtonText: i18n.t('permission.confirm'),
                        cancelButtonText: i18n.t('permission.cancel'),
                        type: 'warning'
                    }).then(() => {
                        ApplyRejectUpdateInReview({
                            OrderId: this.moreItem.OrderId,
                            Mobile: this.moreItem.Mobile
                        }).then(res => {
                            this.$message({
                                type: 'success',
                                message: i18n.t('information.Success')
                            });
                        }).catch( () => {
                            this.$message({
                                type: 'error',
                                message: i18n.t('information.Failed')
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'success',
                            message: i18n.t('permission.cancel')
                        });      
                    });
                }
                else if(command === 'ChangeStatus'){
                    this.$confirm('此操作将审核通过且支付失败改为审核中, 是否继续?', '提示', {
                        confirmButtonText: i18n.t('permission.confirm'),
                        cancelButtonText: i18n.t('permission.cancel'),
                        type: 'warning'
                    }).then(() => {
                        ApplyApprovedUpdateInReview({
                            OrderId: this.moreItem.OrderId,
                            Mobile: this.moreItem.Mobile
                        }).then(res => {
                            this.$message({
                                type: 'success',
                                message: i18n.t('information.Success')
                            });
                        }).catch( () => {
                            this.$message({
                                type: 'error',
                                message: i18n.t('information.Failed')
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'success',
                            message: i18n.t('permission.cancel')
                        });      
                    });
                }
            },
            moreDropdoen(row,index){
                this.moreItem = row;
            },
            switchLanguage(val) {//原始数据 应用数据 en/zh
                if(val=='zh'){//切换成中文
                    this.searchConfig=deepCopy(searchConfig);
                    this.tableConfig=deepCopy(tableConfig);
                    this.formConfig=deepCopy(formConfig);
                    this.PaymentList=deepCopy(PaymentList);
                    this.RepaymentList=deepCopy(RepaymentList);
                }else if(val=='en'){//切换成英文
                    this.searchConfig=deepCopy(_searchConfig);
                    this.tableConfig=deepCopy(_tableConfig);
                    this.formConfig=deepCopy(_formConfig);
                    this.PaymentList=deepCopy(_PaymentList);
                    this.RepaymentList=deepCopy(_RepaymentList);
                }
            },
            fetchData() {
                this.listLoading = true;
                let searchData = this.$refs.searchbar.getData();
                this.listQuery = Object.assign(this.listQuery, searchData);
                GetLoanAuditList(this.listQuery).then(response => {
                    this.list = response.datas;
                    this.total = response.tolal;
                    this.listLoading = false;
                })
            },
            handleDetail(row){
                this.temp=row;
                this.ifShowDrawer=true;
            },
            clickViewDetail(row, index) {
                this.selectedItem = row;
                this.showDetail = true;
                // this.appUserInfo = row;
                //   console.log('app用户：', row);
                //   this.getAppUserInfo();
            },
            closeDetails() {
                this.showDetail = false;
            },
            clickViewImgDetail(url) {
                this.appUserImgUrl = url;
                this.showAppUserImgDetail = true;
            },
            getAppUserInfo() {
                const data = {Id: this.selectedItem.UserId};
                GetAppUserInfo(data).then(res => {
                    console.warn(res);
                    this.appUserInfo = res.Data;
                });
            },
            handleagree(row,index) {
                LoanAudit({
                    "Id": row.Id,
                    "Type": 1
                }).then(response => {
                    this.$message({
                        type: 'success',
                        message: i18n.t('information.SubSuccess')
                    })
                    this.fetchData()
                }).catch(err => {
                    console.log(err)
                    this.$message({
                        type: 'info',
                        message: i18n.t('information.SubFailed')
                    })
                })
            },
            clickReject(row,index) {
                LoanAudit({
                    "Id": row.Id,
                    "Type": 0
                }).then(response => {
                    this.$message({
                        type: 'success',
                        message: i18n.t('information.SubSuccess')
                    })
                    this.fetchData()
                }).catch(err => {
                    console.log(err)
                    this.$message({
                        type: 'info',
                        message: i18n.t('information.SubFailed')
                    })
                })
            },
            clickWrittenOff(row,index) {
                this.isWrittenOff = true;
                this.JKSHItem = row;
                this.formWrittenOff.LastRepaymentDate = new Date();
                this.formWrittenOff.LastRepaymentMoney = row.ShouldRepaymentMoney;
            },
            clickExemption(row) {
                this.isExemption = true;
                this.exemptionItem = row;
                const data = {
                    ID: this.exemptionItem.Id,
                    OrderId: this.exemptionItem.OrderId
                };
                GetChangeDeductionInfo(data).then(res => {
              this.formExemption.DeductionAmount = res.DeductionAmount;
              this.formExemption.DeductionDate = res.DeductionDate === '0001-01-01 00:00:00' ? new Date() : res.DeductionDate;
              this.formExemption.DeductionRemark = res.DeductionRemark;
                });
            },

            clickRenewalTime(row){
                this.renewalShow = true;
                this.ZQItem = row;
            },
            clickSubmitRenewalOff(){
                const row = this.ZQItem;
                this.$refs.RenewalForm.validate((valid) => {
                    if (valid) {
                        Rollover({
                            Id: row.Id,
                            OrderId: row.OrderId,
                            Mobile: row.Mobile,
                            RolloverAmount: this.RenewalForm.RolloverAmount
                        }).then(response => {
                            this.$message({
                                type: 'success',
                                message: i18n.t('information.SubSuccess')
                            });
                            this.clickCancelRenewalOff();
                            this.fetchData();
                        }).catch(err => {
                            console.log(err);
                            this.$message({
                                type: 'info',
                                message: i18n.t('information.SubFailed')
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }  

                });
            },
            clickCancelRenewalOff(){
                this.renewalShow = false;
                // this.RenewalForm.RolloverAmount = '';
                this.$refs.RenewalForm.resetFields();
                this.$refs.RenewalForm.clearValidate();
            },

            clickCancelExemption() {
                this.isExemption = false;
                this.formExemption.DeductionAmount = null;
                this.formExemption.DeductionDate = null;
                this.formExemption.DeductionRemark = '';
            },
            clickSubmitExemption() {
                const row = this.exemptionItem;
                this.$refs.formExemption.validate((valid) => {
                if (valid) {
                    const timeStr = moment(this.formExemption.DeductionDate).format('YYYY-MM-DD HH:mm:ss');
                    ChangeDeductionAmount({
                    OrderId: row.OrderId,
                    DeductionDate: timeStr,
                    DeductionAmount: this.formExemption.DeductionAmount,
                    DeductionRemark: this.formExemption.DeductionRemark
                    }).then(response => {
                    this.$message({
                        type: 'success',
                        message: i18n.t('information.SubSuccess')
                    });
                    this.clickCancelExemption();
                    this.fetchData();
                    }).catch(err => {
                    console.log(err);
                    this.$message({
                        type: 'info',
                        message: i18n.t('information.SubFailed')
                    });
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            clickSubmitWrittenOff() {
                const row = this.JKSHItem;
                // console.warn(this.formWrittenOff);
                this.$refs.formWrittenOff.validate((valid) => {
                    if (valid) {
                        const timeStr = moment(this.formWrittenOff.LastRepaymentDate).format('YYYY-MM-DD HH:mm:ss');
                        ManualChargeOffs({
                            Id: row.Id,
                            OrderId: row.OrderId,
                            Mobile: row.Mobile,
                            LastRepaymentDate: timeStr,
                            LastRepaymentMoney: this.formWrittenOff.LastRepaymentMoney
                        }).then(response => {
                            this.$message({
                                type: 'success',
                                message: i18n.t('information.SubSuccess')
                            });
                            this.clickCancelWrittenOff();
                            this.fetchData();
                        }).catch(err => {
                            console.log(err);
                            this.$message({
                                type: 'info',
                                message: i18n.t('information.SubFailed')
                            });
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            clickCancelWrittenOff() {
                this.isWrittenOff = false;
                this.formWrittenOff.LastRepaymentDate = null;
                this.formWrittenOff.LastRepaymentMoney = '';
            },
            collection(row){
                this.listLoading = true
                // CollectionAllot({
                //     "WhiteIDList": [row.ID],
                //     "CollectionMemberID": 0
                // }).then(response => {
                //     this.$message({
                //         type: 'success',
                //         message: i18n.t('information.SubSuccess')
                //     })
                //     this.fetchData()
                // }).catch(err => {
                //     console.log(err)
                //     this.$message({
                //         type: 'info',
                //         message: i18n.t('information.SubFailed')
                //     })
                // })
            },
            // 登记
            registration(row, index) {
                this.selectedRow = row;
                console.log(row);
                this.registrationForm.Mobile = row.Mobile;
                this.registrationForm.CardID = row.CardID;
                this.registrationForm.ID = row.ID;
                this.registrationForm.Remark = row.Remark;
                this.registrationForm.IsRegister = row.IsCallPhone.indexOf('未拨打') >= 0 ? '否' : '是';
                this.registrationDrawer = true;
            },
            clickCancelRegistration() {
                this.registrationDrawer = false;
                this.$refs.registrationForm.resetFields();
            },
            //重置
            resetInput(){
                this.$refs.searchbar.resetInput();
                const Applyprogress = this.searchConfig.find(item => item.key === 'Applyprogress');
                Applyprogress.value = [];
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
        padding-right: 20px;
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
