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
                        {{ $t('table.Name') }}???{{con.Name}}
                        {{ $t('table.Mobile') }}???{{con.Mobile}}
                        {{ $t('table.Relation') }}???{{con.Relation}}
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
                  {{ $t('table.Name') }}???{{con.Name}}
                  {{ $t('table.Mobile') }}???{{con.Mobile}}
                  {{ $t('table.Relation') }}???{{con.Relation}}
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
                        >??????</el-button> -->
          <el-button @click="clickClose()">{{$t('tagsView.close')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetAppUserInfo, GetMailList } from '@/api/user';

const _tableConfig=[
  {key:'OrderId',name:'OrderId',width:'120', nameCn: '?????????'},
  {key:'Name',name:'Name',width:'150', nameCn: '??????'},
  {key:'Mobile',name:'Mobile',width:'150', nameCn: '?????????'},
  {key:'CardID',name:'Aadhaar',width:'140', nameCn: '?????????'},
  {key:'AddTime',name:'AddTime',width:'150', nameCn: '????????????'},
  {key:'LoanMoney',name:'LoanMoney',width:'120', nameCn: '??????????????????'},
  {key:'ShouldRepaymentMoney',name:'ShouldRepaymentMoney', nameCn: '????????????',width:'120'},
  {key:'ApplyResult',name:'ApplyResult', nameCn: '????????????'},
  {key:'Applyprogress',name:'Applyprogress', nameCn: '????????????'}
];
const appUserInfoNameConfig = {
  AADHAAR_FRONT: {nameCn: 'Aadhaar??????', nameEn: 'AADHAAR_FRONT'},
  AADHAAR_BACK: {nameCn: 'Aadhaar??????', nameEn: 'AADHAAR_BACK'},
  PAN_FRONT: {nameCn: 'PAN?????????', nameEn: 'PAN_FRONT'},
  LIVENESS: {nameCn: '??????????????????', nameEn: 'LIVENESS'},
  Name: {nameCn: '??????', nameEn: 'Name'},
  Sex: {nameCn: '??????', nameEn: 'Sex'},
  Age: {nameCn: '??????', nameEn: 'Age'},
  Aadhaar: {nameCn: '????????????', nameEn: 'Aadhaar'},
  BankNo: {nameCn: '????????????', nameEn: 'BankNo'},
  BankName: {nameCn: '????????????', nameEn: 'BankName'},
  BankUserName: {nameCn: '?????????????????????', nameEn: 'BankUserName'},
  RegDate: {nameCn: '????????????', nameEn: 'RegDate'},
  AadhaarAddress: {nameCn: '??????????????????', nameEn: 'AadhaarAddress'},
  Mobile: {nameCn: '?????????', nameEn: 'Mobile'},
  ContactDatas: {nameCn: '???????????????', nameEn: 'Emergency contact'},
  ApplyLocation: {nameCn: 'GPS??????', nameEn: 'ApplyLocation'},
  RegletReglng: {nameCn: '???????????????', nameEn: 'RegletReglng'},
  RegType: {nameCn: '????????????', nameEn: 'RegType'},
  ChannelNo: {nameCn: '?????????', nameEn: 'ChannelNo'},
  Email: {nameCn: '??????????????????', nameEn: 'Email'},
  Company: {nameCn: '????????????', nameEn: 'Company'},
  Occupation: {nameCn: '??????', nameEn: 'Occupation'},
  PersonalIncome: {nameCn: '????????????', nameEn: 'PersonalIncome'},
  // PersonalIncome: {nameCn: '-?????????????????????', nameEn: 'PersonalIncome'},
  BankCert: {nameCn: '???????????????', nameEn: 'BankCert'},
  kycCert: {nameCn: '??????????????????', nameEn: 'kycCert'},
  personCert: {nameCn: '??????????????????', nameEn: 'personCert'},
  ContactCert: {nameCn: '?????????????????????', nameEn: 'ContactCert'},
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
      contacts: null, // ?????????
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
