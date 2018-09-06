export class ModelFilter {
  constructor(
    public dateInitial?: Date,
    public dateFinal?: Date,
    public ean?: string,
    public currentPage?: number,
    public limit?: number
  ) { }
}
