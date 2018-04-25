<template lang="html">
    <!-- 图片上传 -->
    <section>
        <el-form :model='picForm' label-width='100px' :rules='picFormRules' ref='picForm'>
            <el-form-item label='素材名称' prop='name'>
                <el-input v-model='picForm.name' placeholder="请输入素材名称" @keydown.enter.native.prevent></el-input>
            </el-form-item>
            <el-form-item label='素材标签'>
                <el-tag
                    :key="tag"
                    v-for="tag in picForm.dynamicTags"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose(tag)"
                    type="success"
                    style="margin:0 5px 0 0"
                >
                {{tag}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                    @keydown.enter.native.prevent
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>

            <el-form-item label='上传图片'>
                <el-upload
                class="upload-demo"
                ref="upload"
                action="/op/material/upload_image_lib"
                :data='kongObj'
                name="bin"
                list-type="picture"
                :on-change="handleChange"
                :file-list="fileList"
                :auto-upload="false"
                :on-success="handleSuccess">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <!-- <el-button size="small" type="primary" @click='test'>测试</el-button> -->
                    <div slot="tip" class="el-upload__tip">只支持单个文件上传 且只能上传jpg/png文件</div>
                </el-upload>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
//引入axios实例


export default {
    props:[
        'picFormVisible'
    ],
    data(){
        return {
            fileList: [],
            picForm: {
                name: '',
                dynamicTags: [],
            },
            picFormRules: {
                name: [
                    { required: false, message: '请输入素材名称', trigger: 'blur' }
                ]
            },
            kongObj: {}, // 空对象 绑定到上传的data上
            // tags 标签
            inputVisible: false,
            inputValue: '',
        }
    },
    methods: {
        //on-change 对应的函数 文件状态改变的时候触发
        handleChange(file, fileList){
            if (fileList.length>1) {
                fileList[0] = fileList[1]
                fileList.length = 1;
                this.$message.error('只支持单个文件上传');
            }
        },
        submitUpload() {
            this.$refs.picForm.validate((valid)=> {
                let tempObj = {
                    name: this.picForm.name,
                    tags: this.picForm.dynamicTags.join(','),
                }
                Object.assign(this.$refs.upload.data, tempObj);// 发送请求附带参数的补充
                this.$refs.upload.submit();
            })
        },
        handleSuccess(response, file, fileList){
            if (response.success) {
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
                this.$emit('tellParentChangeFlag', response.data.entity.id); // 调用父组件里面的方法改变flag值
            }else{
                // fileList.length = 0;
                this.$message.error(response.msg);
            }

        },
        // tags标签
        handleClose(tag) {
            this.picForm.dynamicTags.splice(this.picForm.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.picForm.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
}
</script>

<style lang="less" scoped>
</style>
