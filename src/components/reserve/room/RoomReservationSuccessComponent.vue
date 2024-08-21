<template>
<div>
  <FlintView />
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
              <v-card-title class="confirmation-title">예약 확인</v-card-title>
              <br>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h3 class="section-title">○ 고객 정보</h3>
                    <!-- 고객정보 -->
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">First name</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="firstName"
                          outlined
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Last name</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="lastName"
                          outlined
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Email</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="email"
                          outlined
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Phone num</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="phoneNumber"
                          outlined
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
    
                  <v-col cols="12" md="6">
                    <h3 class="section-title">○ 예약 정보</h3>
                    <!-- 예약정보 -->
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Check in</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="checkInDate"
                          outlined
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Check out</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="checkOutDate"
                          outlined
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="3">
                        <div class="data-label">Room Type</div>
                      </v-col>
                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model="roomType"
                          outlined
                          readonly
                        ></v-text-field>
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
  import FlintView from '@/views/FlintView.vue';
  import axios from '@/axios';

  export default {
    components: {
      FlintView
    },
    data() {
      return {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",

        checkInDate:"",
        checkOutDate:"",
        roomType: "",
        id:"",
      };
    },
    created(){
      this.id = this.$route.params.id;
      console.log(this.id)
    },
    mounted() {
      this.memberInfo()
      this.reservationInfo()
    },
    methods: {
      async memberInfo() {
        try {
          const response = await axios.get(`/member/detail`);
          console.log(response.data);

          this.firstName = response.data.result.firstName;
          this.lastName = response.data.result.lastName;
          this.email = response.data.result.email;
          this.phoneNumber = response.data.result.phoneNumber;

        } catch(e) {
          if (e.response) {
              console.error("Error Status:", e.response.status);  
              console.error("Error Data:", e.response.data);  
          } else {
              console.error("Error Message:", e.message);
          }
        }
      },
      async reservationInfo() {
        try {
          const response = await axios.get(`/reserve/room/detail/${this.id}`);
          const reservations = response.data.result;
          console.log(reservations)
          this.checkInDate = reservations.checkInDate;
          this.checkOutDate = reservations.checkOutDate;
          this.roomType = reservations.roomType;
        } catch(e) {
          if (e.response) {
              console.error("Error Status:", e.response.status);  
              console.error("Error Data:", e.response.data);  
          } else {
              console.error("Error Message:", e.message);
          }
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
    margin-top: 50px;
    color: #787878;
    font-family: "Noto Serif KR", serif;
    font-optical-sizing: auto;
  }
  
  .reservation-content p {
    color: #787878;
    font-family: "Noto Serif KR", serif;
  }
  
  .confirmation-card {
    margin-top: 15px;
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