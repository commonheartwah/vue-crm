<template>
  <section>
    <!-- 配置 课节基本元数据 -->
    <el-popover ref="baseMetadataFromVisible" placement="bottom" trigger="click" :width="800">
      <el-form label-width='100px'>
        <el-form-item label='关联单词' prop="id">
          <el-tag :key="index" v-for="(word, index) in expressionsMeta.wordsParsed" type="gray" size="medium" closable :disable-transitions="false" @close="handleClose(word, index, expressionsMeta.wordsParsed, 'word')">{{ word.entity.english }}({{ word.entity.chinese }})</el-tag>
          <el-select v-model="inputValue" v-if="inputVisible.word" size="small" ref="wordInput" @change="handleInputConfirm($event, 'word')" @visible-change="handleInputBlur($event, 'word')" placeholder="请输入单词" class="input-new-tag" filterable clearable :default-first-option="true"
              remote :remote-method="searchWordFunc">
            <el-option v-for="item in metadataList.wordList" :key="item.entity.id" :label="item.entity.english + '（' + item.entity.chinese + '）'" :value="item"></el-option>
          </el-select>
          <el-button v-else class="button-new-tag" @click="showInput('word')"> + 新单词 </el-button>
        </el-form-item>

        <el-form-item label='关联短语' prop="id">
          <el-tag :key="index" v-for="(phrase, index) in expressionsMeta.phrasesParsed" type="primary" size="medium" closable :disable-transitions="false" @close="handleClose(phrase, index, expressionsMeta.phrasesParsed, 'phrase')">{{ phrase.entity.english }}({{ phrase.entity.chinese }})</el-tag>
          <el-select v-model="inputValue" v-if="inputVisible.phrase" size="small" ref="phraseInput" @change="handleInputConfirm($event,'phrase')" @visible-change="handleInputBlur($event, 'phrase')" placeholder="请输入短语" class="input-new-tag" filterable clearable
              remote :remote-method="searchPhraseFunc">
            <el-option v-for="item in metadataList.phraseList" :key="item.entity.id" :label="item.entity.english + '（' + item.entity.chinese + '）'" :value="item">
            </el-option>
          </el-select>
          <el-button v-else class="button-new-tag" @click="showInput('phrase')"> + 新短语 </el-button>
        </el-form-item>

        <el-form-item label='关联句型' prop="id">
          <el-tag :key="index" v-for="(sentencePattern, index) in expressionsMeta.sentencePatternsParsed" type="success" size="medium" closable :disable-transitions="false" @close="handleClose(sentencePattern, index, expressionsMeta.sentencePatternsParsed, 'sentencePattern')">{{ sentencePattern.entity.english }}({{ sentencePattern.entity.chinese }})</el-tag>
          <el-select v-model="inputValue" v-if="inputVisible.sentencePattern" size="small" ref="sentencePatternInput" @change="handleInputConfirm($event, 'sentencePattern')" @visible-change="handleInputBlur($event, 'sentencePattern')" placeholder="请输入句型" class="input-new-tag"
              filterable clearable remote :remote-method="searchSentencePatternFunc">
            <el-option v-for="item in metadataList.sentencePatternList" :key="item.entity.id" :label="item.entity.english + '（' + item.entity.chinese + '）'" :value="item">
            </el-option>
          </el-select>
          <el-button v-else class="button-new-tag" @click="showInput('sentencePattern')"> + 新句型 </el-button>
        </el-form-item>

        <el-form-item label='关联句子' prop="id">
          <el-tag :key="index" v-for="(sentence, index) in expressionsMeta.sentencesParsed" type="danger" size="medium" closable :disable-transitions="false" @close="handleClose(sentence, index, expressionsMeta.sentencesParsed, 'sentence')">{{ sentence.entity.english }}({{ sentence.entity.chinese }})</el-tag>
          <el-select v-model="inputValue" v-if="inputVisible.sentence" size="small" ref="sentenceInput" @change="handleInputConfirm($event, 'sentence')" @visible-change="handleInputBlur($event, 'sentence')" placeholder="请输入句子" class="input-new-tag" filterable clearable
              remote :remote-method="searchSentenceFunc">
            <el-option v-for="item in metadataList.sentenceList" :key="item.entity.id" :label="item.entity.english + '（' + item.entity.chinese + '）'" :value="item">
            </el-option>
          </el-select>
          <el-button v-else class="button-new-tag" @click="showInput('sentence')"> + 新句子 </el-button>
        </el-form-item>
      </el-form>
    </el-popover>

    <el-card class="box-card">
      <div slot="header" class="lessonTitle">
        <span style="line-height: 36px;">{{ lessonEssInfo.internalName || lessonEssInfo.name }}</span>
      </div>
      <el-row>
        <el-col :span="1" :offset="1" class="lessonInfo lessonInfoTitle">ID:</el-col>
        <el-col :span="1" class="lessonInfo lessonInfoContent">{{ lessonEssInfo.id}}</el-col>
        <el-col :span="1" class="lessonInfo lessonInfoTitle">状态：</el-col>
        <el-col :span="2" class="lessonInfo lessonInfoContent">{{ lessonEssInfo.stat ? '有效' : '无效' }}</el-col>
        <el-col :span="1" class="lessonInfo lessonInfoTitle">类型：</el-col>
        <el-col :span="6" class="lessonInfo lessonInfoContent">{{ lessonEssInfo.type | formatLessonType}}</el-col>
        <el-col :span="4" class="lessonInfo lessonInfoTitle">拖动：</el-col>
        <el-col :span="7" class="lessonInfo lessonInfoContent contentLength">
          <!-- <el-tooltip class="item" effect="dark" :content="lessonDetailInfo.parsed.materialName" placement="top" v-if="lessonDetailInfo.parsed && lessonDetailInfo.parsed.materialId">
            <span>{{ lessonDetailInfo.parsed.materialName || '视频未命名' }}</span>
          </el-tooltip>
          <el-button-group style="margin-left:10px">
            <el-button type="info" @click='addPreviewFrom(1)' size='mini'>素材库选择</el-button>
            <el-button type="success" @click='addPreviewFrom(2)' size='mini'>本地上传</el-button>
          </el-button-group> -->
          <el-switch v-model="isDrag" on-color="#13ce66" off-color="#ff4949" :on-value="1" :off-value="0"></el-switch>
          <!-- <el-button :span="3" class="">新增亲子任务板块</el-button> -->
        </el-col>
        <!-- <el-button type="success" class='newBlock' @click='addChapter1'>新增亲子任务板块</el-button> -->
      </el-row>
      <!-- <el-button type="success" class='newBlock' @click='addChapter'>新增亲子任务板块</el-button> -->
      <el-row>
        <el-col :span="1" :offset="1" class="lessonInfo lessonInfoTitle">课程：</el-col>
        <el-col :span="1" class="lessonInfo lessonInfoContent">{{ lessonEssInfo.courseId }}</el-col>
        <el-col :span="1" class="lessonInfo lessonInfoTitle">显示：</el-col>
        <el-col :span="2" class="lessonInfo lessonInfoContent">{{ lessonEssInfo.display ? '显示' : '不显示' }}</el-col>
        <el-col :span="1" class="lessonInfo lessonInfoTitle">切换：</el-col>
        <el-col :span="8" class="lessonInfo lessonInfoContent">
          <div>
            <!-- <el-switch v-model="briefness" on-text="简版" off-text="正常" on-color="#36b3b3" off-color="#13ce66" :width="62" @change="changeBriefOrNormal" v-if='lessonType !== 2'></el-switch>
            <el-switch v-model="briefness" on-text="复习" off-text="正常" on-color="#36b3b3" off-color="#13ce66" :width="62" @change="changeBriefOrNormal" v-if='lessonType == 2'></el-switch> -->
            <el-radio-group v-model="briefness" @change="changeBriefOrNormal">
              <el-radio class="radio" label="1">1.0课件</el-radio>
              <el-radio class="radio" label="2" v-if='lessonType!=2'>简版</el-radio>
              <el-radio class="radio" label="3" v-if='lessonType!=2'>音乐课</el-radio>
              <el-radio class="radio" label="2" v-if='lessonType==2'>复习课</el-radio>
              <el-radio class="radio" label="4" v-if='lessonType!=2'>小程序精品课程</el-radio>
              <!-- <el-radio class="radio" label="5" v-if='lessonType!=2'>磨耳朵</el-radio> -->
            </el-radio-group>
            <el-button v-if="briefness == 2&&lessonType!=2" type="primary" @click='briefBlocksUpdateShow' size='mini'>设置简版课程</el-button>
            <el-button v-if="briefness == 3&&lessonType!=2" type="primary" @click='showMusicDialog' size='mini'>设置音乐课件</el-button>
          </div>
        </el-col>

        <el-col :span='2' class="lessonInfo lessonInfoTitle">相关配置：</el-col>
        <el-col :span="7" class="lessonInfo lessonInfoContent contentLength">
          <el-tooltip class="item" effect="dark" content="关联试卷集" placement="top" v-if="lessonDetailInfo.parsed  && lessonDetailInfo.parsed.examSuiteId">
            <el-button type="primary" @click='addExamSuite' size='mini'>试卷集：{{ lessonDetailInfo.parsed.examSuiteName || '视频未命名' }}</el-button>
          </el-tooltip>
          <el-button type="primary" @click='addExamSuite' size='mini' v-else>关联试卷集</el-button>
          <!-- <el-button type="info" v-popover:baseMetadataFromVisible size='mini'>关联词句库</el-button> -->
        </el-col>
      </el-row>
    </el-card>

    <div class="briefness-course" v-show='lessonType !== 2&&briefness != 4'>
      <div class="item">
        <div class="title">预习课视频配置</div>
        <div class="content">
          <span v-if="lessonDetailInfo.parsed && lessonDetailInfo.parsed.materialId">{{ lessonDetailInfo.parsed.materialName || '视频未命名' }}</span>
          <el-button-group style="margin-left:10px">
            <el-button type="info" @click='addPreviewFrom(1)' size='mini'>素材库选择</el-button>
            <el-button type="success" @click='addPreviewFrom(2)' size='mini'>本地上传</el-button>
            <el-button type="danger" @click='delPreviewFrom' size='mini'>预习视频为空</el-button>
          </el-button-group>
        </div>

      </div>

    </div>
      <div class="briefness-course" v-show='briefness == 4'>
      <div class="item">
        <div class="title">磨耳朵音频配置</div>
        <div class="content">
          <span v-if="lessonDetailInfo1.earAudios&&lessonDetailInfo1.earAudios.length!=0">{{ lessonDetailInfo1.earAudios[0].name || '音频未命名' }}</span>
          <span v-else> 暂无音频 </span>
          <el-button-group style="margin-left:10px">
            <el-button type="info" @click='addPreviewFrom1(1)' size='mini'>素材库选择</el-button>
            <el-button type="success" @click='addPreviewFrom1(2)' size='mini'>本地上传</el-button>
            <el-button type="danger" @click='delPreviewFrom1' size='mini'>预习音频为空</el-button>
          </el-button-group>
        </div>

      </div>

    </div>

    <div v-if="briefness == 1" v-loading='loading' element-loading-text="努力加载中">
      <draggable :list="allComponents" :options="blockDragOption">
        <!-- <draggable :list="allComponents" @end="dragEnd">c -->
        <el-collapse v-for='(pro, index) in allComponents' :key='index' v-model="activeNames" class="list-complete-item">
          <el-collapse-item :name='index'>
            <template slot="title">
              <span class="blockName">名称：{{ pro.name }}</span>
              <span class="blockDescription">描述：{{ pro.description }}</span>
              </template>
            <CourseBlock :isDrag="isDrag" :ruleForm='pro' :selfIndex='index' :showBlockMethod='true'  @closeSelf='deleteBlock' @editSelf='editBlock' @addElement='addElement' @editElement='editElement' @deleteElement='onDeleteElement' @changeType='onChangeType' @playAV="playAV"
                :blockInfo='pro.blockInfo.InfoMessage' ></CourseBlock>
          </el-collapse-item>

        </el-collapse>
      </draggable>
      <el-card v-if='!allComponents.length && briefness == 1' class='componentFlag'>亲，当前课节没有板块</el-card>
    </div>
  <!-- 亲子任务板块 -->
      <div v-if="briefness == 4" v-loading='loading' element-loading-text="努力加载中">
      <draggable :list="allComponents1" :options="blockDragOption">
        <!-- <draggable :list="allComponents" @end="dragEnd">c -->
        <el-collapse v-for='(pro, index) in allComponents1' :key='index' v-model="activeNames1" class="list-complete-item">
          <el-collapse-item :name='index'>
            <template slot="title">
              <span class="blockName">名称：{{ pro.name }}</span>
              <span class="blockDescription">描述：{{ pro.description }}</span>
              </template>
            <CourseBlock :isDrag="isDrag" :ruleForm='pro' :selfIndex='index' :showList='1' @closeSelf='deleteBlock1' @editSelf='editBlock1' @addElement='addElement1' @editElement='editElement' @deleteElement='onDeleteElement' @changeType='onChangeType' @playAV="playAV" :blockInfo='pro.blockInfo.InfoMessage'></CourseBlock>
          </el-collapse-item>
        </el-collapse>
      </draggable>
      <el-card v-if='!allComponents1.length && briefness == 4' class='componentFlag'>亲，当前课节没有亲子任务板块</el-card>
    </div>

    <div v-if="briefness == 2 &&lessonType !== 2" class="briefness-course">
      <div class="item" v-for="(briefBlock, index) in briefBlocks">
        <div class="title">板块名称：{{ briefBlock.block.name }}</div>
        <div class="content" v-if="briefBlock.briefBlockContent.learnOutLineDetail">
          <el-form ref="briefnessVideo" label-width="100px">
            <el-form-item label="引导：" v-for="(element, index) in briefBlock.briefBlockContent.learnOutLineDetail.leadAudioOrVideoElements" :key="index">
              <div v-if="element.entity.edit">
                <span v-if="element.parsed && element.parsed.name">{{ element.parsed.name }}</span>
                <el-button-group style="margin-left: 20px;">
                  <el-button type="primary" icon="edit" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                </el-button-group>
              </div>
              <div v-else class="edit-biref-element">
                <el-button-group>
                  <el-button type="primary" v-if="element.parsed && element.parsed.materialId" icon="d-arrow-left" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                  <!-- <el-button type="primary" icon="circle-check" :disabled="element.entity.submitMediaButton" @click="submitElementMedia(element)"></el-button> -->
                </el-button-group>
                <el-select v-model="element.entity.type" placeholder="请选择" class="select-material">
                  <el-option v-for="item in materialTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <uploadMethods :oProp='element.entity.type' class="uploadMethods" v-on:child-say='assignVal($event, element)'></uploadMethods>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="content" v-if="briefBlock.briefBlockContent.learnVideoDetail">
          <el-form ref="briefnessVideo" label-width="100px">
            <el-form-item label="引导：" v-for="(element, index) in briefBlock.briefBlockContent.learnVideoDetail.leadAudioOrVideoElements" :key="index">
              <div v-if="element.entity.edit">
                <span v-if="element.parsed && element.parsed.name">{{ element.parsed.name }}</span>
                <el-button-group style="margin-left: 20px;">
                  <el-button type="primary" icon="edit" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                </el-button-group>
              </div>
              <div v-else class="edit-biref-element">
                <el-button-group>
                  <el-button type="primary" v-if="element.parsed && element.parsed.materialId" icon="d-arrow-left" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                  <!-- <el-button type="primary" icon="circle-check" :disabled="element.entity.submitMediaButton" @click="submitElementMedia(element)"></el-button> -->
                </el-button-group>
                <el-select v-model="element.entity.type" placeholder="请选择" class="select-material">
                  <el-option v-for="item in materialTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <uploadMethods :oProp='element.entity.type' class="uploadMethods" v-on:child-say='assignVal($event, element)'></uploadMethods>
              </div>
            </el-form-item>
            <div v-for="(learnVideoConfContent, index) in briefBlock.briefBlockContent.learnVideoDetail.learnVideoConfContents" :key="index">
              <el-form-item label="视频：">
                <div v-if="learnVideoConfContent.learnVideoElement.entity.edit">
                  <span v-if="learnVideoConfContent.learnVideoElement.parsed && learnVideoConfContent.learnVideoElement.parsed.name">{{ learnVideoConfContent.learnVideoElement.parsed.name }}</span>
                  <el-button-group style="margin-left: 20px;">
                    <el-button type="primary" icon="edit" @click="learnVideoConfContent.learnVideoElement.entity.edit = !learnVideoConfContent.learnVideoElement.entity.edit"></el-button>
                    <el-button type="primary" icon="view" @click="previewElementMedia(learnVideoConfContent.learnVideoElement)"></el-button>
                  </el-button-group>
                </div>

                <div v-else class="edit-biref-element">
                  <el-button-group>
                    <el-button type="primary" v-if="learnVideoConfContent.learnVideoElement.parsed && learnVideoConfContent.learnVideoElement.parsed.materialId" icon="d-arrow-left" @click="learnVideoConfContent.learnVideoElement.entity.edit = !learnVideoConfContent.learnVideoElement.entity.edit"></el-button>
                    <el-button type="primary" icon="view" @click="previewElementMedia(learnVideoConfContent.learnVideoElement)"></el-button>
                    <!-- <el-button type="primary" icon="circle-check" :disabled="learnVideoConfContent.learnVideoElement.entity.submitMediaButton" @click="submitElementMedia(learnVideoConfContent.learnVideoElement)"></el-button> -->
                  </el-button-group>
                  <el-select v-model="learnVideoConfContent.learnVideoElement.entity.type" placeholder="请选择" class="select-material">
                    <el-option v-for="item in materialTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <uploadMethods :oProp='learnVideoConfContent.learnVideoElement.entity.type' :oLocalUpload="false" class="uploadMethods" v-on:child-say='assignVal($event, learnVideoConfContent.learnVideoElement)'></uploadMethods>
                </div>
              </el-form-item>
              <el-form-item label="讲解：">
                <div v-if="learnVideoConfContent.explainAudioOrVideoElement.entity.edit">
                  <span v-if="learnVideoConfContent.explainAudioOrVideoElement.parsed && learnVideoConfContent.explainAudioOrVideoElement.parsed.name">{{ learnVideoConfContent.explainAudioOrVideoElement.parsed.name }}</span>
                  <el-button-group style="margin-left: 20px;">
                    <el-button type="primary" icon="edit" @click="learnVideoConfContent.explainAudioOrVideoElement.entity.edit = !learnVideoConfContent.explainAudioOrVideoElement.entity.edit"></el-button>
                    <el-button type="primary" icon="view" @click="previewElementMedia(learnVideoConfContent.explainAudioOrVideoElement)"></el-button>
                  </el-button-group>
                </div>

                <div v-else class="edit-biref-element">
                  <el-button-group>
                    <el-button type="primary" v-if="learnVideoConfContent.explainAudioOrVideoElement.parsed && learnVideoConfContent.explainAudioOrVideoElement.parsed.materialId" icon="d-arrow-left" @click="learnVideoConfContent.explainAudioOrVideoElement.entity.edit = !learnVideoConfContent.explainAudioOrVideoElement.entity.edit"></el-button>
                    <el-button type="primary" icon="view" @click="previewElementMedia(learnVideoConfContent.explainAudioOrVideoElement)"></el-button>
                    <!-- <el-button type="primary" icon="circle-check" :disabled="learnVideoConfContent.explainAudioOrVideoElement.entity.submitMediaButton" @click="submitElementMedia(learnVideoConfContent.explainAudioOrVideoElement)"></el-button> -->
                  </el-button-group>
                  <el-select v-model="learnVideoConfContent.explainAudioOrVideoElement.entity.type" placeholder="请选择" class="select-material">
                    <el-option v-for="item in materialTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <uploadMethods :oProp='learnVideoConfContent.explainAudioOrVideoElement.entity.type' :oLocalUpload="false" class="uploadMethods" v-on:child-say='assignVal($event, learnVideoConfContent.explainAudioOrVideoElement)'></uploadMethods>
                </div>
              </el-form-item>

            </div>

          </el-form>
        </div>
        <div class="content" v-if="briefBlock.briefBlockContent.learnWordDetail">
          <el-form ref="briefnessVideo" label-width="100px">
            <el-form-item label="引导：" v-for="(element, index) in briefBlock.briefBlockContent.learnWordDetail.leadAudioOrVideoElements" :key="index">
              <div v-if="element.entity.edit">
                <span v-if="element.parsed && element.parsed.name">{{ element.parsed.name }}</span>
                <el-button-group style="margin-left: 20px;">
                  <el-button type="primary" icon="edit" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                </el-button-group>
              </div>
              <div v-else class="edit-biref-element">
                <el-button-group>
                  <el-button type="primary" v-if="element.parsed && element.parsed.materialId" icon="d-arrow-left" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                  <!-- <el-button type="primary" icon="circle-check" :disabled="element.entity.submitMediaButton" @click="submitElementMedia(element)"></el-button> -->
                </el-button-group>
                <el-select v-model="element.entity.type" placeholder="请选择" class="select-material">
                  <el-option v-for="item in materialTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <uploadMethods :oProp='element.entity.type' class="uploadMethods" v-on:child-say='assignVal($event, element)'></uploadMethods>
              </div>
            </el-form-item>

            <el-form-item label="元数据：">
              <div v-for="(word, index) in wordArr" :key="word" class="word">
                <el-select v-model="word.type" placeholder="请选择" class="select-material">
                  <el-option v-for="item in metaTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>

                <el-select v-model="word.id" @visible-change="handleInputBlur($event, word.type)" :placeholder="'请添加单词 ' + (index + 1)" class="check-input" filterable clearable remote :remote-method="word.type === 1 ? searchWordFunc : (word.type === 2 ? searchPhraseFunc : (word.type === 3 ? searchSentenceFunc : searchSentencePatternFunc))"
                    @change="handleChooseMeta($event, index, wordArr, briefBlock)">
                  <el-option style="width: 700px;" v-for="item in (word.type === 1 ? metadataList.wordList : (word.type === 2 ? metadataList.phraseList : (word.type === 3 ? metadataList.sentenceList : metadataList.sentencePatternList)))" :key="item.entity.id" :label="item.entity.english + '（' + item.entity.chinese + '）'"
                      :value="item.entity.id">
                  </el-option>
                </el-select>
                <el-button type="text" icon="circle-close" v-if="wordArr.length > 4" @click="delExpressionsMeta(word, index, wordArr, briefBlock)"></el-button>
                <!-- <el-checkbox class="type" v-model="word.type" true-label="1" false-label="0">跟读</el-checkbox> -->
              </div>
              <el-button type="primary" icon="plus" size="mini" @click="addWordOrSentence(wordArr, 1)"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="content" v-if="briefBlock.briefBlockContent.learnSentenceDetail">
          <el-form ref="briefnessVideo" label-width="100px">
            <el-form-item label="引导：" v-for="(element, index) in briefBlock.briefBlockContent.learnSentenceDetail.leadAudioOrVideoElements" :key="index">
              <div v-if="element.entity.edit">
                <span v-if="element.parsed && element.parsed.name">{{ element.parsed.name }}</span>
                <el-button-group style="margin-left: 20px;">
                  <el-button type="primary" icon="edit" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                </el-button-group>
              </div>
              <div v-else class="edit-biref-element">
                <el-button-group>
                  <el-button type="primary" v-if="element.parsed && element.parsed.materialId" icon="d-arrow-left" @click="element.entity.edit = !element.entity.edit"></el-button>
                  <el-button type="primary" icon="view" @click="previewElementMedia(element)"></el-button>
                  <!-- <el-button type="primary" icon="circle-check" :disabled="element.entity.submitMediaButton" @click="submitElementMedia(element)"></el-button> -->
                </el-button-group>
                <el-select v-model="element.entity.type" placeholder="请选择" class="select-material">
                  <el-option v-for="item in materialTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <uploadMethods :oProp='element.entity.type' class="uploadMethods" v-on:child-say='assignVal($event, element)'></uploadMethods>
              </div>
            </el-form-item>
            <el-form-item label="元数据：">
              <div v-for="(sentence, index) in sentenceArr" :key="sentence" class="sentence">
                <el-select v-model="sentence.type" placeholder="请选择" class="select-material">
                  <el-option v-for="item in metaTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="sentence.id" @visible-change="handleInputBlur($event, sentence.type)" :placeholder="'请添加句子 ' + (index + 1)" class="check-input" filterable clearable remote :remote-method="sentence.type === 1 ? searchWordFunc : (sentence.type === 2 ? searchPhraseFunc : (sentence.type === 3 ? searchSentenceFunc : searchSentencePatternFunc))"
                    @change="handleChooseMeta($event, index, sentenceArr, briefBlock)">
                  <el-option style="width: 700px;" v-for="item in (sentence.type === 1 ? metadataList.wordList : (sentence.type === 2 ? metadataList.phraseList : (sentence.type === 3 ? metadataList.sentenceList : metadataList.sentencePatternList)))" :key="item.entity.id"
                      :label="item.entity.english + '（' + item.entity.chinese + '）'" :value="item.entity.id">
                  </el-option>
                </el-select>
                <el-button type="text" icon="circle-close" v-if="sentenceArr.length > 2" @click="delExpressionsMeta(sentence, index, sentenceArr, briefBlock)"></el-button>
                <!-- <el-checkbox class="type" v-model="sentence.type" true-label="1" false-label="0">跟读</el-checkbox> -->
              </div>
              <el-button type="primary" icon="plus" size="mini" @click="addWordOrSentence(sentenceArr, 3)"></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 简版课程预览音视频 -->
    <el-dialog v-model="previewMediaFlag" close-on-click-modal>
      <div v-if="previewAV">
        <video controls ref="oMedia" v-if="oPlayerTypeFlag" class="preview-video"></video>
        <audio controls ref="oMedia" v-else class="preview-audio"></audio>
      </div>
      <img ref="oMedia" src="" alt="" v-else class="preview-image">
    </el-dialog>

    <el-popover ref="recycle" placement="top" :width="delBlocks.length?800:300" trigger="click">
      <div class="recycle" v-if="delBlocks && delBlocks.length">
        <el-card v-for="(delBlock, index) in delBlocks" :key="index" class="del-block">
          <p>
            <span>{{ delBlock.entity.name || '无名称' }}</span>
            <span>{{ delBlock.entity.description || '无描述' }}</span>
            <span>{{ delBlock.entity.ct | formatTime }}</span>
          </p>
          <el-button type="primary" @click='recallBlock(delBlock)' size='mini' class="recall-button">撤回</el-button>
        </el-card>
      </div>
      <div v-else>当前课节没有板块被删除</div>
    </el-popover>
    <div class="chapter-button" v-if="briefness == 1">
      <el-button type="warning" @click='updateToLesson'>保存顺序</el-button>
      <el-button type="success" @click='addChapter'>新增板块</el-button>
      <!-- <el-button type="warning" @click='addChapter1'>新增亲子板块</el-button> -->
      <el-button type="info" v-popover:recycle @click="inquireRecycle">回收站</el-button>
    </div>
    <div class="chapter-button" v-if="briefness == 4">
      <!-- <el-button type="warning" @click='updateToLesson'>保存顺序</el-button> -->
      <!-- <el-button type="success" @click='addChapter'>新增板块</el-button> -->
      <el-button type="warning" @click='addChapter1'>新增亲子板块</el-button>
      <!-- <el-button type="info" v-popover:recycle @click="inquireRecycle">回收站</el-button> -->
    </div>
    <!-- 新建或者编辑 Block -->
    <el-dialog :title="dialogFlag ? '新增板块' : '编辑板块' " v-model='addFormVisible' :close-on-click-modal='false'>
      <el-form :model="dialogForm" :rules="addBlockRules" ref="dialogForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dialogForm.name" auto-complete="off" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="显示" :label-width="formLabelWidth" required>
          <el-switch v-model="dialogForm.display" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" v-model="dialogForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="info" @click="addFormConfirm('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 新建或者编辑 亲子任务Block -->
    <el-dialog :title="dialogFlag1 ? '新增板块' : '编辑板块' " v-model='addFormVisible1' :close-on-click-modal='false'>
      <el-form :model="dialogForm1" :rules="addBlockRules" ref="dialogForm1">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dialogForm1.name" auto-complete="off" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="显示" :label-width="formLabelWidth" required>
          <el-switch v-model="dialogForm1.display" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="dialogForm1.type" placeholder="请选择">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" v-model="dialogForm1.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible1 = false">取 消</el-button>
        <el-button type="info" @click="addFormConfirm1('dialogForm1')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建 element -->
    <!-- 添加 素材无关 的元素 -->
    <el-dialog :title="editElementContentFlag ? '新建节点' : '编辑节点'" v-model='dialogAddNewElement' :close-on-click-modal='false'>
      <el-form :model="newElementForm" :rules="addElementRules" ref="newElementForm" label-width="100px">
        <el-form-item label="元素名称" prop="name">
          <el-input v-model="newElementForm.name" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="元素标题" v-if='newElementTitleFlag'>
          <el-input v-model="newElementForm.title" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="元素副标题" v-if='newElementSubheadFlag'>
          <el-input v-model="newElementForm.sub_title" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="元素内容" v-if='newElementContentFlag' prop="content">
          <el-input type="textarea" v-model="newElementForm.content" :autosize="{ minRows: 3, maxRows: 6}"></el-input>
        </el-form-item>
        <el-form-item label="目标课节" v-if='newElementLessonSkipFlag' prop="skipLessonId">
          <el-select v-model="newElementForm.skipLessonId" placeholder="请输入课节名称或ID查询" filterable remote :remote-method="selectLessonRemoteMethod" :loading='selectLessonLoading' style="width:250px;">
            <el-option v-for="item in LessonOptions" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转描述" v-if='newElementLessonSkipFlag' prop="skipName">
          <el-input v-model="newElementForm.skipName"></el-input>
        </el-form-item>
        <el-form-item label="链接描述" v-if='newElementUrlFlag || newElementTempUrlFlag' prop="description">
          <el-input v-model="newElementForm.description"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" v-if='newElementUrlFlag' prop="url">
          <el-input v-model="newElementForm.url" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <!--  -->
        <el-form-item label="模板id" v-if='newElementTempUrlFlag'>
          <!-- <el-input v-model="newElementForm.url" @keydown.enter.native.prevent></el-input> -->
          <el-select v-model="selectTemp" style="width:300px;" placeholder="请输入模板实例名称或ID查询" filterable clearable remote :remote-method="selectTempMethod" :loading='selectTempLoading' @change="selectTempSubmit">
            <el-option v-for="item in selectTempOptions" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!--  -->
        <el-form-item label="序列文字" v-if='newElementSequenceFlag' class="sequence-text">
          <el-input v-for="(item, index) in newElementForm.sequence" v-model="item.text" :key='index' @keydown.enter.native.prevent>
            <el-button slot="append" icon="delete" @click="deleteSequence(index, item)"></el-button>
          </el-input>
          <el-button icon="plus" class="addSequence" type="success" @click="addSequence">添加序列</el-button>
        </el-form-item>
        <el-form-item class="footerButton">
          <el-button type="primary" @click="submitElementInfo('newElementForm')">提交</el-button>
          <el-button @click="dialogAddNewElement = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 从 本地上传 到素材库 -->
    <el-dialog title="素材上传" v-model='newElementFileLocalFlag' :close-on-click-modal='false' :size='dialogShowFull'>
      <el-form :model="newElementForm" ref="newElementForm" label-width="100px" :rules="addElementRules">
        <el-form-item label="元素名称" prop="name">
          <el-input v-model="newElementForm.name" @keydown.enter.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="已学类型" v-if='newElementAvLocalFlag'>
          <el-tooltip :content="'是否加入合集'" placement="top">
            <el-switch v-model="newElementForm.reviewType" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否" on-value="1" off-value="0">
            </el-switch>
          </el-tooltip>
          <!-- <el-radio v-model="newElementForm.reviewType" label="0">非重点</el-radio>
          <el-radio v-model="newElementForm.reviewType" label="1">重点</el-radio> -->
        </el-form-item>
        <el-form-item label="选择老师" v-if="avType == '2'">
          <el-radio-group v-model="checkedTeachersInElement" style="width:80%;overflow:hidden" v-if='Teachers.length'>
            <el-radio v-for="(teacher, index) in Teachers" :label="teacher.id" :key="index" style="margin:5px 15px 5px 0">{{ teacher.name }}</el-radio>
          </el-radio-group>
          <div v-else> 当前课程无老师 </div>
        </el-form-item>
        <el-form-item label="重复播放次数" prop="replayNum">
          <el-input v-model="newElementForm.replayNum"></el-input>
        </el-form-item>
      </el-form>
      <PicUploadForElement ref="PicUploadForEle" v-if='newElementPicLocalFlag' v-on:tellParentChangeFlag='ChangeButtonFlag'></PicUploadForElement>
      <AVUploadForElement ref="AVUploadForEle" v-if='newElementAvLocalFlag' :avType='avType' v-on:tellParentChangeFlag='ChangeButtonFlag' v-on:newElementFileLocaldialogShowFull='newElementFileLocaldialogShowFull'></AVUploadForElement>
      <div slot="footer">
        <el-button type="primary" @click="submitElementInfo('newElementForm')" :disabled="submitButtonFalg.local">提交</el-button>
        <el-button @click="newElementFileLocalFlag = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 从 素材库 选择文件上传 -->
    <el-dialog title="素材选择" v-model='newElementFileMaterialFlag' :close-on-click-modal='false' size='full'>
      <el-form :model="newElementForm" ref="newElementForm" label-width="100px" :rules="addElementRules" style="border-bottom:2px solid #666;">
        <el-form-item label="元素名称" prop="name">
          <el-input v-model="newElementForm.name" @keydown.enter.native.prevent style="width:550px;"></el-input>
        </el-form-item>
        <el-form-item label="已学类型" v-if='newElementVideoMaterialFlag || newElementAudioMaterialFlag'>
          <el-tooltip :content="'是否加入合集'" placement="top">
            <el-switch v-model="newElementForm.reviewType" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否" on-value="1" off-value="0">
            </el-switch>
          </el-tooltip>
          <!-- <el-radio v-model="newElementForm.reviewType" label="0">非重点</el-radio>
          <el-radio v-model="newElementForm.reviewType" label="1">重点</el-radio> -->
        </el-form-item>
        <!-- 课节选择老师 -->
        <el-form-item label="选择老师" v-if="newElementAudioMaterialFlag">
          <el-radio-group v-model="checkedTeachersInElement" style="width:80%;overflow:hidden" v-if='Teachers.length'>
            <el-radio v-for="(teacher, index) in Teachers" :label="teacher.id" :key="index" style="margin:5px 15px 5px 0">{{ teacher.name }}</el-radio>
          </el-radio-group>
          <div v-else> 当前课程无老师 </div>
        </el-form-item>
        <!-- 重复播放次数 -->
        <el-form-item label="重复播放次数" prop="replayNum">
          <el-input v-model="newElementForm.replayNum"></el-input>
        </el-form-item>
      </el-form>
      <VideoMaterialForElement v-on:tellParentChangeFlag='ChenckedButtonFlag' v-on:tellParentCheckedMaterial='emitCheckedMaterial' v-if='newElementVideoMaterialFlag' :checkedFalg='submitButtonFalg.material'></VideoMaterialForElement>
      <AudioMaterialForElement v-on:tellParentChangeFlag='ChenckedButtonFlag' v-on:tellParentCheckedMaterial='emitCheckedMaterial' v-if='newElementAudioMaterialFlag' :checkedFalg='submitButtonFalg.material'></AudioMaterialForElement>
      <MaterialListForElement v-on:tellParentChangeFlag='ChenckedButtonFlag' v-on:tellParentCheckedMaterial='emitCheckedMaterial' v-if='newElementPicMaterialFlag' :checkedFalg='submitButtonFalg.material'></MaterialListForElement>
      <div slot="footer">
        <el-button type="primary" @click="submitElementInfo('newElementForm')" :disabled="submitButtonFalg.material">提交</el-button>
        <el-button @click="newElementFileMaterialFlag = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改类型" v-model='changeTypeOfElementFlag' :close-on-click-modal='false' size='tiny'>
      <el-cascader v-if='briefness != 4' expand-trigger="hover" :options="typeOptions" v-model="AddNewElementType" :change-on-select='true'>
      </el-cascader>
      <el-cascader v-if='briefness == 4' expand-trigger="hover" :options="typeOptions1" v-model="AddNewElementType" :change-on-select='true'>
      </el-cascader>
      <el-button type="primary" @click="submitElementChange">提交</el-button>
      <el-button @click="changeTypeOfElementFlag = false">取消</el-button>
    </el-dialog>
    <el-dialog title="关联试卷集" v-model='examSuiteFromVisible' :close-on-click-modal='false'>
      <el-form label-width='100px'>
        <el-form-item label='关联试卷集' prop="id">
          <el-select v-model="examSuiteId" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchCourseFunc">
            <el-option v-for="item in examSuiteList" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="examSuiteFromVisible = false">取消</el-button>
        <el-button type="primary" @click.native="updateLessonDetail">提交</el-button>
      </div>
    </el-dialog>
    <!-- 预习课视频上传之从本地到素材库 -->
    <el-dialog title="素材上传" v-model='uploadForPreviewFormLocal' :close-on-click-modal='false'>
      <AVUploadForElement ref="AVUploadForPre" :avType='"1"' v-on:tellParentChangeFlag='ChangeButtonForPreFlag'></AVUploadForElement>
      <div slot="footer">
        <el-button type="primary" @click="submitAvFormLocal" :disabled='isGetAvId'>提交</el-button>
        <el-button @click="uploadForPreviewFormLocal = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 预习课视频上传之从素材库选择 -->
    <el-dialog title="素材选择" v-model='uploadForPreviewFormSuite' :close-on-click-modal='false' size='full'>
      <VideoMaterialForElement v-on:tellParentChangeFlag='changeBtnFroPreFla' v-on:tellParentCheckedMaterial='emitCheckedMaterialForSuite'></VideoMaterialForElement>
      <div slot="footer">
        <el-button type="primary" @click="submitAvFormLocal" :disabled="uploadAvFormSuite">提交</el-button>
        <el-button @click="newElementFileMaterialFlag = false">取消</el-button>
      </div>
    </el-dialog>
      <!-- 磨耳朵音频上传之从本地到素材库 -->
    <el-dialog title="素材上传" v-model='uploadForPreviewFormLocal1' :close-on-click-modal='false'>
      <AVUploadForElement ref="AVUploadForPre" :avType='"2"' v-on:tellParentChangeFlag='ChangeButtonForPreFlag1'></AVUploadForElement>
      <div slot="footer">
        <el-button type="primary" @click="submitAvFormLocal1" :disabled='isGetAvId1'>提交</el-button>
        <el-button @click="uploadForPreviewFormLocal = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 磨耳朵音频上传之从素材库选择 -->
    <el-dialog title="素材选择" v-model='uploadForPreviewFormSuite1' :close-on-click-modal='false' size='full'>
      <AudioMaterialForElement v-on:tellParentChangeFlag='changeBtnFroPreFla1' v-on:tellParentCheckedMaterial='emitCheckedMaterialForSuite1'></AudioMaterialForElement>
      <div slot="footer">
        <el-button type="primary" @click="submitAvFormLocal1" :disabled="uploadAvFormSuite1">提交</el-button>
        <el-button @click="newElementFileMaterialFlag = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 更新简版课相关状态 -->
    <el-dialog title="更新简版课程相关信息" v-model='briefBlocksUpdate' :close-on-click-modal='false'>
      <el-form label-width='100px'>
        <el-form-item label='简版课程状态'>
          <el-radio-group v-model="briefBlocksForm.status">
            <el-radio-button label="1">有效</el-radio-button>
            <el-radio-button label="0">无效</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitBriefBlocksUpdate">提交</el-button>
        <el-button @click="briefBlocksUpdate = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 更新音乐课件相关状态 -->
    <el-dialog title="更新音乐课课程相关信息" v-model='musicStatusChange' :close-on-click-modal='false'>
      <el-form label-width='120px'>
        <el-form-item label='音乐课课程状态'>
          <el-radio-group v-model="musicStatus">
            <el-radio-button :label="1">有效</el-radio-button>
            <el-radio-button :label="0">无效</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitMusicStatus">提交</el-button>
        <el-button @click="musicStatusChange = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 设置简版课倍速 -->
    <el-dialog title="设置儿歌倍速" v-model='musicLessonSongHzDia' :close-on-click-modal='false'>
      <el-form label-width='120px'>
        <el-input placeholder='请输入倍速' v-model="songHz" style="width:150px"></el-input>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitMusicSongHz">提交</el-button>
        <el-button @click="musicLessonSongHzDia = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 音乐课件block -->
    <div v-if="briefness == 3 &&lessonType!=2" v-loading='loading' element-loading-text="努力加载中" class="briefness-course" style="margin-top: 20px;">
      <el-collapse v-model="musicBlockIsShow">
        <el-collapse-item title="视频配置" :name="1">
          <div class="item">
            <div class="content">
              <el-form label-position="right" label-width="80px">
                <el-form-item label='儿歌视频'>
                  <el-button type="primary" @click="previewMedia(0, musicSongObj.materialId)" style="float:left;">预览</el-button>
                  <el-tooltip effect="dark" :content="musicSongObj.name" placement="top-start" v-if='musicSongObj && musicSongObj.name'>
                    <span class="media-info" v-if='musicSongObj.name'>{{musicSongObj.name}}</span>
                  </el-tooltip>
                  <uploadMethods :oProp="1" :oVal="'materialId'" v-on:child-say='updateSong' class="review-upload"></uploadMethods>
                </el-form-item>
                <el-form-item label='讲解视频'>
                  <el-button type="primary" @click="previewMedia(0, musicExplainSongObj.materialId)" style="float:left;">预览</el-button>
                  <el-tooltip effect="dark" :content="musicExplainSongObj.name" placement="top-start" v-if='musicExplainSongObj.name'>
                    <span class="media-info" v-if='musicExplainSongObj.name'>{{musicExplainSongObj.name}}</span>
                  </el-tooltip>
                  <uploadMethods :oProp="1" :oVal="'materialId'" v-on:child-say='updateExplain' class="review-upload"></uploadMethods>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="课程目标" :name="2">
          <div class="item">
            <div class="content">
              <el-form label-position="right" label-width="80px">
                <!-- <el-form-item label='配置图片'>
                  <el-button type="primary" @click="previewMedia(0, homePageConf.)" style="float:left;">预览</el-button>
                  <el-tooltip class="item" effect="dark" :content="homePageConf.imageName" placement="top-start" v-if='homePageConf.imageName'>
                    <span class="media-info" v-if='homePageConf.imageName'>{{homePageConf.imageName}}</span>
                  </el-tooltip>
                  <uploadMethods :oProp="0" :oVal="'materialId'" v-on:child-say='updateHomePageImage' class="review-upload"></uploadMethods>
                </el-form-item> -->
                <el-form-item label='配置音频'>
                  <el-button type="primary" @click="previewMedia(0, homePageConf.audioId)" style="float:left;">预览</el-button>
                  <el-tooltip effect="dark" :content="homePageConf.audioName" placement="top-start" v-if='homePageConf.audioName'>
                    <span class="media-info" v-if='homePageConf.audioName'>{{homePageConf.audioName}}</span>
                  </el-tooltip>
                  <uploadMethods :oProp="2" :oVal="'materialId'" v-on:child-say='updateHomePageAudio' class="review-upload"></uploadMethods>
                </el-form-item>
              </el-form>
              <CourseBlock :isDrag="isDrag" :blockId='Number(musicHomePageBlockId)' :showBlockMethod='false' @addElement='addElement' @editElement='editElement' @deleteElement='onDeleteElement' @changeType='onChangeType' @playAV="playAV" :blockInfo='musicHomePage'></CourseBlock>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="单词配置" :name="3">
          <div class="item">
            <div class="content">
              <el-form label-position="right" label-width="80px">
                <el-form-item label="元数据：">
                  <div v-for="(word, index) in MusicWordArr" :key="word" class="word">
                    <el-select v-model="word.type" placeholder="请选择" class="select-material">
                      <el-option v-for="item in musicMetaTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="word.id" :placeholder="'请添加单词 ' + (index + 1)" @visible-change="handleInputBlur($event, word.type)" class="check-input" filterable clearable remote :remote-method="word.type == 1?searchWordFunc:(word.type == 2?searchPhraseFunc:(word.type ==3?searchSentenceFunc:searchSentencePatternFunc))"
                        @change="updateMusicWord($event, index, MusicWordArr)">
                      <el-option style="width: 700px;" v-for="prop in (word.type === 1 ? metadataList.wordList : (word.type === 2 ? metadataList.phraseList : (word.type === 3 ? metadataList.sentenceList : metadataList.sentencePatternList)))" :key="prop.entity.id" :value="prop.entity.id"
                          :label="prop.entity.english + '（' + prop.entity.chinese + '）'">
                      </el-option>
                    </el-select>
                    <el-button type="text" icon="circle-close" v-if="MusicWordArr.length > 4" @click="delExpressionsMeta(word, index, MusicWordArr, '', 1)"></el-button>
                  </div>
                  <el-button type="primary" icon="plus" size="mini" @click="addWordOrSentence(MusicWordArr, 1)"></el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="家长讲解" :name="4">
          <div class="item">
            <div class="content">
              <CourseBlock :isDrag="isDrag" :blockId='Number(explainPageBlockId)' :showBlockMethod='false' @addElement='addElement' @editElement='editElement' @deleteElement='onDeleteElement' @changeType='onChangeType' @playAV="playAV" :blockInfo='explainPage'></CourseBlock>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <draggable :list="musicScenes" :options='blockDragOption'>
        <el-collapse v-model="musicSceneIsShow" v-for='(scene, index) in musicScenes'>
          <el-collapse-item :title='"场景配置" + (index+1)' :name="(index+1)">
            <el-form label-position="right" label-width="100px" :model='scene'>
              <!-- <el-form-item label="场景句子英文">
                <el-input v-model="scene.english" type='textarea' style='width:700px'></el-input>
              </el-form-item> -->
              <el-form-item label="场景句子中文">
                <el-input v-model="scene.chinese" type='textarea' style='width:700px'></el-input>
              </el-form-item>
              <el-form-item label="预览" v-if="scene.image_id || scene.audio_id">
                <div class="preview-container">
                  <div v-if="scene.image_id">
                    <img :src="scene.image_url" alt="">
                    <span>图片预览</span>
                  </div>
                  <div v-if="scene.audio_id" class="conclude-media">
                    <img :src="scene.audio_id" alt="" @click="previewMedia(0, scene.audio_id)">
                    <span>音频预览</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label='背景图片'>
                <uploadMethods :oProp="0" :oVal="'image_id'" v-on:child-say='updateSceneImage($event, scene)' class="review-upload"></uploadMethods>
              </el-form-item>
              <el-form-item label='场景音频'>
                <uploadMethods :oProp="2" :oVal="'audio_id'" v-on:child-say='updateSceneSong($event, scene)' class="review-upload"></uploadMethods>
              </el-form-item>
              <el-form-item label="配置歌词">
                <el-input v-model="scene.lyric" type='textarea' style='width:700px' :rows='7' placeholder='配置歌词注意歌词格式'></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="saveScene(scene)">保存场景</el-button>
                <el-button type="primary" @click="delScene(scene)">删除场景</el-button>
                <el-button type="info" @click="lyricForSong(scene)">编译歌词</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </draggable>
    </div>
    <!-- 新增场景 -->
    <div class="chapter-button" v-if="briefness == 3">
      <el-button type="success" @click='sortScene'>保存顺序</el-button>
      <el-button type="info" @click='setSongHz'>设置倍速</el-button>
      <el-button type="primary" @click='addScene'>新增场景</el-button>
    </div>
    <!-- 单词选择 -->
    <el-dialog title="选择合适的单词" v-model='lyricWordChoose' :close-on-click-modal='false'>
      <el-form label-width='120px'>
        <el-form-item :label="item.english + ':'" v-for='(item, index) in lyricWordArr' v-if='item.english'>
          <el-radio-group v-model="item.id" v-if='item.isHave'>
            <el-radio :label="prop.entity.id" v-for='prop in item.wordArr'>{{ ' ( ' + prop.entity.id + ' ) ' + prop.entity.chinese }}</el-radio>
          </el-radio-group>
          <span v-if='!item.isHave&&item.english'>词句库暂无此短语</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitLyricWord">提交</el-button>
        <el-button @click="lyricWordChoose = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 复习课block-->
    <div v-if="briefness == 2 &&lessonType==2" v-loading='loading' element-loading-text="努力加载中">
      <el-collapse v-for='(pro, blockIndex) in reviseContent' :key='blockIndex' class="list-complete-item" v-model='showReviewBlock'>
        <el-collapse-item :name='blockIndex'>
          <template slot="title">
              <span class="blockName">名称：{{ pro.block.name }}</span>
              <span class="blockDescription">描述：{{ pro.block.description }}</span>
              </template>
          <el-collapse v-for='(item, index) in reviewEleList' :key='index' class="list-complete-item" v-model='showReviewEle'>
            <el-collapse-item :name='index'>
              <template slot="title">
                  <span class="blockName">名称：{{ item.entity.name }}</span>
                  <span class="blockDescription">类型：{{ item.entity.type==1?'非互动':(item.entity.type == 7?'跟读':'题目') }}</span>
                  </template>
              <el-form label-width='100px' class="element-for-review">
                <!-- <el-form-item label='节点名称'>
                  <el-input v-model="item.entity.name" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label='上传视频' v-if='item.entity.type==1'>
                  <el-button type="primary" @click="previewMedia(0, item.parsed.materialId)" style="float:left;">预览</el-button>
                  <el-tooltip class="item" effect="dark" :content="item.parsed.name" placement="top-start" v-if='item.parsed.name'>
                    <span class="media-info" v-if='item.parsed.name'>{{item.parsed.name}}</span>
                  </el-tooltip>
                  <uploadMethods :oProp="1" :oVal="'materialId'" :oClearForm="addReviewFormVisible" v-on:child-say='editReviewAssignVal($event, item)' class="review-upload"></uploadMethods>

                </el-form-item>
                <el-form-item label='背景视频' v-if='(item.entity.type==7)||(item.entity.type==8)'>
                  <el-button type="primary" @click="previewMedia(0, item.parsed.bgMaterialId)" style="float:left;">预览</el-button>
                  <el-tooltip class="item" effect="dark" :content="item.parsed.bgMaterialName" placement="top-start" v-if='item.parsed.bgMaterialName'>
                    <span class="media-info" v-if='item.parsed.bgMaterialName'>{{item.parsed.bgMaterialName}}</span>
                  </el-tooltip>
                  <uploadMethods :oProp="1" :oVal="'bgMaterialId'" :oClearForm="addReviewFormVisible" v-on:child-say='editReviewAssignVal($event, item)' class="review-upload"></uploadMethods>
                </el-form-item>
                <el-form-item label='重复播放次数' v-if='(item.entity.type == 7)'>
                  <el-input v-model="item.parsed.replayNum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label='关联题库' v-if='(item.entity.type == 8)'>
                  <el-select v-model="item.parsed.parsedQuestion.entity.id" placeholder="请输入题目关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchQuestionFunc" @change='updateReviewEle($event,item)'>
                    <el-option v-for="prop in questionOptions" :key="prop.id" :label="' （ ' + prop.id + '） ' + prop.name" :value="prop.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='关联词句' v-if='(item.entity.type==7)'>
                  <el-select v-model="item.parsed.type" placeholder="请选择" class="select-material" @change='selectWordOrSentence($event,item) '>
                    <el-option v-for="prop in metaTypeOptions" :key="prop.value" :label="prop.label" :value="prop.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="item.parsed.expressionObj.entity.id" placeholder="请输入单词关键字" style="width:300px;" filterable clearable remote :remote-method="searchWordFunc" @change='updateReviewEle($event,item)' v-if='item.parsed.type==1'>
                    <el-option v-for="prop in metadataList.wordList" :key="prop.entity.id" :label="' （ ' + prop.entity.id + '） ' + prop.entity.english" :value="prop.entity.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="item.parsed.expressionObj.entity.id" placeholder="请输入短语关键字" style="width:300px;" filterable clearable remote :remote-method="searchPhraseFunc" @change='updateReviewEle($event,item)' v-if='item.parsed.type==2'>
                    <el-option v-for="prop in metadataList.phraseList" :key="prop.entity.id" :label="' （ ' + prop.entity.id + '） ' + prop.entity.english" :value="prop.entity.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="item.parsed.expressionObj.entity.id" placeholder="请输入句子关键字" style="width:300px;" filterable clearable remote :remote-method="searchSentenceFunc" @change='updateReviewEle($event,item)' v-if='item.parsed.type==3'>
                    <el-option v-for="prop in metadataList.sentenceList" :key="prop.entity.id" :label="' （ ' + prop.entity.id + '） ' + prop.entity.english" :value="prop.entity.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="item.parsed.expressionObj.entity.id" placeholder="请输入句型关键字" style="width:300px;" filterable clearable remote :remote-method="searchSentencePatternFunc" @change='updateReviewEle($event,item)' v-if='item.parsed.type==4'>
                    <el-option v-for="prop in metadataList.sentencePatternList" :key="prop.entity.id" :label="' （ ' + prop.entity.id + '） ' + prop.entity.english" :value="prop.entity.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
      <el-card v-if='!allComponents.length && briefness == 1 ' class='componentFlag '>亲，当前课节没有板块</el-card>
    </div>

    <div class="preview-video-container" v-show="previewVideoVisible">
      <div class="mask" @click="stopPreviewVideo"></div>
      <video controls ref="oVideo"></video>
    </div>
    <div class="preview-audio-container" v-show="previewAudioVisible">
      <div class="mask" @click="stopPreviewAudio"></div>
      <audio controls ref="oAudio"></audio>
    </div>
  </section>
  </template>

  <script>
  import CourseBlock from "../../components/CourseBlock";
  import PicUploadForElement from "../../components/PicUploadForElement";
  import AVUploadForElement from "../../components/AVUploadForElement";
  import MaterialListForElement from "../../components/MaterialListForElement";
  import AudioMaterialForElement from "../../components/AudioMaterialForElement";
  import VideoMaterialForElement from "../../components/VideoMaterialForElement";
  import draggable from "vuedraggable";
  import uploadMethods from "../../components/word-sentence-library/uploadMethods";

  import {
    updateWxxEar,
    addWxxPcBlock,
    updateWxxPcBlock,
    editBlockInfo,
    addBlockToLesson,
    updateBlockInLesson,
    delBlockFromLesson,
    addNewElement,
    updateElement,
    deleteElement,
    getLessonList,
    getLessonDetails,
    getTeacherListInCourse,
    getExamSuiteList,
    editLessonInfo,
    getDelblocks,
    addBlockByBlockId,
    getWordList,
    getPhraseList,
    getSentenceList,
    getSentencePatternList,
    updateWordIds,
    updatePhraseIds,
    updateSentencePatternIds,
    updateSentenceIds,
    updateBriefBlocks,
    initBriefBlocksElements,
    getMaterialsList,
    getDownloadUrl,
    changeBriefBlockVoca,
    addReviewElement,
    getQuestionList,
    changeReviewEle,
    initReviewBlock,
    getTempById,
    getTempInsList,
    initMusicBlock, //初始化音乐课block
    updateSongVideo, // 设置儿歌视频
    updateExplainVideo, //设置儿歌讲解视频
    changeMusicLessonStatus, //修改状态
    addMusicScene, // 新增场景
    delMusicScene, // 删除场景
    sortMusicScene, // 排序场景
    updateMusicScene, // 修改场景
    updateHomeImage, // 配置首页图片
    updateHomeAudio, // 配置首页音频
    updateMusicVocabularies, // 音乐课词汇配置
    // 歌词相关
    updateMaterial,
    updateSpeedFactor, // 设置倍速
  } from "../../api/api";

  import util from "../../common/js/util";

  export default {
    components: {
      draggable,
      CourseBlock,
      PicUploadForElement,
      AVUploadForElement,
      MaterialListForElement,
      AudioMaterialForElement,
      VideoMaterialForElement,

      uploadMethods
    },

    data() {
      return {
        lessonEssInfo: "", // 课节 详细信息展示数据
        switchWidth: 60, // 显示隐藏按钮的宽度
        blockInitFlag: true, // 显示 隐藏按钮对应的数据
        activeNames: [], // 展开面板对应数据
        activeNames1: [], // 展开面板对应数据
        allComponents: [], // 所有block的信息集合。
        allComponents1: [], // 亲子block的信息集合。
        flagparent: "", // 校验亲子板块不可重复添加
        addFormVisible: false, // 新增板块是否显示
        addFormVisible1: false, // 新增板块是否显示
        dialogFlag: false, // 显示新增还是 编辑的  flag
        dialogFlag1: false, // 显示新增还是 编辑的  flag
        dialogForm: "", //编辑板块的表单
        dialogForm1: "", //编辑板块的表单
        formLabelWidth: "100px", //新增或编辑Block页面的宽度
        blockIndex: "",

        dialogAddNewElement: false, // element 文本内容 弹窗
        newElementFileLocalFlag: false, // element 素材上传 弹窗
        newElementFileMaterialFlag: false, // element 素材库选择 弹窗
        submitButtonFalg: {
          local: true,
          material: true
        },
        newElementTitleFlag: false, // 标题
        newElementSubheadFlag: false, // 副标题
        newElementContentFlag: false, // 内容
        newElementUrlFlag: false, // 链接
        newElementTempUrlFlag: false, // 模板链接
        newElementPicLocalFlag: false, // 本地图片上传
        newElementAvLocalFlag: false, // 本地音视频上传
        newElementPicMaterialFlag: false, // 素材库 选择图片
        newElementVideoMaterialFlag: false, // 素材库 选择视频
        newElementAudioMaterialFlag: false, // 素材库 选择音频
        newElementSequenceFlag: false, // 序列文字
        newElementLessonSkipFlag: false, // 课程跳转
        checkedTeachersInElement: "", // element 选择老师
        Teachers: [],
        newElementForm: {
          // 新建 Element 的表单数据
          url: "",
          block_id: "",
          name: "",
          type: "",
          style_type: "",
          material_id: "",
          title: "",
          sub_title: "",
          content: "",
          sequence: [
            {
              text: ""
            },
            {
              text: ""
            },
            {
              text: ""
            }
          ],
          description: "",
          reviewType: "0",
          skipLessonId: "",
          skipName: "",
          replayNum: 0
        },
        avType: "",
        dialogShowFull: "small",
        options: [
          // 课程能选择的类型
          {
            value: "0",
            label: "课程内容"
          },
          {
            value: "1",
            label: "任务"
          },
          {
            value: "2",
            label: "游戏"
          }
        ],
        options1: [
          // 课程能选择的类型
          {
            value: "0",
            label: "请选择"
          },
          {
            value: "12",
            label: "亲子任务"
          }
        ],
        // 跳转课节 查询课节
        LessonOptions: [],
        selectLessonLoading: false,

        addBlockRules: {
          //新增板块的验证
          name: [
            {
              min: 0,
              max: 64,
              message: "长度在 0 到 64 个字符",
              trigger: "blur"
            }
          ],
          display: [
            {
              required: true,
              message: "请选择板块是否显示",
              trigger: "change"
            }
          ],
          type: [
            {
              required: true,
              message: "请选择板块类型",
              trigger: "blur"
            }
          ],
          description: [
            {
              min: 0,
              max: 100,
              message: "长度在100个字符以内",
              trigger: "blur"
            }
          ]
        },
        addReviewEleRules: {
          question_id: [
            {
              type: "number",
              required: true,
              message: "请选择题库id",
              trigger: "blur"
            }
          ],
          material_id: [
            {
              required: true,
              message: "请选择上传视频",
              trigger: "blur",
              type: "number"
            }
          ],
          bg_material_id: [
            {
              type: "number",
              required: true,
              message: "请选择背景视频",
              trigger: "blur"
            }
          ],
          expression_id: [
            {
              type: "number",
              required: true,
              message: "请选择词句库",
              trigger: "blur"
            }
          ]
        },
        addElementRules: {
          name: [
            {
              required: false,
              message: "请输入节点名称",
              trigger: "blur"
            },
            {
              min: 0,
              max: 64,
              message: "长度在 0 到 64 个字符",
              trigger: "blur"
            }
          ],
          content: [
            {
              required: true,
              message: "请输入元素内容",
              trigger: "blur"
            }
          ],
          skipLessonId: [
            {
              required: true,
              type: "number",
              message: "请输入课节id",
              trigger: "blur"
            }
          ],
          skipName: [
            {
              required: true,
              type: "string",
              message: "请填写跳转描述",
              trigger: "blur"
            },
            {
              min: 0,
              max: 100,
              message: "长度在100个字符以内",
              trigger: "blur"
            }
          ],
          url: [
            {
              required: true,
              message: "请输入链接地址",
              trigger: "blur"
            }
          ]
        },
        // 修改类型相关
        changeTypeOfElementFlag: false,
        AddNewElementType: ["4", "1"],
        typeOptions: [
          // 课程能选择的类型
          {
            value: "0",
            label: "图片",
            children: [
              {
                value: "0",
                label: "本地上传"
              },
              {
                value: "1",
                label: "从素材库选择"
              }
            ]
          },
          {
            value: "1",
            label: "视频",
            children: [
              {
                value: "0",
                label: "本地上传"
              },
              {
                value: "1",
                label: "从素材库选择"
              }
            ]
          },
          {
            value: "2",
            label: "音频",
            children: [
              {
                value: "0",
                label: "本地上传"
              },
              {
                value: "1",
                label: "从素材库选择"
              }
            ]
          },
          {
            value: "3",
            label: "链接",
            children: [
              {
                value: "0",
                label: "自定义链接"
              }
            ]
          },
          {
            value: "4",
            label: "文字",
            children: [
              {
                value: "0",
                label: "无气泡文字"
              },
              {
                value: "1",
                label: "气泡文字"
              },
              {
                value: "2",
                label: "有编号序列文字无标题"
              },
              {
                value: "3",
                label: "有编号序列文字带标题无副标题"
              },
              {
                value: "4",
                label: "有编号序列文字带标题带副标题"
              },
              {
                value: "5",
                label: "无编号序列文字无标题"
              }
            ]
          },
          {
            value: "5",
            label: "跳转",
            children: [
              {
                value: "0",
                label: "课程跳转"
              }
            ]
          }
        ],
        typeOptions1: [
          // 课程能选择的类型
          {
            value: "0",
            label: "图片",
            children: [
              {
                value: "0",
                label: "本地上传"
              },
              {
                value: "1",
                label: "从素材库选择"
              }
            ]
          },
          {
            value: "1",
            label: "视频",
            children: [
              {
                value: "0",
                label: "本地上传"
              },
              {
                value: "1",
                label: "从素材库选择"
              }
            ]
          },
          {
            value: "2",
            label: "音频",
            children: [
              {
                value: "0",
                label: "本地上传"
              },
              {
                value: "1",
                label: "从素材库选择"
              }
            ]
          },
          {
            value: "3",
            label: "链接",
            children: [
              {
                value: "0",
                label: "自定义链接"
              }
            ]
          },
          {
            value: "4",
            label: "文字",
            children: [
              {
                value: "0",
                label: "无气泡文字"
              },
              {
                value: "1",
                label: "气泡文字"
              },
              {
                value: "2",
                label: "有编号序列文字无标题"
              }
            ]
          }
        ],
        // 编辑 条目相关
        editElementMeterialFlag: false, // 对素材类element 的编辑
        editElementContentFlag: true, // 真 为新增。假为 编辑
        editElementAVFlag: false, // 如果是AV格式。 则显示重点非重点
        loading: true,
        examSuiteFromVisible: false, //关联试卷集弹窗状态初始化
        examSuiteList: [],
        examSuiteId: "",
        examSuite: {},
        lessonDetailInfo: {},
        lessonDetailInfo1: [],
        uploadForPreviewFormLocal: false,
        uploadForPreviewFormLocal1: false,
        isGetAvId: true,
        isGetAvId1: true,
        uploadForPreviewFormSuite: false,
        uploadForPreviewFormSuite1: false,
        uploadAvFormSuite: true,
        uploadAvFormSuite1: true,

        baseMetadataFromVisible: false, // 配置基本元数据 弹框
        expressionsMeta: {
          wordsParsed: [],
          phrasesParsed: [],
          sentencePatternsParsed: [],
          sentencesParsed: []
        },
        inputVisible: {
          word: false,
          sentence: false,
          phrase: false,
          sentencePattern: false
        },
        metadataList: {
          wordList: [],
          phraseList: [],
          sentencePatternList: [],
          sentenceList: []
        },
        inputValue: "",

        briefness: "1", // 简版课程显示

        testUplopad: "",

        metaTypeOptions: [
          {
            value: 1,
            label: "单词"
          },
          {
            value: 2,
            label: "短语"
          },
          {
            value: 3,
            label: "句子"
          },
          {
            value: 4,
            label: "句型"
          }
        ],
        musicMetaTypeOptions: [
          {
            value: 1,
            label: "单词"
          },
          {
            value: 2,
            label: "短语"
          }
        ],
        wordArr: [
          {
            id: "",
            type: 1
          },
          {
            id: "",
            type: 1
          },
          {
            id: "",
            type: 1
          },
          {
            id: "",
            type: 1
          }
        ],
        MusicWordArr: [
          {
            id: "",
            type: 1
          },
          {
            id: "",
            type: 1
          },
          {
            id: "",
            type: 1
          },
          {
            id: "",
            type: 1
          }
        ],
        sentenceArr: [
          {
            id: "",
            type: 3
          },
          {
            id: "",
            type: 3
          }
        ],

        delBlocks: [],

        briefBlocksUpdate: false,
        briefBlocksForm: {
          id: this.$route.params.lessonId,
          block_ids: "",
          ver: "1",
          status: "1"
        },
        briefBlocks: [],
        materialTypeOptions: [
          {
            value: 0,
            label: "图片"
          },
          {
            value: 1,
            label: "视频"
          },
          {
            value: 2,
            label: "音频"
          }
        ],
        previewMediaFlag: false,
        oPlayerTypeFlag: true,
        previewAV: true,
        lessonType: 0, // 判断复习课类型
        reviseContent: [], // 得到复习课相应的block
        elementType: "1", // 复习课的节点类型
        addReviewFormVisible: false, // 更新复习课block接口
        addReviewEle: {
          name: "",
          block_id: "",
          type: "",
          material_id: "",
          replay_num: 0,
          bg_material_id: "",
          question_id: "",
          expression_id: ""
        }, // 新增的复习课节点对象
        questionOptions: {}, //题库列表
        reviewBlockId: "", // 复习课blockid
        wordOrSentenceType: "", //判断词句类型
        reviewEleList: [], //复习课elementlist
        previewVideoVisible: false, // 预览框控制
        previewAudioVisible: false,
        metaDateType: "",
        showReviewBlock: [0],
        showReviewEle: [
          0,
          3,
          4,
          5,
          7,
          8,
          9,
          10,
          11,
          12,
          14,
          15,
          17,
          18,
          19,
          20,
          22,
          23
        ],

        // 选择模板实例相关
        selectTemp: "",
        selectTempLoading: false,
        selectTempOptions: [],

        // 音乐课件相关
        musicLessonInit: false,
        musicLessonData: null,
        musicStatusChange: false,
        musicStatus: 1,
        musicBlockIsShow: [],
        musicSceneIsShow: [],
        musicScenes: [
          {
            block_id: "",
            english: "",
            chinese: "",
            image_id: "",
            audio_id: "",
            lyric: "",
            image_url: "",
            audio_name: ""
          }
        ],
        musicSongObj: {
          material_id: "",
          name: ""
        },
        musicExplainSongObj: {
          material_id: "",
          name: ""
        },
        homePageConf: {
          imageName: "",
          imageId: "",
          imageUrl: "",
          audioName: "",
          audioId: ""
        },
        musicHomePage: [],
        musicHomePageBlockId: "",
        explainPageBlockId: "",
        explainPage: [],
        lyricWordChoose: false,
        lyricWordArr: [],
        sceneLyricConf: "",
        musicLessonSongHzDia: false,
		songHz: 0.66,
        isDrag: 1,
        blockDragOption: {
          disabled: false
        }
      };
    },
    methods: {
      // 选择模板的方法
      selectTempMethod(query) {
        if (query !== "") {
          this.selectTempLoading = true;
          let temp = Number(query);
          let para = {};
          temp ? (para["id"] = temp) : (para["name"] = query);
          getTempInsList(para)
            .then(res => {
              if (res.data.success && res.data.data.items) {
                this.selectTempOptions = res.data.data.items.map(item => {
                  let tempObj = {
                    id: item.entity.id,
                    name: item.entity.name,
                    templateId: item.entity.templateId
                  };
                  return tempObj;
                });
              }
              this.selectTempLoading = false;
            })
            .catch(error => {
              this._catch(error);
            });
        } else {
          this.selectTempOptions = [];
        }
      },
      // 选择之后的方法
      selectTempSubmit() {
        if (!this.selectTemp.templateId) {
          return;
        }
        getTempById({
          id: this.selectTemp.templateId
        })
          .then(res => {
            this.newElementForm.url =
              res.data.data.entity.htmlUrl + "?tem_ins_id=" + this.selectTemp.id;
          })
          .catch(error => {
            this._catch(error);
          });
      },
      _catch(error) {
        if (error.response) {
          this.$notify({
            title: error.response.status,
            message: "网络请求错误",
            type: "error"
          });
        } else if (error.request) {
          this.$notify({
            title: error.request,
            message: "网络请求错误",
            type: "error"
          });
        } else {
          this.$notify({
            title: "错误",
            message: error.message,
            type: "error"
          });
        }
      },
      // 点击新增板块的方法。
      addChapter() {
        this.dialogFlag = true;
        this.addFormVisible = true;
        this.dialogForm = {
          name: "",
          display: "1",
          type: "0",
          description: ""
        };
      },
      // 点击新增亲子任务板块的方法。
      addChapter1() {
        this.dialogFlag1 = true;
        this.addFormVisible1 = true;
        this.dialogForm1 = {
          name: "",
          display: "1",
          type: "0",
          description: ""
        };
      },

      // 删除板块的方法
      deleteBlock(obj) {
        this.$confirm("此操作将会把当前板块放入回收站, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              block_id: this.allComponents[obj].id,
              lesson_id: this.allComponents[obj].lessonId
            };
            delBlockFromLesson(params)
              .then(res => {
                if (res.data.success) {
                  this.allComponents.splice(obj, 1);
                  this.activeNames = [];
                  this.$notify({
                    type: "success",
                    message: "删除成功!",
                    duration: 1500
                  });
                } else {
                  this.$notify({
                    type: "error",
                    message: res.data.msg || "未知错误，请联系管理员"
                  });
                }
              })
              .catch(error => {
                this._catch(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      // 删除亲子板块对话框
      deleteBlock1() {
        this.$notify({
          type: "error",
          message: "亲子板块不可删除!",
          duration: 1500
        });
      },
      // 板块编辑的方法
      editBlock(obj) {
        this.dialogFlag = false; //显示编辑
        this.addFormVisible = true; //显示 窗口
        this.allComponents[obj].type += "";
        this.dialogForm = this.allComponents[obj];
      },
      // 亲子板块编辑的方法
      editBlock1(obj) {
        this.dialogFlag1 = false; //显示编辑
        this.addFormVisible1 = true; //显示 窗口
        this.allComponents1[obj].type += "";
        this.dialogForm1 = this.allComponents1[obj];
      },
      // 获取lesson 的基本信息方法
      getLessonEssInfo() {
        let parameter = {
          id: this.$route.params.lessonId
        };
        getLessonDetails(parameter)
          .then(res => {
            this.allComponents = [];
            this.allComponents1 = [];
            this.briefBlocks = [];
            if (res.data.success) {
              // 判断是不是复习课
              this.lessonType = res.data.data.lesson.entity.type;
              if (res.data.data.lesson) {
                this.lessonDetailInfo = res.data.data.lesson;
                this.lessonEssInfo = res.data.data.lesson.entity;
              }
              if (res.data.data.musicLesson) {
                this.musicLessonInit = true;
                this.musicLessonData = res.data.data.musicLesson;
              }
              if (res.data.data.blocks) {
                res.data.data.blocks.forEach(item => {
                  if (!(item.block == null)) {
                    let tempObj = item.block;
                    tempObj["display"] += "";
                    tempObj["blockInfo"] = {};
                    tempObj["blockInfo"]["InfoDevelop"] = true;
                    tempObj["blockInfo"]["InfoMessage"] = item.elements || [];
                    tempObj["display"] += "";
                    this.$set(
                      this.allComponents,
                      this.allComponents.length,
                      tempObj
                    );
                  }
                });
              }
              if (res.data.data.wXxContentDetail.pcAction) {
                this.flagparent = res.data.data.wXxContentDetail.pcAction;
                this.lessonDetailInfo1 = res.data.data.wXxContentDetail;
                // console.log(this.lessonDetailInfo1.pcAction);
                let arr = [];
                arr.push(res.data.data.wXxContentDetail.pcAction);
                arr.forEach(item => {
                  if (!(item.block == null)) {
                    let tempObj = item.block;
                    tempObj["display"] += "";
                    tempObj["blockInfo"] = {};
                    tempObj["blockInfo"]["InfoDevelop"] = true;
                    tempObj["blockInfo"]["InfoMessage"] = item.elements || [];
                    tempObj["display"] += "";
                    this.$set(
                      this.allComponents1,
                      this.allComponents1.length,
                      tempObj
                    );
                  }
                });
              }
              if (this.lessonType === 2) {
                if (
                  res.data.data.briefBlocks &&
                  res.data.data.briefBlocks.length
                ) {
                  this.reviseContent = res.data.data.briefBlocks.map(item => {
                    if (
                      item.reviewBlockContent &&
                      item.reviewBlockContent.entityList
                    ) {
                      this.reviewEleList = item.reviewBlockContent.entityList;
                      this.reviewEleList.map(prop => {
                        if (prop.entity.type == 6) {
                          prop.entity.type = 1;
                        }
                        if (prop.entity.type == 8) {
                          if (!prop.parsed.parsedQuestion) {
                            prop.parsed.parsedQuestion = {
                              entity: {
                                id: ""
                              }
                            };
                          }
                        }
                        if (prop.entity.type == 7) {
                          if (!prop.parsed.expressionObj) {
                            prop.parsed.expressionObj = {
                              entity: {
                                id: ""
                              }
                            };
                          }
                          if (!prop.parsed.type) {
                            this.$set(prop.parsed, "type", 1);
                          }
                        }
                      });
                    }
                    return item;
                  });
                }
              } else {
                if (
                  res.data.data.briefBlocks &&
                  res.data.data.briefBlocks.length
                ) {
                  this.briefBlocks = res.data.data.briefBlocks.map(item => {
                    for (var variable in item.briefBlockContent) {
                      if (item.briefBlockContent.hasOwnProperty(variable)) {
                        let leadArr =
                          item.briefBlockContent[variable]
                            .leadAudioOrVideoElements;
                        for (let i = 0; i < leadArr.length; i++) {
                          let leadEntity = leadArr[i];
                          leadEntity.entity.type = 2;
                          leadEntity.entity["media"] = null;
                          leadEntity.entity["submitMediaButton"] = true;
                          if (leadEntity.parsed && leadEntity.parsed.materialId) {
                            leadEntity.entity["edit"] = true;
                          } else {
                            leadEntity.entity["edit"] = false;
                          }
                        }
                        if (
                          item.briefBlockContent[variable].learnVideoConfContents
                        ) {
                          let learnArr =
                            item.briefBlockContent[variable]
                              .learnVideoConfContents;
                          for (let i = 0; i < learnArr.length; i++) {
                            let learnItem = learnArr[i];
                            learnItem.explainAudioOrVideoElement.entity.type = 1;
                            learnItem.explainAudioOrVideoElement.entity[
                              "media"
                            ] = null;
                            learnItem.explainAudioOrVideoElement.entity[
                              "submitMediaButton"
                            ] = true;
                            learnItem.learnVideoElement.entity.type = 1;
                            learnItem.learnVideoElement.entity["media"] = null;
                            learnItem.learnVideoElement.entity[
                              "submitMediaButton"
                            ] = true;
                            if (
                              learnItem.explainAudioOrVideoElement.parsed &&
                              learnItem.explainAudioOrVideoElement.parsed
                                .materialId
                            ) {
                              learnItem.explainAudioOrVideoElement.entity[
                                "edit"
                              ] = true;
                            } else {
                              learnItem.explainAudioOrVideoElement.entity[
                                "edit"
                              ] = false;
                            }
                            if (
                              learnItem.learnVideoElement.parsed &&
                              learnItem.learnVideoElement.parsed.materialId
                            ) {
                              learnItem.learnVideoElement.entity["edit"] = true;
                            } else {
                              learnItem.learnVideoElement.entity["edit"] = false;
                            }
                          }
                        }
                      }
                    }
                    if (item.briefBlockContent.learnWordDetail) {
                      let parentObj = item.briefBlockContent.learnWordDetail;
                      if (
                        parentObj.learnWords ||
                        parentObj.learnPhrases ||
                        parentObj.learnSentencePatterns ||
                        parentObj.learnSentences
                      ) {
                        this.metadataList.wordList = parentObj.learnWords.length
                          ? this.metadataList.wordList.concat(
                              parentObj.learnWords
                            )
                          : this.metadataList.wordList;
                        this.metadataList.phraseList = parentObj.learnPhrases
                          .length
                          ? this.metadataList.phraseList.concat(
                              parentObj.learnPhrases
                            )
                          : this.metadataList.phraseList;
                        this.metadataList.sentencePatternList = parentObj
                          .learnSentencePatterns.length
                          ? this.metadataList.sentencePatternList.concat(
                              parentObj.learnSentencePatterns
                            )
                          : this.metadataList.sentencePatternList;
                        this.metadataList.sentenceList = parentObj.learnSentences
                          .length
                          ? this.metadataList.sentenceList.concat(
                              parentObj.learnSentences
                            )
                          : this.metadataList.sentenceList;
                        this.wordArr = item.conf.learnWord.learnIds;
                      }
                    }

                    if (item.briefBlockContent.learnSentenceDetail) {
                      let parentObj = item.briefBlockContent.learnSentenceDetail;
                      if (
                        parentObj.learnWords ||
                        parentObj.learnPhrases ||
                        parentObj.learnSentencePatterns ||
                        parentObj.learnSentences
                      ) {
                        this.metadataList.wordList = parentObj.learnWords.length
                          ? this.metadataList.wordList.concat(
                              parentObj.learnWords
                            )
                          : this.metadataList.wordList;
                        this.metadataList.phraseList = parentObj.learnPhrases
                          .length
                          ? this.metadataList.phraseList.concat(
                              parentObj.learnPhrases
                            )
                          : this.metadataList.phraseList;
                        this.metadataList.sentencePatternList = parentObj
                          .learnSentencePatterns.length
                          ? this.metadataList.sentencePatternList.concat(
                              parentObj.learnSentencePatterns
                            )
                          : this.metadataList.sentencePatternList;
                        this.metadataList.sentenceList = parentObj.learnSentences
                          .length
                          ? this.metadataList.sentenceList.concat(
                              parentObj.learnSentences
                            )
                          : this.metadataList.sentenceList;
                        this.sentenceArr = item.conf.learnSentence.learnIds;
                      }
                    }

                    return item;
                  });
                }
                if (res.data.data.expressionsMeta) {
                  this.expressionsMeta.wordsParsed = res.data.data.expressionsMeta
                    .wordsParsed
                    ? res.data.data.expressionsMeta.wordsParsed
                    : [];
                  this.expressionsMeta.phrasesParsed = res.data.data
                    .expressionsMeta.phrasesParsed
                    ? res.data.data.expressionsMeta.phrasesParsed
                    : [];
                  this.expressionsMeta.sentencePatternsParsed = res.data.data
                    .expressionsMeta.sentencePatternsParsed
                    ? res.data.data.expressionsMeta.sentencePatternsParsed
                    : [];
                  this.expressionsMeta.sentencesParsed = res.data.data
                    .expressionsMeta.sentencesParsed
                    ? res.data.data.expressionsMeta.sentencesParsed
                    : [];
                }
                // 音乐课相关数据初始化
                if (res.data.data.musicLesson) {
                    this.songHz = res.data.data.musicLesson.speedFactor || 0.66;
                  if (res.data.data.musicLesson.songVideo) {
                    this.musicSongObj.name =
                      res.data.data.musicLesson.songVideo.name;
                    this.musicSongObj.materialId =
                      res.data.data.musicLesson.songVideo.id;
                  }
                  if (res.data.data.musicLesson.explainVideo) {
                    this.musicExplainSongObj.name =
                      res.data.data.musicLesson.explainVideo.name;
                    this.musicExplainSongObj.materialId =
                      res.data.data.musicLesson.explainVideo.id;
                  }
                  if (
                    res.data.data.musicLesson.expressions &&
                    res.data.data.musicLesson.expressions.length > 0
                  ) {
                    this.MusicWordArr = Object.assign(
                      [],
                      res.data.data.musicLesson.expressions
                    );
                  }
                  if (
                    res.data.data.musicLesson.scenes &&
                    res.data.data.musicLesson.scenes.length > 0
                  ) {
                    this.musicScenes = Object.assign(
                      [],
                      res.data.data.musicLesson.scenes
                    );
                    if (this.musicScenes && this.musicScenes.length) {
                      this.musicScenes.map((item, index) => {
                        if (item.audio) {
                          item.audio_id = item.audio.id;
                          item.audio_name = item.audio.name;
                        }
                        if (item.bgImage) {
                          this.$set(item, "image_id", item.bgImage.id);
                          this.$set(item, "image_url", item.bgImage.url);
                        }
                      });
                      // 配置歌词
                      this.sceneSongLyric();
                    }
                  }
                  if (res.data.data.musicLesson.explainPage) {
                    this.explainPageBlockId =
                      res.data.data.musicLesson.explainPage.block.id;
                    this.explainPage = Object.assign(
                      [],
                      res.data.data.musicLesson.explainPage.elements
                    );
                  }
                  if (res.data.data.musicLesson.homePage) {
                    this.musicHomePageBlockId =
                      res.data.data.musicLesson.homePage.block.id;
                    this.musicHomePage = Object.assign(
                      [],
                      res.data.data.musicLesson.homePage.elements
                    );
                  }
                  if (res.data.data.musicLesson.homePageImage) {
                    this.homePageConf.imageId =
                      res.data.data.musicLesson.homePageImage.id;
                    this.homePageConf.imageUrl =
                      res.data.data.musicLesson.homePageImage.url;
                  }
                  if (res.data.data.musicLesson.homePageAudio) {
                    this.homePageConf.audioId =
                      res.data.data.musicLesson.homePageAudio.id;
                    this.homePageConf.audioName =
                      res.data.data.musicLesson.homePageAudio.name;
                  }
                }
              }
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error",
                offset: 45
              });
            }
            this.loading = false;
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 板块编辑界面 确定之后的函数
      addFormConfirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 判断是编辑 还是 新创建。调用不同的方法
            this.loading = true;
            this.dialogFlag
              ? this.addBlockFunc(this[formName])
              : this.editBlockFunc(this[formName]);
          } else {
            this.$message.error("请核对内容是否填写正确");
            return false;
          }
        });
      },
      addFormConfirm1(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 判断是编辑 还是 新创建。调用不同的方法
            this.loading = true;
            this.dialogFlag1
              ? this.addBlockFunc1(this[formName])
              : this.editBlockFunc1(this[formName]);
          } else {
            this.$message.error("请核对内容是否填写正确");
            return false;
          }
        });
      },
      // 查询 被删除的block列表
      inquireRecycle() {
        getDelblocks({
          lesson_id: this.$route.params.lessonId
        })
          .then(res => {
            if (res.data.success) {
              this.delBlocks = res.data.data;
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error",
                offset: 45
              });
            }
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 重新添回block
      recallBlock(block) {
        let params = {
          lesson_id: this.$route.params.lessonId,
          block_id: block.entity.id
        };
        addBlockByBlockId(params)
          .then(res => {
            if (res.data.success) {
              this.getLessonEssInfo();
              this.inquireRecycle();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 调用 新增板块的接口
      addBlockFunc(obj) {
        let parameter = {
          lesson_id: this.$route.params.lessonId,
          block_name: obj.name,
          block_display: obj.display,
          type: obj.type,
          description: obj.description
        };
        addBlockToLesson(parameter)
          .then(res => {
            this.addFormVisible = false;
            if (res.data.success) {
              this.activeNames = [];
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                offset: 45,
                duration: 1500
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 调用 新增亲子板块的接口
      addBlockFunc1(obj) {
        if (this.flagparent.conf) {
          this.$notify({
            title: "失败",
            message: "亲子板块已经存在不可重复添加",
            type: "error",
            offset: 45
          });
          this.addFormVisible1 = false;
          this.getLessonEssInfo();
        } else {
          let parameter = {
            lesson_id: this.$route.params.lessonId,
            block_name: obj.name,
            block_display: obj.display,
            type: obj.type,
            description: obj.description
          };
          addWxxPcBlock(parameter)
            .then(res => {
              this.addFormVisible1 = false;
              if (res.data.success) {
                this.activeNames1 = [];
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                  offset: 45,
                  duration: 1500
                });
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.msg || "未知错误，请联系管理员",
                  type: "error",
                  offset: 45
                });
              }
              this.getLessonEssInfo();
            })
            .catch(error => {
              this._catch(error);
            });
        }
      },
      // 调用 编辑板块的接口
      editBlockFunc(obj) {
        let parameter = {
          lesson_id: this.$route.params.lessonId,
          block_id: obj.id,
          block_name: obj.name,
          block_display: obj.display,
          type: obj.type,
          description: obj.description
        };
        editBlockInfo(parameter)
          .then(res => {
            this.addFormVisible = false;
            if (res.data.success) {
              this.loading = false;
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                offset: 45,
                duration: 1500
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 调用 编辑亲子板块的接口
      editBlockFunc1(obj) {
        // this.$notify({
        //   title: "失败",
        //   message: '不可以编辑亲子板块',
        //   type: "error",
        //   offset: 45
        // });
        let parameter = {
          lesson_id: this.$route.params.lessonId,
          block_id: obj.id,
          block_name: obj.name,
          block_display: obj.display,
          type: obj.type,
          description: obj.description
        };

        editBlockInfo(parameter)
          .then(res => {
            this.addFormVisible1 = false;
            if (res.data.success) {
              this.loading = false;
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                offset: 45,
                duration: 1500
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 调用 板块更新之后 保存到 课节 的接口
      updateToLesson() {
        let parameter = {
          lesson_id: this.$route.params.lessonId,
          block_ids: []
        };
        this.allComponents.forEach(function(item) {
          parameter.block_ids += item.id + ",";
        });
        updateBlockInLesson(parameter)
          .then(res => {
            if (res.data.success) {
              this.$message({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 1500
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 添加 元素
      addElement(index, AddNewElementType, block_id) {
        this.editElementContentFlag = true; // 判断为 新增 element
        // 清空模板
        this.selectTemp = "";
        // 清空表单数据
        this.newElementForm = {
          url: "",
          block_id: "",
          name: "",
          type: "",
          style_type: "",
          material_id: "",
          title: "",
          sub_title: "",
          content: "",
          sequence: [
            {
              text: ""
            },
            {
              text: ""
            },
            {
              text: ""
            }
          ],
          reviewType: "0",
          description: "",
          skipLessonId: "",
          skipName: "",
          AvIdForPre: "",
          AvIdForPre1: "",
          replayNum: 0
        };
        this.blockIndex = index;
        if (block_id) {
          this.newElementForm.block_id = block_id;
        } else {
          this.newElementForm.block_id = this.allComponents[index].id;
        }
        this.checkedTeachersInElement = ""; // 清空 element 选择的老师
        this.elementTypeChange(AddNewElementType);
      },
      // 添加亲子板块 元素
      addElement1(index, AddNewElementType, block_id) {
        this.editElementContentFlag = true; // 判断为 新增 element
        // 清空模板
        this.selectTemp = "";
        // 清空表单数据
        this.newElementForm = {
          url: "",
          block_id: "",
          name: "",
          type: "",
          style_type: "",
          material_id: "",
          title: "",
          sub_title: "",
          content: "",
          sequence: [
            {
              text: ""
            },
            {
              text: ""
            },
            {
              text: ""
            }
          ],
          reviewType: "0",
          description: "",
          skipLessonId: "",
          skipName: "",
          AvIdForPre: "",
          AvIdForPre1: "",
          replayNum: 0
        };
        this.blockIndex = index;
        if (block_id) {
          this.newElementForm.block_id = block_id;
        } else {
          this.newElementForm.block_id = this.allComponents1[index].id;
        }
        this.checkedTeachersInElement = ""; // 清空 element 选择的老师
        this.elementTypeChange(AddNewElementType);
      },
      editElement(obj) {
        this.editElementContentFlag = false; // 判断为 编辑 element
        this.submitButtonFalg.local = false;
        this.submitButtonFalg.material = false;
        this.newElementForm = obj.entity;
        this.checkedTeachersInElement = obj.parsed.teacherId
          ? obj.parsed.teacherId
          : "";
        switch (obj.entity.type) {
          case 3:
            this.newElementForm["url"] = obj.parsed.url;
            this.newElementForm["description"] = obj.parsed.description;
            break;
          case 4:
            this.newElementForm["sub_title"] = obj.parsed.subTitle;
            this.newElementForm["title"] = obj.parsed.title;
            if (obj.parsed.styleType == 0 || obj.parsed.styleType == 1) {
              this.newElementForm["content"] = obj.parsed.content[0];
            } else {
              this.$set(this.newElementForm, "sequence", []);
              obj.parsed.content.forEach((item, index) => {
                this.newElementForm["sequence"].push({
                  text: item
                });
              });
            }
            break;
          case 5:
            this.newElementForm["skipName"] = obj.parsed.name;
            this.newElementForm["skipLessonId"] = obj.parsed.lessonId + "";
            break;
          default:
            this.newElementForm["parsed"] = obj.parsed;
            this.newElementForm["url"] = obj.parsed.url;
            this.newElementForm.reviewType += "";
            this.newElementForm.replayNum = obj.parsed.replayNum + 1;
            obj.parsed.styleType = "1";
            this.newElementForm[
              "material_id"
            ] = this.newElementForm.parsed.materialId;
            break;
        }
        let typeArray = [];
        typeArray.push(obj.entity.type);
        if (obj.entity.type == 3) {
          typeArray.push(0);
        } else {
          typeArray.push(obj.parsed.styleType);
        }
        this.elementTypeChange(typeArray);
      },
      // 添加元素到复习课block中
      addEleToBlockForReview(item) {
        this.addReviewFormVisible = true;
        this.addReviewEle = {
          name: "",
          block_id: "",
          type: "",
          material_id: "",
          replay_num: 0,
          bg_material_id: "",
          question_id: "",
          expression_id: ""
        };
        this.wordOrSentenceType = "";
        this.reviewBlockId = item.block.id;
        // addReviewElement
      },
      submitReviewBlocksAdd() {
        this.$refs.addReviewEle.validate(valid => {
          if (valid) {
            let para = {
              block_id: this.reviewBlockId,
              type: this.elementType,
              name: this.addReviewEle.name,
              material_id: this.addReviewEle.material_id,
              bg_material_id: this.addReviewEle.bg_material_id,
              replay_num: this.addReviewEle.replay_num,
              question_id: this.addReviewEle.question_id,
              expression_id: this.addReviewEle.expression_id,
              expression_type: this.wordOrSentenceType
            };
            addReviewElement(para)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    message: "新增成功",
                    type: "success"
                  });
                  this.getLessonEssInfo();
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
                this.addReviewFormVisible = false;
              })
              .catch(err => {
                this._catch(err);
              });
          } else {
            this.$notify({
              title: "失败",
              message: "请填入必填项",
              type: "error"
            });
          }
        });
      },
      // 题库的列表查询
      searchQuestionFunc(query) {
        let temp = Number(query);
        let parameter = {};
        if (temp) {
          parameter = {
            id: temp
          };
        } else {
          parameter = {
            title: query
          };
        }
        getQuestionList(parameter).then(res => {
          if (res.data.success) {
            if (res.data.data.items && res.data.data.items.length) {
              this.questionOptions = res.data.data.items.map(item => {
                let tempObj = {
                  id: item.entity.id,
                  name: item.entity.title
                };
                return tempObj;
              });
            }
          }
        });
      },
      onDeleteElement(obj) {
        this.$confirm("确认删除吗?", "提示", {})
          .then(() => {
            let params = {
              block_id: obj.entity.blockId,
              element_id: obj.entity.id
            };
            deleteElement(params)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    message: "删除成功",
                    type: "success",
                    duration: 1500
                  });
                } else {
                  this.$notify.error(res.data.msg || "未知错误，请联系管理员");
                }
                this.getLessonEssInfo();
              })
              .catch(error => {
                this._catch(error);
              });
          })
          .catch(() => {
            this.$message({
              message: "取消删除",
              type: "info"
            });
          });
      },
      onChangeType(obj) {
        this.newElementForm = {
          id: "",
          blockId: "",
          name: "",
          type: "",
          title: "",
          sub_title: "",
          url: "",
          style_type: "",
          description: "",
          content: "",
          reviewType: "0",
          material_id: "",
          skipLessonId: "",
          skipName: "",
          sequence: [
            {
              text: ""
            },
            {
              text: ""
            },
            {
              text: ""
            }
          ]
        };
        this.newElementForm["id"] = obj.entity.id;
        this.newElementForm["blockId"] = obj.entity.blockId;
        this.newElementForm["name"] = obj.entity.name;
        this.changeTypeOfElementFlag = true;
      },
      submitElementChange() {
        this.changeTypeOfElementFlag = false;
        this.editElementContentFlag = false; // 判断为 编辑 element
        this.elementTypeChange(this.AddNewElementType);
      },
      // 播放音视频
      playAV(obj) {
        switch (obj.entity.type) {
          case 1:
            this.$router.push({
              path: "/videoMaterial",
              query: {
                id: obj.parsed.materialId
              }
            });
            break;
          case 2:
            this.$router.push({
              path: "/audioMaterial",
              query: {
                id: obj.parsed.materialId
              }
            });
            break;
        }
      },
      // element 类型选择之后显示各个模块的Flag
      elementTypeChange(value) {
        this.newElementFileLocalFlag =
          (value[0] == 0 && value[1] == 0) ||
          (value[0] == 1 && value[1] == 0) ||
          (value[0] == 2 && value[1] == 0);
        this.newElementFileMaterialFlag =
          (value[0] == 0 && value[1] == 1) ||
          (value[0] == 1 && value[1] == 1) ||
          (value[0] == 2 && value[1] == 1);
        this.newElementTitleFlag =
          value[0] == 4 && (value[1] == 3 || value[1] == 4);
        this.newElementSubheadFlag = value[0] == 4 && value[1] == 4;
        this.newElementContentFlag =
          value[0] == 4 && (value[1] == 0 || value[1] == 1);
        this.newElementUrlFlag = value[0] == 3 && value[1] == 0;
        this.newElementTempUrlFlag = value[0] == 3 && value[1] == 1;
        this.newElementSequenceFlag =
          value[0] == 4 &&
          (value[1] == 2 || value[1] == 3 || value[1] == 4 || value[1] == 5);
        this.newElementPicLocalFlag = value[0] == 0 && value[1] == 0;
        this.newElementAvLocalFlag =
          (value[0] == 1 && value[1] == 0) || (value[0] == 2 && value[1] == 0);
        this.newElementPicMaterialFlag = value[0] == 0 && value[1] == 1;
        this.newElementVideoMaterialFlag = value[0] == 1 && value[1] == 1;
        this.newElementAudioMaterialFlag = value[0] == 2 && value[1] == 1;
        this.newElementLessonSkipFlag = value[0] == 5;
        // 给form表单类型 赋值
        this.newElementForm.type = value[0];
        if (value[0] == 4) {
          this.newElementForm.style_type = value[1];
        }
        // 类型 选择为 [1, 0] ,则上传类型为视频 。传值 1
        if (value[0] == 1) {
          if (value[1] == 0) {
            this.avType = "1";
          }
        }
        // 类型 选择为 [2, 0] ,则上传类型为音频 。传值 2
        if (value[0] == 2 && value[1] == 0) {
          this.avType = "2";
        }
        if (!this.newElementFileLocalFlag && !this.newElementFileMaterialFlag) {
          this.dialogAddNewElement = true;
        }
        if (this.avType == "2" || this.newElementAudioMaterialFlag) {
          let parameter = {
            course_id: this.lessonEssInfo.courseId
          };
          // 调用 加载列表的接口
          getTeacherListInCourse(parameter)
            .then(res => {
              this.Teachers = [];
              res.data.data.forEach(item => {
                this.Teachers.push(item.entity);
              });
            })
            .catch(error => {
              this._catch(error);
            });
        }
      },
      submitElementInfo(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 判断是编辑 还是 新创建。调用不同的方法
            this.editElementContentFlag
              ? this.submitNewElement()
              : this.submitEditElement();
            if (this.newElementAvLocalFlag) {
              this.$refs.AVUploadForEle.$refs["avForm"].resetFields();
              this.$refs.AVUploadForEle.$refs["upload"].uploadFiles.length = 0;
              this.$refs.AVUploadForEle.avForm.dynamicTags = [];
            } else if (this.newElementPicLocalFlag) {
              this.$refs.PicUploadForEle.$refs["picForm"].resetFields();
              this.$refs.PicUploadForEle.$refs["upload"].uploadFiles.length = 0;
              this.$refs.PicUploadForEle.picForm.dynamicTags = [];
            }
          } else {
            this.$message.error("请核对内容是否填写正确");
            return false;
          }
          this.submitButtonFalg = {
            local: true,
            material: true
          };
        });
      },
      // 提交 新建节点
      submitNewElement() {
        // 隐藏弹窗。
        this.dialogAddNewElement = false;
        this.newElementFileLocalFlag = false;
        this.newElementFileMaterialFlag = false;
        // 禁用创建按钮
        this.submitButtonFalg.local = true;
        this.submitButtonFalg.material = true;
        let parameter = {
          lesson_id: this.$route.params.lessonId,
          block_id: this.newElementForm.block_id,
          name: this.newElementForm.name,
          type: this.newElementForm.type,
          title: this.newElementForm.title,
          sub_title: this.newElementForm.sub_title,
          url: this.newElementForm.url,
          style_type: this.newElementForm.style_type,
          description: this.newElementForm.description,
          content: this.newElementForm.content,
          review_type: this.newElementForm.reviewType,
          material_id: this.newElementForm.material_id,
          skip_lesson_id: this.newElementForm.skipLessonId,
          skip_course_id: this.lessonEssInfo.courseId,
          skip_name: this.newElementForm.skipName,
          teacher_id: this.checkedTeachersInElement,
          replay_num:
            this.newElementForm.replayNum == 0
              ? this.newElementForm.replayNum
              : this.newElementForm.replayNum - 1
        };
        // 判断 如果为 有序文字 则 对 数组进行编译
        if (this.newElementSequenceFlag) {
          let data = {};
          this.newElementForm.sequence.forEach((item, count) => {
            for (var temp in item) {
              data[count] = item[temp];
            }
          });
          // 将 序列文字转化为键值对的json字符串
          parameter["content"] = JSON.stringify(data);
        }
        addNewElement(parameter)
          .then(res => {
            if (res.data.success) {
              if (this.briefness == 1) {
                let blocks = [this.allComponents[this.blockIndex].id];
                this.allComponents[this.blockIndex].blockInfo.InfoMessage.push(
                  res.data.data
                );
              }
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 1500,
                offset: 45
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      submitEditElement() {
        this.dialogAddNewElement = false;
        this.newElementFileLocalFlag = false;
        this.newElementFileMaterialFlag = false;
        let parameter = {
          id: this.newElementForm.id,
          lesson_id: this.$route.params.lessonId,
          block_id: this.newElementForm.blockId,
          name: this.newElementForm.name,
          type: this.newElementForm.type,
          title: this.newElementForm.title,
          sub_title: this.newElementForm.sub_title,
          url: this.newElementForm.url,
          style_type: this.newElementForm.style_type,
          description: this.newElementForm.description,
          content: this.newElementForm.content,
          review_type: this.newElementForm.reviewType,
          material_id: this.newElementForm.material_id,
          skip_lesson_id: this.newElementForm.skipLessonId,
          skip_course_id: this.lessonEssInfo.courseId,
          skip_name: this.newElementForm.skipName,
          teacher_id: this.checkedTeachersInElement,
          replay_num:
            this.newElementForm.replayNum == 0
              ? this.newElementForm.replayNum
              : this.newElementForm.replayNum - 1
        };
        // 判断 如果为 有序文字 则 对 数组进行编译
        if (this.newElementSequenceFlag) {
          let data = {};
          this.newElementForm.sequence.forEach((item, count) => {
            for (var temp in item) {
              data[count] = item[temp];
            }
          });
          // 将 序列文字转化为键值对的json字符串
          parameter["content"] = JSON.stringify(data);
        }
        updateElement(parameter)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                offset: 45,
                duration: 1500
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      // 上传图片之前之后弹窗的大小
      newElementFileLocaldialogShowFull(flag) {
        this.dialogShowFull = flag;
      },
      // 上传成功之后 组件传 素材id 并改变 flag。
      ChangeButtonFlag(tempObj) {
        if (tempObj) {
          this.submitButtonFalg.local = false;
          this.newElementForm.material_id = tempObj;
        }
      },
      ChenckedButtonFlag(tempObj, BooleFlag) {
        this.submitButtonFalg.material = !BooleFlag;
        this.newElementForm.material_id = tempObj;
      },
      emitCheckedMaterial(tempObj) {
        this.newElementForm.material_id = tempObj;
        this.submitElementInfo("newElementForm");
      },
      emitCheckedMaterialForSuite(tempObj) {
        this.AvIdForPre = tempObj;
        this.submitAvFormLocal();
      },
      emitCheckedMaterialForSuite1(tempObj) {
        this.AvIdForPre1 = tempObj;
        this.submitAvFormLocal1();
      },
      // 新增序列
      addSequence() {
        let sequence = {
          text: ""
        };
        this.$set(
          this.newElementForm.sequence,
          this.newElementForm.sequence.length,
          sequence
        );
      },
      // 删除序列
      deleteSequence(index, item) {
        this.newElementForm.sequence.splice(index, 1);
      },
      // 跳转课节 查询课节
      selectLessonRemoteMethod(query) {
        if (query !== "") {
          this.selectLessonLoading = true;
          let temp = Number(query);
          let parameter = {};
          temp ? (parameter["id"] = temp) : (parameter["name"] = query);
          // 调用 加载列表的接口
          getLessonList(parameter)
            .then(res => {
              if (res.data.success) {
                this.LessonOptions = res.data.data.items.map(item => {
                  let tempObj = {
                    id: item.entity.id,
                    name: item.entity.name
                  };
                  return tempObj;
                });
              } else {
                this.$message.error(res.data.msg || "未知错误，请联系管理员");
              }
              this.selectLessonLoading = false;
            })
            .catch(error => {
              this._catch(error);
            });
        } else {
          this.LessonOptions = [];
        }
      },
      //关联examSuite
      addExamSuite() {
        this.examSuiteFromVisible = true;
      },
      //从本地上传视频到素材库
      addPreviewFrom(type) {
        if (type == "2") {
          this.uploadForPreviewFormLocal = true;
        } else {
          this.uploadForPreviewFormSuite = true;
        }
      },
      //从本地上传音频到素材库
      addPreviewFrom1(type) {
        if (type == "2") {
          this.uploadForPreviewFormLocal1 = true;
        } else {
          this.uploadForPreviewFormSuite1 = true;
        }
      },
      delPreviewFrom() {
        this.AvIdForPre = "";
        this.submitAvFormLocal();
      },
      delPreviewFrom1() {
        this.AvIdForPre1 = "";
        this.submitAvFormLocal1();
      },
      ChangeButtonForPreFlag(tempObj) {
        this.isGetAvId = false;
        this.AvIdForPre = tempObj;
      },
      ChangeButtonForPreFlag1(tempObj) {
        this.isGetAvId1 = false;
        this.AvIdForPre1 = tempObj;
      },
      changeBtnFroPreFla(tempObj) {
        this.uploadAvFormSuite = false;
        this.AvIdForPre = tempObj;
      },
      changeBtnFroPreFla1(tempObj) {
        this.uploadAvFormSuite1 = false;
        this.AvIdForPre1 = tempObj;
      },
      submitAvFormLocal() {
        let para = {
          id: this.lessonDetailInfo.entity.id,
          name: this.lessonDetailInfo.entity.name,
          internal_name: this.lessonDetailInfo.entity.internalName,
          status: this.lessonDetailInfo.entity.stat,
          type: this.lessonDetailInfo.entity.type,
          display: this.lessonDetailInfo.entity.display,
          description: this.lessonDetailInfo.entity.description,
          exam_suite_id: this.lessonDetailInfo.parsed.examSuiteId,
          material_id: this.AvIdForPre
        };
        if (
          this.lessonDetailInfo.parsed.blockIds &&
          this.lessonDetailInfo.parsed.blockIds.length
        ) {
          para["block_ids"] = this.lessonDetailInfo.parsed.blockIds.join(",");
        }
        if (
          this.lessonDetailInfo.parsed.teachers &&
          this.lessonDetailInfo.parsed.teachers.length
        ) {
          let teachers_arr = [];
          this.lessonDetailInfo.parsed.teachers.map(item => {
            teachers_arr.push(item.id);
          });
          para["teacher_ids"] = teachers_arr.join(",");
        }
        editLessonInfo(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "配置成功",
                message: "配置预习视频成功",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg || "未知错误，请联系管理员");
            }
            this.uploadForPreviewFormSuite = false;
            this.uploadForPreviewFormLocal = false;
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      submitAvFormLocal1() {
        //  console.log(this.AvIdForPre1)
        let para = {
          lesson_id: this.lessonDetailInfo.entity.id,
          material_ids: this.AvIdForPre1.toString()
        };
        // if (
        //   this.lessonDetailInfo1[0].id &&
        //   this.lessonDetailInfo1.length==1
        // ) {
        //   para["material_ids"] = this.lessonDetailInfo1[0].id.toString();
        // }
        updateWxxEar(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "配置成功",
                message: "配置磨耳朵音频成功",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg || "未知错误，请联系管理员");
            }
            this.uploadForPreviewFormSuite1 = false;
            this.uploadForPreviewFormLocal1 = false;
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      //获取试卷套餐集列表接口调用
      searchCourseFunc(query) {
        let temp = Number(query);
        let parameter = {};
        if (temp) {
          parameter = {
            id: temp
          };
        } else {
          parameter = {
            name: query
          };
        }
        getExamSuiteList(parameter)
          .then(res => {
            if (res.data.success) {
              if (res.data.data.items && res.data.data.items.length) {
                this.examSuiteList = res.data.data.items.map(item => {
                  let tempObj = {
                    id: item.entity.id,
                    name: item.entity.name
                  };
                  return tempObj;
                });
              }
            } else {
              this.$message.error(res.data.msg || "未知错误，请联系管理员");
            }
          })
          .catch(error => {
            this._catch(error);
          });
      },
      updateLessonDetail() {
        let para = {
          id: this.lessonDetailInfo.entity.id,
          internal_name: this.lessonDetailInfo.entity.internalName,
          description: this.lessonDetailInfo.entity.description,
          name: this.lessonDetailInfo.entity.name,
          type: this.lessonDetailInfo.entity.type,
          status: this.lessonDetailInfo.entity.stat,
          display: this.lessonDetailInfo.entity.display,
          material_id: this.lessonDetailInfo.parsed.materialId
        };
        if (
          this.lessonDetailInfo.parsed.blockIds &&
          this.lessonDetailInfo.parsed.blockIds.length
        ) {
          para["block_ids"] = this.lessonDetailInfo.parsed.blockIds.join(",");
        }
        if (
          this.lessonDetailInfo.parsed.teachers &&
          this.lessonDetailInfo.parsed.teachers.length
        ) {
          let teachers_arr = [];
          this.lessonDetailInfo.parsed.teachers.map(item => {
            teachers_arr.push(item.id);
          });
          para["teacher_ids"] = teachers_arr.join(",");
        }
        para["exam_suite_id"] = this.examSuiteId;
        editLessonInfo(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "配置成功",
                message: "配置试卷集成功",
                type: "success"
              });
            } else {
              this.$message.error(res.data.msg || "未知错误，请联系管理员");
            }
            this.examSuiteFromVisible = false;
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      addWordOrSentence(arr, type) {
        arr.push({
          id: "",
          type: type
        });
      },
      /**
       *  type 用来区分音乐课和简版课
       *  type 默认 简版课    1为音乐课
       */
      delExpressionsMeta(meta, index, arr, briefBlock, type) {
        arr.splice(index, 1);
        if (type == 1) {
            let params = {
					lesson_id: this.$route.params.lessonId,
					vocabularies: ''
				}
				params.vocabularies = JSON.stringify(arr)
				updateMusicVocabularies(params)
					.then((res) => {
						if (res.data.success) {
							this.$message({
								message: '修改成功',
								type: 'success'
							})
						} else {
							this.$notify({
								title: res.data.code,
								message: res.data.msg,
								type: 'error'
							})
						}
					})
					.catch((error) => {
						this._catch(error)
					})
        } else {
          this.handleChooseMeta(meta, index, arr, briefBlock);
        }
      },
      handleChooseMeta(value, index, arr, briefBlock) {
        if (value) {
          let params = {
            block_id: briefBlock.block.id,
            expression_json_string: ""
          };
          let n = [];
          let flag = true;
          if (arr.length) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].id) {
                for (var j = 0; j < n.length; j++) {
                  if (arr[i].type === n[j].type) {
                    if (arr[i].id === n[j].id) {
                      this.$notify({
                        title: "警告",
                        type: "warning",
                        message: "当前单词已添加，请重新选择"
                      });
                      arr[index].id = "";
                      flag = false;
                    }
                  }
                }
                n.push(arr[i]);
              }
            }
            if (flag) {
              params.expression_json_string = JSON.stringify(n);
              changeBriefBlockVoca(params)
                .then(res => {
                  if (res.data.success) {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                  } else {
                    this.$notify({
                      title: res.data.code,
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                })
                .catch(error => {
                  this._catch(error);
                });
            }
          }
        }
      },
      dragEnd(value) {
        this.updateToLesson();
      },

      // 简版与普通课程的切换
      changeBriefOrNormal(value) {
        if (value) {
          if (this.lessonType !== 2) {
            if (
              this.lessonDetailInfo.parsed.briefBlocks &&
              this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds &&
              this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds.length
            ) {
            } else {
              if (this.briefness == 2) {
                this.$confirm("此操作将初始化当前简版课程, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    initBriefBlocksElements({
                      lesson_id: this.$route.params.lessonId
                    })
                      .then(res => {
                        if (res.data.success) {
                          this.getLessonEssInfo();
                        } else {
                          this.$notify({
                            title: res.data.code,
                            message: res.data.msg,
                            type: "error"
                          });
                        }
                      })
                      .catch(error => {
                        this._catch(error);
                      });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消初始化"
                    });
                    this.briefness = "1";
                  });
              }
            }
            if (!this.musicLessonInit) {
              if (this.briefness == 3) {
                this.$confirm("此操作将初始化当前音乐课, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(res => {
                    let params = {
                      lesson_id: this.$route.params.lessonId
                    };
                    initMusicBlock(params)
                      .then(res => {
                        if (res.data.success) {
                          this.getLessonEssInfo();
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
                      });
                  })
                  .catch(err => {
                    this.$message({
                      type: "info",
                      message: "已取消初始化"
                    });
                    this.briefness = "1";
                  });
              }
            }
          } else if (this.lessonType == 2) {
            if (
              this.lessonDetailInfo.parsed.briefBlocks &&
              this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds &&
              this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds.length
            ) {
            } else {
              if (this.briefness == 2) {
                this.$confirm("此操作将初始化当前复习课, 是否继续?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(res => {
                    let params = {
                      lesson_id: this.$route.params.lessonId
                    };
                    initReviewBlock(params)
                      .then(res => {
                        if (res.data.success) {
                          this.getLessonEssInfo();
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
                      });
                  })
                  .catch(err => {
                    this.$message({
                      type: "info",
                      message: "已取消初始化"
                    });
                    this.briefness = "1";
                  });
              }
            }
          }
          if (this.briefness == 4) {
            if (
              this.lessonDetailInfo1 &&
              this.lessonDetailInfo1.pcAction &&
              this.lessonDetailInfo1.pcAction.block
            ) {
            } else {
              this.$confirm("此操作将初始化小程序精品课程, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(res => {
                  let params = {
                    lesson_id: this.$route.params.lessonId,
                    block_name: "亲子板块",
                    block_display: 1,
                    type: 12,
                    description: "亲子板块描述"
                  };
                  addWxxPcBlock(params)
                    .then(res => {
                      if (res.data.success) {
                        this.getLessonEssInfo();
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
                    });
                })
                .catch(err => {
                  this.$message({
                    type: "info",
                    message: "已取消初始化"
                  });
                  this.briefness = "1";
                });
            }
          }
        }
      },

      // 添加单词相关
      handleClose(tag, index, arr, type) {
        let params = {
          id: this.$route.params.lessonId,
          ids: ""
        };
        if (arr && arr.length) {
          for (var i = 0; i < arr.length; i++) {
            if (tag.entity.id === arr[i].entity.id) {
              continue;
            }
            params.ids += arr[i].entity.id + ",";
          }
        }
        this.submitMetadataFunc(params, type, index, arr, "close");
      },

      showInput(type) {
        for (var key in this.inputVisible) {
          if (this.inputVisible.hasOwnProperty(key)) {
            this.inputVisible[key] = false;
          }
        }

        this.inputVisible[type] = true;
        this.$nextTick(_ => {
          let inputName = type + "Input";
          this.$refs[inputName].$refs.reference.$refs.input.focus();
        });
      },

      handleInputBlur(visible, type) {
        if (Number(type) === type) {
          switch (type) {
            case 1:
              type = "word";
              break;
            case 2:
              type = "phrase";
              break;
            case 3:
              type = "sentence";
              break;
            case 4:
              type = "sentencePattern";
              break;
            default:
          }
        }
        this.searchMetadataFunc("", type);
      },

      handleInputConfirm(value, type) {
        let arr = this.expressionsMeta[type + "sParsed"];
        let params = {
          id: this.$route.params.lessonId,
          ids: ""
        };
        if (value) {
          if (arr && arr.length) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].entity.id === value.entity.id) {
                this.$message({
                  type: "warning",
                  message: "当前选项已添加，请重新选择"
                });
                this.metadataList[type + "List"] = [];
                this.inputVisible[type] = false;
                value = "";
                return;
              }
              params.ids += arr[i].entity.id + ",";
            }
          }
          params.ids += value.entity.id;
        }
        this.submitMetadataFunc(params, type, value, arr, "add");
      },

      searchWordFunc(query) {
        this.searchMetadataFunc(query, "word");
      },
      searchPhraseFunc(query) {
        this.searchMetadataFunc(query, "phrase");
      },
      searchSentencePatternFunc(query) {
        this.searchMetadataFunc(query, "sentencePattern");
      },
      searchSentenceFunc(query) {
        this.searchMetadataFunc(query, "sentence");
      },
      searchMetadataFunc(query, type) {
        let searchApi;
        switch (type) {
          case "word":
            searchApi = getWordList;
            break;
          case "phrase":
            searchApi = getPhraseList;
            break;
          case "sentencePattern":
            searchApi = getSentencePatternList;
            break;
          case "sentence":
            searchApi = getSentenceList;
            break;
          default:
        }

        let isChinese = /^[\u4e00-\u9fa5]*$/.test(query);
        let isEnglish = /^[A-Za-z\s]*$/.test(query);
        let parameter = {};
        if (query) {
          if (isChinese) {
            parameter = {
              chinese: query
            };
          } else if (isEnglish) {
            parameter = {
              english: query
            };
          } else {
            parameter = {
              id: query
            };
          }
        }
        this.metadataList[type + "List"] = [];
        searchApi(parameter).then(res => {
          if (res.data.success) {
            if (res.data.data.items && res.data.data.items.length) {
              this.$set(this.metadataList, type + "List", res.data.data.items);
            }
          } else {
            this.metadataList[type + "List"] = [];
          }
        });
      },
      submitMetadataFunc(parameter, type, value, arr, eve) {
        let submitMetadataApi;
        switch (type) {
          case "word":
            submitMetadataApi = updateWordIds;
            break;
          case "phrase":
            submitMetadataApi = updatePhraseIds;
            break;
          case "sentencePattern":
            submitMetadataApi = updateSentencePatternIds;
            break;
          case "sentence":
            submitMetadataApi = updateSentenceIds;
            break;
          default:
        }

        submitMetadataApi(parameter)
          .then(res => {
            if (res.data.success) {
              if (eve === "add") {
                arr.push(value);
                for (var variable in this.metadataList) {
                  if (this.metadataList.hasOwnProperty(variable)) {
                    this.metadataList[variable] = [];
                  }
                }
                value = "";
                this.inputVisible[type] = false;
              }
              if (eve === "close") {
                arr.splice(value, 1);
              }
            } else {
              this.$notify({
                type: "error",
                message: res.data.msg || "未知错误，请联系管理员"
              });
            }
          })
          .catch(error => {
            this._catch(error);
          });
      },
      briefBlocksUpdateShow() {
        this.briefBlocksUpdate = true;
        if (
          this.lessonDetailInfo.parsed.briefBlocks &&
          this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds &&
          this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds.length
        ) {
          this.briefBlocksForm.status = this.lessonDetailInfo.parsed.briefBlocks.status;
        }
      },
      // 更新简版课程相关信息
      submitBriefBlocksUpdate() {
        this.briefBlocksForm.block_ids = "";
        if (
          this.lessonDetailInfo.parsed.briefBlocks &&
          this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds &&
          this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds.length
        ) {
          this.lessonDetailInfo.parsed.briefBlocks.briefBlockIds.forEach(item => {
            this.briefBlocksForm.block_ids += item + ",";
          });
        }
        updateBriefBlocks(this.briefBlocksForm)
          .then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.briefBlocksUpdate = false;
              this.getLessonEssInfo();
            } else {
              this.$notify({
                type: "error",
                message: res.data.msg || "未知错误，请联系管理员"
              });
            }
          })
          .catch(error => {
            this._catch(error);
          });
      },
      assignVal(media, element) {
        element.entity.submitMediaButton = false;
        element.entity.media = media;
        this.submitElementMedia(element);
      },
      reviewAssignVal(val) {
        this.$set(this.addReviewEle, val.oVal, val.id);
      },
      editReviewAssignVal(val, item) {
        this.$set(item.parsed, val.oVal, val.id);
        this.updateReviewEle("", item);
      },
      previewElementMedia(element) {
        let id;
        if (element.entity.media) {
          id = element.entity.media.id;
        } else {
          if (element.parsed && element.parsed.materialId) {
            id = element.parsed.materialId;
          } else {
            this.$notify({
              title: "警告",
              type: "warning",
              message: "当前节点无可用素材"
            });
            return;
          }
        }
        getMaterialsList({
          id: id
        })
          .then(res => {
            if (res.data.success) {
              let mp4Reg = /\.mp4$/;
              let mp3Reg = /\.mp3$/;
              let jpgReg = /\.(jpg|bmp|gif|ico|jpeg|png)$/;
              let responseEntity = res.data.data.items[0].entity;
              getDownloadUrl({
                id: id
              })
                .then(res => {
                  if (res.data.success) {
                    this.previewMediaFlag = true;
                    if (mp4Reg.test(responseEntity.url)) {
                      this.previewAV = true;
                      this.oPlayerTypeFlag = true;
                    }
                    if (mp3Reg.test(responseEntity.url)) {
                      this.previewAV = true;
                      this.oPlayerTypeFlag = false;
                    }
                    if (jpgReg.test(responseEntity.url)) {
                      this.previewAV = false;
                    }
                    this.$nextTick(_ => {
                      this.$refs.oMedia.src = res.data.data.url;
                      if (this.previewAV) {
                        this.$refs.oMedia.play();
                      }
                    });
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
                });
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
          });
      },
      submitElementMedia(element) {
        let parameter = {
          id: element.entity.id,
          lesson_id: this.$route.params.lessonId,
          block_id: element.entity.blockId,
          type: element.entity.type,
          material_id: element.entity.media.id,
          review_type: element.entity.reviewType
        };
        updateElement(parameter)
          .then(res => {
            if (res.data.success) {
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg || "未知错误，请联系管理员",
                type: "error",
                offset: 45
              });
            }
            this.getLessonEssInfo();
          })
          .catch(error => {
            this._catch(error);
          });
      },
      addMetaData() {
        this.addReviewEle.expression_id = "";
      },
      selectWordOrSentence(type, item) {
        this.$set(item.parsed, "type", type);
      },
      /**
       * 复习课相关排序以及删除功能
       * type 0: 排序； 1: 删除
       */
      // 复习课element排序
      dragReviewEleEnd(prop) {
        // this.updataReviewBlock(prop.block.id, 0);
      },
      // 修改element节点
      updateReviewEle($event, item, index) {
        // this.$confirm('是否更新该节点, 是否继续?', '提示', {
        // 		confirmButtonText: '确定',
        // 		cancelButtonText: '取消',
        // 		type: 'warning'
        // 	}).then(() => {
        let para = {
          name: item.entity.name,
          id: item.entity.id,
          block_id: item.entity.blockId,
          type: item.entity.type,
          bg_material_id: item.parsed.bgMaterialId,
          material_id: item.parsed.materialId,
          replay_num: item.parsed.replayNum
        };
        if (item.parsed.parsedQuestion) {
          para.question_id = item.parsed.parsedQuestion.entity.id;
        }
        if (item.parsed.expressionObj) {
          para.expression_id = item.parsed.expressionObj.entity.id;
          para.expression_type = item.parsed.type;
        }
        updateElement(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success"
              });
              this.getLessonEssInfo();
            } else {
              this.$notify({
                title: "失败",
                message: "更新失败",
                type: "error"
              });
            }
          })
          .catch(err => {
            this._catch(err);
          });
        // })
        // .catch(() => {
        // 	this.$message({
        // 		type: 'error',
        // 		message: '已取消更新'
        // 	});
        // })
      },
      // 删除复习课block中的element
      deleteReviewEle(item, index) {
        this.$confirm("是否删除该节点, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let blockId = item.entity.blockId;
            this.reviewEleList.splice(index, 1);
            this.updataReviewBlock(blockId, 1);
            // this.$notify({
            // 	title: '成功',
            // 	message: '删除成功',
            // 	type: 'success'
            // })
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "已取消删除"
            });
          });
      },
      // 更新复习课block
      updataReviewBlock(blockId, type) {
        let paraArr = [];
        let paraStr = "";
        if (this.reviewEleList && this.reviewEleList.length) {
          this.reviewEleList.map((item, index) => {
            paraArr.push(item.entity.id);
          });
        }
        paraStr = paraArr.join(",");
        let para = {
          block_id: blockId,
          element_ids: paraStr
        };
        changeReviewEle(para)
          .then(res => {
            if (res.data.success) {
              if (type == 1) {
                this.$notify({
                  title: "成功",
                  message: "更新成功",
                  type: "success"
                });
              }
            }
          })
          .catch(err => {
            _catch(err);
          });
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
                  }
                  if (mp3Reg.test(responseEntity.url)) {
                    this.previewAudioVisible = true;
                    this.previewVideoVisible = false;
                    this.$refs.oVideo.pause();
                    this.$refs.oAudio.src = res.data.data.url;
                    this.$refs.oAudio.play();
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
      // 停止播放
      stopPreviewVideo() {
        this.previewVideoVisible = !this.previewVideoVisible;
        this.$refs.oVideo.pause();
      },
      stopPreviewAudio() {
        this.previewAudioVisible = !this.previewAudioVisible;
        this.$refs.oAudio.pause();
      },
      /**
       * 音乐课相关
       */
      // 配置课程目标图片
      updateHomePageImage(val) {
        this.homePageConf.imageId = val.id;
        let para = {
          lesson_id: this.$route.params.lessonId,
          material_id: this.homePageConf.imageId
        };
        updateHomeImage(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "配置目标页图片成功",
                type: "success"
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error"
              });
            }
            this.getLessonEssInfo();
          })
          .catch(err => {
            this._catch(err);
          });
      },
      // 配置课程目标音频
      updateHomePageAudio(val) {
        this.homePageConf.audioId = val.id;
        let para = {
          lesson_id: this.$route.params.lessonId,
          material_id: this.homePageConf.audioId
        };
        updateHomeAudio(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "配置目标页音频成功",
                type: "success"
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error"
              });
            }
            this.getLessonEssInfo();
          })
          .catch(err => {
            this._catch(err);
          });
      },
      // 配置儿歌视频
      updateSong(val) {
        if (val.id != undefined) {
          this.$set(this.musicSongObj, val.oVal, val.id);
        } else {
          this.musicSongObj = {
            materialId: "",
            name: ""
          };
        }
        let para = {
          lesson_id: this.$route.params.lessonId,
          material_id: this.musicSongObj.materialId
        };
        if (para.material_id != "") {
          updateSongVideo(para)
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: "成功",
                  message: "配置儿歌视频成功",
                  type: "success"
                });
                this.getLessonEssInfo();
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this._catch(err);
            });
        }
      },
      // 配置音乐课场景音频
      updateSceneSong(val, scene) {
        if (val) {
          this.$set(scene, "audio_id", val.id);
          this.$set(scene, "audio_name", val.name);
          this.sceneSongLyric();
        } else {
          this.$set(scene, "audio_id", "");
          this.$set(scene, "audio_name", "");
        }
      },
      updateSceneImage(val, scene) {
        if (val) {
          this.$set(scene, "image_id", val.id);
          this.$set(scene, "image_url", val.url);
        } else {
          this.$set(scene, "image_id", "");
          this.$set(scene, "image_url", "");
        }
      },
      // 配置儿歌讲解视频
      updateExplain(val) {
        if (val.id != undefined) {
          this.$set(this.musicExplainSongObj, val.oVal, val.id);
        } else {
          this.musicExplainSongObj = {
            materialId: "",
            name: ""
          };
        }
        let para = {
          lesson_id: this.$route.params.lessonId,
          material_id: this.musicExplainSongObj.materialId
        };
        if (para.material_id != "") {
          updateExplainVideo(para)
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: "成功",
                  message: "配置讲解视频成功",
                  type: "success"
                });
                this.getLessonEssInfo();
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(err => {
              this._catch(err);
            });
        }
      },
      // 点击显示修改音乐课件状态弹窗
      showMusicDialog() {
        this.musicStatusChange = true;
        if (
          this.lessonDetailInfo.parsed &&
          this.lessonDetailInfo.parsed.musicLessonConf
        ) {
          this.musicStatus = this.lessonDetailInfo.parsed.musicLessonConf.status;
        }
      },
      //更新音乐课件状态
      submitMusicStatus() {
        let para = {
          lesson_id: this.$route.params.lessonId,
          status: this.musicStatus
        };
        changeMusicLessonStatus(para)
          .then(res => {
            if (res.data.success) {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error"
              });
            }
            this.musicStatusChange = false;
            this.getLessonEssInfo();
          })
          .catch(err => {
            this._catch(err);
          });
      },
      // 更新音乐课词汇
      updateMusicWord(value, index, arr) {
        if (value) {
          let params = {
            lesson_id: this.$route.params.lessonId,
            vocabularies: ""
          };
          let n = [];
          let flag = true;
          if (arr.length) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].id) {
                for (var j = 0; j < n.length; j++) {
                  if (arr[i].type === n[j].type) {
                    if (arr[i].id === n[j].id) {
                      this.$notify({
                        title: "警告",
                        type: "warning",
                        message: "当前单词已添加，请重新选择"
                      });
                      arr[index].id = "";
                      flag = false;
                    }
                  }
                }
                n.push(arr[i]);
              }
            }
            if (flag) {
              params.vocabularies = JSON.stringify(n);
              updateMusicVocabularies(params)
                .then(res => {
                  if (res.data.success) {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                  } else {
                    this.$notify({
                      title: res.data.code,
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                })
                .catch(error => {
                  this._catch(error);
                });
            }
          }
        }
      },
      // 新增场景
      addScene() {
        this.$confirm("确认新增场景吗?", "提示", {})
          .then(() => {
            let para = {
              lesson_id: this.$route.params.lessonId
            };
            addMusicScene(para)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    message: "新增场景成功",
                    type: "success"
                  });
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
                this.getLessonEssInfo();
              })
              .catch(err => {
                this._catch(err);
              });
          })
          .catch(err => {
            this.$notify({
              title: "取消",
              message: "取消新增场景",
              type: "error"
            });
          });
      },
      // 编译歌词
      lyricForSong(scene) {
        if (scene.audio_id) {
          this.lyricWordChoose = true;
          this.sceneLyricConf = scene;
          let lyricWordArr = [];
          try {
            scene.lyric.split("[").map((item, index) => {
              if (index != 0) {
                let lyricWord = item.split("]")[1].replace(/[\r\n]/g, "");
                var type = 1;
                if (lyricWord) {
                  for (var i = 0; i < lyricWord.length; i++) {
                    let wordCode = lyricWord.split("")[i].charCodeAt(0);
                    if (
                      !(
                        (wordCode >= 65 && wordCode <= 90) ||
                        (wordCode >= 97 && wordCode <= 122)
                      )
                    ) {
                      if (i != lyricWord.length - 1) {
                        type = 4;
                        continue;
                      }
                    }
                  }
                } else {
                  type = 0;
                }
                lyricWordArr.push({
                  english: item.split("]")[1].replace(/[\r\n]/g, ""),
                  start: item.split("]")[0],
                  id: "",
                  isHave: "",
                  wordArr: [],
                  type: type
                });
              }
            });
            if (lyricWordArr.length > 0) {
              lyricWordArr.map((item, index) => {
                if (item.english) {
                  if (item.type == 1) {
                    let para = {
                      english: item.english
                        .replace(
                          /[\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\,|\<|\.|\>|\/|\?]/g,
                          ""
                        )
                        .toLowerCase()
                    };
                    getWordList(para).then(res => {
                      if (res.data.success) {
                        if (res.data.data.items) {
                          if (res.data.data.items.length == 0) {
                            item.isHave = false;
                            item.wordArr = [];
                          } else if (res.data.data.items.length == 1) {
                            item.isHave = true;
                            item.wordArr = res.data.data.items;
                            res.data.data.items.map((prop, _index) => {
                              item.chinese = prop.entity.chinese;
                              item.id = prop.entity.id;
                            });
                          } else {
                            item.isHave = true;
                            item.wordArr = res.data.data.items;
                            res.data.data.items.map((prop, _index) => {
                              if (_index == 0) {
                                item.id = prop.entity.id;
                              }
                            });
                          }
                        } else {
                          item.isHave = false;
                        }
                      } else {
                        this.$notify({
                          title: "失败",
                          message: res.data.msg,
                          type: "error"
                        });
                      }
                    });
                  } else if (item.type == 4) {
                    let para = {
                      english: item.english
                    };
                    getSentencePatternList(para).then(res => {
                      if (res.data.success) {
                        if (res.data.data.items) {
                          if (res.data.data.items.length == 0) {
                            item.isHave = false;
                            item.wordArr = [];
                          } else if (res.data.data.items.length == 1) {
                            item.isHave = true;
                            item.wordArr = res.data.data.items;
                            res.data.data.items.map((prop, index) => {
                              item.chinese = prop.entity.chinese;
                              item.id = prop.entity.id;
                            });
                          } else {
                            item.isHave = true;
                            item.wordArr = res.data.data.items;
                            res.data.data.items.map((prop, _index) => {
                              if (_index == 0) {
                                item.id = prop.entity.id;
                              }
                            });
                          }
                        } else {
                          item.isHave = false;
                        }
                      } else {
                        this.$notify({
                          title: "失败",
                          message: res.data.msg,
                          type: "error"
                        });
                      }
                    });
                  }
                }
              });
              this.lyricWordArr = Object.assign([], lyricWordArr);
            }
          } catch (e) {
            this.$notify({
              title: "失败",
              message: "歌词格式不正确",
              type: "error"
            });
          }
        } else {
          this.$notify({
            title: "失败",
            message: "该场景未配置音频",
            type: "error"
          });
        }
      },
      submitLyricWord() {
        let flag = true;
        let lyricWordJsonArr = [];
        let lyricWordJsonStr = "";
        let lyricWordObj = {
          lines: [
            {
              words: ""
            }
          ]
        };
        if (this.lyricWordArr && this.lyricWordArr.length > 0) {
          this.lyricWordArr.map((item, index) => {
            if (index < this.lyricWordArr.length - 1) {
              // if (item.id == '') {
              // 	this.$notify({
              // 		title: '失败',
              // 		message: '未匹配到词句库单词',
              // 		type: 'error'
              // 	})
              // 	flag = false
              // 	return
              // }
              let timeTransArr = item.start.split(":");
              let timeTransNum =
                Number(timeTransArr[0] * 60 * 1000) +
                Number(timeTransArr[1].split(".")[0] * 1000) +
                Number(timeTransArr[1].split(".")[1]);
              let endTimeTransArr = this.lyricWordArr[index + 1].start.split(":");
              let endTimeTransNum =
                Number(endTimeTransArr[0] * 60 * 1000) +
                Number(endTimeTransArr[1].split(".")[0] * 1000) +
                Number(endTimeTransArr[1].split(".")[1]);

              lyricWordJsonArr.push({
                english: item.english,
                targetId: item.id,
                start: timeTransNum,
                end: endTimeTransNum,
                type: item.type
              });
            }
          });
        }
        if (flag) {
          lyricWordObj.lines[0].words = lyricWordJsonArr;
          try {
            let para = {
              id: this.sceneLyricConf.audio_id,
              name: this.sceneLyricConf.audio_name,
              status: 1,
              content: JSON.stringify(lyricWordObj)
            };
            updateMaterial(para)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    message: "配置歌词成功",
                    type: "success"
                  });
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
                this.sceneSongLyric();
                this.lyricWordChoose = false;
              })
              .catch(err => {
                this._catch(err);
              });
          } catch (e) {
            this.$notify({
              title: "失败",
              message: "歌词格式不正确",
              type: "error"
            });
          }
        }
      },
      sceneSongLyric() {
        this.musicScenes.map((item, index) => {
          if (item.audio_id) {
            let para = {
              id: item.audio_id
            };
            getMaterialsList(para)
              .then(res => {
                if (res.data.success) {
                  if (res.data.data.items[0].entity.content) {
                    try {
                      let lyricObj = JSON.parse(
                        res.data.data.items[0].entity.content
                      );
                      let lyricStr = "";
                      if (
                        lyricObj.lines[0].words &&
                        lyricObj.lines[0].words.length > 0
                      ) {
                        lyricObj.lines[0].words.map((_item, index) => {
                          let minute = parseInt(
                            (_item.start % (1000 * 60 * 60)) / (1000 * 60)
                          );
                          minute = minute < 10 ? 0 + "" + minute : minute;
                          let second = parseInt(
                            (_item.start % (1000 * 60)) / 1000
                          );
                          second = second < 10 ? 0 + "" + second : second;
                          let millisecond = _item.start % 1000;
                          millisecond =
                            millisecond < 100
                              ? millisecond < 10
                                ? "00" + millisecond
                                : "0" + millisecond
                              : millisecond;
                          lyricStr +=
                            "[" +
                            minute +
                            ":" +
                            second +
                            "." +
                            millisecond +
                            "]" +
                            _item.english +
                            "\n";
                          if (index == lyricObj.lines[0].words.length - 1) {
                            let endTimeMinute = parseInt(
                              (_item.end % (1000 * 60 * 60)) / (1000 * 60)
                            );
                            endTimeMinute =
                              endTimeMinute < 10
                                ? 0 + "" + endTimeMinute
                                : endTimeMinute;
                            let endTimeSecond = parseInt(
                              (_item.end % (1000 * 60)) / 1000
                            );
                            endTimeSecond =
                              endTimeSecond < 10
                                ? 0 + "" + endTimeSecond
                                : endTimeSecond;
                            let endTimeMillisecond = _item.end % 1000;
                            endTimeMillisecond =
                              endTimeMillisecond < 100
                                ? endTimeMillisecond < 10
                                  ? "00" + endTimeMillisecond
                                  : "0" + endTimeMillisecond
                                : endTimeMillisecond;

                            lyricStr +=
                              "[" +
                              endTimeMinute +
                              ":" +
                              endTimeSecond +
                              "." +
                              endTimeMillisecond +
                              "]";
                          }
                        });
                      }
                      this.$set(item, "lyric", lyricStr);
                    } catch (e) {
                      this.$set(
                        item,
                        "lyric",
                        res.data.data.items[0].entity.content
                      );
                      this.$notify({
                        title: "失败",
                        message: "歌词格式不正确, 请修改歌词格式为时间轴格式",
                        type: "error"
                      });
                    }
                  }
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                this._catch(err);
              });
          }
        });
      },
      // 保存场景
      saveScene(scene) {
        this.$confirm("确认排序场景吗?", "提示", {})
          .then(() => {
            let para = {
              block_id: scene.id,
              chinese: scene.chinese,
              english: scene.english,
              audio_id: scene.audio_id,
              image_id: scene.image_id
            };
            updateMusicScene(para)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    message: "场景修改成功",
                    type: "success"
                  });
                  this.getLessonEssInfo();
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                this._catch(err);
              });
          })
          .catch(err => {
            this.$notify({
              title: "取消",
              message: "取消修改场景",
              type: "success"
            });
          });
      },
      //
        setSongHz() {
	       this.musicLessonSongHzDia = true;
        },
		submitMusicSongHz() {
			let para = {
				lesson_id: this.$route.params.lessonId,
				speed_factor: this.songHz
			}
			updateSpeedFactor(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '倍速修改成功',
							type: 'success'
						})
						this.musicLessonSongHzDia = false;
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
		},
      // 场景排序
      sortScene() {
        this.$confirm("确认排序场景吗?", "提示", {})
          .then(() => {
            let sceneArr = [];
            if (this.musicScenes && this.musicScenes.length) {
              this.musicScenes.map((item, index) => {
                sceneArr.push(item.id);
              });
            }
            let para = {
              lesson_id: this.$route.params.lessonId,
              block_ids: sceneArr.join(",")
            };
            sortMusicScene(para)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    message: "场景排序成功",
                    type: "success"
                  });
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
                this.getLessonEssInfo();
              })
              .catch(err => {
                this._catch(err);
              });
          })
          .catch(err => {
            this.$notify({
              title: "取消",
              message: "取消场景排序",
              type: "success"
            });
          });
      },
      // 删除场景
      delScene(scene) {
        this.$confirm("确认删除该场景吗?", "提示", {})
          .then(() => {
            let para = {
              lesson_id: this.$route.params.lessonId,
              block_id: scene.id
            };
            delMusicScene(para)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    message: "删除场景成功",
                    type: "success"
                  });
                } else {
                  this.$notify({
                    title: "失败",
                    message: res.data.msg,
                    type: "error"
                  });
                }
                this.getLessonEssInfo();
              })
              .catch(err => {
                this._catch(err);
              });
          })
          .catch(err => {
            this.$notify({
              title: "取消",
              message: "取消删除场景",
              type: "success"
            });
          });
      }
    },
    filters: {
      // 关于时间转换的俩东西
      formatTime(date) {
        if (date === undefined) {
          return;
        }
        if (date === 0) {
          return "/";
        }
        return util.formatDate.format(new Date(date), "yyyy/MM/dd   hh:mm:ss");
      },
      formatLessonType(type) {
        switch (type) {
          case 0:
            return "主课";
            break;
          case 1:
            return "赠课";
            break;
          case 2:
            return "复习课";
            break;
          default:
            return "未知";
        }
      }
    },
    watch: {
      newElementFileLocalFlag: {
        handler(newValue, oldValue) {
          if (newValue == false) {
            this.dialogShowFull = "small";
          }
        },
        deep: true
      },
      dialogAddNewElement: {
        handler(newValue, oldValue) {
          if (newValue == false) {
            this.newElementAvLocalFlag = false;
            this.newElementVideoMaterialFlag = false;
            this.newElementAudioMaterialFlag = false;
            this.editElementAVFlag = false;
          }
        },
        deep: true
      },

      newElementFileMaterialFlag: {
        handler(newValue, oldValue) {
          if (newValue == false) {
            this.submitButtonFalg = {
              local: true,
              material: true
            };
            this.avType = "";
          }
        },
        deep: true
      },
      previewMediaFlag: {
        handler(newValue, oldValue) {
          if (!newValue) {
            if (this.previewAV) {
              this.$refs.oMedia.pause();
            }
          }
        },
        deep: true
      },
      isDrag: {
        handler(newVal, oldVal) {
          // console.log(newVal);
          if (newVal) {
            this.blockDragOption.disabled = false;
          } else {
            this.blockDragOption.disabled = true;
          }
        },
        deep: true
      }
    },
    mounted() {
      this.getLessonEssInfo();
    },
    updated() {}
  };
  </script>
  <style lang="less" scoped>
  .briefness-course {
    .item {
      border: 1px solid rgb(209, 227, 229);
      border-radius: 4px;
      margin-top: 40px;
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.15),
        -1px -1px 5px 0 rgba(255, 255, 255, 0.15) inset;
      .title {
        width: 100%;
        font-family: "ArialMT", "Arial";
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        line-height: 60px;
        height: 60px;
        text-indent: 1em;
        border-bottom: 1px solid rgb(209, 227, 229);
        border-radius: 4px;
      }
      .content {
        padding: 30px;
        .el-form {
          margin-top: 20px;
          .input {
            width: 76%;
            margin-right: 10px;
          }
          .word {
            width: 45%;
            margin: 0 10px 10px 0;
            display: inline-block;
            .check-input {
              width: 70%;
            }
          }
          .sentence {
            width: 45%;
            margin: 0 10px 10px 0;
            display: inline-block;
            .check-input {
              width: 70%;
            }
          }
        }
      }
    }
  }
  .chapter-button {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .recycle {
    max-height: 345px;
    overflow: scroll;
    .del-block {
      font-size: 14px;
      p {
        display: inline-block;
        span {
          width: 240px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 10px;
          &:nth-of-type(3) {
            width: 150px;
            margin: 0 20px;
          }
        }
      }
      .recall-button {
        display: inline-block;
      }
    }
  }
  .btnForPre {
    // display: flex;
    // justify-content: left;
  }
  .list-complete-item {
    margin-top: 4px;
  }

  .lessonTitle {
    text-align: center;
    font-size: 22px;
    font-weight: 500;
  }

  .el-carousel__item h3 {
    text-align: center;
    color: #475669;
    font-size: 20px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .lessonInfo {
    padding: 5px 0;
  }

  .lessonInfoTitle {
    text-align: right;
  }

  .lessonInfoContent {
    text-align: left;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .componentFlag {
    margin: 10px 0;
  }

  .sequence-text .el-input {
    margin-bottom: 10px;
    overflow: hidden;
  }

  .blockName {
    margin-left: 10px;
    width: 30%;
    display: inline-block;
  }

  .blockName {
    width: 40%;
    display: inline-block;
  }

  .contentLength {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-tag {
    margin-left: 10px;
    padding: 0 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 26px;
    line-height: 24px;
    padding-top: 0;
    font-size: 12px;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 150px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .uploadMethods {
    display: inline-block;
    width: 580px;
    margin-left: 20px;
    float: right;
  }
  .select-material {
    width: 100px;
  }
  .edit-biref-element {
    width: 820px;
  }
  .preview-audio,
  .preview-image,
  .preview-video {
    width: 650px;
  }
  .element-for-review {
    width: 80%;
    border: 1px solid #000;
    margin: 20px;
    padding: 20px;
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
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .preview-container {
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    overflow-x: scroll;
    display: flex;
    align-items: center;
    div {
      text-align: center;
      margin: 0 10px;
      img {
        width: 140px;
        display: inline-block;
        height: 140px;
        border: 1px dashed #ccc;
      }
      span {
        display: inline-block;
        width: 100%;
        text-align: center;
        height: 30px;
        line-height: 30px;
        // border: 1px solid green;
      }
    }
  }
  .review-upload {
    // display: inline-block;
    display: inline-block;
    width: 500px;
    margin-left: 20px;
    float: left;
  }
  .choose-element-type {
    margin: 20px 0;
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
  .newBlock {
    float: right;
    // position: absolute;
    // top: 165px;
    // right: 55px;
  }
  </style>
