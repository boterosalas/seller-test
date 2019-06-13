import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { NgModule } from '@angular/core';

import { TicketDetailComponent } from '@app/shared/components/ticket-detail/ticket-detail.component';

import { RoutesConst } from '@app/shared';

import { AuthService } from '../auth/auth.routing';

const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterTickets}`,
            component:  TicketDetailComponent,
            data: { title: 'Administrar Tickets' },
            // canActivate: [AuthService]
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class SellerSupportRoutingModule { }
