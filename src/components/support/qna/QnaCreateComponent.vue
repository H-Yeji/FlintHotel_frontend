<template>
    <div>
    <QnaView />
    <v-container class="qna-container">
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="qna-card">
                    <v-card-title class="custom-title">QnA 작성</v-card-title>
                    <br>
                    <v-card-text>
                        <v-form>
                            <!-- 서비스 선택 -->
                             <v-select
                             :items="service"
                             label="서비스를 선택하세요."
                             v-model="selectedSerivce"
                             outlined
                             ></v-select>
                            <!-- title -->
                            <v-text-field
                                label="Title"
                                v-model="title"
                                required>
                            </v-text-field>
                            <!-- content -->
                            <v-textarea
                                label="Contents"
                                v-model="contents"
                                rows="10"
                                required
                                ></v-textarea>  
                        </v-form>
                        <v-btn class="submitbtn" @click="submit()" style="color: white; font-size: 15px;" color="#7A6C5B" block>Submit</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
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
            service: ["Room", "Lounge", "KorDining", "ChiDining", "JapDining"],
            selectedSerivce: null,
            title: "",
            contents: ""
        }
    },
    created() {
        
    },
    methods: {
        async submit() {
            try {
                const params = {
                    service: this.selectedSerivce,
                    title: this.title,
                    contents: this.contents
                }
                console.log("params임: ", params);
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/mypage/qna/create`, params);
                console.log(response);

                // submit 성공하면 list로 보내기
                this.$router.push('/mypage/qna/list');
                
            } catch(e) {
                if (e.response) {
                    console.error("Error Status:", e.response.status);  
                    console.error("Error Data:", e.response.data); 
                    alert(e.response.data.error_message);
                } else {
                    console.error("Error Message:", e.message);
                }
            }
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

    padding-left:14%;
    padding-top: 10px;
  }
  .qna-card {
    width:80%;
    padding: 20px;
  }
  .submitbtn {
    
  }
  </style>