<template>
    <div>
        <EmployeeView />
        <v-container class="content-container">
            <v-row>
                <v-col cols="12" class="d-flex justify-center">
                    <v-card class="confirmation-card" style="width:1100px">
                        <v-card-title class="confirmation-title"> Employee List </v-card-title>

                        <v-card-text class="cardText">
                            <!-- 검색 바 추가 -->
                            <v-row class="searchrow d-flex justify-space-between">
                                <v-col cols="12" md="4" class="d-flex justify-start" style="margin-left:-30px;">
                                    <v-btn @click="createEmployee" color="#7A6C5B" style="font-size: 14px;" elevation="0" outlined>Add
                                        Employee</v-btn>
                                </v-col>

                                <v-col cols="12" md="2" class="emailcol" style="margin-top:-7px;">
                                    <v-select v-model="searchType" :items="searchOptions" item-title="text"
                                        item-value="value" dense hide-details class="d-flex justify-end formCustom">
                                    </v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="emailcol">
                                    <v-text-field v-model="searchValue" class="modSearch" label="검색어 입력" dense
                                        hide-details>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                    <v-btn @click="applySearch" style="background-color:#DCC8B0; color:white;"
                                        elevation="0" outlined>Search</v-btn>
                                </v-col>
                            </v-row>
                            <br>
                            <v-row class="justify-center">
                                <v-col cols="12">
                                    <!-- 데이터 테이블 표시 -->
                                    <v-data-table
                                        class="elevation-1"
                                        :items="filteredEmployees"
                                        :items-per-page="itemsPerPage"
                                        :server-items-length="totalItems"
                                        hide-default-footer
                                    >
                                        <thead>
                                            <tr>
                                                <th style="text-align: center;">Employee Number</th>
                                                <th style="text-align: center;">Email</th>
                                                <th style="text-align: center;">Name</th>
                                                <th style="text-align: center;">
                                                    <select id="departmentSelect" @change="onDepartmentChange"
                                                        style="width: 100%; text-align: center;">
                                                        <option value="">Department</option>
                                                        <option v-for="department in departments" :key="department.id"
                                                            :value="department.name">
                                                            {{ department.name }}
                                                        </option>
                                                    </select>
                                                </th>
                                                <th style="text-align: center;">Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="text-center" v-for="emp in filteredEmployees"
                                                :key="emp.id">
                                                <td>{{ emp.employeeNumber }}</td>
                                                <td>{{ emp.email }}</td>
                                                <td>{{ emp.firstName + " " + emp.lastName }}</td>
                                                <td>{{ emp.department }}</td>
                                                <td>
                                                    <v-btn
                                                        style="background-color:white; color:#7A6C5B; border: 1px solid #7A6C5B; margin-top:4px; font-size: 14px;"
                                                        :to="{ path: './office/manage', query: { id: emp.id } }">Detail
                                                    </v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-data-table>
                                    <!-- 페이지 넘김 버튼 -->
                                    <div class="pagination-buttons">
                                        <v-btn
                                            :disabled="currentPage === 1"
                                            @click="previousPage"
                                            color="primary"
                                            style="font-size: 14px;"
                                            outlined
                                        >
                                            이전 페이지
                                        </v-btn>
                                        <v-btn
                                            :disabled="currentPage === totalPages"
                                            @click="nextPage"
                                            color="primary"
                                            style="font-size: 14px;"
                                            outlined
                                        >
                                            다음 페이지
                                        </v-btn>
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
import { ref, computed, onMounted } from 'vue'
import EmployeeView from '@/views/EmployeeView.vue'
import axios from '@/axios'
import { useRouter } from 'vue-router'

export default {
    components: {
        EmployeeView
    },
    setup() {
        const employee = ref([])
        const searchType = ref('')
        const searchValue = ref('')
        const searchOptions = [
            { text: '선택', value: '' },
            { text: '직원 번호', value: 'employeeNumber' },
            { text: '부서', value: 'department' },
            { text: '이메일', value: 'email' },
        ]
        const selectedDepartment = ref('')
        const currentPage = ref(1)
        const itemsPerPage = ref(10)
        const totalItems = ref(0)
        const totalPages = ref(0)
        const router = useRouter()
        const isSearchActivated = ref(false) // 검색 버튼이 눌렸는지 여부

        // 검색을 위해 적용된 조건을 별도로 저장
        const activeSearchType = ref('')
        const activeSearchValue = ref('')
        const activeDepartment = ref('')

        const filteredEmployees = computed(() => {
            let result = employee.value

            if (isSearchActivated.value && activeSearchType.value && activeSearchValue.value) {
                result = result.filter(emp => {
                    const field = emp[activeSearchType.value] ? emp[activeSearchType.value].toString().toLowerCase() : ''
                    return field.includes(activeSearchValue.value.toLowerCase())
                })
            }

            if (isSearchActivated.value && activeDepartment.value) {
                result = result.filter(emp => emp.department === activeDepartment.value)
            }

            return result
        })

        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`/employee/list`, {
                    params: {
                        page: currentPage.value - 1,
                        size: itemsPerPage.value
                    }
                })
                employee.value = response.data.result.content
                totalItems.value = response.data.result.totalElements
                totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value)
                console.log("Fetched employees:", employee.value)
                console.log("Total items:", totalItems.value)
            } catch (error) {
                console.error('Error fetching employees:', error)
            }
        }

        const applySearch = () => {
            // 검색 버튼이 눌렸을 때만 검색 조건을 업데이트
            isSearchActivated.value = true
            activeSearchType.value = searchType.value
            activeSearchValue.value = searchValue.value
            activeDepartment.value = selectedDepartment.value
            currentPage.value = 1
            fetchEmployees()
        }

        const previousPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--
                fetchEmployees()
            }
        }

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++
                fetchEmployees()
            }
        }

        const onDepartmentChange = (event) => {
            selectedDepartment.value = event.target.value
        }

        const createEmployee = () => {
            router.push('/employee/create')
        }

        onMounted(() => {
            fetchEmployees() // 초기 로딩 시 1페이지의 데이터를 가져옴
        })

        return {
            employee,
            searchType,
            searchValue,
            searchOptions,
            selectedDepartment,
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
            filteredEmployees,
            fetchEmployees,
            applySearch,
            previousPage,
            nextPage,
            onDepartmentChange,
            createEmployee,
            isSearchActivated
        }
    }
}
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

.search-type {
    max-width: 133px;
    font-size: 0.5rem;
    line-height: 1.25rem;
}

.confirmation-title {
    font-size: 20px;
    font-weight: bold;
    color: #787878;
    text-align: left;
    border-bottom: 3px solid #787878;
    font-family: "Noto Serif KR", serif;
}

.cardText {
    margin-top: 20px;
}

.formCustom {
    margin-left: 20%;
    margin-bottom: 8px;
}

.modSearch {
    margin-top: -10px;
}

.tableCustom {
    padding-left: 2%;
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

.pagination-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.emailcol {
    margin-right: -20px;
}
</style>