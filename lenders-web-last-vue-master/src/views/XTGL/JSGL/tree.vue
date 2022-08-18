<template>
	<div class="cus-container">
		<el-row>
		  <el-button type="primary" size="small" plain @click="choseToggel(true)">{{ $t('table.SelectAll') }}</el-button>
		  <el-button type="primary" size="small" plain @click="choseToggel(false)">{{ $t('table.CancelAll') }}</el-button>
		  <el-button type="primary" size="small" plain @click="expandToggel(true)">{{ $t('table.expandall') }}</el-button>
		  <el-button type="primary" size="small" plain @click="expandToggel(false)">{{ $t('table.shrinkall') }}</el-button>
		</el-row>
		<div class="cus-treebody">
			<el-tree
			  ref="selectTree"
			  :data="treeData"
			  show-checkbox
			  node-key="ID"
			  :default-expand-all="expandAll"
			  :props="defaultProps">
			</el-tree>
		</div>
	</div>
</template>

<script>
  export default {
	props:['sysMenuList','temp'],
    data() {
      return {
		expandAll:false,
		treeData:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
	created(){
	   this.generaMenu(this.treeData,this.sysMenuList);
	   console.warn('menu', this.treeData);
	},
	mounted(){
	   let choseKey=this.temp.originMenuKeys.split(",");
	   this.setCheckedKeys(choseKey)
	},
	methods:{
		// findParentHasSelected(originData, forData, rutData) {
		// 	originData.forEach(item => {
		//
		// 	});
		// 	forData.forEach(idItem => {
		//2020-05-15 221241.jpg
		// 	});
		// },
		setCheckedKeys(_a) {
		   this.$refs.selectTree.setCheckedKeys(_a);
		},
		getCheckedKeys() {
			const parentKeys = this.$refs.selectTree.getHalfCheckedKeys().join(",");
			const childrenKeys = this.$refs.selectTree.getCheckedKeys().join(",");
		   this.temp.MenuList = parentKeys && parentKeys.length ? parentKeys + ',' + childrenKeys : childrenKeys;
		   this.temp.originMenuKeys = childrenKeys;
		   return this.temp;
	    },
		//处理菜单数据
		generaMenu(treeData,data) {
		  data.forEach(item => {
		    let menu;
		    if (item.sysMenuLists) {
		      menu = {
				ID:item.ID,
				label:item.menuname,
		        children: []
		      }
		    } else {
		      menu = {
		        ID:item.ID,
		        label:item.menuname,
		      }
		    }
		    if (item.sysMenuLists) {
		      this.generaMenu(menu.children,item.sysMenuLists)
		    }
		    treeData.push(menu)
		  });
		},
		expandToggel(expandAll){
		    let self = this;
		    // 将没有转换成树的原数据
		    let list = this.treeData;
		    for (let i = 0; i < list.length; i++) {
			   self.$refs.selectTree.store.nodesMap[list[i].ID].expanded = expandAll
		    }
		},
		choseToggel(choseAll){
			if (choseAll) {
				//全选
				this.$refs.selectTree.setCheckedNodes(this.treeData);
			}else{
				//取消选中
				this.$refs.selectTree.setCheckedKeys([]);
			}
		}
	}
  };
</script>

<style lang="scss" scoped>
.cus-container{
	padding-top: 10px;
	.cus-treebody{
		height:400px;
		overflow-y:scroll;
		margin-top: 20px;
		border-bottom: 1px solid #e9e9e9;
	}
}
</style>
