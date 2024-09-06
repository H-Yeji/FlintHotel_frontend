<template>
    <v-dialog v-model="dialog" max-width="400px">
        <v-card class="mainCustom">
            <v-card-title style="text-align:center">Add Menu</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="confirmCreateMenu">
                    <v-text-field v-model="localMenuData.menuName" label="메뉴명" class="menuName" required></v-text-field>
                    <v-text-field v-model="localMenuData.cost" label="가격" class="menuPrice" :min="0" type="number" required></v-text-field>
                    <v-card-actions>
                        <v-row style="margin-left:23%;">
                            <v-btn class="submitButton" type="submit" style="width:90px; background-color: #7A6C5B;">Submit</v-btn>
                            <v-btn class="cancelButton" @click="closeDialog" style="width:90px; background-color: #7A6C5B;">Cancel</v-btn>
                        </v-row>
                    </v-card-actions>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean,
        menuData: Object
    },
    data() {
        return {
            localMenuData: { ...this.menuData }
        }
    },
    watch: {
        menuData: {
            immediate: true,
            handler(newData) {
                this.localMenuData = { ...newData }
            }
        }
    },
    computed: {
        dialog() {
            return this.value
        }
    },
    methods: {
        closeDialog() {
            this.$emit('input', false)
        },
        async confirmCreateMenu() {
            try {
                await this.$emit('create-menu', this.localMenuData)
                this.closeDialog()
            } catch (error) {
                console.error('Error creating menu:', error)
            }
        }
    }
}
</script>

<style scoped>
.mainCustom {
    font-family: "Noto Serif KR", serif;
    border-radius: 10px;
}
.menuName{
    font-size: 14px;
}

.menuPrice{
    font-size: 14px;
}

.submitButton{
    background-color: grey;
    color: white;
}

.cancelButton{
    background-color: grey;
    color: white
}
</style>
