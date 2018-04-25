<template lang="html">
  <div id="root">
    <!-- 预览 -->
    <div class="top" v-show="previewVisible">
      <div class="close" @click="previewVisible=!previewVisible">×</div>
      <iframe :src="ifSrc" width="800" height="400" id="game"></iframe>
    </div>
    <div class="bottom">
      <el-form :model='form' :rules='formRules' ref="form" label-width="80px" label-position="right">

          <el-row v-if="isAdd" style="margin-top: 30px;">
            <el-col :span="2" >
              <div class="title">选择模板</div>
            </el-col>
            <el-col :span="7">
              <el-select v-model="form.selectTemp" placeholder="请输入模板名称或ID查询" style="width: 100%" filterable clearable remote :remote-method="selectFromRemote" :loading='selectFromRemoteLoading' @change="handleChange">
                <el-option v-for="item in selectFromRemoteArr" :key="item" :label="'（' + item.id + '）' + item.name" :value="item"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row style="margin-top: 40px;">
            <el-col :span="2">
              <div class="title">标题</div>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="模板实例标题,不可为空,1-128个字符" v-model="form.name"></el-input>
            </el-col>
            <el-col :span="2" :offset="3">
              <el-button type="primary" @click="preview">实例预览</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="copyTemplateIns" v-if='isCopy'>复制实例</el-button>
            </el-col>
          </el-row>

          <el-row style="margin: 30px 0 30px 0;">
            <el-col :span="2">
              <div class="title">状态</div>
            </el-col>
            <el-col :span="8" style="margin-top: 10px;">
              <el-radio-group v-model="form.status">
                <el-radio class="radio" :label="1">有效</el-radio>
                <el-radio class="radio" :label="0">无效</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-row>
        <div v-for="( item, index ) in data" :key="index" class="piece">
          <TempMeta :meta_data=item :flag_addOrUpdate='flag_addOrUpdate'></TempMeta>
        </div>
        <el-col :span="24" :offset="2" style="margin-top: 20px;">
          <el-button type="primary" @click="onSubmit" v-if='!isCopy'>{{ addOrUpdate }}</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
	getTempList,
	getTempById,
	getTempInsById,
	getTempInsList,
	addTempIns,
	updateTempIns
} from "../../api/api";
import TempMeta from "../../components/evaluation/temp_meta";
export default {
	components: {
		TempMeta
	},
	data() {
		return {
			data: [],
			form: {
				name: "",
				status: 1,
				selectTemp: ""
			},
			formRules: {},
			// 选择素材项的 加载 与 选项
			selectFromRemoteLoading: false,
			selectFromRemoteArr: [],
			// 表单提交的验证字段
			valid: true,
			/***
			 * 主要用在更新
			 */
			tempInstancData: "",
			tempData: "",
			/***
			 * flag_addOrUpdate 判断是否是新增或者更新
			 * addOrUpdate      新增或者更新的文字显示(按钮)
			 * true => 新增
			 * false => 更新
			 */
			flag_addOrUpdate: true,
			addOrUpdate: "立即创建",
			// iframe的源
			ifSrc: "",
			// 预览相关
			previewVisible: false,
			final_obj: {},
			//isCopy状态判断
			isCopy: false,
			isAdd: false
		};
	},
	methods: {
		/**
		 * 预览postMessage通信
		 *
		 */
		preview() {
			// 判断如果是新增 必须先选择一个模板
			if (this.flag_addOrUpdate && !(this.data && this.data.length)) {
				this.$notify({
					message: "请先选择一个模板",
					type: "warning",
					title: "警告"
				});
				return false;
			}
			// 判断iframe的src是否存在 不存在说明模板的htmlUrl没有配置
			if (this.ifSrc) {
				let gameDom = document.querySelector("#game");
				this.final_obj = {};
				this.valid = true;
				this.recursionArr(this.data, this.final_obj);
				let beginReload = this.final_obj;
				if (this.valid) {
					gameDom.contentWindow.postMessage(beginReload, "*");
					this.previewVisible = true;
				}
			} else {
				this.$notify({
					message: "模板未配置htmlUrl,无法预览",
					type: "warning",
					title: "警告"
				});
			}
		},

		/**
		 * @function 提交
		 */
		onSubmit() {
			// 最后提交接口请求的数组载体
			this.final_obj = {};
			this.valid = true;
			this.recursionArr(this.data, this.final_obj);
			if (this.valid) {
				this.$confirm("确认提交吗?", "提示", {
					type: "warning"
				}).then(() => {
					let para = {
						name: this.form.name,
						status: this.form.status,
						data: JSON.stringify(this.final_obj)
					};
					// console.log(para.data);
					// console.log(JSON.parse(para.data));
					if (this.flag_addOrUpdate) {
						if (this.$route.query.isCopy) {
							para["template_id"] = this.$route.query.template_id;
							submitMethod(addTempIns);
						} else {
							para["template_id"] = this.form.selectTemp.id;
							submitMethod(addTempIns);
						}
					} else {
						para["id"] = this.$route.query.id;
						submitMethod(updateTempIns);
					}
					let self = this;

					function submitMethod(method) {
						method(para).then(res => {
							if (res.data.success) {
								self.$notify({
									title: "成功",
									type: "success",
									message: "操作成功"
								});
								/***
								 * 判断如果是新增
								 */
								if (self.flag_addOrUpdate) {
									if (!self.isCopy) {
										self.form = {
											name: "",
											status: 1,
											selectTemp: ""
										};
									}
								}
							} else {
								self.$notify({
									title: "失败",
									type: "error",
									message: res.data.msg
								});
							}
						});
					}
				});
			}
		},
		/**
		 * @function 递归循环数组
		 * @arg  arr 递归数组
		 * @arg  accept_obj  接收对象
		 * @description   0 字符串
		 * @description   1 整数
		 * @description   2 小数
		 * @description   3 布尔类型
		 * @description   4 数组类型
		 * @description   5 map
		 * @description   6 json
		 */
		recursionArr(arr, accept_obj) {
			console.log(arr);
			console.log(accept_obj);
			let self = this;
			for (let i = 0; i < arr.length; i++) {
				let realName = arr[i].name;
				let label = arr[i].label;
				let type = arr[i].type;
				let required = arr[i].required;
				// console.log(required);
				// console.log(realName);
				// console.log(label);

				/**
				 * @function 公共的处理基本类型的方法
				 * @function 公共的处理数组类型的方法
				 * @function 公共的处理map类型的方法
				 */
				function type_base4(judge, transform, msg) {
					if (
						(arr[i][realName] == "" || arr[i][realName] == undefined) &&
						!required
					) {
						accept_obj[realName] = null;
					} else {
						if (judge(arr[i][realName])) {
							transform
								?
								(accept_obj[realName] = transform(arr[i][realName])) :
								(accept_obj[realName] = arr[i][realName]);
						} else {
							self._wrongNotify(label, msg);
							return false;
						}
					}
				}

				function type_array(judge, transform, msg) {
					var tempArr = [];
					var originArr = arr[i][realName];
					let count = 0;
					for (let j = 0; j < originArr.length; j++) {
						if ((originArr[j] == "" || originArr[j] == null) && !required) {
							originArr[j] = null;
							tempArr.push(originArr[j]);
							count++;
						} else {
							if (judge(originArr[j])) {
								transform
									?
									tempArr.push(transform(Number(originArr[j]))) :
									tempArr.push(originArr[j]);
							} else {
								self._wrongNotify(label, msg, j);
								return false;
							}
						}
					}
					// 如果全部都是空 则最后上传的是一个空数组
					if (count == originArr.length) {
						accept_obj[realName] = null;
					} else {
						accept_obj[realName] = tempArr;
					}
				}

				function type_map(judge, transform, msg) {
					var tempObj = {};
					var originArr = arr[i][realName];
					for (let j in originArr) {
						if (
							(originArr[j].value == "" ||
								originArr[j].value == null ||
								originArr[j].key == "" ||
								originArr[j].key == null) &&
							!required
						) {
							if (
								(originArr[j].key == "" && originArr[j].value != "") ||
								(originArr[j].key != "" && originArr[j].value == "")
							) {
								self._wrongNotify("", "key和value如果有一个不为空 另一个也不能为空");
								return false;
							} else {
								originArr[j].key = null;
								originArr[j].value = null;
								tempObj[originArr[j].key] = originArr[j].value;
							}
						} else {
							if (judge(originArr[j].value)) {
								tempObj[originArr[j].key] = transform ?
									transform(originArr[j].value) :
									originArr[j].value;
							} else {
								self._wrongNotify(label, msg, j);
								return false;
							}
						}
					}
					accept_obj[realName] = tempObj;
				}
				switch (type) {
				case "0":
					type_base4(this._isNull, "", "只能为字符串");
					break;
				case "1":
					type_base4(this._isInter, parseInt, "只能为整数");
					break;
				case "2":
					type_base4(this._isFloat, parseFloat, "只能为小数");
					break;
				case "3":
					type_base4(this._isBool, Boolean, "只能为0或1");
					break;
				case "4_0":
					type_array(this._isNull, "", "只能为字符串");
					break;
				case "4_1":
					type_array(this._isInter, parseInt, "只能为整数");
					break;
				case "4_2":
					type_array(this._isFloat, parseFloat, "只能为小数");
					break;
				case "4_3":
					type_array(this._isBool, Boolean, "只能为0或1");
					break;
				case "5_0":
					type_map(this._isNull, "", "只能为字符串");
					break;
				case "5_1":
					type_map(this._isInter, parseInt, "只能为整数");
					break;
				case "5_2":
					type_map(this._isFloat, parseFloat, "只能为小数");
					break;
				case "5_3":
					type_map(this._isBool, Boolean, "只能为0或1");
					break;
				case "6":
					accept_obj[realName] = {};
					self.recursionArr(arr[i].subMeta, accept_obj[realName]);
					break;
				}
				if (!self.valid) {
					return false;
				}
			}
		},
		/***
		 * @function 判断字符串是否为空
		 */
		_isNull(str) {
			return str;
		},
		/**
		 * @function 判断整数类型的方法
		 * @argument  str 判断的字符串
		 */
		_isInter(str) {
			return parseInt(str) == str;
		},
		/**
		 * @function 判断整数类型的方法
		 * @argument  str 判断的对象
		 */
		_isFloat(str) {
			// let val = str.indexOf('.') == (str.length - 2) ? Number(str).toFixed(1) : str
			return String(str).indexOf(".") > 0 && str == parseFloat(str);
		},
		/**
		 * @function 判断布尔类型的方法
		 * @argument  str 判断的对象
		 */
		_isBool(str) {
			return str == "0" || str == "1";
		},
		/**
		 * @function 判断后的提示
		 * @argument  what  判断对象
		 * @argument  msg   提示信息
		 */
		_wrongNotify(what, msg, index) {
			index = parseInt(index);
			this.$notify({
				title: "错误",
				type: "error",
				message: index >= 0 ? `${what}的第${index + 1}个子元素${msg}` : `${what + msg}`
			});
			this.valid = false;
		},
		/***
		 * @function 选择模板的搜索
		 */
		selectFromRemote(query) {
			if (query !== "") {
				this.selectFromRemoteLoading = true;
				let temp = Number(query);
				let self = this;
				let parameter = {
					status: 1
				};
				temp ? (parameter["id"] = temp) : (parameter["name"] = query);
				getTempList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selectFromRemoteArr = res.data.data.items.map(item => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								data: item.conf.metaData,
								ifSrc: item.entity.htmlUrl
							};
							return tempObj;
						});
					}
					this.selectFromRemoteLoading = false;
				});
			} else {
				this.selectFromRemoteArr = [];
			}
		},
		handleChange(currentVal) {
			this.data = [];
			if (this.flag_addOrUpdate) {
				this.ifSrc = currentVal.ifSrc;
			}
			// console.log(this.ifSrc)
			// 必须每次先让data为空 然后再给data赋值
			let self = this;
			setTimeout(item => {
				self.data = currentVal.data;
				// console.log(self.data);
			}, 0);
		},
		/**
		 * @function 更新
		 * @description 注意要比较_oFrame _oBase 这两个的值 如果_oBase中存在有效值 要赋值到_oFrame中否则以_oFrame为准
		 */
		recursiveArrForUp(_oFrame, _oBase) {
			for (let i = 0; i < _oFrame.length; i++) {
				let realName = _oFrame[i].name;
				let label = _oFrame[i].label;
				let type = _oFrame[i].type.slice(0, 1);
				if (type == "6") {
					this.recursiveArrForUp(_oFrame[i].subMeta, _oBase[realName]);
				} else if (type == "5") {
					let arr = []
					let keyCount = 0
					for (let i in _oBase[realName]) {
						keyCount++
						arr.push({
							key: i,
							value: String(_oBase[realName][i])
						});
					}
					if (keyCount == 0) {
						arr.push({
							key: "",
							value: ""
						});
					}
					this.$set(_oFrame[i], realName, arr);
				} else if (type == "4") {
					let arr = [];
					if (_oBase[realName]) {
						for (let i in _oBase[realName]) {
							arr.push(_oBase[realName][i]);
						}
					} else {
						arr.push("");
					}
					this.$set(_oFrame[i], realName, arr);
				} else {
					this.$set(_oFrame[i], realName, _oBase[realName]);
				}
			}
		},
		//复制模版
		copyTemplateIns() {
			this.flag_addOrUpdate = true;
			this.onSubmit();
		}
	},
	mounted() {
		this.flag_addOrUpdate =
			this.$route.query._next == "updateTempIns" ? false : true;
		this.addOrUpdate = this.flag_addOrUpdate ? "立即创建" : "立即更新";
		this.isCopy = this.$route.query.isCopy === true ? true : false;
		this.isAdd =
			this.$route.query.isCopy !== true &&
			this.$route.query._next !== "updateTempIns" ?
			true :
			false;
		let self = this;
		this.final_obj = {};
		/**
		 * this.flag_addOrUpdate = false 表示是更新
		 */
		if (!this.flag_addOrUpdate) {
			this.$ajax
				.all([
					getTempInsById({
						id: this.$route.query.id
					}),
					getTempById({
						id: this.$route.query.template_id
					})
				])
				.then(
					this.$ajax.spread(function (_tempIns, _temp) {
						/***
						 * @description Both requests are now complete
						 * @argument _tempIns 模板实例的数据返回
						 * @argument _temp 模板的数据返回
						 */
						/*** 主要是模板实例除meta_data的赋值 */
						self.form = {
							name: _tempIns.data.data.entity.name,
							status: _tempIns.data.data.entity.stat,
							selectTemp: ""
						};
						/*** 主要是模板实例meta_data的传值 */
						self.tempInstancData = _tempIns.data.data.conf.data;
						/*** 主要是模板meta_data的赋值 */
						self.data = _temp.data.data.conf.metaData;
						self.recursiveArrForUp(self.data, self.tempInstancData);
						console.log(self.data);
						/***
						 * 主要是iframe源地址的赋值
						 * 需要首先确定这个模板实例基于的模板有htmlUrl
						 * */
						if (_temp.data.data.entity.htmlUrl) {
							self.ifSrc = `${_temp.data.data.entity.htmlUrl}`;
						}
					})
				);
		}
	}
};
</script>

<style scoped lang="less">
#root {
    width: 100%; // height: 700px;
    position: relative;
    .top {
        width: 800px;
        height: 400px;
        overflow: scroll; // border: 1px solid #000;
        position: fixed;
        left: 50%;
        bottom: 150px;
        margin-left: -400px; // margin-top: -200px;
        z-index: 999;
        background-color: #fff;
        .close {
            width: 30px;
            height: 30px;
            line-height: 30px;
            font-size: 36px;
            position: absolute;
            right: 0;
            top: 0;
            color: #666;
            &:hover {
                color: red;
            }
        }
    }
    .bottom {
        width: 100%;
        height: 100%;
        overflow: scroll; // border: 1px solid #000;
        .piece {
            // padding: 10px;
        }
        margin: 0 auto;
    }
}

.title {
    color: #000;
    height: 38px;
    line-height: 38px;
    font-size: 18px; // background-color: red;
    text-align: right;
    margin-right: 15px;
}
</style>
