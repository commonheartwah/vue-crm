<template lang="html">
    <section>
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline=true :model='filters'>
                    <el-form-item>
                        <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model='filters.name' placeholder='图片名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model='filters.tags' placeholder='标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTags" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model='filters.userId' placeholder='上传用户ID' icon="circle-cross" :on-icon-click="handleIconClick_clearUserId" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type='primary' @click='loadList'>查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <!-- 主体内容 -->
        <section id="main">
            <el-card class="pieces" v-for="(item, index) in data" :key="item"  :body-style="{ padding: '0px' }" @click.native='checkedPic(item)' @dblclick.native="checkedMaterial(item)">
                <img :src="item.entity.url" class="image">
                <el-button type="text" class="button updataMaterial" @click="showImg(item.entity.url)">查看大图</el-button>
                <div style="padding: 0 14px 14px 14px;" class="underPlayer">
                    <span class="name">{{ item.entity.name }}</span>
                </div>
                <transition name="el-zoom-in-center">
                    <div v-show="item.checked" class="transition-box"><i class="fa fa-check-square-o fa-3x"></i></div>
                </transition>
            </el-card>
        </section>

        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>
    </section>
</template>

<script>
import { getMaterialsList } from '../api/api';

export default {
    props:['checkedFalg'],
    data(){
        return {
            show2: false,
//ToolBar

            filters: {
                id: '',
                userId: '',
                name: '',
                tags: '',
            },

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
//picFormVisible 默认picForm 上传的组件是不显示的 点击按钮以后显示 成功以后隐藏
            picFormVisible: false,
        }
    },
    methods:{
//ToolBar

        // 点击input后面的icon 清除内容
        handleIconClick_clearId(){
            this.filters.id = '';
        },
        handleIconClick_clearName(){
            this.filters.name = '';
        },
        handleIconClick_clearUserId(){
            this.filters.userId = '';
        },
        handleIconClick_clearTags(){
            this.filters.tags = '';
        },
//List

        loadList(){
            let para = {
                id: this.filters.id,
                name: this.filters.name,
                tags: this.filters.tags,
                user_id: this.filters.userId,
                type: '0',
                access_type: '0',
                page_index: this.page,
            }
            getMaterialsList(para).then((res) => {
                if (res.data.success) {
                    res.data.data.items.forEach((item) => {
                        item['checked'] = false;
                    })
                    this.data = res.data.data.items;
                    this.totalCount = res.data.data.totalCount;
                    this.limit = res.data.data.limit;
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        //Edit
//pagination
        handleCurrentChange(val){
            this.page = val;
            this.loadList();
        },
    // 选择素材
        checkedPic(tempObj){
            this.data.forEach((item) => {
                item.checked = false;
            })
            tempObj.checked = !tempObj.checked;
            this.$emit('tellParentChangeFlag', tempObj.entity.id, true); // 调用父组件里面的方法改变flag值
        },
        checkedMaterial(tempObj) {
            this.$emit('tellParentCheckedMaterial', tempObj.entity.id, true);
        },
    // 显示大图
        showImg(url){
            window.open(url);
            event.stopPropagation();
        }
    },
    watch:{
        checkedFalg: {
			handler(newVal, oldVal) {　　　　　　　　　
				if (newVal == true) {
                    this.data.forEach((item) => {
                        item.checked = false;
                    })
				}
			},
			deep: true
		},
    },
    mounted(){
        this.loadList();
    }
}

</script>

<style lang="less" scoped>
#main{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .pieces{
        width: 18%;
        height: 320px;
        margin: 10px 10px;
        position: relative;
        .transition-box {
            position: absolute;
            bottom: 10px;
            right: 20px;
            z-index: 2;
            i{
                color: #666;
            }
        }
        img{
            width: 100%;
            height: 260px;
        }
        .tag{
            font-size: 13px;
            color: #999;
        }
        .underPlayer{
            height: 20px;
            margin-top: 5px;
            display: flex;
            justify-content: center;
            .name{
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .updataMaterial{
            position: absolute;
            left: 20px;
            bottom: 0;
        }
    }
}
</style>
