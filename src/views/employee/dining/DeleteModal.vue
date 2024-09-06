<template>
    <v-dialog v-model="dialog" max-width="400px">
        <v-card class="modal">
            <v-card-title>
                정말 삭제하시겠습니까?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn class="leftbtn" color="black" @click="confirmDelete">Yes</v-btn>
                    <v-btn @click="closeDialog" color="black">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean, // v-model을 위한 바인딩
        menuId: Number // 삭제할 메뉴 ID
    },
    computed: {
        dialog: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    methods: {
        closeDialog() {
            console.log("하이하이");
            this.$emit('input', false)
            console.log("나감");
        },
        async confirmDelete() {
            try {
                await this.$emit('delete-menu', this.menuId);
                this.closeDialog();
            } catch (error) {
                console.error('Error deleting menu:', error);
            }
        }
    }
};
</script>

<style scoped>
  .leftbtn {
    margin-right: -8px;
  }

</style>