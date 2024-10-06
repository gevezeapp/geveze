export class SendMessageCommand {
  constructor(
    public readonly toUser: string,
    public readonly message: string,
    public readonly sender: string,
  ) {}
}
