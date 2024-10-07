import {
  useChannel,
  useGeveze,
  useMessages,
  useSendMessage,
} from "@geveze/react";
import Avatar from "react-avatar";
import React, { useState } from "react";

function Chat({ channel }: { channel: string }) {
  const [value, setValue] = useState("");

  const { user } = useGeveze();

  const { data, isLoading } = useChannel(channel);

  const { data: messages } = useMessages(channel);

  const { mutate } = useSendMessage();

  return (
    <div className="grow flex flex-col justify-between">
      {!isLoading && (
        <>
          <div className="p-4 flex items-center gap-4 border-b">
            <div className="relative">
              <Avatar size={"50"} round name={data.user.displayName} />
              <div className="absolute border border-white w-3 h-3 inline-block bg-green-500 rounded-full bottom-0 left-9"></div>
            </div>
            <span className="font-medium">{data.user.displayName}</span>
          </div>
          <div className="grow flex-col-reverse flex p-4 gap-4 overflow-auto">
            {messages?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.messages.map((message) => (
                  <div
                    className={
                      message.sender.id == user.id
                        ? "flex flex-col items-end"
                        : "flex flex-col items-start"
                    }
                    key={message._id}
                  >
                    <div className="grow bg-slate-100 w-max-[70%] p-4 rounded">
                      {message.message}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate({ channel: data._id, message: value });
            }}
          >
            <textarea
              value={value}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  mutate({ channel: data._id, message: value });
                  setValue("");
                }
              }}
              onChange={(e) => setValue(e.target.value)}
              className="border-t w-full outline-none resize-none p-4"
              placeholder="Message..."
            ></textarea>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;
