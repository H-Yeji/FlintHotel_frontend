<template>
    <div>
    <FlintView />
    <v-container class="reserve-contianer">
        <br>
        <h3 style="text-align:center;">{{ roomType }}</h3>
        <br>
        <v-container class="innerContainer">
            <v-row>
            <v-col>
                <v-container style="text-align:center; margin-left: 30px;">
                    <v-img :src="imagePath" style="height:200px; width:auto;"></v-img>
                    <!-- 🛏️🛏️🛏️<br>여기는<br>이미지<br>자리임<br>🛏️🛏️🛏️  -->
                </v-container>
                <v-card  class="descriptionCard" style="margin-left: 30px;">
                        <v-row>
                            <v-col>
                                <v-card class="info">
                                    <v-card-title style="font-size: 16px; padding-top:20px;">&nbsp;&nbsp;○ 기본정보</v-card-title>
                                    <v-card-text style="padding-top: 15px; padding-left: 30px; padding-right: 30px;">
                                        {{ roomDetails[roomType].basicInfo }}
                                    </v-card-text>
                                </v-card>
                            </v-col> 
                        </v-row>
                    </v-card> 
        
                    <v-card  class="descriptionCard" style="margin-left: 30px; padding-top:10px;">
                        <v-row>
                            <v-col>
                                <v-card class="info">
                                    <v-card-title style="font-size: 16px; padding-top:20px;">&nbsp;&nbsp;○ 편의시설</v-card-title>
                                    <v-card-text style="padding-top: 15px; padding-left: 30px; padding-right: 30px;">
                                        {{ roomDetails[roomType].amenities }}
                                    </v-card-text>
                                </v-card>
                            </v-col> 
                        </v-row>
                    </v-card>  
            </v-col>

            <!-- 수직선 -->
            <v-col cols="2" class="vertical-line-container">
                <div class="vertical-line"></div>
            </v-col>

            <v-col style="padding-right:30px; width:100%;">
                <!-- 옵션 사항 -->
                <v-card class="optionsCard">
                    <v-card-title style="font-size: 16px; padding-top:20px; padding-bottom:10px;">○ 옵션 사항</v-card-title>
                    <v-card-text style="padding-top: 15px;">
                        <v-row>
                            <v-col cols="5" style="padding-left:10px;">
                                <div>성인 조식/50,000원</div>
                            </v-col>
                            <v-col cols="7" class="d-flex align-center" style="padding-left:20px;">
                                <v-btn icon @click="decrementAdultBreakfast">-</v-btn>
                                <span style="padding: 0 8px;">{{ adultBreakfastCount }}</span>
                                <v-btn icon @click="incrementAdultBreakfast">+</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="5" style="padding-left:10px;">
                                <div>어린이 조식/35,000원</div>
                            </v-col>
                            <v-col cols="7" class="d-flex align-center" style="padding-left:20px;">
                                <v-btn icon @click="decrementChildBreakfast">-</v-btn>
                                <span style="padding: 0 8px;">{{ childBreakfastCount }}</span>
                                <v-btn icon @click="incrementChildBreakfast">+</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6" style="padding-left:10px;">
                                <div>주차 [{{ parkingYN === 'Y' ? '예' : '아니오' }}]</div>
                            </v-col>
                            <v-col cols="6" class="d-flex align-center">
                                <v-radio-group v-model="parkingYN" row>
                                    <v-radio label="예" value="Y"></v-radio>
                                    <v-radio label="아니오" value="N"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <!-- 요청사항 -->
                    <v-card-title style="font-size: 16px; padding-top:10px;">○ 요청 사항</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="requestContents" outlined rows="2" placeholder="요청 사항을 입력하세요." style="font-size:14px;"></v-textarea>
                    </v-card-text>
                </v-card>
            </v-col>
            </v-row>
        </v-container>
        <v-container class="innerContainer">
            <v-row justify="end">
                <v-col cols="auto">
                    <div style="padding-top:15px;">{{ formatPrice(totalPrice) }}원</div>
                </v-col>
                <v-col cols="auto">
                    <v-btn @click="createReservation" class="submit-btn" style="height: 50px; width: 70%;">Submit</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</div>
