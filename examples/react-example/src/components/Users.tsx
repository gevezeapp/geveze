import { useCreateChannel, useUsers } from "@geveze/react";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";

function Users({
  onSelectChannel,
}: {
  onSelectChannel: (channel: string) => void;
}) {
  const { data, refetch } = useUsers();
  const { mutate } = useCreateChannel();
  const [interval, setInter] = useState<number>();

  useEffect(() => {
    setInter(
      setInterval(() => {
        refetch();
      }, 5000)
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-l w-[300px] flex flex-col ">
      <div className="overflow-auto grow">
        {data?.pages?.map((page, index) => (
          <React.Fragment key={index}>
            {page.users.map((item) => (
              <button
                className="w-full flex items-center gap-4 hover:bg-slate-50 p-4"
                key={item.id}
                onClick={() => {
                  mutate(
                    { user: item.id },
                    {
                      onSuccess: (data) => {
                        onSelectChannel(data._id);
                      },
                    }
                  );
                }}
              >
                <Avatar size={"50"} round name={item.displayName} />
                <span className="font-medium">{item.displayName}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Users;
