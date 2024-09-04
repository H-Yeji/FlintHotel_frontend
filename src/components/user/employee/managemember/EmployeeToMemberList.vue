<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title">Member List</v-card-title>
                        <br>
                        <v-card-text>
                            <v-row class="justify-center">
                                <v-col cols="12">
                                    <v-data-table :header="headers" :items="member" class="elevation-1"
                                        item-key="id" :style="{ maxHeight: '1000px', overflowY: 'auto' }">
                                        <template v-slot:body="{ items }">
                                            <tr v-for="mem in items" :key="mem.id">
                                                <td>{{ mem.id }}</td>
                                                <td>{{ mem.name }}</td>
                                                <td>
                                                    <router-link :to="{ name: 'EmployeeToMemberDetail', params: {id: mem.id}}">
                                                        {{ mem.email }}
                                                    </router-link>
                                                </td>
                                                <td>{{ mem.phoneNumber }}</td>
                                            </tr>
                                        </template>
                                    </v-data-table>
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
    data(){
        return{
            member:[],
            headers: [
                { text: 'Id', value: 'id', align: 'center' },
                { text: 'Name', value: 'name', align: 'center' },
                { text: 'Email', value: 'email', align: 'center' },
                { text: 'Phone Number', value: 'phoneNumber', align: 'center'}
            ],
        }
    },
    async created() {
        try {
            console.log(process.env.VUE_APP_API_BASE_URL);
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/memberlist`);

            console.log("목록: ", response.data.result);

            this.member = response.data.result
            console.log(this.member)    
        } catch(e) {
            console.log(e.message);
        }
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
    overflow-y: auto;
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

.v-card-title {
    padding: 0;
    margin: 0;
}
</style>