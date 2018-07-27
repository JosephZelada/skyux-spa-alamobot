import { Headers, RequestOptionsArgs } from '@angular/http';

export const JSON_HEADERS = new Headers({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

export const JSON_REQUEST_OPTIONS: RequestOptionsArgs = {
  headers: JSON_HEADERS
};
