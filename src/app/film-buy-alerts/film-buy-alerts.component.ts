import { Component } from '@angular/core';
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from '@blackbaud/skyux/dist/modules/list';
import { Observable } from "rxjs/Observable";
import { ListItemModel } from '@blackbaud/skyux/dist/modules/list/state';
import { AlamobotConstants } from '../details/alamobot-constants';
import { AlertService } from '../service/alert-service';
import { FilmBuyAlert } from '../details/film-buy-alert';
import { SkyModalDemoContext } from '@blackbaud/skyux/dist/demos/modal/modal-demo-context';
import { SkyModalCloseArgs, SkyModalService } from '@blackbaud/skyux/dist/modules/modal';
import { FilmBuyAlertsModalComponent } from './film-buy-alerts-modal.component';

export class FilmBuyAlertListProvider extends ListDataProvider {
  public failedToLoadAlerts: boolean = false;
  public currentFilmCount: number = 0;

  constructor(private alertService: AlertService) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getFilmBuyAlertList();
  }

  public count(): Observable<number> {
    return Observable.of(this.currentFilmCount);
  }

  private buildListItem(result: any) {
    let filmBuyAlertListItems: Array<ListItemModel>;
    let filmBuyAlerts: FilmBuyAlert[] = new Array<FilmBuyAlert>();
    filmBuyAlerts = Object.assign(filmBuyAlerts, result);
    filmBuyAlertListItems = filmBuyAlerts.map((x: FilmBuyAlert) => new ListItemModel(x.id, x));
    this.currentFilmCount = filmBuyAlertListItems.length;

    return Observable.of(new ListDataResponseModel({
      count: filmBuyAlertListItems.length,
      items: filmBuyAlertListItems
    }));
  }

  private getFilmBuyAlertList(): Observable<ListDataResponseModel> {
    return this.alertService.getFilmBuyAlertList()
      .map((res: FilmBuyAlert[]) => {
        this.failedToLoadAlerts = false;
        return res;
      })
      .flatMap(this.buildListItem)
      .catch((err) => {
        this.failedToLoadAlerts = true;
        return Observable.throw(err);
      });
  }
}

@Component({
  selector: 'film-buy-alerts',
  templateUrl: './film-buy-alerts.component.html',
  providers: [AlertService]
})
export class FilmBuyAlertsComponent {
  public listDataProvider: FilmBuyAlertListProvider;
  public alamobotConstants = new AlamobotConstants();

  constructor(private alertService: AlertService, private modal: SkyModalService) {
    this.listDataProvider = new FilmBuyAlertListProvider(this.alertService);
  }

  public openModal(type: string) {
    const context = new SkyModalDemoContext();
    context.valueA = 'Hello';

    const options: any = {
      providers: [{ provide: SkyModalDemoContext, useValue: context }],
      ariaDescribedBy: 'docs-modal-content'
    };

    let modalInstanceType = FilmBuyAlertsModalComponent;

    const modalInstance = this.modal.open(modalInstanceType, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      console.log(`Modal closed with reason: ${result.reason} and data: ${result.data}`);
    });

    modalInstance.helpOpened.subscribe((helpKey: string) => {
      context.eventMessage =  `
        Modal header help was invoked with the following help key: ${helpKey}
      `;
    });
  }

  public deleteAlert(filmBuyAlert: FilmBuyAlert) {
    console.log(filmBuyAlert)
    this.alertService.deleteAlert(filmBuyAlert.id)
  }
}
