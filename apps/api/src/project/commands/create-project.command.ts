export class CreateProjectCommand {
  constructor(
    public readonly name: string,
    public readonly user: { _id: string; email: string },
  ) {}
}
