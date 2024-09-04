<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title"> QnA List </v-card-title>
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
                                            <v-btn @click="searchMember" style="color: white; font-size: 15px;" color="#7A6C5B">Search</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <br>
                            <v-row class="justify-center">
                                <v-col cols="12">
                                    <v-data-table 
                                        class="elevation-1" 
                                        :headers="headers" 
                                        :items="qnaList" 
                                        item-key="id"
                                        :items-per-page="pageSize"
                                        hide-default-footer>
                                        <!-- 데이터 테이블의 본문 내용 -->
                                        <template v-slot:body="{ items }">
                                            <tr v-for="q in items" :key="q.id">
                                                <td>{{ q.id }}</td>
                                                <td>{{ q.title }}</td>
                                                <td>{{ q.memberEmail }}</td>
                                                <td>{{ formatDate(q.writeTime) }}</td>
                                                <td>
                                                    <v-btn @click="diningDetail(q.id)"
                                                        style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; font-size: 15px;">
                                                        Detail
                                                    </v-btn>
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                    <v-row class="pagination-buttons justify-center">
                                        <v-btn
                                            :disabled="currentPage === 1"
                                            @click="previousPage"
                                            color="#7A6C5B"
                                            style="font-size: 15px;"
                                            outlined>
                                            이전 페이지
                                        </v-btn>
                                        <v-btn
                                            :disabled="currentPage >= totalPages"
                                            @click="nextPage"
                                            color="#7A6C5B"
                                            style="font-size: 15px;"
                                            outlined>
                                            다음 페이지
                                        </v-btn>
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
import axios from '@/axios';

export default {
    components: {
        EmployeeView
    },
    data() {
        return {
            email: "",
            qnaList: [], // QnA 목록
            headers: [
                { text: 'Id', value: 'id' },
                { text: 'Title', value: 'title' },
                { text: 'Email', value: 'memberEmail' },
                { text: 'Write Time', value: 'writeTime' },
                { text: 'Detail', value: 'detail' }
            ],
            pageSize: 10, // 페이지당 항목 수
            currentPage: 1, // 현재 페이지 번호
            totalPages: 0, // 전체 페이지 수
            isLoading: false, // 데이터 로딩 중 여부
        };
    },
    methods: {
        async searchMember() {
            // 검색 실행 시 현재 페이지를 첫 페이지로 리셋
            this.currentPage = 1;
            this.loadQnA(); // 검색 조건을 포함하여 데이터 로딩
        },
        async diningDetail(id) {
            // QnA 상세 페이지로 이동
            this.$router.push({
                path: `/employee/qna/detail/${id}`
            });
        },
        async loadQnA() {
            try {
                // 로딩 중 상태라면 중복 호출 방지
                if (this.isLoading) return;

                this.isLoading = true; // 로딩 상태 시작

                const params = {
                    size: this.pageSize, // 페이지당 항목 수
                    page: this.currentPage - 1, // 현재 페이지 (서버는 0부터 시작)
                    email: this.email // 이메일 필터링 추가
                };

                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/employee/qna/list`, { params });
                const responseData = response.data.result || {};

                // QnA 데이터 및 전체 페이지 수 갱신
                this.qnaList = responseData.content || [];
                this.totalPages = responseData.totalPages || 0;

                this.isLoading = false; // 로딩 상태 종료

            } catch (e) {
                console.error(e.message);
                this.isLoading = false; // 오류 발생 시에도 로딩 상태 종료
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        previousPage() {
            // 이전 페이지로 이동
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadQnA();
            }
        },
        nextPage() {
            // 다음 페이지로 이동
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadQnA();
            }
        }
    },
    created() {
        this.loadQnA(); // 컴포넌트 생성 시 초기 데이터 로딩
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
    padding-left: 20px;
}

.emailcol {
    margin-right: -20px;
}

.pagination-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
