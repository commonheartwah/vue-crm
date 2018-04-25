<template>
    <div class='m-form'>
        <h1>VUE-CORE-IMAGE-UPLOAD</h1>
        <div class="pre-img">
            <img :src="src" alt="">
        </div>
        <div class="center">
            <vue-core-image-upload
                class="btn btn-primary"
                crop="local"
                cropRatio='16:9'
                @imagechanged="imageChanged"
                @imageuploading="imageuploading"
                @imageuploaded="imageuploaded"
                @errorhandle="handleError"
                :max-file-size="5242880"
                inputOfFile="bin"
                url="http://localhost/op/material/upload_image"
            >
            <el-button size="small" type="primary">选取文件</el-button>
            </vue-core-image-upload>
        </div>
    </div>
    <!--
    :crop="true"
    cropRatio='16:9'
    inputOfFile="bin"
    extensions="png,gif,jpeg,jpg"
    :data="poster"
    :headers="commonHeaders"
 -->

</template>

<script>
    import VueCoreImageUpload  from 'vue-core-image-upload';
    export default {
        data: function(){
            return {
                src: 'http://opbck82p3.bkt.clouddn.com/e5a3b38e4c214a128ed95642975cfae0.jpg',
            }
        },
        components: {
            VueCoreImageUpload
        },
        methods:{
            imageChanged(){
                console.log('__图片选择发生了改变');
            },
            imageuploading(file){
                console.log('__图片上传中');
                console.log(file);
            },
            imageuploaded(res) {
                console.log('__图片上传完成');
                console.log(res);
                this.src = res.data;
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        }
    }
</script>
<style scoped lang="less">
    .pre-img{
        width:250px;
        height: 250px;
        border-radius: 50%;
        margin-bottom: 20px;
        background: green;
        img{
            width: 100%;
            height: 100%;
        }
    }
</style>
