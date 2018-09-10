export class ModelFilter {
  constructor(
    public dateInitial?: string,
    public dateFinal?: string,
    public ean?: string,
    public currentPage?: number,
    public limit?: number
  ) { }
}
