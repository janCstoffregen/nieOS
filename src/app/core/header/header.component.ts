import {Component, OnInit, OnDestroy, Inject, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../shared/nieOS/fake-backend/auth/authentication.service';
import {ActionService} from '../../shared/nieOS/fake-backend/action/action.service';
import {PageService} from '../../nie-OS/apps/page/page.service';
import {AuthService} from '../../shared/nieOS/mongodb/auth/auth.service';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {InitService} from '../init-popup/service/init.service';
import {InitPopupComponent} from '../init-popup/init-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewChecked {

  currentRoute: string;
  viewsOfThisActtion: Array<any>;
  hashOfThisView: string;
  actionID: string;
  lastView: any;
  nextView: any;
  foundHashOfThisView: boolean;
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(
    private initService: InitService,
    private router: Router,
    private dialog: MatDialog,
    private dialog2: MatDialog,
    private activatedRoute: ActivatedRoute,
    private actionService: ActionService,
    private viewService: PageService,
    private authenticationService: AuthenticationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
      router.events.subscribe(( route: any ) => {
        this.updateCurrentRoute( route );
      } );
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.hashOfThisView = params.view;
      this.actionID = params.actionID;
      this.generateNavigation(params.actionID);
    });
  }

  ngOnInit() {
    if (this.initService.isAppLaunchingFirstTime()) {
        setTimeout(() => {
            this.dialog2.open(InitPopupComponent, {
                data: {}
            });
        }, 1000);
    }
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(
        isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        }
      );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  produceCurrentViewDescription() {
    if ( this.viewsOfThisActtion ) {
      for ( const view of this.viewsOfThisActtion ) {
        if ( view ) {
          if ( view.hash === this.hashOfThisView ) {
            return view.description;
          }
        }
      }
    }
  }

  produceCurrentViewTitle() {
    if ( this.viewsOfThisActtion ) {
      for (const view of this.viewsOfThisActtion) {
        if ( view ) {
          if (view.hash === this.hashOfThisView) {
            return view.title;
          }
        }
      }
    }
  }

  generateNavigation( actionID: number ) {
    console.log('Get action by id, then iterate through views');
    console.log( actionID );
    this.actionService.getById( actionID )
      .subscribe(
        data => {
          console.log(data);
          for ( const viewHash of ( data as any ).hasViews as any ) {
            console.log( viewHash );
            this.viewsOfThisActtion = [];
            this.viewService.getById( viewHash )
              .subscribe(
                view => {
                  this.viewsOfThisActtion[
                    this.viewsOfThisActtion.length
                    ] = view;
                  if ( this.hashOfThisView ) {
                    this.produceHashOfLastView();
                    this.produceHashOfNextView();
                  }
                  console.log( view );
                },
                errorGetView => {
                  console.log(errorGetView);
                }
              );
          }
        },
        error => {
          console.log(error);
        });
  }

  produceHashOfNextView() {
    this.nextView = undefined;
    for ( const view of this.viewsOfThisActtion ) {
      if ( view ) {
        if ( this.foundHashOfThisView ) {
          this.nextView = view;
          this.foundHashOfThisView = false;
        }
        if ( view.hash === this.hashOfThisView ) {
          this.foundHashOfThisView = true;
        }
      }
    }
  }

  navigateToOtherView( view: any) {
    console.log('Navigate to last View');
    this.router.navigate( [ 'page' ], {
      queryParams: {
        'actionID': this.actionID,
        'view': view.hash
      }
    } );
    return 'test';
  }

  produceHashOfLastView() {
    this.lastView = undefined;
    for ( const view of this.viewsOfThisActtion ) {
      if ( view ) {
        if ( view.hash === this.hashOfThisView ) {
          return null;
        } else {
          this.lastView = view;
        }
      }
    }
  }

  produceRightArrowTooltip() {
    if ( this.nextView ) {
      return 'go to ' + this.nextView.title;
    }
  }

  produceLeftArrowTooltip() {
    if ( this.lastView ) {
      return 'go to ' + this.lastView.title;
    }
  }

  updateCurrentRoute( route: any ) {
    this.currentRoute = route.url;
  }

  generateLeftHeaderString(): string {
    return (
      this.routeMapping( 'dashboard', 'nieOS - Dashboard' ) ||
      this.routeMapping( 'home', 'nieOS' ) ||
      this.routeMapping( 'page', 'nieOS - Page' ) ||
      this.routeMapping( '', 'nieOS' )
    );
  }

  generateLoginOrSettingsButton(): string {
    return(
      this.routeMapping( 'dashboard', 'Logout' ) ||
      this.routeMapping( 'page', 'Einstellungen' )
    );
  }

  generateFunctionsHomeLink(): string {
    return(
      this.routeMapping( 'dashboard', '' ) ||
      this.routeMapping( 'home', 'Funktionen' )
    );
  }

  generateLeftHeaderStringLink() {
    return(
      this.routeMapping( 'dashboard', 'dashboard#top' ) ||
      this.routeMapping( 'home', 'home#top' ) ||
      this.routeMapping( 'page', 'dashboard#top' ) ||
      this.routeMapping( 'page-set', 'dashboard#top' ) ||
      this.routeMapping( '', 'home#top' )
    );
  }

  isAuthenticated(): boolean {
      return this.userIsAuthenticated;
  }

  isOnDashboard(): boolean {
      return (this.currentRoute && this.currentRoute.search( 'dash') === 1);
  }

  routeMapping( location: string, output: string ): string {
    if ( this.currentRoute && this.currentRoute.search( location ) !== -1 ) {
      return output;
    }
  }

  loginOrLogoutButton(): string {
    return this.userIsAuthenticated ? 'Logout' : 'Login';
  }

  loginOrLogout() {
    if (this.userIsAuthenticated) {
      this.authService.logout();
      this.router.navigate(["/"]);
    } else {
        this.router.navigate(['home'], { fragment: 'login' });
        console.log('login');
    }
  }

  openSettingsDialog() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.authService.getUser(userId).subscribe((result) => {
        console.log(result);
        this.dialog.open(DialogUserSettingsDialog, {
          width: '600px',
          height: '450px',
          data: {
            userId: userId,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            email: result.user.email,
            newsletter: result.user.newsletter
          }
        });
      }, (error) => {
        console.log(error);
      });
    } else {
      console.log('Userid was not found in storage');
    }
  }
}

@Component({
    selector: 'dialog-user-settings-dialog',
    templateUrl: './dialog-user-settings-dialog.html',
    styleUrls: ['./dialog-user-settings-dialog.scss']
})

export class DialogUserSettingsDialog implements OnInit {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    newsletter: boolean;
    oldPwd: string;
    newPwd1: string;
    newPwd2: string;

    constructor(public dialogRef: MatDialogRef<DialogUserSettingsDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private authService: AuthService) {
    }

    ngOnInit() {
      this.userId = this.data.userId;
      this.firstName = this.data.firstName;
      this.lastName = this.data.lastName;
      this.email = this.data.email;
      this.newsletter = (this.data.newsletter == null) ? true : this.data.newsletter;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(form: NgForm) {
      this.authService.updateUser(this.firstName, this.lastName, this.email, this.newsletter, this.userId)
        .subscribe((result) => {
          console.log(result);
          this.dialogRef.close();
        });
    }

    changePwd() {
      console.log(`Old password: ${this.oldPwd} | New password: ${this.newPwd1} | Repeat new password: ${this.newPwd2}`);
    }

}
