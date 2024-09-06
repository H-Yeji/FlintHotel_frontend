<template>
    <QnaView />
    <v-container class="qna-container">
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="qna-card">
                    <v-card-title class="custom-title">QnA 수정</v-card-title>
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
                                    <v-select
                                    :items="service"
                                    v-model="selectedSerivce"
                                    outlined
                                    ></v-select>
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
                                    ></v-textarea>
                                </v-col>
                            </v-row> 
                        </v-form>
                        <v-row class="justify-end">
                            <v-btn class="leftbtn" style="color: white;" color="#7A6C5B"
                            @click="openModiDialog">Submit</v-btn>
                            <v-btn style="color: white; margin-right: 10px;" color="#CFB18E" @click="back()">Cancel</v-btn>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 모달 -->
        <v-dialog class="modal" v-model="dialog" max-width="400px">
            <v-card class="modal">
                <v-card-title>수정을 완료하시겠습니까?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="leftbtn" color="black" @click="modQna">Yes</v-btn>
                    <v-btn color="black" @click="cancelModify">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
     </v-container> 
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
            title: "",
            contents: "",

            service: ["Room", "Lounge", "KorDining", "ChiDining", "JapDining"],
            selectedSerivce: null,
            dialog: false,
        }
    },
    created() {
        const qnaId = this.$route.params.id;
        this.fetchQnaDetail(qnaId);
    },
    methods: {
        async fetchQnaDetail(qnaId) {
            try {
                const token = localStorage.getItem('membertoken');
                const headers = {Authorization: `Bearer ${token}`};

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/mypage/qna/detail/${qnaId}`, {headers});
                console.log(response);

                this.selectedSerivce = response.data.result.service;
                this.title = response.data.result.title;
                this.contents = response.data.result.contents;

            } catch(e) {
                if (e.response) {
                    console.error("Error Status:", e.response.status);  
                    console.error("Error Data:", e.response.data); 
                    alert(e.response.error_message);
                } else {
                    console.error("Error Message:", e.message);
                }
            }
        },
        openModiDialog() {
            this.dialog = true;
        },
        async modQna() {
            try {
                const qnaId = this.$route.params.id;
                const params = {
                    service: this.selectedSerivce,
                    title: this.title,
                    contents: this.contents
                }
                console.log("params임: ", params);

                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/mypage/qna/update/${qnaId}`, params);
                console.log(response);

                setTimeout(() => {
                    alert("QnA 수정이 완료되었습니다.");
                    this.$router.push(`/mypage/qna/detail/${qnaId}`);
                }, 100);

                // alert("QnA 수정이 완료되었습니다.");
                // this.$router.push(`/mypage/qna/detail/${qnaId}`);
            } catch(e) {
                if (e.response) {
                    console.error("Error Status:", e.response.status);  
                    console.error("Error Data:", e.response.data); 
                    alert(e.response.data.error_message);
                } else {
                    console.error("Error Message:", e.message);
                }
            } finally {
                this.dialog = false;
            }
        },
        cancelModify() {
            this.dialog = false;
        },
        async back() {
            const qnaId = this.$route.params.id;
            this.$router.push(`/mypage/qna/detail/${qnaId}`);
        }
    }
    
  }
  </script>
  
  <style scoped>
  .custom-title {
    font-family: "Playfair Display", serif;
    /* font-family: "Noto Serif KR", serif; */
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
  .leftbtn {
    margin-right: 5px;
  }
  .modal {
    padding: 20px;
    font-family: "Noto Serif KR", serif;
    }
  </style>