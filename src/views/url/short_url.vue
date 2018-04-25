<template lang="html">
    <div id="root">
        <el-form :model="form">
            <el-form-item label="长链接">
                <el-input v-model="form.url" style="width: 500px;" @keydown.native.prevent.enter="transformUrl"></el-input>
                <el-button type="success" @click="transformUrl()">生成短链接</el-button>
            </el-form-item>
            <el-form-item label="短链接">
                <el-input :value="form.returnUrl" style="width: 500px;"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
	transformShortUrl
} from '../../api/api'
export default {
	data() {
		return {
			form: {
				url: '',
				returnUrl: ''
			}

		}
	},
	methods: {
		transformUrl() {

			transformShortUrl({
				url: this.form.url
			}).then((res) => {
				console.log(res)
				if (res.data.success) {
					console.log(res.data.data);
					this.form.returnUrl = res.data.data
				} else {
					this.$notify({
						title: '错误',
						type: 'error',
						message: res.data.msg
					})
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
#root {
    padding: 50px 0 0;
}
</style>
