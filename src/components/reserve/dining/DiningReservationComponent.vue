<template>
  <div>
    <DiningView />
    <v-container class="dining-contianer">
      <v-row justify="center">
        <v-col>
          <v-card style="padding-bottom: 20px; height: 600px;">
            <v-card-title class="text-center" style="font-family: Noto Serif KR, serif; font-size: 18px; color: #787878;">
              Dining Reservation
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="diningReservation">
                <v-table style="font-family: Noto Serif KR, serif;">
                  <thead>
                    <tr>
                      <th class="text-center">SELECT</th>
                      <th class="text-center">ADULT</th>
                      <th class="text-center">CHILD</th>
                      <th class="text-center">
                        <v-btn style="background-color: #7A6C5B; color: white;" @click="showCalendar">show Calendar</v-btn>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="button-group" style="padding-top: 10px;">
                        <v-btn v-bind:color="diningId===1 ? '#7A6C5B' : ''" class="custom-button" @click="selectDining(1)">Korea</v-btn>
                            <v-btn v-bind:color="diningId===2 ? '#7A6C5B' : ''" class="custom-button" @click="selectDining(2)">China</v-btn>
                            <v-btn v-bind:color="diningId===3 ? '#7A6C5B' : ''" class="custom-button" @click="selectDining(3)">Japan</v-btn>
                            <v-btn v-bind:color="diningId===4 ? '#7A6C5B' : ''" class="custom-button" @click="selectDining(4)">Lounge</v-btn>
                      </td>
                      <td style="padding-left: 63px; padding-top: 10px;">
                        <v-text-field type="number" v-model="adult" min="0" style="width: 70px;"></v-text-field>
                      </td>
                      <td style="padding-left: 55px; padding-top: 10px;">
                        <v-text-field type="number" v-model="child" min="0" style="width: 70px;"></v-text-field>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <v-card class="weatherview" style="margin-top: 30px; display: none; padding-bottom: 20px;">
                  <v-card-text>
                    <v-row>
                      <v-col cols="5" style="padding-left: 50px;">
                        <v-calendar
                          v-model="selectedDate"
                          :attributes="calendarAttributes"
                          is-range
                          is-month-picker
                          :style="{ width: '380px', height: '270px', border: '2px solid #7A6C5B', borderRadius: '7px' }"
                          @dayclick="handleDateChange"
                        />
                      </v-col>
                      <v-col cols="6" class="d-flex flex-column" >
                        <v-btn @click="openTimePicker" color="#FFFFFF"  
                        style="margin-bottom: 20px; border: 1px solid #7A6C5B; color: #7A6C5B; background-color: white; width:535px; margin-left: -1px "                        >
                          Select Time
                        </v-btn>

                        <!-- 시간 모델창 -->
                        <v-dialog v-model="timePickerVisible" max-width="450">
                          <v-card>
                            <v-card-title class="headline">Select Time</v-card-title>
                            <v-card-text>
                              <v-time-picker
                                v-model="timeInput"
                                format="24hr"
                                :color="'#7A6C5B'"
                                @input="updateTime"
                              />
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" text @click="saveTime">OK</v-btn>
                              <v-btn color="primary" text @click="closeTimePicker">Cancel</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>

                        <v-text-field
                          label="요청사항"
                          type="text"
                          required
                          v-model="comment"
                          style="height: 90px; margin-top: 20px;"
                        />
                      </v-col>
                    </v-row>
                    <v-row style="padding-left: 450px; padding-bottom: 10px; margin-top: -50px;">
                      <v-btn type="submit" class="text-center custom-btn" style="background-color: #7A6C5B; color: white;">Reservation</v-btn>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
  
  <script>
import axios from '@/axios';
import DiningView from '@/views/DiningView.vue';
import { jwtDecode } from 'jwt-decode';
import { VTimePicker } from 'vuetify/labs/VTimePicker'

export default {
  components: {
    DiningView,
    VTimePicker
  },
  data() {
    return {
      selectedDate: null,
      timeInput: '',
      calendarAttributes: [], 
      adult: 0,
      child: 0,
      diningId: null,
      comment: '',
      memberId: null, 
      decodedToken: null,
      timePickerVisible: false, // Time Picker Dialog visibility
    };
  },
  methods: {
    selectDining(id) {
      this.diningId = id;
    },
    showCalendar() {
      const elements = document.getElementsByClassName('weatherview');
      elements[0].style.display = 'block';
    },
    handleDateChange(date) {
      const today = new Date();
      this.selectedDate = date;
      console.log("Selected Date:", this.selectedDate);

      if (this.selectedDate < today) {
        alert("예약할 수 없는 날짜입니다.");
        this.selectedDate = null;
        return;
      }
    },
    openTimePicker() {
      this.timePickerVisible = true;
    },
    closeTimePicker() {
      this.timePickerVisible = false;
    },
    saveTime() {
      this.closeTimePicker();
      // `timeInput` will be updated with the selected time due to `v-model`
      console.log('Selected Time:', this.timeInput);
    },
    updateTime(time) {
      this.timeInput = time;
    },
    async diningReservation() {
      const token = localStorage.getItem('membertoken');
      console.log(token);

      if (!token) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        return;
      }

      const decodedToken = jwtDecode(token);
      this.memberId = decodedToken.id;
      console.log('Fetched Member ID:', this.memberId);

      if (!this.memberId) {
        alert("회원 정보를 불러오지 못했습니다. 다시 로그인해주세요.");
        return;
      }

      if (!this.diningId) {
        alert("다이닝 종류를 선택해주세요.");
        return;
      }

      if (!this.adult && !this.child) {
        alert("성인 또는 아동 인원을 입력해주세요.");
        return;
      }

      if (!this.selectedDate) {
        alert("날짜를 선택해주세요.");
        return;
      }

      if (!this.timeInput) {
        alert("예약 시간을 입력해주세요.");
        return;
      }

      const reservationDateTime = `${this.selectedDate.id}T${this.timeInput}:00`;

      const reservationData = {
        adult: this.adult,
        child: this.child,
        diningId: this.diningId,
        reservationDateTime: reservationDateTime,
        comment: this.comment,
        memberId: this.memberId,
      };

      console.log(localStorage.getItem('membertoken'));
      console.log(reservationData);

      try {
        await axios.post(`/reserve/dining/create`, reservationData);
        alert('예약이 완료되었습니다.');
        this.$router.push({
          path: '/reserve/dining/success',
          query: {
            diningId: this.diningId,
            adult: this.adult,
            child: this.child,
            reservationDateTime: reservationDateTime
          }
        });
      } catch (e) {
        if (e.response && e.response.data && e.response.data.error_message) {
          alert(`에러 발생: ${e.response.data.error_message}`);
        } else {
          alert("알 수 없는 에러가 발생했습니다. 다시 시도해주세요.");
        }
        console.log(e);
      }
    }
  },
};
</script>
  
  <style>
  .button-group {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0;
  }
  
  .custom-button {
    margin: 0 -5px;
  }
  
  .custom-btn {
    width: 540px; 
    height: 30px; 
  }
  
  html,
  body,
  #app,
  .v-application--wrap {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .dining-contianer {
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

  </style>
  