</template>
    
    <script>
    import FlintView from '@/views/FlintView.vue';
    import axios from 'axios';
    export default {
      components: {
        FlintView
      },
      data() {
        return {    
          roomType: "",
          roomDetails: {
            "DELUXE": {
                basicInfo: "디럭스룸은 푹신한 퀸 사이즈 침대를 갖춘 20m² 규모의 편안한 거실 공간을 제공합니다. 이 객실은 편안함과 기능성의 균형을 제공하도록 세심하게 디자인되었으며, 현대적인 장식과 사려 깊은 손길로 귀하의 숙박을 향상시킵니다.",
                amenities: "에어컨, 해외 채널을 시청할 수 있는 텔레비전, 무료 고속 Wi-Fi, 프라이버시를 위해 강화된 방음 시설"
            },
            "PREMIER_DELUXE": {
                basicInfo: "30m² 이상 확장되는 프리미어 디럭스룸은 고급스러운 킹 사이즈 침대와 추가 좌석을 위한 아늑한 소파를 갖추고 있어 한층 더 높은 경험을 제공합니다. 이 공간은 현대적인 미학과 고급 가구로 세심하게 디자인되어 휴식이나 업무에 이상적입니다.",
                amenities: "개별 온도 조절, 50인치 평면 TV, 개인 미니 냉장고, 디자이너 세면도구를 포함한 고급 욕실용품, 업그레이드된 가구를 갖춘 추가 좌석 공간"
            },
            "GRAND_SUITE": {
                basicInfo: "그랜드 스위트룸은 73m²의 인상적인 면적을 차지하며 별도의 거실과 침실 공간을 갖추고 있습니다. 이 스위트룸은 우아한 장식과 레저 및 비즈니스 여행객 모두를 만족시키는 현대적인 편의 시설을 갖추고 있어 여유로운 공간과 고급스러움을 원하는 고객에게 적합합니다.",
                amenities: "풀서비스 주방, 대형 평면 TV, 무료 초고속 인터넷, 전용 자쿠지, 프리미엄 침구와 고급 가구"
            },
            "ROYAL_SUITE": {
                basicInfo: "로열 스위트룸은 100m²가 넘는 공간에서 장엄한 경험을 제공하며, 비교할 수 없는 럭셔리함과 프라이버시를 제공하도록 설계된 별도의 생활 공간과 침실 공간을 갖추고 있습니다. 이 스위트룸은 고급 가구와 예술 작품으로 장식되어 있어 고급스럽고 우아한 분위기를 연출합니다.",
                amenities: "최첨단 주방 시설, 대형 울트라 HD TV, 고급 고속 인터넷 연결, 탁 트인 전망을 감상할 수 있는 객실 내 자쿠지, 자연광이 들어오는 천장부터 바닥까지 내려오는 대형 창문을 통한 뛰어난 전망"
            },
            "FLINT_SUITE": {
                basicInfo: "럭셔리의 정점인 플린트 스위트는 353m² 규모로 독특한 가구와 고급 예술품으로 세심하게 디자인되었습니다. 이 스위트룸은 세심하게 분리된 거실과 침실 공간을 갖춘 세련된 안식처를 제공하며 비교할 수 없는 고급스러움과 맞춤 서비스를 제공합니다.",
                amenities: "완비된 고급 주방, 대형 스크린 TV를 갖춘 엔터테인먼트 시스템, 원활한 연결을 위한 고속 인터넷, 최고의 휴식을 위한 전용 자쿠지 및 실내 사우나, 전담 집사 서비스는 연중무휴 24시간 제공"
            }
        },
          adultBreakfastCount: 0,
          childBreakfastCount: 0,
          parkingYN: "N",
          requestContents: "",
          totalPrice: 0,
          basePrice: 0
        };
      },
      created() {
        const room = localStorage.getItem('selectedRoom');
        if (room) {
            const parseRoom = JSON.parse(room);
            this.roomType = parseRoom.roomTypeName;
            this.imagePath = parseRoom.imagePath;
        }
      },
      mounted() {
        this.getPrice();
      },
      methods: {
        incrementAdultBreakfast() {
            this.adultBreakfastCount++;
            this.updateTotalPrice();
        },
        decrementAdultBreakfast() {
            if (this.adultBreakfastCount > 0) {
                this.adultBreakfastCount--;
                this.updateTotalPrice();
            }
        },
        incrementChildBreakfast() {
            this.childBreakfastCount++;
            this.updateTotalPrice();
        },
        decrementChildBreakfast() {
            if (this.childBreakfastCount > 0) {
                this.childBreakfastCount--;
                this.updateTotalPrice();
            }
        },
        updateTotalPrice() {
            const adultBreakfastTotal = this.adultBreakfastCount * 50000;
            const childBreakfastTotal = this.childBreakfastCount * 35000;
            this.totalPrice = this.basePrice + adultBreakfastTotal + childBreakfastTotal;
        },
        async getPrice() {
            try {
                const token = localStorage.getItem('membertoken');
                const checkInDate = localStorage.getItem('checkInDate');
                const checkOutDate = localStorage.getItem('checkOutDate');
                const adultCnt = localStorage.getItem('numAdults');
                const childCnt = localStorage.getItem('numChildren');

                // 역직렬화해서 roomId 가져오기 
                const selectedRoom = localStorage.getItem('selectedRoom');
                let roomId = null;
                if (selectedRoom) {
                    const parseRoom = JSON.parse(selectedRoom);
                    roomId = parseRoom.roomId;
                    console.log(roomId);
                } else {
                    console.log('no room');
                }

                const headers = { Authorization: `Bearer ${token}` };
                const params = {
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    adultCnt: adultCnt,
                    childCnt: childCnt,
                    roomId: roomId
                };
                console.log("params: ", params);

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reserve/room/getPrice`, {params, headers});
            
                console.log(response);
                this.basePrice = response.data;
                this.updateTotalPrice();

            } catch(e) {
                console.log(e);
            }
        },
        formatPrice(price) {
            const truncatedPrice = Math.floor(price / 1000) * 1000;
            return truncatedPrice.toLocaleString();
        },
        async createReservation() {
            
            try {
                const token = localStorage.getItem('membertoken');
                const checkInDate = localStorage.getItem('checkInDate');
                const checkOutDate = localStorage.getItem('checkOutDate');
                const adultCnt = localStorage.getItem('numAdults');
                const childCnt = localStorage.getItem('numChildren');

                // 역직렬화해서 roomId 가져오기 
                const selectedRoom = localStorage.getItem('selectedRoom');
                let roomId = null;
                if (selectedRoom) {
                    const parseRoom = JSON.parse(selectedRoom);
                    roomId = parseRoom.roomId;
                    console.log(roomId);
                } else {
                    console.log('no room');
                }

                const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };         
                const data = {
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    adultCnt: adultCnt,
                    childCnt: childCnt,
                    roomId: roomId,
                    adultBreakfastCount: this.adultBreakfastCount,
                    childBreakfastCount: this.childBreakfastCount,
                    parkingYN: this.parkingYN,
                    requestContents: this.requestContents
                };
                console.log(JSON.stringify(data));

                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reserve/room`, data, {headers});
                console.log("예약 성공");
                console.log(response.data.result);

                // localstorage에 예약정보 클리어
                localStorage.removeItem('checkInDate');
                localStorage.removeItem('checkOutDate');
                localStorage.removeItem('numAdults');
                localStorage.removeItem('numChildren');
                localStorage.removeItem('selectedRoom');
                this.$router.push(`/reserve/room/success/` + response.data.result.id);
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
      flex-direction: column;
      padding-left:40px;
      padding-right:40px;
    }

    .reserve-contianer h3 {
        font-family: "Playfair Display", serif;
        color: #787878;
    }
    .descriptionCard {
        border: none; 
        box-shadow: none;
        width: 100%;
    }
    .info {
        background-color: #F4F4F4;
    }
    .innerContainer {
        font-family: "Noto Serif KR", serif;
        border-top: 3px solid #928E8E; /* 테두리 두께와 색상 설정 */
    }
    .vertical-line-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 0;
        margin: 0 auto;
    }
    .vertical-line {
        width: 0.8px;
        height: 95%;
        background-color: #C6CBD5;
    }
    .submit-btn {
        max-width: 200px; 
        border-radius: 5px;
        color: white; 
        background-color: #7A6C5B;
        transition: background-color 0.3s ease; 
    }
    .optionsCard {
        width: 110%; 
        margin-left: -30px; 
        margin-top: 20px;
        padding-left: 10px; 
        padding-right: 10px; 
    }

    .v-col {
        margin-left: 0px; 
        padding-left: 0px; 
    }

</style>