export class CreateChannelCommand {
  constructor(public readonly user: string, public readonly sender: string) {}
}
