import { TicketModalModule } from './ticket-modal.module';

describe('TicketModalModule', () => {
  let ticketModalModule: TicketModalModule;

  beforeEach(() => {
    ticketModalModule = new TicketModalModule();
  });

  it('should create an instance', () => {
    expect(ticketModalModule).toBeTruthy();
  });
});
