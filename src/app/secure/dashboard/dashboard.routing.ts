import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { NgModule } from '@angular/core';
import { environment } from '@env/environment';
import { DashboardComponent } from '@app/secure/dashboard/dashboard.component';
import { RoutesConst } from '@app/shared';
import { TermsService } from '../seller/agreement/terms/terms.component.service';
import { AuthService } from '../auth/auth.routing';

const isProductionEnv = environment.production;
const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterIntDashboard}`,
            canActivate: [TermsService, AuthService],
            component: DashboardComponent,
            data: { title: 'Dashboard' },
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class DashboardRoutingModule { }
