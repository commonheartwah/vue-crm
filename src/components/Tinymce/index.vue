<template>
<div class='tinymce-container editor-container'>
	<textarea class='tinymce-textarea' :id="id"></textarea>
</div>
</template>

<script>
import {
	getMaterialsList,
	getVideoFromYouku
} from '../../api/api';

// import { getToken, upload } from 'api/qiniu'; // 七牛
export default {
	name: 'tinymce',
	props: {
		id: {
			type: String,
			default: 'tinymceEditor'
		},
		value: {
			type: String,
			default: ''
		},
		toolbar: {
			type: Array,
			required: false,
			default () {
				return ['undo redo | insert | styleselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | h2 p ', 'media | forecolor backcolor| bold italic | link | codesample | image video audio uploadimage | fontsizeselect']
			}
		},
		data() {
			return {
				hasChange: false,
				hasInit: false
			}
		},
		menubar: {
			default: true
		},
		height: {
			type: Number,
			required: false,
			default: 360
		},
		width: {
			type: Number,
			required: false,
			default: 750
		}
	},
	watch: {
		value(val) {
			if (!this.hasChange && this.hasInit) {
				this.$nextTick(() => tinymce.get(this.id).setContent(val))
			}
		}
	},
	data() {
		return {
			items: [],
			newArr: [],

			name: '',
			totalPage: '',
			page: 1,
			text: 'Fuckaa'
		}
	},
	methods: {
		openMaterialWindow(editorOpenWindow, editor, type) {
			let self = this;
			let para = {
				name: self.name,
				page_size: 9,
				encode_encrypt: 0,
				page_index: self.page
			};
			type == 'video' ? para['type'] = 1 : para['type'] = 2;
			getMaterialsList(para)
				.then((res) => {
					if (res.data.success) {
						this.items = [];
						this.totalPage = res.data.data.totalPage;
						this.page = res.data.data.page;
						let resItems = res.data.data.items;
						if (type == 'video') {
							for (var i = 0; i < resItems.length; i++) {
								if (i == 0 || i % 3 == 0) {
									this.newArr = [];
								};
								var videoItem = [{
									type: 'container',
									name: 'itemImage',
									minHeight: 160,
									html: resItems[i].conf.posterImgUrl ? `<section style="height:135px;overflow:hidden;"><img src="${ resItems[i].conf.posterImgUrl} " alt="" style="width:100%;"></section>` : `<section style="height:135px;"><img src="./static/images/defaultPostVideoImg.png" alt="" style="width:100px;margin:20px 0 0 70px;"></section>`,
									style: 'width:240px;',
									videoUrl: resItems[i].entity.url,
									videoId: resItems[i].entity.id,
									videoPosterImgUrl: resItems[i].conf.posterImgUrl,
									onclick: function() {
										editor.insertContent("<video src= " + this.settings.videoUrl + " data-babyfs-mid = " + this.settings.videoId + " width='300' height='150' controls data-babyfs-type='video' controlsList='nodownload'></video>");
										editorOpenWindow.close();
									}
								}, {
									type: 'container',
									name: 'itemName',
									minHeight: 20,
									html: `<p style="text-align:center;margin-top:8px;cursor: pointer;color:#36b3b3;">${ resItems[i].entity.name }</p>`,
									style: 'width:240px;',
									videoId: resItems[i].entity.id,
									videoUrl: resItems[i].entity.url,
									videoPosterImgUrl: resItems[i].conf.posterImgUrl,
									onclick: function() {
										editor.windowManager.open({
											type: 'container',
											align: 'center',
											width: 700,
											height: 350,
											padding: '25 0 0 0',
											title: '视频播放',
											html: `<video controls src="${ this.settings.videoUrl }" type="video" style='width:700px;height:350px;' controlsList="nodownload"></video>`,
											buttons: [{
												text: 'Close',
												onclick: 'close'
											}]
										})
									}
								}]
								this.newArr.push({
									type: 'container',
									name: 'itemSingle',
									minHeight: 180,
									items: videoItem,
									style: 'width:240px;',
								});
								if (i % 3 == 0) {
									this.items.push({
										type: 'container',
										name: 'itemsRow',
										minHeight: 150,
										layout: 'flex',
										direction: 'row',
										padding: '0 20 0 0',
										spacing: 10,
										items: this.newArr,
									});
								};
							};
						} else {
							this.newArr = [];
							this.items = [];
							for (var i = 0; i < resItems.length; i++) {
								this.newArr.push({
									type: 'container',
									name: 'itemVideo',
									html: `<div style='margin:0 0 20px 0;width:650px;display:flex;justify-content: space-between;'><audio preload="none" src="${ resItems[i].entity.url} " controls controlsList="nodownload" type="${ resItems[i].entity.mimeType }" style='width:400px;height:40px;margin-right:10px'></audio><span style='line-height:40px;width:230px;display:inline-block;'>${ resItems[i].entity.name }</span></div>`,
									videoUrl: resItems[i].entity.url,
									videoId: resItems[i].entity.id,
									onclick: function() {
										editor.insertContent("<audio src= " + this.settings.videoUrl + " data-babyfs-mid = " + this.settings.videoId + " width='300' height='150' controls data-babyfs-type='audio' controlsList='nodownload'></audio>");
										editorOpenWindow.close();
									}
								})
							};
							this.items.push({
								type: 'container',
								name: 'audioSuite',
								margin: '0 0 20 0',
								items: this.newArr,
							})
						}
						let items = function() {
							let list = [];
							let page = self.page;
							if (self.totalPage < 9) {
								page = 1
							} else {
								if (self.page <= 5) {
									page = 1
								} else {
									page = self.page - 4;
								}
								if (self.page >= self.totalPage - 4) {
									page = self.totalPage - 8;
								}
							}

							list.push({
								name: '<<',
								type: 'button',
								text: '<<',
								hidden: self.page < 2 ? true : false,
								style: 'border: 1px solid #d1dbe5;background:#fff;',
								onclick() {
									this.parent().prev().remove();
									this.parent().remove();
									self.page = 1;
									self.openMaterialWindow(this.parent().parent(), editor, type);
								}
							});
							list.push({
								name: '上一页',
								type: 'button',
								text: '上一页',
								style: 'border: 1px solid #d1dbe5;background:#fff;',
								hidden: self.page < 2 ? true : false,
								onclick() {
									this.parent().prev().remove();
									this.parent().remove();
									self.page = self.page - 1;
									self.openMaterialWindow(this.parent().parent(), editor, type);
								}
							});
							for (var i = 0; i < (self.totalPage > 9 ? 9 : self.totalPage); i++) {
								let itemIndex = {
									name: i + 1,
									type: 'button',
									text: page,
									style: self.page == page ? 'border: 1px solid #b1b1b1;' : 'border: 1px solid #d1dbe5;background:#fff;',
									onclick() {
										this.parent().prev().remove();
										this.parent().remove();
										self.page = this.text();
										self.openMaterialWindow(this.parent().parent(), editor, type);
									}
								};
								page++;
								list.push(itemIndex)
							};
							list.push({
								name: '下一页',
								type: 'button',
								text: '下一页',
								style: 'border: 1px solid #d1dbe5;background:#fff;',
								hidden: self.page >= self.totalPage ? true : false,
								onclick() {
									this.parent().prev().remove();
									this.parent().remove();
									self.page = self.page + 1;
									self.openMaterialWindow(this.parent().parent(), editor, type);
								}
							});
							list.push({
								name: '>>',
								type: 'button',
								text: '>>',
								style: 'border: 1px solid #d1dbe5;background:#fff;',
								hidden: self.page >= self.totalPage ? true : false,
								onclick() {
									this.parent().prev().remove();
									this.parent().remove();
									self.page = self.totalPage;
									self.openMaterialWindow(this.parent().parent(), editor, type);
								}
							});
							return list
						};
						let Pagination = {
							type: 'buttongroup',
							layout: 'flex',
							direction: 'row',
							align: 'center',
							spacing: 5,
							items: items()
						};
						editorOpenWindow.append([{
							type: 'container',
							name: 'container',
							layout: 'flex',
							direction: 'column',
							items: this.items,
						}, Pagination]);
					};
				})
				.catch((error) => {
					if (error.response) {
						this.$notify({
							title: error.response.status,
							message: '网络请求错误',
							type: 'error'
						})
					}else if(error.request){
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					}else{
						this.$notify({
							title: '错误',
							message: error.message,
							type: 'error'
						})
					}
				})
		},
	},
	mounted() {
		const _this = this;
		var initIfo = {
			selector: `#${this.id}`,
			height: this.height,
			width: this.width,
			body_class: 'panel-body ',
			object_resizing: false,
			language: 'zh_CN',
			language_url: '/static/tinymce/langs/zh_CN.js',
			menubar: this.menubar,
			plugins: [
				'advlist autolink lists link image charmap print preview hr anchor pagebreak',
				'searchreplace wordcount visualblocks visualchars code fullscreen',
				'insertdatetime media nonbreaking save table contextmenu directionality',
				'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help uploadimage'
			],
			toolbar1: this.toolbar[0],
			toolbar2: this.toolbar[1],
			image_advtab: true,
			media_live_embeds: true,
			video_template_callback: function(data) {
				return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls" autoplay>\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime +
					'"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
			},
			end_container_on_empty_block: true,
			powerpaste_word_import: 'clean',
			code_dialog_height: 450,
			code_dialog_width: 1000,
			advlist_bullet_styles: 'square',
			advlist_number_styles: 'default',
			block_formats: '普通标签=p;小标题=h2;',
			imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
			imagetools_toolbar: 'watermark',
			default_link_target: '_blank',
			upload_image_url: '/op/material/upload_image',
			plugin_preview_width: 375,
			plugin_preview_height: 667,

			templates: [
				{
		      title: "Editor templat No.1",
		      url: "../../../static/tinymce/template/template1.html",
		      description: "四角双层方框"
		    },
				{
		      title: "Editor templat No.2",
		      url: "../../../static/tinymce/template/template2.html",
		      description: "虚线方框"
		    },
				{
		      title: "Editor templat No.3",
		      url: "../../../static/tinymce/template/template3.html",
		      description: "模板三"
		    },
				{
		      title: "Editor templat No.4",
		      url: "../../../static/tinymce/template/template4.html",
		      description: "Today.I wanna say"
		    },
				{
		      title: "Editor templat No.5",
		      content: `<section style="border: 0px none; padding: 0px;">
					    <p>
					        <br/>
					    </p>
					</section>
					<section style="text-align:center;">
					    <section style="display:inline-block;width:30px;">
					        <img data-id="89715" data-role="guide-img" style="max-width: 100%; width: 30px; display: inline;" title="分割线  箭头 动态" src="http://image2.135editor.com/cache/remote/aHR0cDovL21tYml6LnFwaWMuY24vbW1iaXpfZ2lmLzRCWTRubjg3SVRrWWliWFNyZzRha1FpY0ZpYW5OSkNHMlczaWFLWFBYd1preFdRRjVEdGg1WGtqUkR4RnI3Y29pYWpDWGVLb0tMMWpxTFQ1MDFpYXp5MTFweFh3LzA/d3hfZm10PWdpZg=="/>
					    </section>
					</section>`,
		      description: "分割线、箭头、动态"
		    },
			],

			fontsize_formats: '12px 14px 18px 20px 24px 28px 36px 44px',
			// font_formats: "Arial='Arial',Helvetica,Arial,sans-serif;Times New Roman='Times New Roman',Helvetica,Arial,sans-serif;宋体='宋体',Helvetica,Arial,sans-serif;仿宋='仿宋',Helvetica,Arial,sans-serif;仿宋GB2312='仿宋GB2312',Helvetica,Arial,sans-serif;楷体='楷体',Helvetica,Arial,sans-serif;黑体='黑体',Helvetica,Arial,sans-serif;华文新魏='华文新魏',Helvetica,Arial,sans-serif;隶书='隶书',Helvetica,Arial,sans-serif",

			link_title: false,
			init_instance_callback: editor => {
				if (_this.value) {
					editor.setContent(_this.value)
				}
				_this.hasInit = true;
				editor.on('NodeChange Change KeyUp', () => {
					this.hasChange = true;
					this.$emit('input', editor.getContent());
				});
			},
			setup(editor) {
				editor.addButton('h2', {
					title: '小标题', // tooltip text seen on mouseover
					text: '小标题',
					onclick() {
						editor.execCommand('mceToggleFormat', false, 'h2');
					},
					onPostRender() {
						const btn = this;
						editor.on('init', () => {
							editor.formatter.formatChanged('h2', state => {
								btn.active(state);
							});
						});
					}
				});
				editor.addButton('p', {
					title: '正文',
					text: '正文',
					onclick() {
						editor.execCommand('mceToggleFormat', false, 'p');
					},
					onPostRender() {
						const btn = this;
						editor.on('init', () => {
							editor.formatter.formatChanged('p', state => {
								btn.active(state);
							});
						});
					}
				});
				editor.addButton('video', {
					title: '视频',
					text: '视频',
					onclick() {
						editor.windowManager.open({
							type: 'container',
							layout: 'flex',
							direction: 'column',
							align: 'center',
							width: 800,
							height: 660,
							padding: '25 0 0 0',
							title: '视频选择',
							items: [{
								type: 'container',
								layout: 'flex',
								direction: 'row',
								align: 'center',
								padding: '25 0 0 0',
								spacing: 5,
								items: [{
										name: 'videoName',
										type: 'textbox',
										size: 80,
										ariaLabel: 'videoName',
										tooltip: '请输入视频名字查询',
										border: '0 0 1 0'
									},
									{
										name: '查询',
										type: 'button',
										text: '查询',
										onclick: function() {
											let editorWindow = this.parent().parent();
											_this.name = this.prev().value();
											this.parent().next().remove();
											this.parent().next().remove();
											_this.openMaterialWindow(editorWindow, editor, 'video')
										}
									}
								],
							}],
							buttons: [{
								text: 'Close',
								onclick: 'close'
							}],
							onPostRender() {
								_this.openMaterialWindow(this, editor, 'video')
							}
						})
					}
				});
				editor.addButton('audio', {
					title: '音频',
					text: '音频',
					onclick() {
						editor.windowManager.open({
							type: 'container',
							layout: 'flex',
							direction: 'column',
							align: 'center',
							width: 800,
							height: 660,
							padding: '25 0 0 0',
							title: '音频选择',
							items: [{
								type: 'container',
								layout: 'flex',
								direction: 'row',
								align: 'center',
								padding: '25 0 0 0',
								spacing: 5,
								items: [{
										name: 'audioName',
										type: 'textbox',
										size: 80,
										ariaLabel: 'audioName',
										tooltip: '请输入音频名字查询',
										border: '0 0 1 0'
									},
									{
										name: '查询',
										type: 'button',
										text: '查询',
										onclick: function() {
											let editorWindow = this.parent().parent();
											_this.name = this.prev().value();
											this.parent().next().remove();
											this.parent().next().remove();
											_this.openMaterialWindow(editorWindow, editor, 'audio')
										}
									}
								],
							}],
							buttons: [{
								text: 'Close',
								onclick: 'close'
							}],
							onPostRender() {
								_this.openMaterialWindow(this, editor, 'audio')
							}
						})
					}
				});
				editor.addButton('youku', {
					title: '优酷',
					text: '优酷',
					onclick() {
						editor.windowManager.open({
							type: 'container',
							layout: 'flex',
							direction: 'column',
							align: 'center',
							width: 700,
							height: 415,
							title: '添加优酷视频',
							body: [{
								type: 'container',
								layout: 'flex',
								direction: 'row',
								align: 'center',
								style: "padding:0 0 0 20px;",
								spacing: 5,
								items: [{
										name: 'youkuUrl',
										type: 'textbox',
										label: 'youkuUrl',
										size: 80,
										border: '0 0 1 0',
									},
									{
										name: '视频预览',
										type: 'button',
										text: '视频预览',
										onclick: function() {
											let params = {
												url: this.prev().value()
											}
											getVideoFromYouku(params)
												.then((res) => {
													/*
														视频获取成功之后替换原先 的item。
														this.parent().next()   -> 	视频组件
														this.parent().parent()   -> 	视频组件的父元素
													*/
													this.parent().next().remove();
													this.parent().parent().append({
														type: 'container',
														align: 'center',
														width: 700,
														height: 350,
														padding: '25 0 0 0',
														title: '视频预览',
														html: `<video controls src="${ res.data.data.mp4Segs[0].cdn_url }" type="video" style='width:700px;height:350px;' preload="none" controlsList='nodownload' autoplay="true"></video>`
													});
												})
												.catch((error) => {
													if (error.response) {
														_this.$notify({
															title: error.response.status,
															message: '网络请求错误',
															type: 'error'
														})
													}else if(error.request){
														_this.$notify({
															title: error.request,
															message: '网络请求错误',
															type: 'error'
														})
													}else{
														_this.$notify({
															title: '错误',
															message: error.message,
															type: 'error'
														})
													}
												})
										}
									}
								],
							},
							{
								type: 'container',
								align: 'center',
								width: 700,
								height: 350,
								padding: '25 0 0 0',
								title: '视频播放',
								html: `<video controls src="" type="video" style='width:700px;height:350px;' preload="none" controlsList='nodownload'></video>`,
							}],
							onsubmit: function(e) {
								let params = {
									url: e.data.youkuUrl
								}
								getVideoFromYouku(params)
									.then((res) => {
										editor.insertContent("<video data-babyfs-mid= 'r_yk_" + res.data.data.vid + "' width='300' height='150' controls data-babyfs-type='video'></video>");
									})
									.catch((error) => {
										if (error.response) {
											_this.$notify({
												title: error.response.status,
												message: '网络请求错误',
												type: 'error'
											})
										}else if(error.request){
											_this.$notify({
												title: error.request,
												message: '网络请求错误',
												type: 'error'
											})
										}else{
											_this.$notify({
												title: '错误',
												message: error.message,
												type: 'error'
											})
										}
									})
							}
						})
					}
				});
			}
		};
		tinymce.init(initIfo)
	},
	destroyed() {
		tinymce.get(this.id).destroy();
	}
}
</script>

<style scoped>
.tinymce-container {
	position: relative
}

.tinymce-textarea {
	visibility: hidden;
	z-index: -1;
}

.editor-custom-btn-container {
	position: absolute;
	right: 15px;
	top: 18px;
}

.editor-upload-btn {
	display: inline-block;
}
</style>
