<template lang="html">
    <section class="learningLibPage">
        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.title' placeholder='标题' icon="circle-cross" :on-icon-click="handleIconClick_clearTitle" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.EnglishTitle' placeholder='英文标题' icon="circle-cross" :on-icon-click="handleIconClick_clearEnglishTitle" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.tags' placeholder='标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTags" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-select
                        v-model="filters.type"
                        filterable
                        allow-create
                        placeholder="类型"
                        style="width:115px"
                    >
                        <el-option
                            v-for="item in typeArray"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                    <el-dropdown split-button type="primary" @command="handleCommand" v-if="this.$route.query.from != 'album'">
                        新增
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">单词</el-dropdown-item>
                            <el-dropdown-item command="1">儿歌循环听</el-dropdown-item>
                            <el-dropdown-item command="2">双语电台</el-dropdown-item>
                            <el-dropdown-item command="3">英文动画片</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </el-col>

        <section class="content">
            <el-card class="box-card" v-for="(item, index) in docs" :key='item'>
                <section class="elementCard">

                    <div class="itemContent">
                        <div class="elementContent elementContentMaterial" style="position: relative">
                            <div v-if='item.materialEntity'>
                                <img v-if='item.materialEntity.parsed.posterImgUrl' :src="item.materialEntity.parsed.posterImgUrl" class="image">
                                <img v-else-if='item.materialEntity.entity.type == 2' src="../../../static/images/defaultPostAudioImg.png" class="defaultImage">
                                <img v-else-if='item.materialEntity.entity.type == 1' src="../../../static/images/defaultPostVideoImg.png" class="defaultImage">
                            </div>

                            <div v-else>
                                <img v-if='item.parsed.externalRefInfo.posterUrl' :src="item.parsed.externalRefInfo.posterUrl" class="image">
                                <img v-else-if='item.materialEntity.entity.type == 1' src="../../../static/images/defaultPostVideoImg.png" class="defaultImage">
                            </div>
                        </div>
                    </div>

                    <div class="itemEntityContent">
                        <div v-if="item.entity.content">
                            <span
                                v-for="(info, index) in item.entity.content.split('\n')"
                                v-if="item.entity.content"
                            >
                                {{ info }}
                            </span>
                        </div>
                        <span v-else>暂无内容</span>
                    </div>

                    <div class="itemEntity">
                        <p><span>ID：</span>{{ item.entity.id }}</p>
                        <p><span>类型：</span>{{ item.entity.type | formatType }}</p>
                        <p v-if="item.materialEntity"><span>素材ID：</span>{{ item.materialEntity.entity.id }}</p>
                        <p><span>资源类型：</span>{{ item.entity.refType | formatRefType }}</p>
                        <p><span>描述：</span>{{ item.entity.description | formatDescription }}</p>
                        <p v-if="item.materialEntity"><span>时长：</span>{{ item.materialEntity.parsed.duration | transformDuration }}</p>
                        <p><span>中文标题：</span>{{ item.entity.title || item.parsed.title }}</p>
                        <p><span>英文标题：</span>{{ item.entity.englishTitle || item.parsed.englishTitle }}</p>
                        <p><span>创建时间：</span>{{ item.entity.ct | formatTime }}</p>
                        <p><span>更新时间：</span>{{ item.entity.ut | formatTime }}</p>
                        <p>
                            <span>查看素材：</span>
                            <el-button
                                type="text"
                                size='small'
                                class="fa fa-play-circle"
                                @click="switchPlayerFunc(item)"
                            >
                            &nbsp;<span>点击播放</span></el-button>
                        </p>
                        <p>
                            <span>节点编辑：</span>
                            <el-button-group  class="button">
                                <el-button type="text" icon="edit" size='small' @click='edit(item.entity.id)' style="margin-right: 14px;">&nbsp;<span style="font-size: 14px">修改</span></el-button>
                            </el-button-group>
                        </p>
                    </div>
                </section>
            </el-card>
        </section>

        <section class="noData" v-if="!docs.length">
            暂无数据
        </section>

        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='limit' :total='totalCount' style='float: right'></el-pagination>
        </el-col>

        <!-- videoPlayer -->
        <el-dialog v-model="playerVisible" title="播放">
            <div id="player">
                <video-player
                    ref="videoPlayer"
                    :options="playerOptions"
                >
                </video-player>
            </div>
        </el-dialog>
    </section>
</template>

<script>
var videojs = require("video.js");
window.videojs = videojs;
require("videojs-contrib-hls/dist/videojs-contrib-hls");
// util工具包
import util from '../../common/js/util'
// axios
import {
  // 获取learningList 列表
  getLearLibList,
  // 更新双语配置
  updateBiligualConf,
  // 获取token
  getDownloadUrl,
  // 通过ID获取专辑下的document
  getAlbumById
} from '../../api/api'

