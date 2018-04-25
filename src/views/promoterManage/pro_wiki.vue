<template>
	<el-tabs v-model="activeName" @tab-click="handleClick">
		<el-tab-pane label="推广人培训" name="0">
			<proWikiList :type="0"></proWikiList>
		</el-tab-pane>
		<el-tab-pane label="推广人管理" name="1">
			<proWikiList :type="1"></proWikiList>
		</el-tab-pane>
		<el-tab-pane label="CRM使用答疑" name="2">
			<proWikiList :type="2"></proWikiList>
		</el-tab-pane>
		<el-tab-pane label="学员话术" name="3">
			<proWikiList :type="3"></proWikiList>
		</el-tab-pane>
		<el-tab-pane label="集训营" name="4">
			<proWikiList :type="4"></proWikiList>
		</el-tab-pane>
		<el-tab-pane label="精品班常见问题" name="5">
			<proWikiList :type="5"></proWikiList>
		</el-tab-pane>
	</el-tabs>
</template>
<script>
import proWikiList from './components/pro_wiki_list'
export default {
	components: {
		proWikiList
	},
	data() {
		return {
			activeName: '0'
		};
	},
	methods: {
		handleClick(tab, event) {
			// console.log(tab, event);
		}
	},
	mounted() {
		if (sessionStorage.getItem('activeName')) {
			this.activeName = sessionStorage.getItem('activeName');
		}
	}
};
</script>

<style lang="css">
</style>
