export class ListUsersQuery {
  constructor(
    public readonly project: string,
    public readonly page: number,
    public readonly q?: string,
  ) {}
}
