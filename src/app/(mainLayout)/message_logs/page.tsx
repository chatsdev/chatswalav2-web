import MessageLogsTable from "@/src/components/message-logs/MessageLogsTable";

const MessageLogsPage = () => {
  return (
    <div className="p-4 pt-0! sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <MessageLogsTable />
    </div>
  );
};

export default MessageLogsPage;
