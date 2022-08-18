<template>
  <div>
    <el-dialog
        :title="$t('table.detail')"
        :visible="true"
        direction="rtl"
        width="800px"
        @close="clickClose()"
    >
      <el-dialog
          width="600px"
          :title="$t('table.pictureDetails')"
          :visible.sync="showAppUserImgDetail"
          append-to-body>
        <img :src="appUserImgUrl" alt="picture" width="100%">
      </el-dialog>
      <div class="detail-order-main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('table.detail')" name="detail">
            <div v-if="selectedItem">
              <div class="row">
                <div class="col-50" v-for="tbl in tableConfigEn" :key="tbl.key">
                  <div class="row m-b-20">
                    <div class="col-auto">
                      <div class="detail-label">
                        <div v-if="language === 'en'">{{tbl.name}}</div>
                        <div v-if="language === 'zh'">{{tbl.nameCn}}</div>
                      </div>
                    </div>
                    <div class="col">
                      {{selectedItem[tbl.name]}}
                    </div>
                  </div>
                </div>
              </div>
              <hr class="m-b-20">
              <div class="row" v-if="appUserInfo">
                <!--          <div class="col-50">-->
                <!--            <div class="row m-b-20">-->
                <!--              <div class="col-auto">-->
                <!--                <div class="detail-label">-->
                <!--                  <div v-if="language === 'en'">{{appUserInfoNameConfig.Name.nameEn}}</div>-->
                <!--                  <div v-if="language === 'zh'">{{appUserInfoNameConfig.Name.nameCn}}</div>-->
                <!--                </div>-->
                <!--              </div>-->
                <!--              <div class="col">-->
                <!--                {{appUserInfo.Name}}-->
                <!--              </div>-->
                <!--            </div>-->
                <!--          </div>-->
                <!--          <div class="col-50">-->
                <!--            <div class="row m-b-20">-->
                <!--              <div class="col-auto">-->
                <!--                <div class="detail-label">-->
                <!--                  <div v-if="language === 'en'">{{appUserInfoNameConfig.Sex.nameEn}}</div>-->
                <!--                  <div v-if="language === 'zh'">{{appUserInfoNameConfig.Sex.nameCn}}</div>-->
                <!--                </div>-->
                <!--              </div>-->
                <!--              <div class="col">-->
                <!--                {{appUserInfo.Sex}}-->
                <!--              </div>-->
                <!--            </div>-->
                <!--          </div>-->
                <!--          <hr>-->
                <template v-for="(value, name) in appUserInfo">
                  <div class="col-50" v-if="appUserInfoNameConfig[name] && 'ContactDatas' !== name">
                    <div class="row m-b-20">
                      <div class="col-auto">
                        <div class="detail-label">
                          <div v-if="language === 'en'">{{appUserInfoNameConfig[name]?appUserInfoNameConfig[name].nameEn:''}}</div>
                          <div v-if="language === 'zh'">{{appUserInfoNameConfig[name]?appUserInfoNameConfig[name].nameCn:''}}</div>
                        </div>
                      </div>
                      <div class="col">
                        <div v-if="!['AADHAAR_FRONT', 'AADHAAR_BACK', 'PAN_FRONT', 'LIVENESS', 'ContactDatas'].includes(name)">{{value}}</div>
                        <div v-else>
                          <div v-if="'ContactDatas' !== name">
                            <img :src="value" alt="img" @click="clickViewImgDetail(value)">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-100" style="color: red" v-else-if="appUserInfoNameConfig[name] && 'ContactDatas' === name">
                    <hr class="m-b-20">
                    <div class="detail-label">
                      <div v-if="language === 'en'">{{appUserInfoNameConfig[name]?appUserInfoNameConfig[name].nameEn:''}}</div>
                      <div v-if="language === 'zh'">{{appUserInfoNameConfig[name]?appUserInfoNameConfig[name].nameCn:''}}</div>
                    </div>
                    <div class="row m-b-20" style="padding-left: 10px;margin-top: 10px" v-for="(con, index) in value">
                      <div class="col-auto">{{index + 1}}.</div>
                      <div class="col">
                        {{ $t('table.Name') }}：{{con.Name}}
                        {{ $t('table.Mobile') }}：{{con.Mobile}}
                        {{ $t('table.Relation') }}：{{con.Relation}}
                      </div>
                    </div>
                    <hr class="m-b-20">
                  </div>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('table.contacts')" name="contacts" v-if="false">
            <div style="margin-bottom: 10px;">
              {{ $t('table.Myself') }}:
              {{selectedItem.Mobile}}
            </div>
            <div style="color: red;">
              <div style="margin-bottom: 10px;">
                {{ $t('table.ContactDatas') }}
              </div>
              <div class="row" style="margin-bottom: 10px;" v-for="(con, index) in ContactDatas">
                <!--              <div class="col-auto">{{index + 1}}.</div>-->
                <div class="col">
                  {{ $t('table.Name') }}：{{con.Name}}
                  {{ $t('table.Mobile') }}：{{con.Mobile}}
                  {{ $t('table.Relation') }}：{{con.Relation}}
                </div>
              </div>
            </div>
            <div style="margin-bottom: 10px;">
              {{$t('table.contactsInfo')}}
            </div>
            <div style="margin-bottom: 10px;" v-for="(item, index) in contacts" :key="index">
              <span>
                {{$t('table.Name')}}: {{item.name}}
              </span>
              <span style="margin-left: 30px">
                {{$t('table.Mobile')}}: {{item.phone}}
              </span>
              <span style="margin-left: 30px" v-if="item.relation">
                {{$t('table.Relation')}}: {{item.relation}}
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="modal_foot">
        <div style="text-align: center;">
          <!-- 		      <el-button
                          type="primary"
                          @click="handleSubmit"
                        >保存</el-button> -->
          <el-button @click="clickClose()">{{$t('tagsView.close')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetAppUserInfo, GetMailList } from '@/api/user';

const _tableConfig=[
  {key:'OrderId',name:'OrderId',width:'120', nameCn: '订单号'},
  {key:'Name',name:'Name',width:'150', nameCn: '姓名'},
  {key:'Mobile',name:'Mobile',width:'150', nameCn: '手机号'},
  {key:'CardID',name:'Aadhaar',width:'140', nameCn: '身份证'},
  {key:'AddTime',name:'AddTime',width:'150', nameCn: '申请时间'},
  {key:'LoanMoney',name:'LoanMoney',width:'120', nameCn: '申请借款金额'},
  {key:'ShouldRepaymentMoney',name:'ShouldRepaymentMoney', nameCn: '应还金额',width:'120'},
  {key:'ApplyResult',name:'ApplyResult', nameCn: '申请结果'},
  {key:'Applyprogress',name:'Applyprogress', nameCn: '审核进度'}
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
export default {
  name: 'BorrowingInfo',
  props: {
    selectedItem: {
      type: Object,
      default: null
    },
    showDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appUserInfoNameConfig,
      tableConfigEn:_tableConfig,
      showAppUserImgDetail: false,
      appUserInfo: null,
      appUserImgUrl: null,
      contacts: null, // 通讯录
      ContactDatas: null,
      activeName: 'detail'
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  mounted() {
    console.warn(222, this.selectedItem);
    this.$nextTick(() => {
      this.getAppUserInfo();
      this.getMailList();
    });
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    clickViewImgDetail(url) {
      this.appUserImgUrl = url;
      this.showAppUserImgDetail = true;
    },
    getMailList() {
      let Mobile = '';
      if (this.selectedItem.Mobile.indexOf('91') === 0 && this.selectedItem.Mobile.length === 12) {
        Mobile = this.selectedItem.Mobile.substr(2);
      } else {
        Mobile = this.selectedItem.Mobile;
      }
      const data = { Mobile };
      GetMailList(data).then(res => {
        this.contacts = [];
        this.contacts = res.MailList;
      });
      // this.contacts = [];
      // for (let i = 0; i < 20; i++) {
      //   this.contacts.push({
      //     "name": "string" + i,
      //     "phone": "string" + i
      //   });
      // }
    },
    getAppUserInfo() {
      const data = {Id: this.selectedItem.UserId};
      GetAppUserInfo(data).then(res => {
        const data = res.Data;
        this.appUserInfo = {
          Name: data.Name,
          Sex: data.Sex,
          Age: data.Age,
          Occupation: data.Occupation,
          Mobile: data.Mobile,
          Email: data.Email,
          Company: data.Company,
          PersonalIncome: data.PersonalIncome,
          ContactDatas: data.ContactDatas,
          Aadhaar: data.Aadhaar,
          BankNo: data.BankNo,
          BankName: data.BankName,
          BankUserName: data.BankUserName,
          AadhaarAddress: data.AadhaarAddress,
          RegDate: data.RegDate,
          RegType: data.RegType,
          ChannelNo: data.ChannelNo,
          ApplyLocation: data.ApplyLocation,
          RegletReglng: data.RegletReglng,
          BankCert: data.BankCert,
          BankCert_Ch: data.BankCert_Ch,
          kycCert: data.kycCert,
          kycCert_Ch: data.kycCert_Ch,
          personCert: data.personCert,
          personCert_Ch: data.personCert_Ch,
          ContactCert: data.ContactCert,
          ContactCert_Ch: data.ContactCert_Ch,
          AADHAAR_FRONT: data.AADHAAR_FRONT,
          AADHAAR_BACK: data.AADHAAR_BACK,
          PAN_FRONT: data.PAN_FRONT,
          LIVENESS: data.LIVENESS,
          // ...data
        };
        this.ContactDatas = data.ContactDatas;
        // console.log(this.appUserInfo)
      });
    },
    clickClose() {
      this.$emit('closeDetails');
    }
  }
}
</script>

<style scoped lang="scss">
.detail-order-main {
  padding: 0px 30px 10px;
  .m-b-20 {
    margin-bottom: 20px;
  }
  .row {
    margin-bottom: 20px;
    padding-right: 10px;
    .detail-label {
      width: 150px;
      padding-left: 10px;
    }
    img {
      max-width: 100%;
      cursor: pointer;
    }
  }
}
</style>
