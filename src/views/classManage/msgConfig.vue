<template lang="html">
    <section>
        <el-form :model='msgDetailObj' label-width='120px' ref="msgDetailObj" :rules='msgDetailObjRules'>
            <el-form-item label='班级通知名称' prop='noticeName'>
				<el-input v-model='msgDetailObj.noticeName' auto-complete='off' style='width:600px'></el-input>
            </el-form-item>
            <el-form-item label='班级推送标题' prop='pushTitle' v-if='msgDetailObj.pushStat == 1'>
				<el-input v-model='msgDetailObj.pushTitle' auto-complete='off' style='width:600px'></el-input>
            </el-form-item>
            <el-form-item label='班级推送内容' prop='noticeContent' v-if='msgDetailObj.pushStat == 1'>
				<el-input v-model='msgDetailObj.noticeContent' auto-complete='off' type='textarea' style='width:600px' :rows='6'></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='noticeDescription'>
				<el-input v-model='msgDetailObj.noticeDescription' auto-complete='off' type='textarea' style='width:600px' :rows='6'></el-input>
            </el-form-item>
            <el-form-item label='是否置顶' prop="topStat">
                <el-radio class="radio" v-model="msgDetailObj.topStat" :label='1'>置顶</el-radio>
                <el-radio class="radio" v-model="msgDetailObj.topStat" :label='0'>不置顶</el-radio>
            </el-form-item>
            <el-form-item label='是否push' prop="pushStat">
                <el-radio class="radio" v-model="msgDetailObj.pushStat" :label='1'>push</el-radio>
                <el-radio class="radio" v-model="msgDetailObj.pushStat" :label='0'>不push</el-radio>
            </el-form-item>
            <el-form-item label='时间范围' prop='topDate' v-if='msgDetailObj.topStat == 1'>
                <!-- <el-date-picker v-model="msgDetailObj.topDate" type="datetimerange" placeholder="选择时间范围"></el-date-picker> -->
                <el-date-picker v-model="msgDetailObj.topDate" type="datetimerange" placeholder="置顶选择时间范围"></el-date-picker>
            </el-form-item>
        </el-form>
        <el-form :model='linkObjData' label-width='120px' ref="linkObjData" :rules='linkObjDataRules'>
            <el-form-item label='外链标题' prop='Title' v-if='linkType'>
				<el-input v-model='linkObjData.Title' auto-complete='off' style='width:600px'></el-input>
            </el-form-item>
            <el-form-item label='外链副标题' prop='SubTitle' v-if='linkType'>
				<el-input v-model='linkObjData.SubTitle' auto-complete='off' style='width:600px'></el-input>
            </el-form-item>
            <el-form-item label='外链链接' prop='LinkUrl' v-if='linkType'>
				<el-input v-model='linkObjData.LinkUrl' auto-complete='off' style='width:600px'></el-input>
            </el-form-item>
            <el-form-item label='外链图片链接' prop='PosterUrl' v-if='linkType'>
				<el-input v-model='linkObjData.PosterUrl' auto-complete='off' style='width:600px'></el-input>
            </el-form-item>
            <el-form-item label='外链内容' prop='Content' v-if='linkType'>
				<el-input v-model='linkObjData.Content' auto-complete='off' style='width:600px' type='textarea' :rows='6'></el-input>
            </el-form-item>
        </el-form>
        <div v-if="msgBodyArr.length > 0 " v-loading='msgBodyLoading' element-loading-text="努力加载中">
    		<draggable :list="msgBodyArr">
    			<div v-for='(pro, index) in msgBodyArr' :key='index'  class="msg-style">
					<el-form label-width='100px'>
                        <el-form-item label='文本信息' prop='text' v-if="pro.MsgType == 'TIMTextElem'">
            				<el-input v-model='pro.text' auto-complete='off' type='textarea' style='width:600px' :rows='6'></el-input>
                        </el-form-item>
                        <el-form-item label='图片消息' prop='image' v-if="pro.MsgType == 'TIMImageElem'">
                            <el-button type="primary" @click="previewMedia(0, pro.materialId)" style="float:left;">预览</el-button>
                            <uploadMethods :oProp="0" :oVal="'materialId'" v-on:child-say='assign($event, pro)' class="review-upload"></uploadMethods>
                        </el-form-item>
                        <el-form-item label='音频消息' prop='image' v-if="pro.MsgType == 'TIMCustomAudioElem'">
                            <el-button type="primary" @click="previewMedia(0, pro.materialId)" style="float:left;">预览</el-button>
							<el-tooltip class="item" effect="dark" :content="pro.name" placement="top-start" v-if='pro.name'>
								<span class="media-info" v-if='pro.name'>{{pro.name}}</span>
							</el-tooltip>
							<uploadMethods :oProp="2" :oVal="'materialId'" v-on:child-say='assign($event, pro)' class="review-upload"></uploadMethods>
                        </el-form-item>
                        <el-form-item label='视频消息' prop='image' v-if="pro.MsgType == 'TIMCustomVideoElem'">
                            <el-button type="primary" @click="previewMedia(0, pro.materialId)" style="float:left;">预览</el-button>
                            <el-tooltip class="item" effect="dark" :content="pro.name" placement="top-start" v-if='pro.name'>
								<span class="media-info" v-if='pro.name'>{{pro.name}}</span>
							</el-tooltip>
                            <uploadMethods :oProp="1" :oVal="'materialId'" v-on:child-say='assign($event, pro)' class="review-upload"></uploadMethods>
                        </el-form-item>
                        <el-button-group style="margin-left:40px">
        					<el-button type="success" @click='delMsg(index)'>删除消息</el-button>
        				</el-button-group>
                    </el-form>
    			</div>
    		</draggable>
    	</div>
        <el-dialog :visible.sync="iconPreviewIsShow" :close-on-click-modal='false'>
            <img :src="showImgSrc" alt="" class="show-img">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="iconPreviewIsShow = false">关闭</el-button>
            </div>
        </el-dialog>
        <section class="addNew" v-if='!linkType' style="margin-left:10px;">
            <el-select expand-trigger="hover"  v-model="msgType" :change-on-select='true'>
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" @click="addMsgItem" slot="append">新建节点</el-button>
        </section>
        <el-button type="primary" @click="submitAddMsg" v-if='isAdd' style="margin-top:30px;">保存</el-button>
        <el-button type="primary" @click="submitEditMsg" v-if='(!isAdd&&haveSend==0)' style="margin-top:30px;">保存</el-button>
        <el-button type="info" @click="validateMsg" v-if='msgDetailObj.validateState == 1' style="margin-top:30px;">审核</el-button>

        <div class="preview-video-container" v-show="previewVideoVisible">
    		<div class="mask" @click="stopPreviewVideo"></div>
    		<video controls ref="oVideo"></video>
    	</div>
        <div class="preview-audio-container" v-show="previewAudioVisible">
            <div class="mask" @click="stopPreviewAudio"></div>
            <audio controls ref="oAudio"></audio>
        </div>
        <!-- 审核弹窗 -->
        <el-dialog title='审核' :visible.sync="vaildateDialog" :close-on-click-modal='false'>
            <el-radio-group v-model="vaildateStatus">
                <el-radio :label="3">审核通过</el-radio>
                <el-radio :label="2">审核不通过</el-radio>
            </el-radio-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="vaildateDialog = false">取消</el-button>
                <el-button type="primary" @click.native="submitVaildateMsg">发送</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import {
	getGroupNoticeList,
	addGroupNoticeList,
	updateGroupNoticeList,
	getMaterialsList,
	getDownloadUrl,
	groupNoticeValidate
} from '../../api/api'
import uploadMethods from '../../components/word-sentence-library/uploadMethods'
import draggable from 'vuedraggable'

