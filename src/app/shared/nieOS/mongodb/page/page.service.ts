import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MongoPageService {
  private static API_BASE_URL_PAGE = 'http://localhost:3000/api/pages';
  private static API_BASE_URL_PAGE_SET = 'http://localhost:3000/api/pagesets';
  private static API_BASE_URL_QUERY = 'http://localhost:3000/api/queries';

  constructor(
    private http: HttpClient
  ) {}

  createPage(pageSetID: string, page: any): Observable<any> {
    return this.http.post(`${MongoPageService.API_BASE_URL_PAGE_SET}/${pageSetID}/pages`, page);
  }

  getPage(pageId: string): Observable<any> {
    return this.http.get(`${MongoPageService.API_BASE_URL_PAGE}/${pageId}`);
  }

  updatePage(page: any): Observable<any> {
    console.log(page);
    const openAppAsStringArray = [];
    for (const openApp in page.openApps) {
      openAppAsStringArray[ openAppAsStringArray.length ] = JSON.stringify(page.openApps[openApp]);
    }
    const mappingsAsStringArray = [];
    for (const mapping in page.appInputQueryMapping) {
      page.appInputQueryMapping[mapping][ 'app' ] = mapping;
      mappingsAsStringArray[ mappingsAsStringArray.length ] = JSON.stringify(page.appInputQueryMapping[mapping]);
    }
    page.appInputQueryMapping = mappingsAsStringArray;
    page.openApps = openAppAsStringArray;
    console.log( page );
    return this.http.put(`${MongoPageService.API_BASE_URL_PAGE}/${page._id}`, page);
  }

  updatePageOfPageSet(pageSetID: string, page: any): Observable<any> {
    return this.http.put(`${MongoPageService.API_BASE_URL_PAGE_SET}/${pageSetID}/pages/${page.id}`, page, {observe: 'response'});
  }

  deletePage(pageSetID: string, pageID: string): Observable<any> {
    return this.http.delete(`${MongoPageService.API_BASE_URL_PAGE_SET}/${pageSetID}/pages/${pageID}`, {observe: 'response'});
  }

  createQuery(pageId: string, query: any): Observable<any> {
    return this.http.post(`${MongoPageService.API_BASE_URL_PAGE}/${pageId}/queries`, query, {observe: 'response'});
  }

  getQuery(queryId: string): Observable<any> {
    return this.http.get(`${MongoPageService.API_BASE_URL_QUERY}/${queryId}`);
  }

  getAllQueries(pageId: string): Observable<any> {
    return this.http.get(`${MongoPageService.API_BASE_URL_PAGE}/${pageId}/queries`);
  }

  updateQuery(pageId: string, queryId: string, query: any): Observable<any> {
    return this.http.put(`${MongoPageService.API_BASE_URL_PAGE}/${pageId}/queries/${queryId}`, query, {observe: 'response'});
  }

  deleteQuery(pageId: string, queryId: string): Observable<any> {
    return this.http.delete(`${MongoPageService.API_BASE_URL_PAGE}/${pageId}/queries/${queryId}`, {observe: 'response'});
  }
}
