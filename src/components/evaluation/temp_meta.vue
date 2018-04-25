<template lang="html">
  <div>
    <div v-if="!meta_data.subMeta">
      <el-row style="margin-top: 15px;">
        <el-col :span="2" :offset="2">
          <el-button type="text" style="font-size: 18px;">{{ meta_data.label}}</el-button>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="6" :offset="1" style="margin-bottom: 10px;">
          <el-button type="text" style="font-size: 18px;color: red;" >{{ "类型---" + meta_data.type }}</el-button>
        </el-col>
      </el-row> -->
      <!-- 基本4类型 -->
      <el-row v-if="isBase4">
        <el-col :span="24">
          <el-col :span="12" :offset="2">
            <el-input v-model="meta_data[meta_data.name]"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button-group style="margin-left: 16px;">
              <el-button type="primary" @click="handleUpload()" icon="upload"></el-button>
              <el-button type="primary" @click="handlePreAv()" icon="search"></el-button>
            </el-button-group>
          </el-col>
        </el-col>
      </el-row>
      <!-- 数组类型 -->
      <el-row v-if="isArr">
        <el-col :span="24" v-for="(item, index) in meta_data[meta_data.name]" :key="index">
          <el-col :span="12" :offset="2" style="margin-bottom: 5px;">
            <el-input v-model="meta_data[meta_data.name][index]"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button-group style="margin-left: 16px;">
              <el-button type="primary" @click="handleUpload(index)" icon="upload"></el-button>
              <el-button type="primary" @click="handlePreAv(index)" icon="search"></el-button>
            </el-button-group>
            <el-button @click="handleRemove(index)" icon="minus" style="margin-left: 8px;"></el-button>
            <el-button @click="handleAdd()" v-show="showAddBtn(index)" icon="plus" style="margin-left: 8px;"></el-button>
          </el-col>
        </el-col>
      </el-row>
      <!-- Map类型 -->
      <el-row v-if="isMap">
        <el-col :span="24" v-for="(item, index) in meta_data[meta_data.name]" :key="index">
          <el-row style="margin:20px 0 5px;">
            <el-col :span="1" :offset="1" >
              <el-button type="text" style="font-size: 18px;">{{ '键名' }}</el-button>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.key" placeholder="请输入键名"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button-group style="margin-left: 16px;">
                <el-button type="primary" @click="handleUpload(index)" icon="upload"></el-button>
                <el-button type="primary" @click="handlePreAv(index)" icon="search"></el-button>
              </el-button-group>
              <el-button @click="handleRemove(index)" icon="minus" style="margin-left: 8px;"></el-button>
              <el-button @click="handleAdd()" v-show="showAddBtn(index)" icon="plus" style="margin-left: 8px;"></el-button>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 5px;">
            <el-col :span="1" :offset="1">
              <el-button type="text" style="font-size: 18px;">{{ '键值' }}</el-button>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.value" placeholder="请输入键值"></el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row style="margin: 10px 0;">
        <el-col :span="2">
          <div class="title1">{{ meta_data.label }}</div>
          <!-- <el-button type="text" style="font-size: 18px;color: red;">{{ meta_data.label }}</el-button> -->
        </el-col>
        <!-- <el-col :span="2">
          <div class="title1">{{ '增加' }}</div>
        </el-col> -->
      </el-row>
    </div>
    <repeat v-for="(item, index) in meta_data.subMeta" :key="index" :meta_data="item" :flag_addOrUpdate="flag_addOrUpdate" class="piece"></repeat>
    <el-dialog title='新增' v-model='upVisible' :close-on-click-modal='true'>
      <el-form :model='avForm' label-width='100px' ref='avForm'>
        <el-form-item label="素材类型" prop="type">
          <el-select v-model="avForm.type" placeholder="请选择上传素材类型" style="width:200px;">
            <el-option label="图片" value="0"></el-option>
            <el-option label="视频" value="1"></el-option>
            <el-option label="音频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择上传方式">
          <el-dropdown split-button @command="selectUploadMethod" >
            上传方式
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">本地上传</el-dropdown-item>
              <el-dropdown-item command="2">素材库选择</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <!-- 本地上传 -->
        <el-form-item label='上传资源' v-if="localUpload">
          <el-upload class="upload-demo" ref="upload" action='https://upload.qbox.me' :data='kongObj' :on-change="handleChange" :file-list="fileList" :auto-upload="false" :on-success='handleSuccess'>
            <el-button slot="trigger">选取文件</el-button>
            <el-button style="margin-left: 10px;" @click="submitAvUpload" type="primary">上传</el-button>
            <div slot="tip" class="el-upload__tip">素材类型要与资源保持一致 否则上传素材库会出错</div>
          </el-upload>
        </el-form-item>
        <!-- 从素材库中选择 -->
        <el-form-item label="从素材库选择" v-else>
          <el-select v-model="selectMaterial" style="width:400px;" placeholder="请输入素材名称或ID查询" filterable clearable remote :remote-method="selectMaterialRemoteMethod" :loading='selectMaterialLoading'>
            <el-option
              v-for="item in selectMaterialOptions"
              :key="item"
              :label="'（' + item.id + '）' + item.name"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button type="primary" @click="selectMaterialSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model='mediaVisible' :close-on-click-modal='true'>
      <div class="oImg" v-show="ifImgVisible">
        <img :src="imgSrc" ref="oImg"></img>
      </div>
      <div class="oAudio" v-show="ifAudioVisible">
        <audio :src="audioSrc" controls></audio>
      </div>
      <div class="oVideo" v-show="ifVideoVisible">
        <video :src="videoSrc" controls></video>
      </div>
    </el-dialog>
    <audio v-show=""></audio>
    <video v-show=""></video>
  </div>
