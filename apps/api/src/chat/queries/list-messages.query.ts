export class ListMessagesQuery {
  constructor(
    public readonly channel: string,
    public readonly user: string,
    public readonly page: number,
  ) {}
}
