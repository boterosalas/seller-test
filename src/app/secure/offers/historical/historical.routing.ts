// 3rd party components
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// our own custom components
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { HistoricalComponent } from './historical/historical.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOferHistoricalBulkLoad}`,
        component: HistoricalComponent,
        data: {title: 'Histórico de Carga de Ofertas'},
        canActivate: [TermsService]
    }
  ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HistoricalRoutingModule {}
