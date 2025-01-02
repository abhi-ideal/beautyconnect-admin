import moment from 'moment';
const userBaseUrl: any = `${process.env.NEXT_PUBLIC_USER_API}`;
const feedBaseUrl: any = `${process.env.NEXT_PUBLIC_FEED_API}`;
const commonBaseUrl: any = `${process.env.NEXT_PUBLIC_COMMON_API}`;
const ContentHost: any = `${process.env.NEXT_PUBLIC_CONENTHOST}`;
const authBaseUrl: any = `${process.env.NEXT_PUBLIC_AUTH_API}`;
const courseHost :any= `${process.env.NEXT_PUBLIC_COURSE_API}`

const routes = {
  USER_LIST: (params: any) =>
    `${userBaseUrl}admin/users?${
      params?.LFT !== "" ? `lft=${params?.LFT}&` : ""}${
      params?.name !== "" ? `name=${params?.name}&` : ""}${
      params?.email !== "" ? `email=${params?.email}&` : ""}${
      params?.userId !== "" ? `id=${params?.userId}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""
    }${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  FOLLOWER_LIST: (params: any, type:string) =>
    `${userBaseUrl}${type}?${
      params?.name !== "" ? `name=${params?.name}&` : ""
    }${params?.email !== "" ? `email=${params?.email}&` : ""}${
      params?.userId !== "" ? `id=${params?.userId}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""
    }${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  COURSE_LIST: (params: any) => 
      `${courseHost}admin/courses?${
        params?.title !== "" ? `title=${params?.title}&` : ""}${
        params?.description !== "" ? `description=${params?.description}&` : ""}${
        !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
        params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
        params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
        params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
        params?.direction !== "" ? `orderType=${params?.direction}&` : ""
      }offset=${params?.offset}&limit=${params?.limit}`,
  
  CHAPTER_LIST: (params: any) =>
      `${courseHost}admin-chapters?${
        params?.lessonId !== "" ? `lessonId=${params?.lessonId}&` : ""}${
        params?.title !== "" ? `title=${params?.title}&` : ""}${
        !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
        params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
        params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
        params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
        params?.direction !== "" ? `orderType=${params?.direction}&` : ""
      }offset=${params?.offset}&limit=${params?.limit}`,

  LESSON_LIST: (params: any) =>
      `${courseHost}admin-lessons?${
        params?.courseId !== "" ? `courseId=${params?.courseId}&` : ""}${
        params?.title !== "" ? `title=${params?.title}&` : ""}${
        !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
        params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
        params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
        params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
        params?.direction !== "" ? `orderType=${params?.direction}&` : ""
      }offset=${params?.offset}&limit=${params?.limit}`,
  
  POST_LIST: (params: any) =>
    `${feedBaseUrl}admin/feed?${
      params?.search !== "" ? `search=${params?.search}&` : ""}${
      params?.title !== "" ? `title=${params?.title}&` : ""}${
      params?.description !== "" ? `description=${params?.description}&` : ""}${
      params?.userId !== "" ? `id=${params?.userId}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
      }offset=${params?.offset}&limit=${params?.limit}`,
  USER_REPORT_LIST:(params:any)=>
    `${userBaseUrl}users/report?${
      params?.reportedBy !== "" ? `reportedBy=${params?.reportedBy}&` : ""}${
        params?.reportedTo !== "" ? `reportedTo=${params?.reportedTo}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  FEED_REPORT_LIST:(params:any)=>
    `${feedBaseUrl}feeds-report?${
      params?.name !== "" ? `name=${params?.name}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  COURSE_REPORT_LIST:(params:any)=>
      `${courseHost}report-list?${
        params?.name !== "" ? `name=${params?.name}&` : ""}${
        !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""}${
        params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
        params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
        params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""}${
        params?.direction !== "" ? `orderType=${params?.direction}&` : ""
      }offset=${params?.offset}&limit=${params?.limit}`,
  EMPLOYER_LIST : (params: any) =>
    `${userBaseUrl}employeeList?${
      params?.name !== "" ? `name=${params?.name}&` : ""
    }${params?.email !== "" ? `email=${params?.email}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""
    }${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  SKILL_LIST: (params: any) =>
    `${commonBaseUrl}admin/skills/?${
      params?.title !== "" ? `title=${params?.title}&` : ""
    }${params?.description !== "" ? `description=${params?.description}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""
    }${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  CATEGORY_LIST: (params: any) =>
    `${commonBaseUrl}admin/category?${
      params?.title !== "" ? `title=${params?.title}&` : ""
    }${params?.type !== "" ? `type=${params?.type}&` : ""}${
      params?.description !== "" ? `description=${params?.description}&` : ""}${
      !(params?.status == "" || params?.status == " ") ? `status=${params?.status}&` : ""
    }${
      params?.from !== "" ? `fromDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
      params?.to !== "" ? `toDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${
      params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${
      params?.direction !== "" ? `orderType=${params?.direction}&` : ""
    }offset=${params?.offset}&limit=${params?.limit}`,
  COURSECONTENTLIST: (params: any) => 
    `${courseHost}courseContent/${params?.id}?offset=${params?.offset}&limit=${params?.limit}`,
  USERGRAPG: (params: any)=>`${userBaseUrl}users-graph?${
    params?.from !== "" ? `startDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${
    params?.to !== "" ? `endDate=${moment(params?.to).format('YYYY-MM-DD')}` : ""
  }`,
  COMMENT_LIST:(params:any)=>
    `${feedBaseUrl}feed/${params?.id}/comment?offset=${params?.offset}&limit=${params?.limit}`,
  CHILD_COMMENT_LIST:(params:any)=>
    `${feedBaseUrl}feed/${params?.id}/comment?parentId=${params?.commentId}?offset=${params?.offset}&limit=${params?.limit}`,
  DASHBOARD: () => `${userBaseUrl}dashboard`,
  CATEGORY:() => `${commonBaseUrl}category`,
  USER_UPDATE: () => `${userBaseUrl}profile/`,
  USER_DETAIL: (id: any) => `${userBaseUrl}profile/${id}`,
  USER_DELETE: (id: any) => `${userBaseUrl}account-delete/${id}`,
  CONTENT: (id: string) => `content_pages/${id}`,
  CHAPTER_DETAIL:(id:string,chapterId:string)=>`${courseHost}lesson/${id}/chapter/${chapterId}`,
  LESSON_DETAIL:()=>`${courseHost}lesson-detail/`,
  ADMIN_PROFILE: () => `${userBaseUrl}profile`,
  UPDATE_PROFILE: () => `${userBaseUrl}profile`,
  USER_REPORT:(id:any)=>`${userBaseUrl}users/report/${id}`,
  FEED_REPORT:(id:any)=>`${feedBaseUrl}feeds/report/${id}`,
  COURSE_REPORT_DETAIL:(id:any)=>`${courseHost}report-detail/${id}`,
  COURSE_REPORT_DELETE:(id:any)=>`${courseHost}report-delete/${id}`,
  IMAGE_URL:() => `${commonBaseUrl}uploadUrl`,
  GET_CONTENT: (id:string) => `${ContentHost}content_pages/dev/${id}.json`,
  INVALIDATE_CACHE: () => `${commonBaseUrl}content-invalid`,
  ADMIN_LOGIN:() => `${authBaseUrl}admin-login`,
  ADMIN_LOGOUT:() => `${authBaseUrl}logout`,
  CHANGE_PASSWORD:() => `${authBaseUrl}change-password/`,
  FORGOT_PASSWORD:() => `${authBaseUrl}change-password/`,
  CONFIRM_PASSWORD:() => `${authBaseUrl}forgot-password/confirm-code/`,
  SKILL:()=>`${commonBaseUrl}skills`,
  SKILL_DELETE:(id:any)=>`${userBaseUrl}skills`,
  SKILL_UPDATE:(id:any)=>`${userBaseUrl}skills`,
  POST:(id:any)=>`${feedBaseUrl}feed/${id}`,
  POST_DETAIL:(id:any)=>`${feedBaseUrl}feed/${id}`,
  COURSE:(id:any)=>`${courseHost}course/${id}`,
  SIGN_URL:(id:any)=>`${commonBaseUrl}getSignUrl?url=${id}`,
  COURSECONTENTDETAIL:(param:any)=>`${courseHost}courseContent/${param?.id}?contentId=${param?.contentId}`,
  FLAGGED_REASONS:()=>`${ContentHost}base/dev/base.json`
};

export default routes;
