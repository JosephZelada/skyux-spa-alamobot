import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { EntityPage } from '../details/entity-page';
import { ListDataRequestModel } from "@skyux/list-builder";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class PageableSortableService {
  constructor(public httpClient: HttpClient) {
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
    return this.httpClient.get(serviceUrl + '?' + queryString).pipe(
      map((response: HttpResponse<EntityPage>) =>
        {
          return response.body;
        }
      )
    );
  }
}
