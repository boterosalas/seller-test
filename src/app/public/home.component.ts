import {Component, OnInit} from '@angular/core';

declare let AWS: any;
declare let AWSCognito: any;

@Component({
    selector: 'app-awscognito',
    template: '<p>Bienvenido</p>'
})
export class AboutComponent {

}

@Component({
    selector: 'app-awscognito',
    templateUrl: './landinghome.html'
})
export class HomeLandingComponent {
    constructor() {
    }
}

@Component({
    selector: 'app-awscognito',
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {

    }
}


