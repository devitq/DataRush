import { useQuery } from "@tanstack/react-query";
import { useCompetition, useCurrentTask } from "../providers/session-provider";
import { getTaskAttachments } from "@/shared/api/session";
import { Download, File } from "lucide-react";
import { TaskAttachment } from "@/shared/types/task";

export const TaskContentAttachments = () => {
  const competition = useCompetition();
  const { task } = useCurrentTask();

  const { data: attachments, isLoading } = useQuery({
    queryKey: ["attachments", competition.id, task.id],
    queryFn: () => getTaskAttachments(competition.id, task.id),
  });

  if (!attachments || isLoading) {
    return null;
  }

  return (
    <div className="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-2">
      {attachments.map((a) => (
        <AttachmentCard key={a.id} attachment={a} />
      ))}
    </div>
  );
};

export const AttachmentCard = ({
  attachment,
}: {
  attachment: TaskAttachment;
}) => {
  const filename = attachment.file.split("/").at(-1);
  const extension = filename?.split(".").at(-1);

  return (
    <a download={filename} href={attachment.file} target="_blank">
      <div className="bg-card flex w-full items-center gap-3 rounded-md px-3 py-3 transition-transform active:scale-[0.95]">
        <File size={22} className="min-w-fit" />
        <div className="flex w-full flex-col gap-1 overflow-hidden">
          <p className="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap">
            {filename}
          </p>
          <p className="text-muted-foreground text-xs">
            {extension?.toUpperCase()}
          </p>
        </div>
        <Download className="text-muted-foreground" />
      </div>
    </a>
  );
};
