<template>
  <el-select
    ref="select"
    v-model="chosenName"
    class="filter-item"
    :placeholder="placeholder || $t('table.choose')"
  >
    <el-option
      v-for="(item, index) in [{}]"
      :key="index"
      :label="''"
      :value="''"
      style="height:auto;padding:0;"
    >
      <el-tree
        :data="treeData"
        :props="{
          children: dataProps.children,
          label: dataProps.label
        }"
        @node-click="handleChoose"
      />
    </el-option>
  </el-select>
</template>

<script>
import { toTree, findTreeNode } from '../util'
export default {
  name: 'treeSelector',
  model: {
    prop: 'chosenId',
    event: 'change'
  },
  props: ['treeData', 'dataProps', 'placeholder', 'chosenId'],
  computed: {
    chosenName() {
      let rlt = findTreeNode(this.treeData, this.dataProps.id, this.chosenId)
      return rlt ? rlt[this.dataProps.label] : ''
    }
  },
  methods: {
    handleChoose(data) {
      this.$emit('change', data[this.dataProps.id])
      this.$refs.select.blur()
    }
  }
}
</script>