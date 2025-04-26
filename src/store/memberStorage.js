import { defineStore } from 'pinia';

export const useMemberStorage = defineStore('member', {
    state: () => ({
        memberData: null,
    }),
    actions: {
        setMemberData(data) {
            this.memberData = data;
        },
        clearMemberData() {
            this.memberData = null;
        }
    },
    getters: {
        getMemberData: (state) => state.memberData,
    },
    persist: true,
});