import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MongoPageService } from '../../../shared/nieOS/mongodb/page/page.service';

@Component({
  selector: 'app-delete-page',
  templateUrl: './delete-page.component.html',
  styleUrls: ['./delete-page.component.scss']
})
export class DeletePageComponent implements OnInit{
  isLoading: boolean;

  constructor(public dialogRef: MatDialogRef<DeletePageComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private pageService: MongoPageService) {}

  ngOnInit() {
    this.isLoading = false;
  }

  OnDestroy() {
    this.isLoading = false;
  }

  cancel() {
    this.dialogRef.close();
  }

  delete() {
    this.isLoading = true;
    this.pageService.deletePage(this.data.pageSetID, this.data.page._id)
      .subscribe((result) => {
        if (result.status === 200) {
          this.dialogRef.close();
        } else {
          this.dialogRef.close();
        }
      }, error => {
        this.dialogRef.close();
      });
  }
}
