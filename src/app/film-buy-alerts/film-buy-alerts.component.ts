import { Component } from '@angular/core';
import { AlamobotConstants } from '../details/alamobot-constants';
import { AlertService } from '../service/alert-service';
import { FilmBuyAlert } from '../details/film-buy-alert';
import { FilmBuyAlertsModalComponent } from './film-buy-alerts-modal.component';
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from "@skyux/list-builder";
import { Observable, of } from "rxjs";
import { ListItemModel } from "@skyux/list-builder-common";
import { SkyModalCloseArgs, SkyModalService } from "@skyux/modals";

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
    return of(this.currentFilmCount);
  }

  private buildListItem(result: any) {
    let filmBuyAlertListItems: Array<ListItemModel>;
    let filmBuyAlerts: FilmBuyAlert[] = new Array<FilmBuyAlert>();
    filmBuyAlerts = Object.assign(filmBuyAlerts, result);
    filmBuyAlertListItems = filmBuyAlerts.map((x: FilmBuyAlert) => new ListItemModel(x.id, x));
    this.currentFilmCount = filmBuyAlertListItems.length;

    return of(new ListDataResponseModel({
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
      .catch((err: any) => {
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

    const options: any = {
      ariaDescribedBy: 'docs-modal-content'
    };

    let modalInstanceType = FilmBuyAlertsModalComponent;

    const modalInstance = this.modal.open(modalInstanceType, options);

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      console.log(`Modal closed with reason: ${result.reason} and data: ${result.data}`);
    });

    modalInstance.helpOpened.subscribe((helpKey: string) => {
      console.log(`
        Modal header help was invoked with the following help key: ${helpKey}
      `);
    });
  }
}
