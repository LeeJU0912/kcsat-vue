<template>
  <div>
    <div class="container font-nanum-gothic-regular">
      <div class="card mb-4">
        <div class="card-body">

          <!-- 게시글 Detail -->
          <div class="mb-3">
            <label for="title" class="form-label font-nanum-gothic-bold">제목</label>
            <div class="form-control" id="title">{{post.title}}</div>
          </div>
          <div class="mb-3">
            <label for="counter" class="form-label font-nanum-gothic-bold">조회 수</label>
            <div class="form-control" id="postViewCount">{{post.postViewCount}}</div>
          </div>
          <div class="mb-3">
            <label for="username" class="form-label font-nanum-gothic-bold">작성자</label>
            <div class="form-control" id="username">{{post.username}}</div>
          </div>
          <div class="mb-3">
            <label for="postDate" class="form-label font-nanum-gothic-bold">작성일</label>
            <div class="form-control" id="postDate">{{formatDate(post.postDate)}}</div>
          </div>
          <div class="mb-3">
            <label for="content" class="form-label font-nanum-gothic-bold">글 내용</label>
            <textarea class="form-control" id="content" v-model="post.content" style="height: 300px;"></textarea>
          </div>

          <div v-if="post.question">
            <div class="mb-3">
              <label for="question" class="form-label font-nanum-gothic-bold">문제</label>
              <div class="form-control" id="questionTitle">{{post.question.title}}</div>
            </div>
            <div class="mb-3">
              <label for="mainText" class="form-label font-nanum-gothic-bold">본문</label>
              <textarea class="form-control" id="questionMainText" v-model="post.question.mainText" rows="12"></textarea>
            </div>
            <div class="mb-3">
              <label for="choices" class="form-label font-nanum-gothic-bold">보기</label>
              <div class="form-control">
                <div v-for="choice in post.question.choices" :key="choice.qId">
                  <p>{{ choice }}</p>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="shareCounter" class="form-label font-nanum-gothic-bold">문제 공유 수</label>
              <input type="text" class="form-control" id="shareCounter" v-model="post.question.shareCounter"/>
            </div>
            <div v-if="post.email !== Username">
              <button v-if="savedQuestion" class="btn btn-success" disabled>저장 완료</button>
              <button v-else @click="saveQuestion(post.question.qid)" class="btn btn-sm btn-warning">문제 저장</button>
            </div>
          </div>

          <br>

          <small class="text-muted">좋아요: {{ postUpVote }} 싫어요: {{ postDownVote }}</small>
          <div v-if="post.email === Username">
            <router-link :to="`/board/post/${post.pid}/update`" class="btn btn-sm btn-outline-warning">게시글 수정</router-link>
            <button @click="deletePost(post.pid)" class="btn btn-sm btn-outline-danger m-2">게시글 삭제</button>
          </div>
          <div v-else>
            <button @click="upVotePost" class="btn btn-sm btn-info">추천</button>
            <button @click="downVotePost" class="btn btn-sm btn-danger m-2">비추천</button>
          </div>

          <!-- 댓글 작성 Form -->
          <div class="card my-4">
            <h5 class="card-header font-nanum-gothic-bold">댓글 작성</h5>
            <div class="card-body">
              <form @submit.prevent="submitComment">
                <textarea v-model="commentContent" class="form-control" rows="3" style="margin-bottom: 10px;"></textarea>
                <button type="submit" class="btn btn-primary">등록</button>
              </form>
            </div>
          </div>

          <!-- 댓글 목록 -->
          <div class="card my-4" v-if="post.comments">
            <h5 class="card-header font-nanum-gothic-bold">댓글</h5>
            <div class="card-body">