export default {
  data() {
    return {
      filters: {
        id: '',
        title: '',
        EnglishTitle: '',
        tags: '',
        type: ''
      },
      typeArray: [{
          value: '0',
          label: '单词'
        },
        {
          value: '1',
          label: '儿歌循环听'
        },
        {
          value: '2',
          label: '双语电台'
        },
        {
          value: '3',
          label: '英文动画片'
        }
      ],
      /**
       * totalCount     数据总量
       * page           当前页码
       * limit         分页每页显示多少数据
       */
      totalCount: 0,
      totalPage: '',
      page: 1,
      limit: 10,
      // list
      listLoading: false,
      // 数据
      docs: [],
      // videojs
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
      // 多选数组
      selectArr: [],
      // filter type
      type_page: '',
    }
  },
  methods: {
    loadList() {

      this.type_page = this.filters.type;
      // 如果是从双语配置页面路由来的 默认会带type参数 赋值筛选符合的数据
      if (this.$route.query.type) {
        this.filters.type = this.$route.query.type + '';
      }
      let para = {
        id: this.filters.id,
        title: this.filters.title,
        english_title: this.filters.EnglishTitle,
        tags: this.filters.tags,
        type: this.filters.type,
        page_index: this.page,
        page_size: this.limit
      }
      this.listLoading = true;
      console.log(para);
      getLearLibList(para)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.totalCount = res.data.data.totalCount;
            this.totalPage = res.data.data.totalPage;
            if (res.data.data.items) {
              this.docs = res.data.data.items;
            } else {
              this.docs = [];
            }
          } else {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            });
            this.docs = [];
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
    // 查询
    handleIconClick_clearId() {
      this.filters.id = '';
    },
    handleIconClick_clearTitle() {
      this.filters.title = '';
    },
    handleIconClick_clearEnglishTitle() {
      this.filters.EnglishTitle = '';
    },
    handleIconClick_clearTags() {
      this.filters.tags = '';
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.loadList();
    },
    // 点击新增
    handleCommand(command) {
      this.$router.push({
        path: '/addNewLearnLib',
        query: {
          type: command
        }
      });
    },
    // 点击更新
    edit(id) {
      this.$router.push({
        path: '/addNewLearnLib',
        query: {
          id: id
        }
      });
    },
    // 显示播放器
    switchPlayerFunc(item) {
      this.playerVisible = true;
      let posterUrl;
      // 判断是来自素材库还是来自优酷
      if (item.materialEntity) { // 素材库
        if (item.materialEntity.parsed.posterImgUrl) {
          posterUrl = item.materialEntity.parsed.posterImgUrl;
        }
      } else if (item.parsed) { // 优酷
        if (item.parsed.externalRefInfo.posterUrl) {
          posterUrl = item.parsed.externalRefInfo.posterUrl;
        }
      }
      //
      if (posterUrl) {
        this.playerOptions.poster = posterUrl
      } else {
        this.playerOptions.poster = '../../../static/images/defaultPostVideoImg.png';
      }
      // 播放器赋值
      if (item.materialEntity) {
        if (item.materialEntity.entity.accessType == 1) {
          getDownloadUrl({
              id: item.materialEntity.entity.id
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
          this.playerOptions.sources[0].type = "video/mp4";
          this.playerOptions.sources[0].src = item.materialEntity.entity.url;
        }
      } else if (item.parsed) {
        this.playerOptions.sources[0].type = "video/mp4";
        this.playerOptions.sources[0].src = item.parsed.youkuVideoURL.mp4Segs[0].cdn_url;
      }
    },
  },
  filters: {
    formatType(type) {
      switch (type) {
        case 0:
          return '单词';
          break;
        case 1:
          return '儿歌循环听';
          break;
        case 2:
          return '双语电台';
          break;
        case 3:
          return '英文动画片';
          break;
        default:
          return '未知';
      }
    },
    formatTime(time) {
      if (time == 0 || !time) {
        return '未更新'
      } else {
        return util.formatDate.format(new Date(time), 'yyyy/MM/dd   hh:mm:ss');
      }
    },
    TransformArray(str) {
      return str.split('\n');
    },
    // 转换duration
    transformDuration(duration) {
      let minute = parseInt(duration / 60);
      let second = Math.ceil(duration % 60);
      minute = minute > 9 ? '' + minute : '0' + minute;
      second = second > 9 ? '' + second : '0' + second;
      let display = minute + ':' + second;
      return display;
    },
    // 转换refType
    formatRefType(refType) {
      switch (refType) {
        case 0:
          return '素材库';
          break;
        case 1:
          return '优酷链接等';
          break;
      }
    },
    // 转换描述
    formatDescription(desc) {
      if (desc) {
        return desc
      } else {
        return '暂无数据'
      }
    }
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
  }
}
</script>

<style lang="less">
.content {
    margin-bottom: 5px;
    .elementCard {
        height: 250px;
        display: flex;
        justify-content: space-between;
        border-radius: 3px;
        margin: 8px;
        padding: 0 0 0 10px;
        align-items: center;
        .itemContent {
            width: 20%;
            .elementContent {
                height: 200px;
                border: 1px solid #d1dbe5;
                border-radius: 4px;
                padding: 18px;
                box-shadow: 0 0 3px #666;
                overflow-y: hidden;
                width: 100%;
            }
            .elementContentMaterial {
                width: 100%;
                height: 200px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                flex-direction: column;
                align-items: center;
                .image {
                    width: 100%;
                }
                .defaultImage {
                    width: 100%;
                }
            }
            .elementContentCharacter {
                margin: 10px 0;
            }
            .elementContentUrl {
                margin: 10px 0;
                p {
                    span {
                        color: #99a9bf;
                    }
                }
            }
        }
        .itemEntityContent {
            width: 40%;
            height: 100%;
            text-align: center;
            margin-left: 50px;
            overflow-y: scroll;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                width: 100%;
                display: inline-block;
            }
        }
        .itemEntity {
            width: 30%;
            height: 100%;
            padding: 8px;
            overflow-y: scroll;
            p {
                span {
                    color: #99a9bf;
                }
            }
        }
    }
}
.noData {
    width: 100%;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
}
</style>
