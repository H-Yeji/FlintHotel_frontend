<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title">Member Detail</v-card-title>
                        <br>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <!-- 왼쪽 열 -->
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">First Name</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="firstName"
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Last Name</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="lastName"
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Email</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="email"
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>                               
                                </v-col>
                                <!-- 오른쪽 열 -->
                                <v-col cols="12" md="6">
                                    
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Phone Num</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="phoneNumber"
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Nation</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="nation" 
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <div class="data-label">Birthday</div>
                                        </v-col>
                                        <v-col cols="12" md="9">
                                            <v-text-field v-model="birthday"
                                                readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
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
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            nation: "",
            birthday: ""
        };
    },
    created() {
        const memberId = this.$route.params.id;
        console.log("Id: ", memberId);
        this.fetchRoomReserveId(memberId);
    },
    methods: {
        async fetchRoomReserveId(memberId) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/member/detail/${memberId}`);
                const memberDetail = response.data.result;

                this.firstName = memberDetail.firstName
                this.lastName = memberDetail.lastName
                this.email = memberDetail.email
                this.phoneNumber = memberDetail.phoneNumber
                this.nation = memberDetail.nation
                this.birthday = memberDetail.birthday

            } catch(e) {
                if (e.response) {
                    console.error("Error Status:", e.response.status);  
                    console.error("Error Data:", e.response.data); 
                    alert(e.response.data.error_message);
                } else {
                    console.error("Error Message:", e.message);
                }
            
            }
        },
    }
};
</script>

<style scoped>
.content-container {
    background-color: white;
    position: absolute;
    width: 90%;
    max-width: 1200px;
    height: 80%;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    overflow-y: auto;
    flex-direction: column;
    padding-left: 40px;
    padding-right: 40px;
}

.confirmation-card {
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-family: "Noto Serif KR", serif;
    height: auto;
    border: none;
    box-shadow: none;
}

.confirmation-title {
    font-size: 20px;
    font-weight: bold;
    color: #787878;
    text-align: left;
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