<!--              &lt;!&ndash; 인기 댓글 &ndash;&gt;-->
<!--              <p>인기 댓글</p>-->
<!--              <div v-for="(hotComment, index) in post.hotComments" :key="hotComment.cid">-->
<!--                <div class="media mb-4">-->
<!--                  <div class="media-body">-->
<!--                    <div class="d-flex align-items-start">-->
<!--                      <div>-->
<!--                        <h5 class="mt-0">{{ hotComment.username }}</h5>-->
<!--                        <p>{{ hotComment.content }}</p>-->
<!--                        <small class="text-muted">{{ hotComment.createdDateTime }}</small>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <div v-if="hotComment.email === Username">-->
<!--                      <button @click="deleteComment(hotComment.cid)" class="btn btn-sm btn-outline-danger">삭제</button>-->
<!--                    </div>-->

<!--                    <small class="text-muted">좋아요: {{ post.hotCommentsUpVote[index] }}</small>-->
<!--                    <div v-if="hotComment.email !== Username">-->
<!--                      <button @click="upVoteComment(hotComment.cid)" class="btn btn-sm btn-outline-info">좋아요</button>-->
<!--                    </div>-->

<!--                    <small class="text-muted">싫어요: {{ post.hotCommentsDownVote[index] }}</small>-->
<!--                    <div v-if="hotComment.email !== Username">-->
<!--                      <button @click="downVoteComment(hotComment.cid)" class="btn btn-sm btn-outline-info">싫어요</button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

              <!-- 일반 댓글 -->
              <div v-for="(comment, index) in post.comments" :key="comment.cid">
                <div class="media mb-4">
                  <div class="media-body">
                    <div class="d-flex align-items-start">
                      <div>
                        <h5 class="mt-0 font-nanum-gothic-bold">{{ comment.username }}</h5>
                        <p>{{ comment.content }}</p>
                        <small class="text-muted">{{ formatDate(comment.createdDateTime) }}</small>
                      </div>
                    </div>

                    <small class="text-muted">좋아요: {{ post.commentsUpVote[index] }} 싫어요: {{ post.commentsDownVote[index] }}</small>
                    <br>
                    <div v-if="comment.email === Username">
                      <button @click="deleteComment(comment.cid)" class="btn btn-sm btn-outline-danger">댓글 삭제</button>
                    </div>
                    <div v-else>
                      <button @click="upVoteComment(comment.cid)" class="btn btn-sm btn-info">좋아요</button>
                      <button @click="downVoteComment(comment.cid)" class="btn btn-sm btn-danger m-2">싫어요</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <router-link to="/board" class="btn btn-outline-secondary float-right">글 목록</router-link>
      </div>

      <br />
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import api from "@/api.js";
import {usePostStorage} from "@/piniaStorage/postStorage.js";
import {jwtDecode} from "jwt-decode";
import {useRoute} from "vue-router";
import router from "@/router/index.js";
import {useCommentStorage} from "@/piniaStorage/commentStorage.js";

