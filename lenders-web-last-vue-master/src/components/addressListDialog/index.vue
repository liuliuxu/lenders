<template>
    <el-dialog
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose">
        <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{textAlign:'center'}"
            :cell-style="{textAlign:'center'}">
            <el-table-column
                type="index"
                :label="language==='en'?'Number':'序号'"
                width="100">
            </el-table-column>
            <el-table-column
                :label="language==='en'?'Name':'姓名'"
                prop="name">
            </el-table-column>
            <el-table-column
                :label="language==='en'?'Phone':'电话'"
                prop="phone">
            </el-table-column>
            <!-- <el-table-column v-for="(i, index) in tableConfig"
                :type="i.type"
                :label="i.name"
                :width="i.width"
                :prop="i.key">
            </el-table-column> -->
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="20"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </el-dialog>
    
</template>

<script>
import { GetMailUpLoadList } from '@/api/user';
import {deepCopy} from "@/utils";

const tableConfig=[
    // {key:'Number',name:'序号',type: 'index',width:'50'},
    {key:'name',name:'姓名'},
    {key:'phone',name:'电话'},
];
const _tableConfig=[
    // {key:'Number',name:'Number',type: 'index',width:'50'},
    {key:'name',name:'Name'},
    {key:'phone',name:'Phone'},
];
export default {
    props:{
        list: {},
        parentType: '',
    },
    computed: {
        language() {
            return this.$store.getters.language
        },
        
    },
    watch: {
		list: {
            handler (val, oldVal) {
                this.clickAddressList(val);
            },
            deep: true,
        },
        language: function (val, oldVal) {
            this.switchLanguage(val)
        },
        
	},
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 20,  //每页显示多少条
            pageIndex: 1,  //当前页码

            rowdata:{},
        }
    },
    created() {
        this.switchLanguage(this.language)
    },
    methods:{
        getRow(val){
            this.rowdata = val;
        },
        switchLanguage(val) {//原始数据 应用数据 en/zh
            if(val=='zh'){//切换成中文
                this.tableConfig = deepCopy(tableConfig);
            }else if(val=='en'){//切换成英文
                this.tableConfig = deepCopy(_tableConfig);
            }
        },
        clickAddressList(row){
            if(this.parentType === 'DF1'){
                this.pageIndex = this.pageIndex - 1;
            }
            GetMailUpLoadList({"Mobile": row.Mobile || this.rowdata.Mobile, 'pageSize':this.pageSize, pageIndex: this.pageIndex}).then( res => {
            	this.tableData = res.data;
            	this.dialogVisible = true;
                this.total = res.tolal;
            })
        },
        handleClose(){
            this.currentPage = 1;
            this.pageSize = 20;  //每页显示多少条
            this.pageIndex = 1
            this.dialogVisible = false;
        },
        // pageSize 改变时会触发
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.clickAddressList(this.list);
        },
        // currentPage 改变时会触发
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.pageIndex = val;
            this.clickAddressList(this.list);
        },
    }
}
</script>