export default {
	components: {
		draggable,
		uploadMethods
	},
	data() {
		return {
			msgDetailObjRules: {
				noticeName: [{
					required: true,
					message: '请输入班级通知',
					trigger: 'blur'
				}],
				pushTitle: [{
					required: true,
					message: '请输入推送标题',
					trigger: 'blur'
				}],
				noticeContent: [{
					required: true,
					message: '请输入推送内容',
					trigger: 'blur'
				}],
			},
			linkObjDataRules: {
				Title: [{
					required: true,
					message: '请输入班级通知',
					trigger: 'blur'
				}],
				LinkUrl: [{
					required: true,
					message: '请输入班级通知',
					trigger: 'blur'
				}],
				PosterUrl: [{
					required: true,
					message: '请输入班级通知',
					trigger: 'blur'
				}],
				Content: [{
					required: true,
					message: '请输入班级通知',
					trigger: 'blur'
				}],
			},
			typeOptions: [{
				value: 'TIMTextElem',
				label: '文字',
			}, {
				value: 'TIMImageElem',
				label: '图片',
			}, {
				value: 'TIMCustomAudioElem',
				label: '音频',
			}, {
				value: 'TIMCustomVideoElem',
				label: '视频',
			}],
			msgType: 'TIMTextElem',
			msgDetailObj: {
				noticeName: '',
				pushTitle: '',
				noticeContent: '',
				noticeDescription: '',
				status: 1,
				MsgBody: '',
				topStat: 0,
				topDate: [new Date(), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000)],
				// topDate: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				validateState: '',
				pushStat: 0
			},
			msgBodyArr: [],
			msgBodyLink: [],
			msgBodyLoading: false,
			msgLinkType: false,
			iconPreviewIsShow: false,
			vaildateDialog: false,
			msgId: '',
			linkType: false,
			userType: false,
			linkObjData: {
				LinkUrl: '',
				PosterUrl: '',
				Title: '',
				SubTitle: '',
				Content: ''
			},
			isAdd: true,
			previewVideoVisible: false,
			previewAudioVisible: false,
			showImgSrc: '',
			vaildateStatus: 3,
			haveSend: 0,
		}
	},
	methods: {
		// 如果是详情页
		loadData() {
			let para = {
				id: this.msgId
			}
			getGroupNoticeList(para).then(res => {
				if (res.data.success) {
					if (res.data.data.items[0]) {
						let dataEntity = res.data.data.items[0].entity;
						let dataConf = res.data.data.items[0].parsed;
						this.msgDetailObj.noticeName = dataEntity.name;
						this.msgDetailObj.pushTitle = dataEntity.pushTitle;
						this.msgDetailObj.noticeContent = dataEntity.pushContent;
						this.msgDetailObj.noticeDescription = dataEntity.description;
						this.msgDetailObj.status = dataEntity.stat
						this.msgDetailObj.topStat = dataConf.TopStat
						this.msgDetailObj.pushStat = dataEntity.pushStat
						if (dataConf.StartTime && dataConf.EndTime) {
							this.msgDetailObj.topDate = [new Date(dataConf.StartTime), new Date(dataConf.EndTime)]
						} else {
							this.msgDetailObj.topDate = [new Date(), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000)]
						}
						this.msgDetailObj.validateState = dataEntity.validateState
						if (dataConf.MsgBody && dataConf.MsgBody.length > 0) {
							if (dataEntity.msgType.indexOf('7') > -1) {
								this.linkType = true
								this.linkObjData = dataConf.MsgBody[0].MsgContent
							} else {
								this.msgBodyArr = dataConf.MsgBody
								this.msgBodyArr = dataConf.MsgBody.map((item, index) => {
									let tempObj;
									if (item.MsgType == 'TIMTextElem') {

										tempObj = {
											MsgType: item.MsgType,
											text: item.MsgContent.Text
										}
									} else if (item.MsgType == 'TIMImageElem') {
										tempObj = {
											MsgType: item.MsgType,
											materialId: item.MsgContent.ImageInfoArray[0].MaterialId
										}
									} else if (item.MsgType == 'TIMCustomAudioElem' || item.MsgType == 'TIMCustomVideoElem') {
										tempObj = {
											MsgType: item.MsgType,
											materialId: item.MsgContent.MaterialId,
											name: item.MsgContent.Name
										}
									}
									return tempObj
								});
							}
						}
					}
				} else {
					this.$notify({
						title: "错误",
						message: res.data.msg,
						type: "error"
					});
				}
			})
		},
		// 添加消息条目
		addMsgItem() {
			this.msgBodyArr.push({
				MsgType: this.msgType
			})
		},
		submitAddMsg() {
			this.$refs.msgDetailObj.validate(valid => {
				if (valid) {
					this.$refs.linkObjData.validate(_valid => {
						if (_valid) {
							if (this.userType) {
								if (this.msgBodyArr && this.msgBodyArr.length) {
									this.msgBodyArr.map(item => {
										if (item.MsgType === "TIMTextElem") {
											item.MsgContent = {
												"Text": item.text
											}
											delete item.text
										}
										if (item.MsgType === "TIMImageElem") {
											item.MsgContent = {
												"ImageInfoArray": [{
													"Type": 1,
													"MaterialId": item.materialId
												}]
											}
											delete item.materialId
										}
										if (item.MsgType === "TIMCustomAudioElem" || item.MsgType === "TIMCustomVideoElem") {
											item.MsgContent = {
												'MaterialId': item.materialId
											}
											delete item.materialId
										}
									})
								}
							} else if (this.linkType) {
								this.msgBodyLink.push({
									MsgType: 'TIMCustomLinkElem',
									MsgContent: {
										LinkUrl: this.linkObjData.LinkUrl,
										PosterUrl: this.linkObjData.PosterUrl,
										Title: this.linkObjData.Title,
										SubTitle: this.linkObjData.SubTitle,
										Content: this.linkObjData.Content
									}
								})
							}
							let msgBody;
							if (this.linkType) {
								msgBody = {
									MsgBody: this.msgBodyLink
								}
							} else {
								msgBody = {
									MsgBody: this.msgBodyArr
								}
							}

							let para = {
								notice_name: this.msgDetailObj.noticeName,
								push_title: this.msgDetailObj.pushTitle,
								push_content: this.msgDetailObj.noticeContent,
								notice_description: this.msgDetailObj.noticeDescription,
								status: this.msgDetailObj.status,
								top_stat: this.msgDetailObj.topStat,
								push_stat: this.msgDetailObj.pushStat,
								start_time: new Date(this.msgDetailObj.topDate[0]).getTime(),
								end_time: new Date(this.msgDetailObj.topDate[1]).getTime(),
								msg_body: JSON.stringify(msgBody),
							}
							addGroupNoticeList(para).then(res => {
									if (res.data.success) {
										this.$notify({
											title: "成功",
											message: '添加成功',
											type: "success"
										});
										this.$router.push({
											path: '/msgManage'
										})
									} else {
										this.$notify({
											title: "错误",
											message: res.data.msg,
											type: "error"
										});
									}
								})
								.catch(error => {
									this._catch(error);
								})
						}
					})
				}
			})

		},
		// 审核
		validateMsg() {
			this.vaildateDialog = true;
		},
		// 提交审核状态
		submitVaildateMsg() {
			let para = {
				id: this.msgId,
				validate_state: this.vaildateStatus
			}
			groupNoticeValidate(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: "成功",
							message: '提审状态修改成功',
							type: "success"
						});
						this.loadData();
						this.vaildateDialog = false;
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error)
				})
		},
		// 上传组件调用
		assign(val, item) {
			this.$set(item, val.oVal, val.id)
		},
		// 编辑消息
		submitEditMsg() {
			this.$confirm('是否确认修改?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$refs.msgDetailObj.validate(valid => {
						if (valid) {
							this.$refs.linkObjData.validate(_valid => {
								if (_valid) {
									let msgBody;
									this.msgBodyLink = [];
									this.msgBodyArr = [];
									if (this.linkType) {
										this.msgBodyLink.push({
											MsgType: 'TIMCustomLinkElem',
											MsgContent: {
												LinkUrl: this.linkObjData.LinkUrl,
												PosterUrl: this.linkObjData.PosterUrl,
												Title: this.linkObjData.Title,
												SubTitle: this.linkObjData.SubTitle,
												Content: this.linkObjData.Content
											}
										})
									} else {
										if (this.msgBodyArr && this.msgBodyArr.length) {
											this.msgBodyArr.map(item => {
												if (item.MsgType === "TIMTextElem") {
													item.MsgContent = {
														"Text": item.text
													}
													delete item.text
												}
												if (item.MsgType === "TIMImageElem") {
													item.MsgContent = {
														"ImageInfoArray": [{
															"Type": 1,
															"MaterialId": item.materialId
														}]
													}
													delete item.materialId
												}
												if (item.MsgType === "TIMCustomAudioElem" || item.MsgType === "TIMCustomVideoElem") {
													item.MsgContent = {
														'MaterialId': item.materialId
													}
													delete item.materialId
												}
											})
										}
									}
									if (this.linkType) {
										msgBody = {
											MsgBody: this.msgBodyLink
										}
									} else {
										msgBody = {
											MsgBody: this.msgBodyArr
										}
									}
									let para = {
										id: this.msgId,
										notice_name: this.msgDetailObj.noticeName,
										push_title: this.msgDetailObj.pushTitle,
										push_content: this.msgDetailObj.noticeContent,
										notice_description: this.msgDetailObj.noticeDescription,
										status: this.msgDetailObj.status,
										top_stat: this.msgDetailObj.topStat,
										push_stat: this.msgDetailObj.pushStat,
										start_time: new Date(this.msgDetailObj.topDate[0]).getTime(),
										end_time: new Date(this.msgDetailObj.topDate[1]).getTime(),
										msg_body: JSON.stringify(msgBody)
									}
									updateGroupNoticeList(para).then(res => {
											if (res.data.success) {
												this.$notify({
													title: '成功',
													message: '修改成功',
													type: 'success'
												})
												this.loadData()
											} else {
												this.$notify({
													title: '失败',
													message: res.data.msg,
													type: 'error'
												})
											}
										})
										.catch(error => {
											this._catch(error)
										})
								}
							})
						}
					})
				})
				.catch(error => {
					this.$notify({
						title: "取消",
						message: '取消修改',
						type: "error"
					});
				})

		},
		//删除消息
		delMsg(index) {
			this.msgBodyArr.splice(index, 1)
		},
		// 停止播放
		stopPreviewVideo() {
			this.previewVideoVisible = !this.previewVideoVisible;
			this.$refs.oVideo.pause();
		},
		stopPreviewAudio() {
			this.previewAudioVisible = !this.previewAudioVisible;
			this.$refs.oAudio.pause();
		},
		// 预览
		previewMedia(flag, temp) {
			let id;
			if (flag == 1) {
				if (!temp) {
					this.$notify({
						title: "警告",
						message: "未配置音视频",
						type: "warning"
					});
					return false;
				} else {
					id = temp.id;
				}
			} else {
				id = temp;
			}
			if (id) {
				getMaterialsList({
					id: id
				}).then(res => {
					if (res.data.success) {
						let mp4Reg = /\.mp4$/;
						let mp3Reg = /\.mp3$/;
						let responseEntity = res.data.data.items[0].entity;
						getDownloadUrl({
							id: id
						}).then(res => {
							if (res.data.success) {
								if (mp4Reg.test(responseEntity.url)) {
									this.previewVideoVisible = true;
									this.previewAudioVisible = false;
									// this.$refs.oAudio.pause();
									this.$refs.oVideo.src = res.data.data.url;
									this.$refs.oVideo.play();
								} else if (mp3Reg.test(responseEntity.url)) {
									this.previewAudioVisible = true;
									this.previewVideoVisible = false;
									this.$refs.oVideo.pause();
									this.$refs.oAudio.src = res.data.data.url;
									this.$refs.oAudio.play();
								} else {
									this.iconPreviewIsShow = true;
									this.showImgSrc = res.data.data.url
								}
							} else {
								this.$notify({
									title: "错误",
									message: res.data.msg,
									type: "error"
								});
							}
						});
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				});
			} else {
				this.$notify({
					title: "警告",
					message: "未配置音视频",
					type: "warning"
				});
			}
		},
		// 错误信息
		_catch(error) {
			if (error.response) {
				this.$notify({
					title: error.response.status,
					message: '网络请求错误',
					type: 'error'
				})
			} else if (error.request) {
				this.$notify({
					title: error.request,
					message: '网络请求错误',
					type: 'error'
				})
			} else {
				this.$notify({
					title: '错误',
					message: error.message,
					type: 'error'
				})
			}
		},
	},
	mounted() {
		if (this.$route.query && this.$route.query.msgId) {
			this.msgId = this.$route.query.msgId;

			this.isAdd = false
			this.loadData()
		}
		this.$route.query.haveSend ? this.haveSend = this.$route.query.haveSend : this.haveSend = 0
		if (this.$route.query && this.$route.query.type == 'linkType') {
			this.linkType = true;
		}
		if (this.$route.query && this.$route.query.type == 'userDefine') {
			this.userType = true;
		}

	}
}
</script>

<style lang="less" scoped>
.review-upload {
    // display: inline-block;
    display: inline-block;
    width: 500px;
    margin-left: 20px;
    float: left;
}
.msg-style {
    margin: 10px;
    background: #fafdfd;
    padding: 20px;
    border: 1px solid #000;
}
.preview-video-container {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
    z-index: 9999;
    video {
        width: 100%;
    }
}
.media-info {
    float: left;
    width: 150px;
    margin-left: 10px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.show-img {
    width: 80%;
    height: 80%;
    margin: 0 auto;
}
</style>
