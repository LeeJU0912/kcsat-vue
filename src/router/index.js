import { createRouter, createWebHistory } from 'vue-router';
import { isTokenExpired } from '@/utils/jwtUtils.js';
import Home from '@/views/home/Home.vue';
import HomeCredit from "@/views/home/HomeCredit.vue";
import HomeUserRequest from "@/views/home/HomeUserRequest.vue";
import BoardMain from "@/views/community/BoardMain.vue";
import HotBoardMain from "@/views/community/HotBoardMain.vue";
import BoardPostDetail from "@/views/community/BoardPostDetail.vue";
import BoardPostUpdate from "@/views/community/BoardPostUpdate.vue";
import BoardPostForm from "@/views/community/BoardPostForm.vue";
import BoardPostQuestionSelectForm from "@/views/community/BoardPostQuestionSelectForm.vue";
import SignIn from "@/views/auth/SignIn.vue";
import SignUp from "@/views/auth/SignUp.vue";
import MyBook from "@/views/myBook/MyBook.vue";
import MyBookQuestionDetail from "@/views/myBook/MyBookQuestionDetail.vue";
import QuestionForm from "@/views/question/QuestionForm.vue";
import QuestionResultForm from "@/views/question/QuestionResultForm.vue";
import QuestionResultFormExplanation from "@/views/question/QuestionResultFormExplanation.vue";
import Ranking from "@/views/questionRanking/Ranking.vue";
import RankingQuestionDetail from "@/views/questionRanking/RankingQuestionDetail.vue";
import AdminMain from "@/views/admin/AdminMain.vue";
import AdminMemberRequests from "@/views/admin/AdminMemberRequests.vue";
import AdminMemberList from "@/views/admin/AdminMemberList.vue";
import AdminMemberDetail from "@/views/admin/AdminMemberDetail.vue";
import AdminMemberDetailPosts from "@/views/admin/AdminMemberDetailPosts.vue";
import AdminMemberDetailComments from "@/views/admin/AdminMemberDetailComments.vue";
import QuestionResultFormDemo from "@/views/question/QuestionResultFormDemo.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/credit', component: HomeCredit },
    { path: '/giveIdea', component: HomeUserRequest, meta: { requiresAuth: true } },

    { path: '/board', component: BoardMain },
    { path: '/board/hot', component: HotBoardMain },
    { path: '/board/post/new', component: BoardPostForm, meta: { requiresAuth: true } },
    { path: '/board/post/:pId', component: BoardPostDetail, meta: { requiresAuth: true } },
    { path: '/board/post/:pId/update', component: BoardPostUpdate, meta: { requiresAuth: true } },
    { path: '/board/post/question', component: BoardPostQuestionSelectForm, meta: { requiresAuth: true } },

    { path: '/signIn', component: SignIn },
    { path: '/signUp', component: SignUp },

    { path: '/myBook', component: MyBook, meta: { requiresAuth: true } },
    { path: '/myBook/:qId', component: MyBookQuestionDetail, meta: { requiresAuth: true } },

    { path: '/question/demo/result', component: QuestionResultFormDemo },
    { path: '/question', component: QuestionForm, meta: { requiresAuth: true } },
    { path: '/question/result', component: QuestionResultForm, meta: { requiresAuth: true } },
    { path: '/explanation/result', component: QuestionResultFormExplanation, meta: { requiresAuth: true } },

    { path: '/weekly', component: Ranking },
    { path: '/weekly/:qId', component: RankingQuestionDetail, meta: { requiresAuth: true } },

    { path: '/admin', component: AdminMain, meta: { requiresAuth: true } },
    { path: '/admin/requests', component: AdminMemberRequests, meta: { requiresAuth: true } },
    { path: '/admin/members', component: AdminMemberList, meta: { requiresAuth: true } },
    { path: '/admin/members/:mId', component: AdminMemberDetail, meta: { requiresAuth: true } },
    { path: '/admin/members/:mId/posts', component: AdminMemberDetailPosts, meta: { requiresAuth: true } },
    { path: '/admin/members/:mId/comments', component: AdminMemberDetailComments, meta: { requiresAuth: true } },

    // catch-all 라우트 설정
    { path: '/:pathMatch(.*)*', redirect: '/credit' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
    const jwt = sessionStorage.getItem('jwt'); // JWT 토큰 확인

    if (to.meta.requiresAuth) {
        if (jwt === null || isTokenExpired(jwt)) {
            sessionStorage.removeItem('jwt');
            next('/auth'); // JWT가 없으면 메인 화면으로 이동
        }
        else {
            next();
        }
    } else {
        next(); // JWT가 있으면 페이지로 이동
    }
});

export default router;
