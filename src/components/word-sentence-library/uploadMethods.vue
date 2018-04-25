<template>
<el-row>
	<el-col style="width: 110px">
		<el-dropdown split-button @command="selectUploadMethod">
			上传
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="1">本地</el-dropdown-item>
				<el-dropdown-item command="2">素材库</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</el-col>
	<el-upload class="upload-demo" ref="upload" action='https://upload.qbox.me' :data='kongObj' :on-change="handleChange" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false" :on-success='handleSuccess' v-if="localUpload">
		<el-button slot="trigger">选取文件</el-button>
		<el-button style="margin-left: 10px;" @click="handleUpload" type="primary">上传</el-button>
		<i class="fa fa-check" aria-hidden="true" style="margin-left: 20px; color: green;" v-show="mediaUploadSuccess"></i>
	</el-upload>
	<div v-else>
		<el-select v-model="selectMaterial" style="width:300px;" placeholder="请输入素材名称或ID查询" filterable clearable remote :remote-method="selectMaterialRemoteMethod" :loading='selectMaterialLoading' @change="selectMaterialSubmit">
			<el-option v-for="item in selectMaterialOptions" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item">
			</el-option>
		</el-select>
		<el-button type="primary" @click="selectMaterialSubmit">确认</el-button>
		<i class="fa fa-check" aria-hidden="true" style="margin-left: 30px; color: green;" v-show="mediaSelectSuccess"></i>
	</div>
</el-row>
</template>

