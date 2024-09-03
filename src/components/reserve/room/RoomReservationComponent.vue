<template>
<div>
  <FlintView />
  <v-container class="reserve-contianer">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-center custom-title">Room Reservation</v-card-title>
          <v-card-text>
            <v-row justify="center" align="center">
  
              <v-col cols="12" md="2">
                <div class="date-label">Select hotel</div>
                <v-select :items="hotels" label="선택하세요." class="mx-2" outlined v-model="selectedLocation" ></v-select>
              </v-col>
              <!-- check in -->
              <v-col cols="12" md="2">
                <div class="date-label">Check In</div> 
                <v-menu
                  v-model="menuCheckIn"
                  :close-on-content-click="false"
                  :nudge-left="80" 
                  :nudge-bottom="20" 
                  transition="scale-transition"
                  offset-y
                  attach
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-bind="attrs"
                      v-on="on"
                      :value="formattedCheckInDate"
                      readonly
                      @click="menuCheckIn = true"
                      placeholder="Select date"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="checkInDate"
                    @click="closeCheckInMenu"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- check out -->
              <v-col cols="12" md="2">
                <div class="date-label">Check Out</div> 
                <v-menu
                  v-model="menuCheckOut"
                  :close-on-content-click="false"
                  :nudge-left="80" 
                  :nudge-bottom="20" 
                  transition="scale-transition"
                  offset-y
                  attach
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-bind="attrs"
                      v-on="on"
                      :value="formattedCheckOutDate"
                      readonly
                      @click="menuCheckOut = true" 
                      placeholder="Select date"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="checkOutDate"
                    @click="closeCheckOutMenu"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="2">
                <div class="date-label">Adult</div> 
                  <v-text-field type="number" outlined class="mx-2" v-model="numAdults" min="1" ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <div class="date-label">Child</div> 
                  <v-text-field type="number" outlined class="mx-2" v-model="numChildren" min="1" ></v-text-field>
              </v-col>
              <v-col cols="12" md="2" class="d-flex align-center justify-center">
                <v-btn class="custom-search-btn mx-2" style="height: 50px; width: 70%; background-color: #7A6C5B; color: white;" @click="searchRooms">Search</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 객실 목록 -->
        <v-row v-if="showRoom">
          <v-col>
            <v-card>
              <v-card-text class="selectCard">
                <v-table>
                  <thead>
                    <tr>
                      <th style="padding-left: 50px;">Room Image</th>
                      <th style="padding-left: 50px;">Room Name</th>
                      <th style="padding-left: 50px;">Room Base Price</th>
                      <th style="padding-left: 50px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(room, index) in roomList" :key="index">
                      <td style="padding-left: 50px;">
                        <v-img :src="room.imagePath" style="height:100px; width:auto;"></v-img>
                      </td>
                      <td style="padding-left: 50px;">{{ room.roomTypeName }}</td>
                      <td style="padding-left: 50px;">{{ room.roomPrice.toLocaleString() }}원 ~</td>
                      <td style="padding-left: 50px;">
                        <v-btn @click="selectRoom(index)" style="color: white;" color="#CFB18E">Select</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row> 
      </v-col>
    </v-row>
  </v-container>
</div>
</template>
  
  <script scoped>
  import FlintView from '@/views/FlintView.vue';
  import dayjs from 'dayjs';
  import axios from '@/axios';

  export default {
    components: {
      FlintView // flintView 가져와 사용 
    },
    name: "RoomReservationComponent",
    data() {
      return {
        hotels: ["Seoul"], 
        selectedLocation: null,

        checkInDate: null,
        checkOutDate: null,
        menuCheckIn: false,
        menuCheckOut: false,

        numAdults: 0, 
        numChildren: 0,
        roomList:[],
        showRoom: false
      };
    },
    computed: {
      formattedCheckInDate() {
        return this.checkInDate ? dayjs(this.checkInDate).format('YYYY-MM-DD') : '';
      },
      formattedCheckOutDate() {
        return this.checkOutDate ? dayjs(this.checkOutDate).format('YYYY-MM-DD') : '';
      },
    },
    methods: {
      closeCheckInMenu() {
        this.menuCheckIn = false;
      },
      closeCheckOutMenu() {
        this.menuCheckOut = false;
      },
      async searchRooms() {
        const params = {
          checkInDate: this.formattedCheckInDate,
          checkOutDate: this.formattedCheckOutDate,
          adultCnt: this.numAdults, // 인원수 추가 (제한걸기 위해서)
          childCnt: this.numChildren
        };

        try {
          const response = await axios.get(`/reserve/room/remain`, {params});
          console.log(response);
          this.roomList = response.data;

          this.showRoom = true;
        } catch (e) {
          if (e.response) {
                    console.error("Error Status:", e.response.status);  
                    console.error("Error Data:", e.response.data); 
                    alert(e.response.data.error_message);
                } else {
                    console.error("Error Message:", e.message);
                }
        }
      },
      selectRoom(index) {
        const selectedRoom = this.roomList[index];

        // 체크인/아웃 날짜, 성인/아이 수, 선택한 방정보 localstorage에 저장 
        localStorage.setItem('checkInDate', this.formattedCheckInDate);
        localStorage.setItem('checkOutDate', this.formattedCheckOutDate);
        localStorage.setItem('numAdults', this.numAdults);
        localStorage.setItem('numChildren', this.numChildren);

        // 선택한 방 정보 -> 직렬화해서 localstorage에 넣기 
        localStorage.setItem('selectedRoom', JSON.stringify({
          roomId: selectedRoom.roomId,
          roomTypeName: selectedRoom.roomTypeName,
          roomPrice: selectedRoom.roomPrice,
          imagePath: selectedRoom.imagePath
        }));

        this.$router.push('/reserve/room/description');
        
      }
    }
  };
  </script>
  
<style>
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
  
  .custom-title {
    font-family: "Noto Serif KR", serif;
    color: #787878;
    font-size:18px;
  }
  
  .custom-search-btn {
    max-width: 200px; 
    border-radius: 5px;
    color: white; 
    background-color: #7A6C5B;
    transition: background-color 0.3s ease; 
  }
  .date-label {
    font-family: "Noto Serif KR", serif;
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 4px;
    color: #787878;
    margin-left: 8px;
    display: block; 
    text-align: left; 
  }
  .mx-2 {
    margin-left: 6px !important;
    margin-right: 6px !important;
  }

  .v-card-text {
    padding: 0 8px; /* Reduced padding */
  }
  .v-card {
    overflow: visible !important;
  }
  .selectCard {
    font-family: "Noto Serif KR", serif;
  }
  
</style>