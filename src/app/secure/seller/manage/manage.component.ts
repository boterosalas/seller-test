import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    parameters: any;
    chargueView = false;

    constructor(
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(data => {
            if (data && data.id) {
                this.parameters = { IdSeller: data.id };
            }
            this.chargueView = true;
        });
    }
}
