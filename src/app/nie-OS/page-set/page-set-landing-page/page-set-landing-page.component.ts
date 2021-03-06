import {Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Router, ActivatedRoute} from '@angular/router';
import {EditPageSetComponent} from '../edit-page-set/edit-page-set.component';
import {MongoActionService} from '../../../shared/nieOS/mongodb/action/action.service';
import { Action } from '../../../shared/nieOS/mongodb/action/action.model';
import { EditPageComponent } from '../edit-page/edit-page.component';
import { Page } from '../../../shared/nieOS/mongodb/page/page.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeletePageComponent } from '../delete-page/delete-page.component';
import { MongoPageService } from '../../../shared/nieOS/mongodb/page/page.service';

@Component({
  selector: 'app-page-set-landing-page',
  templateUrl: './page-set-landing-page.component.html',
  styleUrls: ['./page-set-landing-page.component.scss']
})
export class PageSetLandingPageComponent implements OnInit {
  name: string;
  actionID: string;
  pageSet: any;
  action: Action;
  pagesOfThisPageSet: any;
  isLoading: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogUpdatePageSet: MatDialog,
    public dialogEditPage: MatDialog,
    private route: ActivatedRoute,
    private mongoActionService: MongoActionService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.actionID = this.route.snapshot.queryParams.actionID;
    if (this.actionID) {
      this.checkIfPageSetExists(this.actionID);
    }
  }

  checkIfPageSetExists(actionID: string) {
    this.mongoActionService.getAction(actionID)
      .subscribe(data => {
        if ((data.status === 200) && (data.body.action.type === 'page-set')) {
          this.action = data.body.action;
          this.pageSet = this.action.hasPageSet;
          this.pagesOfThisPageSet = this.action.hasPageSet.hasPages;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          // Fehlermeldung: Action not found
        }
      }, error => {
        console.log(error);
        this.isLoading = false;
        // Fehlermeldung
      });
  }

  generateDescription() {
    if (this.pageSet && this.pageSet.description) {
      return this.pageSet.description;
    }
  }

  generateTitle() {
    if (this.pageSet && this.pageSet.title) {
      return this.pageSet.title;
    }
  }

  generateImage() {
    if (this.pageSet && this.pageSet.linkToImage) {
      return this.pageSet.linkToImage;
    }
  }

  addPage() {
    const dialogRef = this.dialog.open(DialogCreateNewPageComponent, {
      width: '700px',
      data: { pageset: this.pageSet }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.checkIfPageSetExists(this.actionID);
    });
  }

  editPageSet() {
    const dialogRef = this.dialogUpdatePageSet.open(EditPageSetComponent, {
      width: '700px',
      data: {
        id: this.action.hasPageSet['_id'],
        title: this.pageSet.title,
        description: this.pageSet.description,
        linkToImage: this.pageSet.linkToImage
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if ( result !== undefined ) {
        this.pageSet.title = result.title;
        this.pageSet.description = result.description;
        this.pageSet.linkToImage = result.linkToImage;
      }
    });
  }

  generateURL(page: any) {
    if ( page ) {
      return 'page?actionID=' + this.actionID + '&page=' + page._id;
    }
  }

  editPage(page: Page) {
    const dialogRef = this.dialogEditPage.open(EditPageComponent, {
      width: '600px',
      data: {
        page: page,
        pageSetID: this.pageSet['_id']
      },
      hasBackdrop: false
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        this.checkIfPageSetExists(this.actionID);
      });
  }

  deletePage(page: Page) {
    const dialogRef = this.dialogEditPage.open(DeletePageComponent, {
      width: '600px',
      data: {
        page: page,
        pageSetID: this.pageSet['_id']
      },
      hasBackdrop: false
    });
    dialogRef.afterClosed()
      .subscribe(result => {
        this.checkIfPageSetExists(this.actionID);
      });
  }
}

@Component({
  selector: 'dialog-create-new-page',
  templateUrl: './dialog-create-new-page.html',
  styleUrls: ['./dialog-create-new-page.scss']
})
export class DialogCreateNewPageComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean;
  pageSetID: any;
  newPage: Page = {
    id: undefined,
    title: '',
    description: '',
    hash: ''
  };

  constructor(public dialogRef: MatDialogRef<DialogCreateNewPageComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router,
              private route: ActivatedRoute,
              private pageService: MongoPageService) {
    this.pageSetID = data.pageset._id;
  }

  ngOnInit() {
    this.isLoading = false;
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.isLoading = true;
    this.newPage.title = this.form.get('title').value;
    this.newPage.description = this.form.get('description').value;

    this.pageService.createPage(this.pageSetID, this.newPage)
      .subscribe((result) => {
        this.isLoading = false;
        if (result.status === 201) {
          this.dialogRef.close();
        } else {
          this.dialogRef.close();
        }
      }, error => {
        this.isLoading = false;
      });
  }
}
