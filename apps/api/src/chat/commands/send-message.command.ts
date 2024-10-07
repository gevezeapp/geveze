export class SendMessageCommand {
  constructor(
    public readonly channel: string,
    public readonly message: string,
    public readonly sender: string,
  ) {}
}
