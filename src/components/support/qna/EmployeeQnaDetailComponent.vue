<template>
    <div>
      <EmployeeView />
      <v-container class="qna-container">
        <v-row justify="center">
          <v-col cols="12" md="12">
            <v-card class="qna-card">
              <v-card-title class="custom-title">Question</v-card-title>
              <br>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12" md="2" class="custom-col-service">
                      <v-input>
                        Service
                      </v-input>
                    </v-col>
                    <v-col cols="12" md="10">
                      <v-text-field
                        v-model="service"
                        outlined
                        readOnly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- title -->
                  <v-row style="margin-top: -20px;">
                    <v-col cols="12" md="2" class="custom-col-title">
                      <v-input>
                        Title
                      </v-input>
                    </v-col>
                    <v-col cols="12" md="10">
                      <v-text-field
                        v-model="title"
                        outlined
                        readOnly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- content -->
                  <v-row style="margin-top: -20px;">
                    <v-col cols="12" md="2" class="custom-col-content">
                      <v-input>
                        Content
                      </v-input>
                    </v-col>
                    <v-col cols="12" md="10">
                      <v-textarea
                        v-model="contents"
                        outlined
                        readOnly
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
  
                <v-card style="center">
                  <v-card-title class="custom-title">Answer</v-card-title>
                  <br>
                  <v-card-text>
                    <v-form>
                      <v-row>
                        <v-col cols="12" md="2" class="custom-col-content">
                          <v-input>
                            Answer
                          </v-input>
                        </v-col>
                        <v-col cols="12" md="10">
                          <v-textarea
                            v-model="answer"
                            outlined
                            readonly
                          ></v-textarea>
                        </v-col>
                      </v-row>
                      <v-row style="margin-top: -20px;">
                        <v-col cols="12" md="2" class="custom-col-title">
                          <v-input>
                            Time
                          </v-input>
                        </v-col>
                        <v-col cols="12" md="10">
                          <v-text-field
                            v-model="answerTime"
                            outlined
                            readOnly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
  
                <v-row class="justify-end" style="padding-top: 55px;">
                
                  <v-btn
                    v-if="!answer || answer === '답변이 없습니다. 답변을 달아주세요. '"
                    class="center"
                    style="color: white; width: 600px; margin-right: 50px; font-size: 15px;"
                    color="#7A6C5B"
                    @click="qnaCreate($route.params.id)"
                  >
                    Answer
                  </v-btn>
  
                  <template v-else>
                    <v-btn
                      class="leftbtn"
                      style="color: white; font-size: 15px;"
                      color="#7A6C5B"
                      @click="qnaModify($route.params.id)"
                    >
                      Modify
                    </v-btn>
                    <v-btn
                      style="color: white; font-size: 15px; margin-right: 10px;"
                      color="#CFB18E"
                      @click="openModal"
                    >
                      Delete Anawer
                    </v-btn>
                  </template>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 모달 -->
        <v-dialog class="modal" v-model="dialog" max-width="400px">
            <v-card class="modal">
                <v-card-title>답변을 삭제하시겠습니까?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="leftbtn" color="black" @click="qnaDelete">Yes</v-btn>
                    <v-btn color="black" @click="cancelDelete">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script>
  import EmployeeView from '@/views/EmployeeView.vue';
  import axios from 'axios';
  
  export default {
    components: {
      EmployeeView
    },
    data() {
      return {
        service: "",
        title: "",
        contents: "",
        answer: "",
        answerTime: "",
        dialog: false,
      };
    },
  
    created() {
      this.fetchQnaDetail();
    },
  
    methods: {
      async fetchQnaDetail() {
        try {
          const id = this.$route.params.id;
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/qna/detail/${id}`);
          console.log(response.data);
  
          this.service = response.data.result.service;
          this.title = response.data.result.title;
          this.contents = response.data.result.contents;
          this.answer = response.data.result.answer || null; 
          const [date, time] = response.data.result.answerTime.split('T');
          this.answerTime = date + ' ' + time || null;
          
        } catch (e) {
          //alert(e.response ? e.response.data.error_message : e.message) 
          console.log(e);
        }
      },
  
      async qnaCreate(id) {
        this.$router.push({
          path: `/employee/qna/answer/create/${id}`
        });
      },
      openModal() {
        this.dialog = true;
      }, 
      async qnaDelete() {
        try {
            const id = this.$route.params.id;
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/employee/qna/answer/delete/${id}`);
            console.log(response.data);

            this.dialog = false;
            // 삭제 후 QnA 리스트 페이지로 이동
            this.$router.push('/employee/qna/list');  
        } catch (e) {
            console.error(e);
        } finally {
            this.dialog = false; // 모달 닫기 
            alert("답변이 삭제되었습니다.");
        } 
      },
      cancelDelete() {
        this.dialog = false;
      },
      async qnaModify(id) {
          this.$router.push({
              path: `/employee/qna/answer/update/${id}`
          });
      }

    }
  }
  </script>
  
  <style scoped>
  .custom-title {
    font-family: "Noto Serif KR", serif;
    color: #787878;
    font-size: 20px;
    border-bottom: 3px solid #787878;
    text-align: center;
  }
  .qna-container {
    font-family: "Noto Serif KR", serif;
    background-color: white;
    position: absolute;
    width: 90%;
    max-width: 1200px;
    height: 82%;
    top: 57%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow-y: auto;
    padding-left: 14%;
    padding-top: 10px;
  }
  .qna-card {
    border: none;
    box-shadow: none;
    width: 80%;
    padding: 20px;
  }
  .custom-col-service {
    padding-left: 50px;
    padding-top: 30px;
    color: #787878;
  }
  .custom-col-title {
    padding-left: 70px;
    padding-top: 30px;
    color: #787878;
  }
  .custom-col-content {
    padding-left: 50px;
    padding-top: 70px;
    color: #787878;
  }
  .leftbtn {
    margin-right: 5px;
  }
  .modal {
    padding: 20px;
    font-family: "Noto Serif KR", serif;
  }
  </style>
  