<template>
  <div class="konghang"></div>
  <div class="source-layout">
    <!-- 左侧对话栏 -->
    <div class="conversation-sidebar">
      <div class="sidebar-header">
        <h3>代码分析对话</h3>
        <button @click="createNewConversation" class="new-chat-btn">
          <i class="fas fa-plus"></i> 新建对话
        </button>
      </div>

      <div class="conversation-list">
        <div
            v-for="conv in conversations"
            :key="conv.code_file_id"
            class="conversation-item"
            :class="{ active: activeConversationId === conv.code_file_id }"
            @click="switchConversation(conv.code_file_id)"
        >
          <div class="conv-info">
            <i class="fas fa-code"></i>
            <span class="conv-title">{{ conv.file_name || conv.title || `对话 #${conv.code_file_id}` }}</span>
          </div>
          <div class="conv-meta">
<!--            <span class="conv-count">{{ conv.message_count || 0 }} 条</span>-->
            <span class="conv-date">{{ formatDate(conv.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <div v-if="activeConversationId" class="source-container">
        <h2>代码文件上传</h2>

        <!-- 文件上传区域 -->
        <div class="upload-section">
          <div class="upload-box" @click="triggerFileInput" @dragover.prevent @drop="handleDrop">
            <input
                type="file"
                id="fileInput"
                ref="fileInput"
                @change="handleFileChange"
                accept=".zip"
                style="display: none"
            >
            <div v-if="!selectedFile" class="upload-prompt">
              <i class="fas fa-file-archive"></i>
              <p>点击或拖拽 ZIP 文件到此处</p>
              <p class="file-types">仅支持 .zip 格式</p>
            </div>
            <div v-else class="file-info">
              <i class="fas fa-file-archive"></i>
              <p>{{ selectedFile.name }}</p>
              <p>{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>

          <div class="action-buttons">
            <button
                @click="uploadFile"
                :disabled="!selectedFile || uploading"
                class="upload-btn"
            >
              <i class="fas fa-upload"></i> {{ uploading ? '上传中...' : '上传文件' }}
            </button>
            <button
                @click="clearSelection"
                :disabled="!selectedFile"
                class="clear-btn"
            >
              <i class="fas fa-times"></i> 清除
            </button>
          </div>
        </div>

          <!-- 文件列表 -->
  <!--        <div v-if="files.length > 0" class="file-list">-->
          <div v-if="files.filter(f => f.file_path).length > 0" class="file-list">
            <h3>当前对话文件</h3>
            <table>
              <thead>
              <tr>
                <th>文件名</th>
                <th>上传时间</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="file in files" :key="file.code_file_id">
                <td>{{ file.file_name }}</td>
                <td>{{ formatDate(file.created_at) }}</td>
                <td>
                  <button @click="downloadFile(file)" class="download-btn">
                    <i class="fas fa-download"></i> 下载
                  </button>
                  <button @click="confirmDelete(file)" class="delete-btn">
                    <i class="fas fa-trash"></i> 删除
                  </button>
<!--                  <button @click="analyzeFile(file)" class="analyze-btn">-->
<!--                    <i class="fas fa-search"></i> 分析-->
<!--                  </button>-->
                </td>
              </tr>
              </tbody>
            </table>
          </div>

        <div v-if="activeConversationId" class="analysis-section">
          <!-- 代码分析模块 -->
          <div class="analysis-module">
            <h3>代码分析</h3>
            <div class="analysis-options">
              <button
                  @click="runAnalysis"
                  :disabled="!hasUploadedFile || isAnalyzing"
                  class="run-analysis-btn"
              >
                <i class="fas fa-search"></i>
                {{ isAnalyzing ? '分析中...请勿关闭界面' : '代码分析' }}
              </button>
            </div>

            <!-- 分析结果展示 -->
            <div v-if="analysisResults" class="analysis-results">
              <div class="result-summary">
                <h4>代码分析摘要</h4>
                <pre>{{ analysisResults.summary }}</pre>
              </div>

<!--              <div class="result-details">-->
<!--                <h4>代码问题 ({{ analysisResults.details.issues.length }}个)</h4>-->
<!--                <div class="issues-list">-->
<!--                  &lt;!&ndash; 保持原有问题显示逻辑 &ndash;&gt;-->
<!--                </div>-->
<!--              </div>-->
            </div>
          </div>

          <!-- AI对话模块 -->
          <div class="chat-module">
            <h3>AI代码助手</h3>
            <div class="chat-container">
              <div class="chat-messages">
                <div
                    v-for="(message, index) in chatMessages"
                    :key="index"
                    :class="'message-' + message.role"
                >
                  <div class="message-content">
                    <div class="message-role">
                      {{ message.role === 'user' ? '你' : 'AI助手' }}
                    </div>
                    <div class="message-text">{{ message.content }}</div>
                  </div>
                </div>
              </div>

              <div class="chat-input">
        <textarea
            v-model="userMessage"
            placeholder="输入关于代码的问题..."
            @keyup.enter="sendMessage"
        ></textarea>
                <button
                    @click="sendMessage"
                    :disabled="!userMessage || isSending"
                    class="send-btn"
                >
                  <i class="fas fa-paper-plane"></i>
                  {{ isSending ? '发送中...' : '发送' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 初始空状态 -->
      <div v-else class="empty-state">
        <div class="empty-prompt">
          <i class="fas fa-folder-open"></i>
          <h3>未选择任何对话</h3>
          <p>请从左侧选择或新建对话开始分析</p>
        </div>
      </div>

      <!-- 删除确认对话框 -->
      <div v-if="showDeleteDialog" class="dialog-overlay">
        <div class="confirm-dialog">
          <h3>确认删除</h3>
          <p>确定要删除文件 "{{ fileToDelete.file_name }}" 吗？</p>
          <div class="dialog-buttons">
            <button @click="showDeleteDialog = false" class="cancel-btn">取消</button>
            <button @click="deleteFile" class="confirm-btn">确认删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SourceUpload",
  data() {
    return {
      selectedFile: null,
      files: [],
      uploading: false,
      error: null,
      showDeleteDialog: false,
      fileToDelete: null,
      conversations: [],
      activeConversationId: null,
      // 新增分析相关数据
      selectedAnalysisType: "full",
      isAnalyzing: false,
      analysisResults: null,
      hasUploadedFile: false,

      // 新增对话相关数据
      userMessage: "",
      chatMessages: [],
      isSending: false
    };
  },
  async mounted() {
    await this.fetchConversations();
  },
  computed: {
    currentFile() {
      return this.files.find(f => f.file_path) || null;
    }
  },
  watch: {
    files: {
      handler(newFiles) {
        this.hasUploadedFile = newFiles.some(f => f.file_path);
      },
      immediate: true
    }
  },
  methods: {

    // 新增分析相关方法
    async runAnalysis() {
      if (!this.currentFile) return;

      try {
        this.isAnalyzing = true;
        const response = await this.$axios.post('http://127.0.0.1:8080/files/analyze', {
          file_id: this.currentFile.code_file_id,
          analysis_type: "code_review"
        });

        this.analysisResults = response.data;
        this.$message.success('代码分析完成');

        // 分析完成后自动生成建议
        // await this.generateInitialAdvice();

      } catch (error) {
        // ...错误处理...
      } finally {
        this.isAnalyzing = false;
      }
    },

    // 新增对话相关方法
    async sendMessage() {
      // 验证条件
      if (!this.userMessage?.trim()) {
        this.$message.error('请输入消息内容');
        return;
      }

      if (!this.currentFile?.code_file_id) {
        this.$message.error('请先上传并选择代码文件');
        return;
      }

      try {
        this.isSending = true;
        const userMsg = this.userMessage;

        // // 添加到本地消息列表
        // this.chatMessages.push({ role: 'user', content: userMsg });
        // this.userMessage = '';

        // 立即显示用户消息
        this.chatMessages.push({
          role: 'user',
          content: userMsg,
          created_at: new Date().toISOString()
        });
        this.userMessage = '';

        // 发送请求
        const response = await this.$axios.post(
            'http://127.0.0.1:8080/files/chat',
            {
              message: userMsg,
              use_context: true,
              code_file_id: this.currentFile.code_file_id,  // 确保传递有效文件ID
              // conversation_id: this.activeConversationId  // 如果后端需要
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
        );

        // 立即显示AI回复
        this.chatMessages.push({
          role: 'assistant',
          content: response.data.message || response.data.response,
          created_at: new Date().toISOString()
        });

        this.scrollToBottom();

      } catch (error) {
        console.error('发送错误详情:', {
          request: error.config?.data,
          response: error.response?.data
        });
        this.$message.error(`发送失败: ${error.response?.data?.detail || error.message}`);
      } finally {
        this.isSending = false;
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.chat-messages');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    async generateInitialAdvice() {
      // 只有在有分析结果且没有历史消息时才生成建议
      if (this.chatMessages.length > 0 || !this.analysisResults) return;

      try {
        this.isSending = true;

        // 根据分析结果生成建议
        const response = await this.$axios.post('http://127.0.0.1:8080/files/chat', {
          message: "根据分析结果，请给出3条最重要的改进建议",
          use_context: true,
          code_file_id: this.currentFile?.code_file_id
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // 添加AI回复到聊天记录
        this.chatMessages.push({
          role: 'assistant',
          content: response.data.response
        });

      } catch (error) {
        console.error('生成建议失败:', error);
        this.$message.error('生成建议失败');
      } finally {
        this.isSending = false;
      }
    },

    // 修改后的analyzeFile方法
    async analyzeFile(file) {
      try {
        this.$confirm('确定要分析该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.selectedAnalysisType = "security";
          const response = await this.$axios.post('http://127.0.0.1:8080/files/analyze', {
            file_id: file.code_file_id,
            analysis_type: this.selectedAnalysisType
          });

          this.analysisResults = response.data;
          this.$message.success('分析完成');
        }).catch(() => {
          this.$message.info('已取消分析');
        });
      } catch (error) {
        this.$message.error('分析失败: ' + error.response.data.detail);
      }
    },

    async showAnalysisResults(results) {
      // 实现显示分析结果的逻辑
      this.$router.push({
        path: '/analysis/results',
        query: {analysis_id: results.analysis_id}
      });
    },


    async fetchAnalysisIssues(analysisId) {
      try {
        const response = await this.$axios.get(`http://127.0.0.1:8080/files/analysis/issues?analysis_id=${analysisId}`);
        console.log("分析问题:", response.data);
        // 显示问题列表
      } catch (error) {
        console.error('获取分析问题失败:', error);
      }
    },

    async fetchConversations() {
      try {
        const res = await this.$axios.get('http://127.0.0.1:8080/conversations/');
        this.conversations = res.data;

        // 不自动选择第一个对话，保持初始空状态
      } catch (error) {
        console.error('获取对话列表失败:', error);
      }
    },

    async fetchFiles() {
      if (!this.activeConversationId) {
        this.files = [];
        return;
      }

      try {
        // 1. 获取文件信息
        const fileRes = await this.$axios.get(
            `http://127.0.0.1:8080/conversations/${this.activeConversationId}/file`
        );

        this.files = fileRes.data.message ? [] : [fileRes.data];

        // 2. 如果有文件，检查分析状态
        if (this.files.length > 0 && this.files[0].file_path) {
          try {
            const analysisRes = await this.$axios.get(
                `http://127.0.0.1:8080/files/analysis/history?file_id=${this.files[0].code_file_id}`
            );

            // 3. 如果有分析结果，自动加载
            if (analysisRes.data && analysisRes.data.length > 0) {
              this.analysisResults = analysisRes.data[0];
              const messages = await this.$axios.get(`http://127.0.0.1:8080/files/conversation/${this.activeConversationId}/messages`,{
                // headers: { 'Content-Type': 'multipart/form-data' },
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              });
              this.chatMessages = messages.data
              const hasAnyMessages = this.chatMessages.some(msg => msg.role === 'assistant' || msg.role === 'user');
              if (!hasAnyMessages) {
                await this.generateInitialAdvice();
              }
              // 4. 自动生成AI建议
              if (this.chatMessages.length === 0) {
                await this.generateInitialAdvice();
              }
            }
          } catch (error) {
            console.log('没有分析记录');
          }
        }
      } catch (error) {
        console.error('获取文件失败:', error);
        this.files = [];
      }
    },
    async loadAnalysisForFile(file) {
      try {
        const response = await this.$axios.get(
            `http://127.0.0.1:8080/files/analysis/history?file_id=${file.code_file_id}`
        );

        if (response.data && response.data.length > 0) {
          // 获取最新的分析结果
          this.analysisResults = response.data[0];

          // 如果有问题，可以在这里加载问题列表
          if (this.analysisResults.details.issues && this.analysisResults.details.issues.length > 0) {
            await this.fetchAnalysisIssues(this.analysisResults.analysis_id);
          }
        }
      } catch (error) {
        console.error('加载分析结果失败:', error);
      }
    },

    async createNewConversation() {
      try {
        this.uploading = true;
        this.resetConversationState();
        const res = await this.$axios.post('http://127.0.0.1:8080/conversations/new');

        const newConversation = {
          ...res.data,
          title: "新对话",
          message_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        this.conversations.unshift(newConversation);
        this.activeConversationId = newConversation.code_file_id;
        this.files = []; // 新建对话时清空文件列表
      } catch (error) {
        console.error('创建对话失败:', error);
      } finally {
        this.uploading = false;
      }
    },
    resetConversationState() {
      this.analysisResults = null;
      this.chatMessages = [];
      this.isAnalyzing = false;
      this.isSending = false;
      this.selectedFile = null;
      this.files = [];
      this.userMessage = "";
    },
    async switchConversation(code_file_id) {
      if (!code_file_id || this.activeConversationId === code_file_id) return;

      // 重置状态
      this.analysisResults = null;
      this.chatMessages = [];
      this.isAnalyzing = false;
      this.isSending = false;
      this.selectedFile = null;
      this.files = [];

      this.activeConversationId = code_file_id;

      try {
        await this.fetchFiles();

        // 新增：加载历史聊天记录
        // await this.loadChatHistory();
      } catch (error) {
        console.error('切换对话失败:', error);
        this.$message.error('切换对话失败');
      }
    },

    async uploadFile() {
      if (!this.selectedFile || !this.activeConversationId) return;

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('conversation_id', this.activeConversationId);

        await this.$axios.post('http://127.0.0.1:8080/files/upload', formData, {
          // headers: { 'Content-Type': 'multipart/form-data' },
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
        this.$message.success('上传成功');
        await Promise.all([
          this.fetchFiles(),          // 刷新文件列表
          this.fetchConversations()  // 刷新对话列表
        ]);
        this.selectedFile = null;
      } catch (error) {
        console.error('上传失败:', error);
        this.error = error.response?.data?.detail || '文件上传失败';
      } finally {
        this.uploading = false;
      }
    },

    // 其他方法保持不变...
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      this.validateAndSetFile(file);
    },

    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.validateAndSetFile(file);
    },

    validateAndSetFile(file) {
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.zip')) {
        this.error = "仅支持 ZIP 格式文件";
        return;
      }

      this.error = null;
      this.selectedFile = file;
    },

    clearSelection() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },

    async downloadFile(file) {
      try {
        const response = await this.$axios.get(`http://127.0.0.1:8080/files/download/${file.code_file_id}`, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.file_name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('下载失败:', error);
        this.error = error.response?.data?.detail || '文件下载失败';
      }
    },

    confirmDelete(file) {
      this.fileToDelete = file;
      this.showDeleteDialog = true;
    },

    async deleteFile() {
      try {
        await this.$axios.delete(`http://127.0.0.1:8080/files/${this.fileToDelete.code_file_id}`);
        await this.fetchFiles(); // 刷新文件列表
        this.$message.success('文件删除成功');
        await Promise.all([
          this.fetchFiles(),          // 刷新文件列表
          this.fetchConversations()  // 刷新对话列表
        ]);
      } catch (error) {
        console.error('删除失败:', error);
        this.error = error.response?.data?.detail || '文件删除失败';
      } finally {
        this.showDeleteDialog = false;
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleString();
    }
  }
};
</script>

<style scoped>
.analysis-options {
  margin: 20px 0;
}

.run-analysis-btn {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.run-analysis-btn:hover:not(:disabled) {
  background-color: #0b7dda;
}

.run-analysis-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.konghang {
  height: 80px;
}

.source-layout {
  display: flex;
  min-height: calc(100vh - 80px);
}

/* 左侧对话栏样式 */
.conversation-sidebar {
  width: 280px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.new-chat-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.new-chat-btn:hover {
  background-color: #45a049;
}

.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 每条记录之间的间距 */
  padding: 8px;
}

.conversation-item {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #e9ecef;
}

.conversation-item.active {
  background-color: #e3f2fd;
  border-left: 3px solid #2196F3;
}

.conv-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.conv-info i {
  margin-right: 10px;
  color: #6c757d;
}

.conv-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6c757d;
}

.conv-date {
  background-color: #e9ecef;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 右侧内容区样式 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
}

.source-container {
  max-width: 1200px; /* 增加整体最大宽度 */
  margin: 0 auto;
  padding: 0 20px;
}


.upload-section {
  margin-bottom: 30px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

.upload-box {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.upload-box:hover {
  border-color: #3498db;
  background-color: #f0f8ff;
}

.upload-prompt i,
.file-info i {
  font-size: 48px;
  color: #3498db;
  margin-bottom: 15px;
}

.file-types {
  color: #777;
  font-size: 14px;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.upload-btn,
.clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.upload-btn {
  background-color: #4CAF50;
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.upload-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.clear-btn {
  background-color: #f44336;
  color: white;
}

.clear-btn:hover:not(:disabled) {
  background-color: #d32f2f;
}

.error-message {
  color: #f44336;
  background-color: #ffebee;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.file-list {
  margin-top: 30px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

.download-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.download-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 160px);
}

.empty-prompt {
  text-align: center;
  color: #888;

  i {
    font-size: 48px;
    color: #e0e0e0;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    margin: 8px 0;
    font-weight: normal;
  }

  p {
    font-size: 14px;
    color: #aaa;
  }
}

/* 删除确认对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
}

.confirm-btn {
  background: #f44336;
  color: white;
  border: none;
}
.analyze-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
  background-color: #4CAF50;
  color: white;
}

.analyze-btn:hover {
  background-color: #45a049;
}

/* 保持原有按钮间距 */
.download-btn, .analyze-btn, .delete-btn {
  margin-right: 5px;
}

/* 在style部分添加以下样式 */
.analysis-section {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 50% 50%;  /* 调整两列宽度比例 */
  gap: 30px;
}

.analysis-module, .chat-module {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.analysis-options {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.analysis-type-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.run-analysis-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.run-analysis-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.run-analysis-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 分析结果区域样式 */
.analysis-results {
  margin-top: 20px;
  max-width: 100%;
  overflow-x: hidden;
}

.result-summary {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.result-summary h4 {
  margin-top: 0;
  color: #333;
  font-size: 16px;
}

.result-summary pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  max-width: 100%;
  overflow-x: auto;
}

/* 聊天消息区域样式 */
.chat-container {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
}

.chat-messages {
  height: 800px;
  overflow-y: auto;
  padding: 15px;
  background: #fafafa;
  max-width: 100%;
}
.message-time {
  font-size: 11px;
  color: #999;
  margin-left: 8px;
  font-weight: normal;
}

.message-user, .message-assistant {
  margin-bottom: 15px;
  max-width: 100%;
}

.message-content {
  max-width: 90%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message-user .message-content {
  margin-left: auto;
  background-color: #e3f2fd;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-content {
  margin-right: auto;
  background-color: #f1f1f1;
  border-bottom-left-radius: 4px;
}

.message-role {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #555;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: hidden;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .analysis-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .chat-messages {
    height: 250px;
  }

  .message-content {
    max-width: 85%;
  }
}

@media (max-width: 768px) {
  .source-layout {
    flex-direction: column;
  }

  .conversation-sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }


  .message-content {
    max-width: 80%;
  }
}
.severity-high .severity-badge {
  background-color: #f44336;
  color: white;
}

.severity-medium .severity-badge {
  background-color: #ff9800;
  color: white;
}

.severity-low .severity-badge {
  background-color: #2196F3;
  color: white;
}

.issue-type {
  font-weight: bold;
}

.issue-location {
  color: #666;
  font-size: 13px;
}

.issue-description {
  margin-bottom: 8px;
}

.issue-recommendation {
  padding: 8px;
  background-color: rgba(255,255,255,0.7);
  border-radius: 4px;
  font-size: 14px;
}

/* 聊天模块样式 */
.chat-container {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}



.message-user, .message-assistant {
  margin-bottom: 15px;
}

.message-content {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
}

.message-user .message-content {
  margin-left: auto;
  background-color: #e3f2fd;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-content {
  margin-right: auto;
  background-color: #f1f1f1;
  border-bottom-left-radius: 4px;
}

.message-role {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #555;
}

.message-text {
  white-space: pre-wrap;
}

.chat-input {
  display: flex;
  border-top: 1px solid #eee;
  padding: 10px;
  background: white;
}

.chat-input textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  min-height: 50px;
  max-height: 150px;
}

.send-btn {
  margin-left: 10px;
  padding: 0 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.send-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>