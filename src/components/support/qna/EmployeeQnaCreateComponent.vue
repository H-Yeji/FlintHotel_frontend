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
                    <v-input>Service</v-input>
                  </v-col>
                  <v-col cols="12" md="10">
                    <v-text-field v-model="service" outlined readOnly></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="2" class="custom-col-title">
                    <v-input>Title</v-input>
                  </v-col>
                  <v-col cols="12" md="10">
                    <v-text-field v-model="title" outlined readOnly></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="2" class="custom-col-content">
                    <v-input>Content</v-input>
                  </v-col>
                  <v-col cols="12" md="10">
                    <v-textarea v-model="contents" outlined readOnly></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
              <v-card>
                <v-card-title class="custom-title">Answer</v-card-title>
                <br>
                <v-card-text>
                  <v-form>
                    <v-row>
                      <v-col cols="12" md="2" class="custom-col-content">
                        <v-input>Answer</v-input>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-textarea v-model="answer" outlined></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2" class="custom-col-title">
                        <v-input>Date</v-input>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field v-model="date" outlined></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2" class="custom-col-title">
                        <v-input>Time</v-input>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field v-model="time" outlined></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-row class="justify-end" style="padding-top: 55px;">
                <v-btn class="center" style="color: white; width:600px; margin-right:50px; font-size: 15px;" color="#7A6C5B" @click="submit">Submit</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
      date: "", // 날짜 입력
      time: "", // 시간 입력
      answer: "",
      answerTime: "" // 날짜와 시간 합친 값
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
      } catch (e) {
        console.log(e);
      }
    },
    async submit() {

    if (!this.date || !this.time) {
      alert('날짜와 시간을 입력해주세요.');
      return;
    }

      const id = this.$route.params.id;
      try {
        // 날짜와 시간 합치기
        this.answerTime = `${this.date}T${this.time}:00`;

        const params = {
          answer: this.answer,
          answerTime: this.answerTime
        };
        console.log("params:", params);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/employee/qna/answer/create/${id}`, params);
        console.log("response:", response);

        // submit 성공하면 detail로 보내기
        this.$router.push(`/employee/qna/detail/${id}`);
      } catch (e) {
        console.log("Error:", e.response ? e.response.data : e.message);
      }
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
  width: 80%;
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
  margin-right: -8px;
}
</style>
