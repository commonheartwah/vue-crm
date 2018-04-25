<template lang="html">
    <section>
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
                </el-form>
            </el-col>
        </el-row>

        <!-- 主体内容 -->
        <section id="videoMain" v-loading='listLoading' style="minHeight:550px;">
            <el-card class="pieces" v-for="(item, index) in data" :key="item"  :body-style="{ padding: '0px' }" @click.native='checkedPic(item)' @dblclick.native="checkedMaterial(item)">
                <div :class="item.conf.posterImgUrl ? 'ownImg' : 'defaultImg'">
                    <img :src="item.conf.posterImgUrl ? item.conf.posterImgUrl : '../../../static/images/defaultPostVideoImg.png'" alt="">
                </div>
                <div class="creat-time">{{ item.entity.ct | formatTime }}</div>
                <el-button type="text" class="button switchPlayer" @click="switchPlayerFunc(item)">点击播放</el-button>
                <div style="padding: 0 14px 14px 14px;" class="underPlayer">
                    <span class="name">{{ item.entity.name }}</span>
                </div>
                <transition name="el-zoom-in-center">
                    <div v-show="item.checked" class="transition-box"><i class="fa fa-check-square-o fa-3x"></i></div>
                </transition>
            </el-card>
        </section>

        <!-- videoPlayer -->
        <section class="backVideoPlayer" v-show='playerVisible'>
            <div  class="VideoPlayer">
                <el-button type="primary" icon="close" class="closeVideo" @click.native='closeDialog'></el-button>
                <div id="player" style="backgroundColor: red;">
                    <video-player   ref="videoPlayer"
                                    :options="playerOptions">
                    </video-player>
                </div>
            </div>
        </section>
        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>
    </section>
</template>

<script>
import {
	getMaterialsList,
	uploadPic,
	updateMaterial,
	getDownloadUrl
} from '../api/api';
import util from '../common/js/util'
export default {
	props: ['checkedFalg'],
	data() {
		return {
			//ToolBar
			filters: {
				id: '',
				userId: '',
				name: '',
				tags: '',
				access_type: '1',
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
			totalCount: 1,
			// 当前页码
			page: 1,
			// 分页每页显示多少数据
			limit: 1,
			// video-player
			playerVisible: false,
			playerOptions: {
				// component options
				start: 0,
				playsinline: false,
				// videojs options
				muted: true,
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
		//List

		loadList() {
			let para = {
				id: this.filters.id,
				name: this.filters.name,
				tags: this.filters.tags,
				user_id: this.filters.userId,
				type: '1',
				access_type: this.filters.access_type[0] ? this.filters.access_type[0] : 0,
				page_index: this.page,
			}
			this.listLoading = true;
			getMaterialsList(para).then((res) => {
				if (res.data.success) {
					res.data.data.items.forEach((item) => {
						item['checked'] = false;
					})
					this.data = res.data.data.items;
					this.totalCount = res.data.data.totalCount;
					this.limit = res.data.data.limit;
				} else {
					this.$message.error(res.data.msg);
				}
				this.listLoading = false;
			})
		},
		//pagination

		handleCurrentChange(val) {
			this.page = val;
			this.loadList();
		},
		// 显示播放器
		switchPlayerFunc(item) {
			this.playerVisible = true;
			this.playerOptions.poster = item.conf.posterImgUrl;
			// 判断如果accessType是私有访问类型 先去七牛请求url 如果是公开的话直接赋值就行
			if (item.entity.accessType == 1) {
				getDownloadUrl({
					id: item.entity.id
				}).then((res) => {
					this.playerOptions.sources[0].src = res.data.data.url;
				})
			} else {
				this.playerOptions.sources[0].src = item.entity.url;
			}
			this.data.forEach((item) => {
				item.checked = false;
			})
			event.stopPropagation();
			this.$emit('tellParentChangeFlag', '', false); // 调用父组件里面的方法改变flag值
		},
		closeDialog() {
			this.playerVisible = false;
		},
		// 选择素材
		checkedPic(tempObj) {
			this.data.forEach((item) => {
				item.checked = false;
			})
			tempObj.checked = true;
			this.$emit('tellParentChangeFlag', tempObj.entity.id, true); // 调用父组件里面的方法改变flag值
		},
		checkedMaterial(tempObj) {
			this.$emit('tellParentCheckedMaterial', tempObj.entity.id, true);
		}
	},
	mounted() {
		this.loadList();
		setTimeout(() => {
			this.playerOptions.muted = false;
		}, 2000);
	},
	watch: {
		playerVisible: {
			handler(newValue, oldValue) {
				if (!newValue) {
					// 这里解决 关闭video页面以后视频还继续播放的问题
					this.$refs.videoPlayer.player.pause();
				}
			}
		},
		checkedFalg: {
			handler(newVal, oldVal) {　　　　　　　　　
				if (newVal == true) {
					this.data.forEach((item) => {
						item.checked = false;
					})
				}
			},
			deep: true
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
    display: flex;
    flex-wrap: wrap;
    .pieces {
        width: 23%;
        height: 220px;
        margin: 10px;
        position: relative;
        .transition-box {
            position: absolute;
            top: 10px;
            right: 20px;
            z-index: 2;
            i {
                color: #666;
            }
        }
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
            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
            }
        }
        .switchPlayer {
            position: absolute;
            right: 5%;
            bottom: 4%;
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
.backVideoPlayer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: -800px;
    background-color: rgba(211,220,230, 0.7);
    .VideoPlayer {
        width: 60%;
        position: fixed;
        top: 10%;
        left: 20%;
        padding: 55px 10px;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 0 3px #666;
        z-index: 888;
        .closeVideo {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 999;
        }
    }
}
</style>
