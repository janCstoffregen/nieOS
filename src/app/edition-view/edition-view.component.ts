import {Component, OnInit} from '@angular/core';
import {KnoraRequestService} from '../shared/knora-request.service';
import {SparqlRequestService} from '../shared/sparql-request.service';
import {ResultToEditionMapperService} from './result-to-edition-mapper.service';

@Component({
  selector: 'app-edition-view',
  templateUrl: './edition-view.component.html',
  styleUrls: ['./edition-view.component.scss']
})
export class EditionViewComponent implements OnInit {

  constructor(knoraRequestService: KnoraRequestService,
              sparqlRequestService: SparqlRequestService,
              resultToEditionMapperService: ResultToEditionMapperService) {
  }

  ngOnInit() {
  }

}