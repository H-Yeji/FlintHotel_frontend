<template>
    <v-app>
        <v-main>
            <QnaView />
            <v-container class="reserve-container">
                <v-row justify="center">
                    <MypageComponent />
                    <v-col cols="9" justify="center">
                        <v-card-title class="custom-title">
                            <v-text style="font-size : 45px; color:  #69586F">Detail</v-text>
                            <v-col>
                                <v-card-text class="cardText">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <!-- 왼쪽 열 -->
                                            <v-row>
                                                <v-col cols="12" md="4">
                                                    <div class="data-label">Room Type</div>
                                                </v-col>
                                                <v-col cols="12" md="8">
                                                    <v-text-field v-model="roomType" readonly></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="4">
                                                    <div class="data-label">Check In</div>
                                                </v-col>
                                                <v-col cols="12" md="8">
                                                    <v-text-field v-model="checkin" readonly></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="4">
                                                    <div class="data-label">Check out</div>
                                                </v-col>
                                                <v-col cols="12" md="8">
                                                    <v-text-field v-model="checkout" readonly></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="4">
                                                    <div class="data-label">People</div>
                                                </v-col>
                                                <v-col cols="12" md="8">
                                                    <v-text-field v-model="people" readonly></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="4">
                                                    <div class="data-label">Parking</div>
                                                </v-col>
                                                <v-col cols="12" md="8">
                                                    <v-text-field v-model="parking" readonly></v-text-field>
                                                </v-col>
                                            </v-row>

                                        </v-col>
                                        <!-- 오른쪽 열 -->
                                        <v-col cols="12" md="6">

                                            <v-row>
                                                <v-col cols="12" md="5">
                                                    <div class="data-label">Breakfast Yn</div>
                                                </v-col>
                                                <v-col cols="12" md="7">
                                                    <v-text-field v-model="bf" readonly></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="5">
                                                    <div class="data-label">PayMent</div>
                                                </v-col>
                                                <v-col cols="12" md="7">
                                                    <v-text-field v-model="payment" readonly></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="3">
                                                    <div class="data-label">Request</div>
                                                </v-col>
                                                
                                                <v-col cols="12" md="12" style="padding-left: 30px;">
                                                    <v-textarea v-model="requestMsg" readonly></v-textarea>
                                                </v-col>
                                            </v-row>
                                            <v-row class="justify-end text-align: right" style="padding-right: 20px;">
                                                <v-btn @click="openDeleteDialog" style="color:#69586F; border: 0.5px solid #69586F; font-size: 15px;">
                                                    DELETE
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-col>
                        </v-card-title>
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
        </v-main>
    </v-app>
</template>

<script>
import QnaView from '../QnaView.vue';
import MypageComponent from '@/components/MypageComponent.vue';
import axios from 'axios';

export default {
    components: {
        QnaView,
        MypageComponent,
    },
    created() {
        const reserveId = this.$route.params.id;
        this.reserveId = reserveId
        this.fetchReserveDetail(reserveId);
    },
    data() {
        return {
            reserveId:"",
            roomDetail: [],
            roomType:"",
            checkin:"",
            checkout:"",
            people:"",
            parking:"",
            bf:"",
            payment:"",
            requestMsg:"",
            dialog: false
        }
    },
    methods: {
        async fetchReserveDetail(reserveId) {
            try {
                // qna detail
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reserve/room/detail/${reserveId}`);
                console.log(response.data);
                this.roomDetail = response.data.result
                console.log(this.roomDetail)
                this.roomType = this.roomDetail.roomType;
                this.checkin = this.roomDetail.checkInDate;
                this.checkout = this.roomDetail.checkOutDate;
                this.people = this.roomDetail.adultCnt + this.roomDetail.childCnt
                this.parking = this.roomDetail.parkingYN;
                this.bf = this.roomDetail.adultBfCnt + this.roomDetail.childBfCnt
                this.payment = this.roomDetail.payment;
                this.requestMsg = this.roomDetail.requestContents;
            } catch (e) {
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
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reserve/room/cancel/${this.reserveId}`);
                console.log(response.data);
                
                this.$router.push(`/mypage/room`);
            } catch(e) {
                console.log(e);
            } finally {
                this.dialog = false; // 모달 닫기 
            }
        },
        cancelDelete() {
            this.dialog = false;
        }
        // async deleteReserve(){
        //     console.log(this.reserveId)
        //     try{
        //     const response = await axios.get(`/reserve/room/cancel/${this.reserveId}`)
        //     console.log(response)
        //     alert("삭제 완료 되었습니다.")
        //     this.$router.push({ name: "MypageRoom" });
        //     }catch(e){
        //         alert(e)
        //     }
        // }
    }
}
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
    /* Prevents overall page scrolling */
}

.background-image {
    background-image: url("@/assets/image.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.custom-title {
    font-family: "Noto Serif KR", serif;
    color: #787878;
    font-size: 20px;
}

.custom-title h1,
ul li {
    font-family: "Noto Serif KR", serif;
    border-bottom: 4px solid;
    color: black;
}

.reserve-container {
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
    margin-top: 10px;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
}

.confirmation-title {
    font-size: 16px;
    font-weight: bold;
    color: #787878;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.section-title {
    font-size: 15px;
    font-weight: bold;
    color: #787878;
    margin-bottom: 8px;
}

.input-field {
    margin-bottom: 10px;
}

.v-radio-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    flex-direction: row;
    /* Ensures radio buttons are inline */
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
    /* Ensures it takes up full column height for alignment */
    padding-top: 20px;
    padding-left: 20px;
}

body {
    font-family: "Noto Serif KR", serif;
    margin: 0;
    padding: 0;
    background-color: #f8f8f8;
}

.container {
    display: flex;
}

.sidebar {
    border-radius: 10px;
    padding-top: 10px;
    width: 250px;
    height: 80vh;
    background-color: #ded6f4;
    padding: 20px;
    justify-self: center;
}

.sidebar h2 {
    margin-top: 0;
    font-size: 1.5em;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar li {
    margin: 10px 0;
}

.sidebar li h3 {
    margin: 0;
    font-size: 1.2em;
}

.sidebar li ul {
    padding-left: 20px;
    margin: 5px 0 0 0;
}

.sidebar li ul li {
    margin: 5px 0;
    font-size: 1em;
}

.sidebar h3 {
    border-bottom: 1px solid black;
}

.v-btn {
    margin: 0;
    font-family: "Playfair Display", serif;
    background-color: #FFFFFF;
    
    box-shadow: none !important;
  }
  
  .v-btn:hover,
  .v-btn:active {
    background: #FFFFFF;
  }
  
  .v-btn:visited {
    background: #FFFFFF;
  }

.custom-size {
    width: 200px;
    height: 60px;
    justify-content: left;
}

.sidebar>a {
    text-decoration: none;
    color: black;
}

.user-profile {
    background-color: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-profile h1 {
    border-bottom: 4px solid black;
}
.modal {
    padding: 20px;
    font-family: "Noto Serif KR", serif;
}
.cardText {
    border: 1px solid #F1F1F1; 
    padding: 18px; 
    border-radius: 8px; 
}
</style>
