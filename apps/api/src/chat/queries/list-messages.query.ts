export class ListMessagesQuery {
  constructor(public readonly channel: string, public readonly page: number) {}
}
