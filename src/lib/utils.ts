import { StorageKeys } from "@/types/CorporateExamTypes";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const FormatExamTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};


export const formatTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const formatStudentExamTime = (time: string) => {
    if (!time) return "";

    const [hour, minute] = time.split(":").map(Number);

    if (isNaN(hour) || isNaN(minute)) return "";

    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
};

export const getStorageKeys = (examSlug: string): StorageKeys => ({
  selectedSection: `exam_${examSlug}_selected_section`,
  attemptIds: `exam_${examSlug}_attempt_ids`,
  answers: `exam_${examSlug}_answers`,
  currentPage: `exam_${examSlug}_current_page`,
  tabSwitchCount: `exam_${examSlug}_tab_switch_count`,
  submittedSections: `exam_${examSlug}_submitted_sections`,
})

export const getTimerKeys = (examSlug: string) => ({
  endTime: `exam_end_time_${examSlug}`,
  timeUp: `exam_time_up_${examSlug}`,
})
