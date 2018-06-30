/* 3rd party libraries */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Title } from '@angular/platform-browser';

/* our own custom components */
import { environment } from '../environments/environment';
import { Logger, LogLevel } from './core/utilities/logger.service';


// log component
const log = new Logger('App');

/**
 * Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})

export class AppComponent implements OnInit {

  /**
   * Creates an instance of AppComponent.
   * @param {Router} router
   * @param {Title} titleService
   * @param {ActivatedRoute} activatedRoute
   * @member AppComponent
   */
  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) { }

  /**
   *  ngOnInit
   */
  ngOnInit() {

    // Aplicó el logger, el logger se habilita de acuerdo a una variable configurada en el environment
    if (environment.production) {
      Logger.enableProductionMode(LogLevel.Error);
    }

    log.debug('init AppComponent');

    // Cambio del título de la página al navegar.
    const onNavigationEnd = this.router.events.filter(event => {
      return event instanceof NavigationEnd;
    });

    // Change page title on navigation or language change, based on route data
    Observable.merge(onNavigationEnd)
      .map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(title);
        }
      });
  }
}
