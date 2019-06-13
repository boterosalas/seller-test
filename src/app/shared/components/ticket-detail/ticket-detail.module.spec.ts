import { TicketDetailModule } from './ticket-detail.module';

describe('TicketDetailModule', () => {
  let ticketDetailModule: TicketDetailModule;

  beforeEach(() => {
    ticketDetailModule = new TicketDetailModule();
  });

  it('should create an instance', () => {
    expect(ticketDetailModule).toBeTruthy();
  });
});
