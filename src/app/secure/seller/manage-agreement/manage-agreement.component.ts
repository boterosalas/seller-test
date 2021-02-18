import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-agreement',
  templateUrl: './manage-agreement.component.html',
  styleUrls: ['./manage-agreement.component.scss']
})
export class ManageAgreementComponent implements OnInit {

  manageAgreementsSeller = [
    {ContractName: 'Acuerdo 1'},
    {ContractName: 'Acuerdo 2'},
    {ContractName: 'Acuerdo 3'},
    {ContractName: 'Acuerdo 4'},
    {ContractName: 'Acuerdo 5'},
    {ContractName: 'Acuerdo 6'},
    {ContractName: 'Acuerdo 7'},
    {ContractName: 'Acuerdo 8'},
    {ContractName: 'Acuerdo 9'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
