import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
})
export class AppNavComponent {
  public nav = [
    {
      titleKey: 'app_nav_home',
      path: '/'
    },
    {
      titleKey: 'app_nav_bought_films',
      path: '/bought-films'
    },
    {
      titleKey: 'app_nav_market',
      path: '/market'
    },
    {
      titleKey: 'app_nav_alerts',
      path: '/alerts'
    }
  ];
}
