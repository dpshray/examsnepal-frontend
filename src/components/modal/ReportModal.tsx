"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReportForumContent } from "@/hooks/use-forum";
import SelectInputField from "../fields/SelectInput";

const REPORT_REASONS = [
  { value: "Spam", label: "Spam" },
  { value: "Abusive or harassing", label: "Abusive or harassing" },
  { value: "Inappropriate content", label: "Inappropriate content" },
  { value: "Off topic", label: "Off topic" },
  { value: "Other", label: "Other" },
];

const reportSchema = z
  .object({
    report_type: z.string().min(1, "Please select a reason"),
    reason: z.string().optional(),
  })
  .refine((data) => data.report_type !== "other" || !!data.reason?.trim(), {
    message: "Please describe the issue",
    path: ["reason"],
  });

type ReportFormValues = z.infer<typeof reportSchema>;

type ReportModalProps =
  | { forumQuestionId: number; forumAnswerId?: never }
  | { forumQuestionId: number; forumAnswerId: number };

export default function ReportModal(props: ReportModalProps) {
  const { forumQuestionId, forumAnswerId } = props as {
    forumQuestionId?: number;
    forumAnswerId?: number;
  };

  const {
    mutate: reportContent,
    isPending,
    isSuccess,
    reset: resetMutation,
  } = useReportForumContent();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { report_type: "", reason: "" },
  });

  const reportType = watch("report_type");

  // Close dialog + reset form after a successful submit
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      reset();
      resetMutation();
    }
  }, [isSuccess, reset, resetMutation]);

  const onSubmit = (values: ReportFormValues) => {
    reportContent({
      report_type: values.report_type,
      reason: values.reason?.trim() || undefined,
      forum_question_id: forumQuestionId,
      forum_answer_id: forumAnswerId,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-500 hover:text-red-600"
        >
          <Flag className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Flag className="h-5 w-5 text-red-500" />
            Report {forumAnswerId ? "Answer" : "Question"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 py-2"
        >
          <Controller
            name="report_type"
            control={control}
            render={({ field }) => (
              <SelectInputField
                label="Reason"
                placeholder="Select a reason"
                name="report_type"
                required
                options={REPORT_REASONS}
                value={field.value}
                onChangeAction={field.onChange}
                error={errors.report_type?.message}
              />
            )}
          />

          <div className="space-y-2">
            <Label>
              Additional details
              {reportType === "other" && (
                <span className="text-red-500"> *</span>
              )}
            </Label>
            <Textarea
              placeholder="Add any extra context (optional)"
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reporting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
