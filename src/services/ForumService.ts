import HttpService from "@/services/ExamService/http.service";

class ForumService extends HttpService {
  addForumQuestion = async (data: any) => {
    try {
      const response = await this.postRequest({
        url: `/student/addquestion`,
        data,
        config: {
          auth: true,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  getAllForumQuestions = async (page: number = 1) => {
    try {
      const response = await this.getRequest({
        url: `/student/questions?page=${page}`,
        config: {
          auth: true,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  deleteOwnForumQuestion = async (id: number) => {
    try {
      const response = await this.deleteRequest({
        url: `/student/questions/${id}`,
        config: {
          auth: true,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };
  editOwnForumQuestion = async (id: number, data: any) => {
    try {
      const response = await this.putRequest({
        url: `/student/questions/edit/${id}`,
        data,
        config: {
          auth: true,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  addReply = async (data: any) => {
    try {
      const response = await this.postRequest({
        url: `/student/answers`,
        data,
        config: {
          auth: true,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  getForumQuestionById = async (id: number) => {
    try {
      const response = await this.getRequest({
        url: `/student/questions/answer/${id}`,
        config: {
          auth: true,
        },
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  reportForumQuestion = async (
    report_type: string,
    forum_question_id?: number,
    forum_answer_id?: number,
    reason?: string,
  ) => {
    const response = await this.postRequest({
      url: "/forum-report",
      data: {
        forum_question_id,
        forum_answer_id,
        report_type,
        reason,
      },
      config: {
        auth: true,
      },
    });
    return response?.data;
  };

  deleteFormReply = async (id: number) => {
    const response = await this.deleteRequest({
      url: `/forum-answer-delete/${id}`,
      config: {
        auth: true,
      },
    });
    return response?.data;
  };

  getBlockedUsers = async () => {
    const response = await this.getRequest({
      url: "/user/blocked",
      config: {
        auth: true,
      },
    });
    return response?.data;
  };

  blockUser = async (id: number) => {
    const response = await this.postRequest({
      url: "/user/block",
      data: {
        blocked_id: id,
      },
      config: {
        auth: true,
      },
    });
    return response?.data;
  };

  unblockUser = async (id: number) => {
    const response = await this.deleteRequest({
      url: `/user/unblock/${id}`,
      config: {
        auth: true,
      },
    });
    return response?.data;
  };
}

const forumService = new ForumService();
export default forumService;
