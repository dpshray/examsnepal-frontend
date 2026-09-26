import HttpServices from "@/services/ExamService/http.service";

export interface LifecycleBanner {
  key: string;
  tone: "info" | "promo" | "warning";
  title: string;
  body: string;
  cta_label: string;
  cta_path: string;
}

export interface OnboardingStatus {
  needs_onboarding: boolean;
  exam_type_id: number | null;
  exam_locked: boolean;
  target_exam_date: string | null;
  exam_types: { id: number; name: string }[];
  next_path: string;
}

class MarketingService extends HttpServices {
  getOnboarding = async (): Promise<OnboardingStatus> => {
    const response = await this.getRequest({ url: "student/onboarding", config: { auth: true } });
    return response?.data?.data;
  };

  saveOnboarding = async (data: { exam_type_id?: number; exam_month?: string | null; not_sure?: boolean; skip?: boolean }): Promise<{ next_path: string }> => {
    const response = await this.postRequest({ url: "student/onboarding", data, config: { auth: true } });
    return response?.data?.data;
  };

  /** Banner chosen by the student's lifecycle stage (null = none). */
  getBanner = async (): Promise<LifecycleBanner | null> => {
    const response = await this.getRequest({ url: "student/marketing/banner", config: { auth: true } });
    return response?.data?.data?.banner ?? null;
  };
}

const marketingService = new MarketingService();
export default marketingService;