export default {
  setup()
  {
    const Username = ref();

    if (sessionStorage.getItem("jwt")) {
      const token = sessionStorage.getItem("jwt");
      const decoded = jwtDecode(token);  // JWT 디코딩
      console.log(decoded)
      Username.value = decoded.userEmail;  // 클레임에서 userEmail 추출
    }

    const route = useRoute();
    const pid = route.params.pId;

    const postDetailStorage = usePostStorage();
    postDetailStorage.setNewPostData(pid);
    const postData = postDetailStorage.getPostData;
    const post = ref({
      pid: postData.pid,
      title: postData.title,
      content: postData.content,
      postDate: postData.postDate,
      username: postData.username,
      email: postData.email,
      questionType: postData.questionType,
      question: postData.question,
      postViewCount: postData.postViewCount,
    })

    const commentDetailStorage = useCommentStorage();
    commentDetailStorage.setNewCommentData(pid);
    const commentData = commentDetailStorage.getCommentData;
    const comments = ref({
      hotComments: commentData.hotComments,
      hotCommentsUpVote: commentData.hotCommentsUpVoteCounter,
      hotCommentsDownVote: commentData.hotCommentsDownVoteCounter,
      comments: commentData.comments,
      commentsUpVote: commentData.commentsUpVoteCounter,
      commentsDownVote: commentData.commentsDownVoteCounter
    })


    const postUpVote = ref(0);
    const postDownVote = ref(0);
    const savedQuestion = ref(false);

    const commentContent = ref("");

    const saveQuestion = async (qId) => {
      try {
        await api.post(`/community/board/post/${qId}/question`);
        savedQuestion.value = true;
      } catch (error) {
        console.log(error);
      }
    }


    const deletePost = async () => {
      try {
        const confirmed = confirm("삭제하시겠습니까?");
        if (!confirmed) {
          return
        }


        await api.delete(`/community/board/post/${pid}`);

        await router.push("/board");

      } catch (error) {
        console.log(error);
      }
    }

    const upVotePost = async () => {
      try {
        const response = await api.post(`/community/board/post/${pid}/vote/up`);
        await getNewData();

        postUpVote.value = response.data;

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }

    const downVotePost = async () => {
      try {
        const response = await api.post(`/community/board/post/${pid}/vote/down`);
        await getNewData();

        postDownVote.value = response.data;

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }

    const getUpVotePost = async () => {
      try {
        const response = await api.get(`/community/board/post/${pid}/vote/up`);
        await getNewData();

        postUpVote.value = response.data;

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }

    const getDownVotePost = async () => {
      try {
        const response = await api.get(`/community/board/post/${pid}/vote/down`);
        await getNewData();

        postDownVote.value = response.data;

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }

    async function getNewData() {
      await postDetailStorage.setNewPostData(pid);
      await commentDetailStorage.setNewCommentData(pid);
      const postData = postDetailStorage.getPostData;
      const commentData = commentDetailStorage.getCommentData;

      post.value = {
        pid: postData.pid,
        title: postData.title,
        content: postData.content,
        postDate: postData.postDate,
        username: postData.username,
        email: postData.email,
        questionType: postData.questionType,
        question: postData.question,
        postViewCount: postData.postViewCount,
      }
    }

    comments.value = {
      hotComments: commentData.hotComments,
      hotCommentsUpVote: commentData.hotCommentsUpVoteCounter,
      hotCommentsDownVote: commentData.hotCommentsDownVoteCounter,
      comments: commentData.comments,
      commentsUpVote: commentData.commentsUpVoteCounter,
      commentsDownVote: commentData.commentsDownVoteCounter
    }

    const submitComment = async () => {
      try {
        const form = {
          content: commentContent.value
        }
        await api.post(`/community/board/post/${pid}/comment`, form);

        commentContent.value = "";

        await getNewData();

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }

    const upVoteComment = async (cId) => {
      try {
        await api.post(`/community/board/comment/${cId}/vote/up`);
        await getNewData();

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }


    const downVoteComment = async (cId) => {
      try {
        await api.post(`/community/board/comment/${cId}/vote/down`);
        await getNewData();

        await router.push(`/board/post/${pid}`);

      } catch (error) {
        console.log(error);
      }
    }

    const deleteComment = async (cId) => {
      try {
        await api.delete(`/community/board/comment/${cId}`);

        await getNewData();

        await router.push(`/board/post/${pid}`);
      } catch (error) {
        console.log(error);
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR'); // 한국식 연-월-일 형식
    }

    onMounted(() => {
      getUpVotePost();
      getDownVotePost();
    })

    return {
      Username,
      post,
      postUpVote,
      postDownVote,
      savedQuestion,
      commentContent,
      upVotePost,
      downVotePost,
      upVoteComment,
      downVoteComment,
      submitComment,
      deletePost,
      deleteComment,
      saveQuestion,
      formatDate
    }
  }
};
</script>

<style scoped>
/* 스타일 정의 가능 */
</style>
