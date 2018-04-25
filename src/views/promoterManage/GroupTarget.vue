<template lang="html">
    <section>
		<el-tabs v-model="activeName" @tab-click="changeTabs">
			<el-tab-pane label="招生期" name="2">
				<ListPage :type="2"></ListPage>
			</el-tab-pane>
			<el-tab-pane label="销售期" name="3">
				<ListPage :type="3"></ListPage>
			</el-tab-pane>
		</el-tabs>
    </section>
</template>

<script>
import ListPage from './components/group_target_list'
export default {
	components: {
		ListPage
	},
	data() {
		return {
			activeName: '2',
		}
	},
	methods: {
		changeTabs(tab, event) {
			// this.filters.date_range = '';
	        // console.log(tab, event);
			// this.dateRangeSelect();
	    },
	}
}
</script>

<style lang="css">
</style>
