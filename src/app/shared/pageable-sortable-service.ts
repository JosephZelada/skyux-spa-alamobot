import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { ListDataRequestModel } from '@blackbaud/skyux/dist/modules/list';
import { EntityPage } from '../details/entity-page';

@Injectable()
export class PageableSortableService {
  constructor(private httpClient: HttpClient) {
  }

  public getEntityList(request: ListDataRequestModel, serviceUrl: string): Observable<EntityPage> {
    let sortOrder;
    let sortColumn;
    if (request.sort.fieldSelectors.length === 0) {
      sortOrder = 'desc';
      sortColumn = 'watched';
    } else {
      sortOrder = request.sort.fieldSelectors[0].descending ? 'desc' : 'asc';
      sortColumn = request.sort.fieldSelectors[0].fieldSelector;
    }
    let params: { [key: string]: string } = {
      sort_by: sortColumn,
      order_by: sortOrder,
      page_number: request.pageNumber.toString(),
      page_size: request.pageSize.toString(),
      search_term: request.search.searchText
    };
    let queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
    return this.httpClient.get(serviceUrl + '?' + queryString);
  }
}
