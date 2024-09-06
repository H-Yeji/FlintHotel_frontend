<template>
  <div>
    <DiningView />
    <v-container class="reserve-contianer">
      <v-row>
        <v-col>
          <div class="reservation-content">
            <h1 class="text-center">예약이 완료되었습니다.</h1>
            <p class="text-center">감사합니다.</p>
          </div>
          <br>
          <v-col cols="12" class="d-flex justify-center">
            <br>
            <v-card class="confirmation-card" style="width:1100px">
              <v-card-title class="confirmation-title" style=" padding-bottom: 20px;">예약 확인</v-card-title>
              <br>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h3 class="section-title">○ 고객 정보</h3>
                    <!-- 고객정보 -->
                    <v-row>
                      <v-col cols="12" md="2">
                        <div class="data-label">Name</div>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field v-model="name" outlined readonly></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="2">
                        <div class="data-label">Email</div>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field v-model="email" outlined readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2">
                        <div class="data-label">Phone num</div>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field v-model="phoneNumber" outlined readonly></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="6">
                    <h3 class="section-title">○ 예약 정보</h3>
                    <!-- 예약정보 -->
                    <v-row>
                      <v-col cols="12" md="2">
                        <div class="data-label">Dining</div>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field v-model="diningName" outlined readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2">
                        <div class="data-label">Adult Child</div>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field :value="`성인 : ${adult}명    아이 : ${child}명`" outlined readonly></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="2">
                        <div class="data-label">Date Time</div>
                      </v-col>
                      <v-col cols="12" md="10">
                        <v-text-field :value="`날짜 : ${reservationDate}    시간 : ${reservationTime}`" outlined
                          readonly></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DiningView from '@/views/DiningView.vue';
import axios from 'axios';

export default {
  components: {
    DiningView
  },
  data() {

    const reservationDateTime = this.$route.query.reservationDateTime || '';
    const [date, time] = reservationDateTime.split('T');

    return {
      name: "",
      email: "",
      phoneNumber: "",
      diningId: this.$route.query.diningId,
      adult: this.$route.query.adult,
      child: this.$route.query.child,
      reservationDate: date || '', // 날짜
      reservationTime: time || '', // 시간
      diningName: ""
    };
  },
  mounted() {
    this.member()
    this.dining()
  },
  methods: {
    async member() {

      const token = localStorage.getItem('membertoken');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member/detail`, { headers });
        console.log(response.data);

        this.name = response.data.result.lastName + response.data.result.firstName;
        this.email = response.data.result.email;
        this.phoneNumber = response.data.result.phoneNumber;

      } catch (e) {
        alert(e.response ? e.response.data.error_message : e.message)
        console.log(e);
      }
    },
    async dining() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dining/${this.diningId}`);
        console.log('Dining response:', response);

        this.diningName = response.data.result;

      } catch (e) {
        alert(e.response ? e.response.data.error_message : e.message)
        console.log(e);
      }
    }
  }
};
</script>


<style scoped>
html,
body,
#app,
.v-application--wrap {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.reserve-contianer {
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
}

.reservation-content h1 {
  margin-top: 20px;
  color: #787878;
  font-family: "Noto Serif KR", serif;
  font-optical-sizing: auto;
}

.reservation-content p {
  color: #787878;
  font-family: "Noto Serif KR", serif;
}

.confirmation-card {

  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-family: "Noto Serif KR", serif;
}

.confirmation-title {
  font-size: 20px;
  font-weight: bold;
  color: #787878;
  text-align: center;
  border-bottom: 3px solid #787878;
  font-family: "Noto Serif KR", serif;

}

.section-title {
  font-size: 17px;
  font-weight: bold;
  color: #787878;
  padding-left: 17px;
  padding-bottom: 20px;
  font-family: "Noto Serif KR", serif;
}

.input-field {
  margin-bottom: 10px;
}

.v-radio-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-direction: row;
}

.v-radio {
  margin-right: 10px;
}

.v-card-title {
  padding: 0;
  margin: 0;
}

.data-label {
  font-size: 14px;
  font-weight: bold;
  color: #787878;
  display: flex;
  height: 100%;
  padding-top: 20px;
  padding-left: 20px;
}
</style>