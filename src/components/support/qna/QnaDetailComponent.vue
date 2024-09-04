<template>
    <div>
    <QnaView />
    <v-container class="qna-container">
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="qna-card">
                    <v-card-title class="custom-title">QnA 조회</v-card-title>
                    <br>
                    <v-card-text>
                        <v-form>
                            <!-- 서비스 선택 -->
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
                            <v-row style="margin-top: -25px;">
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
                            <v-row style="margin-top: -25px;">
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
                        <!-- 답변 -->
                        <v-row v-if="showResponseCard" style="margin-top: -25px;">
                            <v-col cols="12" md="2" class="custom-col-respond">
                                    <v-input>
                                        Respond
                                    </v-input>
                                </v-col>
                                <v-col cols="12" md="10">
                                    <v-textarea
                                        v-model="answer"
                                        outlined
                                        readOnly
                                    ></v-textarea>
                                </v-col>
                        </v-row>
                        <v-row class="justify-end">
                            <v-btn class="leftbtn" style="color: white;" color="#7A6C5B"
                            @click="$router.push({ name: 'QnaModComponent', params: { id: this.$route.params.id } })"
                            >Modify</v-btn>
                            <v-btn style="color: white;" color="#CFB18E"
                            @click="openDeleteDialog"
                            >Delete</v-btn>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <!-- 모달 -->
        <v-dialog v-model="dialog" max-width="400px">
            <v-card class="modal">
                <v-card-title>정말 삭제하시겠습니까?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="leftbtn" color="black" @click="deleteReservation">Yes</v-btn>
                    <v-btn color="black" @click="cancelDelete">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
     </v-container> 
    </div>
  </template>
  
  <script>
  import QnaView from '@/views/QnaView.vue';
  import axios from 'axios';
  export default {
    components: {
        QnaView
    },
    data() {
        return {
            service: "",
            title: "",
            contents: "",
            showResponseCard: false,
            answer: "",
            dialog:false
        }
    },
    created() {
        const qnaId = this.$route.params.id;
        this.fetchQnaDetail(qnaId);
    },
    methods: {
        async fetchQnaDetail(qnaId) {
            try {
                // qna detail
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/mypage/qna/detail/${qnaId}`);
                console.log(response.data);

                this.service = response.data.result.service;
                this.title = response.data.result.title;
                this.contents = response.data.result.contents;

                // 답변
                const respondYN = response.data.result.respond;
                if (respondYN == 'Y') {
                    console.log(respondYN);
                    this.showResponseCard = true;
                    this.answer = response.data.result.answer;
                }

            } catch(e) {
                if (e.response) {
                    console.error("Error Status:", e.response.status);  
                    console.error("Error Data:", e.response.data);  
                } else {
                    console.error("Error Message:", e.message);
                }
            }
        },
        openDeleteDialog() {
            this.dialog = true;
        },
        async deleteReservation() {
            try {
                const qnaId = this.$route.params.id;
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}/mypage/qna/delete/${qnaId}`);

                this.$router.push(`/mypage/qna/list`);
            } catch(e) {
                console.log(e);
            } finally {
                this.dialog = false; // 모달 닫기 
            }
        },
        cancelDelete() {
            this.dialog = false;
        }
        
    }
    
  }
  </script>
  
  <style scoped>
  .custom-title {
    /* font-family: "Playfair Display", serif; */
    font-family: "Noto Serif KR", serif;
    color: #787878;
    font-size:20px;
    border-bottom: 3px solid #787878;
    text-align: center;
  }
  .qna-container {
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

    padding-left:14%;
    padding-top: 10px;
    font-family: "Noto Serif KR", serif;
  }
  .qna-card {
    width:80%;
    padding: 20px;
    border: none;
    box-shadow: none;
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
  .custom-col-respond {
    padding-left: 45px;
    padding-top: 70px;
    color: #787878;
  }
  .leftbtn {
    margin-right: -8px;
  }
  </style>