<script>
import {
	getUploadToken,
	goCallback,
	getMaterialsList
} from "../../api/api";
export default {
	name: "uploadMethods",
	props: ["oProp", "oVal", "oTags", "oClearEmForm", "oClearForm", "oLocalUpload", "oAcType"],
	data() {
		return {
			// 本地上传默认为true
			localUpload: true,
			kongObj: {},
			fileList: [],

			// 从素材库选择相关
			selectMaterial: "",
			selectMaterialLoading: false,
			selectMaterialOptions: [],

			// 暂存资源上传成功后的数据
			media: {
				id: "",
				url: ""
			},

			// 素材上传成功
			mediaUploadSuccess: false,
			mediaSelectSuccess: false
		};
	},
	methods: {
		/***
		 * @function 选择上传方式
		 * @augments command
		 */
		selectUploadMethod(command) {
			switch (command) {
				case "2":
					this.localUpload = false;
					break;
				default:
					this.localUpload = true;
					break;
			}
		},
		/***
		 * @description 本地上传相关
		 * @function 文件改变
		 * @augments file     当前文件
		 * @augments fileList 当前文件列表
		 */
		handleChange(file, fileList) {
			if (fileList.length > 1) {
				fileList[0] = fileList[1];
				fileList.length = 1;
				this.$notify({
					title: "警告",
					message: "只支持单个文件上传，文件被替换",
					type: "warning"
				});
			}
			if (!this.judgeMediaType(fileList[0].name)) {
				this.$notify({
					title: "警告",
					message: "请选择正确的文件类型",
					type: "warning"
				});
				fileList = [];
				this.fileList = [];
			}
		},
		/***
		 * @function 文件移除的监听
		 */
		handleRemove() {
			let self = this
			try {
				self.$emit('child-say-upfinish', self.oVal, 'remove')
			} catch (e) {
				console.log(e);
			} finally {

			}
		},
		/***
		 * @description 本地上传相关
		 * @function 点击上传的方式
		 */
		handleUpload() {
			let self = this
			/**
			 * @description oProp 0 代表图片
			 * @description 判断从父组件传递的oProp属性的值是否为0
			 */
			if (this.$refs.upload.uploadFiles[0]) {
				if (this.oProp == 0) {
					this.picUpload();
				} else {
					this.avUpload();
				}
				try {
					self.$emit('child-say-upfinish', self.oVal, false)
				} catch (e) {
					console.log(e);
				} finally {

				}
			} else {
				this.$notify({
					title: "错误",
					message: "请选择素材",
					type: "error"
				});
			}
		},
		/***
		 * @function 图片上传
		 */
		picUpload() {
			let self = this;
			let uploadPic = function() {
				return new Promise((resolve, reject) => {
					let para = {
						name: self.$refs.upload.uploadFiles[0].name,
						tags: self.oTags ? self.oTags : ""
					};
					let data = new FormData();
					data.append("bin", self.$refs.upload.uploadFiles[0].raw);
					data.append("name", para.name);
					data.append("tags", para.tags);
					self.$ajax
						.post("/op/material/upload_image_lib", data, {
							headers: {
								"Content-Type": "multipart/form-data"
							}
						})
						.then(res => {
							if (res.data.success) {
								// 图片上传成功后的处理
								self.$notify({
									title: "成功",
									type: "success",
									message: "图片已上传成功"
								});
								// 上传成功后清空列表
								self.$refs.upload.uploadFiles = [];
								// 修改素材上传状态为true
								self.mediaUploadSuccess = true;
								// media对象赋值
								self.media = {
									id: res.data.data.entity.id,
									url: res.data.data.entity.url,
									oProp: self.oProp,
									oVal: self.oVal
								};
								// 子组件向福组件传值
								self.$emit("child-say", self.media);
							} else {
								self.$notify({
									title: "失败",
									type: "error",
									message: "图片上传失败,错误原因:" + res.data.msg,
									duration: 0
								});
							}
							try {
								self.$emit('child-say-upfinish', self.oVal, true)
							} catch (e) {
								console.log(e);
							} finally {

							}
						});
				});
			};
			let testUplopad = async function() {
				let t = await uploadPic();
			};
			testUplopad();
		},
		/***
		 * @function    音视频上传
		 * @description 先获取token  然后再进行上传
		 * @default access_type 默认为1 为加密类型 判断父组件传值 如果this.oAcType == 0 音视频采用非加密 否则采用加密
		 *
		 */
		avUpload() {
			let para = {
				type: this.oProp,
				access_type: 1,
				name: this.$refs.upload.uploadFiles[0].name
			};
			this.oAcType == "0" ? para.access_type = 0 : ''
			getUploadToken(para).then(res => {
				this.url = res.data.data.url;
				let tempObj = {
					token: res.data.data.token,
					key: res.data.data.key,
					name: this.$refs.upload.uploadFiles[0].name,
					type: this.oProp,
					access_type: 1
				};
				this.oAcType == "0" ? tempObj.access_type = 0 : ''
				Object.assign(this.$refs.upload.data, tempObj); // 发送请求附带参数的补充
				// console.log(this.$refs.upload.data); //查看请求附带参数
				this.$refs.upload.submit();
			});
		},
		/***
		 * @description 本地上传相关
		 * @function 上传成功
		 * @augments response 响应
		 * @augments file     当前文件
		 * @augments fileList 当前文件列表
		 */
		handleSuccess(response, file, fileList) {
			let self = this
			// type 类型判断
			let mp3Reg = /\.mp3$/,
				mp4Reg = /\.mp4$/,
				imgReg = /\.(png|jpg|jpeg|gif)$/,
				_type;
			_type = mp4Reg.test(file.raw.name) ? 1 : 2;

			let para = {
				name: file.raw.name.substring(0, file.raw.name.indexOf(".")),
				key: response.key,
				type: _type,
				size: file.size,
				tags: this.oTags ? this.oTags : "",
				content_type: file.raw.type,
				access_type: 1
			};
			this.oAcType == "0" ? para.access_type = 0 : ''
			goCallback(para).then(res => {
				if (res.data.success) {
					this.$notify({
						title: "成功",
						message: "上传成功",
						type: "success"
					});
					// 修改素材上传状态为true
					this.mediaUploadSuccess = true;
					this.media = {
						id: res.data.data.entity.id,
						url: res.data.data.entity.url,
						name: res.data.data.entity.name,
						oProp: this.oProp,
						oVal: this.oVal
					};
					// 上传成功后清空列表
					this.$refs.upload.uploadFiles = [];
					// 子组件向福组件传值
					this.$emit("child-say", this.media);
				} else {
					this.$notify({
						title: "错误",
						message: res.data.msg,
						type: "error"
					});
				}
				// 告诉父组件 上传是否完成
				try {
					self.$emit('child-say-upfinish', self.oVal, true)
				} catch (e) {
					console.log(e);
				} finally {

				}
			});
		},
		/****
		 * @description 从素材库上传
		 * @augments query
		 */
		selectMaterialRemoteMethod(query) {
			if (query !== "") {
				this.selectMaterialLoading = true;
				let temp = Number(query);
				let parameter = {
					type: this.oProp,
					access_type: 1
					// tags: this.oTags ? this.oTags : ""
				};
				parameter["access_type"] = this.oProp == 0 ? 0 : 1;
				if (this.oProp == 0) {
					parameter["access_type"] = 0
				} else {
					if (this.oAcType == "0") {
						parameter["access_type"] = 0
					}
				}
				temp ? (parameter["id"] = temp) : (parameter["name"] = query);
				getMaterialsList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selectMaterialOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								url: item.entity.url,
								posterUrl: item.conf.posterImgUrl,
								type: item.entity.type,
								accessType: item.entity.accessType
							};
							return tempObj;
						});
					}
					this.selectMaterialLoading = false;
				});
			} else {
				this.selectMaterialOptions = [];
			}
		},
		/**
		 * @function 从素材库选择的确认事件
		 */
		selectMaterialSubmit() {
			// 修改素材选择状态为true
			this.mediaSelectSuccess = true;
			// media对象赋值
			this.media = {
				id: this.selectMaterial.id,
				url: this.selectMaterial.url,
				name: this.selectMaterial.name,
				oProp: this.oProp,
				oVal: this.oVal,
			};
			// 子组件向父组件传值
			this.$emit("child-say", this.media);
		},
		/***
		 * @function 判断资源类型
		 */
		judgeMediaType(url) {
			let mp3Reg = /\.mp3$/;
			let mp4Reg = /\.mp4$/;
			let imgReg = /\.(png|jpg|jpeg|gif)$/;
			return (imgReg.test(url) && this.oProp == 0) ||
				(mp4Reg.test(url) && this.oProp == 1) ||
				(mp3Reg.test(url) && this.oProp == 2) ?
				true :
				false;
		}
	},
	mounted() {
		if ((this.oLocalUpload != null) || (this.oLocalUpload != undefined)) {
			this.localUpload = this.oLocalUpload
		}
	},
	watch: {
		oClearEmForm: {
			handler(newV, oldV) {
				if (!newV) {
					this.selectMaterial = "";
					this.mediaSelectSuccess = false;
					this.mediaUploadSuccess = false;
					this.localUpload = true;
				}
			}
		},
		oClearForm: {
			handler(newV, oldV) {
				if (!newV) {
					this.selectMaterial = "";
					this.mediaSelectSuccess = false;
					this.mediaUploadSuccess = false;
					this.localUpload = true;
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
</style>
