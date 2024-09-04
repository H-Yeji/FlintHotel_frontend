<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title"> Dining Reservation Info </v-card-title>
                        <v-card-text>
                            <v-row class="justify-end searchrow">
                                <v-col cols="12" md="6">
                                    <v-row>
                                        <v-col cols="12" md="2" class="emailcol">
                                            <div class="data-label">Email</div>
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field class="tf" v-model="email"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" class="search">
                                            <v-btn @click="searchMember()" style="color: white; font-size: 14px;"
                                                color="#7A6C5B">Search</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row class="justify-center">
                                <v-col cols="12">
                                    <div class="table-container">
                                        <v-data-table :header="headers" :items="diningReservations" class="elevation-1"
                                            item-key="id" :style="{ maxHeight: '1000px', overflowY: 'auto' }">
                                            <template v-slot:body="{ items }">  
                                                <tr v-for="dr in items" :key="dr.id">
                                                    <td>{{ dr.diningReservationId }}</td>
                                                    <td>{{ formatDate(dr.reservationDate) }}</td>
                                                    <td>{{ formatTime(dr.reservationTime) }}</td>
                                                    <td>
                                                        <v-btn @click="diningDetail(dr.diningReservationId)"
                                                            style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; font-size: 14px;">Detail</v-btn>
                                                    </td>
                                                </tr>
                                            </template>
                                        </v-data-table>
                                    </div>
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
import axios from '@/axios';

export default {
    components: {
        EmployeeView
    },
    data() {
        return {
            email: "",
            diningReservations: [],
            headers: [
                { text: 'Id', value: 'diningReservationId', align: 'center' },
                { text: 'Reserve Date', value: 'reservationDate', align: 'center' },
                { text: 'Reserve Time', value: 'reservationTime', align: 'center' },
            ],
            isLoading: false,
        };
    },
    methods: {
        async diningDetail(diningReservationId) {
            this.$router.push({
                path: `/employee/dining/detail/${diningReservationId}`
            });
        },
        async searchMember() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/dining/reserve`, {
                    params: {
                        email: this.email,
                    },
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });

                this.diningReservations = response.data.result;
            } catch (e) {
                alert(e.response.data.error_message)
            }
        },
        formatDate(dateString) {
            const dateOptions = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            };
            return new Date(dateString).toLocaleDateString(undefined, dateOptions);
        },
        formatTime(dateString) {
            const timeOptions = {
                hour: "2-digit",
                minute: "2-digit",
            };
            return new Date(dateString).toLocaleTimeString(undefined, timeOptions);
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
    flex-direction: column;
    padding-left: 40px;
    padding-right: 40px;
    overflow-y: auto;
}

.custom-title {
    padding-left: 9%;
    font-family: "Noto Serif KR", serif;
    color: #787878;
    text-align: left;
    border-bottom: 3px solid;
}

.confirmation-card {
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-family: "Noto Serif KR", serif;
    height: 100%;
    box-shadow: none;
    display: flex;
    flex-direction: column;
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

.table-container {
    max-height: 1000px;
}

.tf {
    margin-right: -20px;
    padding-top: 20px;
}

.search {
    padding-top: 40px;
}

.searchrow {
    margin-right: -20px;
    margin-bottom: -40px;
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
    padding-top: 40px;
}

.emailcol {
    margin-right: -20px;
}
</style>