import { createRouter, createWebHistory } from 'vue-router';
import { isTokenExpired } from '@/jwtUtils';
import Home from '@/pages/Home.vue';
import HomeCredit from "@/pages/HomeCredit.vue";
import HomeUserRequest from "@/pages/HomeUserRequest.vue";
import BoardMain from "@/pages/community/BoardMain.vue";
import HotBoardMain from "@/pages/community/HotBoardMain.vue";
import BoardPostDetail from "@/pages/community/BoardPostDetail.vue";
import BoardPostUpdate from "@/pages/community/BoardPostUpdate.vue";
import BoardPostForm from "@/pages/community/BoardPostForm.vue";
import BoardPostQuestionSelectForm from "@/pages/community/BoardPostQuestionSelectForm.vue";
import SignInForm from "@/pages/login/SignInForm.vue";
import SignUpForm from "@/pages/login/SignUpForm.vue";
import MyBook from "@/pages/myBook/MyBook.vue";
import MyBookQuestionDetail from "@/pages/myBook/MyBookQuestionDetail.vue";
import QuestionForm from "@/pages/question/QuestionForm.vue";
import QuestionResultForm from "@/pages/question/QuestionResultForm.vue";
import QuestionResultFormExplanation from "@/pages/question/QuestionResultFormExplanation.vue";
import Ranking from "@/pages/questionRanking/Ranking.vue";
import RankingQuestionDetail from "@/pages/questionRanking/RankingQuestionDetail.vue";
import AdminMain from "@/pages/admin/AdminMain.vue";
import AdminMemberRequests from "@/pages/admin/AdminMemberRequests.vue";
import AdminMemberList from "@/pages/admin/AdminMemberList.vue";
import AdminMemberDetail from "@/pages/admin/AdminMemberDetail.vue";
import AdminMemberDetailPosts from "@/pages/admin/AdminMemberDetailPosts.vue";
import AdminMemberDetailComments from "@/pages/admin/AdminMemberDetailComments.vue";
import QuestionResultFormDemo from "@/pages/question/QuestionResultFormDemo.vue";

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

    { path: '/login', component: SignInForm },
    { path: '/signup', component: SignUpForm },

    { path: '/myBook', component: MyBook, meta: { requiresAuth: true } },
    { path: '/myBook/:qId', component: MyBookQuestionDetail, meta: { requiresAuth: true } },

    { path: '/question/demo/result', component: QuestionResultFormDemo },
    { path: '/question', component: QuestionForm, meta: { requiresAuth: true } },
    { path: '/question/result', component: QuestionResultForm, meta: { requiresAuth: true } },
    { path: '/question/explanation/result', component: QuestionResultFormExplanation, meta: { requiresAuth: true } },

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
            next('/login'); // JWT가 없으면 메인 화면으로 이동
        }
        else {
            next();
        }
    } else {
        next(); // JWT가 있으면 페이지로 이동
    }
});

export default router;