</template>

<script>
import {
	getUploadToken,
	goCallback,
	getMaterialsList
} from "../../api/api";
export default {
	name: "repeat",
	props: ["meta_data", "flag_addOrUpdate"],
	data() {
		return {
			// 是否是4种基本类型
			isBase4: false,
			// 是否是数组
			isArr: false,
			// 是否是Map
			isMap: false,
			// 是否显示上传
			upVisible: false,
			// 给哪个数据赋值
			winIndex: "",

			// 上传表单
			avForm: {
				type: "0",
				access_type: 0
			},
			fileList: [],
			kongObj: {},
			url: "",

			// 预览图片音视频
			currentSrc: "",
			mediaVisible: false,
			ifImgVisible: false,
			ifAudioVisible: false,
			ifVideoVisible: false,
			imgSrc: "",
			audioSrc: "",
			videoSrc: "",

			// 上传方式
			localUpload: true,
			serverUpload: false,

			// 从素材库选择相关
			selectMaterial: "",
			selectMaterialLoading: false,
			selectMaterialOptions: []
		};
	},
	methods: {
		handleAdd() {
			let realName = this.meta_data.name;
			// console.log(realName)
			if (this.isArr) {
				this.meta_data[realName].push("");
			} else if (this.isMap) {
				this.meta_data[realName].push({
					key: "",
					value: ""
				});
			}
		},
		handleRemove(index) {
			if (index == 0) {
				this.$notify({
					title: "警告",
					type: "warning",
					message: "至少保留一项"
				});
			} else {
				let realName = this.meta_data.name;
				this.meta_data[realName].splice(index, 1);
			}
		},
		handleUpload(index) {
			this.upVisible = true;
			this.winIndex = index;
		},
		handlePreAv(index) {
			let realName = this.meta_data.name;
			let mp3Reg = /\.mp3$/;
			let mp4Reg = /\.mp4$/;
			let imgReg = /\.(png|jpg|jpeg|gif)$/;
			this.ifImgVisible = this.ifAudioVisible = this.ifVideoVisible = false;
			if (this.isArr) {
				this.currentSrc = this.meta_data[realName][index];
			} else if (this.isMap) {
				this.currentSrc = this.meta_data[realName][index]["value"];
			} else {
				this.currentSrc = this.meta_data[realName];
			}
			if (imgReg.test(this.currentSrc)) {
				console.log("图片");
				this.ifImgVisible = true;
				this.mediaVisible = true;
				this.imgSrc = this.currentSrc;
			}
			if (mp3Reg.test(this.currentSrc)) {
				console.log("音频");
				this.ifAudioVisible = true;
				this.mediaVisible = true;
				this.audioSrc = this.currentSrc;
			}
			if (mp4Reg.test(this.currentSrc)) {
				console.log("视频");
				this.ifVideoVisible = true;
				this.mediaVisible = true;
				this.videoSrc = this.currentSrc;
			}
		},
		/***
		 * 上传表单相关
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
		},
		handleSuccess(response, file, fileList) {
			let realName = this.meta_data.name;
			if (this.isArr) {
				this.meta_data[realName][this.winIndex] = this.url;
			} else if (this.isMap) {
				this.meta_data[realName][this.winIndex]["value"] = this.url;
			} else {
				this.meta_data[realName] = this.url;
			}
			fileList = [];
			this.fileList = [];
			this.upVisible = false;

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
				tags: "模板实例",
				content_type: file.raw.type,
				access_type: 0
			};
			goCallback(para).then(res => {
				if (res.data.success) {
					this.$notify({
						title: "成功",
						message: "上传成功",
						type: "success"
					});
				} else {
					this.$notify({
						title: "错误",
						message: res.data.msg,
						type: "error"
					});
				}
			});
		},
		submitAvUpload() {
			// 判断点击上传按钮之前是否选择了素材 是 => 上传 否 => 提示
			if (this.$refs.upload.uploadFiles[0]) {
				if (this.avForm.type == 0) {
					let self = this;
					/**
					 * 上传图片的函数封装
					 */
					let uploadPic = function () {
						return new Promise((resolve, reject) => {
							let para = {
								name: self.$refs.upload.uploadFiles[0].name,
								tags: "模板实例"
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
										self.$notify({
											title: "成功",
											type: "success",
											message: "图片上传成功"
										});
										let realName = self.meta_data.name;
										let newUrl = 'https' + res.data.data.entity.url.slice(4)
										if (self.isArr) {
											self.meta_data[realName][self.winIndex] =
												newUrl;
										} else if (self.isMap) {
											self.meta_data[realName][self.winIndex]["value"] =
												newUrl;
										} else {
											self.meta_data[realName] = newUrl;
										}
										self.fileList = [];
										self.upVisible = false;
									} else {
										self.$notify({
											title: "失败",
											type: "error",
											message: "图片上传失败,错误原因:" + res.data.msg,
											duration: 0
										});
									}
								});
						});
					};
					let testUplopad = async function () {
						let t = await uploadPic();
					};
					testUplopad();
				} else {
					// 音视频上传需要先获取token
					this.getTokenThenSubmit();
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
		 * @argument access_type 素材访问类型 0:公开 1:私有
		 * @argument name        素材的文件名
		 * @argument type        素材类型 0:图片 1:视频 2:音频
		 */
		getTokenThenSubmit() {
			let para = {
				type: this.avForm.type,
				access_type: this.avForm.access_type,
				name: this.$refs.upload.uploadFiles[0].name
			};
			getUploadToken(para).then(res => {
				this.url = 'https' + res.data.data.url.slice(4);
				let tempObj = {
					token: res.data.data.token,
					key: res.data.data.key,
					name: this.$refs.upload.uploadFiles[0].name,
					type: this.avForm.type,
					access_type: this.avForm.access_type
				};
				Object.assign(this.$refs.upload.data, tempObj); // 发送请求附带参数的补充
				// console.log(this.$refs.upload.data); //查看请求附带参数
				this.$refs.upload.submit();
			});
		},
		/**
		 * 是否显示增加按钮
		 */
		showAddBtn(index) {
			if (!this.isBase4 &&
				index == this.meta_data[this.meta_data.name].length - 1
			) {
				return true;
			}
		},
		/**
		@description 选择上传方式
		@augments command
		 */
		selectUploadMethod(command) {
			console.log(command);
			switch (command) {
			case "2":
				console.log("素材库选择上传");
				this.localUpload = false;
				break;
			default:
				console.log("本地上传");
				this.localUpload = true;
				break;
			}
		},
		//
		/***
		@description 从素材库上传
		@augments query
		 */
		selectMaterialRemoteMethod(query) {
			if (query !== "") {
				this.selectMaterialLoading = true;
				let temp = Number(query);
				let parameter = {
					type: this.avForm.type,
					access_type: 0
				};
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
		selectMaterialSubmit() {
            this.selectMaterial.url = 'https' + this.selectMaterial.url.slice(4)
			let realName = this.meta_data.name;
			if (this.isArr) {
				this.meta_data[realName][this.winIndex] = this.selectMaterial.url;
			} else if (this.isMap) {
				this.meta_data[realName][this.winIndex][
					"value"
				] = this.selectMaterial.url;
			} else {
				this.meta_data[realName] = this.selectMaterial.url;
			}
			this.fileList = [];
			this.upVisible = false;
		}
	},
	mounted() {
		// console.log(this.meta_data);
		let type = this.meta_data.type.slice(0, 1);
		let realName = this.meta_data.name;
		// console.log('模板的meta结构')
		// console.log(this.meta_data);

		// 更新操作
		if (!this.flag_addOrUpdate) {
			switch (type) {
				/*** @default 0,1,2,3  */
			case "4":
				this.isArr = true;
				break;
			case "5":
				this.isMap = true;
				break;
			case "6":
				"";
				break;
			default:
				this.isBase4 = true;
				break;
			}
			// 如果是数组且元素必须是布尔值的类型 需要把布尔值转化为字符串的0或者1 input框绑定的只能是字符串或者数字不能是布尔值
			if (this.meta_data.type == "4_3") {
				for (var i = 0; i < this.meta_data[realName].length; i++) {
					if (this.meta_data[realName][i] === false) {
						this.meta_data[realName][i] = "0";
					}
					if (this.meta_data[realName][i] === true) {
						this.meta_data[realName][i] = "1";
					}
				}
			}
			// 如果是Map且元素必须是布尔值的类型 需要把布尔值转化为字符串的0或者1 input框绑定的只能是字符串或者数字不能是布尔值
			if (this.meta_data.type == "5_3") {
				for (var i = 0; i < this.meta_data[realName].length; i++) {
					if (this.meta_data[realName][i].value === "false") {
						this.meta_data[realName][i].value = "0";
					}
					if (this.meta_data[realName][i].value === "true") {
						this.meta_data[realName][i].value = "1";
					}
				}
			}
			// 如果是base4且元素必须是布尔值的类型 需要把布尔值转化为字符串的0或者1 input框绑定的只能是字符串或者数字不能是布尔值
			if (this.meta_data.type == "3") {
				if (this.meta_data[realName] === false) {
					this.meta_data[realName] = "0";
				}
				if (this.meta_data[realName] === true) {
					this.meta_data[realName] = "1";
				}
			}
		}

		// 新增操作
		if (this.flag_addOrUpdate) {
			if (type == "0" || type == "1" || type == "2" || type == "3") {
				this.isBase4 = true;
				// this.meta_data[realName] = this.flag_addOrUpdate ? base : ''
				this.meta_data[realName] = "";
				// console.log(base)
			} else if (type == "4") {
				/**
				 * arr类型 base是一个数组 其中包含的是数组中的各个子元素
				 */
				this.isArr = true;
				let arr = [];
				arr.push("");
				this.$set(this.meta_data, realName, arr);
			} else if (type == "5") {
				this.isMap = true;
				let arr = [];
				// 更新情况
				arr.push({
					key: "",
					value: ""
				});
				this.$set(this.meta_data, realName, arr);
			} else {
				this.meta_data[realName] = {};
			}
		}
	}
};
</script>

<style lang="less" scoped>
.oImg {
    width: 100%;
    height: 500px;
    text-align: center;
    img {
        width: 100%;
        height: 100%;
    }
}

.oAudio {
    width: 100%;
    audio {
        width: 100%;
    }
}

.oVideo {
    width: 100%;
    height: 300px;
    video {
        width: 100%;
        height: 300px;
    }
}

.title1 {
    color: #000;
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    // background-color: red;
    text-align: right;
    margin-right: 15px;
}
</style>
