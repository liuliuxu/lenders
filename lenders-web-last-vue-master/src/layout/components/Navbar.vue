<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
	   <template>
		    <lang-select class="right-menu-item hover-effect" />
		</template>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
               {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item
              divided
              @click.native="modifyPassword"
          >
            <span style="display:block;">{{ $t('navbar.modifyPassword') }}</span>
          </el-dropdown-item>
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-dialog
          :title="$t('navbar.modifyPassword')"
          :visible.sync="modifyPasswordShowModal"
          direction="rtl"
          width="500px"
      >
        <div>
          <el-form ref="formPas" :rules="rulesPas" :model="formPas" label-width="150px">
            <el-form-item :label="$t('table.oldPwd')" prop="oldPwd">
              <el-input v-model="formPas.oldPwd"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.newPwd')" prop="newPwd">
              <el-input v-model="formPas.newPwd"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal_foot">
          <div style="text-align: center;">
            <el-button
                type="primary"
                size="mini"
                @click="handleSubmitSavePas"
            >{{$t('table.save')}}</el-button>
            <el-button @click="clickCancelSavePas" size="mini">{{$t('table.cancel')}}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import {updateUserPwd} from '@/api/user';
import i18n from "@/lang";

export default {
  components: {
    Breadcrumb,
    Hamburger,
	LangSelect
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      modifyPasswordShowModal: false,
      formPas: {
        oldPwd: '',
        newPwd: ''
      },
      rulesPas: {
        oldPwd: [
          { required: true, message: 'Please enter the old password', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: 'Please enter a new password', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      //await this.$store.dispatch('user/logout')
	  this.$store.dispatch('user/resetToken').then(()=>{
	  	this.$router.push(`/login?redirect=${this.$route.fullPath}`)
	  })
    },
    modifyPassword() {
      this.modifyPasswordShowModal = true;
    },
    handleSubmitSavePas() {
      console.log(this.formPas);
      this.$refs.formPas.validate((valid) => {
        if (valid) {
          console.log(this.formPas);
          updateUserPwd({oldpwd: this.formPas.oldPwd, newpwd: this.formPas.newPwd}).then(response => {
            this.modifyPasswordShowModal = false;
            this.$message({
              type: 'success',
              message: i18n.t('information.SubSuccess')
            });
            this.logout();
          }).catch(err => {
            this.$message({
              type: 'info',
              message: i18n.t('information.SubFailed')
            })
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clickCancelSavePas() {
      this.modifyPasswordShowModal = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
