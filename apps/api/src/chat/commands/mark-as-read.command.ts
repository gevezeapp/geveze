export class MarkAsReadCommand {
  constructor(public readonly channel: string, public readonly user: string) {}
}
