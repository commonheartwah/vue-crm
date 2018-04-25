<template lang="html">
  <div>
    <el-row>
          <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
              <el-form :inline='true'>
                  <el-form-item>
                      <el-button type='primary' @click="handleAdd">新增</el-button>
                  </el-form-item>
              </el-form>
          </el-col>
      </el-row>

    <el-row>
      <el-col :span='24'>
        <figure v-for='(item, index) in posterList'  style="display:inline-block;margin-bottom:30px;"  >
          <img :src="item.img" alt="" >
          <figcaption  style="margin-right:30px;">
            <span style="display:block;text-align:center;line-height:30px;" type="index">{{ item.name }}</span>
            <el-button  size="small" class="revise-button"  style="background-color:#e4e4e4;" @click="handleEdit(index)" >修改</el-button>
            <el-button  size="small" class="test-button" style="background-color:#e3f0d4;" @click="handlePreview(item)">测试</el-button>
            <el-button  size="small" class="deletion-button" @click="removeMove(index)" style="background-color:#e4e4e4;">删除</el-button>
          </figcaption>
        </figure>
      </el-col>
    </el-row>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      size="lager"
      style="width:420px;left:350px;">
      <div class="dialog-back">
        <img :src="promoterPreview.img" style="width:375px;height:667px;"></img>
        <div style="border-style: solid;" alt=""  class="qr-code" :style='"top: " + promoterPreview.yQRCoord/2 + "px;left: " + promoterPreview.xQRCoord/2 + "px;" + "width:" + promoterPreview.qRSize/2 + "px;height:" + promoterPreview.qRSize/2 + "px"'>

        </div>
        <!-- <img src="../../../static/images/ercoord.png" alt="" class="qr-code" :style='"top: " + promoterPreview.yQRCoord + "px;left: " + promoterPreview.xQRCoord + "px;" + "width:" + promoterPreview.qRSize + "px;height:" + promoterPreview.qRSize + "px"'/> -->
      </div>
    </el-dialog>
</div>
</template>

<script>
import {
  posterUpdate,
  getPosterList
} from '../../api/api'
export default {
  data() {
    return {
      dialogVisible: false,
      // 分页
      totalCount: 1,
      page_index: 1,
      page_size: 20,
      form: {},
      posterList: [],
      promoterPreview: {}
    };
  },
  methods: {
    //分页设置
    handleCurrentChange(val) {
      this.page_index = val;
      this.init();
    },
    handlePreview(item) {
      console.log(item);
      this.promoterPreview = item;
      this.dialogVisible = true;
    },
    //点击确定之后，弹框消失
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    //点击删除，删除当前点击对象
    removeMove(index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.posterList.splice(index, 1);
          let para = {
            posters: this.posterList
          }
          console.log(para);
          posterUpdate({
              values: JSON.stringify(para)
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
            .catch(error => {
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

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handleAdd() {
      this.$router.push({
        name: '海报生成',
      })
    },
    //点击修改后获取当前数据并且回到海报生成页
    handleEdit(index) {
      this.$router.push({
        name: '海报生成',
        query: {
          index: index,
        }
      })
    },
    //获取列表数据并保存
    getList() {
      getPosterList().then(res => {
          // console.log(Object.keys(res.data.data))
          if (res.data.success) {
            // console.log(res)
            if (Object.keys(res.data.data).length > 0) {
              this.posterList = res.data.data.posters;
            } else {
              this.posterList = [];
            }
          } else {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            })
          }

        })
        .catch(error => {
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
    },
  },
  mounted() {
    this.getList();
  }
}
</script>

<style lang="css" scoped>
  .dialog-back{
    position: relative;
  }
  .grid-content .bg-purple{
    width: 148px;
    height: 248px;
    display: inline-block;
  }
  img{
    width: 148px;
    height: 248px;
    display: inline;

  }

  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .qr-code {
      position: absolute;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  button{
    display: inline;
    width: auto;
    height: 30px;
    float: left;
  }
  .el-pagination button.disabled {
    color: #e4e4e4;
    background-color: #fff;
    cursor: not-allowed;

  }
  .toolbar{
    width: 100%;
    margin-bottom: 30px;
  }
  .el-dialog__wrapper {
      top: -80px;
      right: 0;
      bottom: 0;
      left: 0;
      position: fixed;
      /* overflow: auto; */
      margin: 0;
  }
</style>
