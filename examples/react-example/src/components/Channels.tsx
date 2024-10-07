import { useChannels } from "@geveze/react";
import React from "react";
import Avatar from "react-avatar";

function Channels({
  onSelectChannel,
}: {
  onSelectChannel: (channel: string) => void;
}) {
  const { data } = useChannels();

  return (
    <div className="border-r w-[300px] flex flex-col">
      <div className="overflow-auto grow">
        {data?.pages?.map((page, index) => (
          <React.Fragment key={index}>
            {page.channels.map((item) => (
              <button
                key={item._id}
                className="relative w-full flex items-center gap-4 hover:bg-slate-50 p-4"
                onClick={() => onSelectChannel(item._id)}
              >
                <div className="relative shrink-0">
                  <Avatar size={"50"} round name={item.user.displayName} />
                  <div className="absolute border border-white w-3 h-3 inline-block bg-green-500 rounded-full bottom-0 left-9"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.user.displayName}</span>
                  <span className="font-thin text-sm">
                    {item.lastMessage?.message}
                  </span>
                </div>
                {item.unread > 0 && (
                  <div className="absolute w-4 h-4 flex items-center justify-center bg-cyan-600 top-1/2 right-4 rounded-full -translate-y-1/2">
                    <span className="text-xs text-white">{item.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Channels;
