import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChannelMemberModel } from '@geveze/db';
import { MarkAsReadCommand } from '../commands/mark-as-read.command';

@CommandHandler(MarkAsReadCommand)
export class MarkAsReadHandler implements ICommandHandler<MarkAsReadCommand> {
  async execute(command: MarkAsReadCommand): Promise<{ success: boolean }> {
    await ChannelMemberModel.findOneAndUpdate(
      {
        user: command.user,
        channel: command.channel,
      },
      { unread: 0 },
    );

    return { success: true };
  }
}
