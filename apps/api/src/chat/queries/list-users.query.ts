export class ListUsersQuery {
  constructor(
    public readonly project: string,
    public readonly page: number,
    public readonly user: string,
    public readonly q?: string,
  ) {}
}
