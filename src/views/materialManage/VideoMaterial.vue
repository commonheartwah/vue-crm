<template lang="html">
  <div class="videoPage" v-loading='listLoading' element-loading-text="努力加载中...">
    <el-row>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline=true :model='filters'>
          <el-form-item>
            <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='视频名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model='filters.tags' placeholder='标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTags" @keydown.native.prevent.enter='loadList'></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model='filters.userId' placeholder='上传用户ID' icon="circle-cross" :on-icon-click="handleIconClick_clearUserId" @keydown.native.prevent.enter='loadList'></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="filters.access_type"
              filterable
              allow-create
              placeholder="访问类型"
              style="width:105px"
            >
              <el-option
                v-for="item in accessTypeArray"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='loadList'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-dropdown split-button type="primary" @command="enterIn_avUploadPage">
              上传方式
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">裁剪上传</el-dropdown-item>
                <el-dropdown-item command="2">无裁剪上传</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 主体内容 -->
    <section id="videoMain">
      <el-card class="pieces" v-for="(item, index) in data" :key="item"  :body-style="{ padding: '0px' }">
        <div :class="item.conf.posterImgUrl ? 'ownImg' : 'defaultImg'">
          <img :src="item.conf.posterImgUrl ? item.conf.posterImgUrl : '../../../static/images/defaultPostVideoImg.png'" alt="" @click="switchPlayerFunc(item)">
        </div>
        <div class="creat-time">{{ item.entity.ct | formatTime }}</div>
        <!-- <el-button type="text" class="button switchPlayer" @click="switchPlayerFunc(item)">点击播放</el-button> -->
        <el-button type="text" class="button updataMaterial" @click="enterInUpdatePage(item)">更新素材</el-button>
        <div class="underPlayer">
          <p class="name">{{ item.entity.name }}</p>
        </div>
      </el-card>
    </section>
    <!-- videoPlayer -->
    <el-dialog v-model="playerVisible" title="视频播放">
      <div id="player">
        <video-player
            ref="videoPlayer"
            :options="playerOptions"
        >
        </video-player>
      </div>
    </el-dialog>
    <!-- 分页条 -->
    <el-col :span='24' class='toolbar'>
      <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
    </el-col>
  </div>
</template>

<script>
var videojs = require('video.js/dist/video')
window.videojs = videojs
require('videojs-contrib-hls/dist/videojs-contrib-hls')
// 引入axios实例
import {
	getMaterialsList,
	getDownloadUrl
} from '../../api/api';
import util from '../../common/js/util'
export default {
	data() {
		return {
			//ToolBar
			filters: {
				id: '',
				userId: '',
				name: '',
				tags: '',
				access_type: ['0'],
			},
			// filter_access_type
			accessTypeArray: [{
					value: '0',
					label: '公开'
				},
				{
					value: '1',
					label: '私有'
				}
			],

			//List
			listLoading: false,
			data: [],
			//pagination
			// 数据总量
			totalCount: 100 * 20,
			// 当前页码
			page: 1,
			// 分页每页显示多少数据
			limit: 10,
			// video-player
			playerVisible: false,
			playerOptions: {
				// component options
				start: 0,
				playsinline: false,
				// videojs options
				muted: false,
				language: 'en',
				playbackRates: [0.7, 1.0, 1.5, 2.0],
				sources: [{
					type: "video/mp4",
					src: '',
				}],
				poster: "",
				height: 540,
				loop: false
			},
		}
	},
	methods: {
		//ToolBar
		// 点击input后面的icon 清除内容
		handleIconClick_clearId() {
			this.filters.id = '';
		},
		handleIconClick_clearName() {
			this.filters.name = '';
		},
		handleIconClick_clearUserId() {
			this.filters.userId = '';
		},
		handleIconClick_clearTags() {
			this.filters.tags = '';
		},
		//Add
		enterIn_avUploadPage(command) {
			if (command == '1') {
				this.$router.push('/avUpload/1');
			} else if (command == '2') {
				this.$router.push({
					path: '/avOneUpload',
					query: {
						type: '1'
					}
				});
			}
		},
		//pagination
		handleCurrentChange(val) {
			this.page = val;
			this.loadList();
		},
		// 显示播放器
		switchPlayerFunc(item) {
			this.playerVisible = true;
			if (item.conf.posterImgUrl) {
				this.playerOptions.poster = item.conf.posterImgUrl;
			} else {
				this.playerOptions.poster = '../../../static/images/defaultPostVideoImg.png';
			}
			// 判断如果accessType是私有访问类型 先去七牛请求url 如果是公开的话直接赋值就行
			if (item.entity.accessType == 1) {
				getDownloadUrl({
						id: item.entity.id
					})
					.then((res) => {
						if (res.data.success) {
							this.playerOptions.sources[0].src = res.data.data.url;
						} else {
							this.$notify({
								title: '错误',
								message: res.data.msg,
								type: 'error'
							})
						}
					})
					.catch((error) => {
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
					})
			} else {
				this.playerOptions.sources[0].src = item.entity.url;
			}
		},
		enterInUpdatePage(item) {
			this.$router.push({
				path: '/avUpdate',
				query: {
					id: item.entity.id,
					type: item.entity.type
				}
			});
		},
		//List
		loadList() {
			this.$route.query.id ? this.filters.id = this.$route.query.id : '';
			let para = {
				id: this.filters.id,
				name: this.filters.name,
				tags: this.filters.tags,
				user_id: this.filters.userId,
				type: '1',
				access_type: this.filters.access_type[0] ? this.filters.access_type[0] : '-1',
				page_index: this.page,
			}
			this.listLoading = true;
			getMaterialsList(para)
				.then((res) => {
					if (res.data.success) {
						this.data = res.data.data.items;
						this.limit = res.data.data.limit;
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						});
					}
					this.listLoading = false;
				})
				.catch((error) => {
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
					this.listLoading = false;
				})
		},
	},
	mounted() {
		this.loadList();
	},
	watch: {
		playerVisible: {
			handler(newValue, oldValue) {
				if (!newValue) {
					// 这里解决 关闭video页面以后视频还继续播放的问题
					this.$refs.videoPlayer.player.pause();
				}
			}
		}
	},
	filters: {
		// 关于时间转换的俩东西
		formatTime(date) {
			if (date === undefined) {
				return
			}
			if (date === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(date), 'yyyy-MM-dd   hh:mm:ss');
		}
	}
}
</script>

<style lang="less" scoped>
#videoMain {
    width: 100%;
    min-height: 550px;
    display: flex;
    flex-wrap: wrap;
    .pieces {
        width: 23%;
        height: 240px;
        margin: 10px;
        position: relative;
        .ownImg {
            img {
                width: 100%;
                height: 160px;
            }
        }
        .defaultImg {
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                height: 100px;
            }
        }
        .tag {
            font-size: 13px;
            color: #999;
        }
        .underPlayer {
            height: 40px;
            margin-top: 5px;
            padding: 0 14px 14px;
            .name {
                height: 100%;
                display: flex;
                padding-left: 3px;
                align-items: center;
            }
        }
        .switchPlayer {
            position: absolute;
            left: 15px;
            bottom: 0;
        }
        .updataMaterial {
            position: absolute;
            right: 15px;
            bottom: 0;
        }
        .creat-time {
            position: absolute;
            left: 15px;
            bottom: 0;
            padding-bottom: 10px;
            font-size: 13px;
            color: #999;
        }
    }
}
</style>
